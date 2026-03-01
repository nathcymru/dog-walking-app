import 'package:dio/dio.dart';

class ProfileApi {
  ProfileApi(this._dio);
  final Dio _dio;

  Future<Map<String, dynamic>> updateAdminProfile({
    required String fullName,
    required String email,
  }) async {
    final response = await _dio.put<Map<String, dynamic>>(
      '/api/admin/profile',
      data: {'full_name': fullName, 'email': email},
    );
    return response.data!['user'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateClientProfile({
    required String fullName,
    required String email,
    String? phone,
  }) async {
    final response = await _dio.put<Map<String, dynamic>>(
      '/api/client/profile',
      data: {'full_name': fullName, 'email': email, 'phone': phone},
    );
    return response.data!['user'] as Map<String, dynamic>;
  }
}
