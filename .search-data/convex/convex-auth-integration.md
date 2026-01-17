# Convex Authentication & Authorization Guide

Complete guide to implementing authentication and authorization in Convex applications.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Providers](#authentication-providers)
3. [Convex Auth (Built-in)](#convex-auth-built-in)
4. [Clerk Integration](#clerk-integration)
5. [Auth0 Integration](#auth0-integration)
6. [Firebase Integration](#firebase-integration)
7. [User Identity](#user-identity)
8. [Authorization Patterns](#authorization-patterns)
9. [Database Auth](#database-auth)
10. [Best Practices](#best-practices)

---

## Overview

Convex provides flexible authentication options:

- **Convex Auth** - Built-in authentication solution
- **Clerk** - Complete auth platform with UI components
- **Auth0** - Enterprise authentication
- **Firebase** - Google's authentication platform
- **Custom** - Build your own auth solution

### Authentication vs Authorization

- **Authentication** - Verifying who a user is (login)
- **Authorization** - Verifying what a user can do (permissions)

---

## Authentication Providers

### Quick Comparison

| Provider | Best For | Features |
|----------|----------|----------|
| **Convex Auth** | Simple apps | Email/password, OAuth, magic links |
| **Clerk** | Production apps | Full auth UI, user management, MFA |
| **Auth0** | Enterprise | SSO, enterprise protocols, advanced security |
| **Firebase** | Google ecosystem | Phone auth, anonymous auth, Google integration |

### Setup with CLI

When creating a new project:

```bash
npm create convex@latest
```

Select "Convex Auth" during setup for automatic configuration.

---

## Convex Auth (Built-in)

### Installation

```bash
npm install @convex-dev/auth
```

### Configuration

**Create `convex/auth.config.ts`:**

```typescript
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://your-auth-provider.com",
      applicationID: "convex"
    }
  ]
} satisfies AuthConfig;
```

### Email/Password Authentication

**Schema setup:**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
    emailVerified: v.boolean()
  }).index("by_email", ["email"])
});
```

**Registration mutation:**

```typescript
// convex/functions/auth.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string())
  },
  handler: async (ctx, { email, password, name }) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password (use bcrypt or similar)
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = await ctx.db.insert("users", {
      email,
      passwordHash,
      name,
      emailVerified: false
    });

    return userId;
  }
});
```

**Login mutation:**

```typescript
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, { email, password }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Return token (implement JWT or session)
    return {
      token: generateToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
  }
});
```

---

## Clerk Integration

### Installation

```bash
npm install @clerk/clerk-react convex
```

### Setup Configuration

**Create `convex/auth.config.ts`:**

```typescript
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex"
    }
  ]
} satisfies AuthConfig;
```

**Environment variables:**

```bash
# .env.local
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://clerk.your-domain.com
VITE_CONVEX_URL=http://localhost:3210
```

### React Integration

**Provider setup:**

```typescript
// src/ConvexProvider.tsx
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL!
);

export function ConvexClientProvider({ children }) {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

**Store authenticated users in database:**

```typescript
// src/hooks/useStoreUserEffect.ts
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }

    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null
  };
}
```

**User storage mutation:**

```typescript
// convex/functions/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Cannot store user: Not authenticated");
    }

    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (user !== null) {
      return user._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      email: identity.email ?? "",
      name: identity.name ?? "",
      profileImageUrl: identity.pictureUrl ?? "",
      // Add any other fields from identity
    });

    return userId;
  }
});
```

### Clerk UI Components

**Login/Logout buttons:**

```typescript
import { SignInButton, SignOutButton, useAuth } from "@clerk/clerk-react";

export function AuthButtons() {
  const { isSignedIn } = useAuth();

  return (
    <div>
      {isSignedIn ? (
        <SignOutButton>Sign Out</SignOutButton>
      ) : (
        <SignInButton>Sign In</SignInButton>
      )}
    </div>
  );
}
```

**Pre-built components:**

```typescript
import { ClerkLoginButton, ClerkLogoutButton } from 'convex/react-clerk';

export function LoginPage() {
  return (
    <ClerkLoginButton
      clerkPublishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      convexUrl={import.meta.env.VITE_CONVEX_URL}
    />
  );
}
```

---

## Auth0 Integration

### Installation

```bash
npm install @auth0/auth0-react convex
```

### Configuration

**Environment variables:**

```bash
# .env.local
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud
AUTH0_SECRET=your-secret
```

### React Setup

**Provider configuration:**

```typescript
// src/ConvexClientProvider.tsx
"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: typeof window === "undefined"
          ? undefined
          : window.location.origin
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
```

**Auth configuration:**

```typescript
// convex/auth.config.ts
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.AUTH0_DOMAIN!,
      applicationID: "convex"
    }
  ]
} satisfies AuthConfig;
```

### Usage

```typescript
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function Profile() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const profile = useQuery(api.users.getProfile);

  if (!isAuthenticated) {
    return <button onClick={() => loginWithRedirect()}>Log In</button>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
```

---

## Firebase Integration

### Installation

```bash
npm install firebase convex
```

### Configuration

**Initialize Firebase:**

```typescript
// src/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

export const app = initializeApp(firebaseConfig);
```

**Convex auth config:**

```typescript
// convex/auth.config.ts
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://securetoken.google.com/" + process.env.FIREBASE_PROJECT_ID!,
      applicationID: "convex"
    }
  ]
} satisfies AuthConfig;
```

### React Integration

```typescript
// src/ConvexProvider.tsx
import { ConvexProviderWithFirebase } from "convex/react-firebase";
import { ConvexReactClient } from "convex/react";
import { getAuth } from "firebase/auth";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL!
);

const auth = getAuth();

export function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithFirebase client={convex} auth={auth}>
      {children}
    </ConvexProviderWithFirebase>
  );
}
```

---

## User Identity

### Accessing User Identity

**In queries and mutations:**

```typescript
import { query, mutation } from "./_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    return {
      subject: identity.subject,           // Unique user ID
      issuer: identity.issuer,            // Auth provider URL
      email: identity.email,
      emailVerified: identity.emailVerified,
      name: identity.name,
      pictureUrl: identity.pictureUrl,
      phoneNumber: identity.phoneNumber,
      phoneNumberVerified: identity.phoneNumberVerified
    };
  }
});
```

### UserIdentity Interface

```typescript
interface UserIdentity {
  // Unique identifier (always present)
  subject: string;

  // Authentication provider (always present)
  issuer: string;

  // Optional fields (depends on provider)
  email?: string;
  emailVerified?: boolean;
  name?: string;
  pictureUrl?: string;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
}
```

### Checking Authentication

```typescript
export const protectedMutation = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized: You must be logged in");
    }

    // User is authenticated, proceed
    const userId = await ctx.db.insert("posts", {
      content,
      authorId: identity.subject,
      createdAt: Date.now()
    });

    return userId;
  }
});
```

---

## Authorization Patterns

### Resource-Based Authorization

**Check ownership:**

```typescript
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    updates: v.object({
      title: v.optional(v.string()),
      content: v.optional(v.string())
    })
  },
  handler: async (ctx, { postId, updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user owns this post
    if (post.authorId !== identity.subject) {
      throw new Error("Forbidden: You don't own this post");
    }

    // Update post
    await ctx.db.patch(postId, updates);

    return postId;
  }
});
```

### Role-Based Authorization

**Schema with roles:**

```typescript
export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("moderator"),
      v.literal("user")
    )
  }).index("by_token", ["tokenIdentifier"])
});
```

**Check roles:**

```typescript
export const adminOnlyMutation = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Forbidden: Admin access required");
    }

    // Perform admin action
    await ctx.db.patch(userId, { banned: true });
  }
});
```

### Team-Based Authorization

**Check team membership:**

```typescript
export const updateTeamProject = mutation({
  args: {
    projectId: v.id("projects"),
    updates: v.object({ name: v.optional(v.string()) })
  },
  handler: async (ctx, { projectId, updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check if user is team member
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_user_team", q =>
        q.eq("userId", identity.subject)
         .eq("teamId", project.teamId)
      )
      .first();

    if (!membership) {
      throw new Error("Forbidden: Not a team member");
    }

    // Update project
    await ctx.db.patch(projectId, updates);

    return projectId;
  }
});
```

---

## Database Auth

### Custom Token Validation

```typescript
export const customAuth = mutation({
  args: {
    token: v.string()
  },
  handler: async (ctx, { token }) => {
    // Validate custom token
    const decoded = await verifyCustomToken(token);

    // Create or get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", q => q.eq("externalId", decoded.userId))
      .first();

    if (user) {
      return { userId: user._id, token: generateSessionToken(user._id) };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      externalId: decoded.userId,
      email: decoded.email,
      name: decoded.name
    });

    return { userId, token: generateSessionToken(userId) };
  }
});
```

### API Key Authentication

```typescript
export const apiKeyAuth = mutation({
  args: {
    apiKey: v.string()
  },
  handler: async (ctx, { apiKey }) => {
    // Look up API key
    const key = await ctx.db
      .query("apiKeys")
      .withIndex("by_key", q => q.eq("key", apiKey))
      .first();

    if (!key) {
      throw new Error("Invalid API key");
    }

    if (key.revoked) {
      throw new Error("API key revoked");
    }

    // Update last used
    await ctx.db.patch(key._id, {
      lastUsed: Date.now()
    });

    return { userId: key.userId };
  }
});
```

---

## Best Practices

### Security Best Practices

**1. Always validate authentication:**

```typescript
export const anyMutation = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    // Proceed
  }
});
```

**2. Validate authorization:**

```typescript
// Check resource ownership
if (resource.userId !== identity.subject) {
  throw new Error("Forbidden");
}
```

**3. Use environment variables for secrets:**

```typescript
// Never hardcode secrets
const apiKey = process.env.SECRET_API_KEY;
```

**4. Validate input:**

```typescript
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string()
  },
  handler: async (ctx, args) => {
    // Types are validated automatically
    await ctx.db.insert("users", args);
  }
});
```

### Performance Best Practices

**1. Store user ID in documents:**

```typescript
await ctx.db.insert("posts", {
  title: "My Post",
  authorId: identity.subject  // Store subject, not full user object
});
```

**2. Use indexes for user lookups:**

```typescript
defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string()
  }).index("by_token", ["tokenIdentifier"])
});
```

**3. Cache user data:**

```typescript
// Fetch user once in action
const user = await ctx.runQuery(api.users.get);
// Pass to mutations if needed
```

### Error Handling

```typescript
export const safeMutation = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error(
        JSON.stringify({
          code: "UNAUTHORIZED",
          message: "You must be logged in"
        })
      );
    }

    // Handle other errors
    try {
      await ctx.db.insert("posts", { /* ... */ });
    } catch (error) {
      throw new Error("Failed to create post");
    }
  }
});
```

---

## Testing Authentication

**Test with authenticated user:**

```typescript
import { convexTest } from "convex-test";

test("authenticated user can create post", async () => {
  const t = convexTest(schema);

  // Mock authentication
  await t.mutation(api.users.store, {
    tokenIdentifier: "test-user"
  });

  // Test authenticated action
  const postId = await t.mutation(api.posts.create, {
    title: "Test Post"
  });

  expect(postId).toBeDefined();
});
```

---

**Next: Learn about [Frontend Framework Integration](./convex-frontend-integration.md)**
