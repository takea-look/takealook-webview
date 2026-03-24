import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';

enum BridgeErrorCode {
  initFailed,
  timeout,
  invalidPayload,
  unsupportedType,
  hostFailure,
}

class BridgeRequest {
  const BridgeRequest({
    required this.requestId,
    required this.type,
    required this.payload,
  });

  final String requestId;
  final String type;
  final Map<String, dynamic> payload;

  Map<String, dynamic> toJson() => {
        'requestId': requestId,
        'type': type,
        'payload': payload,
      };
}

class BridgeResponse {
  const BridgeResponse({
    required this.requestId,
    required this.ok,
    this.payload,
    this.errorCode,
    this.errorMessage,
  });

  final String requestId;
  final bool ok;
  final Map<String, dynamic>? payload;
  final BridgeErrorCode? errorCode;
  final String? errorMessage;

  factory BridgeResponse.fromJson(Map<String, dynamic> json) {
    final codeRaw = json['code'] as String?;
    BridgeErrorCode? code;
    for (final item in BridgeErrorCode.values) {
      if (item.name == codeRaw) {
        code = item;
        break;
      }
    }

    return BridgeResponse(
      requestId: json['requestId']?.toString() ?? '',
      ok: json['ok'] == true,
      payload: json['payload'] is Map<String, dynamic> ? json['payload'] as Map<String, dynamic> : null,
      errorCode: code,
      errorMessage: json['message']?.toString(),
    );
  }
}

class AppsInTossBridgeAdapter {
  AppsInTossBridgeAdapter({this.timeout = const Duration(seconds: 5)});

  final Duration timeout;

  bool _initialized = false;
  int _seq = 0;
  final Map<String, Completer<BridgeResponse>> _pending = {};

  void init() {
    try {
      _initialized = true;
      _log('bridge init success');
    } catch (e) {
      _initialized = false;
      _log('bridge init failed: $e');
    }
  }

  bool get initialized => _initialized;

  BridgeRequest buildRequest({
    required String type,
    Map<String, dynamic> payload = const {},
  }) {
    final requestId = 'req_${DateTime.now().millisecondsSinceEpoch}_${_seq++}';
    return BridgeRequest(requestId: requestId, type: type, payload: payload);
  }

  Future<BridgeResponse> registerPendingAndWait(BridgeRequest req) {
    final completer = Completer<BridgeResponse>();
    _pending[req.requestId] = completer;

    Future<void>.delayed(timeout, () {
      if (!completer.isCompleted) {
        completer.complete(
          BridgeResponse(
            requestId: req.requestId,
            ok: false,
            errorCode: BridgeErrorCode.timeout,
            errorMessage: 'bridge response timeout',
          ),
        );
        _pending.remove(req.requestId);
      }
    });

    return completer.future;
  }

  void handleIncomingRawMessage(String raw) {
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map<String, dynamic>) {
        _log('invalid payload shape');
        return;
      }

      final response = BridgeResponse.fromJson(decoded);
      final completer = _pending.remove(response.requestId);
      if (completer == null) {
        _log('orphan response: ${response.requestId}');
        return;
      }
      completer.complete(response);
    } catch (e) {
      _log('invalid payload parse: $e');
    }
  }

  void _log(String message) {
    if (kDebugMode) {
      debugPrint('[AppsInTossBridge] $message');
    }
  }
}
