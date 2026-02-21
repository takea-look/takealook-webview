import { useEffect, useState } from 'react';

const DEBUG_AUTH_FLOW = import.meta.env.VITE_DEBUG_AUTH_FLOW === 'true';
const EVENT_NAME = 'takealook:auth-debug-log';
const MAX_LOGS = 120;

type AuthDebugEntry = {
  ts: string;
  message: string;
  data?: Record<string, unknown>;
};

declare global {
  interface Window {
    __TAKEALOOK_AUTH_DEBUG_LOGS__?: AuthDebugEntry[];
  }
}

export function logAuthDebug(message: string, data: Record<string, unknown> = {}): void {
  if (!DEBUG_AUTH_FLOW) return;

  const entry: AuthDebugEntry = {
    ts: new Date().toISOString(),
    message,
    data,
  };

  const logs = window.__TAKEALOOK_AUTH_DEBUG_LOGS__ ?? [];
  logs.push(entry);
  if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
  window.__TAKEALOOK_AUTH_DEBUG_LOGS__ = logs;

  console.debug('[takealook/auth-debug]', message, data);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: entry }));
}

export function useAuthDebugLogs(): AuthDebugEntry[] {
  const [logs, setLogs] = useState<AuthDebugEntry[]>(() => window.__TAKEALOOK_AUTH_DEBUG_LOGS__ ?? []);

  useEffect(() => {
    if (!DEBUG_AUTH_FLOW) return;

    const onLog = () => {
      setLogs([...(window.__TAKEALOOK_AUTH_DEBUG_LOGS__ ?? [])]);
    };

    window.addEventListener(EVENT_NAME, onLog as EventListener);
    return () => window.removeEventListener(EVENT_NAME, onLog as EventListener);
  }, []);

  return logs;
}

export const isAuthDebugEnabled = DEBUG_AUTH_FLOW;
