import 'env.dart';

enum DeepLinkStartMode { cold, warm }

enum DeepLinkRoute {
  home('/'),
  chat('/chat'),
  chatRoom('/chat/:id'),
  myPage('/mypage'),
  settings('/settings');

  const DeepLinkRoute(this.pattern);
  final String pattern;
}

class DeepLinkTarget {
  const DeepLinkTarget({
    required this.route,
    required this.path,
    this.params = const {},
    this.mode = DeepLinkStartMode.warm,
  });

  final DeepLinkRoute route;
  final String path;
  final Map<String, String> params;
  final DeepLinkStartMode mode;

  String toRoutePath() {
    return switch (route) {
      DeepLinkRoute.chatRoom => '/chat/${params['id'] ?? ''}',
      _ => path,
    };
  }
}

class DeepLinkConfig {
  const DeepLinkConfig._();

  static const allowedSchemes = {'http', 'https', 'takealook', 'intoss-private'};

  static Uri resolveToInitialWebUri(Uri? incoming) {
    final base = Uri.parse(Env.feBaseUrl);
    if (incoming == null) return base;

    final target = resolveToAppTarget(incoming, mode: DeepLinkStartMode.cold);
    return base.replace(
      path: target.path,
      queryParameters: target.params.isEmpty ? null : target.params,
    );
  }

  static DeepLinkTarget resolveToAppTarget(
    Uri? incoming, {
    required DeepLinkStartMode mode,
  }) {
    if (incoming == null || !allowedSchemes.contains(incoming.scheme)) {
      return DeepLinkTarget(route: DeepLinkRoute.home, path: '/', mode: mode);
    }

    final normalizedPath = _normalizePath(incoming);
    final segments = normalizedPath.split('/').where((e) => e.isNotEmpty).toList();

    if (segments.isEmpty) {
      return DeepLinkTarget(route: DeepLinkRoute.home, path: '/', mode: mode);
    }

    if (segments.first == 'chat' && segments.length >= 2) {
      final roomId = segments[1];
      if (roomId.isEmpty) {
        return DeepLinkTarget(route: DeepLinkRoute.chat, path: '/chat', mode: mode);
      }
      return DeepLinkTarget(
        route: DeepLinkRoute.chatRoom,
        path: '/chat/$roomId',
        params: {'id': roomId},
        mode: mode,
      );
    }

    if (segments.first == 'chat') {
      return DeepLinkTarget(route: DeepLinkRoute.chat, path: '/chat', mode: mode);
    }

    if (segments.first == 'mypage') {
      return DeepLinkTarget(route: DeepLinkRoute.myPage, path: '/mypage', mode: mode);
    }

    if (segments.first == 'settings') {
      return DeepLinkTarget(route: DeepLinkRoute.settings, path: '/settings', mode: mode);
    }

    return DeepLinkTarget(route: DeepLinkRoute.home, path: '/', mode: mode);
  }

  static String _normalizePath(Uri incoming) {
    if (incoming.scheme == 'takealook') {
      if (incoming.host != 'web') return '/';
      return incoming.queryParameters['path'] ?? '/';
    }

    if (incoming.scheme == 'intoss-private') {
      final path = incoming.queryParameters['path'];
      if (path != null && path.startsWith('/')) return path;
      if (incoming.path.isNotEmpty) return incoming.path;
      return '/';
    }

    if (incoming.scheme == 'http' || incoming.scheme == 'https') {
      final base = Uri.parse(Env.feBaseUrl);
      if (incoming.host != base.host) return '/';
      return incoming.path.isEmpty ? '/' : incoming.path;
    }

    return '/';
  }
}
