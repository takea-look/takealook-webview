import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spacing } from '@toss/tds-mobile';
import { signinWithProvider, type SNSProvider } from '../api/auth';
import { setAccessToken, setRefreshToken } from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://s1.takealook.my';

const POST_LOGIN_NEXT_KEY = 'takealook_post_login_next';

const PROVIDERS: Array<{ key: SNSProvider; label: string; background: string; color: string }> = [
  { key: 'google', label: 'Google로 시작하기', background: '#FFFFFF', color: '#191F28' },
  { key: 'apple', label: 'Apple로 시작하기', background: '#191F28', color: '#FFFFFF' },
  { key: 'kakao', label: 'Kakao로 시작하기', background: '#FEE500', color: '#191F28' },
];

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const callbackPayload = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const provider = params.get('provider') as SNSProvider | null;
    const authorizationCode = params.get('authorizationCode');
    const referrer = params.get('referrer') || 'DEFAULT';
    const next = params.get('next') || '/';

    if (!provider || !authorizationCode) return null;
    if (!PROVIDERS.some((item) => item.key === provider)) return null;

    return { provider, authorizationCode, referrer, next };
  }, [location.search]);

  useEffect(() => {
    const runCallback = async () => {
      if (!callbackPayload) return;

      try {
        setIsLoading(true);
        setError('');
        const response = await signinWithProvider(callbackPayload.provider, {
          authorizationCode: callbackPayload.authorizationCode,
          referrer: callbackPayload.referrer,
        });

        setAccessToken(response.accessToken);
        if (response.refreshToken) {
          setRefreshToken(response.refreshToken);
        }

        const storedNext = window.localStorage.getItem(POST_LOGIN_NEXT_KEY);
        window.localStorage.removeItem(POST_LOGIN_NEXT_KEY);
        navigate(storedNext || callbackPayload.next || '/', { replace: true });
      } catch (err) {
        console.error(err);
        setError('SNS 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    void runCallback();
  }, [callbackPayload, navigate]);

  const startProviderLogin = (provider: SNSProvider) => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next') || '/';
    window.localStorage.setItem(POST_LOGIN_NEXT_KEY, next);

    const redirectUri = `${window.location.origin}/login?next=${encodeURIComponent(next)}`;
    const authUrl = `${API_BASE_URL}/auth/${provider}/authorize?redirectUri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

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

            <p style={{ color: '#8b95a1', fontSize: '15px', margin: '0' }}>
              Google / Apple / Kakao 계정으로 로그인할 수 있어요
            </p>
          </div>

          <Spacing size={32} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PROVIDERS.map((provider) => (
              <button
                key={provider.key}
                type="button"
                onClick={() => startProviderLogin(provider.key)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: provider.color,
                  backgroundColor: provider.background,
                  border: provider.key === 'google' ? '1px solid #E5E8EB' : 'none',
                  borderRadius: '12px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  minHeight: '48px',
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {provider.label}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: '#f04452', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>{error}</p>
          )}
        </div>
      </main>
    </div>
  );
}
