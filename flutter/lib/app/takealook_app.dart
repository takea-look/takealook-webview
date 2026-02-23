import 'package:flutter/material.dart';

import '../core/router/app_router.dart';
import '../core/theme/tds_theme.dart';

class TakeaLookApp extends StatelessWidget {
  const TakeaLookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TakeaLook',
      debugShowCheckedModeBanner: false,
      theme: TdsTheme.light(),
      onGenerateRoute: AppRouter.onGenerateRoute,
      initialRoute: AppRouter.initialRoute,
    );
  }
}
