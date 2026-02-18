# QA Test Cases (Execution Notes)

- [x] **QA Smoke-ENV-01** (localhost:5173): `GET /`, `/login`, `/chat`, `/mypage` all returned `200`, `npm run lint`/`npm run build` passed (reported in HEARTBEAT).
- [ ] **TC-AUTH-01S** (Single device / single account) Toss login one-tap success → session retained after background/foreground — pending
- [ ] **TC-NAV-ROOMLIST-01S** (Single) Room list loads; offline/timeout shows error + retry — pending
- [ ] **TC-ROOM-ENTER-WS-01S** (Single) Enter room; realtime/WS connection established; no connection-failed UI — pending
- [ ] **TC-UPLOAD-01S** (Single) File upload success; progress/completion shown; uploaded item appears in own timeline — pending
- [ ] **TC-UPLOAD-FAIL-01S** (Single) Upload fails when offline; shows clear error; retry after network restore succeeds — pending
- [ ] **TC-AUTH-401-01S** (Single) 401/session-expired handling routes to login or shows clear block; no infinite spinner — pending
- [ ] **TC-WS-RECONNECT-01S** (Single) Network off/on triggers reconnect; after reconnect upload works again — pending

- [ ] **TC-CHAT-HP-01-2P** (Two-party) Happy path realtime receive (requires 2 accounts or 2 sessions) — pending

- [x] **TC-ADB-DEEPLINK-01** (AVD) Apps in Toss Sandbox: launch `viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity` via deeplink `intoss://takealook` and confirm activity focused. Evidence: `artifacts/avd_intoss_takealook_20260218_032452.png`, `artifacts/logcat_tail_20260218_032430.txt`

- [ ] **TC-ADB-DEEPLINK-02** (AVD) Deeplink launch stability (should stay in app, not return to launcher) — **failed**
  - Command: `adb shell am start -W -n viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity -a android.intent.action.VIEW -d intoss://takealook`
  - Observed: `am start` returned `Status: ok` but device remained on launcher; logcat shows app process obituary shortly after.
  - Evidence: `artifacts/avd_takealook_roomlist_20260218_045107.png` (launcher), `artifacts/focus_20260218_045107.txt`, `artifacts/logcat_tail_20260218_045107.txt`, `artifacts/am_start_20260218_045107.txt`

- [ ] **TC-ADB-UI-TAP-01** (AVD) "건너뛰고 시작하기" tap responsiveness — **failed (suspected)**
  - Setup: app focused on `viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity` after `intoss://takealook`.
  - Action: `adb shell input tap 540 2100` (screen 1080x2400, bottom CTA area assumed)
  - Observed: screenshot hash identical before/after tap (no visible UI change) and focused activity unchanged.
  - Evidence: `artifacts/20260218_085704/02_before_tap.png`, `artifacts/20260218_085704/03_after_tap.png`, `artifacts/20260218_085704/window_focus_after_tap.txt`

- Notes:
  - Login: Toss login button is one-tap (auto login).
  - App capability: file upload only (no text message send).

- Last update: 2026-02-18 08:59 KST
