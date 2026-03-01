import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/networking/request_id.dart';

/// Adds a unique `X-Request-Id` header to every outgoing request.
class RequestIdInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.headers['X-Request-Id'] = RequestId.newId();
    handler.next(options);
  }
}
