// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'walk_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GpsPointDto _$GpsPointDtoFromJson(Map<String, dynamic> json) => GpsPointDto(
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      timestamp: json['timestamp'] as String,
      accuracy: (json['accuracy'] as num).toDouble(),
      speed: (json['speed'] as num?)?.toDouble(),
    );

Map<String, dynamic> _$GpsPointDtoToJson(GpsPointDto instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
      'timestamp': instance.timestamp,
      'accuracy': instance.accuracy,
      'speed': instance.speed,
    };

WalkDto _$WalkDtoFromJson(Map<String, dynamic> json) => WalkDto(
      id: json['id'] as String,
      status: json['status'] as String,
      startedAt: json['started_at'] as String,
      endedAt: json['ended_at'] as String?,
      durationSeconds: (json['duration_seconds'] as num?)?.toInt(),
      points: (json['points'] as List<dynamic>?)
              ?.map((e) => GpsPointDto.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$WalkDtoToJson(WalkDto instance) => <String, dynamic>{
      'id': instance.id,
      'status': instance.status,
      'started_at': instance.startedAt,
      'ended_at': instance.endedAt,
      'duration_seconds': instance.durationSeconds,
      'points': instance.points.map((e) => e.toJson()).toList(),
    };
