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

- [x] **TC-ADB-UI-TAP-01** (AVD) "건너뛰고 시작하기" tap responsiveness — **failed (confirmed)**
  - Setup: app focused on `viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity` after `intoss://takealook`.
  - Action: `adb shell input tap` on CTA 후보 좌표 3회 (`540 2100`, `540 2140`, `540 2050`)
  - Observed: before/after screenshot SHA1 동일, focus 동일(`GraniteActivity`) → 탭 반응 없음 재현
  - Evidence: `artifacts/20260219_063107_ui_tap_confirm/ui_before.png`, `artifacts/20260219_063107_ui_tap_confirm/ui_after.png`, `artifacts/20260219_063107_ui_tap_confirm/screenshot_hashes.txt`, `artifacts/20260219_063107_ui_tap_confirm/focus_before.txt`, `artifacts/20260219_063107_ui_tap_confirm/focus_after.txt`, `artifacts/20260219_063107_ui_tap_confirm/am_start.txt`

- [x] **TC-ADB-RELAUNCH-01** (AVD) Explicit deeplink 3회 재실행 일관성 — **failed**
  - Command (x3): `adb shell am start -W -n viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity -a android.intent.action.VIEW -d intoss://takealook`
  - Observed:
    - #1, #2: `Status: ok`, focus `GraniteActivity`
    - #3: `Status: ok`지만 `LaunchState: UNKNOWN (0)`, `WaitTime: 35971ms`; focus가 launcher(`NexusLauncherActivity`)로 남음
  - Verdict: 재실행 일관성 불충분(3회 중 1회 실패)
  - Evidence: `artifacts/20260219_063217_adb_relaunch_consistency/am_start_1.txt`, `am_start_2.txt`, `am_start_3.txt`, `focus_1.txt`, `focus_2.txt`, `focus_3.txt`, `relaunch_1.png`, `relaunch_2.png`, `relaunch_3.png`

- [x] **TC-ADB-BGFG-01** (AVD) Deeplink 진입 후 background/foreground 복귀 안정성 — **passed**
  - Steps: deeplink 진입 → Home(background) → `monkey -p viva.republica.toss.test ... 1`로 foreground 복귀
  - Observed: launch 시 `GraniteActivity` 포커스, Home에서 launcher 포커스, 복귀 후 다시 `GraniteActivity` 포커스 회복
  - Evidence: `artifacts/20260219_084638_adb_bgfg_resume/am_start.txt`, `artifacts/20260219_084638_adb_bgfg_resume/focus_after_launch.txt`, `artifacts/20260219_084638_adb_bgfg_resume/focus_after_home.txt`, `artifacts/20260219_084638_adb_bgfg_resume/focus_after_resume.txt`, `artifacts/20260219_084638_adb_bgfg_resume/launch.png`, `artifacts/20260219_084638_adb_bgfg_resume/home.png`, `artifacts/20260219_084638_adb_bgfg_resume/resume.png`, `artifacts/20260219_084638_adb_bgfg_resume/monkey_resume.txt`

- [x] **TC-ADB-ROTATE-01** (AVD) Deeplink 진입 후 화면 회전(가로/세로) 안정성 — **passed**
  - Steps: deeplink 진입 → 강제 landscape(`user_rotation=1`) → portrait(`user_rotation=0`)
  - Observed: 회전 전/중/후 모두 `GraniteActivity` 포커스 유지, 앱 이탈/크래시 미관찰
  - Evidence: `artifacts/20260219_090055_adb_rotate_stability/am_start.txt`, `artifacts/20260219_090055_adb_rotate_stability/focus_before_rotate.txt`, `artifacts/20260219_090055_adb_rotate_stability/focus_landscape.txt`, `artifacts/20260219_090055_adb_rotate_stability/focus_portrait.txt`, `artifacts/20260219_090055_adb_rotate_stability/before.png`, `artifacts/20260219_090055_adb_rotate_stability/landscape.png`, `artifacts/20260219_090055_adb_rotate_stability/portrait.png`

- [x] **TC-ADB-BACK-01** (AVD) Deeplink 랜딩 후 Back key 반응성 — **failed (suspected)**
  - Steps: deeplink 진입 후 `KEYCODE_BACK` 1회 입력
  - Observed: back 전/후 focus 모두 `GraniteActivity`, 스크린샷 동일(변화 없음)
  - Verdict: Back 이벤트에 대한 화면 전환/종료 반응 미확인(추가 앱 내부 로그 필요)
  - Evidence: `artifacts/20260219_090238_adb_backpress_behavior/am_start.txt`, `artifacts/20260219_090238_adb_backpress_behavior/focus_before_back.txt`, `artifacts/20260219_090238_adb_backpress_behavior/focus_after_back.txt`, `artifacts/20260219_090238_adb_backpress_behavior/before_back.png`, `artifacts/20260219_090238_adb_backpress_behavior/after_back.png`

- [x] **TC-ADB-TASKSWITCH-01** (AVD) Deeplink 진입 후 타 앱 전환/복귀 안정성 — **failed**
  - Steps: deeplink 진입 → Settings 앱 전환 → 최근앱(App Switch)에서 이전 앱 복귀 시도
  - Observed:
    - 전환 전: `GraniteActivity` 포커스
    - Settings 전환: Settings activity 포커스
    - 복귀 시도 후: `NexusLauncherActivity` 포커스(대상 앱 미복귀)
  - Verdict: 태스크 전환 후 복귀 플로우 불안정/미동작
  - Evidence: `artifacts/20260219_091317_adb_task_switch_resume/am_start.txt`, `artifacts/20260219_091317_adb_task_switch_resume/am_settings.txt`, `artifacts/20260219_091317_adb_task_switch_resume/focus_target_before_switch.txt`, `artifacts/20260219_091317_adb_task_switch_resume/focus_on_settings.txt`, `artifacts/20260219_091317_adb_task_switch_resume/focus_after_return.txt`, `artifacts/20260219_091317_adb_task_switch_resume/before_switch.png`, `artifacts/20260219_091317_adb_task_switch_resume/on_settings.png`, `artifacts/20260219_091317_adb_task_switch_resume/after_return.png`

- [x] **TC-ADB-NOTISHADE-01** (AVD) Deeplink 랜딩 후 알림창 열기/닫기 복귀 안정성 — **failed (launch unstable)**
  - Steps: deeplink 진입 시도 → notification shade open/close
  - Observed: `am start`는 `Status: ok`이나 `LaunchState: UNKNOWN (0)`, `WaitTime: 25849`; focus가 시작 전/후 모두 launcher(`NexusLauncherActivity`)로 유지
  - Verdict: 본 케이스는 알림창 복귀 검증 전 단계(앱 랜딩)에서 실패
  - Evidence: `artifacts/20260219_091924_adb_notification_shade/am_start.txt`, `artifacts/20260219_091924_adb_notification_shade/focus_before_shade.txt`, `artifacts/20260219_091924_adb_notification_shade/focus_after_close.txt`, `artifacts/20260219_091924_adb_notification_shade/before.png`, `artifacts/20260219_091924_adb_notification_shade/shade_open.png`, `artifacts/20260219_091924_adb_notification_shade/after.png`

- Notes:
  - Login: Toss login button is one-tap (auto login).
  - App capability: file upload only (no text message send).

- Last update: 2026-02-19 09:20 KST
