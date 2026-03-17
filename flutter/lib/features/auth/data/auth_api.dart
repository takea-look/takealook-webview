import 'package:dio/dio.dart';

class LoginResponse {
  const LoginResponse({required this.accessToken, this.refreshToken});

  final String accessToken;
  final String? refreshToken;

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: (json['accessToken'] ?? '') as String,
      refreshToken: json['refreshToken'] as String?,
    );
  }
}

class AuthApi {
  const AuthApi(this._dio);

  final Dio _dio;

  Future<LoginResponse> signin({required String username, required String password}) async {
    final response = await _dio.post<Map<String, dynamic>>(
      '/auth/signin',
      data: {
        'username': username,
        'password': password,
      },
    );

    return LoginResponse.fromJson(response.data ?? const <String, dynamic>{});
  }

  Future<void> getAuthMe({required String accessToken}) async {
    await _dio.get<void>(
      '/auth/me',
      options: Options(
        headers: {
          'Authorization': 'Bearer $accessToken',
          'accessToken': accessToken,
        },
      ),
    );
  }
}
