# Flutter MVP 구조 (Issue #170)

`lib/` 폴더는 기능 확장을 전제로 아래 책임으로 분리한다.

- `app/`: 앱 루트 구성 (`MaterialApp`, 테마, 전역 초기화)
- `core/`: 전역 공통 코어(환경값, 라우터, 네트워크 기초 등)
- `shared/`: 여러 feature가 공통으로 재사용하는 위젯/유틸
- `features/webview/`: 웹뷰 기능 단위 도메인 (UI/상태/연동)

초기 라우트는 `features/webview`의 `WebviewPage` 하나만 두고, 이후 기능 확장 시 `core/router/app_router.dart`에 중앙 등록한다.
