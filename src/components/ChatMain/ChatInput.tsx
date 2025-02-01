import { memo, useState, useCallback, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = memo(({ onSend }: ChatInputProps) => {
  console.log("ChatInput render");
  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (newMessage.trim()) {
      onSend(newMessage.trim());
      setNewMessage("");
    }
  }, [newMessage, onSend]);

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
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
