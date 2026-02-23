# Flutter Architecture Standard (Issue #197)

## 1) Layer strategy

`lib/` 구조는 **Feature-first + Layered 구조**를 기본으로 합니다.

- `app/`: 앱 루트 (`MaterialApp`, 전역 초기화, 앱 엔트리)
- `core/`: 공통 기반 계층
- `shared/`: 다중 feature 공통 위젯/유틸
- `features/`: 도메인 기능 단위

## 2) Feature folder rule

각 feature는 최소 3개 레이어 폴더를 갖습니다.

- `features/<feature>/data`
  - API 클라이언트, DTO, Repository 구현
  - `repositories/*`, `datasources/*`, `models/*`

- `features/<feature>/domain`
  - 핵심 도메인 모델/UseCase/추상 리포지토리
  - `models/*`, `usecases/*`, `repositories/*`

- `features/<feature>/presentation`
  - 화면/상태관리/라우트 엔트리
  - `pages/*`, `widgets/*`, `state/*`, `view_models/*`

현재 구현이 단일 파일 기반이더라도, 신규 화면/기능은 이 템플릿으로 확장해야 합니다.

## 3) Naming convention

- Route: `static const routeName = '/xxx'`
- Page/Screen: `XxxPage`
- ViewModel: `XxxViewModel`
- Repository: `XxxRepository`
- UseCase: `XxxUseCase`
- State: `XxxState`

예시)

- `features/auth/presentation/pages/login_page.dart` → `LoginPage`
- `features/chat/presentation/pages/chat_room_page.dart` → `ChatRoomPage`
- `features/chat/presentation/pages/chat_room_page.dart` route: `ChatRoomPage.routePrefix`

## 4) DI entrypoint

DI(의존성 주입)은 `core/di/service_locator.dart`에서 중앙 등록 후,
각 feature는 App 진입점에서 생성된 객체를 주입받아 사용합니다.

현재는 lightweight Service Locator 형태로 시작하고, 추후 `riverpod`/`get_it` 이동은
별도 이슈에서 점진적으로 반영합니다.

## 5) 코드 추가/리뷰 체크

새로운 PR에 대해 리뷰어는 아래 기준으로 구조 위반을 확인합니다.

- feature별 최소 layer 폴더 존재(미래 확장성을 고려한 위치 정렬)
- 라우트/컴포넌트 네이밍 일관성
- 공통 기능은 `shared/` 또는 `core/` 경로 정착
- DI/테스트 더블 진입점 존재

## 6) Issue #197 completion criteria

- [x] `flutter/lib`를 `core/shared/features`로 표준화 유지
- [ ] feature별 기본 구조 템플릿 정리 (`data/domain/presentation`)
- [ ] 네이밍 컨벤션 문서화
- [ ] DI 엔트리 포인트 확정
- [ ] 문서화(`flutter/docs/ARCHITECTURE.md`) 완료
