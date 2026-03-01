import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/features/dashboard/domain/dashboard_stats_entity.dart';

abstract class DashboardRepository {
  Future<Result<DashboardStatsEntity>> getStats(String role);
}
