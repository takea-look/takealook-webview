# Open-Issue Backlog (Initial)

Created to resolve issue #70.

## Context
- Repository had no open issues and needed a starter backlog for tracking.
- This file lists small, executable FE work items with priority and acceptance criteria.

## Candidate issues

### 1) [P0] 닉네임 온보딩 API 스펙 고정 및 FE 최종 연동
- **Why**: FE는 `/user/profile/me` PATCH를 선반영했지만 Swagger에 아직 없음.
- **Scope**:
  - BE: 닉네임 저장/중복 검증 API 문서화 (Swagger)
  - FE: 에러코드별 UX (중복/금칙어/길이초과)
- **AC**:
  - Swagger에 endpoint + request/response schema 노출
  - FE에서 실패 케이스별 메시지 분기
  - e2e 시나리오(최초 로그인→닉네임 저장→메인 진입) 통과

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

## Backlog guard (added for #72)
- If open issue count reaches 0 during heartbeat, create at least one actionable issue immediately.
- Newly created issue should include: Why / Scope / Acceptance Criteria / References.
- First seeded issue: #73 (`[P2] Docs: README 실행/환경변수 섹션 보강`).

## References
- Swagger UI: https://s1.takealook.my/webjars/swagger-ui/index.html
- OpenAPI JSON: https://s1.takealook.my/v3/api-docs
