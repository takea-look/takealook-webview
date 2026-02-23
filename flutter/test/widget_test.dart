import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/config/deeplink_config.dart';

void main() {
  group('DeepLinkConfig.resolveToInitialWebUri', () {
    test('returns base url when incoming is null', () {
      final resolved = DeepLinkConfig.resolveToInitialWebUri(null);
      expect(resolved.scheme, 'https');
      expect(resolved.host, 'takealook.my');
    });

    test('maps takealook://web path and query', () {
      final incoming = Uri.parse('takealook://web?path=/mypage&tab=bookmark');
      final resolved = DeepLinkConfig.resolveToInitialWebUri(incoming);

      expect(resolved.path, '/mypage');
      expect(resolved.queryParameters['tab'], 'bookmark');
    });

    test('rejects unknown scheme', () {
      final incoming = Uri.parse('foo://bar');
      final resolved = DeepLinkConfig.resolveToInitialWebUri(incoming);
      expect(resolved.host, 'takealook.my');
    });
  });
}
