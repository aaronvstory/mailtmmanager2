# System Patterns and Architectural Decisions

## State Management Patterns

### Client State (Jotai)
- Use atoms for UI state that doesn't need persistence
- Use atomWithStorage for state that needs to persist across sessions
- Keep atoms small and focused on specific features

### Server State (TanStack Query)
- Use queries for data fetching with proper caching
- Implement optimistic updates for better UX
- Structure query keys hierarchically: ['emails', emailId]
- Define stale times based on data volatility

## Component Patterns

### Component Organization
```tsx
// Standard component structure
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  // Props interface
}

export function Component({ ...props }: ComponentProps) {
  // Implementation
}
```

### Component Guidelines
1. Use function components with TypeScript interfaces
2. Implement proper loading states and error boundaries
3. Keep components focused and single-responsibility
4. Use composition over inheritance
5. Implement proper prop validation

## API Integration Patterns

### Error Handling
```typescript
try {
  const response = await api.request()
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific API errors
  } else {
    // Handle unexpected errors
  }
}
```

### Authentication Flow
1. Store tokens securely using httpOnly cookies
2. Implement token refresh mechanism
3. Handle unauthorized responses globally
4. Clear session on logout

## Testing Patterns
- Unit tests for utility functions
- Integration tests for API client
- Component tests for user interactions
- Use MSW for API mocking

## Form Handling
- Use Zod for form validation
- Create reusable form components
- Implement proper error messaging
- Use controlled components for complex forms

## Styling Guidelines
- Use Tailwind utility classes with consistent patterns
- Create reusable class combinations using cn utility
- Follow mobile-first responsive design
- Maintain dark mode compatibility

## Performance Patterns
- Implement proper code splitting
- Use React.lazy for route-based splitting
- Optimize re-renders with useMemo/useCallback
- Implement proper list virtualization for large datasets

## Security Practices
- Sanitize user inputs
- Implement proper CORS policies
- Use proper Content Security Policy
- Follow OWASP security guidelines

## Code Organization
```
src/
  components/        # Reusable UI components
    ui/             # Basic UI elements
    forms/          # Form-related components
    layout/         # Layout components
  lib/              # Core utilities and API
  features/         # Feature-specific code
  pages/            # Route components
  hooks/            # Custom React hooks
  types/            # TypeScript types
  styles/           # Global styles
```

## Git Workflow
- Use conventional commits
- Create feature branches
- Implement proper PR reviews
- Keep commits focused and atomic

## Documentation
- Document complex business logic
- Add JSDoc comments for public APIs
- Keep README updated
- Document environment setup
