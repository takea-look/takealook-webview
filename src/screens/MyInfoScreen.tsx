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
            <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>로딩 중...</span>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={{ padding: '20px 0' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>내 정보</h1>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <p style={{ color: '#f04452' }}>{error || '프로필을 찾을 수 없습니다'}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ padding: '20px 0' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>내 정보</h1>
            </div>

            <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f2f4f6',
                    borderRadius: '40px',
                    margin: '0 auto 16px',
                    backgroundImage: profile.image ? `url(${profile.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                }}>
                    {!profile.image && '👤'}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {profile.nickname || profile.username}
                </h2>
                <p style={{ color: '#4e5968', marginTop: '4px' }}>@{profile.username}</p>
            </div>

            <Spacing size={12} />

            <div style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '16px' }}>
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f2f4f6' }}>
                    개인정보 설정
                </div>
                <div style={{ padding: '12px 0', borderBottom: '1px solid #f2f4f6' }}>
                    알림 설정
                </div>
                <div
                    style={{ padding: '12px 0', cursor: 'pointer', color: '#f04452' }}
                    onClick={handleLogout}
                >
                    로그아웃
                </div>
            </div>

            <Spacing size={80} />
        </div>
    );
}
