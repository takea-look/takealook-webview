# takealook_webview_flutter

`takea-look-webview` Flutter MVP 스캐폴드입니다.

## Quick Start

```bash
cd flutter
flutter pub get
flutter run \
  --dart-define=FE_BASE_URL=https://takealook.my \
  --dart-define=API_BASE_URL=https://api.takealook.my
```

> 로컬에서 `flutter` 명령이 없으면 Flutter SDK 설치 후 PATH를 설정하세요.

## Environment Strategy

환경값은 `lib/core/config/env.dart`에서 `String.fromEnvironment`로 관리합니다.

- `FE_BASE_URL` (기본값: `https://takealook.my`)
- `API_BASE_URL` (기본값: `https://api.takealook.my`)

지정하지 않으면 기본값 fallback으로 동작합니다.

## Included MVP foundations

- `MaterialApp` 엔트리 + 전역 에러 처리 골격
- 중앙 라우터 (`core/router/app_router.dart`)
- Feature-first 폴더 경계 (`features/webview`)
- `webview_flutter` 기반 FE URL 로딩
- URL 변경 이벤트 추적/로그 + 진행률 인디케이터
- Android 백 버튼 처리: WebView history 우선, 최상위에서 2회 백 버튼 시 종료
- 공통 에러/복구 UX 컴포넌트(`RecoveryErrorPlaceholder`) 기반 재시도 표준화
- 네트워크/타임아웃/권한/알수없음 케이스 공통 처리
- 반복 실패 횟수 기반 안내문 강화
- 개발 로그(debug)와 운영 로그 최소 노출 분리
- 딥링크 수신(app_links) + 초기 URL 정규화
- JS 브릿지 채널(`TakeaLookBridge`) 초안 연결
- Auth/Chat/MyPage/Settings parity 라우트 스캐폴드(`/login`, `/chat`, `/chat/:roomId`, `/mypage`, `/settings`)
- openWindow 대체 정책 (http/https는 내부, 기타 스킴은 외부 앱)

## Validation checklist

- [ ] `flutter pub get`
- [ ] `flutter analyze`
- [ ] `flutter run`
- [ ] Android 백 버튼 시나리오 수동 확인 (히스토리 있음/없음)
- [ ] iOS 제스처/뒤로가기 시나리오 수동 확인

현재 작업 환경에 Flutter SDK가 없어 실제 명령 실행은 CI/개발자 로컬에서 진행 필요.

## DeepLink / Routing / Bridge 문서

- 상세 정책: `docs/ROUTING_AND_BRIDGE.md`
- Parity 마이그레이션 체크리스트: `docs/PARITY_MIGRATION.md`
