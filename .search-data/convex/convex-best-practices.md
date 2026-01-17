# Convex Best Practices - Comprehensive Guide

**Last Updated:** January 17, 2026

## Table of Contents
- [Official Best Practices](#official-best-practices)
- [Schema Design Best Practices](#schema-design-best-practices)
- [Query & Mutation Patterns](#query--mutation-patterns)
- [Authentication & Security](#authentication--security)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [Real-Time Data Management](#real-time-data-management)
- [Type Safety & TypeScript](#type-safety--typescript)
- [Testing & Debugging](#testing--debugging)
- [Deployment & Production](#deployment--production)
- [Code Organization](#code-organization)

---

## Official Best Practices

### 1. The Zen of Convex
- **Source:** [Convex Developer Hub](https://docs.convex.dev/understanding/zen)
- **Philosophy:**
  - Embrace the "pit of success"
  - Let Convex handle complexity
  - Trust the reactive system
  - Keep functions simple
  - Leverage type safety
- **Key Principles:**
  - Declarative over imperative
  - Reactive data flow
  - End-to-end type safety
  - Automatic reactivity
  - Serverless mindset

### 2. Best Practices Guide
- **Source:** [Convex Developer Hub - Best Practices](https://docs.convex.dev/understanding/best-practices/)
- **Core Areas:**
  - Database query optimization
  - Function organization
  - Validation techniques
  - Security guidelines
  - Scalability principles

### 3. Other Recommendations
- **Source:** [Convex Developer Hub - Additional Recommendations](https://docs.convex.dev/understanding/best-practices/other-recommendations)
- **Topics:**
  - TypeScript usage patterns
  - Helper functions
  - Database patterns
  - UI optimization

---

## Schema Design Best Practices

### Core Principles

#### 4. Schema Philosophy
- **Source:** [Convex Developer Hub - Schema Philosophy](https://docs.convex.dev/database/advanced/schema-philosophy)
- **Key Concepts:**
  - Define schemas with `defineTable`
  - Leverage TypeScript inference
  - Implicit field type tracking
  - Document structure design
- **Best Practices:**
  - Design schemas with scalability in mind
  - Use meaningful field names
  - Plan for data relationships
  - Consider query patterns upfront

#### 5. Relationship Structures
- **Source:** [Stack by Convex - Relationship Structures](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas)
- **Patterns:**
  - Embedding vs referencing
  - Denormalization strategies
  - Index usage
  - Query optimization
- **Recommendations:**
  - Keep relationships simple
  - Use indexes effectively
  - Consider read/write patterns
  - Balance normalization and performance

### Schema Design Tips

#### 6. Essential Schema Tips
- **Source:** [Schemets Blog - 10 Essential Tips](https://schemets.com/blog/10-convex-developer-tips-pitfalls-productivity)
- **Key Points:**
  - Embrace end-to-end type safety from day one
  - Design schema with `defineTable` for scalability
  - Think about data access patterns
  - Use TypeScript to enforce schema
- **Common Pitfalls:**
  - Over-normalization
  - Ignoring index requirements
  - Not planning for growth
  - Complex relationships

#### 7. Opinionated Guidelines (Community Gist)
- **Source:** [GitHub Gist - srizvi](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339)
- **Covered Topics:**
  - Database schema design
  - Query patterns
  - Mutation strategies
  - Real-world examples
- **Community Best Practices:**
  - Schema-first development
  - Type-driven design
  - Incremental complexity
  - Test-driven development

### Schema Examples

#### Good Schema Design
```typescript
// Define clear, typed schemas
const messages = defineTable({
  body: v.string(),
  author: v.id("users"),
  channel: v.id("channels"),
  timestamp: v.number(),
})
  .index("by_channel", ["channel"])
  .index("by_author", ["author"]);
```

#### Schema Evolution
- Start simple, add complexity as needed
- Use non-nullable fields when possible
- Plan for migrations
- Version your schema changes

---

## Query & Mutation Patterns

### Query Best Practices

#### 8. Queries that Scale
- **Source:** [Stack by Convex - Queries that Scale](https://stack.convex.dev/queries-that-scale)
- **Optimization Techniques:**
  - Use indexes effectively
  - Limit query results
  - Avoid N+1 queries
  - Leverage pagination
- **Common Pitfalls:**
  - Not using indexes
  - Fetching too much data
  - Complex query logic
  - Ignoring pagination

#### 9. Query Organization
- **Source:** [Best Practices Guide](https://docs.convex.dev/understanding/best-practices/)
- **Patterns:**
  - Keep queries focused
  - Use descriptive names
  - Combine related data
  - Cache appropriately
- **Structure:**
  - Separate concerns
  - Reusable query functions
  - Clear naming conventions
  - Type-safe parameters

### Mutation Patterns

#### 10. Mutation Best Practices
- **From:** [Best Practices Guide](https://docs.convex.dev/understanding/best-practices/)
- **Guidelines:**
  - Keep mutations focused
  - Validate inputs
  - Use transactions appropriately
  - Handle errors gracefully
- **Patterns:**
  - Single responsibility
  - Atomic operations
  - Clear side effects
  - Idempotent when possible

### Function Organization

#### 11. Organizing Convex Functions
- **Source:** [Other Recommendations](https://docs.convex.dev/understanding/best-practices/other-recommendations)
- **Structure:**
  - Group by domain
  - Separate queries, mutations, actions
  - Use clear file organization
  - Modular design
- **Example Structure:**
  ```
  convex/
    ├── schema.ts
    ├── users.ts
    ├── messages.ts
    ├── channels.ts
    └── auth.ts
  ```

---

## Authentication & Security

### Authentication Patterns

#### 12. Clerk Integration Best Practices
- **Source:** [Medium - Keval Rabadiya](https://medium.com/@kevalrabadiya27/supercharging-your-next-js-app-with-convex-database-and-clerk-authentication-318cb1bbe046)
- **Patterns:**
  - Use Clerk for authentication
  - Sync user data with Convex
  - Validate on both client and server
  - Handle token refresh
- **Security:**
  - Never expose secrets
  - Validate user identity
  - Use secure storage
  - Implement proper logout

#### 13. Webhook Authentication
- **Source:** [Kinde Engineering Blog](https://kinde.com/blog/engineering/kinde-with-convex-webhooks-to-realtime-data/)
- **Best Practices:**
  - Verify webhook signatures
  - Use HTTPS only
  - Implement retry logic
  - Log security events
- **Data Sync:**
  - Keep user data in sync
  - Handle updates atomically
  - Use webhooks for changes
  - Maintain data consistency

### Security Guidelines

#### 14. Security Best Practices
- **From Official Documentation:**
  - Always validate inputs
  - Use `ctx.auth.getUserId()` for authorization
  - Implement proper access control
  - Never trust client data
- **Authorization Patterns:**
  - Check user permissions
  - Validate ownership
  - Use roles appropriately
  - Audit sensitive operations

---

## Performance Optimization

### Query Performance

#### 15. Scaling Techniques
- **Source:** [Queries that Scale](https://stack.convex.dev/queries-that-scale)
- **Strategies:**
  - Use composite indexes
  - Implement pagination
  - Cache frequently accessed data
  - Optimize read patterns
- **Index Usage:**
  - Create indexes for common queries
  - Use compound indexes wisely
  - Monitor index usage
  - Remove unused indexes

#### 16. Real-Time Performance
- **Source:** [Building Scalable Apps](https://dev.to/tuhin114/unlocking-backend-simplicity-building-scalable-apps-with-convex-3bnk)
- **Techniques:**
  - Optimize subscription counts
  - Batch updates when possible
  - Use debouncing for UI
  - Implement efficient reactivity
- **Best Practices:**
  - Minimize query complexity
  - Use selective subscriptions
  - Avoid excessive re-renders
  - Monitor performance metrics

### Database Optimization

#### 17. Database Patterns
- **Source:** [Best Practices Guide](https://docs.convex.dev/understanding/best-practices/)
- **Optimization:**
  - Choose appropriate data types
  - Use indexes strategically
  - Denormalize when needed
  - Plan for scale
- **Performance:**
  - Monitor query performance
  - Profile slow operations
  - Use pagination
  - Implement caching

---

## Error Handling

### Error Handling Best Practices

#### 18. Error Handling Guide
- **Source:** [Convex Developer Hub - Error Handling](https://docs.convex.dev/functions/error-handling/)
- **Key Practices:**
  - Use `ConvexError` for expected errors
  - Implement error boundaries
  - Provide meaningful error messages
  - Log errors appropriately
- **Patterns:**
  ```typescript
  // Always use ConvexError
  throw new ConvexError({
    message: "User not found",
    code: "NOT_FOUND",
  });
  ```

#### 19. Common Error Patterns
- **From Community Examples:**
  - Validate inputs before processing
  - Handle network errors gracefully
  - Implement retry logic
  - Show user-friendly messages
- **Best Practices:**
  - Never expose sensitive information
  - Use appropriate HTTP status codes
  - Implement proper logging
  - Monitor error rates

### Debugging Techniques

#### 20. Debugging Guide
- **Source:** [Convex Developer Hub - Debugging](https://docs.convex.dev/functions/debugging)
- **Techniques:**
  - Use `debugger;` statements
  - Exercise functions from tests
  - Check browser console
  - Use Convex dashboard
- **Workflow:**
  - Reproduce locally
  - Add logging
  - Check data flow
  - Verify types

---

## Real-Time Data Management

### Real-Time Best Practices

#### 21. Real-Time Database Guide
- **Source:** [Stack by Convex - Real-Time Database](https://stack.convex.dev/real-time-database)
- **Principles:**
  - Trust the reactive system
  - Use `useQuery` for automatic updates
  - Let Convex handle subscriptions
  - Avoid manual polling
- **Common Issues:**
  - Stale cache → Use reactive queries
  - State drift → Use transactional mutations
  - Sync bugs → Trust the system

#### 22. Collaboration Patterns
- **Source:** [Keeping Users in Sync](https://stack.convex.dev/keeping-real-time-users-in-sync-convex)
- **Best Practices:**
  - Use optimistic updates
  - Handle conflicts gracefully
  - Implement proper locking
  - Show real-time presence
- **Patterns:**
  - Sticky notes example
  - Collaborative editing
  - Real-time notifications
  - Multi-user sync

### Subscription Management

#### 23. Subscription Best Practices
- **From Community Experience:**
  - Subscribe to minimal data
  - Unsubscribe when done
  - Use pagination for large sets
  - Implement efficient updates
- **Performance:**
  - Monitor subscription count
  - Optimize query complexity
  - Batch updates
  - Debounce UI updates

---

## Type Safety & TypeScript

### TypeScript Best Practices

#### 24. End-to-End Type Safety
- **Source:** [Schemets Blog - 10 Essential Tips](https://schemets.com/blog/10-convex-developer-tips-pitfalls-productivity)
- **Key Points:**
  - Embrace type safety from day one
  - Let TypeScript infer types
  - Define clear interfaces
  - Use strict mode
- **Benefits:**
  - Catch errors at compile time
  - Better IDE support
  - Self-documenting code
  - Refactoring confidence

#### 25. Type Safety Patterns
- **From Official Documentation:**
  - Use `v.id()` for document references
  - Define function arguments clearly
  - Leverage type inference
  - Avoid `any` types
- **Example:**
  ```typescript
  // Define types explicitly
  export const getMessage = query({
    args: { messageId: v.id("messages") },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.messageId);
    },
  });
  ```

---

## Testing & Debugging

### Testing Strategies

#### 26. Testing Best Practices
- **From Debugging Guide:**
  - Exercise functions from tests
  - Test edge cases
  - Mock external dependencies
  - Verify error handling
- **Patterns:**
  - Unit test functions
  - Integration test flows
  - Test real-time behavior
  - Verify type safety

#### 27. Debugging Workflow
- **Source:** [Debugging Guide](https://docs.convex.dev/functions/debugging)
- **Process:**
  1. Use debugger statements
  2. Check browser console
  3. Verify data flow
  4. Test in isolation
- **Tools:**
  - Convex dashboard
  - Browser DevTools
  - TypeScript compiler
  - Network inspector

---

## Deployment & Production

### Production Best Practices

#### 28. Deployment Guidelines
- **From Official Documentation:**
  - Use environment variables
  - Implement proper logging
  - Monitor performance metrics
  - Set up alerts
- **Considerations:**
  - Error tracking
  - Performance monitoring
  - Usage analytics
  - Backup strategies

#### 29. Scaling Preparation
- **Source:** [Building Scalable Apps](https://dev.to/tuhin114/unlocking-backend-simplicity-building-scalable-apps-with-convex-3bnk)
- **Practices:**
  - Design for scale from start
  - Use indexes effectively
  - Implement pagination
  - Optimize queries
- **Monitoring:**
  - Track query performance
  - Monitor resource usage
  - Set up alerts
  - Review regularly

---

## Code Organization

### Project Structure

#### 30. Organization Best Practices
- **Source:** [Other Recommendations](https://docs.convex.dev/understanding/best-practices/other-recommendations)
- **Structure:**
  ```
  convex/
    ├── schema.ts          # Data models
    ├── types.ts          # Shared types
    ├── functions/        # Convex functions
    │   ├── users.ts
    │   ├── messages.ts
    │   └── auth.ts
    └── utils/           # Helper functions
  ```
- **Principles:**
  - Group by domain
  - Separate concerns
  - Keep files focused
  - Use clear naming

### Naming Conventions

#### 31. Naming Best Practices
- **From Community Standards:**
  - Use descriptive names
  - Be consistent
  - Follow TypeScript conventions
  - Document intent
- **Examples:**
  - `getUserById` (query)
  - `createMessage` (mutation)
  - `sendNotification` (action)
  - `isAuthorized` (helper)

---

## Common Pitfalls to Avoid

### Performance Pitfalls

#### 32. Common Performance Mistakes
- **From Community Experience:**
  - ❌ Not using indexes
  - ❌ Fetching too much data
  - ❌ N+1 query patterns
  - ❌ Ignoring pagination
  - ❌ Excessive subscriptions

### Schema Pitfalls

#### 33. Schema Design Mistakes
- **From Best Practices:**
  - ❌ Over-normalization
  - ❌ Ignoring growth
  - ❌ Complex relationships
  - ❌ Not planning queries
  - ❌ Changing schema without migration

### Security Pitfalls

#### 34. Common Security Issues
- **From Security Guidelines:**
  - ❌ Trusting client data
  - ❌ Missing authorization checks
  - ❌ Exposing sensitive data
  - ❌ Not validating inputs
  - ❌ Ignoring authentication

---

## Best Practices Summary

### Core Principles
1. **Type Safety First:** Leverage TypeScript throughout
2. **Schema-First Design:** Plan data models carefully
3. **Reactive Mindset:** Trust the real-time system
4. **Security Always:** Validate and authorize everything
5. **Performance Matters:** Use indexes and pagination
6. **Simple Functions:** Keep functions focused
7. **Clear Organization:** Structure code logically
8. **Test Thoroughly:** Verify behavior at all levels

### Quick Checklist
- [ ] Schema defined with proper types
- [ ] Indexes created for common queries
- [ ] Authentication implemented correctly
- [ ] Authorization checks in place
- [ ] Error handling with ConvexError
- [ ] Input validation on all functions
- [ ] Real-time subscriptions optimized
- [ ] Code organized by domain
- [ ] Tests written for critical paths
- [ ] Deployment configuration set

---

**Sources:**
- [Convex Developer Hub - Best Practices](https://docs.convex.dev/understanding/best-practices/)
- [Convex Developer Hub - The Zen of Convex](https://docs.convex.dev/understanding/zen)
- [Convex Developer Hub - Schema Philosophy](https://docs.convex.dev/database/advanced/schema-philosophy)
- [Stack by Convex - Queries that Scale](https://stack.convex.dev/queries-that-scale)
- [Stack by Convex - Real-Time Database](https://stack.convex.dev/real-time-database)
- [Stack by Convex - Relationship Structures](https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas)
- [Schemets Blog - 10 Essential Tips](https://schemets.com/blog/10-convex-developer-tips-pitfalls-productivity)
- [Community Gist - Best Practices](https://gist.github.com/srizvi/966e583693271d874bf65c2a95466339)
- [Building Scalable Apps - Dev.to](https://dev.to/tuhin114/unlocking-backend-simplicity-building-scalable-apps-with-convex-3bnk)
