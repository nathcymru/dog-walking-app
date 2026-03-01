/// Environment configuration pulled from --dart-define.
class AppEnv {
  static const String env =
      String.fromEnvironment('APP_ENV', defaultValue: 'dev');
  static const String apiBaseUrl =
      String.fromEnvironment('API_BASE_URL', defaultValue: '');
  static const bool enableNetworkLogs = bool.fromEnvironment(
    'ENABLE_NETWORK_LOGS',
    defaultValue: false,
  );
  static void assertValid() {
    if (apiBaseUrl.isEmpty) {
      throw StateError(
        'API_BASE_URL is empty. Provide --dart-define=API_BASE_URL=https://...',
      );
    }
  }
}
