import type { ChatRoom, ChatRoomCreation, UserChatMessage, WsTicket } from '../types/api';
import { apiRequest } from './client';

export async function getChatRooms(): Promise<ChatRoom[]> {
  return apiRequest<ChatRoom[]>('/chat/rooms');
}

export async function createChatRoom(payload: ChatRoomCreation): Promise<ChatRoom> {
  return apiRequest<ChatRoom>('/chat/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getChatMessages(
  roomId: number,
  options?: {
    limit?: number;
    before?: number; // messageId or createdAt cursor (server spec TBD)
  }
): Promise<UserChatMessage[]> {
  const query = new URLSearchParams({ roomId: String(roomId) });
  if (options?.limit != null) query.set('limit', String(options.limit));
  if (options?.before != null) query.set('before', String(options.before));
  return apiRequest<UserChatMessage[]>(`/chat/messages?${query.toString()}`);
}

export async function getWebSocketTicket(): Promise<WsTicket> {
  return apiRequest<WsTicket>('/chat/ticket', {
    method: 'POST',
  });
}

export async function reportChatMessage(
  messageId: number,
  payload?: {
    reason?: string;
  },
): Promise<void> {
  // NOTE: Report endpoint is not currently exposed in Swagger (s1.takealook.my/v3/api-docs).
  // Based on BE contract in issue #55: call POST /report.
  await apiRequest<void>('/report', {
    method: 'POST',
    body: JSON.stringify({ messageId, reason: payload?.reason ?? null }),
  });
}
