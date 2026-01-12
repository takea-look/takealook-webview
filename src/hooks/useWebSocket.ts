import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketTicket } from '../api/chat';
import type { UserChatMessage } from '../types/api';
import { getAccessToken } from '../api/client';

const WS_BASE_URL = 'wss://s1.takealook.my';

interface UseWebSocketResult {
  messages: UserChatMessage[];
  isConnected: boolean;
  sendMessage: (roomId: number, imageUrl: string, senderId: number, replyToId?: number) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useWebSocket(): UseWebSocketResult {
  const [messages, setMessages] = useState<UserChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const connectFnRef = useRef<(() => Promise<void>) | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }

      console.log('[WS] Requesting ticket...');
      const { ticket } = await getWebSocketTicket();
      console.log('[WS] Got ticket:', ticket);
      
      const wsUrl = `${WS_BASE_URL}/chat?ticket=${ticket}`;
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

        if (event.code !== 1000) {
          console.log('Reconnecting in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectFnRef.current?.();
          }, 3000);
        }
      };
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connectFnRef.current = connect;
  }, [connect]);

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
