# TDS (toss-design-system) Alignment Note

- 기준 소스: `lib/core/theme/tds_theme.dart`
- 단일 진입점: `app/takealook_app.dart`에서 `theme: TdsTheme.light()`

## 토큰 기준

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

### Component presets
- `TdsComponentStyles.primaryButton()`
- `TdsComponentStyles.inputDecoration(hint: ...)`
- `CardTheme`/`FilledButtonTheme` 토큰 기반 공통 값

## 다크 모드 정책

- 이번 스프린트(198)에서는 **다크 모드 비지원**으로 유지
- `TdsTheme.dark()`는 추후 스프린트에서 런치 시 추가 가능 stub만 정의

## 접근성

- 텍스트 스케일 권장 범위: `1.0 ~ 1.3`
- 점검 항목: 제목/본문/버튼 텍스트가 1.3 배율에서 라인 간격/영역을 침범하지 않는지 UI QA 확인

## 적용 원칙

1. 신규 화면은 TDS 토큰 기반 스타일 우선 사용
2. 하드코딩 `Color/EdgeInsets/TextStyle` 사용 비율 점차 축소
3. 리뷰 기준: Theme/Shared token으로 대체 가능한 값은 직접 리터럴 사용 금지
