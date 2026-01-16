import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Asset, List, ListRow, ListHeader, Text, Spacing } from '@toss/tds-mobile';
import { LoadingView } from '../components/LoadingView';
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
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text typography="t5" color="red500">
                    {error}
                </Text>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', width: '100%' }}>


            <div style={{ padding: '0 8px', width: '100%' }}>
                <ListHeader
                    title={
                        <ListHeader.TitleParagraph
                            color="grey800"
                            fontWeight="bold"
                            typography="t5"
                        >
                            My Rooms
                        </ListHeader.TitleParagraph>
                    }
                />
            </div>

            {chatRooms.length === 0 ? (
                <div style={{ padding: '40px 16px', textAlign: 'center', width: '100%' }}>
                    <Text typography="t6" color="grey500">
                        참여 중인 채팅방이 없습니다.
                    </Text>
                </div>
            ) : (
                <div style={{ width: '100%' }}>
                    <List>
                        {chatRooms.map(room => (
                            <ListRow
                                key={room.id}
                                left={
                                    <ListRow.Icon
                                        shape="no-background"
                                        url="https://static.toss.im/2d-emojis/png/4x/u1F4AC.png"
                                    />
                                }
                                contents={
                                    <ListRow.Texts
                                        type="2RowTypeA"
                                        top={room.name}
                                        topProps={{ color: 'grey700', fontWeight: 'bold' }}
                                        bottom={`${room.isPublic ? '공개' : '비공개'} · 최대 ${room.maxParticipants}명`}
                                        bottomProps={{ color: 'grey600' }}
                                    />
                                }
                                verticalPadding="large"
                                arrowType="right"
                                onClick={() => navigate(`/room/${room.id}`)}
                            />
                        ))}
                    </List>
                </div>
            )}

            <Spacing size={370} />
        </div>
    );
}
