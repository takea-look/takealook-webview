import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListRow, Spacing } from '@toss/tds-mobile';
import { LoadingView } from '../components/LoadingView';
import { Layout } from '../components/Layout';
import { createChatRoom, getChatRooms } from '../api/chat';
import type { ChatRoom } from '../types/api';

export function ChatRoomListScreen() {
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [createOpen, setCreateOpen] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createIsPublic, setCreateIsPublic] = useState(true);
    const [createMaxParticipants, setCreateMaxParticipants] = useState(10);
    const [createError, setCreateError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const [joinOpen, setJoinOpen] = useState(false);
    const [joinRoomId, setJoinRoomId] = useState('');
    const [joinError, setJoinError] = useState('');

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

    useEffect(() => {
        loadRooms();
    }, []);

    const resetCreateForm = () => {
        setCreateName('');
        setCreateIsPublic(true);
        setCreateMaxParticipants(10);
        setCreateError('');
        setIsCreating(false);
    };

    const handleOpenCreate = () => {
        setCreateOpen(true);
        setCreateError('');
    };

    const handleCloseCreate = () => {
        setCreateOpen(false);
        resetCreateForm();
    };


    const handleOpenJoin = () => {
        setJoinOpen(true);
        setJoinError('');
    };

    const handleCloseJoin = () => {
        setJoinOpen(false);
        setJoinRoomId('');
        setJoinError('');
    };

    const handleJoin = () => {
        const roomId = Number(joinRoomId);
        if (!Number.isInteger(roomId) || roomId <= 0) {
            setJoinError('유효한 채팅방 ID를 입력해주세요.');
            return;
        }

        handleCloseJoin();
        navigate(`/chat/${roomId}`);
    };

    const handleCreate = async () => {
        try {
            setCreateError('');

            const name = createName.trim();
            if (name.length < 2) {
                setCreateError('채팅방 이름은 2자 이상으로 입력해주세요.');
                return;
            }

            if (createMaxParticipants < 2 || createMaxParticipants > 100) {
                setCreateError('최대 참여 인원은 2~100명 사이로 설정해주세요.');
                return;
            }

            setIsCreating(true);
            const room = await createChatRoom({
                name,
                isPublic: createIsPublic,
                maxParticipants: createMaxParticipants,
            });

            setChatRooms((prev) => [room, ...prev]);
            setCreateOpen(false);
            resetCreateForm();

            // Immediately navigate to the created room.
            navigate(`/chat/${room.id}`);
        } catch (err) {
            console.error('Failed to create chat room:', err);
            setCreateError('채팅방 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return <LoadingView />;
    }

    if (error) {
        return (
            <Layout>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#f04452', fontSize: '15px', margin: 0 }}>{error}</p>
                    <Spacing size={12} />
                    <button
                        type="button"
                        onClick={() => void loadRooms()}
                        style={{
                            border: '1px solid #E5E8EB',
                            background: '#fff',
                            color: '#333D4B',
                            fontWeight: 800,
                            padding: '10px 14px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Spacing size={24} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '24px' }}>
                <h1 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#191f28',
                    margin: 0
                }}>
                    채팅
                </h1>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={handleOpenJoin}
                        style={{
                            border: '1px solid #E5E8EB',
                            background: '#fff',
                            color: '#333D4B',
                            fontWeight: 800,
                            padding: '10px 12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        참여하기
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        style={{
                            border: 'none',
                            background: '#3182F6',
                            color: '#fff',
                            fontWeight: 800,
                            padding: '10px 14px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        + 채팅방 만들기
                    </button>
                </div>
            </div>

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
                <div style={{ margin: '0 -12px' }}>
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
                                        fontSize: '24px',
                                        marginLeft: '12px'
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
                                            fontWeight: 'bold'
                                        }}
                                        bottom={
                                            <span style={{ color: '#8b95a1', fontSize: '14px' }}>
                                                {room.isPublic ? '공개' : '비공개'} · {room.maxParticipants}명
                                            </span>
                                        }
                                    />
                                }
                                right={
                                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M10 17L15 12L10 7" stroke="#b0b8c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                }
                                verticalPadding="medium"
                                onClick={() => navigate(`/chat/${room.id}`)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    padding: '12px 0'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            />
                        ))}
                    </List>
                </div>
            )}

            {createOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '24px',
                        zIndex: 100,
                    }}
                    onClick={handleCloseCreate}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '520px',
                            background: '#fff',
                            borderRadius: '24px',
                            padding: '20px 18px',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#191f28' }}>채팅방 만들기</div>
                            <button
                                type="button"
                                onClick={handleCloseCreate}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', padding: '6px' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '13px', color: '#6B7684', marginBottom: '6px', fontWeight: 700 }}>이름</div>
                                <input
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    placeholder="예) 점심 메뉴 정하기"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        borderRadius: '12px',
                                        border: '1px solid #E5E8EB',
                                        padding: '0 12px',
                                        fontSize: '15px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '12px', border: '1px solid #E5E8EB', borderRadius: '14px' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#191f28', fontSize: '14px' }}>공개</div>
                                        <div style={{ fontSize: '12px', color: '#8B95A1' }}>누구나 참여 가능</div>
                                    </div>
                                    <input type="checkbox" checked={createIsPublic} onChange={(e) => setCreateIsPublic(e.target.checked)} />
                                </label>

                                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', border: '1px solid #E5E8EB', borderRadius: '14px' }}>
                                    <div style={{ fontWeight: 800, color: '#191f28', fontSize: '14px' }}>최대 인원</div>
                                    <input
                                        type="number"
                                        value={createMaxParticipants}
                                        onChange={(e) => setCreateMaxParticipants(Number(e.target.value))}
                                        min={2}
                                        max={100}
                                        style={{
                                            width: '100%',
                                            height: '36px',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E8EB',
                                            padding: '0 10px',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </label>
                            </div>

                            {createError && (
                                <div style={{ color: '#F04452', fontSize: '13px', fontWeight: 700 }}>{createError}</div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseCreate}
                                    style={{
                                        flex: 1,
                                        height: '46px',
                                        borderRadius: '14px',
                                        border: '1px solid #E5E8EB',
                                        background: '#fff',
                                        color: '#333D4B',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    disabled={isCreating}
                                    onClick={handleCreate}
                                    style={{
                                        flex: 1,
                                        height: '46px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: isCreating ? '#B0B8C1' : '#3182F6',
                                        color: '#fff',
                                        fontWeight: 900,
                                        cursor: isCreating ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isCreating ? '생성 중…' : '만들기'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {joinOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        padding: '24px',
                        zIndex: 110,
                    }}
                    onClick={handleCloseJoin}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '520px',
                            background: '#fff',
                            borderRadius: '24px',
                            padding: '20px 18px',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#191f28', marginBottom: '12px' }}>채팅방 참여하기</div>
                        <input
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            placeholder="채팅방 ID를 입력하세요"
                            inputMode="numeric"
                            style={{
                                width: '100%',
                                height: '44px',
                                borderRadius: '12px',
                                border: '1px solid #E5E8EB',
                                padding: '0 12px',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                            }}
                        />
                        {joinError && <div style={{ marginTop: '10px', color: '#F04452', fontSize: '13px', fontWeight: 700 }}>{joinError}</div>}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                            <button
                                type="button"
                                onClick={handleCloseJoin}
                                style={{ flex: 1, height: '46px', borderRadius: '14px', border: '1px solid #E5E8EB', background: '#fff', color: '#333D4B', fontWeight: 800, cursor: 'pointer' }}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={handleJoin}
                                style={{ flex: 1, height: '46px', borderRadius: '14px', border: 'none', background: '#3182F6', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                            >
                                이동
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
}
