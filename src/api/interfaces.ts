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
