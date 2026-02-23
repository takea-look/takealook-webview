import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../auth/token_store.dart';
import 'app_error.dart';

class ApiResult<T> {
  const ApiResult.success(this.data)
      : error = null,
        ok = true;

  const ApiResult.failure(this.error)
      : data = null,
        ok = false;

  final bool ok;
  final T? data;
  final AppError? error;
}

class ApiClient {
  ApiClient({
    required this.baseUrl,
    required this.tokenStore,
    http.Client? httpClient,
    this.timeout = const Duration(seconds: 8),
  }) : _http = httpClient ?? http.Client();

  final String baseUrl;
  final TokenStore tokenStore;
  final Duration timeout;
  final http.Client _http;

  Future<ApiResult<Map<String, dynamic>>> getJson(String path) async {
    final uri = Uri.parse('$baseUrl$path');

    try {
      final token = await tokenStore.read();
      final headers = <String, String>{
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer ${token.accessToken}',
      };

      _log('GET $uri');
      final response = await _http.get(uri, headers: headers).timeout(timeout);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final body = response.body.isEmpty ? <String, dynamic>{} : jsonDecode(response.body) as Map<String, dynamic>;
        return ApiResult.success(body);
      }

      return ApiResult.failure(AppError.fromStatusCode(response.statusCode));
    } on TimeoutException {
      return const ApiResult.failure(
        AppError(
          type: AppErrorType.timeout,
          message: '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.',
          retryable: true,
        ),
      );
    } on http.ClientException {
      return const ApiResult.failure(
        AppError(
          type: AppErrorType.network,
          message: '네트워크 연결을 확인해주세요.',
          retryable: true,
        ),
      );
    } catch (_) {
      return const ApiResult.failure(
        AppError(
          type: AppErrorType.unknown,
          message: '알 수 없는 오류가 발생했습니다.',
          retryable: false,
        ),
      );
    }
  }

  void _log(String msg) {
    if (kDebugMode) debugPrint('[ApiClient] $msg');
  }
}
