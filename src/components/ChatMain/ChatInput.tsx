import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage.trim());
      setNewMessage("");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <div className="whatsapp-input-container">
      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение"
          className="whatsapp-message-input"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="whatsapp-send-button">
          <SendHorizontal className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

ChatInput.displayName = "ChatInput";
export default ChatInput;
