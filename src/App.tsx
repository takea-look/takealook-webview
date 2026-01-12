import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LoginScreen } from './screens/LoginScreen'
import { ChatRoomListScreen } from './screens/ChatRoomListScreen'
import { ChatRoomScreen } from './screens/ChatRoomScreen'
import { MyInfoScreen } from './screens/MyInfoScreen'
import { BottomNavigation } from './components/BottomNavigation'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  const location = useLocation()
  const showBottomNav = location.pathname === '/' || location.pathname === '/myinfo'

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatRoomListScreen />} />
          <Route path="/room/:roomId" element={<ChatRoomScreen />} />
          <Route path="/myinfo" element={<MyInfoScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showBottomNav && (
        <BottomNavigation
          activeTab={location.pathname === '/myinfo' ? 'myinfo' : 'chats'}
          onTabChange={(tab) => {
            if (tab === 'myinfo') {
              window.location.href = '/myinfo'
            } else {
              window.location.href = '/'
            }
          }}
        />
      )}
    </div>
  )
}

export default App
