import 'package:flutter/foundation.dart';

import '../config/env.dart';

class AppDependencies {
  const AppDependencies({
    required this.feBaseUrl,
    required this.apiBaseUrl,
  });

  final String feBaseUrl;
  final String apiBaseUrl;
}

class ServiceLocator {
  ServiceLocator._();

  static final ServiceLocator _instance = ServiceLocator._();

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
  final locator = ServiceLocator.instance;
  if (!locator.has<AppDependencies>()) {
    locator.registerSingleton<AppDependencies>(
      const AppDependencies(
        feBaseUrl: Env.feBaseUrl,
        apiBaseUrl: Env.apiBaseUrl,
      ),
    );
  }

  if (kDebugMode) {
    // ignore: avoid_print
    print('ServiceLocator initialized');
  }
}
