import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/lifecycle/lifecycle_coordinator.dart';

void main() {
  testWidgets('emits refresh on resumed with debounce', (tester) async {
    final coordinator = LifecycleCoordinator(resumeDebounce: const Duration(seconds: 2));
    coordinator.start();

    var count = 0;
    final sub = coordinator.onResumeRefresh.listen((_) => count++);

    coordinator.didChangeAppLifecycleState(AppLifecycleState.resumed);
    coordinator.didChangeAppLifecycleState(AppLifecycleState.resumed);

    expect(count, 1);

    await sub.cancel();
    coordinator.stop();
  });
}
