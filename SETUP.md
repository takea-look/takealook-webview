# TakeALook WebView 설정 가이드

## 📱 앱인토스 WebView 환경 설정 완료

이 프로젝트는 Toss 앱인토스 WebView 환경으로 설정되었습니다.

## 🚀 설치된 패키지

- **@apps-in-toss/web-framework**: Toss 앱인토스 WebView 프레임워크
- **React + TypeScript**: UI 개발
- **Vite**: 빌드 도구 및 개발 서버

## ⚙️ 프로젝트 설정

### granite.config.ts

```typescript
{
  appName: 'takealook',
  brand: {
    displayName: '테이크어룩',
    primaryColor: '#8B5CF6',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
}
```

## 🛠️ 개발 명령어

## 🔐 환경변수 설정 (.env)

이 프로젝트는 API 서버 주소를 `VITE_API_BASE_URL` 환경변수로 설정합니다. (사용처: `src/api/client.ts`)

1. 예시 파일 복사:
```bash
cp .env.example .env
```

2. `.env`에서 API Base URL 설정:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

참고:
- Vite에서 클라이언트에서 쓰는 환경변수는 `VITE_` 접두어가 필요합니다.
- 미설정 시 기본값은 `http://localhost:8080` 입니다.

### 로컬 개발 서버 실행
```bash
npm run dev
```
서버가 `http://localhost:5173/`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```
빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 배포 (정적 호스팅)

`npm run build` 후 생성된 `dist/`를 정적 파일로 서빙하면 됩니다.

참고:
- `VITE_API_BASE_URL`은 빌드 시점에 번들에 포함됩니다. 배포 환경에 맞는 값을 `.env`(또는 CI 환경변수)로 설정한 뒤 빌드하세요.
- 로컬에서 빌드 결과 확인: `npm run preview`

### 실기기에서 테스트하기

실기기에서 테스트하려면 다음과 같이 설정을 변경하세요:

1. **granite.config.ts** 수정:
```typescript
web: {
  host: '192.168.0.100', // 실제 IP 주소로 변경
  port: 5173,
  commands: {
    dev: 'vite --host', // --host 옵션 추가
    build: 'tsc -b && vite build',
  },
}
```

2. 개발 서버 재시작:
```bash
npm run dev
```

## 📱 미니앱 실행하기

### iOS 시뮬레이터에서 실행
1. 샌드박스 앱 설치
2. 개발 서버 실행
3. 샌드박스 앱에서 `intoss://takealook` 접근

### Android 실기기/에뮬레이터에서 실행
1. ADB로 포트 포워딩:
```bash
adb reverse tcp:5173 tcp:5173
```

2. 샌드박스 앱에서 테스트

## 📚 다음 단계

1. **TDS (Toss Design System) 설치** (필수):
```bash
npm install @toss/tds-mobile
```
모든 비게임 WebView 미니앱은 TDS 사용이 필수입니다.

2. **앱 아이콘 설정**:
   - `granite.config.ts`의 `icon` 필드에 이미지 URL 추가

3. **권한 설정**:
   - 필요한 권한을 `permissions` 배열에 추가

## 🔗 참고 문서

- [앱인토스 WebView 튜토리얼](https://developers-apps-in-toss.toss.im/tutorials/webview.html)
- [WebView TDS 가이드](https://tossmini-docs.toss.im/tds-mobile/)
- [앱인토스 개발자센터](https://developers-apps-in-toss.toss.im/)

## 🐛 트러블슈팅

### 플러그인 옵션 오류
`'[Apps In Toss Plugin] 플러그인 옵션이 올바르지 않습니다'` 오류가 발생하면:
- `granite.config.ts`의 `icon` 필드를 `''` (빈 문자열)로 설정

### Cannot set properties of undefined (setting 'dev') 오류
- `package.json`의 `scripts.dev` 필드가 올바르게 설정되어 있는지 확인
