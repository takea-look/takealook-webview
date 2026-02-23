import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/di/service_locator.dart';
import 'package:takealook_webview_flutter/features/auth/presentation/pages/login_page.dart';

void main() {
  testWidgets('login button disabled until id/password entered', (tester) async {
    setupDependencies();

    await tester.pumpWidget(
      const MaterialApp(
        home: LoginPage(),
      ),
    );

    final buttonFinder = find.widgetWithText(FilledButton, 'ID/PW로 로그인');
    FilledButton button = tester.widget(buttonFinder);
    expect(button.onPressed, isNull);

    await tester.enterText(find.byType(TextField).first, 'user');
    await tester.enterText(find.byType(TextField).at(1), 'pw');
    await tester.pump();

    button = tester.widget(buttonFinder);
    expect(button.onPressed, isNotNull);
  });
}
