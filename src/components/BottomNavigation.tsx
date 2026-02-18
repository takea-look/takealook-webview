import { Asset, Text } from '@toss/tds-mobile';

interface Props {
    activeTab: 'chats' | 'myinfo';
    onTabChange: (tab: 'chats' | 'myinfo') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: Props) {
    const activeColor = '#191F28';
    const inactiveColor = '#B0B8C1';

    return (
        <div style={{
            position: 'fixed',
            bottom: 'calc(20px + env(safe-area-inset-bottom))',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: '440px',
            backgroundColor: '#FFFFFF',
            borderRadius: '30px',
            padding: '9px',
            boxShadow: '0px 20px 20px -16px rgba(25, 31, 41, 0.07), 0px 40px 200px 0px rgba(25, 31, 41, 0.25)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
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
                    padding: '8px 0'
                }}
            >
                <Asset.Icon 
                    frameShape={Asset.frameShape.CleanW24}
                    name="icon-home-mono"
                    color={activeTab === 'chats' ? activeColor : inactiveColor}
                    aria-hidden={true}
                />
                <Text
                    display="block"
                    color={activeTab === 'chats' ? 'grey900' : 'grey400'}
                    typography="st13"
                    fontWeight="medium"
                    textAlign="center"
                >
                    홈
                </Text>
            </div>

            <div
                onClick={() => onTabChange('myinfo')}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flex: 1,
                    padding: '8px 0'
                }}
            >
                <Asset.Icon 
                    frameShape={Asset.frameShape.CleanW24}
                    name="icon-profile-mono"
                    color={activeTab === 'myinfo' ? activeColor : inactiveColor}
                    aria-hidden={true}
                />
                <Text
                    display="block"
                    color={activeTab === 'myinfo' ? 'grey900' : 'grey400'}
                    typography="st13"
                    fontWeight="medium"
                    textAlign="center"
                >
                    내 정보
                </Text>
            </div>
        </div>
    );
}
