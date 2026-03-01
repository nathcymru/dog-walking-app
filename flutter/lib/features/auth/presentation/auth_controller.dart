import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/providers.dart';
import 'package:dog_walking_app/features/auth/data/auth_api.dart';
import 'package:dog_walking_app/features/auth/data/auth_repository_impl.dart';
import 'package:dog_walking_app/features/auth/domain/auth_repository.dart';
import 'package:dog_walking_app/features/auth/domain/user_entity.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    authApi: ref.watch(authApiProvider),
    tokenStore: ref.watch(tokenStoreProvider),
  );
});

final authControllerProvider =
    AsyncNotifierProvider<AuthController, UserEntity?>(AuthController.new);

class AuthController extends AsyncNotifier<UserEntity?> {
  @override
  Future<UserEntity?> build() async {
    // Check session on startup
    final result = await ref.read(authRepositoryProvider).getSession();
    return switch (result) {
      Success(:final value) => value,
      Err() => null,
    };
  }

  Future<void> login(String email, String password) async {
    state = const AsyncLoading();
    final result = await ref.read(authRepositoryProvider).login(email, password);
    state = switch (result) {
      Success(:final value) => AsyncData(value),
      Err(:final failure) => AsyncError(failure, StackTrace.current),
    };
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    state = const AsyncData(null);
  }

  Future<void> checkSession() async {
    state = const AsyncLoading();
    final result = await ref.read(authRepositoryProvider).getSession();
    state = switch (result) {
      Success(:final value) => AsyncData(value),
      Err() => const AsyncData(null),
    };
  }
}
