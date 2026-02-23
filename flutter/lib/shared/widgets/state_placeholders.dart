import 'package:flutter/material.dart';

import '../../core/theme/tds_theme.dart';

enum AppErrorCase {
  network,
  timeout,
  unauthorized,
  unknown,
}

class LoadingPlaceholder extends StatelessWidget {
  const LoadingPlaceholder({
    super.key,
    this.message = '불러오는 중...',
    this.showCard = false,
  });

  final String message;
  final bool showCard;

  @override
  Widget build(BuildContext context) {
    final content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const CircularProgressIndicator(),
        const SizedBox(height: 12),
        Text(message),
      ],
    );

    if (!showCard) return Center(child: content);

    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: TdsSpacing.xxl, vertical: TdsSpacing.xl),
          child: content,
        ),
      ),
    );
  }
}

class RecoveryErrorPlaceholder extends StatelessWidget {
  const RecoveryErrorPlaceholder({
    super.key,
    required this.errorCase,
    this.failureCount = 1,
    this.onRetry,
  });

  final AppErrorCase errorCase;
  final int failureCount;
  final VoidCallback? onRetry;

  String _title() {
    switch (errorCase) {
      case AppErrorCase.network:
        return '네트워크 연결이 불안정해요.';
      case AppErrorCase.timeout:
        return '응답이 지연되고 있어요.';
      case AppErrorCase.unauthorized:
        return '로그인이 만료되었어요.';
      case AppErrorCase.unknown:
        return '일시적인 오류가 발생했어요.';
    }
  }

  String _description() {
    if (failureCount >= 3) {
      return '반복 실패가 감지됐어요. 잠시 후 다시 시도하거나 앱을 재시작해주세요.';
    }

    switch (errorCase) {
      case AppErrorCase.unauthorized:
        return '다시 로그인 후 재시도해주세요.';
      default:
        return '다시 시도 버튼으로 복구를 진행할 수 있어요.';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: TdsSpacing.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 36),
            const SizedBox(height: 8),
            Text(
              _title(),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              _description(),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 12),
              FilledButton(
                onPressed: onRetry,
                child: const Text('다시 시도'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class EmptyPlaceholder extends StatelessWidget {
  const EmptyPlaceholder({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        message,
        textAlign: TextAlign.center,
      ),
    );
  }
}
