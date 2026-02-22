import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../../core/config/env.dart';

enum WebviewErrorType {
  network,
  dns,
  timeout,
  javascript,
  ssl,
  unknown,
}

class WebviewPage extends StatefulWidget {
  const WebviewPage({super.key});

  static const routeName = '/';

  @override
  State<WebviewPage> createState() => _WebviewPageState();
}

class _WebviewPageState extends State<WebviewPage> {
  late final WebViewController _controller;

  int _progress = 0;
  String _currentUrl = Env.feBaseUrl;
  bool _hasError = false;
  bool _canGoBack = false;
  DateTime? _lastBackPressedAt;
  bool _isHandlingBack = false;

  WebviewErrorType? _errorType;
  int _consecutiveFailures = 0;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (progress) {
            if (!mounted) return;
            setState(() {
              _progress = progress;
            });
          },
          onPageStarted: (url) {
            _logDev('started: $url');
            if (!mounted) return;
            setState(() {
              _hasError = false;
              _currentUrl = url;
              _errorType = null;
            });
          },
          onPageFinished: (url) async {
            _logDev('finished: $url');
            if (!mounted) return;
            final canGoBack = await _controller.canGoBack();
            if (!mounted) return;
            setState(() {
              _currentUrl = url;
              _canGoBack = canGoBack;
              _consecutiveFailures = 0;
            });
          },
          onWebResourceError: (error) {
            final errorType = _classifyError(error);
            _logDev('error(${error.errorCode}): ${error.description} -> $errorType');
            if (!mounted) return;
            setState(() {
              _hasError = true;
              _errorType = errorType;
              _consecutiveFailures += 1;
            });
          },
          onNavigationRequest: (request) {
            final uri = Uri.tryParse(request.url);
            if (uri == null) {
              return NavigationDecision.prevent;
            }

            final isHttpScheme = uri.scheme == 'http' || uri.scheme == 'https';

            if (!isHttpScheme) {
              launchUrl(uri, mode: LaunchMode.externalApplication);
              return NavigationDecision.prevent;
            }

            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(Env.feBaseUrl));
  }

  void _logDev(String message) {
    if (kDebugMode) {
      debugPrint('[WebView] $message');
    }
  }

  WebviewErrorType _classifyError(WebResourceError error) {
    final desc = error.description.toLowerCase();
    final code = error.errorCode;

    if (desc.contains('dns') || desc.contains('name not resolved')) {
      return WebviewErrorType.dns;
    }
    if (desc.contains('timeout') || code == -8) {
      return WebviewErrorType.timeout;
    }
    if (desc.contains('ssl') || desc.contains('certificate')) {
      return WebviewErrorType.ssl;
    }
    if (desc.contains('javascript') || desc.contains('js')) {
      return WebviewErrorType.javascript;
    }
    if (desc.contains('internet') || desc.contains('network') || code == -2) {
      return WebviewErrorType.network;
    }

    return WebviewErrorType.unknown;
  }

  String _errorTitle() {
    switch (_errorType) {
      case WebviewErrorType.network:
        return '네트워크 연결이 불안정해요.';
      case WebviewErrorType.dns:
        return '서버 주소를 찾지 못했어요.';
      case WebviewErrorType.timeout:
        return '응답이 지연되고 있어요.';
      case WebviewErrorType.javascript:
        return '페이지 스크립트 오류가 발생했어요.';
      case WebviewErrorType.ssl:
        return '보안 연결(SSL) 오류가 발생했어요.';
      case WebviewErrorType.unknown:
      case null:
        return '페이지를 불러오지 못했습니다.';
    }
  }

  String _errorDescription() {
    if (_consecutiveFailures >= 3) {
      return '여러 번 실패했습니다. 잠시 후 다시 시도하거나 네트워크 상태를 확인해주세요.';
    }
    return '아래 버튼으로 다시 시도할 수 있어요.';
  }

  Future<void> _retryLoad() async {
    setState(() {
      _hasError = false;
      _progress = 0;
    });
    await _controller.loadRequest(Uri.parse(_currentUrl));
  }

  Future<void> _handleBackPressed() async {
    if (_isHandlingBack) return;
    _isHandlingBack = true;

    try {
      final canGoBack = await _controller.canGoBack();
      if (!mounted) return;

      if (canGoBack) {
        await _controller.goBack();
        final updatedCanGoBack = await _controller.canGoBack();
        if (!mounted) return;
        setState(() {
          _canGoBack = updatedCanGoBack;
        });
        return;
      }

      final now = DateTime.now();
      final shouldExit = _lastBackPressedAt != null &&
          now.difference(_lastBackPressedAt!) <= const Duration(seconds: 2);

      if (shouldExit) {
        if (Platform.isAndroid) {
          Navigator.of(context).pop();
        }
        return;
      }

      _lastBackPressedAt = now;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('한 번 더 누르면 종료됩니다.'),
            duration: Duration(seconds: 2),
          ),
        );
    } finally {
      _isHandlingBack = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (_, __) {
        _handleBackPressed();
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('TakeaLook WebView'),
          actions: [
            IconButton(
              onPressed: () => _controller.reload(),
              icon: const Icon(Icons.refresh),
            ),
          ],
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_progress < 100)
              LinearProgressIndicator(value: _progress / 100),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  Icon(
                    _canGoBack ? Icons.arrow_back : Icons.home,
                    size: 14,
                    color: Colors.grey.shade600,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      _currentUrl,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: _hasError
                  ? Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _errorTitle(),
                              textAlign: TextAlign.center,
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _errorDescription(),
                              textAlign: TextAlign.center,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: 12),
                            FilledButton(
                              onPressed: _retryLoad,
                              child: const Text('다시 시도'),
                            ),
                          ],
                        ),
                      ),
                    )
                  : WebViewWidget(controller: _controller),
            ),
          ],
        ),
      ),
    );
  }
}
