import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TDSMobileProvider } from '@toss/tds-mobile'
import './index.css'
import App from './App.tsx'

const mockUserAgent = {
  fontA11y: undefined,
  fontScale: 1,
  isAndroid: false,
  isIOS: false,
  colorPreference: 'light' as const,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TDSMobileProvider userAgent={mockUserAgent}>
      <App />
    </TDSMobileProvider>
  </StrictMode>,
)
