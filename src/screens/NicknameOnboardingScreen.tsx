import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Text } from '@toss/tds-mobile';
import { Layout } from '../components/Layout';
import { LoadingView } from '../components/LoadingView';
import { getMyProfile, updateMyNickname } from '../api/user';
import { isApiError } from '../api/client';

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 12;
const NICKNAME_UPDATE_ENABLED = import.meta.env.VITE_ENABLE_NICKNAME_UPDATE === 'true';

function validateNickname(nickname: string): string | null {
  const trimmed = nickname.trim();
  if (trimmed.length < NICKNAME_MIN) return `닉네임은 ${NICKNAME_MIN}자 이상이어야 해요.`;
  if (trimmed.length > NICKNAME_MAX) return `닉네임은 ${NICKNAME_MAX}자 이하여야 해요.`;
  // Basic allowed chars: Korean/English/numbers/underscore
  if (!/^[0-9A-Za-z가-힣_]+$/.test(trimmed)) return '한글/영문/숫자/_ 만 사용할 수 있어요.';
  return null;
}

function mapNicknameUpdateError(error: unknown): string {
  const fallback = '닉네임 저장에 실패했어요. 잠시 후 다시 시도하거나 건너뛰어 주세요.';

  if (!isApiError(error)) {
    return fallback;
  }

  const normalized = `${error.code ?? ''} ${error.message}`.toUpperCase();

  if (error.status === 409 || normalized.includes('DUPLICATE') || normalized.includes('ALREADY')) {
    return '이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해주세요.';
  }

  if (error.status === 400 && (normalized.includes('BANNED') || normalized.includes('FORBIDDEN_WORD') || normalized.includes('PROFANITY'))) {
    return '사용할 수 없는 단어가 포함되어 있어요. 다른 닉네임을 입력해주세요.';
  }

  if (error.status === 400 && (normalized.includes('LENGTH') || normalized.includes('TOO_LONG') || normalized.includes('TOO_SHORT'))) {
    return `닉네임은 ${NICKNAME_MIN}~${NICKNAME_MAX}자 사이여야 해요.`;
  }

  if (error.status === 404 || error.status === 405) {
    return '아직 닉네임 저장 API가 준비되지 않았어요. 잠시 후 다시 시도하거나 건너뛰어 주세요.';
  }

  return fallback;
}

export function NicknameOnboardingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get('next') || '/';
  }, [location.search]);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const profile = await getMyProfile();
        if (profile.nickname) {
          navigate(nextPath, { replace: true });
          return;
        }
        setNickname('');
      } catch (e) {
        console.error(e);
        setToast('프로필을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate, nextPath]);

  const submit = useCallback(async () => {
    if (!NICKNAME_UPDATE_ENABLED) {
      navigate(nextPath, { replace: true });
      return;
    }

    const trimmed = nickname.trim();
    const validationError = validateNickname(trimmed);
    setError(validationError);
    if (validationError) return;

    try {
      setSubmitting(true);
      setError(null);
      await updateMyNickname(trimmed);
      setToast('닉네임이 저장됐어요.');
      navigate(nextPath, { replace: true });
    } catch (e) {
      console.error(e);
      const mappedMessage = mapNicknameUpdateError(e);
      setError(mappedMessage);
      setToast(mappedMessage);
    } finally {
      setSubmitting(false);
    }
  }, [nickname, navigate, nextPath]);

  if (loading) return <LoadingView />;

  return (
    <Layout>
      <div style={{ paddingTop: '28px' }}>
        <Text display="block" color="grey900" typography="st13" fontWeight="bold">
          닉네임을 설정해주세요
        </Text>
        <Text display="block" color="grey600" typography="st13" style={{ marginTop: '8px' } as React.CSSProperties}>
          {NICKNAME_UPDATE_ENABLED
            ? '최초 1회 설정 후 변경이 제한될 수 있어요.'
            : '현재 서버 점검으로 닉네임 저장이 잠시 비활성화되어 있어요. 일단 건너뛰고 시작할 수 있어요.'}
        </Text>

        {NICKNAME_UPDATE_ENABLED && (
          <div style={{ marginTop: '18px' }}>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 (2~12자)"
              autoComplete="off"
              inputMode="text"
              style={{
                width: '100%',
                padding: '14px 14px',
                borderRadius: '12px',
                border: error ? '1px solid #f04452' : '1px solid #E5E8EB',
                outline: 'none',
                fontSize: '14px',
                color: '#191F28',
              }}
            />
            {error && (
              <div style={{ marginTop: '8px' }}>
                <Text display="block" color="red500" typography="st13">
                  {error}
                </Text>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button
            display="full"
            size="large"
            color="primary"
            variant="fill"
            loading={submitting}
            onClick={submit}
          >
            {NICKNAME_UPDATE_ENABLED ? '저장하고 시작하기' : '건너뛰고 시작하기'}
          </Button>
          {NICKNAME_UPDATE_ENABLED && (
            <Button
              display="full"
              size="large"
              color="primary"
              variant="weak"
              disabled={submitting}
              onClick={() => navigate(nextPath, { replace: true })}
            >
              나중에 할게요
            </Button>
          )}
        </div>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'fixed',
              left: '50%',
              bottom: 'max(18px, env(safe-area-inset-bottom))',
              transform: 'translateX(-50%)',
              zIndex: 300,
              background: 'rgba(25, 31, 40, 0.92)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              maxWidth: 'min(520px, calc(100% - 32px))',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {toast}
          </div>
        )}
      </div>
    </Layout>
  );
}
