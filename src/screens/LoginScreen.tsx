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
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f2f4f6'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>떼껄룩 : 로그인</span>
                </div>
            </div>

            <main style={{ padding: '0 24px' }}>
                <Spacing size={60} />

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#f2f4f6',
                        borderRadius: '20px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '40px' }}>📸</span>
                    </div>

                    <Spacing size={32} />

                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.4', wordBreak: 'keep-all' }}>
                        떼껄룩에 로그인하세요
                    </h1>

                    <Spacing size={12} />

                    <p style={{ color: '#4e5968', fontSize: '15px' }}>
                        사진으로 소통하는 즐거운 채팅
                    </p>
                </div>

                <Spacing size={48} />

                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#191f28' }}>
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
                                fontSize: '16px',
                                border: '1px solid #e5e8eb',
                                borderRadius: '8px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#191f28' }}>
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
                                padding: '14px 16px',
                                fontSize: '16px',
                                border: '1px solid #e5e8eb',
                                borderRadius: '8px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    {error && (
                        <p style={{ color: '#f04452', fontSize: '14px', marginTop: '8px' }}>{error}</p>
                    )}
                </div>

                <div style={{ position: 'fixed', bottom: '40px', left: '24px', right: '24px' }}>
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: isLoading ? '#b0c4de' : '#3182f6',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </div>
            </main>
        </div>
    );
}
