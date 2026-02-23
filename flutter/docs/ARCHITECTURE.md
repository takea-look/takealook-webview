# Flutter Architecture Standard (Issue #197)

## 1) Root layer rule

`flutter/lib`는 아래 3개 루트로 고정한다.

- `core/`: 앱 전역 공통 (config, theme, router, network, auth session, lifecycle, bridge, di)
- `shared/`: feature 간 재사용 UI/유틸
- `features/`: 기능 단위 구현

## 2) Feature template (required)

각 feature는 기본적으로 아래 구조를 따른다.

```text
features/<feature_name>/
  data/
    models/
    repositories/
  domain/
    entities/
    repositories/
    usecases/
  presentation/
    pages/
    view_models/
    widgets/
```

## 3) Naming convention

- route: `<feature>RouteName` 또는 `static const routeName = '/foo'`
- page: `XxxPage`
- view model: `XxxViewModel`
- repository(interface): `XxxRepository`
- repository(impl): `XxxRepositoryImpl`

## 4) DI entry point

- single entry: `core/di/service_locator.dart`
- 앱 시작 시 `main.dart`에서 `setupDependencies()` 호출
- feature는 ServiceLocator를 직접 참조하지 않고(권장), 생성자 주입 우선

## 5) Review checklist

- [ ] core/shared/features 경계 위반 없음
- [ ] 신규 feature가 data/domain/presentation 구조를 따름
- [ ] 하드코딩 라우트/스타일 난립 없음
- [ ] 공통 의존성은 service_locator 등록 여부 확인
