import 'package:flutter/material.dart';

import '../../../../core/config/env.dart';
import '../../../../shared/widgets/state_placeholders.dart';

class WebviewPage extends StatelessWidget {
  const WebviewPage({super.key});

  static const routeName = '/';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('TakeaLook WebView MVP')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('FE_BASE_URL: ${Env.feBaseUrl}'),
            const SizedBox(height: 8),
            Text('API_BASE_URL: ${Env.apiBaseUrl}'),
            const SizedBox(height: 24),
            const Expanded(
              child: LoadingPlaceholder(
                message: 'WebView 모듈 연결 준비 중',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
