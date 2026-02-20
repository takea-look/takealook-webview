import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spacing } from '@toss/tds-mobile';
import { getAccessToken } from '../api/client';

const ENABLE_IDPW_LOGIN = import.meta.env.VITE_REGACY_LOGIN === 'true';

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const nextPath = useMemo(() => {
    return query.get('next') || '/';
  }, [query]);

  const snsCallbackParams = useMemo(() => {
    const provider = query.get('provider') || '';
    const authorizationCode = query.get('authorizationCode') || '';
    const referrer = query.get('referrer') || undefined;

    if (!provider || !authorizationCode) return null;
    return { provider, authorizationCode, referrer };
  }, [query]);

  useEffect(() => {
    // If this is an SNS callback, handle callback first (do not short-circuit to redirect).
    if (snsCallbackParams) return;
    if (!getAccessToken()) return;

    // Already authenticated users should never land on /login.
    const safeNext = nextPath.startsWith('/login') ? '/' : nextPath;
    navigate(safeNext, { replace: true });
  }, [navigate, nextPath, snsCallbackParams]);

  useEffect(() => {
    if (!snsCallbackParams) return;

    let cancelled = false;

    const run = async () => {
      try {
        setIsTossLoading(true);
        setError('');

        const { providerSignin } = await import('../api/auth');
        const { setAccessToken, setRefreshToken } = await import('../api/client');

        const response = await providerSignin(snsCallbackParams.provider, {
          authorizationCode: snsCallbackParams.authorizationCode,
          referrer: snsCallbackParams.referrer,
        });

        if (cancelled) return;
        if (!response?.accessToken) {
          throw new Error('Missing accessToken in signin response');
        }

        setAccessToken(response.accessToken);
        if (response.refreshToken) {
          setRefreshToken(response.refreshToken);
        }

        const safeNext = nextPath.startsWith('/login') ? '/' : nextPath;
        navigate(safeNext, { replace: true });
      } catch {
        if (cancelled) return;
        setError('SNS 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        if (!cancelled) {
          setIsTossLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [navigate, nextPath, snsCallbackParams]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isIdPwLoading, setIsIdPwLoading] = useState(false);
  const [isTossLoading, setIsTossLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdPwLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsIdPwLoading(true);
      setError('');
      const { signin } = await import('../api/auth');
      const { setAccessToken, setRefreshToken } = await import('../api/client');
      const response = await signin({ username: username.trim(), password });

      setAccessToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      navigate(nextPath, { replace: true });
    } catch {
      setError('아이디/비밀번호 로그인에 실패했습니다.');
    } finally {
      setIsIdPwLoading(false);
    }
  };

  const handleTossLogin = async () => {
    try {
      setIsTossLoading(true);
      setError('');
      const { appLogin } = await import('@apps-in-toss/web-framework');
      const { authorizationCode, referrer } = await appLogin();

      const { providerSignin } = await import('../api/auth');
      const { setAccessToken, setRefreshToken } = await import('../api/client');

      const response = await providerSignin('toss', { authorizationCode, referrer });
      if (!response?.accessToken) {
        throw new Error('Missing accessToken in toss signin response');
      }
      setAccessToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      navigate(nextPath, { replace: true });
    } catch {
      setError('SNS 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsTossLoading(false);
    }
  };

  const isLoading = isIdPwLoading || isTossLoading;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '0 24px',
          maxWidth: '480px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ flex: 1, paddingTop: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(49, 130, 246, 0.06)',
                borderRadius: '26px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                  fill="#3182F6"
                />
              </svg>
            </div>

            <Spacing size={24} />

            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '1.4',
                wordBreak: 'keep-all',
                margin: '0',
                color: '#191f28',
              }}
            >
              떼껄룩에 로그인하세요
            </h1>

            <Spacing size={8} />

            <p style={{ color: '#8b95a1', fontSize: '15px', margin: '0' }}>SNS로 로그인할 수 있어요</p>
          </div>

          <Spacing size={32} />

          {ENABLE_IDPW_LOGIN && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '18px',
                  border: '1px solid #F2F4F6',
                  borderRadius: '16px',
                  background: '#FCFCFD',
                }}
              >
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디"
                  autoComplete="username"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                    border: '1px solid #E5E8EB',
                    background: '#fff',
                    padding: '12px 14px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#191F28',
                  }}
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      void handleIdPwLogin();
                    }
                  }}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                    border: '1px solid #E5E8EB',
                    background: '#fff',
                    padding: '12px 14px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#191F28',
                  }}
                />

                <button
                  type="button"
                  onClick={() => void handleIdPwLogin()}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#fff',
                    backgroundColor: '#191F28',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    minHeight: '46px',
                    marginTop: '2px',
                  }}
                >
                  {isIdPwLoading ? '로그인 중...' : 'ID/PW로 로그인'}
                </button>
              </div>

              <Spacing size={20} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: '#F2F4F6' }} />
                <span style={{ fontSize: '12px', color: '#8B95A1' }}>또는</span>
                <div style={{ flex: 1, height: '1px', background: '#F2F4F6' }} />
              </div>

              <Spacing size={20} />
            </>
          )}

          <button
            type="button"
            onClick={() => void handleTossLogin()}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              fontWeight: 600,
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
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 3C6.8 3 3 6.6 3 11.5C3 13.5 3.8 15.3 5.2 16.7L3.6 20.3C3.4 20.7 3.8 21.1 4.2 20.9L7.8 19.3C9.1 19.9 10.5 20.2 12 20.2C17.2 20.2 21 16.6 21 11.7C21 6.8 17.2 3 12 3Z"
                fill="white"
              />
            </svg>
            {isTossLoading ? '로그인 중...' : '토스로 시작하기'}
          </button>

          {error && <p style={{ color: '#f04452', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>{error}</p>}
        </div>
      </main>
    </div>
  );
}
