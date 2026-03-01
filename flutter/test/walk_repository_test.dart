import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:dog_walking_app/features/walks/data/walk_api.dart';
import 'package:dog_walking_app/features/walks/data/walk_dto.dart';
import 'package:dog_walking_app/features/walks/data/walk_repository_impl.dart';
import 'package:dog_walking_app/features/walks/domain/walk_entity.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockWalkApi extends Mock implements WalkApi {}

void main() {
  late MockWalkApi mockApi;
  late WalkRepositoryImpl repository;

  setUp(() {
    mockApi = MockWalkApi();
    repository = WalkRepositoryImpl(mockApi);
    registerFallbackValue(<GpsPointEntity>[]);
  });

  group('WalkRepositoryImpl.startWalk', () {
    test('returns Success with WalkEntity on success', () async {
      when(() => mockApi.startWalk(slotId: any(named: 'slotId'))).thenAnswer(
        (_) async => const WalkDto(
          id: 'walk-1',
          status: 'active',
          startedAt: '2026-01-01T10:00:00.000Z',
        ),
      );

      final result = await repository.startWalk();

      expect(result, isA<Success<WalkEntity>>());
      final walk = (result as Success<WalkEntity>).value;
      expect(walk.id, 'walk-1');
      expect(walk.status, 'active');
    });

    test('returns Err on DioException', () async {
      when(() => mockApi.startWalk(slotId: any(named: 'slotId'))).thenThrow(
        DioException(
          requestOptions: RequestOptions(path: '/api/walks/start'),
          type: DioExceptionType.connectionError,
        ),
      );

      final result = await repository.startWalk();

      expect(result, isA<Err<WalkEntity>>());
      expect((result as Err<WalkEntity>).failure, isA<OfflineFailure>());
    });
  });

  group('WalkRepositoryImpl.endWalk', () {
    final testPoints = [
      GpsPointEntity(
        lat: 51.5,
        lng: -0.1,
        timestamp: DateTime(2026, 1, 1, 10, 0),
        accuracy: 5.0,
        speed: 1.2,
      ),
    ];

    test('returns Success with completed WalkEntity', () async {
      when(
        () => mockApi.endWalk(
          walkId: any(named: 'walkId'),
          points: any(named: 'points'),
          durationSeconds: any(named: 'durationSeconds'),
        ),
      ).thenAnswer(
        (_) async => const WalkDto(
          id: 'walk-1',
          status: 'completed',
          startedAt: '2026-01-01T10:00:00.000Z',
          endedAt: '2026-01-01T10:30:00.000Z',
          durationSeconds: 1800,
        ),
      );

      final result = await repository.endWalk(
        walkId: 'walk-1',
        points: testPoints,
        durationSeconds: 1800,
      );

      expect(result, isA<Success<WalkEntity>>());
      final walk = (result as Success<WalkEntity>).value;
      expect(walk.status, 'completed');
      expect(walk.durationSeconds, 1800);
    });

    test('returns Err on server error', () async {
      when(
        () => mockApi.endWalk(
          walkId: any(named: 'walkId'),
          points: any(named: 'points'),
          durationSeconds: any(named: 'durationSeconds'),
        ),
      ).thenThrow(
        DioException(
          requestOptions: RequestOptions(path: '/api/walks/walk-1/end'),
          response: Response(
            requestOptions: RequestOptions(path: '/api/walks/walk-1/end'),
            statusCode: 500,
          ),
          type: DioExceptionType.badResponse,
        ),
      );

      final result = await repository.endWalk(
        walkId: 'walk-1',
        points: testPoints,
        durationSeconds: 300,
      );

      expect(result, isA<Err<WalkEntity>>());
      expect((result as Err<WalkEntity>).failure, isA<ServerFailure>());
    });
  });
}
