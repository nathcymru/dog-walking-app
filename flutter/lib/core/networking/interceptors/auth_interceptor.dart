import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/networking/token_store.dart';

/// Injects `Authorization: Bearer <token>` into every request when a token
/// is available.
class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokenStore);
  final TokenStore _tokenStore;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokenStore.readAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}
