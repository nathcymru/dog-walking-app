import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/providers.dart';
import 'package:dog_walking_app/features/gps/presentation/gps_session_controller.dart';
import 'package:dog_walking_app/features/photos/presentation/photo_controller.dart';
import 'package:dog_walking_app/features/walks/data/walk_api.dart';
import 'package:dog_walking_app/features/walks/data/walk_repository_impl.dart';
import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';
import 'package:dog_walking_app/features/walks/domain/walk_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

final walkApiProvider = Provider<WalkApi>(
  (ref) => WalkApi(ref.watch(dioProvider)),
);

final walkRepositoryProvider = Provider<WalkRepository>(
  (ref) => WalkRepositoryImpl(ref.watch(walkApiProvider)),
);

final activeWalkControllerProvider =
    AsyncNotifierProvider<ActiveWalkController, WalkEntity?>(
  ActiveWalkController.new,
);

class ActiveWalkController extends AsyncNotifier<WalkEntity?> {
  static const _boxName = 'walk_cache';
  static const _activeWalkKey = 'active_walk_id';

  DateTime? _startTime;

  @override
  Future<WalkEntity?> build() async {
    // Restore any active walk from cache
    final box = Hive.box(_boxName);
    final walkId = box.get(_activeWalkKey) as String?;
    if (walkId != null) {
      final result = await ref.read(walkRepositoryProvider).getWalk(walkId);
      return switch (result) {
        Success(:final value) when value.status == 'active' => value,
        _ => null,
      };
    }
    return null;
  }

  Future<void> startWalk({String? slotId}) async {
    state = const AsyncLoading();
    final result =
        await ref.read(walkRepositoryProvider).startWalk(slotId: slotId);
    switch (result) {
      case Success(:final value):
        _startTime = DateTime.now();
        // Persist walk ID
        final box = Hive.box(_boxName);
        await box.put(_activeWalkKey, value.id);
        // Start GPS session
        await ref.read(gpsSessionControllerProvider.notifier).startSession();
        state = AsyncData(value);
      case Err(:final failure):
        state = AsyncError(failure, StackTrace.current);
    }
  }

  Future<void> endWalk() async {
    final currentWalk = state.valueOrNull;
    if (currentWalk == null) return;

    state = const AsyncLoading();

    // Stop GPS and collect points
    final points =
        await ref.read(gpsSessionControllerProvider.notifier).stopSession();

    final durationSeconds = _startTime != null
        ? DateTime.now().difference(_startTime!).inSeconds
        : 0;

    final result = await ref.read(walkRepositoryProvider).endWalk(
          walkId: currentWalk.id,
          points: points,
          durationSeconds: durationSeconds,
        );

    switch (result) {
      case Success(:final value):
        // Clear cached walk ID
        final box = Hive.box(_boxName);
        await box.delete(_activeWalkKey);
        _startTime = null;
        // Trigger sync for pending photos
        await ref.read(photoControllerProvider.notifier).syncPendingPhotos();
        state = AsyncData(value);
      case Err(:final failure):
        state = AsyncError(failure, StackTrace.current);
    }
  }

  Future<void> capturePhoto() async {
    final walk = state.valueOrNull;
    if (walk == null) return;
    final points = ref.read(gpsSessionControllerProvider).valueOrNull ?? [];
    await ref.read(photoControllerProvider.notifier).captureAndUpload(
          walkId: walk.id,
          gpsPointIndex: points.isNotEmpty ? points.length - 1 : null,
        );
  }
}
