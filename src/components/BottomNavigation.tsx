import { MessageIcon, UserIcon } from './icons';

interface Props {
    activeTab: 'chats' | 'myinfo';
    onTabChange: (tab: 'chats' | 'myinfo') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: Props) {
    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid #F2F4F6',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 1000
        }}>
            <div
                onClick={() => onTabChange('chats')}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flex: 1,
                    gap: '4px',
                    padding: '8px 0',
                    transition: 'transform 0.1s ease'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <MessageIcon size={24} color={activeTab === 'chats' ? '#3182F6' : '#ADB5BD'} />
                <span style={{ 
                    fontSize: '11px', 
                    fontWeight: activeTab === 'chats' ? 600 : 400,
                    color: activeTab === 'chats' ? '#191F28' : '#ADB5BD'
                }}>채팅</span>
            </div>

            <div
                onClick={() => onTabChange('myinfo')}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flex: 1,
                    gap: '4px',
                    padding: '8px 0',
                    transition: 'transform 0.1s ease'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <UserIcon size={24} color={activeTab === 'myinfo' ? '#3182F6' : '#ADB5BD'} />
                <span style={{ 
                    fontSize: '11px', 
                    fontWeight: activeTab === 'myinfo' ? 600 : 400,
                    color: activeTab === 'myinfo' ? '#191F28' : '#ADB5BD'
                }}>내 정보</span>
            </div>
        </div>
    )
}
