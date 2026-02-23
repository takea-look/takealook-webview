import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/config/deeplink_config.dart';

void main() {
  group('DeepLinkConfig.resolveToAppTarget', () {
    test('maps intoss-private chat room path', () {
      final uri = Uri.parse('intoss-private://open?path=/chat/42');
      final target = DeepLinkConfig.resolveToAppTarget(
        uri,
        mode: DeepLinkStartMode.cold,
      );

      expect(target.route, DeepLinkRoute.chatRoom);
      expect(target.toRoutePath(), '/chat/42');
      expect(target.params['id'], '42');
      expect(target.mode, DeepLinkStartMode.cold);
    });

    test('maps takealook web path to mypage', () {
      final uri = Uri.parse('takealook://web?path=/mypage');
      final target = DeepLinkConfig.resolveToAppTarget(
        uri,
        mode: DeepLinkStartMode.warm,
      );

      expect(target.route, DeepLinkRoute.myPage);
      expect(target.toRoutePath(), '/mypage');
      expect(target.mode, DeepLinkStartMode.warm);
    });

    test('falls back safely for invalid path', () {
      final uri = Uri.parse('intoss-private://open?path=/unknown/path');
      final target = DeepLinkConfig.resolveToAppTarget(
        uri,
        mode: DeepLinkStartMode.warm,
      );

      expect(target.route, DeepLinkRoute.home);
      expect(target.toRoutePath(), '/');
    });
  });
}
