import 'package:dio/dio.dart';
import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:dog_walking_app/features/walks/data/walk_dto.dart';

class WalkApi {
  WalkApi(this._dio);
  final Dio _dio;

  Future<WalkDto> startWalk({String? slotId}) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/api/walks/start',
      data: slotId != null ? {'slotId': slotId} : {},
    );
    final data = response.data!;
    // API returns { walkId } or { walk }
    if (data['walk'] != null) {
      return WalkDto.fromJson(data['walk'] as Map<String, dynamic>);
    }
    // Fallback: API returned only walkId — construct a minimal DTO.
    // Prefer any startedAt from the response, fall back to client time.
    final actualStartedAt = data['startedAt'] as String? ??
        DateTime.now().toUtc().toIso8601String();
    return WalkDto(
      id: data['walkId'] as String,
      status: 'active',
      startedAt: actualStartedAt,
    );
  }

  Future<WalkDto> endWalk({
    required String walkId,
    required List<GpsPointEntity> points,
    required int durationSeconds,
  }) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/api/walks/$walkId/end',
      data: {
        'points': points.map((p) => p.toJson()).toList(),
        'durationSeconds': durationSeconds,
      },
    );
    final data = response.data!;
    return WalkDto.fromJson(data['walk'] as Map<String, dynamic>);
  }

  Future<WalkDto> getWalk(String walkId) async {
    final response = await _dio.get<Map<String, dynamic>>('/api/walks/$walkId');
    final data = response.data!;
    return WalkDto.fromJson(data['walk'] as Map<String, dynamic>);
  }
}
