import type { ChatRoom, UserChatMessage, WsTicket } from '../types/api';
import { apiRequest } from './client';

export async function getChatRooms(): Promise<ChatRoom[]> {
  return apiRequest<ChatRoom[]>('/chat/rooms');
}

export async function getChatMessages(roomId: number): Promise<UserChatMessage[]> {
  return apiRequest<UserChatMessage[]>(`/chat/messages?roomId=${roomId}`);
}

export async function getWebSocketTicket(): Promise<WsTicket> {
  return apiRequest<WsTicket>('/chat/ticket', {
    method: 'POST',
  });
}
