export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
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

export const MessageType = {
  CHAT: 'CHAT',
  JOIN: 'JOIN',
  LEAVE: 'LEAVE'
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export interface UserChatMessage {
  roomId: number;
  sender: UserProfile;
  type?: MessageType;
  imageUrl?: string;
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

export interface TossLoginRequest {
  authorizationCode: string;
  referrer: 'DEFAULT' | 'SANDBOX';
}

export interface TossUserInfo {
  userKey: number;
  scope: string;
  agreedTerms: string[];
  policy: string;
  certTxId?: string;
  name: string | null;
  phone: string | null;
  birthday: string | null;
  ci: string | null;
  di: string | null;
  gender: string | null;
  nationality: string | null;
  email: string | null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutByUserKeyRequest {
  userKey: number;
}
