export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface WebhookBody {
  typeWebhook: string;
  instanceData: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp: number;
  idMessage: string;
  senderData: {
    chatId: string;
    sender: string;
    senderName?: string;
    senderContactName?: string;
  };
  messageData: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
}

export interface ReceiveMessageResponse {
  receiptId: number;
  body: WebhookBody;
}

export interface ChatInfo {
  archive: boolean;
  id: string;
  notSpam: boolean;
  ephemeralExpiration: number;
  ephemeralSettingTimestamp: number;
  name?: string;
  lastMessageTime?: number;
}

export interface BaseMessage {
  idMessage: string;
  timestamp: number;
  type: "outgoing" | "incoming";
  chatId: string;
}

export interface ExtendedWebhookBody extends BaseMessage {
  textMessage?: string;
  extendedTextMessage?: {
    text: string;
  };
  senderData?: {
    sender: string;
  };
}

export type ChatHistoryMessage = WebhookBody & Partial<ExtendedWebhookBody>;
