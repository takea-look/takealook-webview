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

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Outlet />
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

