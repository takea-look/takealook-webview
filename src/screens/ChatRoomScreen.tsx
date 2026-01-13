import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatMessages } from '../api/chat';
import { getUploadUrl, uploadToR2 } from '../api/storage';
import { useWebSocket } from '../hooks/useWebSocket';
import type { UserChatMessage } from '../types/api';
import { MessageType } from '../types/api';
import { getMyProfile } from '../api/user';

export function ChatRoomScreen() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [historyMessages, setHistoryMessages] = useState<UserChatMessage[]>([]);
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    const { messages: wsMessages, isConnected, sendMessage, connect, disconnect } = useWebSocket();

    // Check if user is near bottom of scroll
    const checkScrollPosition = useCallback(() => {
        if (!chatContainerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // 100px threshold to consider as "at bottom"
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        isAtBottomRef.current = isNearBottom;
        
        if (isNearBottom) {
            setShowScrollButton(false);
        }
    }, []);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
        setShowScrollButton(false);
    };

    useEffect(() => {
        const init = async () => {
            if (!roomId) return;

            try {
                setLoading(true);
                const roomIdNum = parseInt(roomId, 10);
                const [profile, messages] = await Promise.all([
                    getMyProfile(),
                    getChatMessages(roomIdNum)
                ]);
                setMyUserId(profile.id!);
                setHistoryMessages(messages);
                await connect(roomIdNum);
            } catch (err) {
                console.error('Failed to initialize chat room:', err);
            } finally {
                setLoading(false);
            }
        };

        init();

        return () => {
            disconnect();
        };
    }, [roomId, connect, disconnect]);

    // Initial scroll on history load
    useEffect(() => {
        if (historyMessages.length > 0) {
            scrollToBottom('auto');
        }
    }, [historyMessages]);

    // Smart scroll on new messages
    useEffect(() => {
        if (wsMessages.length === 0) return;

        const lastMessage = wsMessages[wsMessages.length - 1];
        const isMyMessage = lastMessage.sender.id === myUserId;

        // Always scroll for my messages or if user is already at bottom
        if (isMyMessage || isAtBottomRef.current) {
            scrollToBottom();
        } else {
            // Otherwise show notification
            setShowScrollButton(true);
        }
    }, [wsMessages, myUserId]);

    const allMessages = [...historyMessages, ...wsMessages];

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !roomId) return;

        try {
            setIsUploading(true);

            const roomIdNum = parseInt(roomId, 10);
            const extension = file.name.split('.').pop();
            const filename = `chat/${roomIdNum}/${Date.now()}.${extension}`;

            const { url: presignedUrl } = await getUploadUrl(filename);

            await uploadToR2(presignedUrl, file);

            const imageUrl = `https://img.takealook.my/${filename}`;

            if (myUserId === null) {
                console.error('User ID not loaded yet');
                alert('사진 업로드에 실패했습니다.');
                return;
            }

            sendMessage(roomIdNum, imageUrl, myUserId);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('사진 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (loading) {
        return (
            <div style={{ 
                backgroundColor: '#fff', 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div style={{ 
            backgroundColor: '#fff', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            maxWidth: '100%'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                borderBottom: '1px solid #f2f4f6',
                position: 'sticky',
                top: 0,
                backgroundColor: '#fff',
                zIndex: 10
            }}>
                <span 
                    onClick={() => navigate('/')} 
                    style={{ 
                        fontSize: 'clamp(18px, 4.5vw, 20px)', 
                        cursor: 'pointer', 
                        marginRight: 'clamp(10px, 2.5vw, 12px)',
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >⬅️</span>
                <span style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 'bold' }}>채팅방 {roomId}</span>
                {isConnected ? (
                    <span style={{ marginLeft: 'auto', fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#00c73c' }}>● 연결됨</span>
                ) : (
                    <span style={{ marginLeft: 'auto', fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#8b95a1' }}>연결 중...</span>
                )}
            </div>

            <div 
                ref={chatContainerRef}
                onScroll={checkScrollPosition}
                style={{ 
                    flex: 1, 
                    padding: 'clamp(12px, 3vw, 16px)', 
                    overflowY: 'auto',
                    maxWidth: '900px',
                    width: '100%',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    position: 'relative'
                }}
            >
                {allMessages.map((msg, index) => {
                    if (msg.type === MessageType.JOIN || msg.type === MessageType.LEAVE) {
                        return (
                            <div key={`${msg.createdAt}-${index}`} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: 'clamp(12px, 3vw, 16px)',
                                width: '100%'
                            }}>
                                <div style={{
                                    backgroundColor: '#f2f4f6',
                                    borderRadius: '16px',
                                    padding: '4px 12px',
                                    fontSize: 'clamp(11px, 2.8vw, 12px)',
                                    color: '#8b95a1'
                                }}>
                                    {msg.sender.nickname || msg.sender.username}님이 {msg.type === MessageType.JOIN ? '입장하셨습니다.' : '퇴장하셨습니다.'}
                                </div>
                            </div>
                        );
                    }

                    const isMyMessage = msg.sender.id === myUserId;
                    const timestamp = new Date(msg.createdAt);
                    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={`${msg.createdAt}-${index}`} style={{
                            display: 'flex',
                            justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                            marginBottom: 'clamp(12px, 3vw, 16px)'
                        }}>
                            {!isMyMessage && (
                                <div style={{
                                    width: 'clamp(36px, 8vw, 40px)',
                                    height: 'clamp(36px, 8vw, 40px)',
                                    backgroundColor: '#f2f4f6',
                                    borderRadius: '12px',
                                    marginRight: 'clamp(6px, 1.5vw, 8px)',
                                    backgroundImage: msg.sender.image ? `url(${msg.sender.image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'clamp(16px, 4vw, 20px)',
                                    flexShrink: 0
                                }}>
                                    {!msg.sender.image && '👤'}
                                </div>
                            )}
                            <div style={{ 
                                maxWidth: 'min(70%, 400px)', 
                                position: 'relative',
                                minWidth: '120px'
                            }}>
                                {!isMyMessage && (
                                    <p style={{ 
                                        fontSize: 'clamp(11px, 2.8vw, 12px)', 
                                        color: '#4e5968', 
                                        marginBottom: '4px',
                                        margin: '0 0 4px 0'
                                    }}>
                                        {msg.sender.nickname || msg.sender.username}
                                    </p>
                                )}
                                <div style={{
                                    backgroundColor: isMyMessage ? '#3182f6' : '#f2f4f6',
                                    borderRadius: '12px',
                                    padding: '4px',
                                    overflow: 'hidden'
                                }}>
                                    {msg.imageUrl && (
                                        <img
                                            src={msg.imageUrl}
                                            alt="Chat"
                                            style={{ 
                                                width: '100%', 
                                                borderRadius: '8px', 
                                                display: 'block',
                                                maxWidth: '100%',
                                                height: 'auto'
                                            }}
                                        />
                                    )}
                                </div>
                                <span style={{
                                    fontSize: 'clamp(10px, 2.5vw, 11px)',
                                    color: '#8b95a1',
                                    position: 'absolute',
                                    bottom: 0,
                                    [isMyMessage ? 'left' : 'right']: '-50px',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {timeString}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {isUploading && (
                    <div style={{ textAlign: 'center', color: '#8b95a1', fontSize: 'clamp(13px, 3.2vw, 14px)' }}>
                        사진 업로드 중...
                    </div>
                )}
                <div ref={messagesEndRef} />
                
                {/* Floating Action Button for New Messages */}
                {showScrollButton && (
                    <div 
                        onClick={() => scrollToBottom()}
                        style={{
                            position: 'fixed',
                            bottom: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#3182f6',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            zIndex: 100,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            animation: 'fadeIn 0.3s ease-out'
                        }}
                    >
                        <span>⬇️</span>
                        <span>새 메시지</span>
                    </div>
                )}
            </div>

            <div style={{ 
                padding: 'clamp(12px, 3vw, 16px)', 
                borderTop: '1px solid #f2f4f6', 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#fff',
                maxWidth: '900px',
                width: '100%',
                margin: '0 auto',
                boxSizing: 'border-box',
                gap: 'clamp(10px, 2.5vw, 12px)'
            }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <div style={{
                    flex: 1,
                    minHeight: '44px',
                    backgroundColor: '#f2f4f6',
                    borderRadius: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 clamp(12px, 3vw, 16px)',
                    color: '#8b95a1',
                    fontSize: 'clamp(13px, 3.2vw, 14px)'
                }}>
                    사진으로만 대화할 수 있어요
                </div>
                <div
                    onClick={handleCameraClick}
                    style={{
                        width: 'clamp(44px, 10vw, 48px)',
                        height: 'clamp(44px, 10vw, 48px)',
                        backgroundColor: isUploading || !isConnected ? '#adb5bd' : '#3182f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 'clamp(20px, 5vw, 24px)',
                        cursor: isUploading || !isConnected ? 'not-allowed' : 'pointer',
                        flexShrink: 0
                    }}
                >
                    📷
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
}
