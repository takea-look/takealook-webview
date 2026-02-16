import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginScreen } from './screens/LoginScreen'
import { MainScreen } from './screens/MainScreen'
import { ChatRoomScreen } from './screens/ChatRoomScreen'
import { StoryEditorScreen } from './screens/StoryEditorScreen'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NicknameOnboardingScreen } from './screens/NicknameOnboardingScreen'

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
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding/nickname" element={<NicknameOnboardingScreen />} />
          <Route path="/room/:roomId" element={<ChatRoomScreen />} />
          <Route path="/story-editor" element={<StoryEditorScreen />} />
          <Route path="/*" element={<MainScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
