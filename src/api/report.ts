import { apiRequest } from './client';

export type ReportChatMessageRequest = {
  roomId: number;
  messageId: number;
  reason?: string;
};

// NOTE: Backend endpoint is not documented in Swagger as of 2026-02-16.
// Issue #55 assumes `POST /report` exists. We send both roomId and messageId for forward-compat.
export async function reportChatMessage(payload: ReportChatMessageRequest): Promise<void> {
  await apiRequest<void>('/report', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
