export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface UserProfile {
  id: number;
  username: string;
  nickname?: string;
  image?: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  isPublic: boolean;
  maxParticipants: number;
  createdAt: number;
}

export interface ChatMessage {
  id?: number;
  roomId: number;
  senderId: number;
  imageUrl: string;
  replyToId?: number;
  createdAt: number;
}

export interface UserChatMessage {
  roomId: number;
  sender: UserProfile;
  imageUrl: string;
  replyToId?: number;
  createdAt: number;
}

export interface WsTicket {
  ticket: string;
  expiresIn: number;
}

export interface PresignedUrlResponse {
  url: string;
}
