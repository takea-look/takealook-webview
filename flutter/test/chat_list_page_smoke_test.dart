import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/features/chat/presentation/pages/chat_list_page.dart';

void main() {
  testWidgets('chat list page renders and supports refresh gesture', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ChatListPage()),
    );

    await tester.pump(const Duration(milliseconds: 400));

    expect(find.text('채팅방 목록'), findsWidgets);
    expect(find.byType(RefreshIndicator), findsOneWidget);

    final listFinder = find.byType(ListView);
    await tester.drag(listFinder.first, const Offset(0, 300));
    await tester.pump();
    await tester.pumpAndSettle(const Duration(milliseconds: 500));

    expect(find.textContaining('채팅방'), findsWidgets);
  });
}
