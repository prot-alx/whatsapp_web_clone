export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  status: "sending" | "sent" | "error";
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
