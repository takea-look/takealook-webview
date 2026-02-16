# Auth Flows Contract (Issue #84)

## Goals
- Align FE login UX between ID/PW and Toss login.
- Normalize loading/error handling for both flows.
- Document expected API contract and error mapping.

## Flows

### 1) ID/PW login
- Endpoint: `POST /auth/signin`
- Request: `{ username, password }`
- Success: `{ accessToken, refreshToken? }`
- FE action: store tokens, navigate `/`

### 2) Toss login
- Endpoint: `POST /auth/toss/signin`
- Request: `{ authorizationCode, referrer }`
- Success: `{ accessToken, refreshToken? }`
- FE action: store tokens, navigate `/`

## Error UX policy

| Case | FE message |
| --- | --- |
| Empty username/password | `아이디와 비밀번호를 입력해주세요.` |
| ID/PW auth failed | `아이디/비밀번호 로그인에 실패했습니다.` |
| Toss auth failed | `토스 로그인에 실패했습니다.` |
| Network/server unknown | Use flow-specific generic failure message |

## State model recommendation
- Keep loading flags split by flow:
  - `isIdPwLoading`
  - `isTossLoading`
- Keep one shared top-level `error` string for display.
- Disable both submit actions while either loading is active.

## Follow-up implementation candidates
1. Map API status codes (401/403/429/5xx) to tailored messages.
2. Add telemetry/logging tags to distinguish ID/PW vs Toss failures.
3. Add integration test for both login success/failure paths.
