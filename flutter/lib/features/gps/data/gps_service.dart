import 'dart:async';

import 'package:dog_walking_app/features/gps/domain/gps_point_entity.dart';
import 'package:geolocator/geolocator.dart';

/// Battery-aware GPS service.
/// - High accuracy, 10m distance filter
/// - Max one point per 5 seconds
/// - Discards points with accuracy > 50m
class GpsService {
  static const _minIntervalMs = 5000;
  static const _maxAccuracyMetres = 50.0;

  StreamController<GpsPointEntity>? _controller;
  StreamSubscription<Position>? _positionSub;
  DateTime? _lastEmit;

  Stream<GpsPointEntity> get stream {
    _controller ??= StreamController<GpsPointEntity>.broadcast();
    return _controller!.stream;
  }

  Future<bool> requestPermission() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return false;

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    return permission == LocationPermission.whileInUse ||
        permission == LocationPermission.always;
  }

  Future<void> start() async {
    _controller ??= StreamController<GpsPointEntity>.broadcast();

    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10,
    );

    _positionSub =
        Geolocator.getPositionStream(locationSettings: locationSettings)
            .listen(_onPosition);
  }

  void _onPosition(Position position) {
    if (position.accuracy > _maxAccuracyMetres) return;

    final now = DateTime.now();
    if (_lastEmit != null &&
        now.difference(_lastEmit!).inMilliseconds < _minIntervalMs) {
      return;
    }
    _lastEmit = now;

    _controller?.add(
      GpsPointEntity(
        lat: position.latitude,
        lng: position.longitude,
        timestamp: position.timestamp,
        accuracy: position.accuracy,
        speed: position.speed,
      ),
    );
  }

  Future<void> stop() async {
    await _positionSub?.cancel();
    _positionSub = null;
    _lastEmit = null;
  }

  void dispose() {
    stop();
    _controller?.close();
    _controller = null;
  }
}
