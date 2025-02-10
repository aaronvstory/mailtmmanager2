import axios, { AxiosError } from "axios";
import { z } from "zod";

const API_BASE_URL = "https://api.mail.tm";

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
/**
 * MailTMClient class for interacting with the mail.TM API.
 */
class MailTMClient {
  private token: string | null = null;
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000, // 10 second timeout
  });

  /**
   * Handles API errors and throws a new error with a user-friendly message.
   * @param error The error object.
   * @throws Error
   */
  private handleError(error: unknown): never {
    let message = "An unknown error occurred";

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      message = axiosError.message;

      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Data:", axiosError.response.data);
        console.error("Status:", axiosError.response.status);
        console.error("Headers:", axiosError.response.headers);

        if (typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'hydra:description' in axiosError.response.data) {
          message = axiosError.response.data['hydra:description'] as string;
        } else {
          message = `Request failed with status code ${axiosError.response.status}`;
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        message = "No response received from the server";
        console.error("Request:", axiosError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        message = "Error setting up the request";
        console.error("Error:", axiosError.message);
      }
      console.error("Config:", axiosError.config);
    } else if (error instanceof Error) {
      // Generic error
      message = error.message;
      console.error(error.message);
    }

    console.error("API Error:", error);
    this.clearToken();
    throw new Error(message);
  }

  /**
   * Sets the authentication token for the client.
   * @param token The authentication token.
   */
  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Clears the authentication token from the client.
   */
  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common["Authorization"];
  }

  /**
   * Logs in to the mail.TM API and returns the authentication token.
   * @param address The email address.
   * @param password The password.
   * @returns The authentication token.
   * @throws Error
   */
  async login(address: string, password: string): Promise<string> {
    try {
      const response = await this.client.post<{ token: string }>("/token", {
        address,
        password,
      });
      const token = response.data.token;
      this.setToken(token);
      return token;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Creates a new account on the mail.TM API.
   * @param address The email address.
   * @param password The password.
   * @returns The new user object.
   * @throws Error
   */
  async createAccount(address: string, password: string): Promise<User> {
    try {
      const response = await this.client.post<{
        id: string;
        address: string;
        quota: number;
        used: number;
        isDisabled: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
      }>("/accounts", { address, password });
      return UserSchema.parse(response.data);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gets the current account information from the mail.TM API.
   * @returns The current user object.
   * @throws Error
   */
  async getAccount(): Promise<User> {
    try {
      const response = await this.client.get<{
        id: string;
        address: string;
        quota: number;
        used: number;
        isDisabled: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
      }>("/me");
      return UserSchema.parse(response.data);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Deletes the current account from the mail.TM API.
   * @throws Error
   */
  async deleteAccount(): Promise<void> {
    try {
      await this.client.delete("/me");
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gets the available domains from the mail.TM API.
   * @returns An array of available domains.
   * @throws Error
   */
  async getDomains(): Promise<Domain[]> {
    try {
      const response = await this.client.get<{ "hydra:member": Domain[] }>(
        "/domains",
        {
          params: { "page-size": 100 },
        }
      );
      return response.data["hydra:member"];
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gets the messages from the mail.TM API.
   * @param page The page number.
   * @returns An object containing the messages and the total number of items.
   * @throws Error
   */
  async getMessages(page = 1): Promise<{ messages: Message[]; total: number }> {
    try {
      const response = await this.client.get<{
        "hydra:member": Message[];
        "hydra:totalItems": number;
      }>("/messages", {
        params: { page, "page-size": 20 },
      });
      return {
        messages: response.data["hydra:member"],
        total: response.data["hydra:totalItems"],
      };
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gets a specific message from the mail.TM API.
   * @param id The ID of the message.
   * @returns The message object.
   * @throws Error
   */
  async getMessage(id: string): Promise<Message> {
    try {
      const response = await this.client.get<Message>(`/messages/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deletes a specific message from the mail.TM API.
   * @param id The ID of the message.
   * @throws Error
   */
  async deleteMessage(id: string): Promise<void> {
    try {
      await this.client.delete(`/messages/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Marks a specific message as seen on the mail.TM API.
   * @param id The ID of the message.
   * @returns The updated message object.
   * @throws Error
   */
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

  /**
   * Filters messages based on a keyword.
   * @param keyword The keyword to filter messages by.
   * @returns An array of messages that match the keyword.
   * @throws Error
   */
  async filterMessages(keyword: string): Promise<Message[]> {
    try {
      const response = await this.getMessages();
      const messages = response.messages.filter((message) => {
        const subject = message.subject || "";
        const intro = message.intro || "";
        return (
          subject.toLowerCase().includes(keyword.toLowerCase()) ||
          intro.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      return messages;
    } catch (error: any) {
      this.handleError(error);
      return [];
    }
  }
}

export const mailTM = new MailTMClient();
