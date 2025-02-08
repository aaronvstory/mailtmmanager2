import axios from 'axios';
import { z } from 'zod';

const API_BASE_URL = 'https://api.mail.tm';

// API Types
export const UserSchema = z.object({
  id: z.string(),
  address: z.string().email(),
  quota: z.number(),
  used: z.number(),
  isDisabled: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MessageSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  msgid: z.string(),
  from: z.object({
    address: z.string().email(),
    name: z.string().optional(),
  }),
  to: z.array(
    z.object({
      address: z.string().email(),
      name: z.string().optional(),
    })
  ),
  subject: z.string(),
  intro: z.string(),
  seen: z.boolean(),
  isDeleted: z.boolean(),
  hasAttachments: z.boolean(),
  size: z.number(),
  downloadUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DomainSchema = z.object({
  id: z.string(),
  domain: z.string(),
  isActive: z.boolean(),
  isPrivate: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Domain = z.infer<typeof DomainSchema>;

// API Client
class MailTMClient {
  private token: string | null = null;
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
  });

  // TODO: Revisit and improve error handling. Simplified for now to bypass type errors.
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      this.clearToken();
    }
    console.error('API Error:', error);
    throw error;
  }

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Auth
  async login(address: string, password: string): Promise<string> {
    try {
      const response = await this.client.post<{ token: string }>('/token', { address, password });
      const token = response.data.token;
      this.setToken(token);
      return token;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Account
  async createAccount(address: string, password: string): Promise<User> {
    try {
      const response = await this.client.post<{ id: string; address: string; quota: number; used: number; isDisabled: boolean; isDeleted: boolean; createdAt: string; updatedAt: string; }>('/accounts', { address, password });
      return UserSchema.parse(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAccount(): Promise<User> {
    try {
      const response = await this.client.get<{ id: string; address: string; quota: number; used: number; isDisabled: boolean; isDeleted: boolean; createdAt: string; updatedAt: string; }>('/me');
      return UserSchema.parse(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.client.delete('/me');
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Domains
  async getDomains(): Promise<Domain[]> {
    try {
      const response = await this.client.get<{ 'hydra:member': Domain[] }>('/domains', {
        params: { 'page-size': 100 },
      });
      return response.data['hydra:member'];
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Messages
  async getMessages(page = 1): Promise<{ messages: Message[]; total: number }> {
    try {
      const response = await this.client.get<{ 'hydra:member': Message[], 'hydra:totalItems': number }>('/messages', {
        params: { page, 'page-size': 20 },
      });
      return {
        messages: response.data['hydra:member'],
        total: response.data['hydra:totalItems'],
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMessage(id: string): Promise<Message> {
    try {
      const response = await this.client.get<Message>(`/messages/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      await this.client.delete(`/messages/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async markMessageAsSeen(id: string): Promise<Message> {
    try {
      const response = await this.client.patch<Message>(`/messages/${id}`, {
        seen: true,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const mailTM = new MailTMClient();