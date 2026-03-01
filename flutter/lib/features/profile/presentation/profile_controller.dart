import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/providers.dart';
import 'package:dog_walking_app/features/auth/presentation/auth_controller.dart';
import 'package:dog_walking_app/features/profile/data/profile_api.dart';
import 'package:dog_walking_app/features/profile/data/profile_repository_impl.dart';
import 'package:dog_walking_app/features/profile/domain/profile_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final profileApiProvider = Provider<ProfileApi>(
  (ref) => ProfileApi(ref.watch(dioProvider)),
);

final profileRepositoryProvider = Provider<ProfileRepository>(
  (ref) => ProfileRepositoryImpl(ref.watch(profileApiProvider)),
);

final profileControllerProvider =
    AsyncNotifierProvider<ProfileController, void>(ProfileController.new);

class ProfileController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> updateProfile({
    required String fullName,
    required String email,
    String? phone,
  }) async {
    final user = ref.read(authControllerProvider).valueOrNull;
    if (user == null) return;

    state = const AsyncLoading();
    final result = await ref.read(profileRepositoryProvider).updateProfile(
          role: user.role,
          fullName: fullName,
          email: email,
          phone: phone,
        );
    state = switch (result) {
      Success() => const AsyncData(null),
      Err(:final failure) => AsyncError(failure, StackTrace.current),
    };
  }
}
