import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { LoginScreen } from './screens/LoginScreen'
import { MainScreen } from './screens/MainScreen'
import { ChatRoomScreen } from './screens/ChatRoomScreen'
import { StoryEditorScreen } from './screens/StoryEditorScreen'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NicknameOnboardingScreen } from './screens/NicknameOnboardingScreen'
import { SettingsScreen } from './screens/SettingsScreen'

type DeepLinkPayload = {
  type?: 'deeplink'
  path?: string
  roomId?: number | string
  messageId?: number | string
}

function resolveDeepLinkTarget(payload: DeepLinkPayload): string | null {
  if (payload.path && payload.path.startsWith('/')) {
    return payload.path
  }

  if (payload.roomId != null) {
    const roomPath = `/room/${payload.roomId}`
    if (payload.messageId != null) {
      return `${roomPath}?messageId=${payload.messageId}`
    }
    return roomPath
  }

  return null
}

function DeepLinkBridge() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleDeepLinkMessage = (event: MessageEvent) => {
      const data = event.data as DeepLinkPayload | undefined
      if (!data || data.type !== 'deeplink') return

      const target = resolveDeepLinkTarget(data)
      if (!target) return

      navigate(target)
    }

    window.addEventListener('message', handleDeepLinkMessage)

    return () => {
      window.removeEventListener('message', handleDeepLinkMessage)
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>
      <DeepLinkBridge />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/nickname" element={<NicknameOnboardingScreen />} />
          <Route path="/room/:roomId" element={<ChatRoomScreen />} />
          <Route path="/story-editor" element={<StoryEditorScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/*" element={<MainScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
