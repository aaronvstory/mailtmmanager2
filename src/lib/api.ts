import axios from "axios";
import { AxiosError } from 'axios';
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

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: string;
}

export type MessageResponse = {
  id: string;
  from: { address: string };
  subject: string;
  intro: string;
  createdAt: string;
  seen: boolean;
};

interface HydraError {
  "hydra:description"?: string;
}

// API Client
/**
 * MailTMClient class for interacting with the mail.TM API.
 */
class MailTMClient {
  #token: string | null = null;
  private readonly client = axios.create({
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
    const axiosError = error as AxiosError<HydraError>;
    if (axiosError.isAxiosError) {
      if (axiosError.response) {
        const hydraError = axiosError.response.data;
        if (hydraError?.["hydra:description"]) {
          throw new Error(hydraError["hydra:description"]);
        }
        throw new Error(
          `Request failed with status code ${axiosError.response.status}`
        );
      } else if (axiosError.request) {
        throw new Error("No response received from the server");
      }
      throw new Error("Error setting up the request");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unknown error occurred");
  }

  /**
   * Sets the authentication token for the client.
   * @param token The authentication token.
   */
  setToken(token: string): void {
    this.#token = token;
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Clears the authentication token from the client.
   */
  clearToken(): void {
    this.#token = null;
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Gets the available domains from the mail.TM API.
   * @returns An array of available domains.
   * @throws Error
   */
  async getDomains(): Promise<{ data: Domain[] }> {
    try {
      const response = await this.client.get<{ "hydra:member": Domain[] }>(
        "/domains",
        {
          params: { "page-size": 100 },
        }
      );
      return { data: response.data["hydra:member"] };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Gets the messages from the mail.TM API.
   * @param page The page number.
   * @returns An object containing the messages and the total number of items.
   * @throws Error
   */
  async getMessages(page = 1): Promise<ApiResponse<MessageResponse[]>> {
    try {
      const response = await this.client.get<{
        "hydra:member": MessageResponse[];
        "hydra:totalItems": number;
      }>("/messages", {
        params: { page, "page-size": 20 },
      });
      return {
        data: response.data["hydra:member"],
        message: "Messages retrieved successfully",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Gets a specific message from the mail.TM API.
   * @param id The ID of the message.
   * @returns The message object.
   * @throws Error
   */
  async getMessage(id: string): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await this.client.get<MessageResponse>(
        `/messages/${id}`
      );
      return {
        data: response.data,
        message: "Message retrieved successfully",
      };
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  /**
   * Filters messages based on a keyword.
   * @param keyword The keyword to filter messages by.
   * @returns An array of messages that match the keyword.
   * @throws Error
   */
  async filterMessages(keyword: string): Promise<MessageResponse[]> {
    try {
      const response = await this.getMessages();
      return response.data.filter((message) => {
        const subject = message.subject || "";
        const intro = message.intro || "";
        return (
          subject.toLowerCase().includes(keyword.toLowerCase()) ||
          intro.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Gets the current authentication token.
   * @returns The authentication token.
   */
  getToken(): string | null {
    return this.#token;
  }
}

// Export the client instance
export const mailTM = new MailTMClient();
