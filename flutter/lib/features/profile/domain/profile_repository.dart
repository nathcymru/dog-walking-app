import 'package:dog_walking_app/core/errors/result.dart';

abstract class ProfileRepository {
  Future<Result<Map<String, dynamic>>> updateProfile({
    required String role,
    required String fullName,
    required String email,
    String? phone,
  });
}
