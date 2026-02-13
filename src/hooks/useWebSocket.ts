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
  const isConnectingRef = useRef(false);

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
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(async function connect(roomId: number) {
    try {
      if (isConnectingRef.current) {
        console.log('[WS] Already connecting, skipping duplicate connect() call');
        return;
      }

      if (wsRef.current) {
        const existingState = wsRef.current.readyState;
        if (existingState === WebSocket.OPEN || existingState === WebSocket.CONNECTING) {
          console.log('[WS] Closing existing connection before reconnecting');
          wsRef.current.close(1000, 'Reconnecting');
          wsRef.current = null;
        }
      }

      const token = getAccessToken();
      if (!token) {
        console.error('No access token available');
        return;
      }

      isConnectingRef.current = true;
      currentRoomIdRef.current = roomId;

      console.log('[WS] Requesting ticket...');
      const { ticket } = await getWebSocketTicket();
      console.log('[WS] Got ticket:', ticket);
      
      const wsUrl = `${WS_BASE_URL}/chat?ticket=${ticket}&roomId=${roomId}`;
      const sessionId = Math.random().toString(36).substring(2, 9);
      console.log('[WS] Connecting to:', wsUrl, '| Session ID:', sessionId);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Connected | Session ID:', sessionId);
        setIsConnected(true);
        isConnectingRef.current = false;
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
        isConnectingRef.current = false;
      };

      ws.onclose = (event) => {
        console.log('[WS] Closed | Session ID:', sessionId, '| Code:', event.code, '| Reason:', event.reason);
        setIsConnected(false);
        wsRef.current = null;
        isConnectingRef.current = false;

        if (event.code !== 1000 && currentRoomIdRef.current !== null) {
          console.log('[WS] Reconnecting in 3 seconds...');
          const reconnectRoomId = currentRoomIdRef.current;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect(reconnectRoomId);
          }, 3000);
        }
      };
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setIsConnected(false);
      isConnectingRef.current = false;
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
