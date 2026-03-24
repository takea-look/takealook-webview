# Flutter Regression Test Checklist

PR마다 회귀 여부를 빠르게 판단하기 위한 최소 체크리스트.

## 1) Unit
- [ ] 딥링크 매핑 테스트 통과 (`deeplink_config_test.dart`)
- [ ] 에러 매핑 테스트 통과 (`app_error_mapping_test.dart`)
- [ ] 인증 상태 전이 테스트 통과 (`auth_session_manager_test.dart`)

## 2) Widget smoke
- [ ] 로그인 화면 기본 상호작용 (`login_page_smoke_test.dart`)
- [ ] 채팅 목록 화면 기본 렌더링/refresh (`chat_list_page_smoke_test.dart`)
- [ ] 설정 화면 기본 렌더링 (`settings_page_smoke_test.dart`)

## 3) Manual E2E (high-level)
- [ ] 로그인 → 채팅목록 → 채팅상세 진입
- [ ] 딥링크 진입 (`intoss-private://...`) 후 목표 화면 이동
- [ ] 만료 세션(401) 처리 시 로그인 유도
- [ ] 앱 백그라운드/복귀 후 화면 상태 유지

## 4) Pass criteria
- CI의 `flutter analyze`, `flutter test`, `flutter build web --release` 모두 통과
- 수동 E2E 주요 플로우에서 blocker(진입불가/크래시) 없음
