# Phase 4 Parity Migration (Issue #186)

## Scope split

- Auth: `/login`
- Chat: `/chat`, `/chat/:roomId`
- MyPage: `/mypage`
- Settings: `/settings`
- DeepLink/Bridge: `WebviewPage` + `TakeaLookBridge`

## Current status (this PR)

- [x] Flutter route skeleton wired
- [x] Feature page placeholders added (Auth/Chat/MyPage/Settings)
- [x] TDS-like base theme entry point added (`core/theme/tds_theme.dart`)
- [x] Parity migration document baseline

## Progress update

- [x] Settings Native migration baseline
  - settings item list (version/account/others)
  - toggle/select controls wired
  - external policy link open
  - safe logout confirm flow
  - accessibility semantics labels added

## Next implementation tasks

1. Auth token store/refresh/unauthorized event hookup
2. Chat API integration + reconnect UX
3. MyPage/Settings real API wiring + error handling
4. Bridge timeout/error contract implementation
5. E2E + API contract snapshot

## Architecture status (Issue #197)

- [x] `data/domain/presentation` 템플릿 보강(기능별 골격 확정)
- [x] DI/라우팅 규칙 문서 링크 정리
