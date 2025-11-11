import axiosInstance from "@/lib/axios";

export interface Message {
  _id: string;
  chatId: string;
  accountId: string;
  content: string;
  role: "user" | "assistant";
  model?: string;
  mediaType?: string | null;
  mediaUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface Chat {
  _id: string;
  title: string;
  messageCount: number;
}

export interface GetChatsResponse {
  success: boolean;
  message: string;
  data: Chat[];
}

export interface GetMessagesResponse {
  success: boolean;
  message: string;
  data: Message[];
}

export interface SendMessageResponse {
  chatId: string;
  userMessage: Message;
  assistantMessage: Message;
}

export interface SendMessageData {
  content: string;
}

export interface CreateChatData {
  content: string;
  mediaType?: string;
  mediaUrl?: string;
}

export interface SendImageData {
  image: File;
  content: string;
}

// Service xử lý chat
export const chatService = {
  // Lấy danh sách chat
  async getChats(): Promise<GetChatsResponse> {
    const response = await axiosInstance.get<GetChatsResponse>("/chats");
    return response.data;
  },

  // Lấy lịch sử tin nhắn của một chat
  async getMessages(chatId: string): Promise<GetMessagesResponse> {
    const response = await axiosInstance.get<GetMessagesResponse>(
      `/chats/${chatId}/messages`
    );
    return response.data;
  },

  // Gửi tin nhắn vào chat đã có
  async sendMessage(
    chatId: string,
    data: SendMessageData
  ): Promise<SendMessageResponse> {
    const response = await axiosInstance.post<SendMessageResponse>(
      `/chats/${chatId}/messages`,
      data
    );
    return response.data;
  },

  // Tạo chat mới và gửi tin nhắn đầu tiên
  async createChat(data: CreateChatData): Promise<SendMessageResponse> {
    const response = await axiosInstance.post<SendMessageResponse>(
      "/chats/new/messages",
      data
    );
    return response.data;
  },

  // Gửi ảnh vào chat
  async sendImage(
    chatId: string,
    data: SendImageData
  ): Promise<SendMessageResponse> {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("content", data.content);

    const response = await axiosInstance.post<SendMessageResponse>(
      `/chats/${chatId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
