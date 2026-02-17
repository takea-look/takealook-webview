import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing } from '@toss/tds-mobile';
import { LoadingView } from '../components/LoadingView';
import { Layout } from '../components/Layout';
import { getMyProfile } from '../api/user';
import { clearAccessToken } from '../api/client';
import type { UserProfile } from '../types/api';

export function MyInfoScreen() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleLogout = () => {
        clearAccessToken();
        navigate('/login');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getMyProfile();
                setProfile(data);
            } catch (err) {
                setError('프로필을 불러오는데 실패했습니다.');
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <LoadingView />;
    }

    if (error || !profile) {
        return (
            <Layout>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#f04452' }}>{error || '프로필을 찾을 수 없습니다'}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Spacing size={24} />
            <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#191f28', 
                margin: '0 0 32px 0' 
            }}>
                내 정보
            </h1>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginBottom: '40px'
            }}>
                <div style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '36px',
                    backgroundColor: '#f2f4f6',
                    marginBottom: '16px',
                    backgroundImage: profile.image ? `url(${profile.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.04)'
                }}>
                    {!profile.image && '👤'}
                </div>
                <h2 style={{ 
                    fontSize: '22px', 
                    fontWeight: 'bold', 
                    color: '#191f28',
                    margin: '0 0 6px 0'
                }}>
                    {profile.nickname || profile.username}
                </h2>
                <p style={{ 
                    fontSize: '15px', 
                    color: '#8b95a1', 
                    margin: 0 
                }}>
                    @{profile.username}
                </p>
            </div>

            <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '20px',
                overflow: 'hidden'
            }}>
                <MenuItem text="개인정보 설정" onClick={() => navigate('/settings')} />
                <MenuItem text="알림 설정" />
                <MenuItem text="스토리 편집기 (MVP)" onClick={() => navigate('/story-editor')} />
                <MenuItem text="로그아웃" isDestructive onClick={handleLogout} />
            </div>
        </Layout>
    );
}

function MenuItem({ text, isDestructive = false, onClick }: { text: string, isDestructive?: boolean, onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            style={{
                padding: '18px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: isDestructive ? '#f04452' : '#333d4b',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f2f4f6',
                backgroundColor: '#f9fafb'
            }}
            onMouseEnter={(e) => {
                if (onClick) e.currentTarget.style.backgroundColor = '#f2f4f6';
            }}
            onMouseLeave={(e) => {
                if (onClick) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
        >
            {text}
            {onClick && !isDestructive && (
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M10 17L15 12L10 7" stroke="#b0b8c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    );
}
