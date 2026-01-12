# TDS (Toss Design System) 설치 가이드

## ✅ 설치 완료!

TDS Mobile이 성공적으로 설치되고 설정되었습니다.

## 📦 설치된 패키지

```json
{
  "@toss/tds-mobile": "^2.2.0",
  "@toss/tds-mobile-ait": "^2.2.0",
  "@emotion/react": "^11.14.0"
}
```

**참고**: React 19와의 호환성 문제로 `--legacy-peer-deps` 플래그를 사용하여 설치했습니다.

## ⚙️ 설정

### 1. Provider 설정 (`src/main.tsx`)

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TDSMobileAITProvider>
      <App />
    </TDSMobileAITProvider>
  </StrictMode>,
)
```

### 2. 컴포넌트 사용 예제

```typescript
import { Button } from '@toss/tds-mobile'

function App() {
  return (
    <div>
      <Button color="primary" variant="fill" size="large">
        클릭하세요
      </Button>
    </div>
  )
}
```

## 🎨 주요 컴포넌트

### Button

TDS Mobile의 Button 컴포넌트는 다음과 같은 속성을 지원합니다:

#### Color (색상)
- `primary` - 주요 액션 (파란색)
- `dark` - 어두운 배경
- `danger` - 위험한 액션 (빨간색)
- `light` - 밝은 배경

#### Variant (스타일)
- `fill` - 채도가 높은 강렬한 디자인 (주요 액션용)
- `weak` - 채도가 낮은 부드러운 디자인 (보조 액션용)

#### Size (크기)
- `small` - 작은 크기
- `medium` - 중간 크기
- `large` - 큰 크기
- `xlarge` - 매우 큰 크기

#### Display (형태)
- `inline` - 다른 요소와 나란히 배치
- `block` - 줄바꿈되어 화면 너비에 맞게 확장
- `full` - 부모 요소의 전체 너비 차지

#### 기타 속성
- `loading` - 로딩 상태 표시
- `disabled` - 비활성화 상태

### 사용 예제

```typescript
// Primary Fill Button
<Button color="primary" variant="fill" size="large" display="full">
  Primary Button
</Button>

// Dark Weak Button
<Button color="dark" variant="weak" size="medium">
  Dark Weak
</Button>

// Loading Button
<Button color="primary" variant="fill" loading={true}>
  로딩 중...
</Button>

// Disabled Button
<Button color="danger" variant="fill" disabled>
  비활성화
</Button>
```

## 🚀 데모 앱

현재 `src/App.tsx`에는 다음과 같은 TDS 컴포넌트 데모가 포함되어 있습니다:

1. **카운터 예제** - 증가/감소 버튼과 초기화 버튼
2. **버튼 색상 (Fill Variant)** - Primary, Dark, Danger 색상
3. **버튼 색상 (Weak Variant)** - 부드러운 스타일
4. **버튼 크기** - Small, Medium, Large, XLarge
5. **로딩 & 비활성화** - 비동기 작업과 비활성화 상태

## 📚 참고 문서

- [TDS Mobile 공식 문서](https://tossmini-docs.toss.im/tds-mobile/)
- [Button 컴포넌트 가이드](https://tossmini-docs.toss.im/tds-mobile/components/button/)
- [시작하기](https://tossmini-docs.toss.im/tds-mobile/start/)

## 🔧 추가 컴포넌트

TDS Mobile은 Button 외에도 다양한 컴포넌트를 제공합니다:

- TextField (입력 필드)
- Checkbox (체크박스)
- Radio (라디오 버튼)
- Switch (스위치)
- Modal (모달)
- Toast (토스트 알림)
- 그 외 다수...

각 컴포넌트의 사용법은 [공식 문서](https://tossmini-docs.toss.im/tds-mobile/)를 참고하세요.

## ⚠️ 주의사항

1. **React 버전**: TDS Mobile은 React 16.8.3, 17, 18을 공식 지원합니다. React 19를 사용하는 경우 `--legacy-peer-deps`로 설치해야 합니다.

2. **필수 Provider**: 모든 TDS 컴포넌트는 `TDSMobileAITProvider`로 감싸져야 합니다.

3. **검수 필수**: 모든 비게임 WebView 미니앱은 TDS 사용이 필수이며, 검수 승인 기준에 포함됩니다.

## 🎯 다음 단계

1. 더 많은 TDS 컴포넌트 탐색
2. 앱에 맞는 UI 디자인 구현
3. granite.config.ts에서 primaryColor 설정 조정
4. 실기기에서 테스트
