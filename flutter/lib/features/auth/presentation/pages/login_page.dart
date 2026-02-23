import 'package:flutter/material.dart';

import '../../../../core/auth/auth_session_manager.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../shared/widgets/state_placeholders.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  static const routeName = '/login';

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _idController = TextEditingController();
  final _pwController = TextEditingController();
  late final AuthSessionManager _auth;

  bool _loading = false;
  int _failureCount = 0;
  AppErrorCase? _errorCase;

  @override
  void initState() {
    super.initState();
    _auth = ServiceLocator.instance.get<AuthSessionManager>();
    _auth.restoreSession();
  }

  bool get _disabled => _idController.text.trim().isEmpty || _pwController.text.trim().isEmpty || _loading;

  Future<void> _login() async {
    if (_disabled) return;

    setState(() {
      _loading = true;
      _errorCase = null;
    });

    await Future<void>.delayed(const Duration(milliseconds: 320));
    if (!mounted) return;

    final id = _idController.text.trim().toLowerCase();
    if (id == 'expired') {
      await _auth.expireSession();
      if (!_auth.shouldHandleUnauthorized()) {
        setState(() {
          _loading = false;
        });
        return;
      }

      setState(() {
        _loading = false;
        _errorCase = AppErrorCase.unauthorized;
        _failureCount += 1;
      });
      return;
    }

    if (id == 'timeout') {
      setState(() {
        _loading = false;
        _errorCase = AppErrorCase.timeout;
        _failureCount += 1;
      });
      return;
    }

    await _auth.saveTokens(accessToken: 'mock_access_$id', refreshToken: 'mock_refresh_$id');

    setState(() {
      _loading = false;
      _failureCount = 0;
    });

    Navigator.of(context).pushReplacementNamed('/chat');
  }

  @override
  void dispose() {
    _idController.dispose();
    _pwController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('로그인')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('TakeaLook', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text('기존 Web 로그인 UX를 Flutter Native로 이관한 1차 화면입니다.', style: theme.textTheme.bodyMedium),
              const SizedBox(height: 20),
              TextField(
                controller: _idController,
                textInputAction: TextInputAction.next,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  labelText: '아이디',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _pwController,
                obscureText: true,
                onChanged: (_) => setState(() {}),
                onSubmitted: (_) => _login(),
                decoration: const InputDecoration(
                  labelText: '비밀번호',
                  border: OutlineInputBorder(),
                  helperText: '테스트: id=expired 또는 timeout 입력 시 실패 UX 확인',
                ),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _disabled ? null : _login,
                child: Text(_loading ? '로그인 중...' : '로그인'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _loading
                    ? null
                    : () {
                        _idController.clear();
                        _pwController.clear();
                        setState(() {
                          _errorCase = null;
                        });
                      },
                child: const Text('다시 입력'),
              ),
              if (_errorCase != null) ...[
                const SizedBox(height: 16),
                Expanded(
                  child: RecoveryErrorPlaceholder(
                    errorCase: _errorCase!,
                    failureCount: _failureCount,
                    onRetry: _login,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
