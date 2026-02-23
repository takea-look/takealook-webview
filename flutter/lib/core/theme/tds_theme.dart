import 'package:flutter/material.dart';

class TdsTheme {
  const TdsTheme._();

  static ThemeData light() {
    const seed = Color(0xFF0064FF);
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: seed),
      scaffoldBackgroundColor: const Color(0xFFF7F8FA),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Color(0xFF191F28),
        elevation: 0,
      ),
      textTheme: const TextTheme(
        titleLarge: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF191F28)),
        bodyMedium: TextStyle(color: Color(0xFF333D4B)),
      ),
    );
  }
}
