import 'package:flutter/material.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/chat/presentation/pages/chat_list_page.dart';
import '../../features/chat/presentation/pages/chat_room_page.dart';
import '../../features/mypage/presentation/pages/mypage_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';
import '../../features/webview/presentation/pages/webview_page.dart';

class AppRouter {
  static const initialRoute = WebviewPage.routeName;

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final name = settings.name ?? '';

    switch (name) {
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
      case LoginPage.routeName:
        return MaterialPageRoute<void>(builder: (_) => const LoginPage());
      case ChatListPage.routeName:
        return MaterialPageRoute<void>(builder: (_) => const ChatListPage());
      case MyPagePage.routeName:
        return MaterialPageRoute<void>(builder: (_) => const MyPagePage());
      case SettingsPage.routeName:
        return MaterialPageRoute<void>(builder: (_) => const SettingsPage());
      default:
        if (name.startsWith(ChatRoomPage.routePrefix)) {
          final roomId = name.replaceFirst(ChatRoomPage.routePrefix, '');
          return MaterialPageRoute<void>(
            builder: (_) => ChatRoomPage(roomId: roomId.isEmpty ? 'unknown' : roomId),
          );
        }

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
