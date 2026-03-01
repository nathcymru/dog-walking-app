import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/network_failure_mapper.dart';
import 'package:dog_walking_app/features/profile/data/profile_api.dart';
import 'package:dog_walking_app/features/profile/domain/profile_repository.dart';

class ProfileRepositoryImpl implements ProfileRepository {
  ProfileRepositoryImpl(this._api);
  final ProfileApi _api;

  @override
  Future<Result<Map<String, dynamic>>> updateProfile({
    required String role,
    required String fullName,
    required String email,
    String? phone,
  }) async {
    try {
      final data = role == 'admin'
          ? await _api.updateAdminProfile(fullName: fullName, email: email)
          : await _api.updateClientProfile(
              fullName: fullName,
              email: email,
              phone: phone,
            );
      return Success(data);
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }
}
