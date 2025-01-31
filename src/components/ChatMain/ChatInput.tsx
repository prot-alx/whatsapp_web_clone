import { Send } from "lucide-react";
import { memo } from "react";

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput = memo(
  ({ newMessage, onMessageChange, onSend }: ChatInputProps) => {
    return (
      <div className="whatsapp-input-container">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Введите сообщение"
            className="whatsapp-message-input"
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />
          <button onClick={onSend} className="whatsapp-send-button ">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
);

export default ChatInput;
