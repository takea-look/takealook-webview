import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import '../../../../core/config/env.dart';

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
            debugPrint('[WebView] started: $url');
            if (!mounted) return;
            setState(() {
              _hasError = false;
              _currentUrl = url;
            });
          },
          onPageFinished: (url) {
            debugPrint('[WebView] finished: $url');
            if (!mounted) return;
            setState(() {
              _currentUrl = url;
            });
          },
          onWebResourceError: (error) {
            debugPrint('[WebView] error: ${error.description}');
            if (!mounted) return;
            setState(() {
              _hasError = true;
            });
          },
          onNavigationRequest: (request) {
            final uri = Uri.tryParse(request.url);
            if (uri == null) {
              return NavigationDecision.prevent;
            }

            final isHttpScheme = uri.scheme == 'http' || uri.scheme == 'https';

            // openWindow 대체 정책:
            // - http/https: 동일 WebView 내부 이동 허용
            // - 그 외 스킴: 외부 앱/브라우저로 위임
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
            child: Text(
              _currentUrl,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
          Expanded(
            child: _hasError
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('페이지를 불러오지 못했습니다.'),
                        const SizedBox(height: 12),
                        FilledButton(
                          onPressed: () {
                            setState(() {
                              _hasError = false;
                            });
                            _controller.loadRequest(Uri.parse(Env.feBaseUrl));
                          },
                          child: const Text('다시 시도'),
                        ),
                      ],
                    ),
                  )
                : WebViewWidget(controller: _controller),
          ),
        ],
      ),
    );
  }
}
