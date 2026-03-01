import 'dart:async';

import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/networking/token_store.dart';

/// Token pair returned by the refresh endpoint.
class TokenPair {
  TokenPair({required this.accessToken, required this.refreshToken});
  final String accessToken;
  final String refreshToken;
}

typedef RefreshFn = Future<TokenPair?> Function(String refreshToken);

/// Intercepts 401 responses, attempts a single token refresh, then retries
/// the original request. Uses a single-flight pattern so concurrent 401s
/// only trigger one refresh.
class RefreshInterceptor extends Interceptor {
  RefreshInterceptor({
    required TokenStore tokenStore,
    required RefreshFn refreshFn,
  })  : _tokenStore = tokenStore,
        _refreshFn = refreshFn;

  final TokenStore _tokenStore;
  final RefreshFn _refreshFn;

  Completer<TokenPair?>? _refreshCompleter;

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final options = err.requestOptions;

    // Only handle 401 and only if we haven't already retried this request
    if (err.response?.statusCode != 401 ||
        options.extra['auth_retry'] == true) {
      return handler.next(err);
    }

    final refreshToken = await _tokenStore.readRefreshToken();
    if (refreshToken == null) {
      await _tokenStore.clear();
      return handler.next(err);
    }

    // Single-flight: if a refresh is already in progress, wait for it
    if (_refreshCompleter != null) {
      final pair = await _refreshCompleter!.future;
      if (pair == null) {
        return handler.next(err);
      }
      return _retry(options, pair.accessToken, handler);
    }

    _refreshCompleter = Completer<TokenPair?>();
    try {
      final pair = await _refreshFn(refreshToken);
      if (pair == null) {
        await _tokenStore.clear();
        _refreshCompleter!.complete(null);
        return handler.next(err);
      }
      await _tokenStore.writeTokens(
        accessToken: pair.accessToken,
        refreshToken: pair.refreshToken,
      );
      _refreshCompleter!.complete(pair);
      return _retry(options, pair.accessToken, handler);
    } catch (_) {
      await _tokenStore.clear();
      _refreshCompleter!.complete(null);
      return handler.next(err);
    } finally {
      _refreshCompleter = null;
    }
  }

  Future<void> _retry(
    RequestOptions options,
    String newAccessToken,
    ErrorInterceptorHandler handler,
  ) async {
    final dio = options.extra['dio_instance'] as Dio?;
    if (dio == null) {
      return handler.next(
        DioException(
          requestOptions: options,
          error: 'dio_instance not found in extra',
        ),
      );
    }
    final retryOptions = options.copyWith(
      headers: {
        ...options.headers,
        'Authorization': 'Bearer $newAccessToken',
      },
      extra: {
        ...options.extra,
        'auth_retry': true,
      },
    );
    try {
      final response = await dio.fetch(retryOptions);
      handler.resolve(response);
    } on DioException catch (e) {
      handler.next(e);
    }
  }
}
