import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

export function TabShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab: 'chats' | 'myinfo' =
    location.pathname.startsWith('/mypage') || location.pathname.startsWith('/myinfo') ? 'myinfo' : 'chats';

  const handleTabChange = (tab: 'chats' | 'myinfo') => {
    navigate(tab === 'myinfo' ? '/mypage' : '/chat', { replace: true });
  };

  // Keep enough space so content (including bottom sheets) doesn't get covered by the fixed bottom navigation.
  // Matches BottomNavigation visual footprint: 20px(bottom) + 9px(padding) + ~48px(content) + 9px(padding) ≈ 86px.
  const bottomNavSafeSpacePx = 96;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#fff',
        paddingBottom: `calc(${bottomNavSafeSpacePx}px + env(safe-area-inset-bottom))`,
        boxSizing: 'border-box',
      }}
    >
      <Outlet />
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

