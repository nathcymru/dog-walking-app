import 'package:dio/dio.dart';
import 'package:dog_walking_app/core/networking/interceptors/refresh_interceptor.dart';

/// Data Transfer Object for login/session responses.
class UserDto {
  UserDto({
    required this.id,
    required this.email,
    required this.role,
    required this.fullName,
  });

  final int id;
  final String email;
  final String role;
  final String fullName;

  factory UserDto.fromJson(Map<String, dynamic> json) {
    return UserDto(
      id: json['id'] as int,
      email: json['email'] as String,
      role: json['role'] as String,
      fullName: json['full_name'] as String,
    );
  }
}

/// Handles authentication API calls.
class AuthApi {
  AuthApi(this._dio);
  final Dio _dio;

  Future<({UserDto user, String accessToken, String refreshToken})> login(
    String email,
    String password,
  ) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/api/auth/login',
      data: {'email': email, 'password': password},
    );
    final data = response.data!;
    return (
      user: UserDto.fromJson(data['user'] as Map<String, dynamic>),
      accessToken: data['accessToken'] as String,
      refreshToken: data['refreshToken'] as String,
    );
  }

  Future<UserDto?> getSession() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/api/auth/session');
      final data = response.data!;
      if (data['user'] == null) return null;
      return UserDto.fromJson(data['user'] as Map<String, dynamic>);
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) return null;
      rethrow;
    }
  }

  Future<void> logout() async {
    await _dio.post<void>('/api/auth/logout');
  }

  Future<TokenPair?> refresh(String refreshToken) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/api/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      final data = response.data!;
      return TokenPair(
        accessToken: data['accessToken'] as String,
        refreshToken: data['refreshToken'] as String,
      );
    } on DioException catch (_) {
      return null;
    }
  }
}
