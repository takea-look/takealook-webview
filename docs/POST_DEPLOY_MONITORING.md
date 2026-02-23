# Post-Deploy Monitoring (24~48h)

## 1) Core runtime
- [ ] 앱 시작 시 Flutter 화면 노출
- [ ] 백그라운드 복귀 시 Flutter 유지
- [ ] 새로고침 시 Flutter 유지

## 2) DeepLink / Bridge
- [ ] intoss-private 진입 성공
- [ ] deeplink path 전달 정상
- [ ] bridge timeout/error 로그 확인 가능

## 3) Auth / Session
- [ ] 로그인 진입/실패/재시도 정상
- [ ] unauthorized 이벤트 시 로그인 경로 전환

## 4) Chat / MyPage / Settings smoke
- [ ] 채팅방 목록/상세 진입
- [ ] 마이페이지 진입
- [ ] 설정 진입

## 5) Alerts
- [ ] 배포 성공 알림 수신(Discord)
- [ ] 실패 알림 수신 및 run URL 접근 가능
- [ ] 크리티컬 장애 룰(로그인/진입 실패) 재확인

## Incident rule
- Sev1: 진입 불가/크래시/무한 리다이렉트 → 즉시 롤백
- Sev2: 기능 일부 불능 → 핫픽스 우선, 2시간 내 복구 목표
