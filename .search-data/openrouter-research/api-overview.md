# OpenRouter API Overview

## What is OpenRouter?

OpenRouter is a unified API platform that provides access to hundreds of AI models from multiple providers through a single, standardized interface. It acts as an aggregator and router, allowing developers to interact with models from OpenAI, Anthropic, Google, Cohere, Meta, and many other providers using a consistent OpenAI-compatible API.

**Source**: https://openrouter.ai/docs

## Core Capabilities

### 1. **Unified API Interface**
- Single API endpoint for accessing 400+ models from 90+ providers
- OpenAI-compatible request/response format
- Consistent schemas across all models and providers
- Easy switching between models without code changes

### 2. **Intelligent Routing**
- Automatic provider selection based on cost, performance, and availability
- Model fallbacks for high availability
- Provider routing to optimize for specific needs (cost, latency, throughput)
- Load balancing across multiple providers

### 3. **Advanced Features**
- **Streaming**: Server-Sent Events (SSE) for real-time responses
- **Tool/Function Calling**: Execute external functions via LLMs
- **Structured Outputs**: Enforce JSON Schema validation on responses
- **Web Search**: Real-time web search integration
- **Embeddings**: Vector embeddings for semantic search
- **Multimodal Support**: Images, audio, video, and PDF inputs
- **Plugins**: Extend model capabilities (web search, response healing, etc.)

### 4. **Cost Optimization**
- Competitive pricing across providers
- Free model variants with :free suffix
- Prompt caching for cost reduction
- Transparent usage tracking and reporting
- Zero completion insurance (no charge for failed responses)

### 5. **Enterprise Features**
- Guardrails for spending limits and access control
- Zero Data Retention (ZDR) compliance
- API key management and rotation
- Organization management
- Analytics and observability integrations
- Broadcast to multiple monitoring platforms

## How It Works

OpenRouter sits between your application and AI model providers:

1. **Request Normalization**: Your API call is sent to OpenRouter with standardized parameters
2. **Routing**: OpenRouter intelligently routes to the best available provider for your model
3. **Transformation**: Parameters are transformed to match the provider's native format
4. **Execution**: Request is sent to the underlying provider
5. **Response Normalization**: Provider response is transformed back to standard format
6. **Delivery**: Standardized response is returned to your application

## Key Benefits

### For Developers
- **Simplified Integration**: Single SDK instead of integrating with multiple providers
- **Consistent Interface**: Same code works across all models and providers
- **Reduced Vendor Lock-in**: Easy to switch providers without rewriting code
- **Built-in Reliability**: Automatic fallbacks and error handling
- **Comprehensive Documentation**: Centralized resources for all models

### For Organizations
- **Cost Control**: Spending limits and budget management via guardrails
- **Access Management**: Restrict models and providers for team members
- **Compliance**: Zero Data Retention and privacy controls
- **Observability**: Analytics and monitoring integrations
- **Scalability**: Automatic load balancing and capacity management

### For Users
- **Model Variety**: Access to 400+ models including cutting-edge releases
- **Performance Optimization**: Best provider selected automatically
- **High Availability**: Automatic failover when providers have issues
- **Cost Efficiency**: Competitive pricing and smart routing

## Supported Providers

OpenRouter supports 90+ providers including:

- **Major AI Labs**: OpenAI, Anthropic, Google, xAI, Cohere
- **Cloud Platforms**: AWS Bedrock, Azure, Google Cloud, Cloudflare
- **Specialized Providers**: DeepInfra, Fireworks, Together, Replicate
- **Open Source**: Various Llama, Mistral, Qwen, DeepSeek models
- **Niche Models**: Specialized models for coding, roleplay, specific tasks

**Source**: https://openrouter.ai/docs

## API Compatibility

### OpenAI SDK Compatible
OpenRouter is fully compatible with the OpenAI SDK:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',  // Only change needed
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});
```

### Framework Integrations
- LangChain (Python and TypeScript)
- Vercel AI SDK
- PydanticAI
- Effect AI SDK
- And many more

**Source**: https://openrouter.ai/docs/guides/community/frameworks-and-integrations-overview.mdx

## Pricing Model

OpenRouter operates on a credit-based system:

1. **Purchase Credits**: Buy credits upfront
2. **Pay Per Use**: Each API request deducts credits based on tokens used
3. **Transparent Pricing**: See exact costs per token for each model
4. **Free Tier**: Free models available with :free suffix
5. **BYOK**: Bring Your Own Key option to use your own provider keys

**Source**: https://openrouter.ai/docs

## Getting Started

### 1. Get API Key
- Sign up at https://openrouter.ai
- Navigate to Keys page
- Create new API key
- Optionally set credit limit for the key

### 2. Make a Request
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "openai/gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### 3. Use SDKs
- TypeScript: `npm install @openrouter/sdk`
- Python: `pip install openrouter`

**Source**: https://openrouter.ai/docs

## Documentation Resources

- **Main Docs**: https://openrouter.ai/docs
- **API Reference**: https://openrouter.ai/docs/api/reference/overview.mdx
- **Models Browser**: https://openrouter.ai/models
- **Community**: https://openrouter.ai/discord

## Next Steps

- Explore [API Endpoints](endpoints.md)
- Learn about [Authentication](authentication.md)
- Review [Request/Response Schemas](request-response.md)
- See [Parameters](parameters.md) reference
- Check [Advanced Features](advanced-features.md)
- View [Code Examples](examples.md)
