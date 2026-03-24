import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

class LifecycleCoordinator with WidgetsBindingObserver {
  LifecycleCoordinator({this.resumeDebounce = const Duration(seconds: 2)});

  final Duration resumeDebounce;

  final _resumeController = StreamController<void>.broadcast();
  DateTime? _lastResumeAt;

  Stream<void> get onResumeRefresh => _resumeController.stream;

  void start() {
    WidgetsBinding.instance.addObserver(this);
    _log('observer attached');
  }

  void stop() {
    WidgetsBinding.instance.removeObserver(this);
    _resumeController.close();
    _log('observer detached');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _log('state changed: $state');

    if (state == AppLifecycleState.resumed) {
      final now = DateTime.now();
      if (_lastResumeAt != null && now.difference(_lastResumeAt!) < resumeDebounce) {
        _log('resume ignored by debounce: ${now.difference(_lastResumeAt!).inMilliseconds}ms');
        return;
      }

      _lastResumeAt = now;
      _resumeController.add(null);
      _log('resume refresh event emitted');
    }
  }

  void _log(String message) {
    if (kDebugMode) {
      debugPrint('[LifecycleCoordinator] $message');
    }
  }
}
