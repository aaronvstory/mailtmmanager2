# Project Rules Documentation

## File Organization Rules
1. React components must be in `src/components/`
2. API and data fetching logic must be in `src/lib/`
3. Page components must be in `src/pages/`
4. Utility functions must be in `src/lib/utils.ts`
5. Type definitions should be co-located with their components unless shared

## Naming Conventions
1. Component files must use PascalCase (e.g., `AccountSwitcher.tsx`)
2. Utility files must use camelCase (e.g., `api.ts`)
3. Test files must end with `.test.tsx` or `.test.ts`
4. Component props interfaces must be named `{ComponentName}Props`
5. Hook files must start with `use` (e.g., `useAuth.ts`)

## Component Rules
1. Each component must have a clear, single responsibility
2. Components must be properly typed with TypeScript
3. Props must have interface definitions
4. Large components should be split into smaller sub-components
5. Components must implement proper loading states

## State Management Rules
1. Use Jotai for UI state
2. Use TanStack Query for server state
3. Implement proper error boundaries
4. Use proper query key structure for TanStack Query
5. Implement proper cache invalidation strategies

## API Integration Rules
1. All API calls must use the MailTMClient class
2. API responses must be validated with Zod schemas
3. Implement proper error handling for all API calls
4. Use proper TypeScript types for API responses
5. Implement proper loading states for async operations

## Styling Rules
1. Use Tailwind CSS for styling
2. Follow mobile-first responsive design
3. Maintain dark mode compatibility
4. Use the `cn` utility for class merging
5. Keep styles modular and component-specific

## Testing Rules
1. Implement unit tests for utilities
2. Implement integration tests for API client
3. Implement component tests for user interactions
4. Use proper test descriptions
5. Mock external dependencies appropriately

## Documentation Rules
1. Add JSDoc comments for public functions
2. Document complex business logic
3. Keep README updated
4. Document environment setup
5. Add inline comments for complex code sections

## Performance Rules
1. Implement proper code splitting
2. Use React.lazy for route-based code splitting
3. Optimize re-renders with proper hooks
4. Implement list virtualization for large datasets
5. Use proper caching strategies

## Security Rules
1. Sanitize user inputs
2. Implement proper CORS policies
3. Use proper Content Security Policy
4. Follow OWASP security guidelines
5. Implement proper authentication flows

## Next Steps
1. Switch to Code mode to create the actual `.clinerules` file
2. Implement these rules in the codebase
3. Set up linting and formatting to enforce these rules
4. Create documentation for the development workflow
5. Set up CI/CD pipelines to validate rule compliance
