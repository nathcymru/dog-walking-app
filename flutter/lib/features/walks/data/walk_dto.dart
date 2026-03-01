import 'package:json_annotation/json_annotation.dart';

part 'walk_dto.g.dart';

@JsonSerializable()
class GpsPointDto {
  const GpsPointDto({
    required this.lat,
    required this.lng,
    required this.timestamp,
    required this.accuracy,
    this.speed,
  });

  final double lat;
  final double lng;
  final String timestamp;
  final double accuracy;
  final double? speed;

  factory GpsPointDto.fromJson(Map<String, dynamic> json) =>
      _$GpsPointDtoFromJson(json);

  Map<String, dynamic> toJson() => _$GpsPointDtoToJson(this);
}

@JsonSerializable()
class WalkDto {
  const WalkDto({
    required this.id,
    required this.status,
    required this.startedAt,
    this.endedAt,
    this.durationSeconds,
    this.points = const [],
  });

  final String id;
  final String status;
  @JsonKey(name: 'started_at')
  final String startedAt;
  @JsonKey(name: 'ended_at')
  final String? endedAt;
  @JsonKey(name: 'duration_seconds')
  final int? durationSeconds;
  final List<GpsPointDto> points;

  factory WalkDto.fromJson(Map<String, dynamic> json) =>
      _$WalkDtoFromJson(json);

  Map<String, dynamic> toJson() => _$WalkDtoToJson(this);
}
