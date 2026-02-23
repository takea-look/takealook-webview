# TDS (toss-design-system) Alignment Note

Flutter 기준 공통 테마/토큰 시스템을 아래 기준으로 확정한다.

## 1) Token source of truth

`lib/core/theme/tds_theme.dart`

- 단일 진입점: `app/takealook_app.dart`에서 `theme: TdsTheme.light()`
- Color token: `TdsColorToken`
- Typography token: `TdsTypographyToken`
- Spacing token: `TdsSpaceToken`

원칙: 신규 화면은 하드코딩 스타일 대신 토큰/Theme preset만 사용.

## 2) 토큰 기준

### Color
- Primary: `TdsColor.primaryBlue`
- Background/Surface: `TdsColor.background`, `TdsColor.white`
- Text: `TdsColor.textPrimary`, `TdsColor.textSecondary`, `TdsColor.textTertiary`
- Line/Card: `TdsColor.line`, `TdsColor.bubbleMine`

### Spacing
- `TdsSpacing.xs/sm/md/lg/xl/xxl`

### Radius
- `TdsRadius.sm/md/lg/pill`

### Typography
- `TdsTypography.heading/title/body/small/caption`

## 3) Component preset

아래 컴포넌트는 Theme preset으로 통일한다.

- FilledButton: `TdsComponentStyles.primaryButton()`
- InputDecoration(TextField): `TdsComponentStyles.inputDecoration(hint: ...)`
- Card: `CardTheme`/`FilledButtonTheme` 토큰 기반 공통 값

## 4) Accessibility text scale policy

- 앱 전체 텍스트 스케일은 `1.0 ~ 1.3` 범위로 clamp
- 적용 위치: `app/takealook_app.dart` `MaterialApp.builder`
- 점검 항목: 제목/본문/버튼 텍스트가 1.3 배율에서 라인 간격/영역을 침범하지 않는지 UI QA 확인

## 5) Dark mode policy (this sprint)

- **이번 스프린트 범위 제외**
- 이번 스프린트(198)에서는 **다크 모드 비지원**으로 유지
- 라이트 모드 토큰 체계를 먼저 고정하고, 다크모드는 후속 이슈에서 토큰 확장
- `TdsTheme.dark()`는 추후 스프린트에서 런치 시 추가 가능 stub만 정의

## 6) Code review rule / 적용 원칙

- 하드코딩 색상/타이포/간격 신규 추가 금지
- 예외가 필요하면 토큰에 먼저 등록 후 사용
- 신규 화면은 TDS 토큰 기반 스타일 우선 사용
- 하드코딩 `Color/EdgeInsets/TextStyle` 사용 비율 점차 축소
- 리뷰 기준: Theme/Shared token으로 대체 가능한 값은 직접 리터럴 사용 금지
