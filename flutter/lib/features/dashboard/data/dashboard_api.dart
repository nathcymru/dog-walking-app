import 'package:dio/dio.dart';

class DashboardApi {
  DashboardApi(this._dio);
  final Dio _dio;

  Future<Map<String, dynamic>> getAdminStats() async {
    final response =
        await _dio.get<Map<String, dynamic>>('/api/admin/dashboard');
    return response.data!;
  }

  Future<Map<String, dynamic>> getClientStats() async {
    final response =
        await _dio.get<Map<String, dynamic>>('/api/client/dashboard');
    return response.data!;
  }
}
