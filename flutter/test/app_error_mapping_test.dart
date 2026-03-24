import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/network/app_error.dart';

void main() {
  test('maps 401 to unauthorized non-retryable', () {
    final err = AppError.fromStatusCode(401);
    expect(err.type, AppErrorType.unauthorized);
    expect(err.retryable, isFalse);
  });

  test('maps 500 to server retryable', () {
    final err = AppError.fromStatusCode(500);
    expect(err.type, AppErrorType.server);
    expect(err.retryable, isTrue);
  });
}
