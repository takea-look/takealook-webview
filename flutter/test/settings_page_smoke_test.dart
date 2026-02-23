import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/features/settings/presentation/pages/settings_page.dart';

void main() {
  testWidgets('settings page renders toggles and language selector', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: SettingsPage()),
    );

    expect(find.text('설정'), findsWidgets);
    expect(find.text('푸시 알림'), findsOneWidget);
    expect(find.text('마케팅 수신 동의'), findsOneWidget);
    expect(find.text('언어'), findsOneWidget);

    expect(find.text('정책/약관'), findsOneWidget);
    expect(find.text('로그아웃'), findsOneWidget);
  });
}
