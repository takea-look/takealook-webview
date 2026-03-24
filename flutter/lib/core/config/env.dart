class Env {
  const Env._();

  static const String feBaseUrl =
      String.fromEnvironment('FE_BASE_URL', defaultValue: 'https://takealook.my');

  static const String apiBaseUrl =
      String.fromEnvironment('API_BASE_URL', defaultValue: 'https://s1.takealook.my');
}
