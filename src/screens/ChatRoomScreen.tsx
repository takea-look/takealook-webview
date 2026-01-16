import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatMessages } from '../api/chat';
import { getUploadUrl, uploadToR2 } from '../api/storage';
import { useWebSocket } from '../hooks/useWebSocket';
import type { UserChatMessage } from '../types/api';
import { MessageType } from '../types/api';
import { getMyProfile } from '../api/user';
import { CameraIcon, UserIcon, ArrowDownIcon } from '../components/icons';
import { LoadingView } from '../components/LoadingView';

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

    useEffect(() => {
        if (historyMessages.length > 0) {
            scrollToBottom('auto');
        }
    }, [historyMessages]);

    useEffect(() => {
        if (wsMessages.length === 0) return;

        const lastMessage = wsMessages[wsMessages.length - 1];
        const isMyMessage = lastMessage.sender.id === myUserId;

        if (isMyMessage || isAtBottomRef.current) {
            scrollToBottom();
        } else {
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
        return <LoadingView />;
    }

    return (
        <div style={{ backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>


            {/* Chat Area */}
            <div 
                ref={chatContainerRef}
                onScroll={checkScrollPosition}
                style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '20px 16px', 
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}
            >
                {allMessages.map((msg, index) => {
                    // System Message
                    if (msg.type === MessageType.JOIN || msg.type === MessageType.LEAVE) {
                        return (
                            <div key={`${msg.createdAt}-${index}`} style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                                <div style={{
                                    backgroundColor: '#F2F4F6',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    color: '#6B7684',
                                    fontWeight: 500
                                }}>
                                    {msg.sender.nickname || msg.sender.username}님이 {msg.type === MessageType.JOIN ? '입장했습니다' : '나갔습니다'}
                                </div>
                            </div>
                        );
                    }

                    const isMyMessage = msg.sender.id === myUserId;
                    const timestamp = new Date(msg.createdAt);
                    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                    return (
                        <div key={`${msg.createdAt}-${index}`} style={{
                            display: 'flex',
                            flexDirection: isMyMessage ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            gap: '8px'
                        }}>
                            {/* Avatar (Other) */}
                            {!isMyMessage && (
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '16px',
                                    backgroundColor: '#F2F4F6',
                                    backgroundImage: msg.sender.image ? `url(${msg.sender.image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    overflow: 'hidden'
                                }}>
                                    {!msg.sender.image && <UserIcon size={20} color="#B0B8C1" />}
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMyMessage ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                {!isMyMessage && (
                                    <span style={{ fontSize: '12px', color: '#6B7684', marginBottom: '4px', marginLeft: '2px' }}>
                                        {msg.sender.nickname || msg.sender.username}
                                    </span>
                                )}
                                
                                <div style={{
                                    borderRadius: isMyMessage ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                    overflow: 'hidden',
                                    boxShadow: isMyMessage ? 'none' : '0 0 0 1px #F2F4F6',
                                    backgroundColor: isMyMessage ? '#3182F6' : '#FFFFFF'
                                }}>
                                    {msg.imageUrl && (
                                        <img
                                            src={msg.imageUrl}
                                            alt="Chat"
                                            style={{ display: 'block', maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Timestamp */}
                            <span style={{
                                fontSize: '11px',
                                color: '#ADB5BD',
                                marginBottom: '2px',
                                whiteSpace: 'nowrap'
                            }}>
                                {timeString}
                            </span>
                        </div>
                    );
                })}
                {isUploading && (
                    <div style={{ textAlign: 'center', color: '#8B95A1', fontSize: '13px', margin: '10px 0' }}>
                        사진 업로드 중...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* FAB */}
            {showScrollButton && (
                <button 
                    onClick={() => scrollToBottom()}
                    style={{
                        position: 'absolute',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #F2F4F6',
                        color: '#3182F6',
                        padding: '10px 18px',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 20,
                        fontSize: '13px',
                        fontWeight: 600,
                        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    <ArrowDownIcon size={16} color="#3182F6" />
                    새 메시지
                </button>
            )}

            {/* Input Area */}
            <div style={{
                padding: '12px 16px',
                paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #F2F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    flex: 1,
                    height: '48px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 20px',
                    color: '#8B95A1',
                    fontSize: '15px'
                }}>
                    사진으로만 대화할 수 있어요
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                
                <button
                    onClick={handleCameraClick}
                    disabled={isUploading || !isConnected}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: isUploading || !isConnected ? '#E5E8EB' : '#3182F6',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isUploading || !isConnected ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.1s ease',
                        boxShadow: isUploading || !isConnected ? 'none' : '0 4px 12px rgba(49, 130, 246, 0.3)'
                    }}
                    onMouseDown={e => !isUploading && isConnected && (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={e => !isUploading && isConnected && (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={e => !isUploading && isConnected && (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <CameraIcon size={24} color="#FFFFFF" />
                </button>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-track {
                    background-color: transparent;
                }
            `}</style>
        </div>
    );
}
