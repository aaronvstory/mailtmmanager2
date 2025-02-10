import { StoredMessage } from './store';

const STORAGE_PREFIX = 'mail_storage_';
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

/**
 * EmailStorage class for managing email storage in local storage.
 */
export class EmailStorage {
  private static METADATA_KEY = `${STORAGE_PREFIX}metadata`;
  private static MAX_STORAGE = 50 * 1024 * 1024; // 50MB limit

  /**
   * Saves data to local storage in chunks.
   * @param data The data to save.
   * @returns An array of chunk IDs.
   */
  private static async saveChunks(data: string): Promise<string[]> {
    const chunks: string[] = [];
    let offset = 0;
    const id = crypto.randomUUID();

    while (offset < data.length) {
      const chunk = data.slice(offset, offset + CHUNK_SIZE);
      const chunkId = `${STORAGE_PREFIX}${id}_${chunks.length}`;
      localStorage.setItem(chunkId, chunk);
      chunks.push(chunkId);
      offset += CHUNK_SIZE;
    }

    return chunks;
  }

  /**
   * Loads data from local storage from chunks.
   * @param chunkIds An array of chunk IDs.
   * @returns The loaded data.
   */
  private static async loadChunks(chunkIds: string[]): Promise<string> {
    return chunkIds
      .map(id => localStorage.getItem(id) || '')
      .join('');
  }

  /**
   * Saves a message to local storage.
   * @param message The message to save.
   */
  static async saveToLocal(message: StoredMessage): Promise<void> {
    const metadata = this.getMetadata();
    const messageData = JSON.stringify(message);
    
    // Save message in chunks
    const chunkIds = await this.saveChunks(messageData);
    
    // Update metadata
    metadata.messages.push({
      id: message.id,
      chunkIds,
      createdAt: new Date().toISOString(),
      size: messageData.length,
    });
    
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }

  /**
   * Gets a stored message from local storage.
   * @param id The ID of the message.
   * @returns The stored message, or null if not found.
   */
  static async getStoredMessage(id: string): Promise<StoredMessage | null> {
    const metadata = this.getMetadata();
    const messageMetadata = metadata.messages.find(m => m.id === id);
    
    if (!messageMetadata) return null;
    
    const messageData = await this.loadChunks(messageMetadata.chunkIds);
    return JSON.parse(messageData);
  }

  /**
   * Gets all stored messages from local storage.
   * @returns An array of stored messages.
   */
  static async getAllStoredMessages(): Promise<StoredMessage[]> {
    const metadata = this.getMetadata();
    const messages: StoredMessage[] = [];

    for (const messageMetadata of metadata.messages) {
      const messageData = await this.loadChunks(messageMetadata.chunkIds);
      messages.push(JSON.parse(messageData));
    }

    return messages;
  }

  /**
   * Exports a message to EML format.
   * @param message The message to export.
   * @returns The EML content.
   */
  static async exportToEML(message: StoredMessage): Promise<string> {
    const headers = [
      `From: ${message.from.address}`,
      `To: ${message.to.map(t => t.address).join(', ')}`,
      `Subject: ${message.subject}`,
      `Date: ${message.createdAt}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      message.intro
    ];

    return headers.join('\r\n');
  }

  /**
   * Exports messages to MBOX format.
   * @param messages The messages to export.
   * @returns The MBOX content.
   */
  static async exportToMBOX(messages: StoredMessage[]): Promise<string> {
    return messages
      .map(message => 
        `From ${message.from.address} ${message.createdAt}\r\n` +
        `From: ${message.from.address}\r\n` +
        `To: ${message.to.map(t => t.address).join(', ')}\r\n` +
        `Subject: ${message.subject}\r\n` +
        `Date: ${message.createdAt}\r\n` +
        '\r\n' +
        `${message.intro}\r\n` +
        '\r\n'
      )
      .join('\r\n');
  }

  /**
   * Imports a message from EML content.
   * @param emlContent The EML content.
   * @returns A partial StoredMessage object.
   */
  static async importFromEML(emlContent: string): Promise<Partial<StoredMessage>> {
    const lines = emlContent.split(/\r?\n/);
    const headers: Record<string, string> = {};
    const bodyLines: string[] = [];
    let isBody = false;

    for (const line of lines) {
      if (!isBody && line === '') {
        isBody = true;
        continue;
      }

      if (!isBody) {
        const match = line.match(/^([\w-]+):\s*(.*)$/);
        if (match) {
          headers[match[1].toLowerCase()] = match[2]];
        }
      } else {
        bodyLines.push(line);
      }
    }

    return {
      from: { address: headers.from },
      to: headers.to?.split(/,\s*/).map(address => ({ address })) || [],
      subject: headers.subject || '',
      intro: bodyLines.join('\n'),
      createdAt: headers.date || new Date().toISOString(),
    };
  }

  /**
   * Gets storage information.
   * @returns An object containing storage information.
   */
  static getStorageInfo(): {
    used: number;
    total: number;
    messages: number;
  } {
    const metadata = this.getMetadata();
    const used = metadata.messages.reduce((total, msg) => total + msg.size, 0);
    
    return {
      used,
      total: this.MAX_STORAGE,
      messages: metadata.messages.length,
    };
  }

  /**
   * Gets the metadata from local storage.
   * @returns The metadata object.
   */
  private static getMetadata(): {
    messages: Array<{
      id: string;
      chunkIds: string[];
      createdAt: string;
      size: number;
    }>;
  } {
    const stored = localStorage.getItem(this.METADATA_KEY);
    return stored ? JSON.parse(stored) : { messages: [] };
  }

  /**
   * Cleans up orphaned chunks in local storage.
   */
  static async cleanup(): Promise<void> {
    const metadata = this.getMetadata();
    const prefix = new RegExp(`^${STORAGE_PREFIX}`);
    
    // Get all storage keys
    const allKeys = Object.keys(localStorage).filter(key => prefix.test(key));
    
    // Get all valid chunk IDs from metadata
    const validChunkIds = new Set(
      metadata.messages.flatMap(msg => msg.chunkIds)
    );
    
    // Remove orphaned chunks
    allKeys.forEach(key => {
      if (key !== this.METADATA_KEY && !validChunkIds.has(key)) {
        localStorage.removeItem(key);
      }
    });
  }
}
