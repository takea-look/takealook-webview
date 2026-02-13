# 앱스토어 제출 대비: WebView 래퍼 요구사항 (1-page)

> 목적: takealook-webview를 iOS/Android 네이티브(WebView) 래퍼로 감싸서 앱스토어 제출 가능한 수준의 요구사항/리스크를 1페이지로 정리

## 1) 권한 처리 요구사항 (카메라/앨범)
- 카메라 촬영/갤러리 선택이 필요한 화면에서 Web → Native 브릿지로 권한 요청
- 권한 거부/제한 상태에서의 UX
  - 최초 거부: 안내 + 재요청 버튼
  - 영구 거부(iOS 설정): “설정으로 이동” 딥링크 제공
- iOS
  - Info.plist: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`(필요 시 `NSPhotoLibraryAddUsageDescription`)
  - WKWebView에서 `<input type="file" accept="image/*" capture>` 처리를 네이티브 픽커로 매핑
- Android
  - 런타임 권한: `CAMERA`, (SDK/구현에 따라) `READ_MEDIA_IMAGES` 또는 `READ_EXTERNAL_STORAGE`
  - WebChromeClient 파일 chooser 처리

## 2) 외부 로그인/리다이렉트 처리
- 외부 로그인(예: Toss 인증) 플로우에서 발생할 수 있는 케이스
  - 외부 브라우저(Safari/Chrome)로 열기 vs 인앱 브라우저(SFSafariViewController/CustomTabs)
  - 로그인 완료 후 앱 복귀(redirect URI) 처리
- 권장안
  - 가능한 경우 **인앱 브라우저** 사용 + 완료 시 앱으로 돌아오는 딥링크 스킴/Universal Link(App Link) 구성
  - WebView 내부에서만 유지하려면 쿠키/세션 정책(WKHTTPCookieStore, Android CookieManager) 확인

## 3) 푸시 / 딥링크 필요 여부
- 푸시 필요 여부
  - 1차: 필수 아님(스코프 줄이기)
  - 2차: 채팅 알림이 필요하면 FCM/APNS + 알림 클릭 시 특정 채팅방 딥링크로 이동
- 딥링크
  - 최소 요건: `/`(채팅 목록), `/chat/:roomId`, `/myinfo`
  - 포맷 예시
    - `takealook://chat?roomId=123`
    - `https://takealook.my/chat/123` (Universal Link/App Link)

## 4) 심사 리스크 체크리스트
- 로그인
  - 로그인 실패/에러 메시지 명확
  - 개인정보 처리방침/서비스 이용약관 링크 노출(필요 시)
- 파일 업로드/권한
  - 권한 요청 목적 문구(플랫폼 가이드 준수)
  - 권한 거부 상태에서 앱이 깨지지 않음
- 외부 링크
  - 외부 결제/가입 유도 등 정책 위반 요소 확인
- 안정성
  - 네트워크 오류/서버 점검 안내
  - WebView 크래시/무한 로딩 방지(타임아웃/재시도)

## 5) 네이티브 래퍼 작업 범위(요약)
- 필수
  - WebView + 파일 업로드(카메라/앨범) + 권한 UX
  - 외부 로그인 리다이렉트(딥링크/Universal Link/App Link)
  - 기본 에러 처리(네트워크/서버)
- 선택(후순위)
  - 푸시 알림
  - 고급 딥링크 라우팅/캠페인 트래킹

---

## 참고
- iOS Human Interface Guidelines / App Store Review Guidelines
- Android permissions / WebView file chooser 가이드
