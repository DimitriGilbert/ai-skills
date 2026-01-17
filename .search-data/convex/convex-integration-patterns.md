# Convex Integration Patterns - Comprehensive Guide

**Last Updated:** January 17, 2026

## Table of Contents
- [Framework Integrations](#framework-integrations)
- [Authentication Provider Integrations](#authentication-provider-integrations)
- [Database & Storage Integrations](#database--storage-integrations)
- [Third-Party API Integrations](#third-party-api-integrations)
- [Real-Time Sync Integrations](#real-time-sync-integrations)
- [Mobile & Cross-Platform Integrations](#mobile--cross-platform-integrations)
- [AI/ML Integrations](#aiml-integrations)
- [DevOps & Deployment Integrations](#devops--deployment-integrations)
- [Webhook Integrations](#webhook-integrations)
- [Testing & Monitoring Integrations](#testing--monitoring-integrations)

---

## Framework Integrations

### Next.js Integration

#### 1. Next.js App Router Integration
- **Documentation:** [Convex Developer Hub - Next.js](https://docs.convex.dev/client/nextjs/app-router/)
- **Pattern:**
  ```typescript
  // app/convex/client.ts
  import { ConvexProvider, ConvexReactClient } from "convex/react";
  import { children } from "react/children";

  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  export default function ConvexClientProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }
  ```
- **Features:**
  - Server-side rendering support
  - File-system based routing
  - Fast refresh in development
  - API route integration
- **Best Practices:**
  - Use `convex/nextjs` for SSR helpers
  - Wrap app in ConvexProvider
  - Configure environment variables
  - Leverage Next.js caching

#### 2. Next.js with Clerk Authentication
- **Source:** [Medium - Keval Rabadiya](https://medium.com/@kevalrabadiya27/supercharging-your-next-js-app-with-convex-database-and-clerk-authentication-318cb1bbe046)
- **Integration Pattern:**
  ```typescript
  // Middleware pattern
  export const { auth, signIn, signOut } = clerkClient();

  // Convex auth setup
  export const { auth: convexAuth } = convexAuth({
    providers: [clerkProvider()],
  });
  ```
- **Features:**
  - Protected routes
  - Server-side auth checks
  - User data sync
  - Token management

#### 3. Next.js with shadcn/ui
- **Source:** [Medium - AI YouTube Analyzer](https://medium.com/@13128589345/setting-up-an-ai-powered-youtube-comments-analyzer-with-next-js-convex-and-shadcn-ui-a60fccee9043)
- **Pattern:**
  - Next.js for routing
  - shadcn/ui for components
  - Convex for backend
  - Real-time updates
- **Use Cases:**
  - Admin dashboards
  - Data visualization
  - AI-powered applications

### React Integration

#### 4. React + Vite Integration
- **Documentation:** [React Quickstart](https://docs.convex.dev/quickstart/react)
- **Setup Pattern:**
  ```typescript
  // main.tsx
  import { ConvexProvider, ConvexReactClient } from "convex/react";
  import App from "./App";

  const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </React.StrictMode>
  );
  ```
- **Features:**
  - Fast refresh
  - Hot module replacement
  - TypeScript support
  - Development tools

#### 5. React State Management with Convex
- **Source:** [LogRocket Tutorial](https://blog.logrocket.com/using-convex-for-state-management/)
- **Pattern:**
  ```typescript
  // Using Convex for global state
  function App() {
    const messages = useQuery(api.messages.list);
    const sendMessage = useMutation(api.messages.send);

    return (
      <div>
        {messages?.map(msg => (
          <Message key={msg._id} message={msg} />
        ))}
        <button onClick={() => sendMessage({ body: "Hello" })}>
          Send
        </button>
      </div>
    );
  }
  ```
- **Benefits:**
  - Single source of truth
  - Automatic reactivity
  - Type-safe mutations
  - Real-time sync

### Vue.js Integration

#### 6. Vue.js + Capacitor Integration
- **Source:** [LinkedIn - Aaron K. Saunders](https://www.linkedin.com/posts/aaronksaunders_convex-vuejs-capacitorjs-activity-7366540463027273728-YTJJ)
- **Pattern:**
  ```javascript
  // Vue 3 Composition API
  import { useQuery, useMutation } from "convex/vue";

  export default {
    setup() {
      const tasks = useQuery(api.tasks.list);
      const addTask = useMutation(api.tasks.create);

      return { tasks, addTask };
    }
  };
  ```
- **Features:**
  - Vue 3 Composition API
  - Capacitor for mobile
  - Cross-platform sync
  - Real-time updates

---

## Authentication Provider Integrations

### Clerk Integration

#### 7. Clerk Authentication Pattern
- **Source:** [Medium - Keval Rabadiya](https://medium.com/@kevalrabadiya27/supercharging-your-next-js-app-with-convex-database-and-clerk-authentication-318cb1bbe046)
- **Integration Pattern:**
  ```typescript
  // convex/auth.ts
  import { convexAuth } from "@convex-dev/auth";
  import { Clerk } from "@clerk/clerk-auth";

  export const { auth, signIn, signOut } = convexAuth({
    providers: [Clerk()],
  });

  // Using auth in functions
  export const getUserData = query({
    args: {},
    handler: async (ctx) => {
      const user = await ctx.auth.getUserIdentity();
      if (!user) throw new Error("Not authenticated");
      return await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", user.tokenIdentifier))
        .unique();
    },
  });
  ```
- **Features:**
  - OAuth providers
  - Email/password
  - Magic links
  - Multi-factor authentication

#### 8. Clerk Webhook Integration
- **Source:** [Medium - Dev Agrawal](https://medium.com/@devagrawal09/clerk-webhooks-data-sync-with-convex-f11016dbbb4f)
- **Pattern:**
  ```typescript
  // convex/clerk.ts
  import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

export const clerkWebhook = httpAction(async (ctx, request) => {
  const payload = await request.json();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  try {
    const msg = wh.verify(JSON.stringify(payload));
    // Sync user data
    await ctx.runMutation(api.users.syncFromClerk, { data: msg.data });
  } catch (err) {
    return new Response("Invalid webhook", { status: 400 });
  }

  return new Response(null, { status: 200 });
});
  ```
- **Use Cases:**
  - User data synchronization
  - Real-time profile updates
  - Auth event handling

### Kinde Integration

#### 9. Kinde Authentication Pattern
- **Source:** [Dev.to - Sholajegede](https://dev.to/sholajegede/convex-kinde-2pe1)
- **Integration Pattern:**
  ```typescript
  // Configure Kinde
  import { convexAuth } from "@convex-dev/auth";
  import { Kinde } from "@kinde-oss/kinde-auth";

  export const { auth } = convexAuth({
    providers: [Kinde()],
  });

  // Protected query
  export const getProfile = query({
    args: {},
    handler: async (ctx) => {
      const user = await ctx.auth.getUserIdentity();
      if (!user) throw new Error("Not authenticated");
      return await ctx.db
        .query("profiles")
        .withIndex("by_user", q => q.eq("userId", user.subject))
        .unique();
    },
  });
  ```

#### 10. Kinde Webhook Integration
- **Source:** [Kinde Engineering Blog](https://kinde.com/blog/engineering/kinde-with-convex-webhooks-to-realtime-data/)
- **Pattern:**
  ```typescript
  // Webhook handler for user events
  export const kindeWebhook = httpAction(async (ctx, request) => {
    const event = await request.json();

    switch (event.eventType) {
      case "user.created":
        await ctx.runMutation(api.users.create, {
          kindeId: event.data.id,
          email: event.data.email,
        });
        break;
      case "user.updated":
        await ctx.runMutation(api.users.update, {
          kindeId: event.data.id,
          updates: event.data,
        });
        break;
    }

    return new Response(null, { status: 200 });
  });
  ```

### Better-Auth Integration

#### 11. Better-Auth Pattern
- **Source:** [GitHub - sheriffyusuf](https://github.com/sheriffyusuf/betterauth-convex-nextjs)
- **Repository:** betterauth-convex-nextjs
- **Integration:**
  ```typescript
  // Better-auth configuration
  import { convexAuth } from "@convex-dev/auth";
  import { betterAuth } from "better-auth";

  export const auth = convexAuth({
    providers: [betterAuth()],
  });
  ```
- **Features:**
  - Lightweight authentication
  - Custom providers
  - Session management
  - Next.js integration

### Descope Integration

#### 12. Descope Authentication Pattern
- **Source:** [GitHub - descope-sample-apps](https://github.com/descope-sample-apps/descope-convex)
- **Pattern:**
  ```typescript
  // Descope integration
  import { convexAuth } from "@convex-dev/auth";
  import { Descope } from "@descope/descope-auth";

  export const { auth } = convexAuth({
    providers: [Descope()],
  });
  ```
- **Features:**
  - Enterprise authentication
  - SSO support
  - MFA support
  - Session management

---

## Database & Storage Integrations

### Cloudflare R2 Integration

#### 13. R2 Storage Component
- **Repository:** [get-convex/r2](https://github.com/get-convex/r2)
- **Pattern:**
  ```typescript
  // Using R2 component
  import { useStorage } from "convex/r2";

  function UploadComponent() {
    const { upload, progress } = useStorage();

    const handleUpload = async (file: File) => {
      const url = await upload(file);
      console.log("File uploaded to:", url);
    };

    return (
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
      />
    );
  }
  ```
- **Features:**
  - React and Svelte hooks
  - Signed URL handling
  - Upload progress tracking
  - Storage management

#### 14. File Upload with R2
- **Source:** [YouTube - R2 Integration](https://www.youtube.com/watch?v=KQVRDdmrIo4)
- **Integration Pattern:**
  1. Generate upload URL from Convex
  2. Upload file directly to R2
  3. Store metadata in Convex
  4. Serve files via signed URLs
- **Best Practices:**
  - Use signed URLs
  - Implement upload validation
  - Track upload progress
  - Handle errors gracefully

### File Storage Integration

#### 15. File Upload Pattern
- **Documentation:** [File Storage Guide](https://docs.convex.dev/file-storage/upload-files)
- **Three-Request Pattern:**
  ```typescript
  // 1. Generate upload URL
  export const generateUploadUrl = mutation({
    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
  });

  // 2. Upload file from client
  const uploadUrl = await generateUploadUrl();
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": fileType },
    body: file,
  });

  // 3. Store file metadata
  await storeFileMetadata({
    storageId: new URL(uploadUrl).pathname.split("/")[2],
    fileName: file.name,
    fileType,
  });
  ```
- **Use Cases:**
  - User uploads
  - Profile pictures
  - Document storage
  - Media galleries

---

## Third-Party API Integrations

### Twilio Integration

#### 16. SMS Processing Pattern
- **Source:** [CodeTV.dev](https://codetv.dev/blog/react-sms-to-database-convex-twilio-clerk)
- **Integration:**
  ```typescript
  // Convex action for Twilio
  export const sendSMS = action({
    args: { to: v.string(), body: v.string() },
    handler: async (_, args) => {
      const twilio = require("twilio");
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: args.body,
        to: args.to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    },
  });
  ```
- **Webhook Handler:**
  ```typescript
  // Handle incoming SMS
  export const twilioWebhook = httpAction(async (ctx, request) => {
    const formData = await request.formData();
    const from = formData.get("From");
    const body = formData.get("Body");

    await ctx.runMutation(api.messages.store, {
      from: from as string,
      body: body as string,
    });

    return new Response(`
      <Response>
        <Message>Message received!</Message>
      </Response>
    `, {
      headers: { "Content-Type": "application/xml" }
    });
  });
  ```

### API Integration Patterns

#### 17. External API Actions
- **Pattern:**
  ```typescript
  // Action for external API calls
  export const fetchUserData = action({
    args: { userId: v.string() },
    handler: async (_, args) => {
      const response = await fetch(
        `https://api.example.com/users/${args.userId}`
      );
      const data = await response.json();

      // Store in Convex
      await ctx.runMutation(api.users.store, { data });

      return data;
    },
  });
  ```
- **Best Practices:**
  - Use actions for external APIs
  - Handle errors gracefully
  - Implement retry logic
  - Cache responses when appropriate

---

## Real-Time Sync Integrations

### Offline-First Sync

#### 18. Yjs CRDT Integration
- **Repository:** [trestleinc/convex-replicate](https://github.com/trestleinc/convex-replicate)
- **Pattern:**
  ```typescript
  // Using Yjs with Convex
  import * as Y from "yjs";
  import { ConvexProvider } from "convex/react";

  const doc = new Y.Doc();
  const ytext = doc.getText("content");

  // Sync with Convex
  function syncWithConvex() {
    const state = Y.encodeStateAsUpdate(doc);
    convexClient.mutation(api.sync.update, {
      documentId,
      state,
    });
  }

  // Listen for changes
  doc.on("update", syncWithConvex);
  ```
- **Features:**
  - Conflict-free replication
  - Offline support
  - Automatic merge
  - Real-time sync

### Webhook-Based Sync

#### 19. Clerk Webhook Sync
- **Source:** [Medium - Dev Agrawal](https://medium.com/@devagrawal09/clerk-webhooks-data-sync-with-convex-f11016dbbb4f)
- **Pattern:**
  ```typescript
  // Sync user data on auth events
  export const clerkUserWebhook = httpAction(async (ctx, request) => {
    const payload = await request.json();
    const eventType = payload.type;

    switch (eventType) {
      case "user.created":
        await ctx.runMutation(api.users.createFromClerk, {
          clerkId: payload.data.id,
          email: payload.data.email_addresses[0].email_address,
        });
        break;
      case "user.updated":
        await ctx.runMutation(api.users.updateFromClerk, {
          clerkId: payload.data.id,
          updates: payload.data,
        });
        break;
    }

    return new Response(null, { status: 200 });
  });
  ```

#### 20. Kinde Webhook Sync
- **Source:** [Kinde Engineering](https://kinde.com/blog/engineering/kinde-with-convex-webhooks-to-realtime-data/)
- **Pattern:**
  ```typescript
  // Sync with Kinde
  export const kindeUserWebhook = httpAction(async (ctx, request) => {
    const event = await request.json();

    await ctx.runMutation(api.users.syncFromKinde, {
      kindeId: event.data.user_id,
      email: event.data.email,
      firstName: event.data.first_name,
      lastName: event.data.last_name,
    });

    return new Response(null, { status: 200 });
  });
  ```

---

## Mobile & Cross-Platform Integrations

### React Native Integration

#### 21. React Native + Expo Pattern
- **Source:** [Galaxies.dev](https://galaxies.dev/react-native-chat-convex)
- **Integration:**
  ```typescript
  // App.tsx
  import { ConvexProvider, ConvexReactClient } from "convex/react";

  const convex = new ConvexReactClient(CONVEX_URL);

  export default function App() {
    return (
      <ConvexProvider client={convex}>
        <ChatApp />
      </ConvexProvider>
    );
  }

  // Using hooks
  import { useQuery, useMutation } from "convex/react";

  function ChatMessages() {
    const messages = useQuery(api.messages.list);
    const sendMessage = useMutation(api.messages.send);

    return (
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
      />
    );
  }
  ```
- **Features:**
  - Real-time chat
  - File upload
  - Push notifications
  - Offline support

#### 22. Capacitor Integration
- **Source:** [LinkedIn - Aaron K. Saunders](https://www.linkedin.com/posts/aaronksaunders_convex-vuejs-capacitorjs-activity-7366540463027273728-YTJJ)
- **Pattern:**
  - Vue.js for web
  - Capacitor for iOS/Android
  - Convex for backend
  - Real-time sync across platforms
- **Use Cases:**
  - Cross-platform apps
  - Mobile-first development
  - Progressive web apps

---

## AI/ML Integrations

### Bolt.new Integration

#### 23. AI-Powered App Building
- **Source:** [YouTube Tutorial](https://www.youtube.com/watch?v=QLmNrPJ-TUM)
- **Pattern:**
  - Use Bolt.new for AI generation
  - Integrate Convex for backend
  - Real-time data sync
  - Serverless database
- **Features:**
  - Rapid prototyping
  - AI-assisted development
  - Real-time collaboration

### OpenAI Integration

#### 24. AI Assistant Pattern
- **Source:** [YouTube - AI Assistant](https://www.youtube.com/watch?v=mvpMEOQ7Ykk)
- **Integration:**
  ```typescript
  // AI chat action
  export const chatWithAI = action({
    args: { message: v.string(), conversationId: v.id("conversations") },
    handler: async (_, args) => {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: args.message }],
      });

      const aiResponse = response.choices[0].message.content;

      // Store in Convex
      await ctx.runMutation(api.messages.add, {
        conversationId: args.conversationId,
        role: "assistant",
        content: aiResponse,
      });

      return aiResponse;
    },
  });
  ```
- **Use Cases:**
  - Chatbots
  - AI assistants
  - Content generation
  - Data analysis

### YouTube API Integration

#### 25. YouTube Comments Analyzer
- **Source:** [Medium](https://medium.com/@13128589345/setting-up-an-ai-powered-youtube-comments-analyzer-with-next-js-convex-and-shadcn-ui-a60fccee9043)
- **Pattern:**
  ```typescript
  // Fetch YouTube comments
  export const fetchComments = action({
    args: { videoId: v.string() },
    handler: async (_, args) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${args.videoId}&key=${process.env.YOUTUBE_API_KEY}`
      );

      const data = await response.json();

      // Store in Convex
      for (const item of data.items) {
        await ctx.runMutation(api.comments.store, {
          videoId: args.videoId,
          comment: item.snippet.topLevelComment.snippet,
        });
      }

      return data.items.length;
    },
  });
  ```
- **Features:**
  - YouTube API integration
  - Comment analysis
  - Data visualization
  - AI-powered insights

---

## DevOps & Deployment Integrations

### Vercel Integration

#### 26. Vercel Deployment Pattern
- **Repository:** [get-convex/vercel-marketplace-convex](https://github.com/get-convex/vercel-marketplace-convex)
- **Setup:**
  1. Install Convex from Vercel marketplace
  2. Link Convex project
  3. Deploy automatically
  4. Environment variables configured
- **Features:**
  - One-click deployment
  - Automatic previews
  - Environment sync
  - Production-ready

### Nx Monorepo Integration

#### 27. Nx Workspace Pattern
- **Repository:** [nrwl/nx-convex-example](https://github.com/nrwl/nx-convex-example)
- **Integration:**
  ```typescript
  // project.json
  {
    "name": "my-app",
    "targets": {
      "dev": {
        "executor": "@nx/vite:dev-server",
        "options": {
          "convex": "npx convex dev"
        }
      }
    }
  }
  ```
- **Features:**
  - Monorepo support
  - Shared libraries
  - Build optimization
  - Code generation

---

## Webhook Integrations

### Generic Webhook Pattern

#### 28. Universal Webhook Handler
- **Pattern:**
  ```typescript
  export const webhookHandler = httpAction(async (ctx, request) => {
    const signature = request.headers.get("webhook-signature");
    const payload = await request.json();

    // Verify signature
    if (!verifySignature(payload, signature)) {
      return new Response("Invalid signature", { status: 401 });
    }

    // Process event
    await ctx.runMutation(api.webhooks.process, {
      source: "external-service",
      event: payload,
    });

    return new Response(null, { status: 200 });
  });
  ```
- **Best Practices:**
  - Verify webhook signatures
  - Handle retries
  - Process asynchronously
  - Log all events

---

## Testing & Monitoring Integrations

### Testing Patterns

#### 29. Function Testing
- **From Debugging Guide:**
  ```typescript
  // Testing queries
  import { query } from "./_generated/server";

  test("getUser returns user", async () => {
    const { db } = await setUpTestDb();
    const userId = await db.insert("users", {
      name: "Test User",
      email: "test@example.com",
    });

    const user = await query(api.users.getUser, { userId });
    expect(user).toBeDefined();
    expect(user.name).toBe("Test User");
  });
  ```

### Monitoring Integration

#### 30. Error Tracking
- **Pattern:**
  ```typescript
  // Wrap functions with error tracking
  export const trackedQuery = (fn: QueryFunction) => {
    return query({
      args: fn.args,
      handler: async (ctx, args) => {
        try {
          return await fn.handler(ctx, args);
        } catch (error) {
          // Track error
          await ctx.runMutation(api.monitoring.trackError, {
            function: fn.name,
            error: error.message,
          });
          throw error;
        }
      },
    });
  };
  ```

---

## Integration Best Practices

### Security
1. **Always validate webhooks**
2. **Use environment variables for secrets**
3. **Implement proper authentication**
4. **Sanitize external data**

### Performance
1. **Cache API responses when appropriate**
2. **Use actions for external APIs**
3. **Implement retry logic**
4. **Monitor rate limits**

### Reliability
1. **Handle errors gracefully**
2. **Implement circuit breakers**
3. **Use idempotent operations**
4. **Log all external calls**

### Development
1. **Mock external APIs in development**
2. **Use TypeScript for type safety**
3. **Test integrations thoroughly**
4. **Document API contracts**

---

**Sources:**
- [Convex Developer Hub - Next.js Integration](https://docs.convex.dev/client/nextjs/app-router/)
- [Convex Developer Hub - React Quickstart](https://docs.convex.dev/quickstart/react)
- [Convex Developer Hub - File Storage](https://docs.convex.dev/file-storage)
- [GitHub - get-convex/r2](https://github.com/get-convex/r2)
- [GitHub - trestleinc/convex-replicate](https://github.com/trestleinc/convex-replicate)
- [Medium - Clerk Integration](https://medium.com/@kevalrabadiya27/supercharging-your-next-js-app-with-convex-database-and-clerk-authentication-318cb1bbe046)
- [Medium - Clerk Webhooks](https://medium.com/@devagrawal09/clerk-webhooks-data-sync-with-convex-f11016dbbb4f)
- [Dev.to - Kinde Integration](https://dev.to/sholajegede/convex-kinde-2pe1)
- [Kinde Engineering - Webhooks](https://kinde.com/blog/engineering/kinde-with-convex-webhooks-to-realtime-data/)
- [CodeTV.dev - Twilio Integration](https://codetv.dev/blog/react-sms-to-database-convex-twilio-clerk)
- [LinkedIn - Vue.js + Capacitor](https://www.linkedin.com/posts/aaronksaunders_convex-vuejs-capacitorjs-activity-7366540463027273728-YTJJ)
