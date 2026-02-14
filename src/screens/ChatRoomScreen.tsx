import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getChatMessages } from '../api/chat';
import { getPublicImageUrl, getUploadUrl, uploadToR2 } from '../api/storage';
import { downsampleImageFile } from '../utils/image';
import { useWebSocket } from '../hooks/useWebSocket';
import type { UserChatMessage } from '../types/api';
import { MessageType } from '../types/api';
import { getMyProfile } from '../api/user';
import { CameraIcon, UserIcon, ArrowDownIcon } from '../components/icons';
import { LoadingView } from '../components/LoadingView';
import { Layout } from '../components/Layout';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";

export function ChatRoomScreen() {
    const { roomId } = useParams<{ roomId: string }>();
    const [historyMessages, setHistoryMessages] = useState<UserChatMessage[]>([]);
    const [hasMoreHistory, setHasMoreHistory] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [lastFailedUpload, setLastFailedUpload] = useState<{
        file: File;
        roomIdNum: number;
        filename: string;
        imageUrl: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const [replyTarget, setReplyTarget] = useState<UserChatMessage | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    const REACTION_EMOJIS = ['👍', '😂', '❤️', '😮', '🔥', '👏'];

    const {
        messages: wsMessages,
        isConnected,
        connectionStatus,
        connect,
        disconnect,
        sendMessage,
        sendReaction,
    } = useWebSocket();

    const [reactionMenuMessageId, setReactionMenuMessageId] = useState<number | null>(null);
    const [localReactionCounts, setLocalReactionCounts] = useState<Record<number, Record<string, number>>>({});
    const reactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Simple connection indicator (can be refined with TDS component later)
    const connectionLabel = connectionStatus === 'connected'
        ? '연결됨'
        : connectionStatus === 'reconnecting'
            ? '재연결 중…'
            : connectionStatus === 'connecting'
                ? '연결 중…'
                : '연결 끊김';

    const loadMoreHistory = useCallback(async () => {
        if (!roomId || isLoadingHistory || !hasMoreHistory) return;
        const roomIdNum = parseInt(roomId, 10);

        const oldest = historyMessages[0];
        if (!oldest) return;

        try {
            setIsLoadingHistory(true);
            // NOTE: server spec says before can be messageId or createdAt. We send createdAt for now.
            const older = await getChatMessages(roomIdNum, { limit: 30, before: oldest.createdAt });
            setHistoryMessages(prev => [...older, ...prev]);
            setHasMoreHistory(older.length >= 30);
        } catch (err) {
            console.error('Failed to load more history:', err);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [roomId, isLoadingHistory, hasMoreHistory, historyMessages]);

    const checkScrollPosition = useCallback(() => {
        if (!chatContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        isAtBottomRef.current = isNearBottom;

        if (isNearBottom) {
            setShowScrollButton(false);
        }

        // Near top → load older messages
        if (scrollTop < 80 && !isLoadingHistory && hasMoreHistory) {
            loadMoreHistory();
        }
    }, [isLoadingHistory, hasMoreHistory, loadMoreHistory]);

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
                    getChatMessages(roomIdNum, { limit: 30 })
                ]);
                setMyUserId(profile.id!);
                setHistoryMessages(messages);
                setHasMoreHistory(messages.length >= 30);
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

    const getReactionCounts = useCallback((message: UserChatMessage) => {
        const historyCounts = message.reactionCounts ?? {};
        const localCounts = localReactionCounts[message.id ?? -1] ?? {};
        const merged: Record<string, number> = { ...historyCounts };

        Object.entries(localCounts).forEach(([emoji, count]) => {
            merged[emoji] = (merged[emoji] ?? 0) + count;
        });

        return Object.entries(merged)
            .map(([emoji, count]) => ({ emoji, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [localReactionCounts]);

    const applyLocalReaction = useCallback((messageId: number, emoji: string) => {
        setLocalReactionCounts(prev => {
            const prevMessage = prev[messageId] ?? {};
            return {
                ...prev,
                [messageId]: {
                    ...prevMessage,
                    [emoji]: (prevMessage[emoji] ?? 0) + 1,
                },
            };
        });
    }, []);

    const openReactionMenu = useCallback((messageId: number | undefined) => {
        if (messageId == null) return;
        setReactionMenuMessageId(messageId);
    }, []);

    const closeReactionMenu = useCallback(() => {
        setReactionMenuMessageId(null);
    }, []);

    useEffect(() => {
        const handlePointerDown = () => {
            closeReactionMenu();
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [closeReactionMenu]);

    const handleReactionSelect = useCallback((messageId: number | undefined, emoji: string) => {
        if (messageId == null) {
            closeReactionMenu();
            return;
        }

        if (myUserId == null) return;

        const roomIdNum = Number(roomId);
        if (!Number.isFinite(roomIdNum)) return;

        sendReaction(roomIdNum, myUserId, messageId, emoji);
        applyLocalReaction(messageId, emoji);
        closeReactionMenu();
    }, [closeReactionMenu, applyLocalReaction, myUserId, sendReaction, roomId]);

    const handleMessagePointerDown = useCallback((messageId: number | undefined) => {
        if (reactionTimeoutRef.current != null) {
            clearTimeout(reactionTimeoutRef.current);
        }

        if (messageId == null) {
            return;
        }

        reactionTimeoutRef.current = setTimeout(() => {
            openReactionMenu(messageId);
        }, 500);
    }, [openReactionMenu]);

    const handleMessagePointerUp = useCallback(() => {
        if (reactionTimeoutRef.current != null) {
            clearTimeout(reactionTimeoutRef.current);
            reactionTimeoutRef.current = null;
        }
    }, []);

    const allMessages = [...historyMessages, ...wsMessages];
    const slides = allMessages
        .filter(msg => msg.imageUrl)
        .map(msg => ({ src: msg.imageUrl! }));

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !roomId) return;

        try {
            const roomIdNum = parseInt(roomId, 10);

            // Front-side validation
            if (file.size > MAX_UPLOAD_BYTES) {
                throw new Error('파일이 너무 커요. 10MB 이하 이미지만 업로드할 수 있어요.');
            }

            if (myUserId === null) {
                throw new Error('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            }

            // Downsample/convert before upload (data saving + faster load)
            const { file: optimizedFile } = await downsampleImageFile(file, {
                maxWidth: 1280,
                maxHeight: 1280,
                quality: 0.82,
                mimeType: 'image/webp',
            });

            if (optimizedFile.size > MAX_UPLOAD_BYTES) {
                throw new Error('압축 후에도 파일이 10MB를 초과합니다. 더 작은 이미지를 선택해주세요.');
            }

            const extension = (optimizedFile.name.split('.').pop() || '').toLowerCase();
            const allowedExt = new Set(['png', 'jpg', 'jpeg', 'webp']);
            if (!allowedExt.has(extension)) {
                throw new Error('지원하지 않는 이미지 형식입니다. png/jpg/jpeg/webp만 업로드할 수 있어요.');
            }

            setIsUploading(true);

            const filename = `chat/${roomIdNum}/${Date.now()}.${extension}`;
            const { url: presignedUrl } = await getUploadUrl(filename, optimizedFile.size);
            await uploadToR2(presignedUrl, optimizedFile);
            const imageUrl = getPublicImageUrl(filename);

            setLastFailedUpload(null);
            sendMessage(roomIdNum, imageUrl, myUserId, replyTarget?.id);
            setReplyTarget(null);
        } catch (error) {
            console.error('Upload failed:', error);
            // Keep the last chosen image for retry UX.
            try {
                const roomIdNum = parseInt(roomId, 10);
                const extension = (file.name.split('.').pop() || '').toLowerCase();
                const filename = `chat/${roomIdNum}/${Date.now()}.${extension}`;
                const imageUrl = getPublicImageUrl(filename);
                setLastFailedUpload({ file, roomIdNum, filename, imageUrl });
            } catch {
                // ignore
            }

            const message = error instanceof Error ? error.message : '사진 업로드에 실패했습니다.';
            alert(message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleImageClick = (imageUrl: string) => {
        const index = slides.findIndex(slide => slide.src === imageUrl);
        setLightboxIndex(index);
        setLightboxOpen(true);
        window.history.pushState({ lightbox: true }, '');
    };

    useEffect(() => {
        if (!lightboxOpen) return;

        const handlePopState = () => {
            setLightboxOpen(false);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [lightboxOpen]);

    if (loading) {
        return <LoadingView />;
    }

    return (
        <Layout 
            fullBleed={true} 
            style={{ height: '100vh', overflow: 'hidden' }}
            contentStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div 
                ref={chatContainerRef}
                onScroll={checkScrollPosition}
                style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '20px 16px', 
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {allMessages.map((msg, index) => {
                    const currentCreatedAt = new Date(msg.createdAt);
                    const previousMessage = allMessages[index - 1];
                    const previousCreatedAt = previousMessage ? new Date(previousMessage.createdAt) : null;
                    
                    const isNewDay = !previousCreatedAt || 
                        currentCreatedAt.getFullYear() !== previousCreatedAt.getFullYear() ||
                        currentCreatedAt.getMonth() !== previousCreatedAt.getMonth() ||
                        currentCreatedAt.getDate() !== previousCreatedAt.getDate();

                    const DateDivider = () => (
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 16px 0' }}>
                            <div style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                padding: '6px 14px',
                                borderRadius: '100px',
                                fontSize: '12px',
                                color: '#6B7684',
                                fontWeight: 500
                            }}>
                                {currentCreatedAt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                            </div>
                        </div>
                    );

                    if (msg.type === MessageType.JOIN || msg.type === MessageType.LEAVE) {
                        return (
                            <React.Fragment key={`${msg.createdAt}-${index}`}>
                                {isNewDay && <DateDivider />}
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                                    <div style={{
                                        backgroundColor: 'rgba(0, 27, 55, 0.04)',
                                        padding: '6px 14px',
                                        borderRadius: '100px',
                                        fontSize: '12px',
                                        color: '#6B7684',
                                        fontWeight: 500
                                    }}>
                                        {msg.sender.nickname || msg.sender.username}님이 {msg.type === MessageType.JOIN ? '입장했습니다' : '나갔습니다'}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    }

                    const isMyMessage = msg.sender.id === myUserId;
                    const timestamp = new Date(msg.createdAt);
                    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                    return (
                        <React.Fragment key={`${msg.createdAt}-${index}`}>
                            {isNewDay && <DateDivider />}
                            <div style={{
                                display: 'flex',
                                flexDirection: isMyMessage ? 'row-reverse' : 'row',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}>
                                {!isMyMessage && (
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '14px',
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
    
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMyMessage ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                    {!isMyMessage && (
                                        <span style={{ fontSize: '12px', color: '#6B7684', marginBottom: '4px', marginLeft: '2px' }}>
                                            {msg.sender.nickname || msg.sender.username}
                                        </span>
                                    )}
                                    
                                    <div
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            openReactionMenu(msg.id);
                                        }}
                                        onDoubleClick={() => setReplyTarget(msg)}
                                        onPointerDown={() => handleMessagePointerDown(msg.id)}
                                        onPointerUp={handleMessagePointerUp}
                                        onPointerLeave={handleMessagePointerUp}
                                        style={{
                                            borderRadius: isMyMessage ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                                            overflow: 'hidden',
                                            boxShadow: isMyMessage ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.04)',
                                            backgroundColor: isMyMessage ? '#3182F6' : '#F2F4F6',
                                            color: isMyMessage ? '#fff' : '#333d4b'
                                        }}
                                    >
                                        {msg.replyToId != null && (
                                            <div style={{
                                                padding: '8px 10px',
                                                fontSize: '12px',
                                                opacity: 0.9,
                                                borderBottom: isMyMessage ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.06)'
                                            }}>
                                                ↪ 답장 (replyToId: {msg.replyToId})
                                            </div>
                                        )}
                                        {msg.imageUrl && (
                                            <img
                                                src={msg.imageUrl}
                                                alt="Chat"
                                                style={{ display: 'block', maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                                                onClick={() => msg.imageUrl && handleImageClick(msg.imageUrl)}
                                            />
                                        )}
                                        {getReactionCounts(msg).length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '6px',
                                                justifyContent: 'flex-end',
                                                padding: '6px 8px',
                                                fontSize: '11px',
                                                color: isMyMessage ? 'rgba(255,255,255,0.9)' : '#8B95A1'
                                            }}>
                                                {getReactionCounts(msg).map(item => (
                                                    <span
                                                        key={`${msg.id}-${item.emoji}`}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '3px',
                                                            background: isMyMessage ? 'rgba(0,0,0,0.2)' : '#EAF1FF',
                                                            borderRadius: '12px',
                                                            padding: '1px 7px'
                                                        }}
                                                    >
                                                        <span>{item.emoji}</span>
                                                        <span>{item.count}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {reactionMenuMessageId === msg.id && (
                                        <div
                                            style={{
                                                marginTop: '6px',
                                                display: 'flex',
                                                gap: '8px',
                                                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                                                zIndex: 10,
                                            }}
                                            onPointerDown={(e) => e.stopPropagation()}
                                        >
                                            {REACTION_EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                    onClick={() => handleReactionSelect(msg.id, emoji)}
                                                    style={{
                                                        border: 'none',
                                                        background: '#FFF',
                                                        borderRadius: '16px',
                                                        padding: '4px 8px',
                                                        fontSize: '18px',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                    }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
    
                                <span style={{
                                    fontSize: '11px',
                                    color: '#b0b8c1',
                                    marginBottom: '2px',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {timeString}
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
                {isUploading && (
                    <div style={{ textAlign: 'center', color: '#8B95A1', fontSize: '13px', margin: '10px 0' }}>
                        사진 업로드 중...
                    </div>
                )}
                {!isUploading && lastFailedUpload && (
                    <div style={{ textAlign: 'center', color: '#8B95A1', fontSize: '13px', margin: '10px 0' }}>
                        업로드가 실패했나요?
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setIsUploading(true);
                                    const { url: presignedUrl } = await getUploadUrl(lastFailedUpload.filename, lastFailedUpload.file.size);
                                    await uploadToR2(presignedUrl, lastFailedUpload.file);
                                    // Re-send message (same imageUrl)
                                    if (myUserId != null) {
                                        sendMessage(lastFailedUpload.roomIdNum, lastFailedUpload.imageUrl, myUserId, replyTarget?.id);
                                    }
                                    setLastFailedUpload(null);
                                } catch (e) {
                                    console.error('Retry upload failed:', e);
                                    alert('재시도에 실패했습니다.');
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                            style={{
                                marginLeft: '8px',
                                border: 'none',
                                background: 'transparent',
                                color: '#3182F6',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            재시도
                        </button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {showScrollButton && (
                <button 
                    onClick={() => scrollToBottom()}
                    style={{
                        position: 'absolute',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #e5e8eb',
                        color: '#3182F6',
                        padding: '10px 18px',
                        borderRadius: '24px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
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

            <div style={{
                padding: '12px 16px',
                paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #F2F4F6',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'sticky',
                bottom: 0,
                zIndex: 10
            }}>
                {replyTarget && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        border: '1px solid #E5E8EB'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: '#EFF2F4',
                            backgroundImage: replyTarget.imageUrl ? `url(${replyTarget.imageUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#333D4B' }}>
                                답장: {replyTarget.sender.nickname || replyTarget.sender.username}
                            </div>
                            <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                                {replyTarget.id != null ? `messageId: ${replyTarget.id}` : 'messageId 없음(서버 응답 확인 필요)'}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setReplyTarget(null)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#3182F6',
                                fontWeight: 800,
                                cursor: 'pointer'
                            }}
                        >
                            취소
                        </button>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        fontSize: '12px',
                        color: connectionStatus === 'connected' ? '#2DB400' : '#8B95A1',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                    }}>
                        {connectionLabel}
                    </div>

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
                    {replyTarget ? '답장할 사진을 보내세요' : '사진으로만 대화할 수 있어요'}
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
                        transition: 'all 0.1s ease',
                        boxShadow: isUploading || !isConnected ? 'none' : '0 4px 12px rgba(49, 130, 246, 0.3)'
                    }}
                    onMouseDown={e => !isUploading && isConnected && (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={e => !isUploading && isConnected && (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={e => !isUploading && isConnected && (e.currentTarget.style.transform = 'scale(1)')}
                >
                    <CameraIcon size={24} color="#FFFFFF" />
                </button>
            </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                ::-webkit-scrollbar {
                    width: 0px;
                    background: transparent;
                }
            `}</style>
            
            <Lightbox
                open={lightboxOpen}
                close={() => window.history.back()}
                index={lightboxIndex}
                slides={slides}
                plugins={[Zoom, Download]}
                on={{ view: ({ index: newIndex }) => setLightboxIndex(newIndex) }}
            />
        </Layout>
    );
}
