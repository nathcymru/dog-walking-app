import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/network_failure_mapper.dart';
import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:dog_walking_app/features/walks/data/walk_api.dart';
import 'package:dog_walking_app/features/walks/data/walk_dto.dart';
import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';
import 'package:dog_walking_app/features/walks/domain/walk_repository.dart';

class WalkRepositoryImpl implements WalkRepository {
  WalkRepositoryImpl(this._api);
  final WalkApi _api;

  @override
  Future<Result<WalkEntity>> startWalk({String? slotId}) async {
    try {
      final dto = await _api.startWalk(slotId: slotId);
      return Success(_mapWalk(dto));
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Result<WalkEntity>> endWalk({
    required String walkId,
    required List<GpsPointEntity> points,
    required int durationSeconds,
  }) async {
    try {
      final dto = await _api.endWalk(
        walkId: walkId,
        points: points,
        durationSeconds: durationSeconds,
      );
      return Success(_mapWalk(dto));
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Result<WalkEntity>> getWalk(String walkId) async {
    try {
      final dto = await _api.getWalk(walkId);
      return Success(_mapWalk(dto));
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }

  WalkEntity _mapWalk(WalkDto dto) => WalkEntity(
        id: dto.id,
        status: dto.status,
        startedAt: DateTime.parse(dto.startedAt),
        endedAt: dto.endedAt != null ? DateTime.parse(dto.endedAt!) : null,
        durationSeconds: dto.durationSeconds,
        points: dto.points
            .map(
              (p) => GpsPointEntity(
                lat: p.lat,
                lng: p.lng,
                timestamp: DateTime.parse(p.timestamp),
                accuracy: p.accuracy,
                speed: p.speed,
              ),
            )
            .toList(),
      );
}
