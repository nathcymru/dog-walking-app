import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/errors/failures.dart';
import 'package:dog_walking_app/core/errors/result.dart';
import 'package:dog_walking_app/core/networking/network_failure_mapper.dart';
import 'package:dog_walking_app/core/networking/token_store.dart';
import 'package:dog_walking_app/features/auth/data/auth_api.dart';
import 'package:dog_walking_app/features/auth/domain/auth_repository.dart';
import 'package:dog_walking_app/features/auth/domain/user_entity.dart';

class AuthRepositoryImpl implements AuthRepository {
  AuthRepositoryImpl({required AuthApi authApi, required TokenStore tokenStore})
      : _authApi = authApi,
        _tokenStore = tokenStore;

  final AuthApi _authApi;
  final TokenStore _tokenStore;

  @override
  Future<Result<UserEntity>> login(String email, String password) async {
    try {
      final result = await _authApi.login(email, password);
      await _tokenStore.writeTokens(
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      );
      return Success(_mapUser(result.user));
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Result<UserEntity?>> getSession() async {
    try {
      final userDto = await _authApi.getSession();
      return Success(userDto != null ? _mapUser(userDto) : null);
    } on DioException catch (e) {
      return Err(mapDioException(e));
    } catch (e) {
      return Err(UnexpectedFailure(e.toString()));
    }
  }

  @override
  Future<Result<void>> logout() async {
    try {
      await _authApi.logout();
      await _tokenStore.clear();
      return const Success(null);
    } on DioException catch (e) {
      // Clear tokens even on error
      await _tokenStore.clear();
      return Err(mapDioException(e));
    } catch (e) {
      await _tokenStore.clear();
      return Err(UnexpectedFailure(e.toString()));
    }
  }

  UserEntity _mapUser(UserDto dto) => UserEntity(
        id: dto.id,
        email: dto.email,
        role: dto.role,
        fullName: dto.fullName,
      );
}
