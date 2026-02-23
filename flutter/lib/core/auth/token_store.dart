abstract class TokenStore {
  Future<void> save({required String accessToken, required String refreshToken});
  Future<AuthTokenPair?> read();
  Future<void> clear();
}

class AuthTokenPair {
  const AuthTokenPair({required this.accessToken, required this.refreshToken});

  final String accessToken;
  final String refreshToken;
}

class InMemoryTokenStore implements TokenStore {
  AuthTokenPair? _token;

  @override
  Future<void> clear() async {
    _token = null;
  }

  @override
  Future<AuthTokenPair?> read() async => _token;

  @override
  Future<void> save({required String accessToken, required String refreshToken}) async {
    _token = AuthTokenPair(accessToken: accessToken, refreshToken: refreshToken);
  }
}
