# Issue #96 - 신고 API / 블라인드 상태 필드 FE 정리

## UserChatMessage blind 상태 계약 (FE)

`UserChatMessage`에서 아래 필드를 사용한다.

- `isBlinded?: boolean`
  - `true`: 신고/모더레이션으로 블라인드 처리됨
  - `false | undefined`: 일반 메시지 (기존 동작 유지)

## FE 렌더링 규칙

- `isBlinded === true` 이면 `imageUrl` 존재 여부와 무관하게 **블라인드 placeholder** 렌더
- 이미지 렌더/라이트박스/스와이프(스토리 에디터 이동)는 `isBlinded !== true`인 메시지에만 허용
- `isBlinded`가 없는 구형 payload는 기존 fallback(`imageUrl` 유무) 유지

## 참고
- Swagger: https://s1.takealook.my/webjars/swagger-ui/index.html
- Issue: https://github.com/takea-look/takealook-webview/issues/96
