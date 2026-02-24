import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../core/lifecycle/lifecycle_coordinator.dart';
import '../core/router/app_router.dart';
import '../core/theme/tds_theme.dart';

class TakeaLookApp extends StatefulWidget {
  const TakeaLookApp({super.key});

  @override
  State<TakeaLookApp> createState() => _TakeaLookAppState();
}

class _TakeaLookAppState extends State<TakeaLookApp> {
  final _navigatorKey = GlobalKey<NavigatorState>();
  final _lifecycle = LifecycleCoordinator();
  StreamSubscription<void>? _resumeSub;

  @override
  void initState() {
    super.initState();
    _lifecycle.start();

    // 복귀 시 refresh 정책:
    // - 현재 route 유지
    // - debounce 이후에만 refresh signal 발행
    _resumeSub = _lifecycle.onResumeRefresh.listen((_) {
      final currentRoute = ModalRoute.of(_navigatorKey.currentContext ?? context)?.settings.name;
      if (kDebugMode) {
        debugPrint('[TakeaLookApp] resume refresh policy route=$currentRoute');
      }
    });
  }

  @override
  void dispose() {
    _resumeSub?.cancel();
    _lifecycle.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TakeaLook',
      debugShowCheckedModeBanner: false,
      theme: TdsTheme.light(),
      navigatorKey: _navigatorKey,
      // Disable state restoration to avoid stale route stack resurrecting
      // previous sessions (which can skip login and hide bootstrap diagnostics).
      builder: (context, child) {
        final mq = MediaQuery.of(context);
        final clamped = mq.textScaler.clamp(minScaleFactor: 1.0, maxScaleFactor: 1.3);
        return MediaQuery(
          data: mq.copyWith(textScaler: clamped),
          child: child ?? const SizedBox.shrink(),
        );
      },
      onGenerateRoute: AppRouter.onGenerateRoute,
      initialRoute: AppRouter.initialRoute,
    );
  }
}
