1. Project Overview
    - Create a modular email wrapper around the mail.tm API
    - Focus on user registration/authentication, real-time notifications, and extended email retention
    - Provide a modern, responsive UI with robust error handling and security (OWASP Top 10, rate limiting)

2. Core Features
    - Secure Account Management: Support multiple accounts with seamless switching
    - RESTful API Endpoints: Clear docs for mailbox creation, email listing, retrieval, and deletion
    - Local Storage & Organization: Retain emails locally, organize by folders, pin, sort, and bulk delete
    - Dark Mode & Theme Persistence: Default dark mode, user toggle, smooth transitions

3. Detailed Requirements
    - Real-Time Notifications: WebSockets/Server-Sent Events for new mail alerts
    - Keyword-Based Categorization: Automatic classification with user-defined rules
    - Extended Email Management: EML/MBOX export, auto-archiving, batch actions
    - Optional Enhancements: Advanced search, attachment handling, custom filters/themes

4. Implementation Steps
    - Architecture & Tech Stack: Choose a modern framework (React, Vue, or Angular) with a secure backend
    - Multi-Account Handling: Store tokens securely, switch states instantly without re-login
    - Customizable Categories: Add/edit/delete categories, store in local or server DB, display across UI
    - Settings & Debugging: Create a dedicated page for theme preferences, account details, notification configs; verify state persists after refresh

5. Goals & Next Steps
    - Deliver a secure, performant standalone email client
    - Refine theme and account switching for stable user experience
    - Integrate advanced filtering and local storage enhancements
    - Ensure thorough testing and clean documentation

End of Summary


# Modular Email Management Web Application

## Project Overview
The goal is to create a **cutting-edge, modular email management system** leveraging the **mail.tm API**, ensuring enhanced user experience, robust functionality, and security. This web app will act as a wrapper around mail.tm, adding features like real-time email notifications, intuitive organization, custom email filtering, dark mode, and multi-account management. Key focus will be on security, performance, and scalability.

---

## Core Features

### 1. **User Registration and Authentication**
- **Secure Registration**: Allow users to create accounts with a username/email and password, ensuring secure password storage (hashing and salting).
- **User Login/Logout**: Implement login/logout functionality with optional email verification.
- **Multi-Account Support**: Enable users to log into multiple accounts simultaneously and switch between them without logging out.

### 2. **Programmatic API Access (RESTful)**
- **API Endpoints**: Create endpoints for common actions like:
  - Creating and deleting mailboxes.
  - Listing emails with pagination.
  - Fetching individual emails (including attachments).
  - Deleting emails.
  - Quota checking.
- **API Documentation**: Provide comprehensive documentation for users and developers with clear request/response formats and error codes.

### 3. **Real-Time Email Notifications**
- **Push Notifications**: Implement real-time email notifications using WebSockets or Server-Sent Events.
- **User Settings**: Allow users to customize notification preferences (enable/disable notifications, sounds, etc.).

### 4. **Email Storage and Management** (Core Goal) - we need to be able to store beyond the 20 email limitation as is the case from official MAIL.TM API
- **Local Storage**: Implement local storage for emails, extending retention beyond the mail.tm API's default retention limits.
- **Email Organization**:
  - Support multiple mailboxes.
  - Implement pinning, sorting by date, and custom folder creation.
  - Bulk email deletion.

### 5. **Email Filtering System** (Core Goal) - be able to filter by, for example, keyword "adjustments" show only emails that contain adjustments
- **Custom Filters**: Allow users to filter incoming emails based on criteria such as sender, subject, content, and date.
- **Save Filters**: Provide functionality for saving and managing custom filter presets.
- **Auto-Filtering**: Allow filters to be applied automatically to incoming emails or manually by the user.

### 6. **User Interface (UI/UX)**
- **Modern Design**: Create a clean, responsive, and aesthetically pleasing UI that works seamlessly across devices.
- **Email Display**: Clearly display email details like sender, subject, date, and formatted body content.
- **Intuitive Navigation**: Easy navigation between mailboxes, folders, and individual emails.
- **Keyword-Based Categorization**: Categorize emails based on specified keywords (e.g., "adjustments" -> "Adjustments" category).

### 7. **Security & Best Practices**
- **Authentication**: Follow best practices for authentication and authorization (OAuth, JWT tokens, etc.).
- **Data Encryption**: Ensure sensitive data, including locally stored emails and user credentials, is encrypted.
- **OWASP Best Practices**: Protect against common vulnerabilities such as XSS, CSRF, and SQL injection.
- **Rate Limiting**: Implement rate limiting to prevent abuse of the API.

---

## Technical Requirements and Considerations

### 1. **Modular Architecture**
- **Modularity**: Ensure the app architecture is modular to allow for scalability and future feature additions.
- **Performance**: Optimize email fetching, UI rendering, and background tasks for a fast user experience.
- **Scalability**: Design the system to handle growing numbers of users and emails efficiently.

### 2. **Technology Stack Suggestions**
- **Frontend**: Use a modern JS framework like React, Vue.js, or Angular for a dynamic and responsive UI.
- **Backend**: Use Node.js (with Express.js) or Python (with Flask/Django) for handling API requests and user management.
- **Database**: Use SQLite for simpler local storage needs or PostgreSQL/MySQL for more complex backends.
- **Real-Time Notifications**: WebSockets, Server-Sent Events, or Firebase Cloud Messaging (consider browser compatibility).

---

## Optional Features (Stretch Goals)

1. **Advanced Search**: Implement advanced search by sender, subject, date, and keywords.
2. **Attachment Handling**: Add features to preview, download, or manage email attachments.
3. **Custom Themes**: Enable user customization of the app’s appearance (light/dark mode).

---

## Implementation Steps

### 1. **Account Switching**
- **Multiple Account Support**: Allow users to log in to multiple accounts and switch between them with persistent state using local storage.
- **UI**: Create a dropdown menu or UI element for switching accounts quickly.

### 2. **Dark Mode**
- **Default Dark Mode**: Set the app's theme to dark by default with a smooth transition for theme switching.
- **User Preferences**: Store the user’s theme preference in local storage to persist across sessions.

### 3. **Category Management**
- **Editable Categories**: Allow users to create, edit, and delete email categories or folders.
- **Persistent Storage**: Store user-created categories in local storage or a backend database for persistence.
- **Integration with Email Display**: Allow emails to be categorized and filtered by user-defined categories.

### 4. **Storage Management**
- **Extended Email Retention**: Implement functionality for storing emails beyond the default retention period of mail.tm.
- **Exporting and Importing**: Add support for exporting emails in EML/MBOX format and batch import/export.
- **Auto-Archiving**: Provide options for auto-archiving important emails and storage management tools.

---

## Debugging & Testing

1. **Theme Persistence**:
   - Verify theme application and state management.
   - Ensure dark mode persists across sessions and UI components update accordingly.

2. **Account Switching**:
   - Ensure smooth switching between accounts with proper session handling.
   - Resolve any issues with token storage, authentication, and session persistence.

---

## Next Steps

1. **Design & Architecture**: Create a design document specifying the architecture, UI/UX components, and API endpoints.
2. **Feature Implementation**: Start with core features like account management, real-time notifications, email filtering, and storage management, then progress to optional features.
3. **Testing**: Test for performance, usability, security, and cross-device compatibility.

IMPORTANT: OFFICIAL DOCUMENTATION FOR MAIL.TM API:
https://docs.mail.tm/
