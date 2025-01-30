import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  status: "sending" | "sent" | "error";
}

interface MessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageStatus: React.FC<{ status: Message["status"] }> = ({ status }) => {
  switch (status) {
    case "sending":
      return <Clock className="w-4 h-4 text-gray-400" />;
    case "sent":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const Messages: React.FC<MessagesProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${
            msg.sender === "me" ? "message-outgoing" : "message-incoming"
          }`}
        >
          <div
            className={`message-bubble ${
              msg.sender === "me"
                ? "message-bubble-outgoing"
                : "message-bubble-incoming"
            }`}
          >
            {msg.sender !== "me" && (
              <span className="text-sm font-medium text-whatsapp-green">
                {msg.sender}
              </span>
            )}
            <p>{msg.text}</p>
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              {msg.sender === "me" && <MessageStatus status={msg.status} />}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
