import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketTicket } from '../api/chat';
import type { UserChatMessage } from '../types/api';
import { getAccessToken } from '../api/client';

const WS_BASE_URL = 'wss://s1.takealook.my';

interface UseWebSocketResult {
  messages: UserChatMessage[];
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  lastError: string | null;
  sendMessage: (roomId: number, imageUrl: string, senderId: number, replyToId?: number) => void;
  connect: (roomId: number) => Promise<void>;
  disconnect: () => void;
}

export function useWebSocket(): UseWebSocketResult {
  const [messages, setMessages] = useState<UserChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<UseWebSocketResult['connectionStatus']>('disconnected');
  const [lastError, setLastError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const currentRoomIdRef = useRef<number | null>(null);
  const isConnectingRef = useRef(false);

  const reconnectAttemptRef = useRef(0);
  const lastDisconnectReasonRef = useRef<string | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    lastDisconnectReasonRef.current = 'User disconnected';
    reconnectAttemptRef.current = 0;

    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    currentRoomIdRef.current = null;
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(async function connect(roomId: number) {
    try {
      if (isConnectingRef.current) {
        console.log('[WS] Already connecting, skipping duplicate connect() call');
        return;
      }

      // Clear any pending reconnect when user (re)connects explicitly.
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        const existingState = wsRef.current.readyState;
        if (existingState === WebSocket.OPEN || existingState === WebSocket.CONNECTING) {
          console.log('[WS] Closing existing connection before reconnecting');
          lastDisconnectReasonRef.current = 'Reconnecting';
          wsRef.current.close(1000, 'Reconnecting');
          wsRef.current = null;
        }
      }

      const token = getAccessToken();
      if (!token) {
        console.error('No access token available');
        setLastError('No access token available');
        setConnectionStatus('disconnected');
        return;
      }

      isConnectingRef.current = true;
      currentRoomIdRef.current = roomId;
      setLastError(null);

      // If we already tried before, we're reconnecting.
      setConnectionStatus(reconnectAttemptRef.current > 0 ? 'reconnecting' : 'connecting');

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
        setConnectionStatus('connected');
        reconnectAttemptRef.current = 0;
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

      ws.onerror = () => {
        // Browser provides limited error detail for WebSocket errors.
        setLastError('WebSocket error');
        isConnectingRef.current = false;
      };

      ws.onclose = (event) => {
        console.log('[WS] Closed | Session ID:', sessionId, '| Code:', event.code, '| Reason:', event.reason);
        setIsConnected(false);
        wsRef.current = null;
        isConnectingRef.current = false;

        // Normal close: user-initiated or intentional close.
        if (event.code === 1000) {
          setConnectionStatus('disconnected');
          return;
        }

        // Unexpected disconnect → retry with exponential backoff (cap).
        if (currentRoomIdRef.current !== null) {
          reconnectAttemptRef.current += 1;
          const attempt = reconnectAttemptRef.current;
          const baseDelayMs = 1000;
          const maxDelayMs = 15000;
          const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
          const jitter = Math.floor(Math.random() * 300);
          const waitMs = delay + jitter;

          setConnectionStatus('reconnecting');
          setLastError(event.reason || 'Disconnected');

          console.log(`[WS] Reconnecting in ${waitMs}ms... (attempt ${attempt})`);
          const reconnectRoomId = currentRoomIdRef.current;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect(reconnectRoomId);
          }, waitMs);
        } else {
          setConnectionStatus('disconnected');
        }
      };
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setLastError('Failed to connect WebSocket');
      setIsConnected(false);
      setConnectionStatus('disconnected');
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
    connectionStatus,
    lastError,
    sendMessage,
    connect,
    disconnect,
  };
}
