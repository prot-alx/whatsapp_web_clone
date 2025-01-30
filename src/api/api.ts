import axios from "axios";
import {
  SendMessageResponse,
  ReceiveMessageResponse,
  Credentials,
} from "./interfaces";

const BASE_URL = "https://api.green-api.com";

const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.statusText || "Ошибка на сервере");
    }
    throw new Error("Проверьте корректность вводимых данных");
  }
  throw new Error("Неизвестная ошибка");
};

export const sendMessage = async (
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string
): Promise<SendMessageResponse> => {
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const response = await axios.post(url, {
      chatId: `${chatId}@c.us`,
      message,
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const receiveMessage = async (
  idInstance: string,
  apiTokenInstance: string
): Promise<ReceiveMessageResponse | null> => {
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=20`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const deleteNotification = async (
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number
): Promise<void> => {
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    await axios.delete(url);
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const authenticate = async (
  credentials: Credentials
): Promise<{ success: boolean; message: string }> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      return { success: true, message: "Аутентификация прошла успешно" };
    }

    return {
      success: false,
      message: response.statusText || "Неизвестная ошибка",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.statusText || "Ошибка на сервере",
        };
      }
      return {
        success: false,
        message: "Проверьте корректность вводимых данных",
      };
    }
    return { success: false, message: "Неизвестная ошибка" };
  }
};
