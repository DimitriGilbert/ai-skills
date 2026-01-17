# Convex Troubleshooting Guide

Solutions to common issues and problems when working with Convex.

## Development Environment Issues

### Port Already in Use

**Problem:** `Error: Port 3210 is already in use`

**Solutions:**

1. Kill process on port 3210:
   ```bash
   # Linux/Mac
   lsof -ti:3210 | xargs kill -9

   # Windows
   netstat -ano | findstr :3210
   taskkill /PID <PID> /F
   ```

2. Use different port:
   ```bash
   CONVEX_PORT=3211 npx convex dev
   ```

### Types Not Generated

**Problem:** TypeScript errors: `Cannot find module '../convex/_generated/api'`

**Solutions:**

1. Regenerate types:
   ```bash
   rm -rf convex/_generated
   npx convex dev
   ```

2. Restart TypeScript server:
   - VS Code: Command Palette → "TypeScript: Restart TS Server"
   - Cursor: Command Palette → "Developer: Reload Window"

3. Verify `convex/schema.ts` exists and is valid

### Convex Dev Fails to Start

**Problem:** `npx convex dev` fails

**Solutions:**

1. Check Node.js version (requires 18+):
   ```bash
   node --version
   ```

2. Clear Convex cache:
   ```bash
   rm -rf .convex
   npx convex dev
   ```

3. Check network connection to Convex cloud

4. Verify `convex/schema.ts` is valid TypeScript

## Function Issues

### Function Not Found

**Problem:** `TypeError: api.module.function is not a function`

**Solutions:**

1. Run `npx convex dev` to regenerate types

2. Check function file exists in `convex/` folder

3. Verify function is exported:
   ```typescript
   export const myFunction = query({ /* ... */ });
   // NOT:
   const myFunction = query({ /* ... */ });
   ```

4. Check for TypeScript errors in function file

5. Restart TypeScript language server

### Function Not Reactive

**Problem:** UI doesn't update when data changes

**Solutions:**

1. Verify using `useQuery` hook (not React Query):
   ```typescript
   // Correct
   import { useQuery } from "convex/react";

   // Wrong
   import { useQuery } from "@tanstack/react-query";
   ```

2. Check `ConvexProvider` wraps your app:
   ```typescript
   <ConvexProvider client={convex}>
     <App />
   </ConvexProvider>
   ```

3. Check browser console for WebSocket errors

4. Verify mutation completed successfully

### Query Returns undefined

**Problem:** Query returns `undefined` instead of data

**Causes:**

1. Query still loading (check with `if (data === undefined)`)
2. Query threw error (check browser console)
3. No data in database
4. Index doesn't exist for query

**Solutions:**

```typescript
const data = useQuery(api.posts.list);

if (data === undefined) {
  return <div>Loading...</div>;
}

if (data === null) {
  return <div>Error loading data</div>;
}

return <div>{/* render data */}</div>;
```

## Authentication Issues

### User Not Authenticated

**Problem:** `auth.getUserIdentity()` returns `null`

**Solutions:**

1. Verify auth provider setup:
   ```typescript
   // Clerk
   <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
   ```

2. Check user is logged in on frontend

3. Verify `auth.config.ts` exists

4. Check environment variables are set:
   - Clerk: `CLERK_JWT_ISSUER_DOMAIN`
   - Auth0: `AUTH0_DOMAIN`

### JWT Validation Failed

**Problem:** `Error: JWT validation failed`

**Solutions:**

1. Verify `auth.config.ts` domain matches auth provider:
   ```typescript
   // Clerk - get from Clerk Dashboard
   domain: process.env.CLERK_JWT_ISSUER_DOMAIN!

   // Should be: https://<your-clerk-app>.clerk.accounts.dev
   ```

2. Check environment variable is set correctly

3. Verify auth provider application ID is "convex"

## Performance Issues

### Slow Queries

**Problem:** Queries take too long

**Solutions:**

1. Add indexes:
   ```typescript
   .index("by_field", ["field"])
   ```

2. Use pagination:
   ```typescript
   .paginate({ numItems: 50 })
   ```

3. Avoid `.filter()` on queries

4. Check dashboard for query performance metrics

### Too Many Re-renders

**Problem:** Component re-renders excessively

**Solutions:**

1. Move expensive computation outside component:
   ```typescript
   // Good
   const formatted = useMemo(
     () => messages.map(formatMessage),
     [messages]
   );
   ```

2. Use `useMemo` and `useCallback`

3. Check if query arguments are stable:
   ```typescript
   // Bad - creates new object each render
   useQuery(api.posts.list, { filter: { status: "active" } });

   // Good - stable object
   const filter = useMemo(() => ({ status: "active" }), []);
   useQuery(api.posts.list, { filter });
   ```

## Database Issues

### Document Not Found

**Problem:** `db.get(id)` returns `null`

**Solutions:**

1. Verify ID is correct type:
   ```typescript
   v.id("posts")  // NOT just string
   ```

2. Check document exists in dashboard

3. Verify table name matches schema

### Insert Fails

**Problem:** `db.insert()` throws error

**Common causes:**

1. Invalid data type:
   ```typescript
   // Schema: v.string()
   await db.insert("posts", { title: 123 });  // Error!

   // Correct
   await db.insert("posts", { title: "My Post" });
   ```

2. Missing required fields

3. Invalid ID reference:
   ```typescript
   // Bad
   authorId: "user123"  // Just a string

   // Good
   authorId: v.id("users")  // Valid ID type
   ```

## File Storage Issues

### Upload Fails

**Problem:** File upload fails

**Solutions:**

1. Check file size limits (default 10MB)

2. Verify file is Blob/ArrayBuffer:
   ```typescript
   const bytes = new Uint8Array(await file.arrayBuffer());
   await ctx.storage.store(bytes);
   ```

3. Check storage quota in dashboard

### File Download Fails

**Problem:** `ctx.storage.getUrl()` returns invalid URL

**Solutions:**

1. Verify storageId is valid

2. Check file exists in dashboard

3. Use correct URL generation:
   ```typescript
   const url = await ctx.storage.getUrl(storageId);
   ```

## Deployment Issues

### Deploy Fails

**Problem:** `npx convex deploy` fails

**Solutions:**

1. Verify `CONVEX_DEPLOY_KEY` is set:
   ```bash
   echo $CONVEX_DEPLOY_KEY
   ```

2. Check deploy key is for correct project

3. Run `npx convex deploy --dry-run` to check

4. Verify all functions compile without errors

### Environment Variables Not Set

**Problem:** `process.env.VAR` is undefined

**Solutions:**

1. Verify variable is in `convex/config.ts`:
   ```typescript
   env: {
     myVar: {
       validation: v.string(),
       access: "public"  // or "secret"
     }
   }
   ```

2. Set environment variable locally:
   ```bash
   # Development
   # In .convex/local.dev.json
   {
     "myVar": "value"
   }

   # Production
   # In dashboard or CI/CD
   ```

3. Restart `npx convex dev` after adding

## Frontend Integration Issues

### React: Provider Missing

**Problem:** `Error: ConvexProvider not found`

**Solution:**
```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

<ConvexProvider client={convex}>
  <App />
</ConvexProvider>
```

### Next.js: Hydration Mismatch

**Problem:** React hydration errors

**Solutions:**

1. Use `usePreloadedQuery` for server components:
   ```typescript
   const preloaded = await preloadQuery(api.posts.list);
   return <ClientPage preloaded={preloaded} />;
   ```

2. Defer non-SSR queries:
   ```typescript
   const [clientMounted, setClientMounted] = useState(false);
   useEffect(() => setClientMounted(true), []);

   const data = useQuery(api.data.get, {}, {
     enabled: clientMounted
   });
   ```

## TypeScript Errors

### Type Mismatch

**Problem:** Type errors in generated API

**Solutions:**

1. Regenerate types:
   ```bash
   rm -rf convex/_generated
   npx convex dev
   ```

2. Check schema is valid

3. Verify function args match schema:
   ```typescript
   // Schema: v.id("posts")
   // Function:
   args: { postId: v.id("posts") }
   ```

### Missing Types

**Problem:** Cannot import types

**Solutions:**

1. Import from generated types:
   ```typescript
   import type { Id, DocumentByName } from "../convex/_generated/dataModel";

   type Post = DocumentByName["posts"];
   type PostId = Id<"posts">;
   ```

2. Check `convex/_generated/dataModel.ts` exists

## Debugging Tips

### Enable Debug Logging

```typescript
// In development
console.log("Query result:", data);

// In Convex functions
export const myQuery = query({
  handler: async ({ db }) => {
    console.log("Running query...");
    const result = await db.query("posts").collect();
    console.log("Found", result.length, "posts");
    return result;
  }
});
```

### Use Dashboard

- **Functions tab:** See all function calls and performance
- **Database tab:** Query and view data
- **Logs tab:** See console.log output from functions
- **Deployment logs:** Track deployment history

### Network Tab

Check browser Network tab for:
- WebSocket connection (should be `wss://`)
- API requests to Convex
- Error responses

## Getting Help

If you can't solve the issue:

1. Check [Convex Docs](https://docs.convex.dev)
2. Search [GitHub Issues](https://github.com/get-convex/convex-js/issues)
3. Ask in [Discord](https://www.convex.dev/discord)
4. Contact Convex Support via dashboard

When asking for help, include:
- Error messages (full stack trace)
- Code snippets
- Environment (OS, Node version, framework)
- Steps to reproduce
