# Feature Template

새 feature 생성 시 이 템플릿 구조를 복사해 시작합니다.

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

예시 네이밍:
- page: `ChatListPage`
- view model: `ChatListViewModel`
- repository: `ChatRepository` / `ChatRepositoryImpl`
