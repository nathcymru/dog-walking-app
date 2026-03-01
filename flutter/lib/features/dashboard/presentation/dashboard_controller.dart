import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/providers.dart';
import 'package:dog_walking_app/features/auth/presentation/auth_controller.dart';
import 'package:dog_walking_app/features/dashboard/data/dashboard_api.dart';
import 'package:dog_walking_app/features/dashboard/data/dashboard_repository_impl.dart';
import 'package:dog_walking_app/features/dashboard/domain/dashboard_repository.dart';
import 'package:dog_walking_app/features/dashboard/domain/dashboard_stats_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final dashboardApiProvider = Provider<DashboardApi>(
  (ref) => DashboardApi(ref.watch(dioProvider)),
);

final dashboardRepositoryProvider = Provider<DashboardRepository>(
  (ref) => DashboardRepositoryImpl(ref.watch(dashboardApiProvider)),
);

final dashboardControllerProvider =
    AsyncNotifierProvider<DashboardController, DashboardStatsEntity?>(
  DashboardController.new,
);

class DashboardController extends AsyncNotifier<DashboardStatsEntity?> {
  @override
  Future<DashboardStatsEntity?> build() async {
    final user = ref.watch(authControllerProvider).valueOrNull;
    if (user == null) return null;
    return _fetch(user.role);
  }

  Future<DashboardStatsEntity?> _fetch(String role) async {
    final result = await ref.read(dashboardRepositoryProvider).getStats(role);
    return switch (result) {
      Success(:final value) => value,
      Err(:final failure) => throw failure,
    };
  }

  Future<void> refresh() async {
    final user = ref.read(authControllerProvider).valueOrNull;
    if (user == null) return;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _fetch(user.role));
  }
}
