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

- [x] **TC-ADB-DEEPLINK-02** (AVD) Deeplink launch stability (should stay in app, not return to launcher) — **passed (re-test)**
  - Command: `adb shell am start -W -n viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity -a android.intent.action.VIEW -d intoss://takealook`
  - Observed: `am start` returned `Status: ok`; focus remained on `GraniteActivity` at 4s and 10s after launch (no launcher fallback observed).
  - Evidence: `artifacts/20260219_051916_deeplink_stability/after_start.png`, `artifacts/20260219_051916_deeplink_stability/after_10s.png`, `artifacts/20260219_051916_deeplink_stability/focus_after_4s.txt`, `artifacts/20260219_051916_deeplink_stability/focus_after_10s.txt`, `artifacts/20260219_051916_deeplink_stability/logcat_tail.txt`, `artifacts/20260219_051916_deeplink_stability/am_start.txt`

- [x] **TC-ADB-DEEPLINK-03** (AVD) Deeplink implicit start (pkg only) — **passed (re-test)**
  - Command: `adb shell am start -W -a android.intent.action.VIEW -d intoss://takealook viva.republica.toss.test`
  - Observed:
    - `am start` returned `Status: ok` / `Activity: viva.republica.toss.test/.MiniAppSchemeActivity`
    - Focus moved to and stayed on `GraniteActivity` at 4s/10s (no launcher fallback)
    - logcat tail에서 ANR/FATAL/obituary 미검출
  - Evidence: `artifacts/20260219_052223_deeplink_implicit_retest/implicit_after_4s.png`, `artifacts/20260219_052223_deeplink_implicit_retest/implicit_after_10s.png`, `artifacts/20260219_052223_deeplink_implicit_retest/focus_after_4s.txt`, `artifacts/20260219_052223_deeplink_implicit_retest/focus_after_10s.txt`, `artifacts/20260219_052223_deeplink_implicit_retest/logcat_tail.txt`, `artifacts/20260219_052223_deeplink_implicit_retest/am_start_implicit.txt`

- [x] **TC-ADB-LAUNCH-WAITTIME-01** (AVD) Explicit deeplink cold start 응답성(launch wait time) — **passed**
  - Command: `adb shell am start -W -n viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity -a android.intent.action.VIEW -d intoss://takealook`
  - Pass criteria: `Status: ok` 이고 포커스가 `GraniteActivity`로 진입
  - Observed: `Status: ok`, `TotalTime: 13146ms`, `WaitTime: 13153ms`, 포커스 `GraniteActivity` 확인
  - Evidence: `artifacts/20260219_062544_adb_launch_w_time/am_start.txt`, `artifacts/20260219_062544_adb_launch_w_time/focus.txt`, `artifacts/20260219_062544_adb_launch_w_time/launch.png`

- [ ] **TC-ADB-UI-TAP-01** (AVD) "건너뛰고 시작하기" tap responsiveness — **failed (suspected)**
  - Setup: app focused on `viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity` after `intoss://takealook`.
  - Action: `adb shell input tap 540 2100` (screen 1080x2400, bottom CTA area assumed)
  - Observed: screenshot hash identical before/after tap (no visible UI change) and focused activity unchanged.
  - Evidence: `artifacts/20260218_085704/02_before_tap.png`, `artifacts/20260218_085704/03_after_tap.png`, `artifacts/20260218_085704/window_focus_after_tap.txt`

- Notes:
  - Login: Toss login button is one-tap (auto login).
  - App capability: file upload only (no text message send).

- Last update: 2026-02-19 06:26 KST
