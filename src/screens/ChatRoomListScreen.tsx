import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListRow, Spacing } from '@toss/tds-mobile';
import { LoadingView } from '../components/LoadingView';
import { Layout } from '../components/Layout';
import { getChatRooms } from '../api/chat';
import type { ChatRoom } from '../types/api';

export function ChatRoomListScreen() {
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                const rooms = await getChatRooms();
                setChatRooms(rooms);
            } catch (err) {
                setError('채팅방 목록을 불러오는데 실패했습니다.');
                console.error('Failed to load chat rooms:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);

    if (loading) {
        return <LoadingView />;
    }

    if (error) {
        return (
            <Layout>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#f04452', fontSize: '15px' }}>{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Spacing size={24} />
            <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#191f28',
                margin: '0 0 24px 0'
            }}>
                채팅
            </h1>

            {chatRooms.length === 0 ? (
                <div style={{ 
                    padding: '60px 0', 
                    textAlign: 'center', 
                    color: '#8b95a1',
                    fontSize: '15px'
                }}>
                    참여 중인 채팅방이 없습니다.
                </div>
            ) : (
                <List>
                    {chatRooms.map(room => (
                        <ListRow
                            key={room.id}
                            as="div"
                            left={
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '20px',
                                    backgroundColor: '#f2f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}>
                                    💬
                                </div>
                            }
                            contents={
                                <ListRow.Texts
                                    type="2RowTypeA"
                                    top={room.name}
                                    topProps={{ 
                                        color: '#333d4b', 
                                        fontWeight: '600',
                                        size: 17
                                    }}
                                    bottom={
                                        <span style={{ color: '#8b95a1', fontSize: '14px' }}>
                                            {room.isPublic ? '공개' : '비공개'} · {room.maxParticipants}명
                                        </span>
                                    }
                                />
                            }
                            right={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M10 17L15 12L10 7" stroke="#b0b8c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            }
                            verticalPadding="medium"
                            onClick={() => navigate(`/room/${room.id}`)}
                            style={{
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                borderRadius: '16px',
                                padding: '12px 0'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        />
                    ))}
                </List>
            )}
        </Layout>
    );
}
