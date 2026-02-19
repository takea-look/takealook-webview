# Open-Issue Backlog (Initial)

Created to resolve issue #70.

## Context
- Repository had no open issues and needed a starter backlog for tracking.
- This file lists small, executable FE work items with priority and acceptance criteria.

## Candidate issues

### 1) [P0] 닉네임 온보딩 FE 최종 연동/검증
- **Why**: `/user/profile/me` PATCH가 Swagger에 노출되어 이제 FE 플로우를 기본 활성화하고 e2e로 닫아야 함.
- **Scope**:
  - FE: 닉네임 입력/저장 플로우 기본 활성화
  - FE: 스펙 동기화(닉네임 길이 2~16 등) 및 에러코드별 UX (중복/금칙어/길이)
- **AC**:
  - 닉네임 미설정 유저가 로그인하면 `/onboarding/nickname`로 리다이렉트
  - 닉네임 저장 성공 시 메인 진입
  - 400/409 실패 시 메시지/UX가 기대대로 동작

### 2) [P1] 신고 API 스펙 동기화 및 메시지 블라인드 상태 모델링
- **Why**: 현재 FE는 `/report`를 계약 기반으로 사용 중이며, 블라인드 상태는 imageUrl 유무로 표시.
- **Scope**:
  - BE: report endpoint 스펙 Swagger 반영
  - BE/FE: `UserChatMessage`에 blind 상태 필드 합의
  - FE: blind 상태 필드 기반 렌더 전환
- **AC**:
  - Swagger에 report endpoint 노출
  - 메시지 payload에 blind 상태 필드 정의/적용
  - FE placeholder 렌더가 상태 필드 기준으로 동작

### 3) [P1] ChatRoomScreen 컴포넌트 분리(렌더/입력/오버레이)
- **Why**: 화면 파일이 커져 유지보수 난이도 상승.
- **Scope**:
  - `MessageList`, `MessageBubble`, `Composer`, `ReportDialog`로 분리
- **AC**:
  - 기능 동작 동일
  - lint/build 통과
  - 파일 크기/복잡도 감소(기존 단일 파일 대비)

### 4) [P2] 토스트 컴포넌트 공용화
- **Why**: 신고/온보딩에서 토스트 UI를 인라인으로 중복 구현.
- **Scope**:
  - 공용 `Toast` 컴포넌트 및 hook (`useToast`) 추가
- **AC**:
  - 최소 2개 화면에서 공용 컴포넌트 사용
  - 접근성(`role=status`, `aria-live`) 유지

## Backlog guard (added for #72, reinforced by #78)
- If open issue count reaches 0 during heartbeat, create at least one actionable issue immediately.
- Newly created issue should include: Why / Scope / Acceptance Criteria / References.
- Keep at least **1 non-meta actionable issue** open at all times (avoid only guard issues remaining).
- When closing a guard issue, seed the next actionable issue first.
- Seed history:
  - #73 (`[P2] Docs: README 실행/환경변수 섹션 보강`)
  - #79 (`[P2] Investigate granite dev 404 on root path`)
  - #84 (`[P1] Auth flows consolidation: ID/PW + Toss UX and API contract`)
  - #88 (`[P1] Nickname onboarding fallback UX when profile PATCH is unavailable`)

## Gap / Risk checklist (for #76)
- [ ] Swagger 명세와 FE 구현 엔드포인트 일치 여부 점검 (`/report`, `/user/profile/me` PATCH)
- [ ] 런타임 payload 스키마와 `src/types/api.ts` 타입 일치 여부 확인
- [ ] 모바일(안드로이드) 실기기에서 신고/블라인드/온보딩 플로우 smoke test
- [ ] 에러 피드백 일관성 점검 (alert 제거, toast 공용화 대상 식별)
- [ ] `takealook.ait` 산출물 변경이 실제 코드 변경 의도와 일치하는지 PR마다 확인

## Next split candidates (actionable 3~5)
| Priority | Title | Issue | Notes |
| --- | --- | --- | --- |
| P0 | 닉네임 API 스펙 확정 후 FE 에러코드 매핑 | [#95](https://github.com/takea-look/takealook-webview/issues/95) | #1 항목 구체 이슈화 |
| P1 | 신고 API Swagger 반영 + blind 상태 필드 합의 | [#96](https://github.com/takea-look/takealook-webview/issues/96) | #2 항목 구체 이슈화 |
| P1 | ChatRoomScreen 분리 1차(MessageBubble, ReportDialog) | [#97](https://github.com/takea-look/takealook-webview/issues/97) | 리스크 낮은 단위부터 분리 |
| P2 | 공용 Toast 컴포넌트(`useToast`) 도입 | (TBD) | 최소 2개 화면 적용 |
| P2 | README + SETUP 중복 정리 및 단일 진입 문서화 | (TBD) | 온보딩 비용 절감 |

## Heartbeat backlog guard follow-up (#92)
- Added/seeded actionable issues so backlog doesn't stay guard-only:
  - [#95](https://github.com/takea-look/takealook-webview/issues/95) P0 닉네임 API 스펙 확정 및 FE 에러코드 매핑
  - [#96](https://github.com/takea-look/takealook-webview/issues/96) P1 신고 API Swagger 반영 + blind 상태 필드 합의
  - [#97](https://github.com/takea-look/takealook-webview/issues/97) P1 ChatRoomScreen 분리 1차
- This satisfies the guard TODO/AC (리스크 정리 + 우선순위 이슈 3개 이상 도출).

## References
- Swagger UI: https://s1.takealook.my/webjars/swagger-ui/index.html
- OpenAPI JSON: https://s1.takealook.my/v3/api-docs
