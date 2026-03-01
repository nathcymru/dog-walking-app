import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';

class WalkEntity {
  const WalkEntity({
    required this.id,
    required this.status,
    required this.startedAt,
    this.endedAt,
    this.durationSeconds,
    this.points = const [],
  });

  final String id;
  final String status; // 'active' | 'completed'
  final DateTime startedAt;
  final DateTime? endedAt;
  final int? durationSeconds;
  final List<GpsPointEntity> points;
}
