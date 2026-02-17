import React from 'react';
import { Button, Text } from '@toss/tds-mobile';
import { UserIcon } from '../icons';
import type { UserChatMessage } from '../../types/api';
import { MessageType } from '../../types/api';

type ReactionCount = { emoji: string; count: number };

type MessageBubbleProps = {
    message: UserChatMessage;
    myUserId: number | null;
    timeString: string;
    reactionEmojis: string[];
    reactionMenuOpen: boolean;
    reactionCounts: ReactionCount[];
    onOpenReactionMenu: (messageId: number | undefined) => void;
    onSetReplyTarget: (message: UserChatMessage) => void;
    onPointerDown: (messageId: number | undefined, e?: React.PointerEvent) => void;
    onPointerMove: (message: UserChatMessage, e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onSelectReaction: (messageId: number | undefined, emoji: string) => void;
    onReportEntry: (messageId: number | undefined) => void;
    onImageClick: (imageUrl: string) => void;
};

export function MessageBubble({
    message,
    myUserId,
    timeString,
    reactionEmojis,
    reactionMenuOpen,
    reactionCounts,
    onOpenReactionMenu,
    onSetReplyTarget,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onSelectReaction,
    onReportEntry,
    onImageClick,
}: MessageBubbleProps) {
    const isMyMessage = message.sender.id === myUserId;
    const isBlinded = message.isBlinded === true;
    const canRenderImage = !!message.imageUrl && !isBlinded;
    const shouldRenderBlindPlaceholder = isBlinded || (message.type === MessageType.CHAT && !message.imageUrl);

    return (
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
                    backgroundImage: message.sender.image ? `url(${message.sender.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden'
                }}>
                    {!message.sender.image && <UserIcon size={20} color="#B0B8C1" />}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMyMessage ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                {!isMyMessage && (
                    <span style={{ fontSize: '12px', color: '#6B7684', marginBottom: '4px', marginLeft: '2px' }}>
                        {message.sender.nickname || message.sender.username}
                    </span>
                )}

                <div
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onOpenReactionMenu(message.id);
                    }}
                    onDoubleClick={() => onSetReplyTarget(message)}
                    onPointerDown={(e) => onPointerDown(message.id, e)}
                    onPointerMove={(e) => onPointerMove(message, e)}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}
                    style={{
                        borderRadius: isMyMessage ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                        overflow: 'hidden',
                        boxShadow: isMyMessage ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.04)',
                        backgroundColor: isMyMessage ? '#3182F6' : '#F2F4F6',
                        color: isMyMessage ? '#fff' : '#333d4b',
                        touchAction: 'pan-y',
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                    }}
                >
                    {message.replyToId != null && (
                        <div style={{
                            padding: '8px 10px',
                            fontSize: '12px',
                            opacity: 0.9,
                            borderBottom: isMyMessage ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.06)'
                        }}>
                            ↪ 답장 (replyToId: {message.replyToId})
                        </div>
                    )}
                    {shouldRenderBlindPlaceholder && (
                        <div style={{
                            padding: '12px 14px',
                            backgroundColor: isMyMessage ? 'rgba(0,0,0,0.15)' : 'rgba(0, 27, 55, 0.06)',
                        }}>
                            <Text
                                display="block"
                                color={isMyMessage ? 'grey50' : 'grey700'}
                                typography="st13"
                                fontWeight="medium"
                            >
                                블라인드 처리된 메시지입니다
                            </Text>
                        </div>
                    )}
                    {canRenderImage && message.imageUrl && (
                        <img
                            src={message.imageUrl}
                            alt="Chat"
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ display: 'block', maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => message.imageUrl && onImageClick(message.imageUrl)}
                        />
                    )}
                    {reactionCounts.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '6px',
                            justifyContent: 'flex-end',
                            padding: '6px 8px',
                            fontSize: '11px',
                            color: isMyMessage ? 'rgba(255,255,255,0.9)' : '#8B95A1'
                        }}>
                            {reactionCounts.map(item => (
                                <span
                                    key={`${message.id}-${item.emoji}`}
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
                {reactionMenuOpen && (
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
                        {reactionEmojis.map(emoji => (
                            <button
                                key={emoji}
                                type="button"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => onSelectReaction(message.id, emoji)}
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
                        <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)', margin: '0 2px' }} />
                        <div onPointerDown={(e) => e.stopPropagation()}>
                            <Button
                                size="small"
                                color="danger"
                                variant="weak"
                                onClick={() => onReportEntry(message.id)}
                            >
                                신고
                            </Button>
                        </div>
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
    );
}
