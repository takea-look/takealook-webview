## Summary
- what changed?

## Scope check
- [ ] Main target is `flutter/` (new feature or migration)
- [ ] If `src/` changed, reason is maintenance-only and explicitly described

## Flutter verification (required)
- [ ] `cd flutter && flutter pub get`
- [ ] `cd flutter && flutter analyze`
- [ ] `cd flutter && flutter test`
- [ ] `cd flutter && flutter build apk --debug` (or platform-equivalent)
- [ ] `flutter/docs/REGRESSION_TEST_CHECKLIST.md` 기준 수동/자동 테스트 항목 확인

## Risk / rollback
- risk points:
- rollback plan:
