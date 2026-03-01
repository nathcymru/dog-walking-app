import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:dog_walking_app/features/photos/presentation/photo_controller.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final syncServiceProvider = Provider<SyncService>((ref) {
  final service = SyncService(ref);
  ref.onDispose(service.dispose);
  return service;
});

/// Monitors connectivity and retries pending uploads when online.
class SyncService {
  SyncService(this._ref);
  final Ref _ref;

  StreamSubscription<List<ConnectivityResult>>? _sub;
  bool _isSyncing = false;
  Duration _backoff = const Duration(seconds: 2);
  static const _maxBackoff = Duration(seconds: 60);

  void start() {
    _sub = Connectivity()
        .onConnectivityChanged
        .listen(_onConnectivityChanged);
  }

  void _onConnectivityChanged(List<ConnectivityResult> results) {
    final isOnline = results.any((r) => r != ConnectivityResult.none);
    if (isOnline) {
      _flush();
    }
  }

  Future<void> _flush() async {
    if (_isSyncing) return;
    _isSyncing = true;
    try {
      await _ref.read(photoControllerProvider.notifier).syncPendingPhotos();
      _backoff = const Duration(seconds: 2); // reset on success
    } catch (_) {
      _scheduleRetry();
    } finally {
      _isSyncing = false;
    }
  }

  void _scheduleRetry() {
    final next = _backoff * 2;
    _backoff = next > _maxBackoff ? _maxBackoff : next;
    Future<void>.delayed(_backoff, _flush);
  }

  void dispose() {
    _sub?.cancel();
  }
}
