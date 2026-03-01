import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/config/app_env.dart';
import 'package:dog_walking_app/core/networking/interceptors/auth_interceptor.dart';
import 'package:dog_walking_app/core/networking/interceptors/redacting_log_interceptor.dart';
import 'package:dog_walking_app/core/networking/interceptors/refresh_interceptor.dart';
import 'package:dog_walking_app/core/networking/interceptors/request_id_interceptor.dart';
import 'package:dog_walking_app/core/networking/interceptors/retry_interceptor.dart';
import 'package:dog_walking_app/core/networking/token_store.dart';

class ApiClient {
  ApiClient._({required Dio dio}) : _dio = dio;

  final Dio _dio;

  Dio get dio => _dio;

  factory ApiClient.create({
    required TokenStore tokenStore,
    required RefreshFn refreshFn,
  }) {
    final dio = Dio(
      BaseOptions(
        baseUrl: AppEnv.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        sendTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Interceptors applied in order (first added = first called for requests,
    // last called for responses).
    dio.interceptors.addAll([
      // 1. Inject dio instance into every request extra so RefreshInterceptor
      //    can fetch with it without recursion.
      InterceptorsWrapper(
        onRequest: (options, handler) {
          options.extra['dio_instance'] = dio;
          handler.next(options);
        },
      ),

      // 2. Add X-Request-Id
      RequestIdInterceptor(),

      // 3. Inject Authorization header
      AuthInterceptor(tokenStore),

      // 4. Handle 401 / token refresh
      RefreshInterceptor(tokenStore: tokenStore, refreshFn: refreshFn),

      // 5. Retry transient errors (GET/HEAD only)
      RetryInterceptor(dio),

      // 6. Dev logging (secrets redacted)
      if (AppEnv.env == 'dev' && AppEnv.enableNetworkLogs)
        RedactingLogInterceptor(),
    ]);

    return ApiClient._(dio: dio);
  }
}
