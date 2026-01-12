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
            borderTop: '1px solid #f2f4f6',
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
                    color: activeTab === 'chats' ? '#191f28' : '#adb5bd'
                }}
            >
                <span style={{ fontSize: '24px' }}>💬</span>
                <span style={{ fontSize: '12px', fontWeight: activeTab === 'chats' ? '600' : '400', marginTop: '2px' }}>채팅</span>
            </div>

            <div
                onClick={() => onTabChange('myinfo')}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flex: 1,
                    color: activeTab === 'myinfo' ? '#191f28' : '#adb5bd'
                }}
            >
                <span style={{ fontSize: '24px' }}>👤</span>
                <span style={{ fontSize: '12px', fontWeight: activeTab === 'myinfo' ? '600' : '400', marginTop: '2px' }}>내 정보</span>
            </div>
        </div>
    )
}
