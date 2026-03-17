import 'dart:async';

import 'package:flutter/material.dart';

import 'app/takealook_app.dart';
import 'core/di/service_locator.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  setupDependencies();

  FlutterError.onError = (details) {
    Zone.current.handleUncaughtError(details.exception, details.stack ?? StackTrace.empty);
  };

  runZonedGuarded(
    () => runApp(const TakeaLookApp()),
    (error, stackTrace) {
      // TODO(issue-170): wire crash reporting service.
      debugPrint('Unhandled zone error: $error');
      debugPrintStack(stackTrace: stackTrace);
    },
  );
}
