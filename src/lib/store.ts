import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { z } from 'zod';
import type { Message, User } from './api';

// Types
export interface Category {
  id: string;
  name: string;
  keywords: string[];
}

export interface StoredMessage extends Message {
  categoryIds: string[];
  archived: boolean;
  localStorageId?: string;
}

export interface StoredAccount {
  id: string;
  email: string;
  token: string;
  lastActive: string;
}

export interface EmailFilter {
  id: string;
  name: string;
  conditions: {
    field: 'sender' | 'subject' | 'content' | 'date';
    operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'before' | 'after';
    value: string;
  }[];
  action: 'archive' | 'categorize' | 'mark-read';
  actionValue?: string;
  enabled: boolean;
}

// Theme State
export const themeAtom = atomWithStorage<'dark' | 'light'>('theme', 'dark');

// Storage Atoms
export const categoriesAtom = atomWithStorage<Category[]>('categories', [
  {
    id: 'adjustments',
    name: 'Adjustments',
    keywords: ['adjustment', 'modify', 'change'],
  },
  {
    id: 'confirmations',
    name: 'Confirmations',
    keywords: ['confirm', 'verification', 'approved'],
  },
]);

export const pinnedAddressesAtom = atomWithStorage<string[]>('pinnedAddresses', []);
export const storedMessagesAtom = atomWithStorage<StoredMessage[]>('storedMessages', [] as StoredMessage[]);
export const emailFiltersAtom = atomWithStorage<EmailFilter[]>('emailFilters', []);

// Auth State
export const authTokenAtom = atomWithStorage<string | null>('authToken', null);
export const currentUserAtom = atom<User | null>(null);

// Multi-account support
export const storedAccountsAtom = atomWithStorage<StoredAccount[]>('storedAccounts', []);
export const activeAccountAtom = atomWithStorage<string | null>('activeAccount', null);

// UI State
export const selectedMessageIdAtom = atom<string | null>(null);
export const searchQueryAtom = atom('');
export const filterDrawerOpenAtom = atom(false);
