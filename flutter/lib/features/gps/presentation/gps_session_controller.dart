import 'dart:async';
import 'dart:convert';

import 'package:dog_walking_app/features/gps/data/gps_service.dart';
import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';

final gpsServiceProvider = Provider<GpsService>((ref) {
  final service = GpsService();
  ref.onDispose(service.dispose);
  return service;
});

final gpsSessionControllerProvider =
    AsyncNotifierProvider<GpsSessionController, List<GpsPointEntity>>(
  GpsSessionController.new,
);

/// Manages an active GPS tracking session.
/// Points are persisted to Hive so they survive app restart.
class GpsSessionController extends AsyncNotifier<List<GpsPointEntity>> {
  static const _boxName = 'gps_session';
  static const _pointsKey = 'points';

  StreamSubscription<GpsPointEntity>? _sub;

  @override
  Future<List<GpsPointEntity>> build() async {
    ref.onDispose(_sub?.cancel);
    // Restore points from Hive on startup (survives app restart)
    final box = Hive.box(_boxName);
    final raw = box.get(_pointsKey) as String?;
    if (raw != null) {
      try {
        final list = (jsonDecode(raw) as List)
            .cast<Map<String, dynamic>>()
            .map(GpsPointEntity.fromJson)
            .toList();
        return list;
      } catch (_) {
        return [];
      }
    }
    return [];
  }

  Future<void> startSession() async {
    final gpsService = ref.read(gpsServiceProvider);
    final granted = await gpsService.requestPermission();
    if (!granted) {
      throw Exception('Location permission not granted');
    }
    await gpsService.start();
    _sub = gpsService.stream.listen(_onPoint);
  }

  void _onPoint(GpsPointEntity point) {
    final current = state.valueOrNull ?? [];
    final updated = [...current, point];
    state = AsyncData(updated);
    // Persist to Hive
    final box = Hive.box(_boxName);
    box.put(_pointsKey, jsonEncode(updated.map((p) => p.toJson()).toList()));
  }

  Future<List<GpsPointEntity>> stopSession() async {
    await _sub?.cancel();
    _sub = null;
    await ref.read(gpsServiceProvider).stop();
    final points = state.valueOrNull ?? [];
    // Clear persisted session
    final box = Hive.box(_boxName);
    await box.delete(_pointsKey);
    state = const AsyncData([]);
    return points;
  }
}
