import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing } from '@toss/tds-mobile';
import { getChatRooms } from '../api/chat';
import type { ChatRoom } from '../types/api';
import { MessageIcon } from '../components/icons';

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
            <div style={{ 
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #F2F4F6',
                    zIndex: 10
                }}>
                    <div style={{
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        maxWidth: '768px',
                        margin: '0 auto',
                        width: '100%'
                    }}>
                        <h1 style={{ 
                            fontSize: '17px', 
                            fontWeight: 700, 
                            margin: 0,
                            color: '#191F28'
                        }}>채팅</h1>
                    </div>
                </div>
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 20px'
                }}>
                    <p style={{ 
                        color: '#8B95A1', 
                        fontSize: '15px',
                        margin: 0
                    }}>로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #F2F4F6',
                    zIndex: 10
                }}>
                    <div style={{
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        maxWidth: '768px',
                        margin: '0 auto',
                        width: '100%'
                    }}>
                        <h1 style={{ 
                            fontSize: '17px', 
                            fontWeight: 700, 
                            margin: 0,
                            color: '#191F28'
                        }}>채팅</h1>
                    </div>
                </div>
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 20px'
                }}>
                    <p style={{ 
                        color: '#F04452', 
                        fontSize: '15px',
                        margin: 0
                    }}>{error}</p>
                </div>
            </div>
        );
    }

    if (chatRooms.length === 0) {
        return (
            <div style={{ 
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #F2F4F6',
                    zIndex: 10
                }}>
                    <div style={{
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        maxWidth: '768px',
                        margin: '0 auto',
                        width: '100%'
                    }}>
                        <h1 style={{ 
                            fontSize: '17px', 
                            fontWeight: 700, 
                            margin: 0,
                            color: '#191F28'
                        }}>채팅</h1>
                    </div>
                </div>
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 20px'
                }}>
                    <p style={{ 
                        color: '#8B95A1', 
                        fontSize: '15px',
                        margin: 0
                    }}>참여 중인 채팅방이 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
            paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
            <div style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderBottom: '1px solid #F2F4F6',
                zIndex: 10
            }}>
                <div style={{
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                    width: '100%'
                }}>
                    <h1 style={{ 
                        fontSize: '17px', 
                        fontWeight: 700, 
                        margin: 0,
                        color: '#191F28'
                    }}>채팅</h1>
                </div>
            </div>

            <div style={{
                width: '100%'
            }}>
                {chatRooms.map(room => (
                    <div
                        key={room.id}
                        onClick={() => navigate(`/room/${room.id}`)}
                        style={{
                            display: 'flex',
                            padding: '16px 20px',
                            borderBottom: '1px solid #F2F4F6',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            backgroundColor: '#FFFFFF'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#F2F4F6',
                            borderRadius: '16px',
                            marginRight: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <MessageIcon size={24} color="#3182F6" />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '4px', 
                                gap: '8px',
                                alignItems: 'center'
                            }}>
                                <span style={{ 
                                    fontWeight: 600, 
                                    fontSize: '15px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: '#191F28'
                                }}>{room.name}</span>
                                <span style={{ 
                                    fontSize: '13px', 
                                    color: '#8B95A1',
                                    flexShrink: 0
                                }}>
                                    {new Date(room.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ 
                                fontSize: '14px', 
                                color: '#6B7684'
                            }}>
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
