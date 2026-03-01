import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mime/mime.dart';

/// Handles the complete photo upload flow:
/// pick → validate → compress → presign → PUT to R2 → confirm
class PhotoUploadService {
  PhotoUploadService(this._dio);
  final Dio _dio;

  static const _maxSizeBytes = 8 * 1024 * 1024; // 8 MB
  static const _allowedMimes = {'image/jpeg', 'image/png', 'image/webp'};

  Future<File?> pickPhoto() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.camera);
    if (picked == null) return null;

    final file = File(picked.path);
    final mime = lookupMimeType(file.path) ?? '';
    if (!_allowedMimes.contains(mime)) {
      throw Exception('Unsupported image type: $mime. Use JPEG, PNG, or WebP.');
    }

    final size = await file.length();
    if (size > _maxSizeBytes) {
      throw Exception(
        'Image too large: ${(size / 1024 / 1024).toStringAsFixed(1)}MB. Max 8MB.',
      );
    }

    return file;
  }

  Future<File> compress(File file) async {
    final targetPath = '${file.path}_compressed.jpg';
    final result = await FlutterImageCompress.compressAndGetFile(
      file.path,
      targetPath,
      quality: 75,
      minWidth: 1920,
      minHeight: 1080,
    );
    return result != null ? File(result.path) : file;
  }

  Future<({String presignedUrl, String objectKey})> presign(
    String walkId,
    String contentType,
    String fileName,
  ) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/api/walks/$walkId/photos/presign',
      data: {'contentType': contentType, 'fileName': fileName},
    );
    final data = response.data!;
    return (
      presignedUrl: data['presignedUrl'] as String,
      objectKey: data['objectKey'] as String,
    );
  }

  Future<void> uploadToR2(
    String presignedUrl,
    File file,
    String contentType,
  ) async {
    final bytes = await file.readAsBytes();
    // Use plain Dio (no auth) for R2 presigned PUT
    final plainDio = Dio();
    await plainDio.put(
      presignedUrl,
      data: Stream.fromIterable([bytes]),
      options: Options(
        headers: {
          'Content-Type': contentType,
          'Content-Length': bytes.length,
        },
        sendTimeout: const Duration(seconds: 60),
        receiveTimeout: const Duration(seconds: 60),
      ),
    );
  }

  Future<void> confirm(
    String walkId,
    String objectKey,
    int? gpsPointIndex,
    DateTime timestamp,
  ) async {
    await _dio.post<void>(
      '/api/walks/$walkId/photos/confirm',
      data: {
        'objectKey': objectKey,
        'gpsPointIndex': gpsPointIndex,
        'timestamp': timestamp.toIso8601String(),
      },
    );
  }
}
