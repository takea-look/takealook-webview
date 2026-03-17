import 'dart:async';

import 'token_store.dart';

enum AuthStatus { unknown, authenticated, unauthenticated, expired }

class AuthSessionManager {
  AuthSessionManager(this._store);

  final TokenStore _store;

  final _status = StreamController<AuthStatus>.broadcast();
  AuthStatus _current = AuthStatus.unknown;
  DateTime? _lastUnauthorizedHandledAt;

  Stream<AuthStatus> get statusChanges => _status.stream;
  AuthStatus get current => _current;

  Future<void> restoreSession() async {
    final token = await _store.read();
    _setStatus(token == null ? AuthStatus.unauthenticated : AuthStatus.authenticated);
  }

  Future<void> saveTokens({required String accessToken, required String refreshToken}) async {
    await _store.save(accessToken: accessToken, refreshToken: refreshToken);
    _setStatus(AuthStatus.authenticated);
  }

  Future<void> expireSession() async {
    await _store.clear();
    _setStatus(AuthStatus.expired);
  }

  Future<void> logout() async {
    await _store.clear();
    _setStatus(AuthStatus.unauthenticated);
  }

  bool shouldHandleUnauthorized({Duration throttle = const Duration(milliseconds: 700)}) {
    final now = DateTime.now();
    if (_lastUnauthorizedHandledAt != null && now.difference(_lastUnauthorizedHandledAt!) < throttle) {
      return false;
    }
    _lastUnauthorizedHandledAt = now;
    return true;
  }

  void _setStatus(AuthStatus next) {
    _current = next;
    _status.add(next);
  }
}
