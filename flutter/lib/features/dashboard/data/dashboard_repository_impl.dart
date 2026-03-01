import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/network_failure_mapper.dart';
import 'package:dog_walking_app/features/dashboard/data/dashboard_api.dart';
import 'package:dog_walking_app/features/dashboard/domain/dashboard_repository.dart';
import 'package:dog_walking_app/features/dashboard/domain/dashboard_stats_entity.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  DashboardRepositoryImpl(this._api);
  final DashboardApi _api;

  @override
  Future<Result<DashboardStatsEntity>> getStats(String role) async {
    try {
      final data = role == 'admin'
          ? await _api.getAdminStats()
          : await _api.getClientStats();
      return Success(
        DashboardStatsEntity(
          totalClients: (data['totalClients'] as num?)?.toInt() ?? 0,
          totalPets: (data['totalPets'] as num?)?.toInt() ?? 0,
          bookingsThisMonth: (data['bookingsThisMonth'] as num?)?.toInt() ?? 0,
          incidentsThisMonth:
              (data['incidentsThisMonth'] as num?)?.toInt() ?? 0,
        ),
      );
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }
}
