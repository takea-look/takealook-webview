import 'package:flutter/material.dart';

import '../../features/webview/presentation/pages/webview_page.dart';

class AppRouter {
  static const initialRoute = WebviewPage.routeName;

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case WebviewPage.routeName:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const WebviewPage(),
        );
      default:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => Scaffold(
            appBar: AppBar(title: const Text('Route Error')),
            body: Center(
              child: Text('Unknown route: ${settings.name}'),
            ),
          ),
        );
    }
  }
}
