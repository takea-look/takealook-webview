import 'package:flutter/material.dart';

class ChatRoomPage extends StatelessWidget {
  const ChatRoomPage({super.key, required this.roomId});

  final String roomId;

  static const routePrefix = '/chat/';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('채팅방 #$roomId')),
      body: const Center(child: Text('메시지 송수신 플로우 placeholder')),
    );
  }
}
