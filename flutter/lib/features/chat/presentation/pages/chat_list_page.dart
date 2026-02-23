import 'package:flutter/material.dart';

class ChatListPage extends StatelessWidget {
  const ChatListPage({super.key});

  static const routeName = '/chat';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('채팅방 목록')),
      body: ListView.separated(
        itemCount: 8,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (_, i) => ListTile(
          title: Text('채팅방 ${i + 1}'),
          subtitle: const Text('메시지 미리보기 (placeholder)'),
          onTap: () => Navigator.of(context).pushNamed('/chat/${i + 1}'),
        ),
      ),
    );
  }
}
