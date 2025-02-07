# Mail.TM Manager Product Context

## Overview
A React-based wrapper application for the mail.TM API service that provides temporary/disposable email functionality. The application allows users to create, manage, and interact with temporary email accounts through a modern web interface.

## Core Features
- Account management (create/delete temporary email accounts)
- Email inbox viewing and management
- Multi-account support with account switching
- Dark/light theme support
- Email filtering and organization

## Technical Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**:
  - Jotai for local state
  - TanStack Query for server state
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API Integration**: Axios
- **Data Validation**: Zod
- **UI Components**: Custom components with Lucide React icons

## Architecture

### Core Components
1. **API Layer** (`src/lib/api.ts`)
   - MailTMClient class handling all API interactions
   - Type-safe API responses using Zod schemas
   - Authentication token management

2. **State Management**
   - User session management
   - Email data caching and synchronization
   - Theme preferences

3. **UI Components**
   - AccountSwitcher: Multi-account management
   - EmailFilters: Email organization
   - Layout: Application structure
   - Sidebar: Navigation
   - ThemeToggle: Appearance management

4. **Pages**
   - Login: User authentication
   - Register: New account creation
   - Inbox: Email management

## API Integration
The application integrates with mail.TM's REST API:
- Base URL: https://api.mail.tm
- Authentication: Bearer token
- Key Endpoints:
  - /token (Authentication)
  - /accounts (Account management)
  - /messages (Email operations)
  - /domains (Available email domains)

## Data Models
1. **User**
   - Account information
   - Usage quotas
   - Status flags

2. **Message**
   - Email content and metadata
   - Attachment handling
   - Read/unread status

3. **Domain**
   - Available email domains
   - Domain status and properties
