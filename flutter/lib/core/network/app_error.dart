enum AppErrorType {
  network,
  timeout,
  unauthorized,
  forbidden,
  server,
  unknown,
}

class AppError {
  const AppError({
    required this.type,
    required this.message,
    required this.retryable,
    this.statusCode,
  });

  final AppErrorType type;
  final String message;
  final bool retryable;
  final int? statusCode;

  factory AppError.fromStatusCode(int code) {
    if (code == 401) {
      return const AppError(
        type: AppErrorType.unauthorized,
        message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
        retryable: false,
        statusCode: 401,
      );
    }
    if (code == 403) {
      return const AppError(
        type: AppErrorType.forbidden,
        message: '접근 권한이 없습니다.',
        retryable: false,
        statusCode: 403,
      );
    }
    if (code >= 500) {
      return AppError(
        type: AppErrorType.server,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        retryable: true,
        statusCode: code,
      );
    }
    return AppError(
      type: AppErrorType.unknown,
      message: '알 수 없는 오류가 발생했습니다.',
      retryable: false,
      statusCode: code,
    );
  }
}
