# takealook-webview

takealook WebView 프로젝트입니다. **현재 메인은 Flutter(`flutter/`) 기준으로 운영**하며, 기존 React Web 코드는 병행 유지합니다.

## Flutter 메인 개발 (권장)

```bash
cd flutter
flutter pub get
flutter analyze
flutter test
flutter build apk --debug
```

GitHub Actions도 Flutter 기준으로 동작합니다.

## 요구사항

- Node.js 20+
- npm 10+

## 빠른 시작 (로컬 실행)

```bash
# 1) 의존성 설치
npm install

# 2) 환경변수 파일 생성
cp .env.example .env

# 3) 개발 서버 실행
npm run dev
```

기본 개발 서버 주소: <http://localhost:5173>

## 환경변수

클라이언트에서 사용하는 Vite 환경변수는 반드시 `VITE_` 접두어가 필요합니다.

- 사용처: `src/api/client.ts`
- 필수 변수:

```bash
VITE_API_BASE_URL=https://s1.takealook.my
VITE_ENABLE_NICKNAME_UPDATE=true
VITE_REGACY_LOGIN=false
```

`.env`가 없거나 값이 비어있으면 기본값 `https://s1.takealook.my`를 사용합니다. (로컬 서버 테스트 시에는 `http://localhost:8080`로 변경)

`VITE_ENABLE_NICKNAME_UPDATE`는 닉네임 온보딩 활성화 스위치입니다.
- `true`(기본): 닉네임 입력/저장 플로우 활성화
- `false`: 닉네임 저장 UI 대신 "건너뛰고 시작" UX 제공 (백엔드 점검/비활성화 시 사용)

`VITE_REGACY_LOGIN`은 레거시 ID/PW 로그인 UI 토글입니다.
- `true`: 로그인 화면에 ID/PW 입력 폼 노출
- `false`(기본): 토스 로그인만 노출

## 주요 스크립트

```bash
# 개발 서버 (granite)
npm run dev

# 린트
npm run lint

# 프로덕션 빌드 (granite build)
npm run build

# 빌드 결과 미리보기
npm run preview
```

## Dev 서버 주의사항 (granite 404 이슈)

일부 로컬 환경에서 `npm run dev`(granite dev) 실행 시 루트(`/`)가 404를 반환할 수 있습니다.

이 경우 임시 워크어라운드로 Vite를 직접 실행하세요.

```bash
npx vite --host 0.0.0.0 --port 5173
```

접속 예시:
- 로컬: `http://localhost:5173/`
- 네트워크: `http://<내-IP>:5173/`
- Tailscale: `http://<tailscale-ip>:5173/`

## 배포

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.

> 참고: `VITE_API_BASE_URL`은 **빌드 시점**에 번들에 포함됩니다. 배포 환경별로 `.env`(또는 CI 환경변수)를 분리하세요.

## 자주 발생하는 문제 (FAQ)

### 1) API 호출이 전부 실패해요

- `VITE_API_BASE_URL` 값이 올바른지 확인
- 백엔드 서버가 실행 중인지 확인
- 브라우저 콘솔/네트워크 탭에서 CORS 및 401/403 응답 확인

### 2) `npm run build`는 되는데 API가 로컬 주소로 호출돼요

- 빌드 전에 `.env` 값을 원하는 배포 주소로 바꿨는지 확인
- 이미 빌드된 산출물은 `.env`를 바꿔도 반영되지 않음 → 다시 빌드 필요

### 3) `npm run build`에서 큰 chunk 경고가 떠요

- 현재는 경고이며 빌드는 성공할 수 있음
- 필요 시 코드 스플리팅(`dynamic import`) 및 `manualChunks` 적용으로 개선

## 품질 확인 체크리스트

PR 전에 아래를 반드시 실행하세요.

```bash
npm run lint
npm run build
```

## 문서

- E2E 테스트 플랜: `docs/E2E_TEST_PLAN.md`
- 백로그 문서: `docs/OPEN_ISSUE_BACKLOG.md`
- (중요) placeholder 이슈 자동 생성 bot 관련: `docs/BOT_AUTOMATION.md`
