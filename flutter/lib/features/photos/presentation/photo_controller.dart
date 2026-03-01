import 'dart:io';
import 'dart:async';

import 'package:dog_walking_app/core/networking/providers.dart';
import 'package:dog_walking_app/features/photos/data/photo_queue_repository.dart';
import 'package:dog_walking_app/features/photos/data/photo_upload_service.dart';
import 'package:dog_walking_app/features/photos/domain/pending_photo_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mime/mime.dart';

final photoQueueRepositoryProvider = Provider<PhotoQueueRepository>(
  (ref) => PhotoQueueRepository(),
);

final photoUploadServiceProvider = Provider<PhotoUploadService>(
  (ref) => PhotoUploadService(ref.watch(dioProvider)),
);

final photoControllerProvider =
    AsyncNotifierProvider<PhotoController, void>(PhotoController.new);

class PhotoController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  /// Pick, compress, and upload a photo for a walk.
  /// On failure, queues the photo for later retry.
  Future<void> captureAndUpload({
    required String walkId,
    int? gpsPointIndex,
  }) async {
    final uploadService = ref.read(photoUploadServiceProvider);
    final queue = ref.read(photoQueueRepositoryProvider);

    File? file;
    try {
      file = await uploadService.pickPhoto();
      if (file == null) return; // User cancelled

      file = await uploadService.compress(file);

      final contentType =
          lookupMimeType(file.path) ?? 'image/jpeg';
      final fileName = file.path.split('/').last;
      final timestamp = DateTime.now();

      await _uploadAndConfirm(
        uploadService: uploadService,
        walkId: walkId,
        file: file,
        contentType: contentType,
        fileName: fileName,
        gpsPointIndex: gpsPointIndex,
        timestamp: timestamp,
      );
    } catch (e) {
      // Queue for retry if we have a file
      if (file != null) {
        final contentType = lookupMimeType(file.path) ?? 'image/jpeg';
        await queue.add(
          PendingPhotoEntity(
            walkId: walkId,
            localPath: file.path,
            contentType: contentType,
            gpsPointIndex: gpsPointIndex,
            timestamp: DateTime.now(),
          ),
        );
      }
      rethrow;
    }
  }

  /// Retry all pending photos in the queue.
  Future<void> syncPendingPhotos() async {
    final uploadService = ref.read(photoUploadServiceProvider);
    final queue = ref.read(photoQueueRepositoryProvider);
    final pending = queue.getAll();

    for (final photo in pending) {
      try {
        final file = File(photo.localPath);
        if (!file.existsSync()) {
          await queue.remove(photo);
          continue;
        }
        await _uploadAndConfirm(
          uploadService: uploadService,
          walkId: photo.walkId,
          file: file,
          contentType: photo.contentType,
          fileName: photo.localPath.split('/').last,
          gpsPointIndex: photo.gpsPointIndex,
          timestamp: photo.timestamp,
        );
        await queue.remove(photo);
      } catch (_) {
        final updated = PendingPhotoEntity(
          walkId: photo.walkId,
          localPath: photo.localPath,
          contentType: photo.contentType,
          gpsPointIndex: photo.gpsPointIndex,
          timestamp: photo.timestamp,
          retryCount: photo.retryCount + 1,
        );
        await queue.update(updated);
      }
    }
  }

  Future<void> _uploadAndConfirm({
    required PhotoUploadService uploadService,
    required String walkId,
    required File file,
    required String contentType,
    required String fileName,
    required int? gpsPointIndex,
    required DateTime timestamp,
  }) async {
    final presigned = await uploadService.presign(walkId, contentType, fileName);
    await uploadService.uploadToR2(presigned.presignedUrl, file, contentType);
    await uploadService.confirm(
      walkId,
      presigned.objectKey,
      gpsPointIndex,
      timestamp,
    );
  }
}
