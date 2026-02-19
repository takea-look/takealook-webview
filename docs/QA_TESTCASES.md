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

- [x] **TC-ADB-DEEPLINK-MODE-SWITCH-01** (AVD) explicit→implicit 백투백 진입 안정성 — **passed**
  - Steps: explicit deeplink 진입 확인 후 Home 이동, 이어서 implicit deeplink 실행
  - Observed:
    - explicit: `Status: ok`, `LaunchState: HOT`, `WaitTime: 373ms`, focus `GraniteActivity`
    - implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 755ms`
    - implicit 실행 후 최종 focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: deeplink 모드 전환(explicit→implicit) 시 진입 안정성 양호
  - Evidence: `artifacts/20260219_113356_adb_explicit_implicit_backtoback/am_start_explicit.txt`, `artifacts/20260219_113356_adb_explicit_implicit_backtoback/focus_after_explicit.txt`, `artifacts/20260219_113356_adb_explicit_implicit_backtoback/am_start_implicit.txt`, `artifacts/20260219_113356_adb_explicit_implicit_backtoback/focus_after_implicit.txt`, `artifacts/20260219_113356_adb_explicit_implicit_backtoback/after_implicit.png`, `artifacts/20260219_113356_adb_explicit_implicit_backtoback/logcat_tail.txt`, `artifacts/20260219_113356_adb_explicit_implicit_backtoback/log_hits.txt`

- [x] **TC-ADB-DEEPLINK-MODE-SWITCH-02** (AVD) implicit→explicit 백투백 진입 안정성 — **passed**
  - Steps: implicit deeplink 진입 확인 후 Home 이동, 이어서 explicit deeplink 실행
  - Observed:
    - implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 534ms`, focus `GraniteActivity`
    - explicit: `Status: ok`, `LaunchState: HOT`, `Activity: GraniteActivity`, `WaitTime: 341ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: deeplink 모드 전환(implicit→explicit)도 안정적으로 동작
  - Evidence: `artifacts/20260219_114523_adb_implicit_explicit_backtoback/am_start_implicit.txt`, `artifacts/20260219_114523_adb_implicit_explicit_backtoback/focus_after_implicit.txt`, `artifacts/20260219_114523_adb_implicit_explicit_backtoback/am_start_explicit.txt`, `artifacts/20260219_114523_adb_implicit_explicit_backtoback/focus_after_explicit.txt`, `artifacts/20260219_114523_adb_implicit_explicit_backtoback/after_explicit.png`, `artifacts/20260219_114523_adb_implicit_explicit_backtoback/logcat_tail.txt`, `artifacts/20260219_114523_adb_implicit_explicit_backtoback/log_hits.txt`

- [x] **TC-ADB-DEEPLINK-EXPLICIT-IMPLICIT-BACK-01** (AVD) explicit→implicit 직후 Back 반응성 — **failed (no transition)**
  - Steps: explicit deeplink 실행 → implicit deeplink 실행 → `KEYCODE_BACK` 1회 입력
  - Observed:
    - explicit `am start`: `Status: ok`, `LaunchState: WARM`, `WaitTime: 2833ms`
    - implicit `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 16`
    - back 전/후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit→implicit 연속 진입 후에도 Back 입력에 화면 전환 반응 미확인
  - Evidence: `artifacts/20260219_124345_adb_explicit_implicit_then_back/am_start_explicit.txt`, `artifacts/20260219_124345_adb_explicit_implicit_then_back/am_start_implicit.txt`, `artifacts/20260219_124345_adb_explicit_implicit_then_back/focus_before_back.txt`, `artifacts/20260219_124345_adb_explicit_implicit_then_back/focus_after_back.txt`, `artifacts/20260219_124345_adb_explicit_implicit_then_back/after_back.png`, `artifacts/20260219_124345_adb_explicit_implicit_then_back/logcat_tail.txt`, `artifacts/20260219_124345_adb_explicit_implicit_then_back/log_hits.txt`

- [x] **TC-ADB-DEEPLINK-IMPLICIT-EXPLICIT-BACK-01** (AVD) implicit→explicit 직후 Back 반응성 — **failed (no transition)**
  - Steps: implicit deeplink 실행 → explicit deeplink 실행 → `KEYCODE_BACK` 1회 입력
  - Observed:
    - implicit `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 416ms`
    - explicit `am start`: `Status: ok`, `LaunchState: WARM`, `WaitTime: 1067ms`
    - back 전/후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit→explicit 연속 진입 후에도 Back 입력에 화면 전환 반응 미확인
  - Evidence: `artifacts/20260219_124542_adb_implicit_explicit_then_back/am_start_implicit.txt`, `artifacts/20260219_124542_adb_implicit_explicit_then_back/am_start_explicit.txt`, `artifacts/20260219_124542_adb_implicit_explicit_then_back/focus_before_back.txt`, `artifacts/20260219_124542_adb_implicit_explicit_then_back/focus_after_back.txt`, `artifacts/20260219_124542_adb_implicit_explicit_then_back/after_back.png`, `artifacts/20260219_124542_adb_implicit_explicit_then_back/logcat_tail.txt`, `artifacts/20260219_124542_adb_implicit_explicit_then_back/log_hits.txt`

- [x] **TC-ADB-DEEPLINK-DOUBLE-NOHOME-01** (AVD) Home 이동 없이 explicit deeplink 연속 2회 처리 — **passed (with warning log)**
  - Steps: explicit deeplink 실행 직후 Home 이동 없이 동일 explicit deeplink 즉시 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 370ms`
    - 2차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 27ms` (`intent has been delivered to currently running top-most instance`)
    - 2차 실행 후 focus는 `GraniteActivity` 유지
    - logcat에서 `Application ANR likely to follow` 경고 1건 검출(실제 ANR 이벤트는 미검출)
  - Verdict: 기능상 연속 deeplink 처리 성공, 단 전환 경고 로그가 있어 모니터링 필요
  - Evidence: `artifacts/20260219_114707_adb_double_deeplink_nohome/am_start_1.txt`, `artifacts/20260219_114707_adb_double_deeplink_nohome/am_start_2.txt`, `artifacts/20260219_114707_adb_double_deeplink_nohome/focus_after_second.txt`, `artifacts/20260219_114707_adb_double_deeplink_nohome/after_second.png`, `artifacts/20260219_114707_adb_double_deeplink_nohome/logcat_tail.txt`, `artifacts/20260219_114707_adb_double_deeplink_nohome/log_hits.txt`

- [x] **TC-ADB-DEEPLINK-DOUBLE-IMPLICIT-01** (AVD) Home 이동 없이 implicit deeplink 연속 2회 처리 — **passed**
  - Steps: implicit deeplink 실행 직후 Home 이동 없이 동일 implicit deeplink 즉시 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 539ms`
    - 2차 `am start`: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 227ms`
    - 2차 실행 후 focus는 `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 연속 deeplink 처리 안정적
  - Evidence: `artifacts/20260219_114855_adb_double_implicit_nohome/am_start_1_implicit.txt`, `artifacts/20260219_114855_adb_double_implicit_nohome/am_start_2_implicit.txt`, `artifacts/20260219_114855_adb_double_implicit_nohome/focus_after_second.txt`, `artifacts/20260219_114855_adb_double_implicit_nohome/after_second.png`, `artifacts/20260219_114855_adb_double_implicit_nohome/logcat_tail.txt`, `artifacts/20260219_114855_adb_double_implicit_nohome/log_hits.txt`

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

- [x] **TC-ADB-LAUNCH-WAITTIME-03** (AVD) Explicit deeplink 10회 연속 실행 응답 시간 분포 — **passed (very high variance observed)**
  - Steps: Home 상태에서 explicit deeplink `am start -W` 10회 연속 실행, 각 회차 focus 확인
  - Observed:
    - WaitTime: `281 / 168 / 142 / 13742 / 134 / 161 / 209 / 674 / 82 / 233 ms`
    - 통계: min `82ms`, max `13742ms`, avg `1582.6ms`, median `188.5ms`
    - 1~10회 모두 focus `GraniteActivity` 유지 (`focus_ok=10`)
    - LaunchState 혼재: `HOT` 및 `UNKNOWN (0)`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 기능 관점 랜딩 성공률은 높으나, 실행 지연 분산이 매우 큼(성능 플래키 위험)
  - Evidence: `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_1.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_2.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_3.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_4.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_5.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_6.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_7.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_8.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_9.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/am_start_10.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_1.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_2.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_3.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_4.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_5.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_6.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_7.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_8.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_9.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/focus_10.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/summary.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/logcat_tail.txt`, `artifacts/20260219_112455_adb_launch_waittime_10runs/log_hits.txt`

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

- [x] **TC-ADB-BGFG-03** (AVD) Deeplink 진입 후 Home 이탈/복귀 단일 사이클 확인 — **passed**
  - Steps: explicit deeplink 진입 → Home 이동 → `monkey resume` 1회
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 1644ms`, `WaitTime: 1647ms`
    - 시작 직후 focus: `GraniteActivity`
    - Home 이동 시 focus: `NexusLauncherActivity`
    - resume 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 단일 BG/FG 복귀 플로우 정상
  - Evidence: `artifacts/20260219_112711_adb_deeplink_then_home_resume/am_start.txt`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/focus_after_start.txt`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/focus_after_home.txt`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/focus_after_resume.txt`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/monkey_resume.txt`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/after_resume.png`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/logcat_tail.txt`, `artifacts/20260219_112711_adb_deeplink_then_home_resume/log_hits.txt`

- [x] **TC-ADB-BGFG-30S-HOME-01** (AVD) Home 30초 대기 후 복귀 안정성 — **passed**
  - Steps: explicit deeplink 진입 → Home 이동 후 30초 대기 → `monkey resume`
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 456ms`, `WaitTime: 467ms`
    - 진입 직후 focus: `GraniteActivity`
    - Home 30초 후 focus: `NexusLauncherActivity`
    - resume 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: Home 장시간(30초) 이탈 후에도 복귀 안정성 양호
  - Evidence: `artifacts/20260219_113954_adb_home_wait_resume_30s/am_start.txt`, `artifacts/20260219_113954_adb_home_wait_resume_30s/focus_after_start.txt`, `artifacts/20260219_113954_adb_home_wait_resume_30s/focus_after_home_30s.txt`, `artifacts/20260219_113954_adb_home_wait_resume_30s/focus_after_resume.txt`, `artifacts/20260219_113954_adb_home_wait_resume_30s/monkey_resume.txt`, `artifacts/20260219_113954_adb_home_wait_resume_30s/after_resume.png`, `artifacts/20260219_113954_adb_home_wait_resume_30s/logcat_tail.txt`, `artifacts/20260219_113954_adb_home_wait_resume_30s/log_hits.txt`

- [x] **TC-ADB-BGFG-HOME-DOUBLE-01** (AVD) Home 2회 연속 입력 후 복귀 안정성 — **passed**
  - Steps: explicit deeplink 진입 → `KEYCODE_HOME` 2회 연속 입력 → `monkey resume`
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 2314ms`, `WaitTime: 2329ms`
    - 진입 직후 focus: `GraniteActivity`
    - Home 2회 입력 후 focus: `NexusLauncherActivity`
    - resume 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 중복 입력 상황에서도 복귀 동작 정상
  - Evidence: `artifacts/20260219_120001_adb_home_double_then_resume/am_start.txt`, `artifacts/20260219_120001_adb_home_double_then_resume/focus_after_start.txt`, `artifacts/20260219_120001_adb_home_double_then_resume/focus_after_home_double.txt`, `artifacts/20260219_120001_adb_home_double_then_resume/focus_after_resume.txt`, `artifacts/20260219_120001_adb_home_double_then_resume/monkey_resume.txt`, `artifacts/20260219_120001_adb_home_double_then_resume/after_resume.png`, `artifacts/20260219_120001_adb_home_double_then_resume/logcat_tail.txt`, `artifacts/20260219_120001_adb_home_double_then_resume/log_hits.txt`

- [x] **TC-ADB-SCREEN-SLEEP-WAKE-01** (AVD) 화면 OFF/ON 후 포그라운드 복귀 안정성 — **passed**
  - Steps: explicit deeplink 진입 → `KEYCODE_SLEEP` → `KEYCODE_WAKEUP` + unlock(82)
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 182ms`, `WaitTime: 208ms`
    - sleep 전/awake 후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 잠금/해제 사이클 후 앱 포그라운드 유지 정상
  - Evidence: `artifacts/20260219_113753_adb_screen_off_on_resume/am_start.txt`, `artifacts/20260219_113753_adb_screen_off_on_resume/focus_before_sleep.txt`, `artifacts/20260219_113753_adb_screen_off_on_resume/power_after_sleep.txt`, `artifacts/20260219_113753_adb_screen_off_on_resume/focus_after_wakeup.txt`, `artifacts/20260219_113753_adb_screen_off_on_resume/after_wakeup.png`, `artifacts/20260219_113753_adb_screen_off_on_resume/logcat_tail.txt`, `artifacts/20260219_113753_adb_screen_off_on_resume/log_hits.txt`

- [x] **TC-ADB-HOME-SLEEP-WAKE-RESUME-01** (AVD) Home 이탈 후 Sleep/Wake 뒤 앱 복귀 — **passed**
  - Steps: explicit deeplink 진입 → `HOME` → `SLEEP/WAKE + unlock(82)` → `monkey resume`
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 1016ms`
    - 최종 resume 후 focus `GraniteActivity` 확인
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 이탈 + 화면 잠금/해제 조합에서도 복귀 안정성 양호
  - Evidence: `artifacts/20260219_120505_adb_home_sleep_wake_resume/am_start.txt`, `artifacts/20260219_120505_adb_home_sleep_wake_resume/monkey_resume.txt`, `artifacts/20260219_120505_adb_home_sleep_wake_resume/focus_after_resume.txt`, `artifacts/20260219_120505_adb_home_sleep_wake_resume/after_resume.png`, `artifacts/20260219_120505_adb_home_sleep_wake_resume/logcat_tail.txt`, `artifacts/20260219_120505_adb_home_sleep_wake_resume/log_hits.txt`

- [x] **TC-ADB-SCREENWAKE-IMPLICIT-01** (AVD) 화면 깨운 직후 implicit deeplink 진입 안정성 — **passed**
  - Steps: `KEYCODE_SLEEP` → `KEYCODE_WAKEUP` + unlock(82) 후 implicit deeplink 실행
  - Observed:
    - implicit `am start`: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 548ms`, `WaitTime: 565ms`
    - 실행 후 focus는 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 화면 wake 직후에도 implicit deeplink 진입 정상
  - Evidence: `artifacts/20260219_114205_adb_implicit_after_screen_wake/am_start_implicit.txt`, `artifacts/20260219_114205_adb_implicit_after_screen_wake/focus_after_implicit.txt`, `artifacts/20260219_114205_adb_implicit_after_screen_wake/after_implicit.png`, `artifacts/20260219_114205_adb_implicit_after_screen_wake/logcat_tail.txt`, `artifacts/20260219_114205_adb_implicit_after_screen_wake/log_hits.txt`

- [x] **TC-ADB-SCREENWAKE-EXPLICIT-01** (AVD) 화면 깨운 직후 explicit deeplink 진입 안정성 — **passed**
  - Steps: `KEYCODE_SLEEP` → `KEYCODE_WAKEUP` + unlock(82) 후 explicit deeplink 실행
  - Observed:
    - explicit `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 207ms`, `WaitTime: 224ms`
    - 실행 후 focus는 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 화면 wake 직후 explicit deeplink도 안정적으로 진입
  - Evidence: `artifacts/20260219_114338_adb_explicit_after_screen_wake/am_start_explicit.txt`, `artifacts/20260219_114338_adb_explicit_after_screen_wake/focus_after_explicit.txt`, `artifacts/20260219_114338_adb_explicit_after_screen_wake/after_explicit.png`, `artifacts/20260219_114338_adb_explicit_after_screen_wake/logcat_tail.txt`, `artifacts/20260219_114338_adb_explicit_after_screen_wake/log_hits.txt`

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

- [x] **TC-ADB-HOME-BACK-DEEPLINK-01** (AVD) Home 후 Back 입력 상태에서 deeplink 진입 — **passed**
  - Steps: `HOME` 입력 후 `BACK` 1회 입력 → explicit deeplink 실행
  - Observed:
    - Home+Back 후 focus: `NexusLauncherActivity`
    - `am start`: `Status: ok`, `LaunchState: WARM`, `TotalTime: 738ms`, `WaitTime: 803ms`
    - deeplink 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: launcher 상태(Home+Back)에서도 deeplink 진입 정상
  - Evidence: `artifacts/20260219_123245_adb_home_back_deeplink/focus_after_home_back.txt`, `artifacts/20260219_123245_adb_home_back_deeplink/am_start.txt`, `artifacts/20260219_123245_adb_home_back_deeplink/focus_after_start.txt`, `artifacts/20260219_123245_adb_home_back_deeplink/after_start.png`, `artifacts/20260219_123245_adb_home_back_deeplink/logcat_tail.txt`, `artifacts/20260219_123245_adb_home_back_deeplink/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-BACK-DEEPLINK-01** (AVD) Home→Recents→Back 상태에서 explicit deeplink 진입 — **passed**
  - Steps: `HOME` → `APP_SWITCH` → `BACK` 입력 후 explicit deeplink 실행
  - Observed:
    - Home/recents/back 이후 focus: `NexusLauncherActivity`
    - `am start`: `Status: ok`, `LaunchState: WARM`, `TotalTime: 828ms`, `WaitTime: 855ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 복합 launcher 상태(Home→Recents→Back)에서도 explicit deeplink 진입 정상
  - Evidence: `artifacts/20260219_130431_adb_home_recents_back_then_explicit/focus_after_home_recents_back.txt`, `artifacts/20260219_130431_adb_home_recents_back_then_explicit/am_start.txt`, `artifacts/20260219_130431_adb_home_recents_back_then_explicit/focus_after_start.txt`, `artifacts/20260219_130431_adb_home_recents_back_then_explicit/after_start.png`, `artifacts/20260219_130431_adb_home_recents_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_130431_adb_home_recents_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-BACK-DEEPLINK-02** (AVD) Home→Recents→Back 상태 explicit 재검증 — **passed**
  - Steps: `HOME` → `APP_SWITCH` → `BACK` 입력 후 explicit deeplink 재실행
  - Observed:
    - Home/recents/back 이후 focus: `NexusLauncherActivity`
    - `am start`: `Status: ok`, `LaunchState: WARM`, `TotalTime: 819ms`, `WaitTime: 824ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 explicit 재진입이 재검증에서도 안정적으로 성공
  - Evidence: `artifacts/20260219_130837_adb_home_recents_back_then_explicit_repeat/focus_after_home_recents_back.txt`, `artifacts/20260219_130837_adb_home_recents_back_then_explicit_repeat/am_start_explicit.txt`, `artifacts/20260219_130837_adb_home_recents_back_then_explicit_repeat/focus_after_start.txt`, `artifacts/20260219_130837_adb_home_recents_back_then_explicit_repeat/after_start.png`, `artifacts/20260219_130837_adb_home_recents_back_then_explicit_repeat/logcat_tail.txt`, `artifacts/20260219_130837_adb_home_recents_back_then_explicit_repeat/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-BACK-IMPLICIT-01** (AVD) Home→Recents→Back 상태에서 implicit deeplink 진입 — **passed**
  - Steps: `HOME` → `APP_SWITCH` → `BACK` 입력 후 implicit deeplink 실행
  - Observed:
    - Home/recents/back 이후 focus: `NexusLauncherActivity`
    - implicit `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 906ms`, `WaitTime: 937ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 복합 launcher 상태(Home→Recents→Back)에서도 implicit deeplink 진입 정상
  - Evidence: `artifacts/20260219_130626_adb_home_recents_back_then_implicit/focus_after_home_recents_back.txt`, `artifacts/20260219_130626_adb_home_recents_back_then_implicit/am_start_implicit.txt`, `artifacts/20260219_130626_adb_home_recents_back_then_implicit/focus_after_start.txt`, `artifacts/20260219_130626_adb_home_recents_back_then_implicit/after_start.png`, `artifacts/20260219_130626_adb_home_recents_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_130626_adb_home_recents_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-BACK-IMPLICIT-02** (AVD) Home→Recents→Back 상태 implicit 재검증 — **passed**
  - Steps: `HOME` → `APP_SWITCH` → `BACK` 입력 후 implicit deeplink 재실행
  - Observed:
    - Home/recents/back 이후 focus: `NexusLauncherActivity`
    - implicit `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 157ms`, `WaitTime: 162ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 implicit 재진입도 안정적으로 성공
  - Evidence: `artifacts/20260219_131030_adb_home_recents_back_then_implicit_repeat/focus_after_home_recents_back.txt`, `artifacts/20260219_131030_adb_home_recents_back_then_implicit_repeat/am_start_implicit.txt`, `artifacts/20260219_131030_adb_home_recents_back_then_implicit_repeat/focus_after_start.txt`, `artifacts/20260219_131030_adb_home_recents_back_then_implicit_repeat/after_start.png`, `artifacts/20260219_131030_adb_home_recents_back_then_implicit_repeat/logcat_tail.txt`, `artifacts/20260219_131030_adb_home_recents_back_then_implicit_repeat/log_hits.txt`

- [x] **TC-ADB-HOME-SLEEPWAKE-IMPLICIT-01** (AVD) Home→Sleep/Wake 후 implicit deeplink 진입 — **passed**
  - Steps: `HOME` → `SLEEP/WAKE + unlock(82)` 후 implicit deeplink 실행
  - Observed:
    - wake 직후 focus: `NexusLauncherActivity`
    - implicit `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 323ms`, `WaitTime: 338ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 및 화면 sleep/wake 조합 이후에도 implicit deeplink 진입 정상
  - Evidence: `artifacts/20260219_131223_adb_home_sleepwake_then_implicit/focus_after_wakeup.txt`, `artifacts/20260219_131223_adb_home_sleepwake_then_implicit/am_start_implicit.txt`, `artifacts/20260219_131223_adb_home_sleepwake_then_implicit/focus_after_start.txt`, `artifacts/20260219_131223_adb_home_sleepwake_then_implicit/after_start.png`, `artifacts/20260219_131223_adb_home_sleepwake_then_implicit/logcat_tail.txt`, `artifacts/20260219_131223_adb_home_sleepwake_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-BACK-IMPLICIT-01** (AVD) Home 후 Back 입력 상태에서 implicit deeplink 진입 — **passed**
  - Steps: `HOME` 입력 후 `BACK` 1회 입력 → implicit deeplink 실행
  - Observed:
    - Home+Back 후 focus: `NexusLauncherActivity`
    - implicit `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 198ms`, `WaitTime: 244ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: launcher 상태(Home+Back)에서도 implicit deeplink 진입 정상
  - Evidence: `artifacts/20260219_123427_adb_home_back_implicit_deeplink/focus_after_home_back.txt`, `artifacts/20260219_123427_adb_home_back_implicit_deeplink/am_start_implicit.txt`, `artifacts/20260219_123427_adb_home_back_implicit_deeplink/focus_after_start.txt`, `artifacts/20260219_123427_adb_home_back_implicit_deeplink/after_start.png`, `artifacts/20260219_123427_adb_home_back_implicit_deeplink/logcat_tail.txt`, `artifacts/20260219_123427_adb_home_back_implicit_deeplink/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-DEEPLINK-01** (AVD) Recents 진입 후 Back 상태에서 deeplink 진입 — **passed**
  - Steps: `APP_SWITCH`로 recents 진입 → `BACK` 입력 → explicit deeplink 실행
  - Observed:
    - recents+back 후 focus: `NexusLauncherActivity`
    - explicit `am start`: `Status: ok`, `LaunchState: WARM`, `TotalTime: 471ms`, `WaitTime: 497ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat에서 대상 앱 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: recents에서 back으로 빠진 launcher 상태에서도 deeplink 진입 정상
  - Evidence: `artifacts/20260219_123604_adb_recents_back_then_deeplink/focus_after_recents_back.txt`, `artifacts/20260219_123604_adb_recents_back_then_deeplink/am_start.txt`, `artifacts/20260219_123604_adb_recents_back_then_deeplink/focus_after_start.txt`, `artifacts/20260219_123604_adb_recents_back_then_deeplink/after_start.png`, `artifacts/20260219_123604_adb_recents_back_then_deeplink/logcat_tail.txt`, `artifacts/20260219_123604_adb_recents_back_then_deeplink/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-IMPLICIT-01** (AVD) Recents 진입 후 Back 상태에서 implicit deeplink 진입 — **passed**
  - Steps: `APP_SWITCH`로 recents 진입 → `BACK` 입력 → implicit deeplink 실행
  - Observed:
    - recents+back 후 focus: `NexusLauncherActivity`
    - implicit `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 107ms`, `WaitTime: 131ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: recents-back launcher 상태에서도 implicit deeplink 진입 정상
  - Evidence: `artifacts/20260219_123753_adb_recents_back_implicit_deeplink/focus_after_recents_back.txt`, `artifacts/20260219_123753_adb_recents_back_implicit_deeplink/am_start_implicit.txt`, `artifacts/20260219_123753_adb_recents_back_implicit_deeplink/focus_after_start.txt`, `artifacts/20260219_123753_adb_recents_back_implicit_deeplink/after_start.png`, `artifacts/20260219_123753_adb_recents_back_implicit_deeplink/logcat_tail.txt`, `artifacts/20260219_123753_adb_recents_back_implicit_deeplink/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-IMPLICIT-02** (AVD) Recents+Back 후 implicit 재진입 재검증 — **failed (ANR detected)**
  - Steps: explicit 진입 후 `APP_SWITCH`→`BACK` 수행 뒤 implicit deeplink 실행
  - Observed:
    - recents+back 직후 focus 캡처값이 비어 있음(`focus_after_recents_back.txt` empty)
    - implicit `am start`: `Status: ok`, `LaunchState: WARM`, `TotalTime: 6814ms`, `WaitTime: 7113ms`
    - 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - logcat에서 `ANR in viva.republica.toss.test` 검출
  - Verdict: 동일 플로우 재검증에서 ANR 재현되어 fail
  - Evidence: `artifacts/20260219_125247_adb_recents_back_implicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_125247_adb_recents_back_implicit_reentry/focus_after_recents_back.txt`, `artifacts/20260219_125247_adb_recents_back_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_125247_adb_recents_back_implicit_reentry/focus_after_reentry.txt`, `artifacts/20260219_125247_adb_recents_back_implicit_reentry/after_reentry.png`, `artifacts/20260219_125247_adb_recents_back_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_125247_adb_recents_back_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-HOME-DEEPLINK-REPEAT3-01** (AVD) Home→explicit deeplink 3회 반복 진입 안정성 — **passed**
  - Steps: `Home → explicit deeplink` 시퀀스를 3회 연속 반복
  - Observed:
    - 1~3회 `am start` 모두 `Status: ok`
    - `WaitTime`: `321ms / 157ms / 622ms`
    - LaunchState: `HOT / UNKNOWN (0) / HOT`
    - 1~3회 모두 focus `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 반복 Home 재진입 시나리오에서도 기능 안정성 양호
  - Evidence: `artifacts/20260219_115047_adb_home_deeplink_repeat3/am_start_1.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/am_start_2.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/am_start_3.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/focus_1.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/focus_2.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/focus_3.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/shot_1.png`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/shot_2.png`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/shot_3.png`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/logcat_tail.txt`, `artifacts/20260219_115047_adb_home_deeplink_repeat3/log_hits.txt`

- [x] **TC-ADB-HOME-IMPLICIT-REPEAT3-01** (AVD) Home→implicit deeplink 3회 반복 진입 안정성 — **passed**
  - Steps: `Home → implicit deeplink` 시퀀스를 3회 연속 반복
  - Observed:
    - 1~3회 `am start` 모두 `Status: ok`, `LaunchState: HOT`
    - `WaitTime`: `2015ms / 1248ms / 313ms`
    - 1~3회 모두 focus `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 경로 반복 Home 재진입 시나리오도 안정적으로 동작
  - Evidence: `artifacts/20260219_122216_adb_home_implicit_repeat3/am_start_1.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/am_start_2.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/am_start_3.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/focus_1.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/focus_2.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/focus_3.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/shot_1.png`, `artifacts/20260219_122216_adb_home_implicit_repeat3/shot_2.png`, `artifacts/20260219_122216_adb_home_implicit_repeat3/shot_3.png`, `artifacts/20260219_122216_adb_home_implicit_repeat3/logcat_tail.txt`, `artifacts/20260219_122216_adb_home_implicit_repeat3/log_hits.txt`

- [x] **TC-ADB-RECENTS-DEEPLINK-RECOVER-01** (AVD) Recent Apps 진입 후 deeplink 복구 진입 — **passed**
  - Steps: Home에서 Recent Apps 호출(`KEYCODE_APP_SWITCH`) → explicit deeplink 실행
  - Observed:
    - Recent 호출 시 focus는 `NexusLauncherActivity`
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 133ms`, `WaitTime: 141ms`
    - deeplink 실행 후 focus `GraniteActivity`로 정상 전환
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 최근앱(overview) 상태에서도 deeplink 복구 진입 정상
  - Evidence: `artifacts/20260219_104201_adb_recents_then_deeplink_recover/focus_on_recents.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/recents.png`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/am_start.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/focus_after_start.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/after_start.png`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/logcat_tail.txt`, `artifacts/20260219_104201_adb_recents_then_deeplink_recover/log_hits.txt`

- [x] **TC-ADB-RECENTS-HOME-DEEPLINK-01** (AVD) Recents 진입 후 Home 거쳐 deeplink 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 560ms`, focus `GraniteActivity`
    - Recents 후 Home 시점 focus: `NexusLauncherActivity`
    - 2차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 165ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 경유 후 Home을 거쳐도 deeplink 재진입 안정적
  - Evidence: `artifacts/20260219_120327_adb_recents_home_then_deeplink/am_start_1.txt`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/focus_after_start_1.txt`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/focus_after_recents_home.txt`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/am_start_2.txt`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/focus_after_start_2.txt`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/after_start_2.png`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/logcat_tail.txt`, `artifacts/20260219_120327_adb_recents_home_then_deeplink/log_hits.txt`

- [x] **TC-ADB-RECENTS-EXPLICIT-DIRECT-01** (AVD) Recents 상태에서 explicit deeplink 직접 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`로 recents 진입 → Home 없이 explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 543ms`
    - recents 시점 focus: `NexusLauncherActivity`
    - 2차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 19` (`intent has been delivered to currently running top-most instance`)
    - 재실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 상태에서도 explicit deeplink 직접 재진입 정상
  - Evidence: `artifacts/20260219_121019_adb_recents_then_explicit_direct/am_start_1.txt`, `artifacts/20260219_121019_adb_recents_then_explicit_direct/focus_on_recents.txt`, `artifacts/20260219_121019_adb_recents_then_explicit_direct/am_start_2.txt`, `artifacts/20260219_121019_adb_recents_then_explicit_direct/focus_after_reentry.txt`, `artifacts/20260219_121019_adb_recents_then_explicit_direct/after_reentry.png`, `artifacts/20260219_121019_adb_recents_then_explicit_direct/logcat_tail.txt`, `artifacts/20260219_121019_adb_recents_then_explicit_direct/log_hits.txt`

- [x] **TC-ADB-RECENTS-IMPLICIT-DIRECT-01** (AVD) Recents 상태에서 implicit deeplink 직접 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`로 recents 진입 → Home 없이 implicit deeplink 재실행
  - Observed:
    - recents 시점 focus: `NexusLauncherActivity`
    - implicit 재실행: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 1694` (`intent has been delivered to currently running top-most instance`)
    - 재진입 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 상태에서도 implicit deeplink 직접 재진입 정상
  - Evidence: `artifacts/20260219_124934_adb_recents_implicit_direct/focus_on_recents.txt`, `artifacts/20260219_124934_adb_recents_implicit_direct/am_start_2_implicit.txt`, `artifacts/20260219_124934_adb_recents_implicit_direct/focus_after_reentry.txt`, `artifacts/20260219_124934_adb_recents_implicit_direct/after_reentry.png`, `artifacts/20260219_124934_adb_recents_implicit_direct/logcat_tail.txt`, `artifacts/20260219_124934_adb_recents_implicit_direct/log_hits.txt`

- [x] **TC-ADB-SETTINGS-ROUNDTRIP-01** (AVD) Settings 왕복 후 deeplink 재진입 안정성 — **passed (with non-target process death log)**
  - Steps: explicit deeplink 진입 → Settings 앱 진입 → Home → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 758ms`
    - Settings 진입: `Status: ok`, `LaunchState: HOT`, `WaitTime: 16577ms`, focus `SettingsHomepageActivity`
    - 2차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 4396ms`, focus `GraniteActivity`
    - logcat 스캔에서 타 프로세스(`com.android.vending:instant_app_installer`) 종료 로그 1건, 대상 앱 ANR/FATAL/obituary 미검출
  - Verdict: Settings 왕복 후 deeplink 재진입 기능은 정상
  - Evidence: `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/am_start_1.txt`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/am_settings.txt`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/focus_on_settings.txt`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/am_start_2.txt`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/focus_after_reentry.txt`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/after_reentry.png`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/logcat_tail.txt`, `artifacts/20260219_120646_adb_deeplink_after_settings_roundtrip/log_hits.txt`

- [x] **TC-ADB-SETTINGS-HOME-RESUME-01** (AVD) Settings 진입 후 Home에서 앱 복귀 안정성 — **passed**
  - Steps: Settings 실행 → Home 이동 → `monkey -p viva.republica.toss.test ... 1`로 앱 복귀
  - Observed:
    - Settings 실행: `Status: ok`, `LaunchState: HOT`, `WaitTime: 1223ms`, focus `SettingsHomepageActivity`
    - resume 후 focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 타 앱(Settings) 진입 후 Home 경유 복귀 플로우 정상
  - Evidence: `artifacts/20260219_121532_adb_settings_home_resume/am_settings.txt`, `artifacts/20260219_121532_adb_settings_home_resume/focus_on_settings.txt`, `artifacts/20260219_121532_adb_settings_home_resume/monkey_resume.txt`, `artifacts/20260219_121532_adb_settings_home_resume/focus_after_resume.txt`, `artifacts/20260219_121532_adb_settings_home_resume/after_resume.png`, `artifacts/20260219_121532_adb_settings_home_resume/logcat_tail.txt`, `artifacts/20260219_121532_adb_settings_home_resume/log_hits.txt`

- [x] **TC-ADB-SETTINGS-BACK-RESUME-01** (AVD) Settings에서 Back 후 앱 복귀 동작 — **passed**
  - Steps: Settings 실행 → `KEYCODE_BACK`으로 이탈 → `monkey -p viva.republica.toss.test ... 1`로 앱 복귀
  - Observed:
    - Settings 실행: `Status: ok`, `LaunchState: HOT`, `WaitTime: 5681ms`, focus `SettingsHomepageActivity`
    - Back 후 focus: `NexusLauncherActivity`
    - resume 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Settings에서 Back으로 빠져나온 뒤에도 앱 복귀 플로우 정상
  - Evidence: `artifacts/20260219_121732_adb_settings_back_then_resume/am_settings.txt`, `artifacts/20260219_121732_adb_settings_back_then_resume/focus_on_settings.txt`, `artifacts/20260219_121732_adb_settings_back_then_resume/focus_after_back.txt`, `artifacts/20260219_121732_adb_settings_back_then_resume/monkey_resume.txt`, `artifacts/20260219_121732_adb_settings_back_then_resume/focus_after_resume.txt`, `artifacts/20260219_121732_adb_settings_back_then_resume/after_resume.png`, `artifacts/20260219_121732_adb_settings_back_then_resume/logcat_tail.txt`, `artifacts/20260219_121732_adb_settings_back_then_resume/log_hits.txt`

- [x] **TC-ADB-SETTINGS-BACK-IMPLICIT-01** (AVD) Settings Back 후 implicit deeplink 재진입 — **failed (Settings timeout/ANR observed)**
  - Steps: Settings 실행 → `KEYCODE_BACK` → implicit deeplink 실행
  - Observed:
    - Settings 실행: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `WaitTime: 17757ms`
    - Back 후 focus: `NexusLauncherActivity`
    - implicit deeplink: `Status: ok`, `LaunchState: HOT`, `WaitTime: 771ms`, focus `GraniteActivity`
    - logcat에서 `com.android.settings... is not responding` ANR 로그 검출
  - Verdict: 대상 앱 재진입은 성공했지만, 선행 Settings 단계에서 timeout/ANR이 발생해 케이스는 fail 처리
  - Evidence: `artifacts/20260219_121935_adb_settings_back_then_implicit/am_settings.txt`, `artifacts/20260219_121935_adb_settings_back_then_implicit/focus_after_back.txt`, `artifacts/20260219_121935_adb_settings_back_then_implicit/am_start_implicit.txt`, `artifacts/20260219_121935_adb_settings_back_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_121935_adb_settings_back_then_implicit/after_implicit.png`, `artifacts/20260219_121935_adb_settings_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_121935_adb_settings_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLETAP-01** (AVD) 앱 활성 상태에서 App Switch 더블탭 복귀 — **failed (unstable focus)**
  - Steps: explicit deeplink 진입 후 `KEYCODE_APP_SWITCH` 2회 연속 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 718ms`
    - 더블탭 전 focus는 `GraniteActivity`
    - 더블탭 후 `dumpsys window` 기준 `mCurrentFocus=null` (안정 포커스 미확인)
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: App Switch 더블탭 직후 포커스 안정성이 불충분(재현 추가 필요)
  - Evidence: `artifacts/20260219_111309_adb_appswitch_doubletap/am_start.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/focus_before_switch.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/focus_after_double_switch.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/after_double_switch.png`, `artifacts/20260219_111309_adb_appswitch_doubletap/logcat_tail.txt`, `artifacts/20260219_111309_adb_appswitch_doubletap/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLETAP-02** (AVD) App Switch 더블탭 재검증 — **failed (reproduced)**
  - Steps: explicit deeplink 진입 후 `KEYCODE_APP_SWITCH` 2회 연속 입력(재실행)
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 54ms`
    - 더블탭 전 focus는 `GraniteActivity`
    - 더블탭 후 다시 `mCurrentFocus=null` 재현
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 더블탭 후 focus null 이슈가 반복 재현됨(간헐성보다 패턴성 높음)
  - Evidence: `artifacts/20260219_112949_adb_appswitch_doubletap_retest/am_start.txt`, `artifacts/20260219_112949_adb_appswitch_doubletap_retest/focus_before.txt`, `artifacts/20260219_112949_adb_appswitch_doubletap_retest/focus_after_doubletap.txt`, `artifacts/20260219_112949_adb_appswitch_doubletap_retest/after_doubletap.png`, `artifacts/20260219_112949_adb_appswitch_doubletap_retest/logcat_tail.txt`, `artifacts/20260219_112949_adb_appswitch_doubletap_retest/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLETAP-RECOVER-01** (AVD) 더블탭 후 deeplink 재진입 복구 — **passed (recoverable)**
  - Steps: explicit deeplink 진입 → `KEYCODE_APP_SWITCH` 2회(포커스 깨짐 유도) → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 17399ms`
    - 더블탭 전 focus `GraniteActivity`, 더블탭 후 `mCurrentFocus=null`
    - 2차 `am start`(recover): `Status: ok`, `LaunchState: HOT`, `WaitTime: 573ms`
    - recover 후 focus가 다시 `GraniteActivity`로 복귀
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 더블탭 포커스 깨짐은 재현되지만, deeplink 재실행으로 복구 가능
  - Evidence: `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/am_start_1.txt`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/focus_before_doubletap.txt`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/focus_after_doubletap.txt`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/am_start_2_recover.txt`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/focus_after_recover.txt`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/after_recover.png`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/logcat_tail.txt`, `artifacts/20260219_113129_adb_appswitch_doubletap_recover_by_deeplink/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLETAP-HOME-RECOVER-01** (AVD) 더블탭 후 Home 거쳐 deeplink 복구 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` 2회로 포커스 깨짐 유도 → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: WARM`, `WaitTime: 941ms`
    - 더블탭 후 focus: `mCurrentFocus=null`
    - `HOME` 후 2차 `am start`: `Status: ok`, `LaunchState: WARM`, `WaitTime: 859ms`
    - 재진입 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 더블탭 포커스 깨짐 상태에서도 Home 경유 deeplink 복구 정상
  - Evidence: `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/am_start_1.txt`, `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/focus_after_doubletap.txt`, `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/am_start_2_recover.txt`, `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/focus_after_recover.txt`, `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/after_recover.png`, `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/logcat_tail.txt`, `artifacts/20260219_122422_adb_appswitch_doubletap_then_home_deeplink/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLETAP-IMPLICIT-RECOVER-01** (AVD) 더블탭 null 상태에서 implicit deeplink 복구 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` 2회로 `mCurrentFocus=null` 유도 → implicit deeplink 실행
  - Observed:
    - 1차 `am start`(explicit): `Status: ok`, `LaunchState: WARM`, `WaitTime: 1871ms`
    - 더블탭 후 focus: `mCurrentFocus=null`
    - 2차 `am start`(implicit recover): `Status: ok`, `LaunchState: HOT`, `WaitTime: 1569ms`
    - 복구 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 더블탭 포커스 깨짐 상태에서도 implicit 경로로 복구 가능
  - Evidence: `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/am_start_1.txt`, `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/focus_after_doubletap.txt`, `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/am_start_2_implicit_recover.txt`, `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/focus_after_recover.txt`, `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/after_recover.png`, `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/logcat_tail.txt`, `artifacts/20260219_123048_adb_doubletap_null_then_implicit_recover/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-SINGLE-01** (AVD) App Switch 진입 후 Back 복귀 동작 — **passed**
  - Steps: explicit deeplink 진입 → `KEYCODE_APP_SWITCH` 1회 → `KEYCODE_BACK` 1회
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 41ms`
    - App Switch 전/후, 그리고 Back 입력 후 모두 focus가 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 단일 App Switch 토글 시에는 앱 포커스가 안정적으로 유지됨
  - Evidence: `artifacts/20260219_112117_adb_appswitch_single_toggle/am_start.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/focus_before_switch.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/focus_after_switch_open.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/focus_after_back.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/switch_open.png`, `artifacts/20260219_112117_adb_appswitch_single_toggle/after_back.png`, `artifacts/20260219_112117_adb_appswitch_single_toggle/logcat_tail.txt`, `artifacts/20260219_112117_adb_appswitch_single_toggle/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-SINGLE-REPEAT3-01** (AVD) App Switch+Back 3회 반복 복귀 일관성 — **failed (inconsistent)**
  - Steps: explicit deeplink 진입 후 `APP_SWITCH → BACK` 사이클 3회 반복
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 694ms`
    - Cycle1: switch 후 `GraniteActivity`이나 back 후 `NexusLauncherActivity`로 이탈
    - Cycle2~3: switch/back 후 `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 조작 반복 시 복귀 결과가 일관적이지 않음(플래키)
  - Evidence: `artifacts/20260219_115650_adb_appswitch_single_repeat3/am_start.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/focus_switch_1.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/focus_back_1.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/focus_switch_2.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/focus_back_2.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/focus_switch_3.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/focus_back_3.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/cycle_1.png`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/cycle_2.png`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/cycle_3.png`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/logcat_tail.txt`, `artifacts/20260219_115650_adb_appswitch_single_repeat3/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-DOUBLEPRESS-01** (AVD) App Switch 2회 연속 입력 시 포커스 귀환 동작 — **failed**
  - Steps: explicit deeplink 진입 후 `KEYCODE_APP_SWITCH` 연속 2회 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 407ms`
    - 1회 입력 후 focus: `NexusLauncherActivity`
    - 2회 입력 후 focus: `SettingsHomepageActivity` (의도 앱 미복귀)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: App Switch 연속 입력 시 대상 앱 복귀 동작이 비결정적/오동작
  - Evidence: `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/am_start.txt`, `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/focus_before_switch.txt`, `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/focus_after_switch_1.txt`, `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/focus_after_switch_2.txt`, `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/after_switch_2.png`, `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/logcat_tail.txt`, `artifacts/20260219_115823_adb_appswitch_single_doublepress_return/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-TRIPLEPRESS-01** (AVD) App Switch 3회 연속 입력 포커스 안정성 — **failed**
  - Steps: explicit deeplink 진입 후 `KEYCODE_APP_SWITCH` 3회 연속 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: WARM`, `WaitTime: 1124ms`
    - 1회 후 focus: `NexusLauncherActivity`
    - 2회 후 focus: `mCurrentFocus=null`
    - 3회 후 focus: 다시 `NexusLauncherActivity` (앱 미복귀)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 다중 App Switch 입력에서 포커스가 불안정하며 대상 앱 복귀 실패
  - Evidence: `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/am_start.txt`, `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/focus_after_switch_1.txt`, `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/focus_after_switch_2.txt`, `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/focus_after_switch_3.txt`, `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/after_switch_3.png`, `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/logcat_tail.txt`, `artifacts/20260219_123924_adb_appswitch_triplepress_behavior/log_hits.txt`

- [x] **TC-ADB-APPSWITCH-TRIPLEPRESS-RECOVER-01** (AVD) App Switch 3회 후 deeplink 복구 — **passed (recoverable)**
  - Steps: explicit deeplink 진입 → `KEYCODE_APP_SWITCH` 3회 입력 → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: WARM`, `WaitTime: 1575ms`
    - 스위치 후 포커스 변화: `NexusLauncherActivity` → `SettingsHomepageActivity` → `NexusLauncherActivity`
    - 2차 `am start`(recover): `Status: ok`, `LaunchState: WARM`, `WaitTime: 1920ms`
    - 복구 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: triple-press로 포커스는 깨지지만 deeplink 재실행으로 복구 가능
  - Evidence: `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/am_start_1.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/focus_after_switch_1.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/focus_after_switch_2.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/focus_after_switch_3.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/am_start_2_recover.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/focus_after_recover.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/after_recover.png`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/logcat_tail.txt`, `artifacts/20260219_124137_adb_appswitch_triplepress_recover_deeplink/log_hits.txt`

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

- [x] **TC-ADB-ROTATE-LOCK-DEEPLINK-01** (AVD) 가로 고정 상태에서 deeplink 진입 안정성 — **passed**
  - Steps: 화면 회전을 landscape로 고정(`user_rotation=1`) 후 explicit deeplink 실행
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 4145ms`
    - 진입 후 focus `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 회전 고정 상태에서도 deeplink 진입 기능 정상
  - Evidence: `artifacts/20260219_120844_adb_deeplink_after_screen_rotation_lock/am_start_landscape_lock.txt`, `artifacts/20260219_120844_adb_deeplink_after_screen_rotation_lock/focus_after_start.txt`, `artifacts/20260219_120844_adb_deeplink_after_screen_rotation_lock/after_start_landscape.png`, `artifacts/20260219_120844_adb_deeplink_after_screen_rotation_lock/logcat_tail.txt`, `artifacts/20260219_120844_adb_deeplink_after_screen_rotation_lock/log_hits.txt`

- [x] **TC-ADB-ROTATE-LOCK-DEEPLINK-02** (AVD) 세로 고정 상태에서 deeplink 진입 안정성 — **passed**
  - Steps: 화면 회전을 portrait로 고정(`user_rotation=0`) 후 explicit deeplink 실행
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1871ms`, `WaitTime: 1875ms`
    - 진입 후 focus `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 세로 고정 상태에서도 deeplink 진입 기능 정상
  - Evidence: `artifacts/20260219_124734_adb_deeplink_after_portrait_lock/am_start_portrait_lock.txt`, `artifacts/20260219_124734_adb_deeplink_after_portrait_lock/focus_after_start.txt`, `artifacts/20260219_124734_adb_deeplink_after_portrait_lock/after_start_portrait.png`, `artifacts/20260219_124734_adb_deeplink_after_portrait_lock/logcat_tail.txt`, `artifacts/20260219_124734_adb_deeplink_after_portrait_lock/log_hits.txt`

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

- [x] **TC-ADB-BACK-RECOVER-01** (AVD) Back 입력 후 deeplink 재실행 복구 확인 — **passed (recoverable, back no-op)**
  - Steps: explicit deeplink 진입 → `KEYCODE_BACK` 1회 → explicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 173ms`
    - Back 전/후 focus 모두 `GraniteActivity` (back no-op)
    - 2차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 6`
    - 재실행 후 focus `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: Back으로 상태 변화는 없지만 deeplink 재실행 경로는 즉시 복구/유지 가능
  - Evidence: `artifacts/20260219_113547_adb_back_then_deeplink_recover/am_start_1.txt`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/focus_before_back.txt`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/focus_after_back.txt`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/am_start_2_recover.txt`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/focus_after_recover.txt`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/after_recover.png`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/logcat_tail.txt`, `artifacts/20260219_113547_adb_back_then_deeplink_recover/log_hits.txt`

- [x] **TC-ADB-BACK-02** (AVD) Back key 2회 입력 반응성 재검증 — **failed (blocked by launch fallback)**
  - Steps: Home 상태에서 explicit deeplink 실행 → `KEYCODE_BACK` 2회 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 21191`
    - back 전/1회 후/2회 후 focus 모두 `NexusLauncherActivity`
    - before/back1 스크린샷 해시 동일, back2만 다른 해시(런처 화면 변화로 추정)
  - Verdict: 앱 랜딩 실패로 Back 반응성을 앱 내부에서 검증하지 못함
  - Evidence: `artifacts/20260219_100413_adb_backpress_double/am_start.txt`, `artifacts/20260219_100413_adb_backpress_double/focus_before_back.txt`, `artifacts/20260219_100413_adb_backpress_double/focus_after_back1.txt`, `artifacts/20260219_100413_adb_backpress_double/focus_after_back2.txt`, `artifacts/20260219_100413_adb_backpress_double/before_back.png`, `artifacts/20260219_100413_adb_backpress_double/after_back1.png`, `artifacts/20260219_100413_adb_backpress_double/after_back2.png`, `artifacts/20260219_100413_adb_backpress_double/screenshot_hashes.txt`, `artifacts/20260219_100413_adb_backpress_double/logcat_tail.txt`

- [x] **TC-ADB-BACK-04** (AVD) 안정 랜딩 상태에서 Back key 2회 반응성 — **failed (no transition)**
  - Steps: explicit deeplink로 안정 진입 후 `KEYCODE_BACK` 2회 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `TotalTime: 5395ms`, `WaitTime: 5424ms`
    - back 전/1회 후/2회 후 focus 모두 `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 안정 상태에서도 Back 2회 입력으로 화면 전환/종료 반응 미확인
  - Evidence: `artifacts/20260219_120153_adb_back_double_from_stable/am_start.txt`, `artifacts/20260219_120153_adb_back_double_from_stable/focus_before_back.txt`, `artifacts/20260219_120153_adb_back_double_from_stable/focus_after_back1.txt`, `artifacts/20260219_120153_adb_back_double_from_stable/focus_after_back2.txt`, `artifacts/20260219_120153_adb_back_double_from_stable/after_back2.png`, `artifacts/20260219_120153_adb_back_double_from_stable/logcat_tail.txt`, `artifacts/20260219_120153_adb_back_double_from_stable/log_hits.txt`

- [x] **TC-ADB-BACK-IMPLICIT-01** (AVD) implicit 진입 후 Back key 1회 반응성 — **failed (ANR detected)**
  - Steps: implicit deeplink 진입 후 `KEYCODE_BACK` 1회 입력
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 186ms`
    - back 전/후 focus 모두 `GraniteActivity`
    - logcat에서 `GraniteActivity is not responding` ANR 로그 검출
  - Verdict: Back 입력 이후 화면 전환 미확인 + 대상 앱 ANR 발생으로 fail
  - Evidence: `artifacts/20260219_122625_adb_implicit_then_back_behavior/am_start_implicit.txt`, `artifacts/20260219_122625_adb_implicit_then_back_behavior/focus_before_back.txt`, `artifacts/20260219_122625_adb_implicit_then_back_behavior/focus_after_back.txt`, `artifacts/20260219_122625_adb_implicit_then_back_behavior/after_back.png`, `artifacts/20260219_122625_adb_implicit_then_back_behavior/logcat_tail.txt`, `artifacts/20260219_122625_adb_implicit_then_back_behavior/log_hits.txt`

- [x] **TC-ADB-BACK-IMPLICIT-RECOVER-01** (AVD) implicit+Back 이후 implicit 재진입 복구 — **passed (recoverable)**
  - Steps: implicit deeplink 진입 → `KEYCODE_BACK` 1회 → implicit deeplink 재실행
  - Observed:
    - 1차 `am start`: `Status: ok`, `LaunchState: COLD`, `WaitTime: 20508ms`
    - back 후 focus: `GraniteActivity`
    - 2차 `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 15`
    - 재실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back 반응은 여전히 no-op 성향이지만, implicit 재실행으로 즉시 복구/유지 가능
  - Evidence: `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/am_start_1_implicit.txt`, `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/focus_after_back.txt`, `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/am_start_2_recover.txt`, `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/focus_after_recover.txt`, `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/after_recover.png`, `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/logcat_tail.txt`, `artifacts/20260219_122838_adb_back_implicit_recover_by_relaunch/log_hits.txt`

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

- [x] **TC-ADB-FORCESTOP-RELAUNCH-02** (AVD) force-stop 후 explicit deeplink 재진입 재검증 — **passed**
  - Steps: `am force-stop viva.republica.toss.test` 후 explicit deeplink 실행
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: COLD`, `TotalTime: 5229ms`, `WaitTime: 5286ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat에 `viva.republica.toss.test` obituary 1건 검출(강제종료에 따른 정상 로그), ANR/FATAL 미검출
  - Verdict: force-stop 이후 cold 재진입이 이번 실행에서는 정상 동작
  - Evidence: `artifacts/20260219_121214_adb_explicit_after_force_stop/am_start.txt`, `artifacts/20260219_121214_adb_explicit_after_force_stop/focus_after_start.txt`, `artifacts/20260219_121214_adb_explicit_after_force_stop/after_start.png`, `artifacts/20260219_121214_adb_explicit_after_force_stop/logcat_tail.txt`, `artifacts/20260219_121214_adb_explicit_after_force_stop/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-RELAUNCH-03** (AVD) force-stop 후 explicit deeplink 2회 반복 cold 재진입 — **passed**
  - Steps: `force-stop → explicit deeplink` 시퀀스를 2회 반복
  - Observed:
    - 1회차: `Status: ok`, `LaunchState: COLD`, `TotalTime: 16125ms`, `WaitTime: 16141ms`, focus `GraniteActivity`
    - 2회차: `Status: ok`, `LaunchState: COLD`, `TotalTime: 4204ms`, `WaitTime: 4208ms`, focus `GraniteActivity`
    - logcat에 대상 앱 obituary 1건(강제종료 맥락), ANR/FATAL/obituary(크래시성) 미검출
  - Verdict: force-stop 이후 explicit cold 재진입 반복 시 기능적 진입은 안정적으로 성공
  - Evidence: `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/am_start_1.txt`, `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/focus_1.txt`, `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/am_start_2.txt`, `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/focus_2.txt`, `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/after_run2.png`, `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/logcat_tail.txt`, `artifacts/20260219_125739_adb_force_stop_then_explicit_2runs/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-01** (AVD) force-stop 후 implicit deeplink 재진입 — **passed**
  - Steps: `am force-stop viva.republica.toss.test` 후 implicit deeplink 실행
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: COLD`, `TotalTime: 5441ms`, `WaitTime: 5465ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 implicit 경로 cold 재진입도 정상 동작
  - Evidence: `artifacts/20260219_121344_adb_implicit_after_force_stop/am_start_implicit.txt`, `artifacts/20260219_121344_adb_implicit_after_force_stop/focus_after_start.txt`, `artifacts/20260219_121344_adb_implicit_after_force_stop/after_start.png`, `artifacts/20260219_121344_adb_implicit_after_force_stop/logcat_tail.txt`, `artifacts/20260219_121344_adb_implicit_after_force_stop/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-02** (AVD) force-stop 후 implicit deeplink 2회 반복 cold 재진입 — **passed**
  - Steps: `force-stop → implicit deeplink` 시퀀스를 2회 반복
  - Observed:
    - 1회차: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1767ms`, `WaitTime: 1774ms`, focus `GraniteActivity`
    - 2회차: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1015ms`, `WaitTime: 1023ms`, focus `GraniteActivity`
    - logcat에 대상 앱 obituary 1건(강제종료 맥락), ANR/FATAL/obituary(크래시성) 미검출
  - Verdict: force-stop 이후 implicit cold 재진입 반복 시 기능적 진입 성공
  - Evidence: `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/am_start_1.txt`, `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/focus_1.txt`, `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/am_start_2.txt`, `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/focus_2.txt`, `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/after_run2.png`, `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/logcat_tail.txt`, `artifacts/20260219_125958_adb_force_stop_then_implicit_2runs/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-IMPLICIT-RECOVER-01** (AVD) Recents+Back implicit 시나리오 후 force-stop 복구 — **failed (recovery unstable)**
  - Steps: explicit 진입 → `APP_SWITCH`→`BACK` → implicit 실행 → `force-stop` 후 implicit 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 126ms`, `WaitTime: 148ms`, focus `GraniteActivity`
    - force-stop 후 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 12492ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat: 대상 앱 obituary 1건(강제종료 관련), ANR/FATAL/obituary(크래시성) 미검출
  - Verdict: 동일 경로에서 복구 결과가 안정적이지 않아 fail
  - Evidence: `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/am_start_1_explicit.txt`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/am_start_2_implicit.txt`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/focus_after_implicit.txt`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/am_start_3_implicit_recover.txt`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/focus_after_recover.txt`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/after_recover.png`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/logcat_tail.txt`, `artifacts/20260219_125457_adb_recents_back_implicit_anr_recover/log_hits.txt`

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

- [x] **TC-ADB-NET-TOGGLE-FOCUS-01** (AVD) 네트워크 Off/On 토글 중 포커스 안정성 — **passed**
  - Steps: explicit deeplink 진입 → `svc wifi/data disable` → `svc wifi/data enable`
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 44ms`
    - 네트워크 off/on 전 과정에서 focus 모두 `GraniteActivity` 유지
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 네트워크 토글 구간에서 앱 포그라운드 안정성 양호
  - Evidence: `artifacts/20260219_115246_adb_network_toggle_focus/am_start.txt`, `artifacts/20260219_115246_adb_network_toggle_focus/focus_before_toggle.txt`, `artifacts/20260219_115246_adb_network_toggle_focus/focus_offline.txt`, `artifacts/20260219_115246_adb_network_toggle_focus/focus_online_recovered.txt`, `artifacts/20260219_115246_adb_network_toggle_focus/after_recover.png`, `artifacts/20260219_115246_adb_network_toggle_focus/logcat_tail.txt`, `artifacts/20260219_115246_adb_network_toggle_focus/log_hits.txt`

- [x] **TC-ADB-AIRPLANE-TOGGLE-FOCUS-01** (AVD) 비행기모드 토글 시 포커스 안정성 — **passed (with permission limitation)**
  - Steps: explicit deeplink 진입 → `settings put global airplane_mode_on 1/0` + `AIRPLANE_MODE` broadcast 시도
  - Observed:
    - `am start`: `Status: ok`, `LaunchState: HOT`, `WaitTime: 949ms`
    - 토글 on/off 시점 모두 focus `GraniteActivity` 유지
    - `AIRPLANE_MODE` broadcast는 권한 제한(SecurityException) 로그 발생
    - logcat 스캔에서 ANR/FATAL/obituary 키워드 미검출
  - Verdict: 권한 제한으로 시스템 broadcast 완전 검증은 불가했지만, 실행된 토글 시나리오에서 앱 포그라운드 안정성은 유지
  - Evidence: `artifacts/20260219_115506_adb_airplane_toggle_focus/am_start.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/focus_before_airplane.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/focus_airplane_on.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/focus_airplane_off.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/airplane_on_broadcast.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/airplane_off_broadcast.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/after_airplane_off.png`, `artifacts/20260219_115506_adb_airplane_toggle_focus/logcat_tail.txt`, `artifacts/20260219_115506_adb_airplane_toggle_focus/log_hits.txt`

- [x] **TC-ADB-AIRPLANE-TOGGLE-IMPLICIT-01** (AVD) 비행기모드 토글 이후 implicit deeplink 진입 — **passed (with permission limitation)**
  - Steps: `airplane_mode_on` on/off 시도 + broadcast 시도 후 implicit deeplink 실행
  - Observed:
    - implicit `am start`: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 5772ms`
    - 실행 후 focus `GraniteActivity`
    - broadcast 시도는 SecurityException(권한 제한) 로그 발생
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: broadcast 권한 제한은 동일하지만, 토글 직후 implicit 진입 동작은 정상
  - Evidence: `artifacts/20260219_130201_adb_airplane_toggle_implicit/airplane_on_broadcast.txt`, `artifacts/20260219_130201_adb_airplane_toggle_implicit/airplane_off_broadcast.txt`, `artifacts/20260219_130201_adb_airplane_toggle_implicit/am_start_implicit.txt`, `artifacts/20260219_130201_adb_airplane_toggle_implicit/focus_after_start.txt`, `artifacts/20260219_130201_adb_airplane_toggle_implicit/after_start.png`, `artifacts/20260219_130201_adb_airplane_toggle_implicit/logcat_tail.txt`, `artifacts/20260219_130201_adb_airplane_toggle_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK-EXPLICIT-REENTRY-01** (AVD) implicit 진입 후 Back 입력 뒤 explicit 재진입 — **failed (ANR warning detected)**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` 1회 → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 9728ms`, `WaitTime: 9748ms`, focus `GraniteActivity`
    - Back 입력 후 focus: `GraniteActivity` (화면 이탈 없음)
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 287ms`, `WaitTime: 300ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출
  - Verdict: 기능 진입 자체는 성공했으나 ANR 전조 로그가 검출되어 fail
  - Evidence: `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/focus_after_implicit.txt`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/focus_after_back.txt`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/focus_after_explicit.txt`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/after_explicit.png`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_131511_adb_implicit_back_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK-IMPLICIT-REENTRY-01** (AVD) explicit 진입 후 Back 뒤 implicit 재진입 — **failed (focus null)**
  - Steps: explicit deeplink 진입 → `BACK` 1회 → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1056ms`, `WaitTime: 1066ms`, focus `GraniteActivity`
    - Back 입력 후에도 focus `GraniteActivity` 유지(launcher 이탈 미확인)
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 15ms`
    - 2차 실행 직후 focus `null`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 재진입 직후 focus null 상태가 발생해 기능 흐름 안정성 기준 fail
  - Evidence: `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/focus_after_explicit.txt`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/focus_after_back.txt`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/focus_after_implicit_reentry.txt`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/after_reentry.png`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_131714_adb_explicit_back_exit_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK2-EXPLICIT-REENTRY-01** (AVD) implicit 진입 후 Back 2회 뒤 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` 2회 → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 752ms`, `WaitTime: 759ms`, focus `GraniteActivity`
    - Back 2회 후 focus: `GraniteActivity` 유지
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 151ms`, `WaitTime: 175ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 후 Back 2회 입력 상황에서도 explicit 재진입 기능 동작 정상
  - Evidence: `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/focus_after_back2.txt`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/after_explicit.png`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/logcat_tail.txt`, `artifacts/20260219_131855_adb_implicit_back_double_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK2-IMPLICIT-REENTRY-01** (AVD) explicit 진입 후 Back 2회 뒤 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `BACK` 2회 → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 14422ms`, `WaitTime: 14430ms`, focus `GraniteActivity`
    - Back 2회 후 focus: `GraniteActivity` 유지
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 6ms`
    - 2차 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 후 Back 2회 상황에서도 implicit 재진입 기능 동작 정상
  - Evidence: `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/focus_after_explicit.txt`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/focus_after_back2.txt`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/focus_after_implicit.txt`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/after_implicit.png`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_132003_adb_explicit_back2_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-EXPLICIT-REENTRY-01** (AVD) implicit 진입 후 Recents 상태에서 explicit 재진입 — **failed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH`(Recents) → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 487ms`, `WaitTime: 526ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 952ms`, `WaitTime: 957ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 후 Recents 경유 시 explicit 재진입이 launcher로 fallback 되어 fail
  - Evidence: `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/focus_after_implicit.txt`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/focus_on_recents.txt`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/focus_after_reentry.txt`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/after_reentry.png`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_132145_adb_implicit_recents_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-IMPLICIT-REENTRY-01** (AVD) implicit 진입 후 Recents 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH`(Recents) → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 17ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 32ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 후 Recents 경유 시 implicit 재진입은 정상 복귀
  - Evidence: `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/focus_after_implicit_1.txt`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/focus_on_recents.txt`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/focus_after_implicit_2.txt`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/after_reentry.png`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_132334_adb_implicit_recents_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-HOME-BACK-IMPLICIT-01** (AVD) explicit 진입 후 Home+Back 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` + `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 2167ms`, `WaitTime: 2171ms`, focus `GraniteActivity`
    - Home+Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 560ms`, `WaitTime: 587ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 launcher(Home+Back) 상태에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/focus_after_home_back.txt`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/after_implicit.png`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_132502_adb_explicit_home_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-BACK-EXPLICIT-01** (AVD) implicit 진입 후 Home+Back 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` + `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 1971ms`, `WaitTime: 1977ms`, focus `GraniteActivity`
    - Home+Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1993ms`, `WaitTime: 2038ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Home+Back) 상태에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/focus_after_home_back.txt`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/after_explicit.png`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_132649_adb_implicit_home_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-HOME-IMPLICIT-01** (AVD) explicit 진입 후 Recents+Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` + `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 559ms`, `WaitTime: 587ms`, focus `GraniteActivity`
    - Recents+Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 59ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 launcher(Recents+Home) 상태에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/focus_after_recents_home.txt`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/after_implicit.png`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_132819_adb_explicit_recents_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-BACK-IMPLICIT-01** (AVD) explicit 진입 후 Recents+Back 뒤 implicit 재진입 — **failed (ANR warning detected)**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` + `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1987ms`, `WaitTime: 2070ms`, focus `GraniteActivity`
    - Recents+Back 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 124ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출
  - Verdict: 기능 진입 자체는 성공했지만 ANR 전조 로그 검출로 fail
  - Evidence: `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/focus_after_recents_back.txt`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/after_implicit.png`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_133005_adb_explicit_recents_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-BACK-EXPLICIT-01** (AVD) implicit 진입 후 Recents+Back 뒤 explicit 재진입 — **passed (with non-target process death logs)**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` + `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 1085ms`, focus `GraniteActivity`
    - Recents+Back 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 7050ms`, `WaitTime: 7063ms`, focus `GraniteActivity`
    - logcat 키워드 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
    - `Process .* has died`는 시스템 앱(com.android.settings 등) 4건 검출, 대상 앱(`viva.republica.toss.test`) 비정상 종료는 미검출
  - Verdict: 대상 앱 기준 기능 재진입은 정상(pass). 단, 시스템 프로세스 종료 로그는 환경 잡음으로 기록
  - Evidence: `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/focus_after_recents_back.txt`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/after_explicit.png`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_133159_adb_implicit_recents_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-APPSWITCH2-IMPLICIT-01** (AVD) explicit 진입 후 앱스위처 2회 뒤 implicit 재진입 — **failed (launcher/null focus)**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` 2회 → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 12414ms`
    - 1차 실행 후 focus: `NexusLauncherActivity` (초기 진입 실패)
    - 앱스위처 2회 후 focus: `null`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 2036ms`
    - 2차 실행 후 focus: `null` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 초기 진입 실패 + appswitch 이후 null focus로 기능 흐름 실패
  - Evidence: `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/focus_after_appswitch2.txt`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/after_implicit.png`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/logcat_tail.txt`, `artifacts/20260219_133416_adb_explicit_appswitch_double_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-APPSWITCH2-EXPLICIT-01** (AVD) implicit 진입 후 앱스위처 2회 뒤 explicit 재진입 — **failed (am start timeout)**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` 2회 → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 16480ms`, focus `GraniteActivity`
    - 앱스위처 2회 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `WaitTime: 29267ms`
    - 2차 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 최종 focus는 유지됐지만 explicit 재실행이 timeout으로 완료되어 기능 흐름 기준 fail
  - Evidence: `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/focus_after_appswitch2.txt`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/after_explicit.png`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/logcat_tail.txt`, `artifacts/20260219_133956_adb_implicit_appswitch_double_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-APPSWITCH2-EXPLICIT-REENTRY-01** (AVD) explicit 진입 후 앱스위처 2회 뒤 explicit 재진입 — **failed (intermediate null focus)**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` 2회 → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 10063ms`, `WaitTime: 24941ms`, focus `GraniteActivity`
    - 앱스위처 2회 후 focus: `null`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1532ms`, `WaitTime: 1580ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 최종 재진입은 성공했지만 앱스위처 2회 직후 focus null 상태가 재현되어 fail
  - Evidence: `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/focus_after_explicit_1.txt`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/focus_after_appswitch2.txt`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/focus_after_explicit_2.txt`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/after_explicit_2.png`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_134304_adb_explicit_appswitch_double_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-HOME-EXPLICIT-REENTRY-01** (AVD) explicit 진입 후 Recents+Home 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` + `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1649ms`, `WaitTime: 1794ms`, focus `GraniteActivity`
    - Recents+Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 841ms`, `WaitTime: 890ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 launcher(Recents+Home) 상태에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/focus_after_explicit_1.txt`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/focus_after_recents_home.txt`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/focus_after_explicit_2.txt`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/after_explicit_2.png`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_134515_adb_explicit_recents_home_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-HOME-EXPLICIT-REENTRY-01** (AVD) implicit 진입 후 Recents+Home 상태에서 explicit 재진입 — **failed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` + `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 593ms`, `WaitTime: 706ms`, focus `GraniteActivity`
    - Recents+Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 456ms`, `WaitTime: 460ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Recents+Home) 상태에서 explicit 재진입이 launcher fallback으로 실패
  - Evidence: `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/focus_after_implicit_1.txt`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/focus_after_recents_home.txt`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/focus_after_explicit_2.txt`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/after_explicit_2.png`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_134706_adb_implicit_recents_home_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-HOME-IMPLICIT-REENTRY-01** (AVD) implicit 진입 후 Recents+Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` + `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 165ms`, `WaitTime: 249ms`, focus `GraniteActivity`
    - Recents+Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 19ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Recents+Home) 상태에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/focus_after_implicit_1.txt`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/focus_after_recents_home.txt`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/focus_after_implicit_2.txt`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/after_implicit_2.png`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_134842_adb_implicit_recents_home_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK-HOME-IMPLICIT-01** (AVD) explicit 진입 후 Back+Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `BACK` + `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 618ms`, `WaitTime: 628ms`, focus `GraniteActivity`
    - Back+Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 337ms`, `WaitTime: 359ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 launcher(Back+Home) 상태에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/focus_after_back_home.txt`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/after_implicit.png`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_135021_adb_explicit_back_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK-HOME-EXPLICIT-01** (AVD) implicit 진입 후 Back+Home 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` + `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 105ms`, focus `GraniteActivity`
    - Back+Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 378ms`, `WaitTime: 385ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Back+Home) 상태에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/focus_after_back_home.txt`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/after_explicit.png`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_135144_adb_implicit_back_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-HOME-RECENTS-BACK-IMPLICIT-01** (AVD) explicit 진입 후 Home→Recents→Back 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` → `APP_SWITCH` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 746ms`, `WaitTime: 748ms`, focus `GraniteActivity`
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 231ms`, `WaitTime: 256ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 복합 launcher 상태(Home→Recents→Back)에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/focus_after_home_recents_back.txt`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/after_implicit.png`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_135332_adb_explicit_home_recents_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-HOME-RECENTS-BACK-EXPLICIT-01** (AVD) explicit 진입 후 Home→Recents→Back 상태에서 explicit 재진입 — **passed (with non-target process death log)**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` → `APP_SWITCH` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1510ms`, `WaitTime: 1523ms`, focus `GraniteActivity`
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 420ms`, `WaitTime: 444ms`, focus `GraniteActivity`
    - logcat 키워드 스캔에서 대상 앱 기준 ANR/FATAL/obituary/"ANR likely to follow" 미검출
    - `Process .* has died` 로그 1건은 비대상 프로세스(`android.process.acore`)로 확인
  - Verdict: 대상 앱의 기능 재진입은 정상(pass). 비대상 프로세스 종료 로그는 환경 잡음으로 기록
  - Evidence: `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/focus_after_home_recents_back.txt`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/after_explicit_2.png`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_135516_adb_explicit_home_recents_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-RECENTS-BACK-EXPLICIT-01** (AVD) implicit 진입 후 Home→Recents→Back 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `APP_SWITCH` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 1995ms`, `WaitTime: 2006ms`, focus `GraniteActivity`
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 3015ms`, `WaitTime: 3019ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 복합 launcher 상태(Home→Recents→Back)에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/focus_after_home_recents_back.txt`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/after_explicit.png`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_135700_adb_implicit_home_recents_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-RECENTS-BACK-IMPLICIT-01** (AVD) implicit 진입 후 Home→Recents→Back 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `APP_SWITCH` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 98ms`, focus `GraniteActivity`
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 802ms`, `WaitTime: 808ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 복합 launcher 상태(Home→Recents→Back)에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/am_start_1_implicit.txt`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/focus_after_home_recents_back.txt`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/after_implicit_2.png`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_135916_adb_implicit_home_recents_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK-RECENTS-HOME-IMPLICIT-01** (AVD) explicit 진입 후 Back→Recents→Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `BACK` → `APP_SWITCH` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 3287ms`, `WaitTime: 3316ms`, focus `GraniteActivity`
    - Back→Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 49ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 복합 launcher 상태(Back→Recents→Home)에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/focus_after_back_recents_home.txt`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/after_implicit.png`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_140114_adb_explicit_back_recents_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK-RECENTS-HOME-EXPLICIT-01** (AVD) implicit 진입 후 Back→Recents→Home 상태에서 explicit 재진입 — **failed (ANR confirmed)**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` → `APP_SWITCH` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 165ms`, focus `GraniteActivity`
    - Back→Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1970ms`, `WaitTime: 1982ms`
    - 2차 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - logcat에서 `ANR in viva.republica.toss.test` 및 `Completed ANR` 검출
  - Verdict: explicit 재진입 단계에서 ANR 재현으로 fail
  - Evidence: `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/focus_after_back_recents_home.txt`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/after_explicit.png`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_140306_adb_implicit_back_recents_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK-RECENTS-HOME-IMPLICIT-01** (AVD) implicit 진입 후 Back→Recents→Home 상태에서 implicit 재진입 — **failed (1차 focus null)**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` → `APP_SWITCH` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 2164ms`
    - 1차 실행 후 focus: `null` (진입 상태 불안정)
    - Back→Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 185ms`, `WaitTime: 191ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 재진입은 복구됐지만 1차 진입에서 focus null이 발생해 시나리오 기준 fail
  - Evidence: `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/am_start_1_implicit.txt`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/focus_after_back_recents_home.txt`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/after_implicit_2.png`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_140512_adb_implicit_back_recents_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK-RECENTS-HOME-EXPLICIT-01** (AVD) explicit 진입 후 Back→Recents→Home 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `BACK` → `APP_SWITCH` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 704ms`, `WaitTime: 707ms`, focus `GraniteActivity`
    - Back→Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 469ms`, `WaitTime: 476ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 복합 launcher 상태(Back→Recents→Home)에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/focus_after_back_recents_home.txt`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/after_explicit_2.png`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_140656_adb_explicit_back_recents_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK-RECENTS-HOME-EXPLICIT-02** (AVD) implicit 진입 후 Back→Recents→Home 상태 explicit 재진입 재검증 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` → `APP_SWITCH` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 541ms`, `WaitTime: 548ms`, focus `GraniteActivity`
    - Back→Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 320ms`, `WaitTime: 327ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 explicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/am_start_1_implicit.txt`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/focus_after_implicit.txt`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/focus_after_back_recents_home.txt`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/am_start_2_explicit.txt`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/focus_after_explicit.txt`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/after_explicit.png`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/logcat_tail.txt`, `artifacts/20260219_140828_adb_implicit_back_recents_home_then_explicit_v2/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-HOME-BACK-IMPLICIT-01** (AVD) explicit 진입 후 Recents→Home→Back 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` → `HOME` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 427ms`, `WaitTime: 457ms`, focus `GraniteActivity`
    - Recents→Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 210ms`, `WaitTime: 216ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 복합 launcher 상태(Recents→Home→Back)에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/focus_after_recents_home_back.txt`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/after_implicit.png`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_141049_adb_explicit_recents_home_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-HOME-BACK-EXPLICIT-01** (AVD) implicit 진입 후 Recents→Home→Back 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 252ms`, `WaitTime: 259ms`, focus `GraniteActivity`
    - Recents→Home→Back 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1034ms`, `WaitTime: 1114ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 복합 상태(Recents→Home→Back)에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/focus_after_recents_home_back.txt`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/after_explicit.png`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_141234_adb_implicit_recents_home_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-HOME-BACK-HOME-IMPLICIT-01** (AVD) explicit 진입 후 Home→Back→Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` → `BACK` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 622ms`, `WaitTime: 632ms`, focus `GraniteActivity`
    - Home→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 108ms`, `WaitTime: 130ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 launcher(Home→Back→Home) 상태에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/focus_after_home_back_home.txt`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/after_implicit.png`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_141412_adb_explicit_home_back_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-BACK-HOME-EXPLICIT-01** (AVD) implicit 진입 후 Home→Back→Home 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `BACK` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 580ms`, `WaitTime: 592ms`, focus `GraniteActivity`
    - Home→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 301ms`, `WaitTime: 308ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Home→Back→Home) 상태에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/focus_after_home_back_home.txt`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/after_explicit.png`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_141602_adb_implicit_home_back_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-BACK-HOME-EXPLICIT-01** (AVD) explicit 진입 후 Recents→Back→Home 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` → `BACK` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1099ms`, `WaitTime: 1108ms`, focus `GraniteActivity`
    - Recents→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1544ms`, `WaitTime: 1554ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 복합 launcher 상태(Recents→Back→Home)에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/focus_after_recents_back_home.txt`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/after_explicit_2.png`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_141740_adb_explicit_recents_back_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-BACK-HOME-IMPLICIT-01** (AVD) implicit 진입 후 Recents→Back→Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` → `BACK` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 797ms`, focus `GraniteActivity`
    - Recents→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 1012ms`, `WaitTime: 1022ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 복합 launcher 상태(Recents→Back→Home)에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/am_start_1_implicit.txt`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/focus_after_recents_back_home.txt`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/after_implicit_2.png`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_141923_adb_implicit_recents_back_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK-HOME-BACK-IMPLICIT-01** (AVD) explicit 진입 후 Back→Home→Back 상태에서 implicit 재진입 — **passed (with non-target process death logs)**
  - Steps: `HOME` → explicit deeplink 진입 → `BACK` → `HOME` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 2307ms`, `WaitTime: 2365ms`, focus `GraniteActivity`
    - Back→Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 11583ms`, `WaitTime: 11940ms`, focus `GraniteActivity`
    - 대상 앱 기준 ANR/FATAL/obituary/"ANR likely to follow" 미검출
    - `Process .* has died` 다수는 비대상 시스템 프로세스(권한컨트롤러/웹뷰/설정/크롬 등)
  - Verdict: 대상 앱의 기능 재진입은 정상(pass). 비대상 프로세스 종료 로그는 환경 잡음으로 기록
  - Evidence: `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/focus_after_back_home_back.txt`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/after_implicit.png`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_142141_adb_explicit_back_home_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-BACK-HOME-BACK-EXPLICIT-01** (AVD) implicit 진입 후 Back→Home→Back 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `BACK` → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 1959ms`, `WaitTime: 1978ms`, focus `GraniteActivity`
    - Back→Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1900ms`, `WaitTime: 1983ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Back→Home→Back) 상태에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/focus_after_back_home_back.txt`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/after_explicit.png`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_142349_adb_implicit_back_home_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-HOME-BACK-RECENTS-EXPLICIT-01** (AVD) explicit 진입 후 Home→Back→Recents 상태에서 explicit 재진입 — **failed (1차 start timeout/null focus)**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` → `BACK` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `WaitTime: 14991ms`
    - 1차 실행 후 focus: `null`
    - Home→Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 8587ms`, `WaitTime: 8592ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차는 복구 성공했으나 1차 explicit start timeout + focus null로 시나리오 fail
  - Evidence: `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/focus_after_home_back_recents.txt`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/after_explicit_2.png`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/logcat_tail.txt`, `artifacts/20260219_142533_adb_explicit_home_back_recents_then_explicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-BACK-RECENTS-IMPLICIT-01** (AVD) implicit 진입 후 Home→Back→Recents 상태에서 implicit 재진입 — **failed (non-target launcher ANR detected)**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `BACK` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 93ms`, focus `GraniteActivity`
    - Home→Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 479ms`, `WaitTime: 483ms`, focus `GraniteActivity`
    - logcat에서 `ANR in ...NexusLauncherActivity` 1건 검출(비대상 프로세스)
  - Verdict: 대상 앱 재진입은 성공했지만 동일 시퀀스 중 launcher ANR가 검출되어 환경 리스크로 fail 기록
  - Evidence: `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/am_start_1_implicit.txt`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/focus_after_home_back_recents.txt`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/after_implicit_2.png`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/logcat_tail.txt`, `artifacts/20260219_142834_adb_implicit_home_back_recents_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-HOME-EXPLICIT-REENTRY-02** (AVD) implicit 진입 후 Recents+Home 상태 explicit 재진입 재검증 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` + `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 94ms`, focus `GraniteActivity`
    - Recents+Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 4371ms`, `WaitTime: 4384ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 explicit 재진입이 재검증에서는 정상
  - Evidence: `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/am_start_1_implicit.txt`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/focus_after_implicit.txt`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/focus_after_recents_home.txt`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/am_start_2_explicit.txt`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/focus_after_explicit.txt`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/after_explicit.png`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/logcat_tail.txt`, `artifacts/20260219_143052_adb_implicit_recents_home_then_explicit_reentry_v2/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-BACK-HOME-IMPLICIT-02** (AVD) explicit 진입 후 Recents→Back→Home 상태 implicit 재진입 재검증 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` → `BACK` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 786ms`, `WaitTime: 791ms`, focus `GraniteActivity`
    - Recents→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 581ms`, `WaitTime: 615ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 implicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/am_start_1_explicit.txt`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/focus_after_explicit_1.txt`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/focus_after_recents_back_home.txt`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/am_start_2_implicit.txt`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/focus_after_implicit_2.txt`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/after_implicit_2.png`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/logcat_tail.txt`, `artifacts/20260219_143314_adb_explicit_recents_back_home_then_implicit_v2/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-BACK-HOME-EXPLICIT-02** (AVD) implicit 진입 후 Recents→Back→Home 상태 explicit 재진입 재검증 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` → `BACK` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 78ms`, focus `GraniteActivity`
    - Recents→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 349ms`, `WaitTime: 362ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 explicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/am_start_1_implicit.txt`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/focus_after_implicit_1.txt`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/focus_after_recents_back_home.txt`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/am_start_2_explicit.txt`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/focus_after_explicit_2.txt`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/after_explicit_2.png`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/logcat_tail.txt`, `artifacts/20260219_143459_adb_implicit_recents_back_home_then_explicit_v2/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-RECENTS-HOME-BACK-IMPLICIT-02** (AVD) implicit 진입 후 Recents→Home→Back 상태 implicit 재진입 재검증 — **failed (ANR warning log detected)**
  - Steps: `HOME` → implicit deeplink 진입 → `APP_SWITCH` → `HOME` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 421ms`, `WaitTime: 444ms`, focus `GraniteActivity`
    - Recents→Home→Back 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `TotalTime: 0`, `WaitTime: 25ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출(비대상 프로세스 종료 로그 동반)
  - Verdict: 기능 재진입은 성공했으나 ANR 전조 키워드 검출 정책에 따라 fail
  - Evidence: `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/am_start_1_implicit.txt`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/focus_after_implicit_1.txt`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/focus_after_recents_home_back.txt`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/am_start_2_implicit.txt`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/focus_after_implicit_2.txt`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/after_implicit_2.png`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/logcat_tail.txt`, `artifacts/20260219_143857_adb_implicit_recents_home_back_then_implicit_v2/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-HOME-BACK-RECENTS-IMPLICIT-02** (AVD) explicit 진입 후 Home→Back→Recents 상태 implicit 재진입 재검증 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` → `BACK` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1172ms`, `WaitTime: 1196ms`, focus `GraniteActivity`
    - Home→Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 704ms`, `WaitTime: 712ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 implicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/focus_after_home_back_recents.txt`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/after_implicit_2.png`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/logcat_tail.txt`, `artifacts/20260219_144111_adb_explicit_home_back_recents_then_implicit/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-BACK-HOME-IMPLICIT-01** (AVD) implicit 진입 후 Home→Back→Home 상태에서 implicit 재진입 — **passed**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `BACK` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 556ms`, `WaitTime: 587ms`, focus `GraniteActivity`
    - Home→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 295ms`, `WaitTime: 319ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 launcher(Home→Back→Home) 상태에서도 implicit 재진입 정상
  - Evidence: `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/am_start_1_implicit.txt`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/focus_after_home_back_home.txt`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/after_implicit_2.png`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_144306_adb_implicit_home_back_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-BACK-HOME-BACK-EXPLICIT-01** (AVD) explicit 진입 후 Back→Home→Back 상태에서 explicit 재진입 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `BACK` → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1204ms`, `WaitTime: 1238ms`, focus `GraniteActivity`
    - Back→Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1094ms`, `WaitTime: 1097ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 진입 이후 launcher(Back→Home→Back) 상태에서도 explicit 재진입 정상
  - Evidence: `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/focus_after_back_home_back.txt`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/after_explicit_2.png`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_144457_adb_explicit_back_home_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-EXPLICIT-RECENTS-HOME-BACK-EXPLICIT-02** (AVD) explicit 진입 후 Recents→Home→Back 상태 explicit 재진입 재검증 — **passed**
  - Steps: `HOME` → explicit deeplink 진입 → `APP_SWITCH` → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 767ms`, `WaitTime: 785ms`, focus `GraniteActivity`
    - Recents→Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 663ms`, `WaitTime: 678ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 동일 복합 launcher 상태에서 explicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/am_start_1_explicit.txt`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/focus_after_explicit_1.txt`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/focus_after_recents_home_back.txt`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/am_start_2_explicit.txt`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/focus_after_explicit_2.txt`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/after_explicit_2.png`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/logcat_tail.txt`, `artifacts/20260219_144723_adb_explicit_recents_home_back_then_explicit_v2/log_hits.txt`

- [x] **TC-ADB-IMPLICIT-HOME-BACK-RECENTS-EXPLICIT-02** (AVD) implicit 진입 후 Home→Back→Recents 상태 explicit 재진입 재검증 — **passed (with non-target process death logs)**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `BACK` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 556ms`, focus `GraniteActivity`
    - Home→Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 1563ms`, `WaitTime: 1590ms`, focus `GraniteActivity`
    - 대상 앱 기준 ANR/FATAL/obituary/"ANR likely to follow" 미검출
    - `Process .* has died` 다수는 비대상 시스템 프로세스(설정/월페이퍼/권한컨트롤러/크롬 등)
  - Verdict: 대상 앱 기능 재진입은 정상(pass). 비대상 프로세스 종료 로그는 환경 잡음으로 기록
  - Evidence: `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/am_start_1_implicit.txt`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/focus_after_implicit_1.txt`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/focus_after_home_back_recents.txt`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/am_start_2_explicit.txt`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/focus_after_explicit_2.txt`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/after_explicit_2.png`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/logcat_tail.txt`, `artifacts/20260219_174821_adb_implicit_home_back_recents_then_explicit_v2/log_hits.txt`

- [x] **TC-ADB-HOME-FORCESTOP-IMPLICIT-01** (AVD) Home 후 force-stop 뒤 implicit 재진입 — **failed (ANR + launcher fallback)**
  - Steps: `HOME` → explicit deeplink 진입 → `HOME` → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 8309ms`, `WaitTime: 8352ms`, focus `GraniteActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 14436ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat: `ANR in ...GraniteActivity` 및 대상 앱 obituary 검출
  - Verdict: force-stop 이후 implicit 재진입에서 ANR 및 launcher fallback 동반으로 fail
  - Evidence: `artifacts/20260219_175200_adb_home_forcestop_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/pid_after_forcestop.txt`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/after_implicit.png`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/logcat_tail.txt`, `artifacts/20260219_175200_adb_home_forcestop_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-FORCESTOP-EXPLICIT-01** (AVD) Home 후 force-stop 뒤 explicit 재진입 — **passed (with expected obituary)**
  - Steps: `HOME` → implicit deeplink 진입 → `HOME` → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 6558ms`, focus `GraniteActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `WaitTime: 3313ms`, focus `GraniteActivity`
    - logcat에서 대상 앱 obituary 1건(강제종료 맥락), ANR/FATAL/"ANR likely to follow" 미검출
  - Verdict: force-stop 이후 explicit 재진입 동작 정상(pass)
  - Evidence: `artifacts/20260219_175458_adb_home_forcestop_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/pid_after_forcestop.txt`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/after_explicit.png`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/logcat_tail.txt`, `artifacts/20260219_175458_adb_home_forcestop_then_explicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-EXPLICIT-01** (AVD) Recents 상태 force-stop 후 explicit 재진입 — **passed**
  - Steps: implicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 511ms`, `WaitTime: 593ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 3867ms`, `WaitTime: 3872ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 상태에서 force-stop 이후 explicit 재진입 정상 동작
  - Evidence: `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/focus_on_recents.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/pid_after_forcestop.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/after_explicit.png`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/logcat_tail.txt`, `artifacts/20260219_180122_adb_recents_forcestop_then_explicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-IMPLICIT-01** (AVD) Recents 상태 force-stop 후 implicit 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 277ms`, `WaitTime: 309ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 6758ms`, `WaitTime: 6773ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 상태 force-stop 이후 implicit 재진입 정상 동작
  - Evidence: `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/focus_on_recents.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/pid_after_forcestop.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/after_implicit.png`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/logcat_tail.txt`, `artifacts/20260219_180324_adb_recents_forcestop_then_implicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-EXPLICIT-02** (AVD) Recents 상태 force-stop 후 explicit 재진입 재검증 — **failed (ANR warning detected)**
  - Steps: implicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 332ms`, `WaitTime: 346ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7289ms`, `WaitTime: 7293ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출
  - Verdict: 재진입 자체는 성공했으나 ANR 전조 키워드 검출로 fail
  - Evidence: `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/am_start_1_implicit.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/focus_after_implicit.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/focus_on_recents.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/pid_after_forcestop.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/am_start_2_explicit.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/focus_after_explicit.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/after_explicit.png`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/logcat_tail.txt`, `artifacts/20260219_180527_adb_recents_forcestop_then_explicit_repeat/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-IMPLICIT-02** (AVD) Recents 상태 force-stop 후 implicit 재진입 재검증 — **passed (with expected obituary)**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 3170ms`, `WaitTime: 3191ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1169ms`, `WaitTime: 1196ms`, focus `GraniteActivity`
    - logcat에서 대상 앱 obituary 1건(강제종료 맥락), ANR/FATAL/"ANR likely to follow" 미검출
  - Verdict: Recents 상태 force-stop 이후 implicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/am_start_1_explicit.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/focus_after_explicit.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/focus_on_recents.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/pid_after_forcestop.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/am_start_2_implicit.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/focus_after_implicit.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/after_implicit.png`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/logcat_tail.txt`, `artifacts/20260219_181313_adb_recents_forcestop_then_implicit_repeat/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-EXPLICIT-03** (AVD) Recents 상태 force-stop 후 explicit 재진입 추가 재검증 — **failed (ANR warning detected)**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 914ms`, `WaitTime: 1043ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 11741ms`, `WaitTime: 11748ms`, focus `GraniteActivity`
    - logcat에서 대상 앱 obituary(강제종료 맥락) + `Application ANR likely to follow` 1건 검출
  - Verdict: 재진입은 성공했지만 ANR 전조 키워드 검출로 fail
  - Evidence: `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/am_start_1_explicit.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/focus_after_explicit_1.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/focus_on_recents.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/pid_after_forcestop.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/am_start_2_explicit.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/focus_after_explicit_2.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/after_explicit_2.png`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/logcat_tail.txt`, `artifacts/20260219_181614_adb_recents_forcestop_then_explicit_v3/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-IMPLICIT-03** (AVD) Recents 상태 force-stop 후 implicit 재진입 추가 재검증 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 546ms`, `WaitTime: 553ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: GraniteActivity`, `TotalTime: 11404ms`, `WaitTime: 11423ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 상태 force-stop 이후 implicit 재진입이 추가 재검증에서도 정상
  - Evidence: `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/am_start_1_explicit.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/focus_after_explicit.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/focus_on_recents.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/pid_after_forcestop.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/am_start_2_implicit.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/focus_after_implicit.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/after_implicit.png`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/logcat_tail.txt`, `artifacts/20260219_181841_adb_recents_forcestop_then_implicit_v3/log_hits.txt`

- [x] **TC-ADB-BACK-FORCESTOP-IMPLICIT-01** (AVD) Back 후 force-stop 뒤 implicit 재진입 — **failed (launcher fallback)**
  - Steps: explicit deeplink 진입 → `BACK` 1회 → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 385ms`, `WaitTime: 392ms`, focus `GraniteActivity`
    - Back 입력 후 focus: `GraniteActivity` 유지
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 10904ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat: 대상 앱 obituary 1건(강제종료 맥락), ANR/FATAL/"ANR likely to follow" 미검출
  - Verdict: force-stop 이후 implicit 재진입이 launcher fallback으로 실패
  - Evidence: `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/focus_after_back.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/pid_after_forcestop.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/after_implicit.png`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/logcat_tail.txt`, `artifacts/20260219_182127_adb_back_then_forcestop_then_implicit/log_hits.txt`

- [x] **TC-ADB-BACK-FORCESTOP-EXPLICIT-01** (AVD) Back 후 force-stop 뒤 explicit 재진입 — **failed (ANR warning detected)**
  - Steps: implicit deeplink 진입 → `BACK` 1회 → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 10343ms`
    - 1차 실행 후/Back 후 focus: `NexusLauncherActivity` (초기 진입 실패 상태)
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 3178ms`, `WaitTime: 3187ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출
  - Verdict: explicit 복구 진입은 성공했으나 ANR 전조 키워드 검출로 fail
  - Evidence: `artifacts/20260219_182415_adb_back_forcestop_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/focus_after_back.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/pid_after_forcestop.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/after_explicit.png`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/logcat_tail.txt`, `artifacts/20260219_182415_adb_back_forcestop_then_explicit/log_hits.txt`

- [x] **TC-ADB-BACK-FORCESTOP-IMPLICIT-02** (AVD) Back 후 force-stop 뒤 implicit 재진입 재검증 — **failed (am start timeout)**
  - Steps: implicit deeplink 진입 → `BACK` 1회 → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 393ms`, `WaitTime: 422ms`, focus `GraniteActivity`
    - Back 입력 후 focus: `GraniteActivity` 유지
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `WaitTime: 24064ms`
    - 2차 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 재진입 후 focus는 복구됐지만 `am start -W` timeout 발생으로 기능 흐름 기준 fail
  - Evidence: `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/am_start_1_implicit.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/focus_after_implicit.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/focus_after_back.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/pid_after_forcestop.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/am_start_2_implicit.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/focus_after_implicit_reentry.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/after_implicit_reentry.png`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/logcat_tail.txt`, `artifacts/20260219_182739_adb_back_forcestop_then_implicit_retest/log_hits.txt`

- [x] **TC-ADB-HOME-FORCESTOP-EXPLICIT-02** (AVD) Home 후 force-stop 뒤 explicit 재진입 재검증 — **passed**
  - Steps: implicit deeplink 진입 → `HOME` → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 220ms`, `WaitTime: 227ms`, focus `GraniteActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7509ms`, `WaitTime: 7511ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 후 force-stop 이후 explicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/am_start_1_implicit.txt`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/focus_after_implicit.txt`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/pid_after_forcestop.txt`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/am_start_2_explicit.txt`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/focus_after_explicit.txt`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/after_explicit.png`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/logcat_tail.txt`, `artifacts/20260219_183020_adb_home_forcestop_then_explicit_repeat/log_hits.txt`

- [x] **TC-ADB-HOME-FORCESTOP-IMPLICIT-02** (AVD) Home 후 force-stop 뒤 implicit 재진입 재검증 — **passed**
  - Steps: explicit deeplink 진입 → `HOME` → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 6925ms`, `WaitTime: 6963ms`, focus `GraniteActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 10696ms`, `WaitTime: 10702ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 후 force-stop 이후 implicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/am_start_1_explicit.txt`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/focus_after_explicit.txt`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/pid_after_forcestop.txt`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/am_start_2_implicit.txt`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/focus_after_implicit.txt`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/after_implicit.png`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/logcat_tail.txt`, `artifacts/20260219_183234_adb_home_forcestop_then_implicit_repeat/log_hits.txt`

- [x] **TC-ADB-RECENTS-FORCESTOP-EXPLICIT-04** (AVD) Recents 상태 force-stop 후 explicit 재진입 추가 재검증 — **failed (ANR confirmed)**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 731ms`, `WaitTime: 733ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `GraniteActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 21405ms`, `WaitTime: 21422ms`
    - 2차 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - logcat에서 `ANR in viva.republica.toss.test` / `Completed ANR` / `Application ANR likely to follow` 검출
  - Verdict: force-stop 이후 explicit 재진입 단계에서 ANR 재현으로 fail
  - Evidence: `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/am_start_1_explicit.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/focus_after_explicit_1.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/focus_on_recents.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/pid_after_forcestop.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/am_start_2_explicit.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/focus_after_explicit_2.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/after_explicit_2.png`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/logcat_tail.txt`, `artifacts/20260219_183501_adb_recents_forcestop_then_explicit_v4/log_hits.txt`

- [x] **TC-ADB-HOME-FORCESTOP-EXPLICIT-03** (AVD) Home 후 force-stop 뒤 explicit 재진입 추가 재검증 — **failed (launcher fallback)**
  - Steps: implicit deeplink 진입 → `HOME` → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1381ms`, `WaitTime: 1387ms`, focus `GraniteActivity`
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 17144ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat: 대상 앱 obituary 1건(강제종료 맥락), ANR/FATAL/"ANR likely to follow" 미검출
  - Verdict: force-stop 이후 explicit 재진입에서 launcher fallback 발생으로 fail
  - Evidence: `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/am_start_1_implicit.txt`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/focus_after_implicit.txt`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/pid_after_forcestop.txt`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/am_start_2_explicit.txt`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/focus_after_explicit.txt`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/after_explicit.png`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/logcat_tail.txt`, `artifacts/20260219_183729_adb_home_forcestop_then_explicit_v3/log_hits.txt`

- [x] **TC-ADB-HOME-FORCESTOP-IMPLICIT-03** (AVD) Home 후 force-stop 뒤 implicit 재진입 추가 재검증 — **failed (1차 launcher fallback)**
  - Steps: implicit deeplink 진입 → `HOME` → `am force-stop` → implicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 14972ms`
    - 1차 실행 후 focus: `NexusLauncherActivity` (초기 진입 실패)
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 16440ms`, `WaitTime: 16463ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 재실행(2차)은 복구됐지만 1차 진입이 launcher fallback으로 실패해 시나리오 fail
  - Evidence: `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/am_start_1_implicit.txt`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/focus_after_implicit_1.txt`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/pid_after_forcestop.txt`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/am_start_2_implicit.txt`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/focus_after_implicit_2.txt`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/after_implicit_2.png`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/logcat_tail.txt`, `artifacts/20260219_184030_adb_home_forcestop_then_implicit_v3/log_hits.txt`

- [x] **TC-ADB-BACK-FORCESTOP-EXPLICIT-02** (AVD) Back 후 force-stop 뒤 explicit 재진입 재검증 — **passed**
  - Steps: implicit deeplink 진입 → `BACK` 1회 → `am force-stop` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 261ms`, focus `GraniteActivity`
    - Back 입력 후 focus: `GraniteActivity` 유지
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 4287ms`, `WaitTime: 4291ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back 이후 force-stop을 거친 explicit 재진입이 재검증에서 정상
  - Evidence: `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/am_start_1_implicit.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/focus_after_implicit.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/focus_after_back.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/pid_after_forcestop.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/am_start_2_explicit.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/focus_after_explicit.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/after_explicit.png`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/logcat_tail.txt`, `artifacts/20260219_184309_adb_back_forcestop_then_explicit_retest2/log_hits.txt`

- [x] **TC-ADB-BACK-EXPLICIT-REENTRY-01** (AVD) Back 후 explicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `BACK` 1회 → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 736ms`, `WaitTime: 753ms`, focus `GraniteActivity`
    - Back 입력 후 focus: `GraniteActivity` 유지
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Warning: intent has been delivered to currently running top-most instance.`, `WaitTime: 11ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back 이후 explicit 재진입이 정상(탑 인스턴스 인텐트 전달 포함)
  - Evidence: `artifacts/20260219_184641_adb_back_then_explicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/focus_after_explicit_1.txt`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/focus_after_back.txt`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/focus_after_explicit_2.txt`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/after_explicit_2.png`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_184641_adb_back_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-HOME-EXPLICIT-REENTRY-01** (AVD) Home 후 explicit 딥링크 재진입 — **passed**
  - Steps: implicit deeplink 진입 → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 361ms`, `WaitTime: 372ms`, focus `GraniteActivity`
    - Home 이동 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 297ms`, `WaitTime: 338ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 이후 explicit 재진입 정상
  - Evidence: `artifacts/20260219_184813_adb_home_then_explicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/focus_after_implicit_1.txt`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/focus_on_home.txt`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/focus_after_explicit_2.txt`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/after_explicit_2.png`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_184813_adb_home_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-RECENTS-IMPLICIT-REENTRY-01** (AVD) Recents 후 implicit 딥링크 재진입 — **failed (launcher fallback)**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 32ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1079ms`, `WaitTime: 1185ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents 이후 implicit 재진입에서 launcher fallback 발생으로 fail
  - Evidence: `artifacts/20260219_184958_adb_recents_then_implicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/focus_after_explicit_1.txt`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/focus_on_recents.txt`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/focus_after_implicit_2.txt`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/after_implicit_2.png`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_184958_adb_recents_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-RECENTS-EXPLICIT-REENTRY-01** (AVD) Recents 후 explicit 딥링크 재진입 — **failed (1차 launcher fallback)**
  - Steps: implicit deeplink 진입 → `APP_SWITCH`(Recents) → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 469ms`
    - 1차 실행 후 focus: `NexusLauncherActivity` (초기 진입 실패)
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 267ms`, `WaitTime: 278ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 explicit 복구는 성공했으나 1차 진입이 launcher fallback이므로 시나리오 fail
  - Evidence: `artifacts/20260219_185129_adb_recents_then_explicit_reentry/am_start_1_implicit.txt`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/focus_after_implicit_1.txt`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/focus_on_recents.txt`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/am_start_2_explicit.txt`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/focus_after_explicit_2.txt`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/after_explicit_2.png`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/logcat_tail.txt`, `artifacts/20260219_185129_adb_recents_then_explicit_reentry/log_hits.txt`

- [x] **TC-ADB-BACK-IMPLICIT-REENTRY-01** (AVD) Back 후 implicit 딥링크 재진입 — **failed (am start timeout)**
  - Steps: explicit deeplink 진입 → `BACK` 1회 → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 103ms`, focus `GraniteActivity`
    - Back 입력 후 focus: `GraniteActivity` 유지
    - 2차 implicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 17713ms`
    - 2차 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: focus는 복구됐지만 implicit 재진입의 `am start -W` timeout으로 fail
  - Evidence: `artifacts/20260219_185309_adb_back_then_implicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/focus_after_explicit_1.txt`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/focus_after_back.txt`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/focus_after_implicit_2.txt`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/after_implicit_2.png`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_185309_adb_back_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-HOME-IMPLICIT-REENTRY-01** (AVD) Home 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 337ms`, `WaitTime: 391ms`, focus `GraniteActivity`
    - Home 이동 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 317ms`, `WaitTime: 320ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_185450_adb_home_then_implicit_reentry/am_start_1_explicit.txt`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/focus_after_explicit_1.txt`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/focus_on_home.txt`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/am_start_2_implicit.txt`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/focus_after_implicit_2.txt`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/after_implicit_2.png`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/logcat_tail.txt`, `artifacts/20260219_185450_adb_home_then_implicit_reentry/log_hits.txt`

- [x] **TC-ADB-RECENTS-EXPLICIT-REENTRY-02** (AVD) Recents 후 explicit 딥링크 재진입 재검증 — **failed (focus launcher fallback)**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 489ms`, `WaitTime: 535ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `intent has been delivered to currently running top-most instance`, `WaitTime: 45ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: `am start -W` 결과와 달리 최종 focus가 launcher여서 fail
  - Evidence: `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/am_start_1_explicit.txt`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/focus_after_explicit_1.txt`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/focus_on_recents.txt`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/am_start_2_explicit.txt`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/focus_after_explicit_2.txt`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/after_explicit_2.png`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/logcat_tail.txt`, `artifacts/20260219_185618_adb_recents_then_explicit_reentry_v2/log_hits.txt`

- [x] **TC-ADB-RECENTS-IMPLICIT-REENTRY-02** (AVD) Recents 후 implicit 딥링크 재진입 재검증 — **failed (focus launcher fallback)**
  - Steps: explicit deeplink 진입 → `APP_SWITCH`(Recents) → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 181ms`, `WaitTime: 187ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: GraniteActivity`, `TotalTime: 1886ms`, `WaitTime: 1940ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: `am start -W`는 성공이나 최종 focus가 launcher로 이탈하여 fail
  - Evidence: `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/am_start_1_explicit.txt`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/focus_after_explicit_1.txt`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/focus_on_recents.txt`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/am_start_2_implicit.txt`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/focus_after_implicit_2.txt`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/after_implicit_2.png`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/logcat_tail.txt`, `artifacts/20260219_185745_adb_recents_then_implicit_reentry_v2/log_hits.txt`

- [x] **TC-ADB-HOME-BACK-EXPLICIT-01** (AVD) Home→Back 후 explicit 딥링크 재진입 — **failed (ANR warning detected)**
  - Steps: implicit deeplink 진입 → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 149ms`
    - 1차 실행 후 focus: `NexusLauncherActivity`
    - Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 319ms`, `WaitTime: 366ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출
  - Verdict: 재진입 자체는 성공했지만 ANR 전조 키워드 검출로 fail
  - Evidence: `artifacts/20260219_185928_adb_home_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_185928_adb_home_back_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_185928_adb_home_back_then_explicit/focus_after_home_back.txt`, `artifacts/20260219_185928_adb_home_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_185928_adb_home_back_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_185928_adb_home_back_then_explicit/after_explicit_2.png`, `artifacts/20260219_185928_adb_home_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_185928_adb_home_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-HOME-BACK-IMPLICIT-01** (AVD) Home→Back 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `HOME` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 782ms`, `WaitTime: 784ms`, focus `GraniteActivity`
    - Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 240ms`, `WaitTime: 244ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home→Back 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_190058_adb_home_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_190058_adb_home_back_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_190058_adb_home_back_then_implicit/focus_after_home_back.txt`, `artifacts/20260219_190058_adb_home_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_190058_adb_home_back_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_190058_adb_home_back_then_implicit/after_implicit_2.png`, `artifacts/20260219_190058_adb_home_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_190058_adb_home_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-EXPLICIT-01** (AVD) Recents→Back 후 explicit 딥링크 재진입 — **failed (ANR warning detected)**
  - Steps: implicit deeplink 진입 → `APP_SWITCH` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 908ms`, `WaitTime: 916ms`, focus `GraniteActivity`
    - Recents→Back 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `intent delivered to currently running top-most instance`, `WaitTime: 8ms`, focus `GraniteActivity`
    - logcat에서 `Application ANR likely to follow` 1건 검출
  - Verdict: 재진입은 보이나 ANR 전조 키워드 검출로 fail
  - Evidence: `artifacts/20260219_190230_adb_recents_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_190230_adb_recents_back_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_190230_adb_recents_back_then_explicit/focus_after_recents_back.txt`, `artifacts/20260219_190230_adb_recents_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_190230_adb_recents_back_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_190230_adb_recents_back_then_explicit/after_explicit_2.png`, `artifacts/20260219_190230_adb_recents_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_190230_adb_recents_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-IMPLICIT-01** (AVD) Recents→Back 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 848ms`, `WaitTime: 864ms`, focus `GraniteActivity`
    - Recents→Back 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 208ms`, `WaitTime: 215ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents→Back 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_190412_adb_recents_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_190412_adb_recents_back_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_190412_adb_recents_back_then_implicit/focus_after_recents_back.txt`, `artifacts/20260219_190412_adb_recents_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_190412_adb_recents_back_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_190412_adb_recents_back_then_implicit/after_implicit_2.png`, `artifacts/20260219_190412_adb_recents_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_190412_adb_recents_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-EXPLICIT-01** (AVD) Home→Recents 후 explicit 딥링크 재진입 — **passed**
  - Steps: implicit deeplink 진입 → `HOME` → `APP_SWITCH`(Recents) → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 2200ms`, `WaitTime: 2204ms`, focus `GraniteActivity`
    - Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 1495ms`, `WaitTime: 1623ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home→Recents 이후 explicit 재진입 정상
  - Evidence: `artifacts/20260219_190600_adb_home_recents_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_190600_adb_home_recents_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_190600_adb_home_recents_then_explicit/focus_after_home_recents.txt`, `artifacts/20260219_190600_adb_home_recents_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_190600_adb_home_recents_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_190600_adb_home_recents_then_explicit/after_explicit_2.png`, `artifacts/20260219_190600_adb_home_recents_then_explicit/logcat_tail.txt`, `artifacts/20260219_190600_adb_home_recents_then_explicit/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-IMPLICIT-01** (AVD) Home→Recents 후 implicit 딥링크 재진입 — **failed (focus null)**
  - Steps: explicit deeplink 진입 → `HOME` → `APP_SWITCH`(Recents) → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 687ms`, focus `GraniteActivity`
    - Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 4124ms`, `WaitTime: 4156ms`
    - 2차 실행 후 focus: `null` (정상 포그라운드 미확인)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 재진입 후 최종 포커스가 null로 확인되어 fail
  - Evidence: `artifacts/20260219_190744_adb_home_recents_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_190744_adb_home_recents_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_190744_adb_home_recents_then_implicit/focus_after_home_recents.txt`, `artifacts/20260219_190744_adb_home_recents_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_190744_adb_home_recents_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_190744_adb_home_recents_then_implicit/after_implicit_2.png`, `artifacts/20260219_190744_adb_home_recents_then_implicit/logcat_tail.txt`, `artifacts/20260219_190744_adb_home_recents_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-BACK-IMPLICIT-01** (AVD) Home→Recents→Back 후 implicit 딥링크 재진입 — **failed (focus null)**
  - Steps: explicit deeplink 진입 → `HOME` → `APP_SWITCH` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 1144ms`, focus `GraniteActivity`
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 3379ms`, `WaitTime: 3447ms`
    - 2차 실행 후 focus: `null` (정상 포그라운드 미확인)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 재진입 후 최종 포커스가 null로 확인되어 fail
  - Evidence: `artifacts/20260219_190945_adb_home_recents_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/focus_after_home_recents_back.txt`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/after_implicit_2.png`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_190945_adb_home_recents_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-RECENTS-BACK-EXPLICIT-01** (AVD) Home→Recents→Back 후 explicit 딥링크 재진입 — **failed (dual timeout)**
  - Steps: implicit deeplink 진입 → `HOME` → `APP_SWITCH` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 38224ms`, focus `null`
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `WaitTime: 10675ms`
    - 2차 실행 후 focus: `GraniteActivity` (지연 복구)
    - logcat: `ANR in com.google.android.inputmethod.latin` 검출(시스템 입력기), 대상 앱 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 1·2차 `am start -W` 모두 timeout 발생으로 시나리오 fail
  - Evidence: `artifacts/20260219_191206_adb_home_recents_back_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/focus_after_home_recents_back.txt`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/after_explicit_2.png`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_191206_adb_home_recents_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-BACK-HOME-IMPLICIT-01** (AVD) Back→Home 후 implicit 딥링크 재진입 — **failed (app ANR + timeout)**
  - Steps: explicit deeplink 진입 → `BACK` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 1020ms`, focus `GraniteActivity`
    - Back→Home 후 focus: `null`
    - 2차 implicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 32207ms`
    - 2차 실행 후 focus: `null`
    - logcat: `ANR in Window{...viva.republica.toss.test...}`, `Completed ANR of viva.republica.toss.test` 검출
    - 추가로 시스템 앱 ANR(`com.google.android.inputmethod.latin`, `com.android.chrome`) 동반
  - Verdict: 대상 앱 ANR 및 재진입 timeout으로 fail
  - Evidence: `artifacts/20260219_191511_adb_back_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_191511_adb_back_home_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_191511_adb_back_home_then_implicit/focus_after_back_home.txt`, `artifacts/20260219_191511_adb_back_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_191511_adb_back_home_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_191511_adb_back_home_then_implicit/after_implicit_2.png`, `artifacts/20260219_191511_adb_back_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_191511_adb_back_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-BACK-HOME-EXPLICIT-01** (AVD) Back→Home 후 explicit 딥링크 재진입 — **failed (focus null + timeout)**
  - Steps: implicit deeplink 진입 → `BACK` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 21851ms`, focus `null`
    - Back→Home 후 focus: `null`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Warning: current task brought to front`, `WaitTime: 29275ms`
    - 2차 실행 후 focus: `null`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 양 단계 모두 비정상 지연/포커스 null 상태로 fail
  - Evidence: `artifacts/20260219_191811_adb_back_home_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_191811_adb_back_home_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_191811_adb_back_home_then_explicit/focus_after_back_home.txt`, `artifacts/20260219_191811_adb_back_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_191811_adb_back_home_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_191811_adb_back_home_then_explicit/after_explicit_2.png`, `artifacts/20260219_191811_adb_back_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_191811_adb_back_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-BACK-RECENTS-IMPLICIT-01** (AVD) Back→Recents 후 implicit 딥링크 재진입 — **failed (launcher fallback)**
  - Steps: explicit deeplink 진입 → `BACK` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 544ms`, focus `GraniteActivity`
    - Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1457ms`, `WaitTime: 1469ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back→Recents 이후 implicit 재진입이 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_192122_adb_back_recents_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_192122_adb_back_recents_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_192122_adb_back_recents_then_implicit/focus_after_back_recents.txt`, `artifacts/20260219_192122_adb_back_recents_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_192122_adb_back_recents_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_192122_adb_back_recents_then_implicit/after_implicit_2.png`, `artifacts/20260219_192122_adb_back_recents_then_implicit/logcat_tail.txt`, `artifacts/20260219_192122_adb_back_recents_then_implicit/log_hits.txt`

- [x] **TC-ADB-BACK-RECENTS-EXPLICIT-01** (AVD) Back→Recents 후 explicit 딥링크 재진입 — **failed (1차 launcher fallback)**
  - Steps: implicit deeplink 진입 → `BACK` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 522ms`
    - 1차 실행 후 focus: `NexusLauncherActivity` (초기 진입 실패)
    - Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `Warning: current task brought to front`, `TotalTime: 849ms`, `WaitTime: 856ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 explicit 복구는 성공했으나 1차 진입이 launcher fallback으로 시나리오 fail
  - Evidence: `artifacts/20260219_192318_adb_back_recents_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_192318_adb_back_recents_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_192318_adb_back_recents_then_explicit/focus_after_back_recents.txt`, `artifacts/20260219_192318_adb_back_recents_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_192318_adb_back_recents_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_192318_adb_back_recents_then_explicit/after_explicit_2.png`, `artifacts/20260219_192318_adb_back_recents_then_explicit/logcat_tail.txt`, `artifacts/20260219_192318_adb_back_recents_then_explicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-HOME-BACK-EXPLICIT-01** (AVD) Recents→Home→Back 후 explicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 526ms`, focus `GraniteActivity`
    - Recents→Home→Back 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `intent delivered to currently running top-most instance`, `WaitTime: 24ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents→Home→Back 이후 explicit 재진입 정상
  - Evidence: `artifacts/20260219_192511_adb_recents_home_back_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/focus_after_recents_home_back.txt`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/after_explicit_2.png`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/logcat_tail.txt`, `artifacts/20260219_192511_adb_recents_home_back_then_explicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-HOME-BACK-IMPLICIT-01** (AVD) Recents→Home→Back 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` → `HOME` → `BACK` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 713ms`, `WaitTime: 719ms`, focus `GraniteActivity`
    - Recents→Home→Back 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 153ms`, `WaitTime: 162ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents→Home→Back 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_192653_adb_recents_home_back_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/focus_after_recents_home_back.txt`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/after_implicit_2.png`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/logcat_tail.txt`, `artifacts/20260219_192653_adb_recents_home_back_then_implicit/log_hits.txt`

- [x] **TC-ADB-BACK-HOME-RECENTS-EXPLICIT-01** (AVD) Back→Home→Recents 후 explicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `BACK` → `HOME` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 571ms`, `WaitTime: 592ms`, focus `GraniteActivity`
    - Back→Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 4863ms`, `WaitTime: 4886ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back→Home→Recents 이후 explicit 재진입 정상
  - Evidence: `artifacts/20260219_192831_adb_back_home_recents_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/focus_after_back_home_recents.txt`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/after_explicit_2.png`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/logcat_tail.txt`, `artifacts/20260219_192831_adb_back_home_recents_then_explicit/log_hits.txt`

- [x] **TC-ADB-BACK-HOME-RECENTS-IMPLICIT-01** (AVD) Back→Home→Recents 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `BACK` → `HOME` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 841ms`, `WaitTime: 863ms`, focus `GraniteActivity`
    - Back→Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 650ms`, `WaitTime: 687ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back→Home→Recents 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_193014_adb_back_home_recents_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/focus_after_back_home_recents.txt`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/after_implicit_2.png`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/logcat_tail.txt`, `artifacts/20260219_193014_adb_back_home_recents_then_implicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-HOME-IMPLICIT-01** (AVD) Recents→Back→Home 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `APP_SWITCH` → `BACK` → `HOME` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 257ms`, focus `GraniteActivity`
    - Recents→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 299ms`, `WaitTime: 322ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents→Back→Home 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_193148_adb_recents_back_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/focus_after_recents_back_home.txt`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/after_implicit_2.png`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_193148_adb_recents_back_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-RECENTS-BACK-HOME-EXPLICIT-01** (AVD) Recents→Back→Home 후 explicit 딥링크 재진입 — **passed**
  - Steps: implicit deeplink 진입 → `APP_SWITCH` → `BACK` → `HOME` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 2428ms`, `WaitTime: 2449ms`, focus `GraniteActivity`
    - Recents→Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 876ms`, `WaitTime: 963ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Recents→Back→Home 이후 explicit 재진입 정상
  - Evidence: `artifacts/20260219_193334_adb_recents_back_home_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/focus_after_recents_back_home.txt`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/after_explicit_2.png`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/logcat_tail.txt`, `artifacts/20260219_193334_adb_recents_back_home_then_explicit/log_hits.txt`

- [x] **TC-ADB-HOME-BACK-RECENTS-IMPLICIT-01** (AVD) Home→Back→Recents 후 implicit 딥링크 재진입 — **passed**
  - Steps: explicit deeplink 진입 → `HOME` → `BACK` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - 1차 explicit: `Status: ok`, `LaunchState: HOT`, `TotalTime: 803ms`, `WaitTime: 827ms`, focus `GraniteActivity`
    - Home→Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 405ms`, `WaitTime: 440ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home→Back→Recents 이후 implicit 재진입 정상
  - Evidence: `artifacts/20260219_193518_adb_home_back_recents_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/focus_after_explicit_1.txt`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/focus_after_home_back_recents.txt`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/after_implicit_2.png`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/logcat_tail.txt`, `artifacts/20260219_193518_adb_home_back_recents_then_implicit/log_hits.txt`

- [x] **TC-ADB-HOME-BACK-RECENTS-EXPLICIT-01** (AVD) Home→Back→Recents 후 explicit 딥링크 재진입 — **passed**
  - Steps: implicit deeplink 진입 → `HOME` → `BACK` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - 1차 implicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 2242ms`, `WaitTime: 2258ms`, focus `GraniteActivity`
    - Home→Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 265ms`, `WaitTime: 267ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Home→Back→Recents 이후 explicit 재진입 정상
  - Evidence: `artifacts/20260219_193649_adb_home_back_recents_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/focus_after_implicit_1.txt`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/focus_after_home_back_recents.txt`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/after_explicit_2.png`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/logcat_tail.txt`, `artifacts/20260219_193649_adb_home_back_recents_then_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BASELINE-01** (AVD) force-stop 후 explicit 딥링크 베이스라인 재진입 — **failed (am start timeout)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - explicit 재진입: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `WaitTime: 17606ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat: 대상 앱 obituary 1건(강제종료 맥락), 대상 앱 ANR/FATAL/`ANR likely to follow` 미검출
  - Verdict: 포커스는 복구되지만 `am start -W` timeout 발생으로 fail
  - Evidence: `artifacts/20260219_193842_adb_forcestop_then_explicit_baseline/pid_after_forcestop.txt`, `artifacts/20260219_193842_adb_forcestop_then_explicit_baseline/am_start_explicit.txt`, `artifacts/20260219_193842_adb_forcestop_then_explicit_baseline/focus_after_explicit.txt`, `artifacts/20260219_193842_adb_forcestop_then_explicit_baseline/after_explicit.png`, `artifacts/20260219_193842_adb_forcestop_then_explicit_baseline/logcat_tail.txt`, `artifacts/20260219_193842_adb_forcestop_then_explicit_baseline/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BASELINE-01** (AVD) force-stop 후 implicit 딥링크 베이스라인 재진입 — **failed (launcher fallback + ANR warning)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - implicit 재진입: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 25377ms`
    - 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat: 대상 앱 obituary 1건(강제종료 맥락) + `Application ANR likely to follow` 1건 검출
  - Verdict: implicit baseline 재진입이 launcher fallback이며 ANR 전조 키워드 동반으로 fail
  - Evidence: `artifacts/20260219_194036_adb_forcestop_then_implicit_baseline/pid_after_forcestop.txt`, `artifacts/20260219_194036_adb_forcestop_then_implicit_baseline/am_start_implicit.txt`, `artifacts/20260219_194036_adb_forcestop_then_implicit_baseline/focus_after_implicit.txt`, `artifacts/20260219_194036_adb_forcestop_then_implicit_baseline/after_implicit.png`, `artifacts/20260219_194036_adb_forcestop_then_implicit_baseline/logcat_tail.txt`, `artifacts/20260219_194036_adb_forcestop_then_implicit_baseline/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BASELINE-02** (AVD) force-stop 후 explicit 딥링크 베이스라인 재검증 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - explicit 재진입: `Status: ok`, `LaunchState: COLD`, `TotalTime: 5247ms`, `WaitTime: 5256ms`
    - 실행 후 focus: `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit baseline 재진입 정상
  - Evidence: `artifacts/20260219_194232_adb_forcestop_then_explicit_retest/pid_after_forcestop.txt`, `artifacts/20260219_194232_adb_forcestop_then_explicit_retest/am_start_explicit.txt`, `artifacts/20260219_194232_adb_forcestop_then_explicit_retest/focus_after_explicit.txt`, `artifacts/20260219_194232_adb_forcestop_then_explicit_retest/after_explicit.png`, `artifacts/20260219_194232_adb_forcestop_then_explicit_retest/logcat_tail.txt`, `artifacts/20260219_194232_adb_forcestop_then_explicit_retest/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BASELINE-02** (AVD) force-stop 후 implicit 딥링크 베이스라인 재검증 — **failed (launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - implicit 재진입: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 15721ms`
    - 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat: 대상 앱 obituary 1건(강제종료 맥락), 대상 앱 ANR/FATAL/`ANR likely to follow` 미검출
  - Verdict: implicit baseline 재진입이 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_194439_adb_forcestop_then_implicit_retest/pid_after_forcestop.txt`, `artifacts/20260219_194439_adb_forcestop_then_implicit_retest/am_start_implicit.txt`, `artifacts/20260219_194439_adb_forcestop_then_implicit_retest/focus_after_implicit.txt`, `artifacts/20260219_194439_adb_forcestop_then_implicit_retest/after_implicit.png`, `artifacts/20260219_194439_adb_forcestop_then_implicit_retest/logcat_tail.txt`, `artifacts/20260219_194439_adb_forcestop_then_implicit_retest/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-IMPLICIT-CHAIN-01** (AVD) force-stop 후 explicit→implicit 연쇄 재진입 — **passed (high explicit latency)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → implicit deeplink 연속 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 23293ms`, `WaitTime: 23299ms`, focus `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 418ms`, `WaitTime: 440ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 기능적으로는 explicit→implicit 연쇄 재진입 성공. 단 explicit cold start 지연(23s) 관찰
  - Evidence: `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/pid_after_forcestop.txt`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/after_implicit.png`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/logcat_tail.txt`, `artifacts/20260219_194632_adb_forcestop_then_explicit_then_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-EXPLICIT-CHAIN-01** (AVD) force-stop 후 implicit→explicit 연쇄 재진입 — **failed (implicit launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → explicit deeplink 연속 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 16048ms`, focus `NexusLauncherActivity` (실패)
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 4114ms`, `WaitTime: 4122ms`, focus `GraniteActivity` (복구)
    - logcat: 대상 앱 obituary 1건(강제종료 맥락), 대상 앱 ANR/FATAL/`ANR likely to follow` 미검출
  - Verdict: 연쇄 시나리오에서 implicit 단계가 launcher fallback이므로 fail
  - Evidence: `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/pid_after_forcestop.txt`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/am_start_1_implicit.txt`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/focus_after_implicit.txt`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/focus_after_explicit.txt`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/after_explicit.png`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/logcat_tail.txt`, `artifacts/20260219_194845_adb_forcestop_then_implicit_then_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-EXPLICIT-CHAIN-01** (AVD) force-stop 후 explicit→explicit 연쇄 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → explicit deeplink 연속 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 8785ms`, `WaitTime: 8798ms`, focus `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `intent delivered to currently running top-most instance`, `WaitTime: 32ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 연쇄 재진입 정상
  - Evidence: `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/pid_after_forcestop.txt`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/am_start_1_explicit.txt`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/am_start_2_explicit.txt`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/after_explicit_2.png`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/logcat_tail.txt`, `artifacts/20260219_195040_adb_forcestop_then_explicit_then_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-IMPLICIT-CHAIN-01** (AVD) force-stop 후 implicit→implicit 연쇄 재진입 — **failed (app ANR)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → implicit deeplink 연속 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 18347ms`, focus `Application Not Responding: viva.republica.toss.test`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, top-most instance 인텐트 전달, `WaitTime: 13ms`
    - 2차 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - logcat: `ANR in viva.republica.toss.test`, `Completed ANR` 검출
  - Verdict: force-stop 이후 implicit 연쇄 재진입에서 대상 앱 ANR 재현으로 fail
  - Evidence: `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/pid_after_forcestop.txt`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/am_start_1_implicit.txt`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/after_implicit_2.png`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/logcat_tail.txt`, `artifacts/20260219_195259_adb_forcestop_then_implicit_then_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→implicit 재진입 — **passed (explicit high latency)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 16872ms`, `WaitTime: 16890ms`, focus `GraniteActivity`
    - Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 394ms`, `WaitTime: 496ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 이후 Home 경유 implicit 재진입 기능 정상(단 explicit cold start 지연 큼)
  - Evidence: `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/pid_after_forcestop.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/am_start_1_explicit.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/focus_after_explicit.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/focus_after_home.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/am_start_2_implicit.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/focus_after_implicit.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/after_implicit.png`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/logcat_tail.txt`, `artifacts/20260219_195502_adb_forcestop_explicit_home_then_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-HOME-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Home→explicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `HOME` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 10288ms`, `WaitTime: 10311ms`, focus `GraniteActivity`
    - Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 830ms`, `WaitTime: 893ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 implicit 진입 및 Home 경유 explicit 재진입 정상
  - Evidence: `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/pid_after_forcestop.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/am_start_1_implicit.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/focus_after_implicit.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/focus_after_home.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/am_start_2_explicit.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/focus_after_explicit.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/after_explicit.png`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/logcat_tail.txt`, `artifacts/20260219_195710_adb_forcestop_implicit_home_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-RECENTS-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Recents→implicit 재진입 — **failed (implicit launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `APP_SWITCH` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 14610ms`, `WaitTime: 14639ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 617ms`, `WaitTime: 628ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 이후 Recents 경유 implicit 재진입이 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/pid_after_forcestop.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/am_start_1_explicit.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/focus_after_explicit.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/focus_on_recents.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/am_start_2_implicit.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/focus_after_implicit.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/after_implicit.png`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/logcat_tail.txt`, `artifacts/20260219_195942_adb_forcestop_explicit_recents_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-RECENTS-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Recents→explicit 재진입 — **failed (initial timeout + final launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `APP_SWITCH` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: timeout`, `LaunchState: UNKNOWN (-1)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 27616ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 576ms`, `WaitTime: 589ms`
    - 2차 실행 후 focus: `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 초기 implicit timeout + 최종 focus launcher fallback으로 fail
  - Evidence: `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/pid_after_forcestop.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/am_start_1_implicit.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/focus_after_implicit.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/focus_on_recents.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/am_start_2_explicit.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/focus_after_explicit.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/after_explicit.png`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/logcat_tail.txt`, `artifacts/20260219_200149_adb_forcestop_implicit_recents_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-HOME-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Home→implicit 재진입 — **passed (cold start high latency)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `HOME` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 19179ms`, `WaitTime: 19202ms`, focus `GraniteActivity`
    - Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 447ms`, `WaitTime: 507ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 implicit 진입 및 Home 경유 implicit 재진입 기능 정상(단 1차 cold start 지연 큼)
  - Evidence: `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/pid_after_forcestop.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/am_start_1_implicit.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/focus_after_home.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/am_start_2_implicit.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/after_implicit_2.png`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/logcat_tail.txt`, `artifacts/20260219_200411_adb_forcestop_implicit_home_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→explicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 9869ms`, `WaitTime: 9875ms`, focus `GraniteActivity`
    - Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task brought to front`, `TotalTime: 353ms`, `WaitTime: 414ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Home 경유 explicit 재진입 정상
  - Evidence: `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/pid_after_forcestop.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/am_start_1_explicit.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/focus_after_home.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/am_start_2_explicit.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/after_explicit_2.png`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/logcat_tail.txt`, `artifacts/20260219_200626_adb_forcestop_explicit_home_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-RECENTS-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Recents→explicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 10797ms`, `WaitTime: 10808ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `intent delivered to currently running top-most instance`, `WaitTime: 46ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Recents 경유 explicit 재진입 정상
  - Evidence: `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/pid_after_forcestop.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/am_start_1_explicit.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/focus_on_recents.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/am_start_2_explicit.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/after_explicit_2.png`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/logcat_tail.txt`, `artifacts/20260219_200818_adb_forcestop_explicit_recents_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-RECENTS-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Recents→implicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 11987ms`, `WaitTime: 11995ms`, focus `GraniteActivity`
    - Recents 진입 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `intent delivered to currently running top-most instance`, `WaitTime: 62ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 implicit 진입 및 Recents 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/pid_after_forcestop.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/am_start_1_implicit.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/focus_on_recents.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/am_start_2_implicit.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/after_implicit_2.png`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/logcat_tail.txt`, `artifacts/20260219_201019_adb_forcestop_implicit_recents_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Back→implicit 재진입 — **passed (explicit high latency)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 22570ms`, `WaitTime: 22574ms`, focus `GraniteActivity`
    - Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1037ms`, `WaitTime: 1061ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 이후 Back 경유 implicit 재진입 정상(단 explicit cold start 지연 큼)
  - Evidence: `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/am_start_1_explicit.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/focus_after_explicit.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/focus_after_back.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/focus_after_implicit.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/after_implicit.png`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/logcat_tail.txt`, `artifacts/20260219_201217_adb_forcestop_explicit_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Back→explicit 재진입 — **failed (app ANR state persists)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 32250ms`, `WaitTime: 32269ms`
    - 1차 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - Back 후 focus: `Application Not Responding: viva.republica.toss.test` 유지
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 605ms`, `WaitTime: 649ms`
    - 2차 실행 후 focus: `Application Not Responding: viva.republica.toss.test` 유지
    - logcat에 ANR 윈도우 상태(`Application Not Responding` 포커스) 연속 관찰
  - Verdict: 초기 implicit 이후 앱이 ANR 상태로 고착되어 explicit 재진입 후에도 정상 포커스 복구 실패
  - Evidence: `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/pid_after_forcestop.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/am_start_1_implicit.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/focus_after_implicit.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/focus_after_back.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/am_start_2_explicit.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/focus_after_explicit.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/after_explicit.png`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/logcat_tail.txt`, `artifacts/20260219_201437_adb_forcestop_implicit_back_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Back→implicit 재진입 — **failed (app ANR persists)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 43706ms`, `WaitTime: 43741ms`
    - 1차 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - Back 후 focus: `Application Not Responding: viva.republica.toss.test` 유지
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, top-most instance 인텐트 전달, `WaitTime: 11ms`
    - 2차 실행 후 focus: `Application Not Responding: viva.republica.toss.test` 유지
    - logcat: `ANR in viva.republica.toss.test`, `Completed ANR` 검출
  - Verdict: force-stop 이후 implicit 경로에서 앱 ANR 상태 고착으로 fail
  - Evidence: `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/am_start_1_implicit.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/focus_after_back.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/after_implicit_2.png`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/logcat_tail.txt`, `artifacts/20260219_201721_adb_forcestop_implicit_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Back→explicit 재진입 — **failed (1차 launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 14856ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 20652ms`, `WaitTime: 20674ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 explicit 복구는 성공했지만 1차 explicit이 launcher fallback이라 시나리오 fail
  - Evidence: `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/pid_after_forcestop.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/am_start_1_explicit.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/focus_after_back.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/am_start_2_explicit.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/after_explicit_2.png`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/logcat_tail.txt`, `artifacts/20260219_201949_adb_forcestop_explicit_back_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-HOME-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Back→Home→explicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → `HOME` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 8266ms`, `WaitTime: 8274ms`, focus `GraniteActivity`
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 608ms`, `WaitTime: 645ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 Back→Home 경유 explicit 재진입 정상
  - Evidence: `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/pid_after_forcestop.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/am_start_1_implicit.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/focus_after_implicit.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/focus_after_back_home.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/am_start_2_explicit.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/focus_after_explicit.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/after_explicit.png`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/logcat_tail.txt`, `artifacts/20260219_202230_adb_forcestop_implicit_back_home_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-HOME-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Back→Home→implicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → `HOME` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7664ms`, `WaitTime: 7670ms`, focus `GraniteActivity`
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 649ms`, `WaitTime: 716ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: explicit 이후 Back→Home 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/pid_after_forcestop.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/am_start_1_explicit.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/focus_after_explicit.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/focus_after_back_home.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/am_start_2_implicit.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/focus_after_implicit.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/after_implicit.png`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/logcat_tail.txt`, `artifacts/20260219_202501_adb_forcestop_explicit_back_home_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-HOME-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Back→Home→implicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → `HOME` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: GraniteActivity`, `TotalTime: 4100ms`, `WaitTime: 4117ms`, focus `GraniteActivity`
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 489ms`, `WaitTime: 555ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: implicit 진입 이후 Back→Home 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/pid_after_forcestop.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/am_start_1_implicit.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/focus_after_back_home.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/am_start_2_implicit.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/after_implicit_2.png`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/logcat_tail.txt`, `artifacts/20260219_202715_adb_forcestop_implicit_back_home_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-HOME-EXPLICIT-02** (AVD) force-stop 후 explicit 진입 뒤 Back→Home→explicit 재진입 재검증 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → `HOME` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 2894ms`, `WaitTime: 2907ms`, focus `GraniteActivity`
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: WARM`, `TotalTime: 629ms`, `WaitTime: 636ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: Back→Home 경유 explicit 재진입이 재검증에서도 정상
  - Evidence: `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/pid_after_forcestop.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/am_start_1_explicit.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/focus_after_explicit_1.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/focus_after_back_home.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/am_start_2_explicit.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/focus_after_explicit_2.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/after_explicit_2.png`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/logcat_tail.txt`, `artifacts/20260219_202930_adb_forcestop_explicit_back_home_explicit_v2/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-HOME-EXPLICIT-02** (AVD) force-stop 후 implicit 진입 뒤 Back→Home→explicit 재진입 재검증 — **failed (1차 implicit launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → `HOME` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 13197ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 10022ms`, `WaitTime: 10031ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 explicit 복구는 성공했지만 1차 implicit이 launcher fallback이라 시나리오 fail
  - Evidence: `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/pid_after_forcestop.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/am_start_1_implicit.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/focus_after_implicit.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/focus_after_back_home.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/am_start_2_explicit.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/focus_after_explicit.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/after_explicit.png`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/logcat_tail.txt`, `artifacts/20260219_203150_adb_forcestop_implicit_back_home_explicit_v2/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-HOME-IMPLICIT-02** (AVD) force-stop 후 explicit 진입 뒤 Back→Home→implicit 재진입 재검증 — **failed (initial launcher fallback + app ANR)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → `HOME` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 10244ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 40161ms`, `WaitTime: 40164ms`
    - 2차 실행 후 focus: `Application Not Responding: viva.republica.toss.test`
    - logcat: `ANR in viva.republica.toss.test`, `Completed ANR` 검출
  - Verdict: 1차 explicit launcher fallback + 2차 implicit ANR 발생으로 fail
  - Evidence: `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/pid_after_forcestop.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/am_start_1_explicit.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/focus_after_explicit.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/focus_after_back_home.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/am_start_2_implicit.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/focus_after_implicit.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/after_implicit.png`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/logcat_tail.txt`, `artifacts/20260219_203416_adb_forcestop_explicit_back_home_implicit_v2/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-HOME-BACK-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Home→Back→explicit 재진입 — **failed (initial launcher fallback + ANR completion log)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `HOME` → `BACK` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 14790ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 5502ms`, `WaitTime: 5506ms`, focus `GraniteActivity` (복구)
    - logcat: 대상 앱 obituary 1건 + `Completed ANR of viva.republica.toss.test` / `App already killed by AM skipping ANR` 검출
  - Verdict: 1차 implicit launcher fallback 및 ANR completion 로그 확인으로 fail
  - Evidence: `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/pid_after_forcestop.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/am_start_1_implicit.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/focus_after_implicit.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/focus_after_home_back.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/am_start_2_explicit.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/focus_after_explicit.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/after_explicit.png`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/logcat_tail.txt`, `artifacts/20260219_203723_adb_forcestop_implicit_home_back_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-RECENTS-BACK-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Recents→Back→explicit 재진입 — **failed (initial launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `APP_SWITCH` → `BACK` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 20602ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 15932ms`, `WaitTime: 15935ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 explicit 복구는 성공했지만 1차 implicit이 launcher fallback이라 시나리오 fail
  - Evidence: `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/pid_after_forcestop.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/am_start_1_implicit.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/focus_after_implicit.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/focus_after_recents_back.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/am_start_2_explicit.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/focus_after_explicit.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/after_explicit.png`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/logcat_tail.txt`, `artifacts/20260219_203941_adb_forcestop_implicit_recents_back_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-RECENTS-BACK-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Recents→Back→implicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `APP_SWITCH` → `BACK` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 11159ms`, `WaitTime: 11168ms`, focus `GraniteActivity`
    - Recents→Back 후 focus: `GraniteActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 421ms`, `WaitTime: 461ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Recents→Back 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/am_start_1_explicit.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/focus_after_explicit.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/focus_after_recents_back.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/focus_after_implicit.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/after_implicit.png`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/logcat_tail.txt`, `artifacts/20260219_204233_adb_forcestop_explicit_recents_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-RECENTS-BACK-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Recents→Back→explicit 재진입 — **failed (ANR warning signal)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `APP_SWITCH` → `BACK` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 16057ms`, `WaitTime: 16062ms`, focus `GraniteActivity`
    - Recents→Back 후 focus: `GraniteActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Warning: intent delivered to currently running top-most instance`, `WaitTime: 14ms`, focus `GraniteActivity`
    - logcat: `Application ANR likely to follow` 검출
  - Verdict: 기능은 유지되었으나 ANR warning signal 정책에 따라 fail
  - Evidence: `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/pid_after_forcestop.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/am_start_1_explicit.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/focus_after_recents_back.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/am_start_2_explicit.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/after_explicit_2.png`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/logcat_tail.txt`, `artifacts/20260219_204555_adb_forcestop_explicit_recents_back_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-RECENTS-BACK-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Recents→Back→implicit 재진입 — **failed (initial launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `APP_SWITCH` → `BACK` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 11265ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 23602ms`, `WaitTime: 23610ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 implicit 복구는 성공했지만 1차 implicit이 launcher fallback이라 시나리오 fail
  - Evidence: `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/am_start_1_implicit.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/focus_after_recents_back.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/after_implicit_2.png`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/logcat_tail.txt`, `artifacts/20260219_204739_adb_forcestop_implicit_recents_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-BACK-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→Back→implicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → `BACK` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 11019ms`, `WaitTime: 11038ms`, focus `GraniteActivity`
    - Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 517ms`, `WaitTime: 537ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Home→Back 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/am_start_1_explicit.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/focus_after_explicit.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/focus_after_home_back.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/focus_after_implicit.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/after_implicit.png`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/logcat_tail.txt`, `artifacts/20260219_205000_adb_forcestop_explicit_home_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-HOME-BACK-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Home→Back→implicit 재진입 — **failed (initial launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `HOME` → `BACK` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 16799ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 11165ms`, `WaitTime: 11192ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: 2차 implicit 복구는 성공했지만 1차 implicit이 launcher fallback이라 시나리오 fail
  - Evidence: `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/am_start_1_implicit.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/focus_after_home_back.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/after_implicit_2.png`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/logcat_tail.txt`, `artifacts/20260219_205137_adb_forcestop_implicit_home_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-BACK-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→Back→explicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → `BACK` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7297ms`, `WaitTime: 7306ms`, focus `GraniteActivity`
    - Home→Back 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task has been brought to the front`, `TotalTime: 330ms`, `WaitTime: 365ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Home→Back 경유 explicit 재진입 정상
  - Evidence: `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/pid_after_forcestop.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/am_start_1_explicit.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/focus_after_home_back.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/am_start_2_explicit.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/after_explicit_2.png`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/logcat_tail.txt`, `artifacts/20260219_205333_adb_forcestop_explicit_home_back_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-RECENTS-HOME-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Recents→Home→implicit 재진입 — **failed (ANR dialog focus + implicit launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `APP_SWITCH` → `HOME` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 25268ms`, `WaitTime: 25285ms`, 직후 focus `Application Not Responding: viva.republica.toss.test`
    - Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 12399ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat: `Application Not Responding: viva.republica.toss.test` 관련 항목 검출
  - Verdict: 1차 explicit에서 ANR dialog 포커스, 2차 implicit launcher fallback으로 fail
  - Evidence: `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/pid_after_forcestop.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/am_start_1_explicit.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/focus_after_explicit.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/focus_after_recents_home.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/am_start_2_implicit.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/focus_after_implicit.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/after_implicit.png`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/logcat_tail.txt`, `artifacts/20260219_205523_adb_forcestop_explicit_recents_home_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-RECENTS-HOME-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Recents→Home→explicit 재진입 — **failed (initial launcher fallback + explicit ANR)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `APP_SWITCH` → `HOME` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 18545ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 25151ms`, `WaitTime: 25166ms`, 직후 focus `Application Not Responding: viva.republica.toss.test`
    - logcat: `Application ANR likely to follow`, `ANR in viva.republica.toss.test`, `Completed ANR` 검출
  - Verdict: 1차 implicit launcher fallback + 2차 explicit ANR로 fail
  - Evidence: `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/pid_after_forcestop.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/am_start_1_implicit.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/focus_after_implicit.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/focus_after_recents_home.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/am_start_2_explicit.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/focus_after_explicit.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/after_explicit.png`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/logcat_tail.txt`, `artifacts/20260219_205730_adb_forcestop_implicit_recents_home_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-RECENTS-HOME-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Recents→Home→explicit 재진입 — **failed (double launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `APP_SWITCH` → `HOME` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 17392ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 14558ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 앱 ANR/FATAL/obituary/"ANR likely to follow" 미검출(웹뷰 sandbox 프로세스 종료 1건만 확인)
  - Verdict: 1·2차 explicit 모두 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/pid_after_forcestop.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/am_start_1_explicit.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/focus_after_recents_home.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/am_start_2_explicit.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/after_explicit_2.png`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/logcat_tail.txt`, `artifacts/20260219_210000_adb_forcestop_explicit_recents_home_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-RECENTS-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→Recents→implicit 재진입 — **failed (double launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → `APP_SWITCH` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 17768ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 14574ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 1·2차 모두 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/pid_after_forcestop.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/am_start_1_explicit.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/focus_after_explicit.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/focus_after_home_recents.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/am_start_2_implicit.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/focus_after_implicit.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/after_implicit.png`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/logcat_tail.txt`, `artifacts/20260219_210215_adb_forcestop_explicit_home_recents_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-RECENTS-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→Recents→explicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 16218ms`, `WaitTime: 16227ms`, focus `GraniteActivity`
    - Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: HOT`, `Warning: current task has been brought to the front`, `TotalTime: 719ms`, `WaitTime: 725ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 키워드 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Home→Recents 경유 explicit 재진입 정상
  - Evidence: `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/pid_after_forcestop.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/am_start_1_explicit.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/focus_after_home_recents.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/am_start_2_explicit.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/after_explicit_2.png`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/logcat_tail.txt`, `artifacts/20260219_210436_adb_forcestop_explicit_home_recents_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-HOME-RECENTS-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Home→Recents→explicit 재진입 — **failed (initial launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `HOME` → `APP_SWITCH` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 14115ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7269ms`, `WaitTime: 7289ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 2차 explicit 복구는 성공했지만 1차 implicit이 launcher fallback이라 시나리오 fail
  - Evidence: `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/pid_after_forcestop.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/am_start_1_implicit.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/focus_after_implicit.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/focus_after_home_recents.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/am_start_2_explicit.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/focus_after_explicit.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/after_explicit.png`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/logcat_tail.txt`, `artifacts/20260219_210626_adb_forcestop_implicit_home_recents_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-HOME-RECENTS-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Home→Recents→implicit 재진입 — **failed (double launcher fallback + app ANR)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `HOME` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 19197ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Home→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 31605ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat: `ANR in viva.republica.toss.test`, `Completed ANR` 검출
  - Verdict: 1·2차 implicit 모두 launcher fallback이며 앱 ANR 발생으로 fail
  - Evidence: `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/pid_after_forcestop.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/am_start_1_implicit.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/focus_after_home_recents.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/am_start_2_implicit.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/after_implicit_2.png`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/logcat_tail.txt`, `artifacts/20260219_210826_adb_forcestop_implicit_home_recents_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-RECENTS-HOME-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Recents→Home→implicit 재진입 — **failed (double launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `APP_SWITCH` → `HOME` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 19399ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Recents→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 14178ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 1·2차 implicit 모두 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/pid_after_forcestop.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/am_start_1_implicit.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/focus_after_recents_home.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/am_start_2_implicit.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/after_implicit_2.png`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/logcat_tail.txt`, `artifacts/20260219_211053_adb_forcestop_implicit_recents_home_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-RECENTS-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Back→Recents→implicit 재진입 — **failed (double launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → `APP_SWITCH` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 20087ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 13931ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 1·2차 모두 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/pid_after_forcestop.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/am_start_1_explicit.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/focus_after_explicit.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/focus_after_back_recents.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/am_start_2_implicit.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/focus_after_implicit.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/after_implicit.png`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/logcat_tail.txt`, `artifacts/20260219_211309_adb_forcestop_explicit_back_recents_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-RECENTS-EXPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Back→Recents→explicit 재진입 — **failed (double launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → `APP_SWITCH` → explicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 14595ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 13258ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 1·2차 모두 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/pid_after_forcestop.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/am_start_1_explicit.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/focus_after_explicit_1.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/focus_after_back_recents.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/am_start_2_explicit.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/focus_after_explicit_2.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/after_explicit_2.png`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/logcat_tail.txt`, `artifacts/20260219_211506_adb_forcestop_explicit_back_recents_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-HOME-RECENTS-BACK-IMPLICIT-01** (AVD) force-stop 후 explicit 진입 뒤 Home→Recents→Back→implicit 재진입 — **failed (double launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `HOME` → `APP_SWITCH` → `BACK` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `WaitTime: 18500ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Home→Recents→Back 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 13116ms`, focus `NexusLauncherActivity` (재진입 실패)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 1·2차 모두 launcher fallback으로 fail
  - Evidence: `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/pid_after_forcestop.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/am_start_1_explicit.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/focus_after_explicit.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/focus_after_home_recents_back.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/am_start_2_implicit.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/focus_after_implicit.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/after_implicit.png`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/logcat_tail.txt`, `artifacts/20260219_211714_adb_forcestop_explicit_home_recents_back_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-RECENTS-EXPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Back→Recents→explicit 재진입 — **failed (initial launcher fallback)**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → `APP_SWITCH` → explicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: UNKNOWN (0)`, `Activity: .MiniAppSchemeActivity`, `WaitTime: 13501ms`, focus `NexusLauncherActivity` (초기 진입 실패)
    - Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 3624ms`, `WaitTime: 3630ms`, focus `GraniteActivity` (복구)
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: 2차 explicit 복구는 성공했지만 1차 implicit launcher fallback으로 fail
  - Evidence: `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/pid_after_forcestop.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/am_start_1_implicit.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/focus_after_implicit.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/focus_after_back_recents.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/am_start_2_explicit.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/focus_after_explicit.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/after_explicit.png`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/logcat_tail.txt`, `artifacts/20260219_211941_adb_forcestop_implicit_back_recents_explicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-IMPLICIT-BACK-RECENTS-IMPLICIT-01** (AVD) force-stop 후 implicit 진입 뒤 Back→Recents→implicit 재진입 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → implicit deeplink 실행 → `BACK` → `APP_SWITCH` → implicit deeplink 재실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 implicit: `Status: ok`, `LaunchState: COLD`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 4496ms`, `WaitTime: 4511ms`, focus `GraniteActivity`
    - Back→Recents 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: GraniteActivity`, `TotalTime: 551ms`, `WaitTime: 582ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: force-stop 이후 implicit 진입 및 Back→Recents 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/pid_after_forcestop.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/am_start_1_implicit.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/focus_after_implicit_1.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/focus_after_back_recents.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/am_start_2_implicit.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/focus_after_implicit_2.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/after_implicit_2.png`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/logcat_tail.txt`, `artifacts/20260219_212126_adb_forcestop_implicit_back_recents_implicit/log_hits.txt`

- [x] **TC-ADB-FORCESTOP-EXPLICIT-BACK-HOME-IMPLICIT-03** (AVD) force-stop 후 explicit 진입 뒤 Back→Home→implicit 재진입 재검증 — **passed**
  - Steps: `HOME` → `am force-stop viva.republica.toss.test` → explicit deeplink 실행 → `BACK` → `HOME` → implicit deeplink 실행
  - Observed:
    - force-stop 직후 pid 조회: 프로세스 미존재(정상 종료)
    - 1차 explicit: `Status: ok`, `LaunchState: COLD`, `TotalTime: 7954ms`, `WaitTime: 7958ms`, focus `GraniteActivity`
    - Back→Home 후 focus: `NexusLauncherActivity`
    - 2차 implicit: `Status: ok`, `LaunchState: WARM`, `Activity: .MiniAppSchemeActivity`, `TotalTime: 1782ms`, `WaitTime: 1834ms`, focus `GraniteActivity`
    - logcat 스캔에서 ANR/FATAL/obituary/"ANR likely to follow" 미검출
  - Verdict: force-stop 이후 explicit 진입 및 Back→Home 경유 implicit 재진입 정상
  - Evidence: `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/pid_after_forcestop.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/am_start_1_explicit.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/focus_after_explicit.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/focus_after_back_home.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/am_start_2_implicit.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/focus_after_implicit.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/after_implicit.png`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/logcat_tail.txt`, `artifacts/20260219_212331_adb_forcestop_explicit_back_home_implicit_v3/log_hits.txt`

- Notes:
  - Login: Toss login button is one-tap (auto login).
  - App capability: file upload only (no text message send).

- Last update: 2026-02-19 21:25 KST
