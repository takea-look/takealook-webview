# TDS (toss-design-system) Alignment Note

Flutter MVP 단계에서는 웹의 TDS 토큰을 직접 가져오지 않고, 아래 원칙만 선반영한다.

1. `ThemeData`를 단일 진입점(`app/takealook_app.dart`)에서 구성
2. 색상/타이포 토큰은 차후 `core/theme/`로 승격
3. 컴포넌트 공통 상태(로딩/오류/빈화면)는 `shared/widgets`에서 통일

후속 이슈에서 TDS 토큰 맵핑 레이어를 추가해도 파일 구조 변경 없이 확장 가능하도록 스캐폴드함.
