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

1. Auth token store/refresh/unauthorized event hookup (현재: AuthSessionManager + TokenStore + 401 throttle + 상태전이 테스트)
2. Chat API integration + reconnect UX (현재: 목록/상세 Native baseline + 전송/실패/재전송 UX)
3. MyPage API wiring 마무리 (현재는 Native UI + 저장/실패/인증만료 fallback baseline)
4. Settings API persistence wiring (server sync)
5. Bridge timeout/error contract implementation
6. E2E + API contract snapshot

## Architecture status (Issue #197)

- [ ] `data/domain/presentation` 템플릿 보강(기능별 골격 확정)
- [ ] DI/라우팅 규칙 문서 링크 정리
