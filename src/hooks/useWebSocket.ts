import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketTicket } from '../api/chat';
import type { UserChatMessage } from '../types/api';
import { getAccessToken } from '../api/client';

const WS_BASE_URL = 'wss://s1.takealook.my';

interface UseWebSocketResult {
  messages: UserChatMessage[];
  isConnected: boolean;
  sendMessage: (roomId: number, imageUrl: string, senderId: number, replyToId?: number) => void;
  connect: (roomId: number) => Promise<void>;
  disconnect: () => void;
}

export function useWebSocket(): UseWebSocketResult {
  const [messages, setMessages] = useState<UserChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const currentRoomIdRef = useRef<number | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    currentRoomIdRef.current = null;
  }, []);

  const connect = useCallback(async (roomId: number) => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }

      currentRoomIdRef.current = roomId;

      console.log('[WS] Requesting ticket...');
      const { ticket } = await getWebSocketTicket();
      console.log('[WS] Got ticket:', ticket);
      
      const wsUrl = `${WS_BASE_URL}/chat?ticket=${ticket}&roomId=${roomId}`;
      console.log('[WS] Connecting to:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        console.log('[WS] Received message:', event.data);
        try {
          const message: UserChatMessage = JSON.parse(event.data);
          console.log('[WS] Parsed message:', message);
          setMessages(prev => [...prev, message]);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        if (event.code !== 1000 && currentRoomIdRef.current !== null) {
          console.log('Reconnecting in 3 seconds...');
          const reconnectRoomId = currentRoomIdRef.current;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect(reconnectRoomId);
          }, 3000);
        }
      };
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback((roomId: number, imageUrl: string, senderId: number, replyToId?: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    const message = {
      roomId,
      senderId,
      imageUrl,
      replyToId: replyToId || null,
      createdAt: Date.now(),
    };

    console.log('[WS] Sending message:', message);
    wsRef.current.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    messages,
    isConnected,
    sendMessage,
    connect,
    disconnect,
  };
}
