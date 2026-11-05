export interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}

export interface NotificationMessage {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  title: string;
  body: string;
  createdAt: string;
}

export interface WsError {
  code: string;
  message: string;
}

export type WsStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';
