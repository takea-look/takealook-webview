import 'package:flutter/material.dart';

class TdsColor {
  const TdsColor._();

  static const Color primaryBlue = Color(0xFF0064FF);
  static const Color background = Color(0xFFF7F8FA);
  static const Color textPrimary = Color(0xFF191F28);
  static const Color textSecondary = Color(0xFF333D4B);
  static const Color textTertiary = Color(0xFF6D7886);
  static const Color line = Color(0xFFE5E8EB);
  static const Color bubbleMine = Color(0xFFDCEBFF);
  static const Color white = Color(0xFFFFFFFF);
  static const Color success = Color(0xFF15BC62);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFE74C3C);
}

class TdsSpacing {
  const TdsSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
}

class TdsRadius {
  const TdsRadius._();

  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double pill = 999;
}

class TdsTypography {
  const TdsTypography._();

  static const String fontFamily = 'Pretendard';

  static const TextStyle heading = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w700,
    height: 1.3,
    color: TdsColor.textPrimary,
  );

  static const TextStyle title = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    height: 1.35,
    color: TdsColor.textPrimary,
  );

  static const TextStyle body = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    height: 1.45,
    color: TdsColor.textSecondary,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 11,
    fontWeight: FontWeight.w500,
    height: 1.45,
    color: TdsColor.textSecondary,
  );

  static const TextStyle small = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.45,
    color: TdsColor.textSecondary,
  );
}

class TdsComponentStyles {
  const TdsComponentStyles._();

  static ButtonStyle primaryButton() {
    return ElevatedButton.styleFrom(
      backgroundColor: TdsColor.primaryBlue,
      foregroundColor: Colors.white,
      elevation: 0,
      minimumSize: const Size.fromHeight(48),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(TdsRadius.md),
      ),
      textStyle: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
    );
  }

  static InputDecoration inputDecoration({required String hint}) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TdsTypography.small,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TdsRadius.md),
        borderSide: const BorderSide(color: TdsColor.line),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TdsRadius.md),
        borderSide: const BorderSide(color: TdsColor.line),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TdsRadius.md),
        borderSide: const BorderSide(color: TdsColor.primaryBlue, width: 1.2),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: TdsSpacing.md,
        vertical: 12,
      ),
      fillColor: TdsColor.white,
      filled: true,
    );
  }

  static const double cardRadius = TdsRadius.md;
}

class TdsTheme {
  const TdsTheme._();

  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      fontFamily: TdsTypography.fontFamily,
      colorScheme: ColorScheme.fromSeed(seedColor: TdsColor.primaryBlue),
      scaffoldBackgroundColor: TdsColor.background,
      appBarTheme: const AppBarTheme(
        backgroundColor: TdsColor.white,
        foregroundColor: TdsColor.textPrimary,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TdsTypography.title,
      ),
      textTheme: const TextTheme(
        headlineSmall: TdsTypography.title,
        titleLarge: TdsTypography.title,
        bodyMedium: TdsTypography.body,
        bodySmall: TdsTypography.small,
        labelSmall: TdsTypography.caption,
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: TdsComponentStyles.inputDecoration(hint: '').border,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: TdsComponentStyles.primaryButton(),
      ),
      cardTheme: CardThemeData(
        color: TdsColor.white,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TdsComponentStyles.cardRadius),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: TdsComponentStyles.primaryButton(),
      ),
    );
  }

  /// 스프린트 범위에서는 다크모드 미지원.
  /// 앱 환경에서 시스템 다크모드 토글은 아직 제외.
  static ThemeData dark() {
    return ThemeData.dark(useMaterial3: true);
  }
}
