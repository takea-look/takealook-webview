# Flutter MVP 구조 (Issue #170)

`lib/` 폴더는 기능 확장을 전제로 아래 책임으로 분리한다.

- `app/`: 앱 루트 구성 (`MaterialApp`, 테마, 전역 초기화)
- `core/`: 전역 공통 코어(환경값, 라우터, 네트워크 기초 등)
- `shared/`: 여러 feature가 공통으로 재사용하는 위젯/유틸
- `features/webview/`: 웹뷰 기능 단위 도메인 (UI/상태/연동)

초기 라우트는 `features/webview`의 `WebviewPage` 하나만 두고, 이후 기능 확장 시 `core/router/app_router.dart`에 중앙 등록한다.

## Architecture standard (Issue #197)

현재 Flutter 앱의 최종 표준은 `docs/ARCHITECTURE.md`와 동일합니다.

- Feature 단위는 `features/<feature>/` 하위에 `data`, `domain`, `presentation` 레이어를 둡니다.
- 공통 의존성 등록은 `core/di/service_locator.dart`를 통해 앱 진입점에서 구성합니다.
- 화면/컴포넌트/라우트/상태 이름은 공통 네이밍 룰을 따릅니다.

