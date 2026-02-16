# Issue #95 - 닉네임 API 스펙 확정 및 FE 에러코드 매핑

## FE 처리 기준 (fallback 포함)

`PATCH /user/profile/me` 응답 실패 시 FE는 아래 우선순위로 메시지를 분기한다.

1. **중복 닉네임**
   - 조건: `status=409` 또는 에러 코드/메시지에 `DUPLICATE`, `ALREADY` 포함
   - 메시지: `이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해주세요.`

2. **금칙어/부적절 단어**
   - 조건: `status=400` + `BANNED`, `FORBIDDEN_WORD`, `PROFANITY` 포함
   - 메시지: `사용할 수 없는 단어가 포함되어 있어요. 다른 닉네임을 입력해주세요.`

3. **길이 제약 위반**
   - 조건: `status=400` + `LENGTH`, `TOO_LONG`, `TOO_SHORT` 포함
   - 메시지: `닉네임은 2~12자 사이여야 해요.`

4. **API 미노출/미지원 fallback**
   - 조건: `status=404|405`
   - 메시지: `아직 닉네임 저장 API가 준비되지 않았어요. 잠시 후 다시 시도하거나 건너뛰어 주세요.`

5. **기타 오류 fallback**
   - 메시지: `닉네임 저장에 실패했어요. 잠시 후 다시 시도하거나 건너뛰어 주세요.`

## 참고
- Swagger: https://s1.takealook.my/webjars/swagger-ui/index.html
- 대상 이슈: https://github.com/takea-look/takealook-webview/issues/95
