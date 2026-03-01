import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/config/app_env.dart';
import 'package:dog_walking_app/core/networking/api_client.dart';
import 'package:dog_walking_app/core/networking/token_store.dart';
import 'package:dog_walking_app/features/auth/data/auth_api.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (ref) => const FlutterSecureStorage(),
);

final tokenStoreProvider = Provider<TokenStore>(
  (ref) => TokenStore(ref.watch(secureStorageProvider)),
);

final apiClientProvider = Provider<ApiClient>((ref) {
  final tokenStore = ref.watch(tokenStoreProvider);
  // Use a separate plain Dio for refresh calls to avoid interceptor recursion
  final refreshDio = Dio(
    BaseOptions(
      baseUrl: AppEnv.apiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );
  final refreshAuthApi = AuthApi(refreshDio);
  return ApiClient.create(
    tokenStore: tokenStore,
    refreshFn: refreshAuthApi.refresh,
  );
});

final dioProvider = Provider<Dio>(
  (ref) => ref.watch(apiClientProvider).dio,
);

final authApiProvider = Provider<AuthApi>(
  (ref) => AuthApi(ref.watch(dioProvider)),
);
