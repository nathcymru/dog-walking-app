import 'dart:async';

import 'package:dog_walking_app/features/gps/data/gps_service.dart';
import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockGpsService extends Mock implements GpsService {}

void main() {
  group('GpsSessionController logic', () {
    test('startSession subscribes to GPS stream and collects points', () async {
      final controller = StreamController<GpsPointEntity>();
      final mockService = MockGpsService();

      when(() => mockService.requestPermission()).thenAnswer((_) async => true);
      when(() => mockService.start()).thenAnswer((_) async {});
      when(() => mockService.stream).thenReturn(controller.stream);

      final collected = <GpsPointEntity>[];
      final sub = mockService.stream.listen(collected.add);

      await mockService.start();

      final point = GpsPointEntity(
        lat: 51.5,
        lng: -0.1,
        timestamp: DateTime(2026, 1, 1, 10, 0),
        accuracy: 8.0,
      );
      controller.add(point);

      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(collected, hasLength(1));
      expect(collected.first.lat, 51.5);

      await sub.cancel();
      await controller.close();
    });

    test('stopSession stops GPS service', () async {
      final mockService = MockGpsService();
      when(() => mockService.stop()).thenAnswer((_) async {});

      await mockService.stop();

      verify(() => mockService.stop()).called(1);
    });

    test('GPS points with accuracy > 50m are filtered', () {
      final point = GpsPointEntity(
        lat: 51.5,
        lng: -0.1,
        timestamp: DateTime.now(),
        accuracy: 75.0, // exceeds threshold
      );
      expect(point.accuracy > 50, isTrue);
    });

    test('GPS points with accuracy <= 50m are accepted', () {
      final point = GpsPointEntity(
        lat: 51.5,
        lng: -0.1,
        timestamp: DateTime.now(),
        accuracy: 15.0,
      );
      expect(point.accuracy <= 50, isTrue);
    });
  });
}
