# Authentication

OpenRouter API uses Bearer token authentication for all API requests. This document covers authentication methods, API key management, and best practices.

**Source**: https://openrouter.ai/docs/api/reference/authentication.mdx

## Authentication Methods

### Bearer Token (Primary Method)

All API requests must include an `Authorization` header with a Bearer token:

```bash
Authorization: Bearer YOUR_API_KEY
```

### API Keys

API keys are the primary authentication mechanism for OpenRouter.

#### Creating an API Key

1. Navigate to https://openrouter.ai/keys
2. Click "Create New Key"
3. Enter a label (name) for the key
4. Optionally set a credit limit
5. Click "Create"

#### API Key Types

1. **Regular Keys**: Standard API keys for making requests
2. **Provisioning Keys**: Keys with permissions to manage other keys and view credits

**Source**: https://openrouter.ai/docs/guides/overview/auth/provisioning-api-keys.mdx

### OAuth PKCE

OpenRouter supports OAuth 2.0 PKCE for user authentication without exposing API keys.

#### OAuth Flow

1. **Authorization Request**: Client sends authorization request
2. **User Approval**: User approves the application
3. **Authorization Code**: OpenRouter returns authorization code
4. **Token Exchange**: Client exchanges code for API key

**Source**: https://openrouter.ai/docs/guides/overview/auth/oauth.mdx

### BYOK (Bring Your Own Key)

OpenRouter allows you to use your own API keys from other providers:

- Configure your own OpenAI, Anthropic, or other provider keys
- OpenRouter routes through your keys instead of using credits
- Useful for existing provider accounts or compliance requirements

**Source**: https://openrouter.ai/docs/guides/overview/auth/byok.mdx

## Using API Keys

### cURL Example

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "openai/gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Python with OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

response = client.chat.completions.create(
  model="openai/gpt-4",
  messages=[
    {"role": "user", "content": "Hello!"}
  ]
)
```

### TypeScript with OpenAI SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', 'content': 'Hello!' }],
});
```

### TypeScript with OpenRouter SDK

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

const completion = await openRouter.chat.send({
  model: 'openai/gpt-4',
  messages: [{ role: 'user', 'content': 'Hello!' }],
});
```

### Raw Fetch API

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer YOUR_OPENROUTER_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4',
    messages: [{ role: 'user', 'content': 'Hello!' }],
  }),
});
```

## Optional Headers

### App Attribution

These headers help identify your app and make it discoverable:

```bash
HTTP-Referer: https://your-site-url.com
X-Title: Your App Name
```

### Example with Optional Headers

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "HTTP-Referer: https://myapp.com" \
  -H "X-Title: My Awesome App" \
  -d '{
    "model": "openai/gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## API Key Management

### Retrieving Key Information

Get details about the current API key:

```bash
curl https://openrouter.ai/api/v1/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

**Response**:
```json
{
  "data": {
    "label": "My Key",
    "limit": 100.00,
    "limit_remaining": 45.50,
    "usage": 54.50,
    "usage_daily": 5.20,
    "usage_weekly": 32.10,
    "usage_monthly": 120.00,
    "is_free_tier": false
  }
}
```

**Source**: https://openrouter.ai/docs/api/reference/limits.mdx

### Listing All Keys

```bash
curl https://openrouter.ai/api/v1/keys \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

### Creating a New Key

```bash
curl -X POST https://openrouter.ai/api/v1/keys \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "New Key",
    "limit": 50.00
  }'
```

### Deleting a Key

```bash
curl -X DELETE https://openrouter.ai/api/v1/keys/{key_id} \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

## Best Practices

### Security

1. **Never Commit Keys**: Never commit API keys to public repositories
2. **Use Environment Variables**: Store keys in environment variables
3. **Rotate Keys Regularly**: Periodically rotate API keys
4. **Use Credit Limits**: Set limits on keys to prevent unexpected charges
5. **Monitor Usage**: Regularly check key usage for anomalies

### Environment Variables

```bash
# .env file
OPENROUTER_API_KEY=your_key_here

# Load in application
export OPENROUTER_API_KEY=$(grep OPENROUTER_API_KEY .env | cut -d '=' -f2)
```

### GitHub Integration

OpenRouter is a GitHub secret scanning partner:
- Automatically detects exposed keys in public repositories
- Sends email notifications when keys are compromised
- Best practice: Use GitHub secrets or environment variables

### Key Rotation

1. Navigate to https://openrouter.ai/settings/keys
2. Delete the old key
3. Create a new key
4. Update your application with the new key
5. Monitor usage to ensure smooth transition

**Source**: https://openrouter.ai/docs/guides/guides/api-key-rotation.mdx

## OAuth PKCE Implementation

### Step 1: Authorization Request

```typescript
const authResponse = await fetch('https://openrouter.ai/api/v1/oauth/authorization', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'YOUR_CLIENT_ID',
    redirect_uri: 'https://your-app.com/callback',
    scope: 'read write',
  }),
});
```

### Step 2: Exchange Code for API Key

```typescript
const tokenResponse = await fetch('https://openrouter.ai/api/v1/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    code: 'AUTHORIZATION_CODE_FROM_STEP_1',
    redirect_uri: 'https://your-app.com/callback',
  }),
});

const { api_key } = await tokenResponse.json();
```

## BYOK Implementation

### Configuring BYOK

When using BYOK, your API key from the provider is used instead of OpenRouter credits:

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer OPENROUTER_API_KEY',  // OpenRouter key
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'openai/gpt-4',
    messages: [{ role: 'user', 'content': 'Hello!' }],
    // Your OpenAI key will be used automatically via BYOK configuration
  }),
});
```

**Benefits**:
- Use your existing provider quotas
- Simplify billing and compliance
- Combine with OpenRouter's routing and fallbacks

**Source**: https://openrouter.ai/docs/guides/overview/auth/byok.mdx

## Guardrails and Access Control

### Guardrails

Organizations can enforce policies via guardrails:
- Spending limits per key or user
- Model allowlists/restrictions
- Provider allowlists/restrictions
- Zero Data Retention requirements

**Source**: https://openrouter.ai/docs/guides/features/guardrails.mdx

### Key-Specific Limits

Each API key can have:
- Credit limit: Maximum spend
- Limit reset period: How often limit resets
- Guardrails: Additional restrictions

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check API key is correct
   - Verify key hasn't been deleted
   - Ensure key has required permissions

2. **402 Payment Required**
   - Check credit balance
   - Verify key's credit limit
   - Purchase more credits if needed

3. **403 Forbidden**
   - Content moderation flag
   - Guardrails blocking request
   - Model access restrictions

### Testing Authentication

```bash
# Simple authentication test
curl https://openrouter.ai/api/v1/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

## SDK-Specific Authentication

### OpenRouter Python SDK

```python
from openrouter import OpenRouter

client = OpenRouter(api_key="YOUR_API_KEY")
```

### OpenRouter TypeScript SDK

```typescript
import { OpenRouter } from '@openrouter/sdk';

const client = new OpenRouter({ apiKey: 'YOUR_API_KEY' });
```

## Summary

- **Primary Method**: Bearer token in Authorization header
- **Key Types**: Regular and Provisioning
- **OAuth**: PKCE flow for user authentication
- **BYOK**: Use your own provider keys
- **Security**: Never commit keys, use env vars, rotate regularly
- **Management**: Full CRUD operations via API
- **Monitoring**: Check key info endpoint for usage stats

**Sources**:
- https://openrouter.ai/docs/api/reference/authentication.mdx
- https://openrouter.ai/docs/api/reference/limits.mdx
- https://openrouter.ai/docs/guides/overview/auth/oauth.mdx
- https://openrouter.ai/docs/guides/overview/auth/byok.mdx
- https://openrouter.ai/docs/guides/overview/auth/provisioning-api-keys.mdx
- https://openrouter.ai/docs/guides/features/guardrails.mdx
