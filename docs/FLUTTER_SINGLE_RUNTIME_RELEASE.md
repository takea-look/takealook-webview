# Flutter Single Runtime Release Note (Phase 5)

## Summary

`takealook-webview`는 React/Flutter 혼합 운영에서 **Flutter 단일 런타임 운영**으로 전환되었습니다.

- Runtime entry: `/` → `/flutter/`
- Main CI/CD: Flutter 기준 (`pub get → analyze → test → build web`)
- AIT bundle/deploy: Flutter web 산출물 기반

## Changed

1. Repository policy
   - `flutter/` main runtime
   - `src/` legacy maintenance-only
2. Runtime policy
   - end-user 진입 시 React UI 미노출
3. CI/CD policy
   - Flutter-first 파이프라인 고정
   - secret 누락 graceful skip 정책 적용

## Operational cautions

- `src/`는 신규 기능 개발 금지
- 장애 대응 시 우선 확인 경로:
  1) GitHub Actions run summary
  2) `docs/CI_PIPELINE.md`
  3) `docs/RUNTIME_ENTRY.md`

## Rollback

- 최근 stable AIT deploymentId로 즉시 롤백
- 롤백 시점/원인/영향 범위를 배포 채널에 기록
