import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing } from '@toss/tds-mobile';
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
        return (
            <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={{ padding: '20px 0' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>채팅</h1>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <p style={{ color: '#8b95a1' }}>로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={{ padding: '20px 0' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>채팅</h1>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <p style={{ color: '#f04452' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (chatRooms.length === 0) {
        return (
            <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={{ padding: '20px 0' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>채팅</h1>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <p style={{ color: '#8b95a1' }}>참여 중인 채팅방이 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 16px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ padding: '20px 0' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>채팅</h1>
            </div>

            <div>
                {chatRooms.map(room => (
                    <div
                        key={room.id}
                        onClick={() => navigate(`/room/${room.id}`)}
                        style={{
                            display: 'flex',
                            padding: '16px 0',
                            borderBottom: '1px solid #f2f4f6',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#f2f4f6',
                            borderRadius: '16px',
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            💬
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold' }}>{room.name}</span>
                                <span style={{ fontSize: '13px', color: '#8b95a1' }}>
                                    {new Date(room.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ fontSize: '14px', color: '#4e5968' }}>
                                {room.isPublic ? '공개' : '비공개'} · 최대 {room.maxParticipants}명
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Spacing size={80} />
        </div>
    );
}
