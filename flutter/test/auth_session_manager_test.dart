import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/auth/auth_session_manager.dart';
import 'package:takealook_webview_flutter/core/auth/token_store.dart';

void main() {
  test('restores unauthenticated when token missing', () async {
    final manager = AuthSessionManager(InMemoryTokenStore());
    await manager.restoreSession();
    expect(manager.current, AuthStatus.unauthenticated);
  });

  test('save token and expire transitions', () async {
    final manager = AuthSessionManager(InMemoryTokenStore());

    await manager.saveTokens(accessToken: 'a', refreshToken: 'r');
    expect(manager.current, AuthStatus.authenticated);

    await manager.expireSession();
    expect(manager.current, AuthStatus.expired);
  });

  test('unauthorized throttle prevents duplicate handling', () {
    final manager = AuthSessionManager(InMemoryTokenStore());

    final first = manager.shouldHandleUnauthorized();
    final second = manager.shouldHandleUnauthorized();

    expect(first, isTrue);
    expect(second, isFalse);
  });
}
