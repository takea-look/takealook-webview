import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  static const routeName = '/login';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('로그인')),
      body: Center(
        child: FilledButton(
          onPressed: () => Navigator.of(context).pushReplacementNamed('/chat'),
          child: const Text('토스 로그인 (placeholder)'),
        ),
      ),
    );
  }
}
