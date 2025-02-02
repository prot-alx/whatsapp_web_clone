import axios from "axios";
import {
  SendMessageResponse,
  ReceiveMessageResponse,
  Credentials,
  ChatInfo,
  ChatHistoryMessage,
} from "./interfaces";

const BASE_URL = "https://api.green-api.com";

export const sendMessage = async (
  credentials: Credentials,
  chatId: string,
  message: string
): Promise<SendMessageResponse> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const response = await axios.post<SendMessageResponse>(url, {
      chatId: `${chatId}`,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Данные запроса при ошибке:", {
      chatId,
      containsSuffix: chatId.includes("@c.us"),
      fullError: error,
    });

    if (axios.isAxiosError(error)) {
      throw new Error(
        `Ошибка отправки сообщения: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
};

export const receiveMessage = async (
  credentials: Credentials,
  options?: { signal?: AbortSignal }
): Promise<ReceiveMessageResponse | null> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`;

    const response = await axios.get<ReceiveMessageResponse>(url, {
      signal: options?.signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return null;
    }

    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка получения сообщения:",
        error.response?.data || error.message
      );
    } else {
      console.error("Неизвестная ошибка:", error);
    }
    return null;
  }
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number,
  options?: { signal?: AbortSignal }
): Promise<void> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

    await axios.delete(url, {
      signal: options?.signal,
    });
  } catch (error) {
    if (axios.isCancel(error)) {
      // При отмене запроса не выбрасываем ошибку, т.к. сами его отменили
      return;
    }

    if (axios.isAxiosError(error)) {
      throw new Error(
        `Ошибка удаления уведомления: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
};

export const authenticate = async (
  credentials: Credentials
): Promise<{ success: boolean; message: string }> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;
    await axios.get(url);

    return {
      success: true,
      message: "Аутентификация прошла успешно",
    };
  } catch (error) {
    console.error("Ошибка аутентификации:", error);
    return {
      success: false,
      message: "Ошибка аутентификации",
    };
  }
};

export const getChatHistory = async (
  credentials: Credentials,
  chatId: string,
  count: number
): Promise<ChatHistoryMessage[]> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`;
    const response = await axios.post<ChatHistoryMessage[]>(url, {
      chatId,
      count,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Ошибка при получении истории чата: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
};

export const getChats = async (
  credentials: Credentials
): Promise<ChatInfo[]> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/getChats/${apiTokenInstance}`;
    const response = await axios.get<ChatInfo[]>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Ошибка при получении списка чатов: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
};
