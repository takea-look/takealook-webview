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

- Notes:
  - Login: Toss login button is one-tap (auto login).
  - App capability: file upload only (no text message send).

- Last update: 2026-02-19 13:01 KST
