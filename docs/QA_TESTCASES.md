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

- [x] **TC-ADB-LAUNCH-WAITTIME-02** (AVD) Explicit deeplink 5회 연속 실행 응답 시간 분포 — **passed (high variance observed)**
  - Steps: Home 상태에서 explicit deeplink `am start -W` 5회 연속 실행, 각 회차 focus 확인
  - Observed:
    - WaitTime: `529 / 9809 / 15464 / 101 / 167 ms`
    - 통계: min `101ms`, max `15464ms`, avg `5214ms`, median `529ms`
    - 1~5회 모두 focus `GraniteActivity` 유지
    - LaunchState: `HOT, HOT, UNKNOWN(0), UNKNOWN(0), UNKNOWN(0)`
  - Verdict: 랜딩 성공 자체는 안정적이나, 실행 응답 시간 변동폭이 큼(성능 플래키 가능성)
  - Evidence: `artifacts/20260219_103145_adb_launch_time_5runs/am_start_1.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/am_start_2.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/am_start_3.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/am_start_4.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/am_start_5.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/focus_1.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/focus_2.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/focus_3.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/focus_4.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/focus_5.txt`, `artifacts/20260219_103145_adb_launch_time_5runs/summary.txt`

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

- [x] **TC-ADB-BGFG-02** (AVD) Background/Foreground 3회 반복 복귀 안정성 — **passed**
  - Steps: explicit deeplink 진입 후 Home→`monkey resume`를 3회 반복
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 351ms`
    - 1~3회 복귀 후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 다회 BG/FG 사이클에서도 foreground 복귀 안정성 양호
  - Evidence: `artifacts/20260219_103616_adb_bgfg_3cycles/am_start.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_start.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_home_1.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_resume_1.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_home_2.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_resume_2.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_home_3.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/focus_resume_3.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/resume_1.png`, `artifacts/20260219_103616_adb_bgfg_3cycles/resume_2.png`, `artifacts/20260219_103616_adb_bgfg_3cycles/resume_3.png`, `artifacts/20260219_103616_adb_bgfg_3cycles/logcat_tail.txt`, `artifacts/20260219_103616_adb_bgfg_3cycles/log_hits.txt`

- [x] **TC-ADB-HOME-DEEPLINK-REENTRY-01** (AVD) Home 이동 후 deeplink 재진입 안정성 — **passed**
  - Steps: explicit deeplink 1회 진입 → Home 이동 → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 324ms`
    - Home 시점 focus: `NexusLauncherActivity`
    - 2차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 150ms`
    - 1차/2차 진입 후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: Home 이탈 후 deeplink 재진입 동작 정상
  - Evidence: `artifacts/20260219_104005_adb_home_then_deeplink_reentry/am_start_1.txt`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/focus_after_start_1.txt`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/focus_on_home.txt`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/am_start_2.txt`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/focus_after_start_2.txt`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/after_start_1.png`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/after_start_2.png`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/logcat_tail.txt`, `artifacts/20260219_104005_adb_home_then_deeplink_reentry/log_hits.txt`

- [x] **TC-ADB-RECENTS-DEEPLINK-RECOVER-01** (AVD) Recent Apps 진입 후 deeplink 복구 진입 — **passed**
  - Steps: Home에서 Recent Apps 호출(`KEYCODE_APP_SWITCH`) → explicit deeplink 실행
  - Observed:
    - Recent 호출 시 focus는 `NexusLauncherActivity`
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 133ms`, `WaitTime: 141ms`
    - deeplink 실행 후 focus `GraniteActivity`로 정상 전환
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 최근앱(overview) 상태에서도 deeplink 복구 진입 정상
  - Evidence: `artifacts/20260219_104201_adb_recents_then_deeplink_recover/focus_on_recents.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/recents.png`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/am_start.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/focus_after_start.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/after_start.png`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/logcat_tail.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLETAP-01** (AVD) 앱 활성 상태에서 App Switch 더블탭 복귀 — **failed (unstable focus)**
  - Steps: explicit deeplink 진입 후 `KEYCODE_APP_SWITCH` 2회 연속 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 718ms`
    - 더블탭 전 focus는 `GraniteActivity`
    - 더블탭 후 `dumpsys window` 기준 `mCurrentFocus=null` (안정 포커스 미확인)
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: App Switch 더블탭 직후 포커스 안정성이 불충분(재현 추가 필요)
  - Evidence: `artifacts/20260219_111309_adb_appswitch_doubletap/am_start.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/focus_before_switch.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/focus_after_double_switch.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/after_double_switch.png`, `artifacts/20260219_111309_adb_appswitch_doubletap/logcat_tail.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-SINGLE-01** (AVD) App Switch 진입 후 Back 복귀 동작 — **passed**
  - Steps: explicit deeplink 진입 → `KEYCODE_APP_SWITCH` 1회 → `KEYCODE_BACK` 1회
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 41ms`
    - App Switch 전/후, 그리고 Back 입력 후 모두 focus가 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 단일 App Switch 토글 시에는 앱 포커스가 안정적으로 유지됨
  - Evidence: `artifacts/20260219_112117_adb_appswitch_single_toggle/am_start.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/focus_before_switch.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/focus_after_switch_open.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/focus_after_back.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/switch_open.png`, `artifacts/20260219_112117_adb_appswitch_single_toggle/after_back.png`, `artifacts/20260219_112117_adb_appswitch_single_toggle/logcat_tail.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/log_hits.txt`

- [x] **TC-ADB-ROTATE-01** (AVD) Deeplink 진입 후 화면 회전(가로/세로) 안정성 — **passed**
  - Steps: deeplink 진입 → 강제 landscape(`user_rotation=1`) → portrait(`user_rotation=0`)
  - Observed: 회전 전/중/후 모두 `GraniteActivity` 포커스 유지, 앱 이탈/크래시 미관찰
  - Evidence: `artifacts/20260219_090055_adb_rotate_stability/am_start.txt`, `artifacts/20260219_090055_adb_rotate_stability/focus_before_rotate.txt`, `artifacts/20260219_090055_adb_rotate_stability/focus_landscape.txt`, `artifacts/20260219_090055_adb_rotate_stability/focus_portrait.txt`, `artifacts/20260219_090055_adb_rotate_stability/before.png`, `artifacts/20260219_090055_adb_rotate_stability/landscape.png`, `artifacts/20260219_090055_adb_rotate_stability/portrait.png`

- [x] **TC-ADB-ROTATE-02** (AVD) 화면 회전 3사이클 반복 안정성 — **passed**
  - Steps: explicit deeplink 진입 후 `portrait→landscape→portrait` 회전 사이클 3회 반복
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 145ms`
    - 사이클 1~3의 landscape/portrait 모든 시점에서 focus `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 반복 회전 시나리오에서도 포그라운드 유지 안정성 양호
  - Evidence: `artifacts/20260219_103814_adb_rotate_3cycles/am_start.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_start.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_landscape_1.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_portrait_1.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_landscape_2.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_portrait_2.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_landscape_3.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/focus_portrait_3.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/landscape_1.png`, `artifacts/20260219_103814_adb_rotate_3cycles/portrait_1.png`, `artifacts/20260219_103814_adb_rotate_3cycles/landscape_2.png`, `artifacts/20260219_103814_adb_rotate_3cycles/portrait_2.png`, `artifacts/20260219_103814_adb_rotate_3cycles/landscape_3.png`, `artifacts/20260219_103814_adb_rotate_3cycles/portrait_3.png`, `artifacts/20260219_103814_adb_rotate_3cycles/logcat_tail.txt`, `artifacts/20260219_103814_adb_rotate_3cycles/log_hits.txt`

- [x] **TC-ADB-BACK-01** (AVD) Deeplink 랜딩 후 Back key 반응성 — **failed (suspected)**
  - Steps: deeplink 진입 후 `KEYCODE_BACK` 1회 입력
  - Observed: back 전/후 focus 모두 `GraniteActivity`, 스크린샷 동일(변화 없음)
  - Verdict: Back 이벤트에 대한 화면 전환/종료 반응 미확인(추가 앱 내부 로그 필요)
  - Evidence: `artifacts/20260219_090238_adb_backpress_behavior/am_start.txt`, `artifacts/20260219_090238_adb_backpress_behavior/focus_before_back.txt`, `artifacts/20260219_090238_adb_backpress_behavior/focus_after_back.txt`, `artifacts/20260219_090238_adb_backpress_behavior/before_back.png`, `artifacts/20260219_090238_adb_backpress_behavior/after_back.png`

- [x] **TC-ADB-BACK-03** (AVD) 안정 랜딩 상태에서 Back key 1회 반응성 재검증 — **failed (no transition)**
  - Steps: explicit deeplink로 앱 진입(안정 focus 확인) 후 `KEYCODE_BACK` 1회 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 2709ms`, `WaitTime: 2775ms`
    - back 전/후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 안정 진입 상태에서도 Back 1회로 화면 전환/종료 반응 미확인
  - Evidence: `artifacts/20260219_111816_adb_back_single_from_stable/am_start.txt`, `artifacts/20260219_111816_adb_back_single_from_stable/focus_before_back.txt`, `artifacts/20260219_111816_adb_back_single_from_stable/focus_after_back.txt`, `artifacts/20260219_111816_adb_back_single_from_stable/before_back.png`, `artifacts/20260219_111816_adb_back_single_from_stable/after_back.png`, `artifacts/20260219_111816_adb_back_single_from_stable/logcat_tail.txt`, `artifacts/20260219_111816_adb_back_single_from_stable/log_hits.txt`

- [x] **TC-ADB-BACK-02** (AVD) Back key 2회 입력 반응성 재검증 — **failed (blocked by launch fallback)**
  - Steps: Home 상태에서 explicit deeplink 실행 → `KEYCODE_BACK` 2회 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 21191`
    - back 전/1회 후/2회 후 focus 모두 `NexusLauncherActivity`
    - before/back1 스크린샷 해시 동일, back2만 다른 해시(런처 화면 변화로 추정)
  - Verdict: 앱 랜딩 실패로 Back 반응성을 앱 내부에서 검증하지 못함
  - Evidence: `artifacts/20260219_100413_adb_backpress_double/am_start.txt`, `artifacts/20260219_100413_adb_backpress_double/focus_before_back.txt`, `artifacts/20260219_100413_adb_backpress_double/focus_after_back1.txt`, `artifacts/20260219_100413_adb_backpress_double/focus_after_back2.txt`, `artifacts/20260219_100413_adb_backpress_double/before_back.png`, `artifacts/20260219_100413_adb_backpress_double/after_back1.png`, `artifacts/20260219_100413_adb_backpress_double/after_back2.png`, `artifacts/20260219_100413_adb_backpress_double/screenshot_hashes.txt`, `artifacts/20260219_100413_adb_backpress_double/logcat_tail.txt`

- [x] **TC-ADB-TASKSWITCH-01** (AVD) Deeplink 진입 후 타 앱 전환/복귀 안정성 — **failed**
  - Steps: deeplink 진입 → Settings 앱 전환 → 최근앱(App Switch)에서 이전 앱 복귀 시도
  - Observed:
    - 전환 전: `GraniteActivity` 포커스
    - Settings 전환: Settings activity 포커스
    - 복귀 시도 후: `NexusLauncherActivity` 포커스(대상 앱 미복귀)
  - Verdict: 태스크 전환 후 복귀 플로우 불안정/미동작
  - Evidence: `artifacts/20260219_091317_adb_task_switch_resume/am_start.txt`, `artifacts/20260219_091317_adb_task_switch_resume/am_settings.txt`, `artifacts/20260219_091317_adb_task_switch_resume/focus_target_before_switch.txt`, `artifacts/20260219_091317_adb_task_switch_resume/focus_on_settings.txt`, `artifacts/20260219_091317_adb_task_switch_resume/focus_after_return.txt`, `artifacts/20260219_091317_adb_task_switch_resume/before_switch.png`, `artifacts/20260219_091317_adb_task_switch_resume/on_settings.png`, `artifacts/20260219_091317_adb_task_switch_resume/after_return.png`

- [x] **TC-ADB-TASKSWITCH-02** (AVD) Recent Apps 더블 토글 복귀 안정성 — **failed (ANR + launcher fallback)**
  - Steps: explicit deeplink 진입 → Recent Apps(`KEYCODE_APP_SWITCH`) 2회 토글로 앱 복귀 시도
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: COLD`, `WaitTime: 23157`
    - 시작 5초 후 focus가 `Application Not Responding: viva.republica.toss.test` (ANR 다이얼로그)
    - Recent Apps 더블 토글 후 focus가 `NexusLauncherActivity`로 이동(앱 복귀 실패)
  - Verdict: 랜딩 직후 ANR 발생 가능성과 태스크 복귀 실패 동시 재현
  - Evidence: `artifacts/20260219_100901_adb_recentapps_cycle/am_start.txt`, `artifacts/20260219_100901_adb_recentapps_cycle/focus_after_start.txt`, `artifacts/20260219_100901_adb_recentapps_cycle/focus_after_return.txt`, `artifacts/20260219_100901_adb_recentapps_cycle/after_start.png`, `artifacts/20260219_100901_adb_recentapps_cycle/recent_open.png`, `artifacts/20260219_100901_adb_recentapps_cycle/after_return.png`, `artifacts/20260219_100901_adb_recentapps_cycle/logcat_tail.txt`

- [x] **TC-ADB-NOTISHADE-01** (AVD) Deeplink 랜딩 후 알림창 열기/닫기 복귀 안정성 — **failed (launch unstable)**
  - Steps: deeplink 진입 시도 → notification shade open/close
  - Observed: `am start`는 `Status: ok`이나 `LaunchState: UNKNOWN (0)`, `WaitTime: 25849`; focus가 시작 전/후 모두 launcher(`NexusLauncherActivity`)로 유지
  - Verdict: 본 케이스는 알림창 복귀 검증 전 단계(앱 랜딩)에서 실패
  - Evidence: `artifacts/20260219_091924_adb_notification_shade/am_start.txt`, `artifacts/20260219_091924_adb_notification_shade/focus_before_shade.txt`, `artifacts/20260219_091924_adb_notification_shade/focus_after_close.txt`, `artifacts/20260219_091924_adb_notification_shade/before.png`, `artifacts/20260219_091924_adb_notification_shade/shade_open.png`, `artifacts/20260219_091924_adb_notification_shade/after.png`

- [x] **TC-ADB-FORCESTOP-RELAUNCH-01** (AVD) force-stop 후 explicit deeplink 재진입 안정성 — **failed**
  - Steps: `am force-stop viva.republica.toss.test` → explicit deeplink `am start -W`
  - Observed: `am start`는 `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 19516`; 5초 후 focus는 `NexusLauncherActivity`
  - Verdict: force-stop 이후에도 deeplink 랜딩 실패 재현 (cold 재시작으로도 복구되지 않음)
  - Evidence: `artifacts/20260219_101121_adb_forcestop_relaunch/process_after_forcestop.txt`, `artifacts/20260219_101121_adb_forcestop_relaunch/am_start.txt`, `artifacts/20260219_101121_adb_forcestop_relaunch/focus_after_start.txt`, `artifacts/20260219_101121_adb_forcestop_relaunch/after_start.png`, `artifacts/20260219_101121_adb_forcestop_relaunch/logcat_tail.txt`

- [x] **TC-ADB-NOTISHADE-02** (AVD) 알림창 복귀 안정성 재검증(런처 fallback 재현 확인) — **failed (reproduced)**
  - Steps: Home 상태에서 explicit deeplink 실행 → 5초 대기 후 focus 확인 → notification shade open/close
  - Observed: `am start`가 `Status: ok`이나 `LaunchState: UNKNOWN (0)`, `WaitTime: 21041`; 시작 직후/알림창 닫은 후 모두 `NexusLauncherActivity` 유지
  - Verdict: 랜딩 실패가 간헐이 아닌 재현 가능한 이슈로 확인됨 (알림창 자체 영향 검증 이전 단계에서 차단)
  - Evidence: `artifacts/20260219_093226_adb_notishade_retest_stable/am_start.txt`, `artifacts/20260219_093226_adb_notishade_retest_stable/focus_before_start.txt`, `artifacts/20260219_093226_adb_notishade_retest_stable/focus_after_start.txt`, `artifacts/20260219_093226_adb_notishade_retest_stable/focus_after_close.txt`, `artifacts/20260219_093226_adb_notishade_retest_stable/after_start.png`, `artifacts/20260219_093226_adb_notishade_retest_stable/shade_open.png`, `artifacts/20260219_093226_adb_notishade_retest_stable/after_close.png`, `artifacts/20260219_093226_adb_notishade_retest_stable/logcat_tail.txt`

- [x] **TC-ADB-NOTISHADE-03** (AVD) 앱 활성 상태에서 알림창 열기/닫기 포커스 유지 — **passed**
  - Steps: explicit deeplink 진입 후 notification shade open/close 수행
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 1671ms`
    - 알림창 열기 전/닫기 후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 앱이 foreground로 정상 진입한 경우 알림창 토글 후 복귀 안정성 양호
  - Evidence: `artifacts/20260219_104357_adb_noti_open_close_focus/am_start.txt`, `artifacts/20260219_104357_adb_noti_open_close_focus/focus_before_noti.txt`, `artifacts/20260219_104357_adb_noti_open_close_focus/focus_after_noti.txt`, `artifacts/20260219_104357_adb_noti_open_close_focus/before_noti.png`, `artifacts/20260219_104357_adb_noti_open_close_focus/noti_open.png`, `artifacts/20260219_104357_adb_noti_open_close_focus/after_noti.png`, `artifacts/20260219_104357_adb_noti_open_close_focus/logcat_tail.txt`, `artifacts/20260219_104357_adb_noti_open_close_focus/log_hits.txt`

- [x] **TC-ADB-DEEPLINK-RETRY3-01** (AVD) Home 상태에서 explicit deeplink 3회 재시도 랜딩 일관성 — **failed (all 3 fallback)**
  - Steps: Home 진입 후 explicit deeplink 실행(`am start -W`)을 3회 반복, 각 회차 5초 뒤 focus 확인
  - Observed:
    - 1~3회 모두 `Status: ok` + `LaunchState: UNKNOWN (0)`
    - `WaitTime`: 19286ms / 12029ms / 11253ms
    - 1~3회 모두 focus가 `NexusLauncherActivity`로 유지(앱 랜딩 실패)
  - Verdict: 현재 환경에서 explicit deeplink 랜딩 실패가 고빈도/지속적으로 재현됨
  - Evidence: `artifacts/20260219_095829_adb_deeplink_retry3/am_start_1.txt`, `artifacts/20260219_095829_adb_deeplink_retry3/am_start_2.txt`, `artifacts/20260219_095829_adb_deeplink_retry3/am_start_3.txt`, `artifacts/20260219_095829_adb_deeplink_retry3/focus_1.txt`, `artifacts/20260219_095829_adb_deeplink_retry3/focus_2.txt`, `artifacts/20260219_095829_adb_deeplink_retry3/focus_3.txt`, `artifacts/20260219_095829_adb_deeplink_retry3/shot_1.png`, `artifacts/20260219_095829_adb_deeplink_retry3/shot_2.png`, `artifacts/20260219_095829_adb_deeplink_retry3/shot_3.png`, `artifacts/20260219_095829_adb_deeplink_retry3/logcat_tail.txt`

- [x] **TC-ADB-IMPLICIT-RETRY3-01** (AVD) Home 상태에서 implicit deeplink 3회 재시도 랜딩 일관성 — **failed (all 3 fallback)**
  - Steps: Home 진입 후 implicit deeplink 실행(`am start -W -a VIEW -d intoss://takealook viva.republica.toss.test`) 3회 반복
  - Observed:
    - 1~3회 모두 `Status: ok`, `Activity: .MiniAppSchemeActivity`, `LaunchState: UNKNOWN (0)`
    - `WaitTime`: 20170ms / 12198ms / 11712ms
    - 1~3회 모두 focus가 `NexusLauncherActivity`로 유지
  - Verdict: implicit 경로에서도 랜딩 실패가 지속 재현됨
  - Evidence: `artifacts/20260219_101311_adb_implicit_retry3/am_start_implicit_1.txt`, `artifacts/20260219_101311_adb_implicit_retry3/am_start_implicit_2.txt`, `artifacts/20260219_101311_adb_implicit_retry3/am_start_implicit_3.txt`, `artifacts/20260219_101311_adb_implicit_retry3/focus_1.txt`, `artifacts/20260219_101311_adb_implicit_retry3/focus_2.txt`, `artifacts/20260219_101311_adb_implicit_retry3/focus_3.txt`, `artifacts/20260219_101311_adb_implicit_retry3/shot_1.png`, `artifacts/20260219_101311_adb_implicit_retry3/shot_2.png`, `artifacts/20260219_101311_adb_implicit_retry3/shot_3.png`, `artifacts/20260219_101311_adb_implicit_retry3/logcat_tail.txt`

- [x] **TC-ADB-ANR-SCAN-01** (AVD) Explicit deeplink 직후 ANR/FATAL 로그 스캔 — **failed (ANR confirmed)**
  - Steps: Home 상태에서 explicit deeplink 실행 → 8초 대기 → focus 확인 + logcat 스캔
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: COLD`, `TotalTime: 30720ms`, `WaitTime: 30738ms`
    - 8초 후 focus가 `Application Not Responding: viva.republica.toss.test`
    - logcat에서 `ANR in viva.republica.toss.test` 및 ANR 완료 로그 검출
  - Verdict: 랜딩 실패 원인 후보로 ANR 증거가 명확히 확보됨
  - Evidence: `artifacts/20260219_101618_adb_logcat_anr_scan/am_start.txt`, `artifacts/20260219_101618_adb_logcat_anr_scan/focus_after_8s.txt`, `artifacts/20260219_101618_adb_logcat_anr_scan/after_8s.png`, `artifacts/20260219_101618_adb_logcat_anr_scan/logcat_full_tail.txt`, `artifacts/20260219_101618_adb_logcat_anr_scan/logcat_anr_fatal_hits.txt`

- [x] **TC-ADB-ANR-BACK-01** (AVD) ANR 다이얼로그 노출 시 Back key dismiss 반응 — **failed**
  - Steps: explicit deeplink 실행 후 8초 대기(ANR 유도) → `KEYCODE_BACK` 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: COLD`, `TotalTime: 21406ms`, `WaitTime: 21412ms`
    - Back 입력 전/후 focus 모두 `Application Not Responding: viva.republica.toss.test`
    - logcat에서 동일 시점 ANR 생성/완료 로그 재검출
  - Verdict: Back key로 ANR 다이얼로그 해소/화면 복귀가 확인되지 않음
  - Evidence: `artifacts/20260219_101848_adb_anr_back_dismiss/am_start.txt`, `artifacts/20260219_101848_adb_anr_back_dismiss/focus_before_back.txt`, `artifacts/20260219_101848_adb_anr_back_dismiss/focus_after_back.txt`, `artifacts/20260219_101848_adb_anr_back_dismiss/before_back.png`, `artifacts/20260219_101848_adb_anr_back_dismiss/after_back.png`, `artifacts/20260219_101848_adb_anr_back_dismiss/logcat_tail.txt`, `artifacts/20260219_101848_adb_anr_back_dismiss/anr_hits.txt`

- [x] **TC-ADB-FOCUS-STABLE-30S-01** (AVD) Explicit deeplink 진입 후 30초 포커스 안정성 — **passed**
  - Steps: Home 상태에서 explicit deeplink 실행 → 5초/30초 시점 focus 및 스크린샷 확인
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7227ms`, `WaitTime: 7235ms`
    - 5초/30초 모두 focus가 `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL 키워드 미검출
  - Verdict: 해당 실행에서는 최소 30초 구간 안정적으로 랜딩 상태 유지
  - Evidence: `artifacts/20260219_102925_adb_wait30_focus_stability/am_start.txt`, `artifacts/20260219_102925_adb_wait30_focus_stability/focus_5s.txt`, `artifacts/20260219_102925_adb_wait30_focus_stability/focus_30s.txt`, `artifacts/20260219_102925_adb_wait30_focus_stability/shot_5s.png`, `artifacts/20260219_102925_adb_wait30_focus_stability/shot_30s.png`, `artifacts/20260219_102925_adb_wait30_focus_stability/logcat_tail.txt`, `artifacts/20260219_102925_adb_wait30_focus_stability/log_hits.txt`

- [x] **TC-ADB-FOCUS-STABLE-60S-01** (AVD) Deeplink 진입 후 60초 포커스 안정성 — **passed**
  - Steps: explicit deeplink 실행 후 10초/60초 시점 focus 확인
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 606ms`, `WaitTime: 631ms`
    - 10초/60초 모두 focus가 `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 해당 실행에서는 최소 60초 구간 안정적으로 foreground 유지
  - Evidence: `artifacts/20260219_103358_adb_focus_stable_60s/am_start.txt`, `artifacts/20260219_103358_adb_focus_stable_60s/focus_10s.txt`, `artifacts/20260219_103358_adb_focus_stable_60s/focus_60s.txt`, `artifacts/20260219_103358_adb_focus_stable_60s/shot_10s.png`, `artifacts/20260219_103358_adb_focus_stable_60s/shot_60s.png`, `artifacts/20260219_103358_adb_focus_stable_60s/logcat_tail.txt`, `artifacts/20260219_103358_adb_focus_stable_60s/log_hits.txt`

- [x] **TC-ADB-FOCUS-STABLE-120S-01** (AVD) Deeplink 진입 후 120초 유휴 안정성 — **passed**
  - Steps: explicit deeplink 실행 후 10초/120초 시점 focus 확인
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 107ms`
    - 10초/120초 모두 focus가 `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 2분 유휴 구간에서도 foreground 유지 안정성 확인
  - Evidence: `artifacts/20260219_104655_adb_idle_120s_stability/am_start.txt`, `artifacts/20260219_104655_adb_idle_120s_stability/focus_10s.txt`, `artifacts/20260219_104655_adb_idle_120s_stability/focus_120s.txt`, `artifacts/20260219_104655_adb_idle_120s_stability/shot_120s.png`, `artifacts/20260219_104655_adb_idle_120s_stability/logcat_tail.txt`, `artifacts/20260219_104655_adb_idle_120s_stability/log_hits.txt`

- Notes:
  - Login: Toss login button is one-tap (auto login).
  - App capability: file upload only (no text message send).

- Last update: 2026-02-19 11:23 KST
