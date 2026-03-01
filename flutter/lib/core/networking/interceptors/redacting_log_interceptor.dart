import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/config/app_env.dart';
import 'package:logger/logger.dart';

/// Dev-only logging interceptor that redacts the Authorization header to
/// prevent token leakage in logs.
class RedactingLogInterceptor extends Interceptor {
  RedactingLogInterceptor() : _logger = Logger();
  final Logger _logger;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (AppEnv.enableNetworkLogs) {
      final headers = Map<String, dynamic>.from(options.headers);
      if (headers.containsKey('Authorization')) {
        headers['Authorization'] = '[REDACTED]';
      }
      _logger.d(
        '--> ${options.method} ${options.uri}\n'
        'Headers: $headers\n'
        'Data: ${options.data}',
      );
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (AppEnv.enableNetworkLogs) {
      _logger.d(
        '<-- ${response.statusCode} ${response.requestOptions.uri}\n'
        'Data: ${response.data}',
      );
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (AppEnv.enableNetworkLogs) {
      _logger.e(
        '<-- ERROR ${err.response?.statusCode} ${err.requestOptions.uri}\n'
        '${err.message}',
      );
    }
    handler.next(err);
  }
}
