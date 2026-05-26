import api from './api';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const contactService = {
  async submitMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    const response = await api.post('/contact/messages', data);
    return response.data;
  },

  async getMessages(page: number = 0, size: number = 20): Promise<any> {
    const response = await api.get(`/contact/messages?page=${page}&size=${size}`);
    return response.data;
  },

  async markAsRead(messageId: number): Promise<void> {
    await api.put(`/contact/messages/${messageId}/read`);
  },
};
