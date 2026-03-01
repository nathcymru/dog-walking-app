import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';

abstract class WalkRepository {
  Future<Result<WalkEntity>> startWalk({String? slotId});
  Future<Result<WalkEntity>> endWalk({
    required String walkId,
    required List<GpsPointEntity> points,
    required int durationSeconds,
  });
  Future<Result<WalkEntity>> getWalk(String walkId);
}
