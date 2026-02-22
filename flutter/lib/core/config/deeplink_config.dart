import 'env.dart';

class DeepLinkConfig {
  const DeepLinkConfig._();

  static const allowedSchemes = {'http', 'https', 'takealook'};

  static Uri resolveToInitialWebUri(Uri? incoming) {
    if (incoming == null) {
      return Uri.parse(Env.feBaseUrl);
    }

    if (!allowedSchemes.contains(incoming.scheme)) {
      return Uri.parse(Env.feBaseUrl);
    }

    // 앱 스킴 예시: takealook://web?path=/mypage&tab=bookmark
    if (incoming.scheme == 'takealook') {
      if (incoming.host != 'web') {
        return Uri.parse(Env.feBaseUrl);
      }

      final path = incoming.queryParameters['path'] ?? '/';
      final forwardedParams = Map<String, String>.from(incoming.queryParameters)
        ..remove('path');

      return Uri.parse(Env.feBaseUrl).replace(
        path: path,
        queryParameters: forwardedParams.isEmpty ? null : forwardedParams,
      );
    }

    // http/https는 같은 도메인일 때만 내부 라우팅 허용
    final base = Uri.parse(Env.feBaseUrl);
    if (incoming.host == base.host) {
      return incoming;
    }

    return Uri.parse(Env.feBaseUrl);
  }
}
