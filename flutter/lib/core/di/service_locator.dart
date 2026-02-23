import 'package:flutter/foundation.dart';

import '../auth/auth_session_manager.dart';
import '../auth/token_store.dart';

/// App-level dependency entrypoint.
///
/// Keep this lightweight: avoid pulling in global state management libs now.
/// When a feature grows, register factories/services here and inject
/// via constructors from feature-level composition points.
class ServiceLocator {
  static final ServiceLocator _instance = ServiceLocator._internal();

  ServiceLocator._internal();

  static ServiceLocator get instance => _instance;

  final Map<Type, Object> _singletons = {};

  void resetForTest() {
    _singletons.clear();
  }

  void registerSingleton<T extends Object>(T instance) {
    _singletons[T] = instance;
  }

  T get<T extends Object>() {
    final value = _singletons[T];
    if (value == null) {
      throw StateError('Dependency not registered for type: $T');
    }
    return value as T;
  }

  bool has<T extends Object>() => _singletons.containsKey(T);
}

void setupDependencies() {
  final sl = ServiceLocator.instance;

  if (!sl.has<TokenStore>()) {
    sl.registerSingleton<TokenStore>(InMemoryTokenStore());
  }

  if (!sl.has<AuthSessionManager>()) {
    sl.registerSingleton<AuthSessionManager>(AuthSessionManager(sl.get<TokenStore>()));
  }

  if (kDebugMode) {
    // ignore: avoid_print
    print('ServiceLocator initialized');
  }
}
