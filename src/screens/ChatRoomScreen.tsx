import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChatMessages, reportChatMessage } from '../api/chat';
import { getPublicImageUrl, getUploadUrl, uploadToR2 } from '../api/storage';
import { downsampleImageFile } from '../utils/image';
import { useWebSocket } from '../hooks/useWebSocket';
import type { UserChatMessage } from '../types/api';
import { MessageType } from '../types/api';
import { getMyProfile } from '../api/user';
import { CameraIcon, ArrowDownIcon } from '../components/icons';
import { LoadingView } from '../components/LoadingView';
import { Layout } from '../components/Layout';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ReportConfirmDialog } from '../components/chat/ReportConfirmDialog';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";

export function ChatRoomScreen() {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const [historyMessages, setHistoryMessages] = useState<UserChatMessage[]>([]);
    const [hasMoreHistory, setHasMoreHistory] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [lastFailedUpload, setLastFailedUpload] = useState<{
        file: File;
        roomIdNum: number;
        replyToMessageId?: number;
    } | null>(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
    const [editRotateDeg, setEditRotateDeg] = useState<0 | 90 | 180 | 270>(0);
    const [editCropSquare, setEditCropSquare] = useState(false);
    const [editError, setEditError] = useState('');

    const [loading, setLoading] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const [replyTarget, setReplyTarget] = useState<UserChatMessage | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    const swipeTargetMessageIdRef = useRef<number | null>(null);
    const swipeStartXRef = useRef<number | null>(null);
    const swipeStartYRef = useRef<number | null>(null);
    const swipeTriggeredRef = useRef(false);

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
    const [reportConfirmMessageId, setReportConfirmMessageId] = useState<number | null>(null);
    const [isReporting, setIsReporting] = useState(false);
    const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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


    const normalizeMessages = useCallback((messages: UserChatMessage[]) => {
        const seen = new Set<string>();

        return [...messages]
            .sort((a, b) => {
                if (a.createdAt === b.createdAt) {
                    return (a.id ?? 0) - (b.id ?? 0);
                }
                return a.createdAt - b.createdAt;
            })
            .filter((msg) => {
                const key = msg.id != null ? `id:${msg.id}` : `ts:${msg.createdAt}:sender:${msg.sender?.id ?? 'unknown'}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
    }, []);

    const loadMoreHistory = useCallback(async () => {
        if (!roomId || isLoadingHistory || !hasMoreHistory) return;
        const roomIdNum = parseInt(roomId, 10);

        const oldest = historyMessages[0];
        if (!oldest) return;

        try {
            setIsLoadingHistory(true);
            // Prefer stable cursor by message id; fallback to createdAt for legacy payloads.
            const beforeCursor = oldest.id ?? oldest.createdAt;
            const older = await getChatMessages(roomIdNum, { limit: 30, before: beforeCursor });
            setHistoryMessages(prev => normalizeMessages([...older, ...prev]));

            // If all returned rows were duplicates, stop further pagination loop.
            const uniqueOlderCount = older.filter((msg, idx, arr) =>
                arr.findIndex((x) => (x.id != null && msg.id != null ? x.id === msg.id : x.createdAt === msg.createdAt && x.sender?.id === msg.sender?.id)) === idx
            ).length;
            setHasMoreHistory(uniqueOlderCount >= 30);
        } catch (err) {
            console.error('Failed to load more history:', err);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [roomId, isLoadingHistory, hasMoreHistory, historyMessages, normalizeMessages]);

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
                setHistoryMessages(normalizeMessages(messages));
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
    }, [roomId, connect, disconnect, normalizeMessages]);

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

    const showToast = useCallback((message: string, kind: 'success' | 'error') => {
        setToast({ message, kind });
        if (toastTimeoutRef.current != null) {
            clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 2200);
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

    const handleReportEntry = useCallback((messageId: number | undefined) => {
        if (messageId == null) return;
        setReportConfirmMessageId(messageId);
        closeReactionMenu();
    }, [closeReactionMenu]);

    const confirmReport = useCallback(async () => {
        if (reportConfirmMessageId == null) return;

        try {
            setIsReporting(true);
            await reportChatMessage(reportConfirmMessageId);
            showToast('신고가 접수되었습니다.', 'success');
            setReportConfirmMessageId(null);
        } catch (e) {
            console.error('Report failed:', e);
            showToast('신고에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
        } finally {
            setIsReporting(false);
        }
    }, [reportConfirmMessageId, showToast]);

    const handleMessagePointerDown = useCallback((messageId: number | undefined, e?: React.PointerEvent) => {
        if (reactionTimeoutRef.current != null) {
            clearTimeout(reactionTimeoutRef.current);
        }

        if (messageId == null) {
            return;
        }

        if (e) {
            swipeTargetMessageIdRef.current = messageId;
            swipeStartXRef.current = e.clientX;
            swipeStartYRef.current = e.clientY;
            swipeTriggeredRef.current = false;
        }

        reactionTimeoutRef.current = setTimeout(() => {
            openReactionMenu(messageId);
        }, 500);
    }, [openReactionMenu]);

    const handleMessagePointerMove = useCallback((msg: UserChatMessage, e: React.PointerEvent) => {
        if (!msg.imageUrl || msg.isBlinded) return;
        if (swipeTargetMessageIdRef.current !== msg.id) return;
        if (swipeStartXRef.current == null || swipeStartYRef.current == null) return;
        if (swipeTriggeredRef.current) return;

        const dx = e.clientX - swipeStartXRef.current;
        const dy = e.clientY - swipeStartYRef.current;

        // Horizontal swipe detection (right swipe).
        if (dx > 45 && Math.abs(dy) < 40) {
            swipeTriggeredRef.current = true;

            const roomIdNum = Number(roomId);
            if (!Number.isFinite(roomIdNum) || msg.id == null) return;

            const query = new URLSearchParams({
                src: msg.imageUrl,
                roomId: String(roomIdNum),
                replyToId: String(msg.id),
            });

            navigate(`/story-editor?${query.toString()}`);
        }
    }, [navigate, roomId]);

    const handleMessagePointerUp = useCallback(() => {
        if (reactionTimeoutRef.current != null) {
            clearTimeout(reactionTimeoutRef.current);
            reactionTimeoutRef.current = null;
        }

        swipeTargetMessageIdRef.current = null;
        swipeStartXRef.current = null;
        swipeStartYRef.current = null;
        swipeTriggeredRef.current = false;
    }, []);

    const allMessages = normalizeMessages([...historyMessages, ...wsMessages]);
    const slides = allMessages
.filter(msg => msg.imageUrl && !msg.isBlinded)
        .map(msg => ({ src: msg.imageUrl! }));

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

    const openPreview = (file: File) => {
        setEditError('');
        setEditRotateDeg(0);
        setEditCropSquare(false);

        if (pendingPreviewUrl) {
            URL.revokeObjectURL(pendingPreviewUrl);
        }

        const url = URL.createObjectURL(file);
        setPendingPreviewUrl(url);
        setPendingFile(file);
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPendingFile(null);
        if (pendingPreviewUrl) {
            URL.revokeObjectURL(pendingPreviewUrl);
        }
        setPendingPreviewUrl(null);
        setEditError('');
    };

    const buildEditedImageFile = async (file: File) => {
        const bitmap = await createImageBitmap(file);
        const rotate = editRotateDeg;

        // Crop rect in source bitmap space.
        let sx = 0;
        let sy = 0;
        let sw = bitmap.width;
        let sh = bitmap.height;

        if (editCropSquare) {
            const side = Math.min(bitmap.width, bitmap.height);
            sx = Math.floor((bitmap.width - side) / 2);
            sy = Math.floor((bitmap.height - side) / 2);
            sw = side;
            sh = side;
        }

        const rotated = rotate === 90 || rotate === 270;
        const outW = rotated ? sh : sw;
        const outH = rotated ? sw : sh;

        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('이미지 편집에 실패했습니다. (canvas)');

        // Move origin to center for rotation.
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate((rotate * Math.PI) / 180);

        // Draw cropped src centered.
        ctx.drawImage(bitmap, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);

        const blob: Blob | null = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/webp', 0.9);
        });

        if (!blob) {
            throw new Error('이미지 편집에 실패했습니다. (toBlob)');
        }

        const name = file.name.replace(/\.[^.]+$/, '.webp');
        return new File([blob], name, { type: 'image/webp' });
    };

    const uploadSingleImageFile = async (roomIdNum: number, senderUserId: number, file: File, replyToMessageId?: number) => {
        const { file: optimizedFile } = await downsampleImageFile(file, {
            maxWidth: 1280,
            maxHeight: 1280,
            quality: 0.82,
            mimeType: 'image/webp',
        });

        if (optimizedFile.size > MAX_UPLOAD_BYTES) {
            throw new Error('압축 후에도 파일이 10MB를 초과합니다. 더 작은 이미지를 선택해주세요.');
        }

        const filename = `chat/${roomIdNum}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        const { url: presignedUrl } = await getUploadUrl(filename, optimizedFile.size);
        await uploadToR2(presignedUrl, optimizedFile);
        const imageUrl = getPublicImageUrl(filename);

        sendMessage(roomIdNum, imageUrl, senderUserId, replyToMessageId);
    };

    const validateUploadFile = (file: File) => {
        if (file.size > MAX_UPLOAD_BYTES) {
            throw new Error('파일이 너무 커요. 10MB 이하 이미지만 업로드할 수 있어요.');
        }

        const extension = (file.name.split('.').pop() || '').toLowerCase();
        const allowedExt = new Set(['png', 'jpg', 'jpeg', 'webp']);
        if (!allowedExt.has(extension)) {
            throw new Error('지원하지 않는 이미지 형식입니다. png/jpg/jpeg/webp만 업로드할 수 있어요.');
        }
    };

    const confirmAndUpload = async () => {
        if (!pendingFile || !roomId) return;

        try {
            setEditError('');
            const roomIdNum = parseInt(roomId, 10);

            if (myUserId === null) {
                throw new Error('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            }

            setIsUploading(true);
            const senderUserId = myUserId;

            const edited = await buildEditedImageFile(pendingFile);
            validateUploadFile(edited);
            await uploadSingleImageFile(roomIdNum, senderUserId, edited, replyTarget?.id);

            setLastFailedUpload(null);
            setReplyTarget(null);
            closePreview();
        } catch (error) {
            console.error('Upload failed:', error);
            const message = error instanceof Error ? error.message : '사진 업로드에 실패했습니다.';
            setLastFailedUpload({
                file: pendingFile,
                roomIdNum: parseInt(roomId, 10),
                replyToMessageId: replyTarget?.id,
            });
            setEditError(message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !roomId) return;

        try {
            if (myUserId === null) {
                throw new Error('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            }

            const selectedFiles = Array.from(files);
            selectedFiles.forEach(validateUploadFile);
            const senderUserId = myUserId;

            if (selectedFiles.length === 1) {
                openPreview(selectedFiles[0]);
                return;
            }

            const roomIdNum = parseInt(roomId, 10);
            setIsUploading(true);

            const replyToMessageId = replyTarget?.id;
            for (const file of selectedFiles) {
                await uploadSingleImageFile(roomIdNum, senderUserId, file, replyToMessageId);
            }

            setReplyTarget(null);
            showToast(`사진 ${selectedFiles.length}장을 보냈어요.`, 'success');
        } catch (error) {
            console.error('File selection/upload failed:', error);
            const message = error instanceof Error ? error.message : '사진을 불러오지 못했습니다.';
            const firstFile = files?.[0] ?? null;
            if (firstFile) {
                setLastFailedUpload({
                    file: firstFile,
                    roomIdNum: parseInt(roomId, 10),
                    replyToMessageId: replyTarget?.id,
                });
            }
            showToast(message, 'error');
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
                {allMessages.length === 0 && !isLoadingHistory && (
                    <div style={{ textAlign: 'center', color: '#8B95A1', fontSize: '13px', margin: '16px 0' }}>
                        아직 메시지가 없어요. 첫 사진을 보내보세요.
                    </div>
                )}
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

                    const timestamp = new Date(msg.createdAt);
                    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                    return (
                        <React.Fragment key={`${msg.createdAt}-${index}`}>
                            {isNewDay && <DateDivider />}
                            <MessageBubble
                                message={msg}
                                myUserId={myUserId}
                                timeString={timeString}
                                reactionEmojis={REACTION_EMOJIS}
                                reactionMenuOpen={reactionMenuMessageId === msg.id}
                                reactionCounts={getReactionCounts(msg)}
                                onOpenReactionMenu={openReactionMenu}
                                onSetReplyTarget={setReplyTarget}
                                onPointerDown={handleMessagePointerDown}
                                onPointerMove={handleMessagePointerMove}
                                onPointerUp={handleMessagePointerUp}
                                onSelectReaction={handleReactionSelect}
                                onReportEntry={handleReportEntry}
                                onImageClick={handleImageClick}
                            />
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
                                    if (myUserId == null) {
                                        throw new Error('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
                                    }
                                    await uploadSingleImageFile(
                                        lastFailedUpload.roomIdNum,
                                        myUserId,
                                        lastFailedUpload.file,
                                        lastFailedUpload.replyToMessageId,
                                    );
                                    setLastFailedUpload(null);
                                    showToast('업로드 재시도에 성공했어요.', 'success');
                                } catch (e) {
                                    console.error('Retry upload failed:', e);
                                    const message = e instanceof Error ? e.message : '재시도에 실패했습니다.';
                                    showToast(message, 'error');
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

            {previewOpen && pendingPreviewUrl && (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        zIndex: 200,
                    }}
                    onClick={() => !isUploading && closePreview()}
                >
                    <div
                        style={{
                            width: 'min(520px, 100%)',
                            background: '#fff',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #F2F4F6'
                        }}>
                            <div style={{ fontWeight: 900, color: '#191F28' }}>전송 전 미리보기</div>
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={closePreview}
                                style={{ border: 'none', background: 'transparent', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '18px' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ padding: '14px 16px' }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: '#111',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '12px'
                            }}>
                                <img
                                    src={pendingPreviewUrl}
                                    alt="preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: editCropSquare ? 'cover' : 'contain',
                                        transform: `rotate(${editRotateDeg}deg)`,
                                        background: '#111'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                <button
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() => setEditRotateDeg((prev) => (prev === 270 ? 0 : ((prev + 90) as 0 | 90 | 180 | 270)))}
                                    style={{
                                        flex: 1,
                                        minWidth: '120px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        border: '1px solid #E5E8EB',
                                        background: '#fff',
                                        color: '#191F28',
                                        fontWeight: 800,
                                        cursor: isUploading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    ⟲ 회전
                                </button>

                                <button
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() => setEditCropSquare((prev) => !prev)}
                                    style={{
                                        flex: 1,
                                        minWidth: '120px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        border: '1px solid #E5E8EB',
                                        background: editCropSquare ? '#EAF1FF' : '#fff',
                                        color: '#191F28',
                                        fontWeight: 800,
                                        cursor: isUploading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    □ 정사각 크롭
                                </button>
                            </div>

                            {editError && (
                                <div style={{ color: '#F04452', fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>{editError}</div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    disabled={isUploading}
                                    onClick={closePreview}
                                    style={{
                                        flex: 1,
                                        height: '46px',
                                        borderRadius: '14px',
                                        border: '1px solid #E5E8EB',
                                        background: '#fff',
                                        color: '#191F28',
                                        fontWeight: 900,
                                        cursor: isUploading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmAndUpload}
                                    disabled={isUploading}
                                    style={{
                                        flex: 1,
                                        height: '46px',
                                        borderRadius: '14px',
                                        border: 'none',
                                        background: isUploading ? '#B0B8C1' : '#3182F6',
                                        color: '#fff',
                                        fontWeight: 900,
                                        cursor: isUploading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isUploading ? '전송 중…' : '전송'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    {replyTarget ? '답장할 사진(여러 장 가능)을 보내세요' : '사진으로만 대화할 수 있어요 (여러 장 선택 가능)'}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple
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

            {toast != null && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: 'fixed',
                        left: '50%',
                        bottom: 'max(18px, env(safe-area-inset-bottom))',
                        transform: 'translateX(-50%)',
                        zIndex: 260,
                        background: toast.kind === 'success' ? 'rgba(25, 31, 40, 0.92)' : 'rgba(255, 59, 48, 0.92)',
                        color: '#fff',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                        maxWidth: 'min(520px, calc(100% - 32px))',
                        fontSize: '13px',
                        fontWeight: 600,
                    }}
                >
                    {toast.message}
                </div>
            )}

            <ReportConfirmDialog
                open={reportConfirmMessageId != null}
                isReporting={isReporting}
                onClose={() => setReportConfirmMessageId(null)}
                onConfirm={confirmReport}
            />

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
