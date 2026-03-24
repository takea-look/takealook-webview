import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/di/service_locator.dart';
import 'package:takealook_webview_flutter/features/auth/presentation/pages/login_page.dart';

void main() {
  testWidgets('login page renders without errors', (tester) async {
    setupDependencies();

    // Just verify page can be pumped without throwing exceptions
    // This is a basic smoke test to ensure LoginPage is not completely broken
    await tester.pumpWidget(
      const MaterialApp(
        home: LoginPage(),
      ),
    );

    // Wait for the widget tree to settle
    await tester.pumpAndSettle();
    
    // Basic sanity check - verify scaffold exists
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
