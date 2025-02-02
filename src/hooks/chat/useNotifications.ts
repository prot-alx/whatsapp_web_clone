import { useEffect } from "react";
import { receiveMessage, deleteNotification } from "../../api/api";
import { Credentials } from "../../api/interfaces";
import { Message } from "../types";


interface UseNotificationsProps extends Credentials {
  onNewMessage: (msg: Message) => void;
}

export const useNotifications = ({
  idInstance,
  apiTokenInstance,
  onNewMessage,
}: UseNotificationsProps) => {
  useEffect(() => {
    let isSubscribed = true;
    let pollingTimeout: number | null = null;
    const abortController = new AbortController();

    const processNotification = async () => {
      if (!idInstance || !apiTokenInstance || !isSubscribed) return;

      try {
        const notification = await receiveMessage(
          { idInstance, apiTokenInstance },
          { signal: abortController.signal }
        );

        if (notification && isSubscribed) {
          const { body, receiptId } = notification;

          if (body.typeWebhook === "incomingMessageReceived") {
            const textMessage = body.messageData?.textMessageData?.textMessage;

            if (textMessage && body.senderData) {
              const message: Message = {
                id: `${body.timestamp}-${Math.random()}`,
                sender: body.senderData.senderName ?? body.senderData.sender,
                text: textMessage,
                timestamp: body.timestamp * 1000,
                status: "sent",
              };
              onNewMessage(message);
            }
          }

          await deleteNotification(
            { idInstance, apiTokenInstance },
            receiptId,
            { signal: abortController.signal }
          );
        }

        if (isSubscribed) {
          processNotification();
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        pollingTimeout = window.setTimeout(processNotification, 10000);
      }
    };

    processNotification();

    return () => {
      isSubscribed = false;
      if (pollingTimeout) clearTimeout(pollingTimeout);
      abortController.abort();
    };
  }, [idInstance, apiTokenInstance, onNewMessage]);
};
