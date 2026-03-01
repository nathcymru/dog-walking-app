import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/networking/retry_after.dart';

/// Maps a [DioException] to a domain [Failure].
Failure mapDioException(DioException e) {
  if (e.type == DioExceptionType.connectionError ||
      e.type == DioExceptionType.unknown) {
    return const OfflineFailure();
  }
  if (e.type == DioExceptionType.connectionTimeout ||
      e.type == DioExceptionType.sendTimeout ||
      e.type == DioExceptionType.receiveTimeout) {
    return const TimeoutFailure();
  }
  final statusCode = e.response?.statusCode;
  switch (statusCode) {
    case 401:
      return const UnauthorizedFailure();
    case 403:
      return const ForbiddenFailure();
    case 422:
      final msg = e.response?.data is Map
          ? (e.response!.data as Map)['message']?.toString() ?? 'Validation error'
          : 'Validation error';
      return ValidationFailure(msg);
    case 429:
      final retryAfter = RetryAfter.parse(
        e.response?.headers.value('retry-after'),
      );
      return RateLimitedFailure(retryAfter);
    case null:
      return const UnexpectedFailure('No response received');
    default:
      if (statusCode! >= 500) {
        return ServerFailure(statusCode);
      }
      return UnexpectedFailure('HTTP $statusCode');
  }
}
