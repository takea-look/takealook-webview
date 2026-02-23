import 'package:flutter/material.dart';

class TdsColorToken {
  const TdsColorToken._();

  static const primary = Color(0xFF0064FF);
  static const background = Color(0xFFF7F8FA);
  static const surface = Colors.white;
  static const textPrimary = Color(0xFF191F28);
  static const textSecondary = Color(0xFF333D4B);
  static const border = Color(0xFFE5E8EB);
  static const danger = Color(0xFFD92D20);
}

class TdsTypographyToken {
  const TdsTypographyToken._();

  static const titleLarge = TextStyle(
    fontSize: 22,
    height: 1.3,
    fontWeight: FontWeight.w700,
    color: TdsColorToken.textPrimary,
  );

  static const bodyMedium = TextStyle(
    fontSize: 15,
    height: 1.4,
    fontWeight: FontWeight.w400,
    color: TdsColorToken.textSecondary,
  );

  static const labelLarge = TextStyle(
    fontSize: 14,
    height: 1.3,
    fontWeight: FontWeight.w600,
    color: TdsColorToken.textPrimary,
  );
}

class TdsSpaceToken {
  const TdsSpaceToken._();

  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 20.0;
  static const xxl = 24.0;
}

class TdsTheme {
  const TdsTheme._();

  static ThemeData light() {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: TdsColorToken.primary,
        surface: TdsColorToken.surface,
      ),
    );

    return base.copyWith(
      scaffoldBackgroundColor: TdsColorToken.background,
      appBarTheme: const AppBarTheme(
        backgroundColor: TdsColorToken.surface,
        foregroundColor: TdsColorToken.textPrimary,
        elevation: 0,
      ),
      textTheme: const TextTheme(
        titleLarge: TdsTypographyToken.titleLarge,
        bodyMedium: TdsTypographyToken.bodyMedium,
        labelLarge: TdsTypographyToken.labelLarge,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: TdsTypographyToken.labelLarge,
          backgroundColor: TdsColorToken.primary,
          foregroundColor: Colors.white,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: TdsColorToken.surface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: TdsSpaceToken.lg,
          vertical: TdsSpaceToken.md,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: TdsColorToken.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: TdsColorToken.border),
        ),
      ),
      cardTheme: CardThemeData(
        color: TdsColorToken.surface,
        margin: const EdgeInsets.all(TdsSpaceToken.sm),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: TdsColorToken.border),
        ),
      ),
    );
  }
}
