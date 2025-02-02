import { sendMessage } from "../../api/api";
import { Credentials } from "../../api/interfaces";
import { Message } from "../types";

interface UseSendMessageProps extends Credentials {
  chatId: string;
}

export const useSendMessage = ({ idInstance, apiTokenInstance, chatId }: UseSendMessageProps) => {
  const send = async (
    text: string,
    addMessage: (msg: Message) => void,
    updateMessageStatus: (id: string, status: Message["status"]) => void
  ): Promise<boolean> => {
    if (!chatId || !text.trim()) return false;

    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      sender: "me",
      text: text.trim(),
      timestamp: Date.now(),
      status: "sending",
    };

    addMessage(newMessage);

    try {
      await sendMessage({ idInstance, apiTokenInstance }, chatId, text);
      updateMessageStatus(messageId, "sent");
      return true;
    } catch {
      updateMessageStatus(messageId, "error");
      return false;
    }
  };

  return { send };
};