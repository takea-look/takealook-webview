import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:takealook_webview_flutter/core/bridge/apps_in_toss_bridge.dart';

void main() {
  test('requestId correlation completes pending future', () async {
    final adapter = AppsInTossBridgeAdapter(timeout: const Duration(seconds: 1));
    adapter.init();

    final req = adapter.buildRequest(type: 'session.sync', payload: {'foo': 'bar'});
    final future = adapter.registerPendingAndWait(req);

    adapter.handleIncomingRawMessage(
      jsonEncode({
        'requestId': req.requestId,
        'ok': true,
        'payload': {'status': 'ok'},
      }),
    );

    final response = await future;
    expect(response.ok, isTrue);
    expect(response.payload?['status'], 'ok');
  });
}
