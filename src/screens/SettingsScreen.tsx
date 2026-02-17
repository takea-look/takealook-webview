import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'dev';
const BUILD_ID = import.meta.env.VITE_BUILD_ID || 'local';

export function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div style={{ paddingTop: '16px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ border: 'none', background: 'transparent', color: '#3182F6', fontWeight: 700, cursor: 'pointer' }}
        >
          ← 뒤로
        </button>

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#191f28', margin: '16px 0 20px 0' }}>
          설정
        </h1>

        <div style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '16px' }}>
          <div style={{ fontSize: '14px', color: '#6B7684', marginBottom: '6px' }}>앱 버전</div>
          <div style={{ fontSize: '16px', color: '#191F28', fontWeight: 600 }}>v{APP_VERSION}</div>

          <div style={{ height: '1px', background: '#E5E8EB', margin: '14px 0' }} />

          <div style={{ fontSize: '14px', color: '#6B7684', marginBottom: '6px' }}>빌드</div>
          <div style={{ fontSize: '16px', color: '#191F28', fontWeight: 600 }}>{BUILD_ID}</div>
        </div>

        <div style={{ marginTop: '16px', backgroundColor: '#f9fafb', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="https://takealook.my/privacy" target="_blank" rel="noreferrer" style={{ color: '#3182F6', fontWeight: 600 }}>
            개인정보처리방침
          </a>
          <a href="https://takealook.my/terms" target="_blank" rel="noreferrer" style={{ color: '#3182F6', fontWeight: 600 }}>
            이용약관
          </a>
        </div>
      </div>
    </Layout>
  );
}
