import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  static const routeName = '/settings';

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _pushEnabled = true;
  bool _marketingEnabled = false;
  String _language = 'ko';

  Future<void> _openPolicy() async {
    final uri = Uri.parse('https://takealook.my/policy');
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('로그아웃'),
        content: const Text('정말 로그아웃할까요?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('취소'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('로그아웃'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(const SnackBar(content: Text('로그아웃 처리됨 (placeholder)')));

    Navigator.of(context).pushReplacementNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('설정')),
      body: ListView(
        children: [
          const ListTile(
            title: Text('앱 버전'),
            subtitle: Text('v1.0.0-flutter'),
          ),
          const Divider(height: 1),
          Semantics(
            label: '푸시 알림 토글',
            child: SwitchListTile.adaptive(
              title: const Text('푸시 알림'),
              value: _pushEnabled,
              onChanged: (value) => setState(() => _pushEnabled = value),
            ),
          ),
          Semantics(
            label: '마케팅 수신 토글',
            child: SwitchListTile.adaptive(
              title: const Text('마케팅 수신 동의'),
              value: _marketingEnabled,
              onChanged: (value) => setState(() => _marketingEnabled = value),
            ),
          ),
          const Divider(height: 1),
          ListTile(
            title: const Text('언어'),
            subtitle: const Text('앱 표시 언어'),
            trailing: DropdownButton<String>(
              value: _language,
              onChanged: (value) {
                if (value == null) return;
                setState(() => _language = value);
              },
              items: const [
                DropdownMenuItem(value: 'ko', child: Text('한국어')),
                DropdownMenuItem(value: 'en', child: Text('English')),
              ],
            ),
          ),
          ListTile(
            title: const Text('정책/약관'),
            subtitle: const Text('외부 정책 페이지 열기'),
            trailing: const Icon(Icons.open_in_new),
            onTap: _openPolicy,
          ),
          const Divider(height: 1),
          ListTile(
            title: const Text('로그아웃'),
            textColor: Colors.red,
            iconColor: Colors.red,
            leading: const Icon(Icons.logout),
            onTap: _logout,
          ),
        ],
      ),
    );
  }
}
