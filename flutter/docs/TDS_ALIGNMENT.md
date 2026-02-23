# TDS (toss-design-system) Alignment Note

Flutter 기준 공통 테마/토큰 시스템을 아래 기준으로 확정한다.

## 1) Token source of truth

`lib/core/theme/tds_theme.dart`

- Color token: `TdsColorToken`
- Typography token: `TdsTypographyToken`
- Spacing token: `TdsSpaceToken`

원칙: 신규 화면은 하드코딩 스타일 대신 토큰/Theme preset만 사용.

## 2) Component preset

아래 컴포넌트는 Theme preset으로 통일한다.

- FilledButton
- InputDecoration(TextField)
- Card

## 3) Accessibility text scale policy

- 앱 전체 텍스트 스케일은 `1.0 ~ 1.3` 범위로 clamp
- 적용 위치: `app/takealook_app.dart` `MaterialApp.builder`

## 4) Dark mode policy (this sprint)

- **이번 스프린트 범위 제외**
- 라이트 모드 토큰 체계를 먼저 고정하고, 다크모드는 후속 이슈에서 토큰 확장

## 5) Code review rule

- 하드코딩 색상/타이포/간격 신규 추가 금지
- 예외가 필요하면 토큰에 먼저 등록 후 사용
