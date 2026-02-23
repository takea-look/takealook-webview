# Repository Structure (Flutter Main)

이 저장소는 **Flutter 런타임(`flutter/`)이 메인**입니다.

## Directory policy

- `flutter/` → **Main runtime / 신규 기능 개발 대상**
- `src/` → **Legacy React (유지보수 전용)**
- `docs/` → 운영/정책/가이드 문서
- `.github/workflows/` → CI/CD 파이프라인

## Contribution rules

1. 신규 기능은 `flutter/`에만 추가합니다.
2. `src/`는 장애 대응/긴급 수정 외 신규 개발 금지입니다.
3. PR 검증 기본은 Flutter lint/test/build 기준입니다.
