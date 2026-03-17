# Routing / DeepLink / Bridge 정책 (Issue #174)

## 1) 딥링크 수신 규칙

앱은 `app_links`를 통해 다음 두 케이스를 처리한다.

- 앱 cold start 시 `getInitialLink()`
- 앱 실행 중 `uriLinkStream`

두 경우 모두 `DeepLinkConfig.resolveToInitialWebUri()`로 정규화 후 WebView에 로드한다.
또한 `DeepLinkConfig.resolveToAppTarget(mode: cold|warm)`로 라우트 매핑을 분리해 추적한다.

### 허용 스킴

- `takealook://`
- `https://`
- `http://`

그 외 스킴은 초기 URL(`FE_BASE_URL`)로 fallback.

### takealook 커스텀 스킴 포맷

- 예: `takealook://web?path=/mypage&tab=bookmark`
- `host == web` 일 때만 유효
- `path` 쿼리 파라미터를 웹 경로로 사용
- 그 외 쿼리는 그대로 전달

## 2) 경로 분기 정책

- **앱 내부(WebView 내부 이동 허용)**
  - `http/https` 이면서 `FE_BASE_URL`과 동일 host
- **외부 URL/앱 위임**
  - WebView navigation 시 비 http(s) 스킴
  - `url_launcher`로 외부 앱 실행

## 2-1) 딥링크 라우트 매핑 테이블

- `/` -> Home
- `/chat` -> Chat list
- `/chat/:id` -> Chat room
- `/mypage` -> MyPage
- `/settings` -> Settings
- unknown/invalid path -> `/` (safe fallback)

`intoss-private://...`는 `path` 쿼리를 우선 사용하고, 없으면 path를 사용한다.

## 3) 브릿지 인터페이스 초안

JavaScript channel 이름: `TakeaLookBridge`

SDK 어댑터: `lib/core/bridge/apps_in_toss_bridge.dart`

- init 시점/실패 로그 처리
- requestId 기반 pending response 상관관계 처리
- timeout 기본값(5s) 및 오류코드 표준화

메시지 형식(JSON):

```json
{
  "type": "session.sync | route.push | error",
  "payload": {},
  "requestId": "optional-id",
  "code": "optional-error-code",
  "message": "optional-error-message"
}
```

### 에러 코드 초안

- `invalidPayload`: JSON 파싱 실패/포맷 불일치
- `unsupportedType`: 정의되지 않은 type
- `timeout`: 앱-웹 브릿지 응답 타임아웃
- `initFailed`: SDK 초기화 실패
- `hostFailure`: 호스트 처리 실패

## 4) Lifecycle 정책 (Apps in Toss)

- `LifecycleCoordinator`로 앱 lifecycle observer 관리
- 백그라운드 -> 복귀(`resumed`) 시 refresh signal 발행
- 중복 호출 방지: resume debounce(기본 2초)
- 라우트 복원 정책: 현재 화면 유지(`restorationScopeId` 기반)
- 이상 동작 로그 포인트: state change / debounce drop / resume refresh emit

## 5) 보안/품질 메모

- 운영 환경에서 민감정보 포함 로그 출력 금지
- 상세 로그는 debug 모드에서만 출력
- 허용 스킴/호스트 화이트리스트는 `DeepLinkConfig`에서 중앙 관리
