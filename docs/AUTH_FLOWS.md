# Auth Flows Contract (Issue #102)

## Goals
- Align login UX with spec providers: Google / Apple / Kakao.
- Remove ID/PW login UI from webview login screen.
- Use unified backend auth routes (`/auth/{provider}/signin`, `/auth/logout`, `/auth/refresh`) with backward compatibility.

## Flows

### 1) SNS login (Google/Apple/Kakao)
- Entry: `GET /auth/{provider}/authorize?redirectUri=<webview-login-url>`
- Callback to FE login route with query:
  - `provider`
  - `authorizationCode`
  - optional `referrer`
- Token exchange endpoint:
  - `POST /auth/{provider}/signin`
  - request: `{ authorizationCode, referrer? }`
  - success: `{ accessToken, refreshToken? }`
- FE action: store tokens, navigate `/`

### 2) Refresh / Logout
- Refresh: `POST /auth/refresh` (fallback to `/auth/toss/refresh` if 404/405)
- Logout: `POST /auth/logout` (fallback to `/auth/toss/logout` if 404/405)

## Error UX policy

| Case | FE message |
| --- | --- |
| SNS callback signin failed | `SNS 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.` |
| Network/server unknown | same generic SNS failure message |

## Notes
- ID/PW 로그인 UI는 제거되어 spec-first SNS 흐름만 노출한다.
- 구형 Toss-only 백엔드와의 호환을 위해 refresh/logout은 fallback 로직을 유지한다.
