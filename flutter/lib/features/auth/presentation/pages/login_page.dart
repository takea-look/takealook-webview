import 'package:flutter/material.dart';

import '../../../../core/theme/tds_theme.dart';
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

  bool _loading = false;
  int _failureCount = 0;
  AppErrorCase? _errorCase;

  bool get _disabled =>
      _idController.text.trim().isEmpty ||
      _pwController.text.trim().isEmpty ||
      _loading;

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
      appBar: AppBar(title: const Text('로그인', style: TdsTypography.title)),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(TdsSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('TakeaLook', style: TdsTypography.heading),
              const SizedBox(height: TdsSpacing.sm),
              Text('기존 Web 로그인 UX를 Flutter Native로 이관한 1차 화면입니다.',
                  style: theme.textTheme.bodyMedium),
              const SizedBox(height: TdsSpacing.xl),
              TextField(
                controller: _idController,
                textInputAction: TextInputAction.next,
                onChanged: (_) => setState(() {}),
                decoration: TdsComponentStyles.inputDecoration(hint: '아이디'),
              ),
              const SizedBox(height: TdsSpacing.md),
              TextField(
                controller: _pwController,
                obscureText: true,
                onChanged: (_) => setState(() {}),
                onSubmitted: (_) => _login(),
                decoration: TdsComponentStyles.inputDecoration(hint: '비밀번호')
                    .copyWith(
                        helperText: '테스트: id=expired 또는 timeout 입력 시 실패 UX 확인'),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _disabled ? null : _login,
                style: TdsComponentStyles.primaryButton(),
                child: Text(_loading ? '로그인 중...' : '로그인',
                    style: const TextStyle(fontWeight: FontWeight.w600)),
              ),
              const SizedBox(height: TdsSpacing.md),
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
