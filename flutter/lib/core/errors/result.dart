import 'package:dog_walking_app/core/errors/failures.dart';

/// Minimal result type to avoid adding dartz dependency.
sealed class Result<S> {
  const Result();
}

class Success<S> extends Result<S> {
  const Success(this.value);
  final S value;
}

class Err<S> extends Result<S> {
  const Err(this.failure);
  final Failure failure;
}
