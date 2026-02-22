# Routing / DeepLink / Bridge 정책 (Issue #174)

## 1) 딥링크 수신 규칙

앱은 `app_links`를 통해 다음 두 케이스를 처리한다.

- 앱 cold start 시 `getInitialLink()`
- 앱 실행 중 `uriLinkStream`

두 경우 모두 `DeepLinkConfig.resolveToInitialWebUri()`로 정규화 후 WebView에 로드한다.

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

## 3) 브릿지 인터페이스 초안

JavaScript channel 이름: `TakeaLookBridge`

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

- `BRIDGE_INVALID_PAYLOAD`: JSON 파싱 실패/포맷 불일치
- `BRIDGE_UNSUPPORTED_TYPE`: 정의되지 않은 type
- `BRIDGE_TIMEOUT`: 앱-웹 브릿지 응답 타임아웃(추후)

## 4) 보안/품질 메모

- 운영 환경에서 민감정보 포함 로그 출력 금지
- 상세 로그는 debug 모드에서만 출력
- 허용 스킴/호스트 화이트리스트는 `DeepLinkConfig`에서 중앙 관리
