import 'dart:math';

import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/networking/retry_after.dart';

/// Retries idempotent requests (GET/HEAD) on transient errors with
/// exponential backoff and jitter.
///
/// - Transient status codes: 408, 429, 502, 503, 504
/// - Max attempts: 4
/// - Respects `Retry-After` on 429
/// - Hard-stops repeated 429 without `Retry-After` after attempt 2
class RetryInterceptor extends Interceptor {
  RetryInterceptor(this._dio);
  final Dio _dio;

  static const _maxAttempts = 4;
  static const _transientStatuses = {408, 429, 502, 503, 504};
  static final _random = Random();

  static bool _isIdempotent(String method) =>
      method == 'GET' || method == 'HEAD';

  static bool _isTransient(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.sendTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return true;
    }
    final code = e.response?.statusCode;
    return code != null && _transientStatuses.contains(code);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final options = err.requestOptions;

    if (!_isIdempotent(options.method) || !_isTransient(err)) {
      return handler.next(err);
    }

    final attempt = (options.extra['retry_attempt'] as int?) ?? 0;

    if (attempt >= _maxAttempts - 1) {
      return handler.next(err);
    }

    // Hard-stop for repeated 429 without Retry-After after attempt 2
    if (err.response?.statusCode == 429) {
      final retryAfterHeader = err.response?.headers.value('retry-after');
      if (retryAfterHeader == null && attempt >= 1) {
        return handler.next(err);
      }
    }

    Duration delay;
    if (err.response?.statusCode == 429) {
      final retryAfter = RetryAfter.parse(
        err.response?.headers.value('retry-after'),
      );
      delay = retryAfter ??
          _exponentialBackoff(attempt);
    } else {
      delay = _exponentialBackoff(attempt);
    }

    await Future<void>.delayed(delay);

    final retryOptions = options.copyWith(
      extra: {
        ...options.extra,
        'retry_attempt': attempt + 1,
      },
    );

    try {
      final response = await _dio.fetch(retryOptions);
      handler.resolve(response);
    } on DioException catch (e) {
      handler.next(e);
    }
  }

  static Duration _exponentialBackoff(int attempt) {
    final base = Duration(milliseconds: 500 * pow(2, attempt).toInt());
    final jitter = Duration(
      milliseconds: _random.nextInt(300),
    );
    final total = base + jitter;
    const max = Duration(seconds: 30);
    return total > max ? max : total;
  }
}
