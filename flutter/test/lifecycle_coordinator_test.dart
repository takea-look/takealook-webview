import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/lifecycle/lifecycle_coordinator.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('emits refresh on resumed with debounce', () async {
    final coordinator = LifecycleCoordinator(resumeDebounce: const Duration(seconds: 2));
    coordinator.start();

    var count = 0;
    final sub = coordinator.onResumeRefresh.listen((_) => count++);

    coordinator.didChangeAppLifecycleState(AppLifecycleState.resumed);
    coordinator.didChangeAppLifecycleState(AppLifecycleState.resumed);
    await Future<void>.delayed(const Duration(milliseconds: 10));

    expect(count, 1);

    await sub.cancel();
    coordinator.stop();
  });
}
