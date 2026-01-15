import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing } from '@toss/tds-mobile';
import { signin } from '../api/auth';
import { setAccessToken } from '../api/client';
import type { LoginRequest } from '../types/api';

export function LoginScreen() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            setError('아이디와 비밀번호를 입력해주세요');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            const response = await signin({ username, password } as LoginRequest);
            setAccessToken(response.accessToken);
            navigate('/');
        } catch {
            setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTossLogin = async () => {
        try {
            setIsLoading(true);
            setError('');
            const { appLogin } = await import('@apps-in-toss/web-framework');
            const { authorizationCode, referrer } = await appLogin();
            const { tossSignin } = await import('../api/auth');
            const { setAccessToken, setRefreshToken } = await import('../api/client');
            const response = await tossSignin({ authorizationCode, referrer });
            setAccessToken(response.accessToken);
            if (response.refreshToken) {
                setRefreshToken(response.refreshToken);
            }
            navigate('/');
        } catch (err) {
            setError('토스 로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '3vw 4vw',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f2f4f6'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: 'bold' }}>떼껄룩 : 로그인</span>
                </div>
            </div>

            <main style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '0 5%',
                maxWidth: '480px',
                width: '100%',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1, paddingTop: 'clamp(40px, 10vh, 80px)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: 'clamp(60px, 15vw, 80px)',
                            height: 'clamp(60px, 15vw, 80px)',
                            backgroundColor: '#f2f4f6',
                            borderRadius: '20px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: 'clamp(30px, 8vw, 40px)' }}>📸</span>
                        </div>

                        <Spacing size={32} />

                        <h1 style={{ 
                            fontSize: 'clamp(20px, 5vw, 24px)', 
                            fontWeight: 'bold', 
                            lineHeight: '1.4', 
                            wordBreak: 'keep-all',
                            margin: '0'
                        }}>
                            떼껄룩에 로그인하세요
                        </h1>

                        <Spacing size={12} />

                        <p style={{ color: '#4e5968', fontSize: 'clamp(14px, 3.5vw, 15px)', margin: '0' }}>
                            간편하게 로그인하고 시작해보세요.
                        </p>
                    </div>

                    <Spacing size={48} />

                    <button
                        type="button"
                        onClick={handleTossLogin}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: 'clamp(14px, 3.5vw, 16px) 16px',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: '#0064FF',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            minHeight: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="12" fill="white" fillOpacity="0.3"/>
                            <path d="M12 4C8.4 4 4 6.6 8.8C8.8 12.4 7.6 15.2 6.4 20C6.4 20 4 20 4 19.2 4 17.6 4 17.6 6.8C6.8 15.2 8.8 12.4 8.8 12.4 11.2 8.8 6.4 11.2 4 12 4 6.4C4 3.2 4 4.8C4.8 3.2 6.4 8 8 6.4C8 8 6.4 8 6.4 8.4 12" fill="#fff"/>
                            <path d="M12 16C13.1046 16 14 17.8954 14 17.8954 12 16C10.8954 12 10 11.1046 10 11.1046 12 16 14 16H9.5C9.5 16 8.4 16 8 4 4V4H8V2H2C2 2 4 2 4V6C2 8 12 8 12H4C4 12 8 16 16 17C8 18 15.1046 18 16 13.1046 18 12H12V16C12 14.5 13.5 14 16 17 18H17C17 18 16.5 18 16H17.5C18 14.5 18 14 17V6C17 6 16 5 5 6H13" stroke="#0064FF" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {isLoading ? '로그인 중...' : '토스로 시작하기'}
                    </button>

                    <Spacing size={24} />

                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '0 16px'
                    }}>
                        <div style={{ height: '1px', flex: 1, backgroundColor: '#e5e8eb' }}></div>
                        <span style={{ color: '#b0b8c1', fontSize: 'clamp(14px, 3.5vw, 15px)' }}>또는</span>
                        <div style={{ height: '1px', flex: 1, backgroundColor: '#e5e8eb' }}></div>
                    </div>

                    <Spacing size={16} />

                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ 
                                display: 'block', 
                                fontSize: 'clamp(13px, 3.2vw, 14px)', 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                color: '#191f28' 
                            }}>
                                아이디
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: 'clamp(12px, 3vw, 14px) 16px',
                                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                                    border: '1px solid #e5e8eb',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    minHeight: '44px'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ 
                                display: 'block', 
                                fontSize: 'clamp(13px, 3.2vw, 14px)', 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                color: '#191f28' 
                            }}>
                                비밀번호
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                disabled={isLoading}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        if (!username || !password) {
                                            setError('아이디와 비밀번호를 입력해주세요');
                                            return;
                                        }
                                        handleLogin();
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: 'clamp(12px, 3vw, 14px) 16px',
                                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                                    border: '1px solid #e5e8eb',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    minHeight: '44px'
                                }}
                            />
                        </div>
                        {error && (
                            <p style={{ color: '#f04452', fontSize: 'clamp(13px, 3.2vw, 14px)', marginTop: '8px' }}>{error}</p>
                        )}
                    </div>
                </div>

                <div style={{ 
                    padding: 'clamp(20px, 5vh, 40px) 0',
                    position: 'sticky',
                    bottom: '0',
                    backgroundColor: '#fff'
                }}>
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: 'clamp(14px, 3.5vw, 16px)',
                            fontSize: 'clamp(14px, 3.5vw, 16px)',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: isLoading ? '#b0c4de' : '#3182f6',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            minHeight: '48px'
                        }}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </div>
            </main>
        </div>
    );
}
