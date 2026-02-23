import 'package:flutter/material.dart';

class MyPagePage extends StatelessWidget {
  const MyPagePage({super.key});

  static const routeName = '/mypage';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('마이페이지')),
      body: const Center(child: Text('프로필 조회/수정 placeholder')),
    );
  }
}
