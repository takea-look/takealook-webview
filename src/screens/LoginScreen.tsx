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
            console.error(err);
            setError('토스 로그인에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            backgroundColor: '#fff', 
            minHeight: '100vh', 
            width: '100%',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <main style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '0 24px',
                maxWidth: '480px',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1, paddingTop: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'rgba(49, 130, 246, 0.06)',
                            borderRadius: '26px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="#3182F6"/>
                            </svg>
                        </div>

                        <Spacing size={24} />

                        <h1 style={{ 
                            fontSize: '24px', 
                            fontWeight: 'bold', 
                            lineHeight: '1.4', 
                            wordBreak: 'keep-all',
                            margin: '0',
                            color: '#191f28'
                        }}>
                            떼껄룩에 로그인하세요
                        </h1>

                        <Spacing size={8} />

                        <p style={{ color: '#8b95a1', fontSize: '15px', margin: '0' }}>
                            간편하게 로그인하고 시작해보세요
                        </p>
                    </div>

                    <Spacing size={40} />

                    <button
                        type="button"
                        onClick={handleTossLogin}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: '#0064FF',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            minHeight: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3C6.8 3 3 6.6 3 11.5C3 13.5 3.8 15.3 5.2 16.7L3.6 20.3C3.4 20.7 3.8 21.1 4.2 20.9L7.8 19.3C9.1 19.9 10.5 20.2 12 20.2C17.2 20.2 21 16.6 21 11.7C21 6.8 17.2 3 12 3Z" fill="white"/>
                        </svg>
                        {isLoading ? '로그인 중...' : '토스로 시작하기'}
                    </button>

                    <Spacing size={24} />

                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '0 8px'
                    }}>
                        <div style={{ height: '1px', flex: 1, backgroundColor: '#f2f4f6' }}></div>
                        <span style={{ color: '#b0b8c1', fontSize: '13px' }}>또는</span>
                        <div style={{ height: '1px', flex: 1, backgroundColor: '#f2f4f6' }}></div>
                    </div>

                    <Spacing size={24} />

                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ 
                                display: 'block', 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                color: '#333d4b' 
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
                                    padding: '14px 16px',
                                    fontSize: '15px',
                                    border: '1px solid #e5e8eb',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    minHeight: '48px',
                                    backgroundColor: '#f9fafb'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ 
                                display: 'block', 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                marginBottom: '8px', 
                                color: '#333d4b' 
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
                                    padding: '14px 16px',
                                    fontSize: '15px',
                                    border: '1px solid #e5e8eb',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    minHeight: '48px',
                                    backgroundColor: '#f9fafb'
                                }}
                            />
                        </div>
                        {error && (
                            <p style={{ color: '#f04452', fontSize: '13px', marginTop: '8px' }}>{error}</p>
                        )}
                    </div>
                </div>

                <div style={{ 
                    padding: '24px 0',
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
                            padding: '14px 16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: isLoading ? '#b0c4de' : '#3182f6',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            minHeight: '52px'
                        }}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </div>
            </main>
        </div>
    );
}
