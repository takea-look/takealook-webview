import 'package:flutter/material.dart';

import '../../features/webview/presentation/pages/webview_page.dart';

class AppRouter {
  static const initialRoute = WebviewPage.routeName;

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case WebviewPage.routeName:
        final incomingUri = switch (settings.arguments) {
          final Uri uri => uri,
          final String text => Uri.tryParse(text),
          _ => null,
        };

        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => WebviewPage(initialUri: incomingUri),
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
