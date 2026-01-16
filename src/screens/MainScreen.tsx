import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatRoomListScreen } from './ChatRoomListScreen';
import { MyInfoScreen } from './MyInfoScreen';
import { BottomNavigation } from '../components/BottomNavigation';

export function MainScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'chats' | 'myinfo'>('chats');

    useEffect(() => {
        if (location.pathname === '/myinfo') {
            setActiveTab('myinfo');
        } else {
            setActiveTab('chats');
        }
    }, [location.pathname]);

    const handleTabChange = (tab: 'chats' | 'myinfo') => {
        setActiveTab(tab);
        navigate(tab === 'myinfo' ? '/myinfo' : '/', { replace: true });
    };

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            minHeight: '100vh',
            backgroundColor: '#fff'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateAreas: '"content"',
                width: '100%'
            }}>
                <div style={{
                    gridArea: 'content',
                    opacity: activeTab === 'chats' ? 1 : 0,
                    pointerEvents: activeTab === 'chats' ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease-in-out',
                    zIndex: activeTab === 'chats' ? 1 : 0,
                    backgroundColor: '#fff',
                    width: '100%'
                }}>
                    <ChatRoomListScreen />
                </div>

                <div style={{
                    gridArea: 'content',
                    opacity: activeTab === 'myinfo' ? 1 : 0,
                    pointerEvents: activeTab === 'myinfo' ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease-in-out',
                    zIndex: activeTab === 'myinfo' ? 1 : 0,
                    backgroundColor: '#fff',
                    width: '100%'
                }}>
                    <MyInfoScreen />
                </div>
            </div>

            <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
    );
}
