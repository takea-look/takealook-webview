import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:app_links/app_links.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../../../../core/theme/tds_theme.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../../core/config/deeplink_config.dart';
import '../../../../core/config/env.dart';
import '../../../../shared/widgets/state_placeholders.dart';

class WebviewPage extends StatefulWidget {
  const WebviewPage({super.key, this.initialUri});

  static const routeName = '/';

  final Uri? initialUri;

  @override
  State<WebviewPage> createState() => _WebviewPageState();
}

class _WebviewPageState extends State<WebviewPage> {
  late final WebViewController _controller;

  final AppLinks _appLinks = AppLinks();
  StreamSubscription<Uri>? _deepLinkSub;

  int _progress = 0;
  String _currentUrl = Env.feBaseUrl;
  bool _hasError = false;
  bool _canGoBack = false;
  DateTime? _lastBackPressedAt;
  bool _isHandlingBack = false;

  AppErrorCase _errorCase = AppErrorCase.unknown;
  int _consecutiveFailures = 0;

  @override
  void initState() {
    super.initState();

    final initialTarget =
        DeepLinkConfig.resolveToInitialWebUri(widget.initialUri);
    final initialRouteTarget = DeepLinkConfig.resolveToAppTarget(
      widget.initialUri,
      mode: DeepLinkStartMode.cold,
    );
    _logDev('cold-start deep link route: ${initialRouteTarget.toRoutePath()}');

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'TakeaLookBridge',
        onMessageReceived: (message) {
          _handleBridgeMessage(message.message);
        },
      )
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
              _errorCase = AppErrorCase.unknown;
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
            final errorCase = _classifyError(error);
            _logDev(
                'error(${error.errorCode}): ${error.description} -> $errorCase');
            if (!mounted) return;
            setState(() {
              _hasError = true;
              _errorCase = errorCase;
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
      ..loadRequest(initialTarget);

    _bindDeepLinks();
  }

  Future<void> _bindDeepLinks() async {
    final initialLink = await _appLinks.getInitialLink();
    if (initialLink != null) {
      final target = DeepLinkConfig.resolveToInitialWebUri(initialLink);
      _logDev('initial link resolved: $initialLink -> $target');
      await _controller.loadRequest(target);
    }

    _deepLinkSub = _appLinks.uriLinkStream.listen((uri) async {
      final target = DeepLinkConfig.resolveToInitialWebUri(uri);
      final routeTarget = DeepLinkConfig.resolveToAppTarget(
        uri,
        mode: DeepLinkStartMode.warm,
      );
      _logDev('warm-start deep link route: ${routeTarget.toRoutePath()}');
      _logDev('incoming link resolved: $uri -> $target');
      await _controller.loadRequest(target);
    });
  }

  void _handleBridgeMessage(String rawMessage) {
    try {
      final decoded = jsonDecode(rawMessage) as Map<String, dynamic>;
      final type = decoded['type'] as String? ?? 'unknown';
      _logDev('bridge message type=$type');

      // 브릿지 인터페이스 초안:
      // {"type":"session.sync","payload":{...},"requestId":"..."}
      // {"type":"route.push","payload":{"path":"/foo"},"requestId":"..."}
      // {"type":"error","code":"BRIDGE_INVALID_PAYLOAD","message":"..."}
    } catch (_) {
      _logDev('bridge error: BRIDGE_INVALID_PAYLOAD');
    }
  }

  void _logDev(String message) {
    if (kDebugMode) {
      debugPrint('[WebView] $message');
    }
  }

  AppErrorCase _classifyError(WebResourceError error) {
    final desc = error.description.toLowerCase();
    final code = error.errorCode;

    if (desc.contains('timeout') || code == -8) {
      return AppErrorCase.timeout;
    }

    if (desc.contains('unauthorized') || code == 401 || code == 403) {
      return AppErrorCase.unauthorized;
    }

    if (desc.contains('dns') ||
        desc.contains('name not resolved') ||
        desc.contains('internet') ||
        desc.contains('network') ||
        code == -2) {
      return AppErrorCase.network;
    }

    return AppErrorCase.unknown;
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
  void dispose() {
    _deepLinkSub?.cancel();
    super.dispose();
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
          title: const Text('TakeaLook WebView', style: TdsTypography.title),
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
              padding: const EdgeInsets.symmetric(
                  horizontal: TdsSpacing.md, vertical: TdsSpacing.sm),
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
                  ? RecoveryErrorPlaceholder(
                      errorCase: _errorCase,
                      failureCount: _consecutiveFailures,
                      onRetry: _retryLoad,
                    )
                  : WebViewWidget(controller: _controller),
            ),
          ],
        ),
      ),
    );
  }
}
