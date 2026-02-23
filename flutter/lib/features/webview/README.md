# Webview Feature

표준 레이어 구조:

- `data`: API/저장소 계층(원격 데이터 소스, DTO 변환, 리포지토리 구현)
- `domain`: 비즈니스 규칙/유스케이스/도메인 모델
- `presentation`: 화면, 상태, 라우트/뷰모델

네이밍 규칙:
- 화면: `*Page`
- 뷰모델/상태관리 객체: `*ViewModel` / `*State`
- 리포지토리: `*Repository`
- 유스케이스: `*UseCase`

현재는 Issue #197에 맞춰 템플릿 골격만 정리합니다.
