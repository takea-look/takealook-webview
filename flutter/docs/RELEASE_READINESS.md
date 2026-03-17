# Flutter Release Readiness (Issue #211)

## 1) Initial loading measurement baseline

- Cold start target: first meaningful paint <= 2.5s (mid-tier device)
- Warm resume target: interactive <= 1.2s
- Measure points:
  - app launch -> first route visible
  - route transition -> list first frame

## 2) List rendering performance checks

- Chat list: `ListView.separated(itemExtent + cacheExtent)` 적용
- Chat room: `ListView.builder(cacheExtent)` 적용
- Frame drop check method:
  - Flutter performance overlay
  - manual scroll stress (fast flick 5회)

## 3) Image/resource optimization points

- large image messages: thumbnail 우선 + lazy load 원칙
- static assets: release build only, debug asset noise 제외
- 불필요한 shadow/overdraw 스타일 최소화

## 4) Pre-release checklist

- [ ] 기능: 로그인/채팅목록/채팅상세/설정/마이페이지/딥링크
- [ ] 로그: error/fatal 로그 과다 출력 여부
- [ ] 크래시: 앱 시작/복귀/딥링크 진입 시 크래시 0
- [ ] CI: analyze/test/build 통과

## 5) Post-deploy monitoring updates

- 1h / 6h / 24h 시점 핵심 지표 확인
- 실패율/재시도율/unauthorized 이벤트 빈도 확인
- critical regression 발견 시 직전 stable 배포로 롤백
