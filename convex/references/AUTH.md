# Convex Authentication & Authorization

Complete guide to implementing authentication with various providers.

## Supported Providers

- **Clerk** (Recommended) - Easiest setup, modern UX
- **Auth0** - Enterprise features
- **Firebase** - Google ecosystem
- **Convex Auth** - Built-in solution

## Clerk Integration

### Installation

```bash
npm install @clerk/clerk-react
```

### Backend Configuration

**File:** `convex/auth.config.ts`

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

### Frontend Setup

```typescript
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Accessing User Identity

```typescript
import { mutation } from "./_generated/server";

export const createPost = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Access user info
    const { subject, email, name, pictureUrl } = identity;

    const postId = await ctx.db.insert("posts", {
      ...args,
      authorId: subject,      // Unique user ID from Clerk
      authorName: name ?? email,
      authorAvatar: pictureUrl,
      createdAt: Date.now()
    });

    return postId;
  }
});
```

### UserIdentity Interface

```typescript
interface UserIdentity {
  subject: string;              // Unique ID (e.g., "user_abc123")
  issuer: string;               // Provider URL
  email?: string;               // User email
  emailVerified?: boolean;      // Email verification status
  name?: string;                // Display name
  pictureUrl?: string;          // Profile picture URL
}
```

## Auth0 Integration

### Installation

```bash
npm install @auth0/auth0-react
```

### Backend Configuration

**File:** `convex/auth.config.ts`

```typescript
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

### Frontend Setup

```typescript
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";

<Auth0Provider
  domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
  clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
  authorizationParams={{ redirect_uri: window.location.origin }}
>
  <ConvexProviderWithAuth0 client={convex}>
    <App />
  </ConvexProviderWithAuth0>
</Auth0Provider>
```

## Firebase Integration

### Installation

```bash
npm install firebase
```

### Backend Configuration

**File:** `convex/auth.config.ts`

```typescript
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://securetoken.google.com/" + process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      applicationID: "convex"
    }
  ]
} satisfies AuthConfig;
```

### Frontend Setup

```typescript
import { ConvexProviderWithFirebase } from "convex/react-firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();

<ConvexProviderWithFirebase client={convex} firebaseAuth={auth}>
  <App />
</ConvexProviderWithFirebase>
```

## Authorization Patterns

### Require Authentication

```typescript
export const protectedOperation = mutation({
  args: { data: v.string() },
  handler: async (ctx, { data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated");
    }

    // Proceed with operation
    await ctx.db.insert("data", { data, userId: identity.subject });
  }
});
```

### Resource Ownership

```typescript
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string())
  },
  handler: async (ctx, { postId, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check ownership
    if (post.authorId !== identity.subject) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(postId, updates);
  }
});
```

### Role-Based Access

```typescript
// Schema
users: defineTable({
  name: v.string(),
  role: v.union(
    v.literal("user"),
    v.literal("admin"),
    v.literal("moderator")
  )
})

// Function with role check
export const adminOperation = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get user with role
    const user = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Forbidden: Admin only");
    }

    // Proceed with admin operation
  }
});
```

### Team-Based Access

```typescript
// Schema
teams: defineTable({
  name: v.string()
}),
members: defineTable({
  teamId: v.id("teams"),
  userId: v.string(),
  role: v.union(v.literal("owner"), v.literal("member"), v.literal("viewer"))
}).index("by_team", ["teamId"]).index("by_user", ["userId"])

// Check team membership
export const updateTeamResource = mutation({
  args: {
    teamId: v.id("teams"),
    resourceId: v.id("resources"),
    updates: v.any()
  },
  handler: async (ctx, { teamId, resourceId, updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if user is team member
    const membership = await ctx.db
      .query("members")
      .withIndex("by_team_user", (q) =>
        q.eq("teamId", teamId).eq("userId", identity.subject)
      )
      .unique();

    if (!membership) {
      throw new Error("Not a team member");
    }

    // Check permissions
    if (membership.role === "viewer") {
      throw new Error("Insufficient permissions");
    }

    // Verify resource belongs to team
    const resource = await ctx.db.get(resourceId);
    if (!resource || resource.teamId !== teamId) {
      throw new Error("Resource not found");
    }

    await ctx.db.patch(resourceId, updates);
  }
});
```

## Testing Authenticated Functions

```typescript
import { convexTest } from "convex-test";

it("requires authentication", async () => {
  const t = convexTest(schema);

  await expect(
    t.mutation(api.posts.create, { title: "Test" })
  ).rejects.toThrow("Unauthorized");
});

it("allows authenticated users", async () => {
  const t = convexTest(schema);

  // Set up auth identity
  const identity = {
    subject: "user123",
    issuer: "https://clerk.example.com",
    email: "test@example.com",
    name: "Test User"
  };

  t.withIdentity(identity);

  const postId = await t.mutation(api.posts.create, { title: "Test" });
  expect(postId).toBeDefined();
});
```

## Storing User Profiles

```typescript
// Schema
users: defineTable({
  subject: v.string(),  // Unique ID from auth provider
  name: v.string(),
  email: v.string(),
  avatarUrl: v.optional(v.string())
}).index("by_subject", ["subject"])

// Sync on auth
export const storeUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      subject: identity.subject,
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      avatarUrl: identity.pictureUrl
    });

    return userId;
  }
});
```

## Frontend Auth State

```typescript
import { useConvexAuth } from "convex/react";

function UserProfile() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <PleaseLogin />;
  }

  return <Dashboard />;
}
```
