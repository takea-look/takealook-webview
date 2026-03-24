import 'package:flutter/material.dart';

import '../../../../shared/widgets/state_placeholders.dart';

class MyPagePage extends StatefulWidget {
  const MyPagePage({super.key});

  static const routeName = '/mypage';

  @override
  State<MyPagePage> createState() => _MyPagePageState();
}

class _MyPagePageState extends State<MyPagePage> {
  final _nicknameController = TextEditingController();
  final _bioController = TextEditingController();

  bool _loading = true;
  bool _saving = false;
  int _failureCount = 0;
  AppErrorCase? _errorCase;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() {
      _loading = true;
      _errorCase = null;
    });

    await Future<void>.delayed(const Duration(milliseconds: 350));

    if (!mounted) return;
    setState(() {
      _nicknameController.text = 'takealook_user';
      _bioController.text = 'Flutter migration in progress';
      _loading = false;
      _failureCount = 0;
    });
  }

  Future<void> _saveProfile() async {
    if (_saving) return;

    setState(() {
      _saving = true;
      _errorCase = null;
    });

    await Future<void>.delayed(const Duration(milliseconds: 300));

    if (!mounted) return;

    if (_nicknameController.text.trim().toLowerCase() == 'expired') {
      setState(() {
        _saving = false;
        _errorCase = AppErrorCase.unauthorized;
        _failureCount += 1;
      });
      return;
    }

    setState(() {
      _saving = false;
      _failureCount = 0;
    });

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(const SnackBar(content: Text('프로필 저장 완료')));
  }

  @override
  void dispose() {
    _nicknameController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('마이페이지')),
        body: const LoadingPlaceholder(showCard: true, message: '프로필 불러오는 중...'),
      );
    }

    if (_errorCase != null && !_saving) {
      return Scaffold(
        appBar: AppBar(title: const Text('마이페이지')),
        body: RecoveryErrorPlaceholder(
          errorCase: _errorCase!,
          failureCount: _failureCount,
          onRetry: _errorCase == AppErrorCase.unauthorized
              ? () => Navigator.of(context).pushReplacementNamed('/login')
              : _loadProfile,
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('마이페이지')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('프로필 정보', style: TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          TextField(
            controller: _nicknameController,
            textInputAction: TextInputAction.next,
            decoration: const InputDecoration(
              labelText: '닉네임',
              helperText: '테스트: expired 입력 시 인증 만료 fallback',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _bioController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: '소개',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _saving ? null : _saveProfile,
            child: Text(_saving ? '저장 중...' : '저장'),
          ),
        ],
      ),
    );
  }
}
