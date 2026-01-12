import { Spacing } from '@toss/tds-mobile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        return (
            <div style={{ 
                padding: '0 4vw', 
                backgroundColor: '#fff', 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                maxWidth: '768px',
                margin: '0 auto'
            }}>
                <span style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>로딩 중...</span>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div style={{ 
                padding: '0 4vw', 
                backgroundColor: '#fff', 
                minHeight: '100vh',
                maxWidth: '768px',
                margin: '0 auto'
            }}>
                <div style={{ padding: 'clamp(16px, 4vw, 20px) 0' }}>
                    <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 'bold', margin: 0 }}>내 정보</h1>
                </div>
                <div style={{ textAlign: 'center', paddingTop: 'clamp(30px, 8vw, 40px)' }}>
                    <p style={{ color: '#f04452', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{error || '프로필을 찾을 수 없습니다'}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '0 4vw', 
            backgroundColor: '#fff', 
            minHeight: '100vh',
            maxWidth: '768px',
            margin: '0 auto'
        }}>
            <div style={{ padding: 'clamp(16px, 4vw, 20px) 0' }}>
                <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 'bold', margin: 0 }}>내 정보</h1>
            </div>

            <div style={{ textAlign: 'center', padding: 'clamp(24px, 6vw, 32px) 0' }}>
                <div style={{
                    width: 'clamp(70px, 16vw, 80px)',
                    height: 'clamp(70px, 16vw, 80px)',
                    backgroundColor: '#f2f4f6',
                    borderRadius: '50%',
                    margin: '0 auto clamp(12px, 3vw, 16px)',
                    backgroundImage: profile.image ? `url(${profile.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(28px, 7vw, 32px)'
                }}>
                    {!profile.image && '👤'}
                </div>
                <h2 style={{ 
                    fontSize: 'clamp(18px, 4.5vw, 20px)', 
                    fontWeight: 'bold',
                    margin: 0
                }}>
                    {profile.nickname || profile.username}
                </h2>
                <p style={{ 
                    color: '#4e5968', 
                    marginTop: '4px',
                    fontSize: 'clamp(13px, 3.2vw, 14px)',
                    margin: '4px 0 0 0'
                }}>@{profile.username}</p>
            </div>

            <Spacing size={12} />

            <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '16px', 
                padding: 'clamp(12px, 3vw, 16px)'
            }}>
                <div style={{ 
                    padding: 'clamp(10px, 2.5vw, 12px) 0', 
                    borderBottom: '1px solid #f2f4f6',
                    fontSize: 'clamp(14px, 3.5vw, 15px)',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    개인정보 설정
                </div>
                <div style={{ 
                    padding: 'clamp(10px, 2.5vw, 12px) 0', 
                    borderBottom: '1px solid #f2f4f6',
                    fontSize: 'clamp(14px, 3.5vw, 15px)',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    알림 설정
                </div>
                <div
                    style={{ 
                        padding: 'clamp(10px, 2.5vw, 12px) 0', 
                        cursor: 'pointer', 
                        color: '#f04452',
                        fontSize: 'clamp(14px, 3.5vw, 15px)',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onClick={handleLogout}
                >
                    로그아웃
                </div>
            </div>

            <Spacing size={80} />
        </div>
    );
}
