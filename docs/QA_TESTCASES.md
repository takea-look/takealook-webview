# QA Test Cases (Execution Notes)

- [x] **QA Smoke-ENV-01** (localhost:5173): `GET /`, `/login`, `/chat`, `/mypage` all returned `200`, `npm run lint`/`npm run build` passed (reported in HEARTBEAT).
- [ ] **TC-AUTH-01** Login success (requires real test account + manual browser interaction) — pending
- [ ] **TC-CHAT-HP-01** Happy path chat realtime (requires 2 accounts + WS interaction) — pending
- [x] **TC-ADB-DEEPLINK-01** (AVD) Apps in Toss Sandbox: launch `viva.republica.toss.test/im.toss.rn.granite.core.GraniteActivity` via deeplink `intoss://takealook` and confirm activity focused. Evidence: `artifacts/avd_intoss_takealook_20260218_032452.png`, `artifacts/logcat_tail_20260218_032430.txt`

- Last update: 2026-02-17 02:40 KST
