import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../../../core/auth/auth_session_manager.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/theme/tds_theme.dart';
import '../../../../features/auth/data/auth_api.dart';
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
  late final AuthApi _authApi;

  bool _loading = false;
  int _failureCount = 0;
  AppErrorCase? _errorCase;
  String? _errorMessage;

  bool _probeSwitch = true;
  bool _probeCheck = false;
  double _probeSlider = 30;
  String _probeDropdown = 'A';

  @override
  void initState() {
    super.initState();
    _auth = ServiceLocator.instance.get<AuthSessionManager>();
    _authApi = ServiceLocator.instance.get<AuthApi>();
    _auth.restoreSession();
  }

  bool get _disabled =>
      _idController.text.trim().isEmpty ||
      _pwController.text.trim().isEmpty ||
      _loading;

  Future<void> _login() async {
    if (_disabled) return;

    setState(() {
      _loading = true;
      _errorCase = null;
      _errorMessage = null;
    });

    try {
      final username = _idController.text.trim();
      final password = _pwController.text;

      final response = await _authApi.signin(username: username, password: password);
      if (response.accessToken.isEmpty) {
        throw DioException(
          requestOptions: RequestOptions(path: '/auth/signin'),
          type: DioExceptionType.badResponse,
          response: Response(
            requestOptions: RequestOptions(path: '/auth/signin'),
            statusCode: 500,
          ),
          message: 'Missing accessToken in signin response',
        );
      }

      await _auth.saveTokens(
        accessToken: response.accessToken,
        refreshToken: response.refreshToken ?? '',
      );
      await _authApi.getAuthMe(accessToken: response.accessToken);

      if (!mounted) return;
      Navigator.of(context).pushNamedAndRemoveUntil('/chat', (route) => false);
    } on DioException catch (e) {
      if (!mounted) return;
      final status = e.response?.statusCode;

      setState(() {
        _failureCount += 1;
        if (status == 401) {
          _errorCase = AppErrorCase.unauthorized;
          _errorMessage = '아이디/비밀번호를 확인해주세요.';
        } else if (e.type == DioExceptionType.connectionTimeout ||
            e.type == DioExceptionType.receiveTimeout ||
            e.type == DioExceptionType.sendTimeout) {
          _errorCase = AppErrorCase.timeout;
          _errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        } else {
          _errorCase = AppErrorCase.network;
          _errorMessage = '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
        }
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
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
      backgroundColor: TdsColor.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: TdsSpacing.lg),
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  children: [
                    const SizedBox(height: TdsSpacing.xxl),
                    Center(
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: TdsColor.primaryBlue.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(26),
                        ),
                        alignment: Alignment.center,
                        child: const Icon(Icons.camera_alt_rounded, color: TdsColor.primaryBlue, size: 38),
                      ),
                    ),
                    const SizedBox(height: TdsSpacing.lg),
                    const Center(
                      child: Text(
                        '떼껄룩에 로그인하세요',
                        style: TdsTypography.heading,
                      ),
                    ),
                    const SizedBox(height: TdsSpacing.sm),
                    const Center(
                      child: Text(
                        'ID/PW로 로그인할 수 있어요',
                        style: TdsTypography.body,
                      ),
                    ),
                    const SizedBox(height: TdsSpacing.xl),
                    Container(
                      padding: const EdgeInsets.all(TdsSpacing.lg),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFCFCFD),
                        borderRadius: BorderRadius.circular(TdsRadius.lg),
                        border: Border.all(color: TdsColor.line),
                      ),
                      child: Column(
                        children: [
                          TextField(
                            controller: _idController,
                            textInputAction: TextInputAction.next,
                            onChanged: (_) => setState(() {}),
                            enabled: !_loading,
                            decoration: TdsComponentStyles.inputDecoration(hint: '아이디'),
                          ),
                          const SizedBox(height: TdsSpacing.sm),
                          TextField(
                            controller: _pwController,
                            obscureText: true,
                            enabled: !_loading,
                            onChanged: (_) => setState(() {}),
                            onSubmitted: (_) => _login(),
                            decoration: TdsComponentStyles.inputDecoration(hint: '비밀번호'),
                          ),
                          const SizedBox(height: TdsSpacing.md),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _disabled ? null : _login,
                              style: TdsComponentStyles.primaryButton(),
                              child: Text(_loading ? '로그인 중...' : 'ID/PW로 로그인'),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (_errorCase != null) ...[
                      const SizedBox(height: TdsSpacing.md),
                      Text(
                        _errorMessage ?? '로그인에 실패했습니다.',
                        style: theme.textTheme.bodyMedium?.copyWith(color: TdsColor.error),
                      ),
                      const SizedBox(height: TdsSpacing.md),
                      RecoveryErrorPlaceholder(
                        errorCase: _errorCase!,
                        failureCount: _failureCount,
                        onRetry: _login,
                      ),
                    ],

                    const SizedBox(height: TdsSpacing.lg),
                    Container(
                      padding: const EdgeInsets.all(TdsSpacing.md),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF4E5),
                        border: Border.all(color: TdsColor.warning, width: 2),
                        borderRadius: BorderRadius.circular(TdsRadius.md),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'UI Probe Panel (디버그)',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: TdsSpacing.sm),
                          const Text(
                            '이 패널이 보이면 Flutter 렌더링은 정상입니다.',
                            style: TdsTypography.small,
                          ),
                          const SizedBox(height: TdsSpacing.sm),
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {},
                                  child: const Text('Outlined'),
                                ),
                              ),
                              const SizedBox(width: TdsSpacing.sm),
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {},
                                  child: const Text('Elevated'),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: TdsSpacing.sm),
                          SwitchListTile.adaptive(
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            title: const Text('Switch Test', style: TdsTypography.body),
                            value: _probeSwitch,
                            onChanged: (v) => setState(() => _probeSwitch = v),
                          ),
                          CheckboxListTile(
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            title: const Text('Checkbox Test', style: TdsTypography.body),
                            value: _probeCheck,
                            onChanged: (v) => setState(() => _probeCheck = v ?? false),
                          ),
                          const SizedBox(height: TdsSpacing.sm),
                          DropdownButtonFormField<String>(
                            value: _probeDropdown,
                            items: const [
                              DropdownMenuItem(value: 'A', child: Text('Option A')),
                              DropdownMenuItem(value: 'B', child: Text('Option B')),
                            ],
                            onChanged: (v) => setState(() => _probeDropdown = v ?? 'A'),
                            decoration: TdsComponentStyles.inputDecoration(hint: 'Dropdown Test'),
                          ),
                          const SizedBox(height: TdsSpacing.sm),
                          Text('Slider: ${_probeSlider.toStringAsFixed(0)}', style: TdsTypography.body),
                          Slider(
                            value: _probeSlider,
                            min: 0,
                            max: 100,
                            onChanged: (v) => setState(() => _probeSlider = v),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: TdsSpacing.lg),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
