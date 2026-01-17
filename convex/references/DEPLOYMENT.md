# Convex Deployment Guide

Complete guide for deploying Convex applications to production.

## Production Deploy Keys

### Generate Deploy Key

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Navigate to **Settings** → **Production Deploy Keys**
4. Click **Generate Production Deploy Key**
5. Copy the key (you won't see it again!)

### Set Environment Variable

```bash
# Terminal / shell
export CONVEX_DEPLOY_KEY=your_deploy_key_here

# .env file
CONVEX_DEPLOY_KEY=convex_prod_abc123...
```

### Vercel Environment Variable

1. Go to Vercel project **Settings** → **Environment Variables**
2. Add `CONVEX_DEPLOY_KEY` with your deploy key
3. Select all environments (Production, Preview, Development)

## Deployment Commands

### Basic Deployment

```bash
# Deploy Convex functions only
npx convex deploy
```

### With Frontend Build

```bash
# Build and deploy together
npx convex deploy --cmd 'npm run build'

# Vercel-style
npx convex deploy --cmd 'next build'
```

### Dry Run

```bash
# Check what would be deployed
npx convex deploy --dry-run
```

### Specific Environment

```bash
# Deploy to production
npx convex deploy --env production

# Deploy to preview
npx convex deploy --env preview
```

## Environment Configuration

### Define Environment Variables

**File:** `convex/config.ts`

```typescript
import { defineConfig, v } from "convex/config";

export default defineConfig({
  env: {
    // Public - accessible in frontend
    apiUrl: {
      validation: v.string(),
      access: "public"
    },

    // Secret - only accessible in server functions
    openaiApiKey: {
      validation: v.string(),
      access: "secret"
    },

    // Optional
    optionalVar: {
      validation: v.optional(v.string()),
      access: "public"
    }
  }
});
```

### Use in Functions

```typescript
// Actions/Mutations
export const callAPI = action({
  handler: async (ctx) => {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/...", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    return await response.json();
  }
});
```

### Access in Frontend

```typescript
// Access public env vars
const apiUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
```

## Vercel Deployment

### Configure Build Command

**Vercel Dashboard:**
1. Go to **Settings** → **Build & Development**
2. Set **Build Command** to:
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```

### vercel.json Configuration

```json
{
  "buildCommand": "npx convex deploy --cmd 'npm run build'",
  "env": {
    "CONVEX_DEPLOY_KEY": "@convex-deploy-key"
  }
}
```

### Complete Vercel Setup

1. **Set environment variables:**
   - `CONVEX_DEPLOY_KEY` - Production deploy key
   - `NEXT_PUBLIC_CONVEX_URL` - Auto-set by deploy command

2. **Configure build:**
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## Netlify Deployment

### netlify.toml Configuration

```toml
[build]
command = "npx convex deploy --cmd 'npm run build'"

[build.environment]
CONVEX_DEPLOY_KEY = "@convex_deploy_key"
```

## CI/CD Integration

### GitHub Actions

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Convex
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
        run: npx convex deploy --cmd 'npm run build'
```

### GitHub Actions for Preview

```yaml
name: Deploy Preview

on:
  pull_request:

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

      - name: Deploy preview
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
        run: npx convex deploy
```

## Monitoring & Logging

### Dashboard Monitoring

- **Functions tab:** See all function calls and performance
- **Database tab:** View and query your data
- **Deployment logs:** Track deployment history

### Error Tracking

```typescript
// In your functions
import { ConvexError } from "convex/values";

export const sensitiveOp = mutation({
  handler: async (ctx) => {
    throw new ConvexError({
      code: "OPERATION_FAILED",
      message: "Detailed error message",
      context: { userId: "abc123" }
    });
  }
});
```

### Custom Logging

```typescript
export const processPayment = mutation({
  handler: async (ctx, { amount }) => {
    console.log("Processing payment:", { amount, timestamp: Date.now() });

    try {
      // Process payment
    } catch (error) {
      console.error("Payment failed:", error);
      throw error;
    }
  }
});
```

## Custom Domain

### Set Up Custom Domain

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Navigate to **Settings** → **Domains**
3. Click **Add Custom Domain**
4. Enter your domain (e.g., `api.yourapp.com`)
5. Configure DNS records

### DNS Configuration

```
Type: CNAME
Name: api
Value: your-project.convex.cloud
```

### Update Frontend Configuration

```typescript
const convex = new ConvexReactClient("https://api.yourapp.com");
```

## Production Checklist

Before deploying to production:

### Security
- [ ] All environment variables are set
- [ ] Deploy keys are properly configured
- [ ] Authentication is enabled
- [ ] Authorization checks are in place
- [ ] Secret keys are not exposed

### Performance
- [ ] Indexes are created for all queries
- [ ] Pagination is implemented for large datasets
- [ ] File uploads have size limits
- [ ] No `.filter()` on queries

### Monitoring
- [ ] Error tracking is configured
- [ ] Logging is implemented
- [ ] Dashboard monitoring is set up
- [ ] Alerts are configured

### Testing
- [ ] All tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases covered

## Preview Deployments

### Automatic Preview Environments

Convex automatically creates preview environments for each branch.

```bash
# Create preview deployment
git checkout -b feature/new-feature
npx convex deploy

# This creates a preview environment
# URL: https://your-project-branch-name.convex.cloud
```

### Clean Up Preview Environments

```bash
# Delete preview environment
npx convex deploy delete-env --env preview
```

## Rollback

### Rollback Deployment

```bash
# View deployment history
npx convex deploy history

# Rollback to previous deployment
npx convex deploy rollback
```

### Rollback Specific Version

```bash
# Rollback to specific deployment
npx convex deploy rollback --version 42
```

## Scaling

Convex automatically scales your application. No manual configuration needed.

- **Database:** Automatically scales read/write capacity
- **Functions:** Auto-scales based on load
- **Storage:** Unlimited file storage
- **Rate limits:** Configurable in dashboard

### Rate Limiting

```typescript
// Convex automatically enforces rate limits
// Configure in dashboard: Settings → Rate Limits
```

## Migration from Development

### Export Development Data

```bash
# Export data from development
npx convex export --development
```

### Import to Production

```bash
# Import to production
CONVEX_DEPLOY_KEY=prod_key npx convex import --production data.json
```

### Schema Migration

```bash
# Deploy schema changes
npx convex deploy

# Convex handles schema migrations automatically
# No downtime or manual migration needed
```
