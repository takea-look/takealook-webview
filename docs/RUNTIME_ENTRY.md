# Runtime Entry Policy (Phase 3)

## Current runtime entry

- Default entry (`/`)는 React가 아닌 **Flutter web (`/flutter/`)** 로 즉시 전환됩니다.
- `index.html`은 bootstrap redirect만 담당합니다.

## Why

- 메인 런타임과 실제 사용자 노출 화면을 일치시키기 위함.
- React 라우터 진입으로 발생하던 혼선을 제거.

## Validation checklist

- [ ] 앱 시작 시 Flutter 화면이 노출되는지
- [ ] 앱 복귀/새로고침 후에도 Flutter 화면 유지되는지
- [ ] `intoss-private` 진입 후 Flutter 라우팅으로 진입되는지

## Rollback

- 배포 이슈 발생 시 직전 stable AIT deploymentId로 롤백
- 롤백 히스토리는 배포 채널(Discord/GitHub Actions summary)에 기록
