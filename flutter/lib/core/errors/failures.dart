sealed class Failure {
  const Failure();
}

class OfflineFailure extends Failure {
  const OfflineFailure();
}

class TimeoutFailure extends Failure {
  const TimeoutFailure();
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure();
}

class ForbiddenFailure extends Failure {
  const ForbiddenFailure();
}

class ValidationFailure extends Failure {
  const ValidationFailure(this.message);
  final String message;
}

class RateLimitedFailure extends Failure {
  const RateLimitedFailure(this.retryAfter);
  final Duration? retryAfter;
}

class ServerFailure extends Failure {
  const ServerFailure(this.statusCode);
  final int? statusCode;
}

class UnexpectedFailure extends Failure {
  const UnexpectedFailure(this.message);
  final String message;
}
