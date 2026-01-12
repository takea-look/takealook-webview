import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'takealook',
  brand: {
    displayName: '테이크어룩', // 화면에 노출될 앱의 한글 이름
    primaryColor: '#8B5CF6', // 앱의 기본 색상 (보라색)
    icon: '', // 화면에 노출될 앱의 아이콘 이미지 주소
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
});
