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

    return (
        <div style={{ 
            backgroundColor: '#fff', 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
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
                            사진으로 소통하는 즐거운 채팅
                        </p>
                    </div>

                    <Spacing size={48} />

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
