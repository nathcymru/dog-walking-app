import 'dart:convert';

import 'package:dog_walking_app/features/photos/domain/pending_photo_entity.dart';
import 'package:hive/hive.dart';

/// Hive-backed queue storing pending photo uploads.
class PhotoQueueRepository {
  static const _boxName = 'photo_queue';
  static const _queueKey = 'queue';

  Box get _box => Hive.box(_boxName);

  List<PendingPhotoEntity> getAll() {
    final raw = _box.get(_queueKey) as String?;
    if (raw == null) return [];
    try {
      return (jsonDecode(raw) as List)
          .cast<Map<String, dynamic>>()
          .map(PendingPhotoEntity.fromJson)
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> add(PendingPhotoEntity entity) async {
    final current = getAll();
    current.add(entity);
    await _persist(current);
  }

  Future<void> remove(PendingPhotoEntity entity) async {
    final current = getAll();
    current.removeWhere(
      (e) =>
          e.walkId == entity.walkId &&
          e.localPath == entity.localPath &&
          e.timestamp == entity.timestamp,
    );
    await _persist(current);
  }

  Future<void> update(PendingPhotoEntity entity) async {
    final current = getAll();
    final idx = current.indexWhere(
      (e) =>
          e.walkId == entity.walkId &&
          e.localPath == entity.localPath &&
          e.timestamp == entity.timestamp,
    );
    if (idx >= 0) {
      current[idx] = entity;
      await _persist(current);
    }
  }

  Future<void> _persist(List<PendingPhotoEntity> list) async {
    await _box.put(_queueKey, jsonEncode(list.map((e) => e.toJson()).toList()));
  }
}
