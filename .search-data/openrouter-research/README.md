# OpenRouter API Research

This directory contains comprehensive research on the OpenRouter API, conducted in January 2026. This research is intended to be used as a foundation for creating a complete skill for OpenRouter.

## Overview

OpenRouter is a unified API platform that provides access to 400+ models from 90+ providers through a single, OpenAI-compatible interface. It acts as an aggregator and router, allowing developers to interact with models from OpenAI, Anthropic, Google, Cohere, Meta, and many other providers using a consistent API.

## Research Documents

### Core Documentation

**[api-overview.md](api-overview.md)**
- High-level description of OpenRouter API
- Core capabilities and features
- Supported providers and model families
- Pricing model and getting started guide

**[sources.md](sources.md)**
- Complete list of all research sources
- URLs and documentation references
- Research date and methodology

### API Reference

**[endpoints.md](endpoints.md)**
- Complete list of all API endpoints
- HTTP methods and parameters
- Request/response examples
- Summary table of all endpoints

**[authentication.md](authentication.md)**
- Bearer token authentication
- API key management
- OAuth PKCE implementation
- BYOK (Bring Your Own Key) feature
- Guardrails and access control

### Request/Response

**[request-response.md](request-response.md)**
- Detailed request schemas
- Message formats (text, multimodal, tools)
- Response structures
- Completion, streaming, and embedding formats
- Error response schemas

**[parameters.md](parameters.md)**
- All available parameters with types
- Ranges, defaults, and descriptions
- Sampling parameters (temperature, top_p, etc.)
- Tool/function parameters
- Routing and provider preferences
- Plugin configurations

### Advanced Features

**[advanced-features.md](advanced-features.md)**
- Streaming with Server-Sent Events
- Tool/Function calling
- Structured outputs with JSON Schema
- Web search integration
- Model variants (free, extended, online, etc.)
- Multimodal capabilities (images, audio, video)

**[models.md](models.md)**
- Model families and providers
- Model identifier format
- Capabilities by model
- Choosing the right model
- Comparison tables
- Model variants explanation

**[error-handling.md](error-handling.md)**
- Error codes and causes
- HTTP status codes (400, 401, 402, 403, 408, 429, 502, 503)
- Error metadata types (moderation, provider)
- Streaming error handling
- Best practices and retry strategies

**[examples.md](examples.md)**
- Python examples (OpenAI SDK, requests library)
- TypeScript examples (OpenAI SDK, @openrouter/sdk, fetch)
- cURL examples
- Advanced patterns (agentic loops, multimodal, semantic search)
- Error handling examples

## Key Features Covered

### Core Functionality
- Chat completions API
- Model selection and routing
- Streaming responses
- Embeddings API
- Credit management

### Advanced Capabilities
- Tool/function calling
- Structured outputs
- Web search
- Multimodal inputs (images, audio, video, PDFs)
- Model fallbacks
- Provider routing
- Plugins (web search, response healing, file parser, auto-router)

### Enterprise Features
- Guardrails (spending limits, access control)
- Zero Data Retention (ZDR)
- API key management
- Organization management
- Analytics and observability
- Broadcast integrations

## How to Use This Research

### For Skill Development

1. **Start with api-overview.md**: Understand what OpenRouter does
2. **Review authentication.md**: Learn how to authenticate requests
3. **Study request-response.md**: Understand data structures
4. **Check parameters.md**: Reference all available parameters
5. **Explore models.md**: Choose appropriate models for your use case
6. **Review examples.md**: See working code in multiple languages
7. **Implement advanced features**: Use advanced-features.md for streaming, tools, etc.
8. **Handle errors properly**: Reference error-handling.md

### For Quick Reference

- Need endpoint details? → [endpoints.md](endpoints.md)
- Need parameter info? → [parameters.md](parameters.md)
- Need code example? → [examples.md](examples.md)
- Need error info? → [error-handling.md](error-handling.md)
- Need model info? → [models.md](models.md)

## Research Sources

All research is based on official OpenRouter documentation:

- **Main Documentation**: https://openrouter.ai/docs
- **API Reference**: https://openrouter.ai/docs/api/reference/overview.mdx
- **OpenAPI Spec**: https://openrouter.ai/openapi.json
- **Models Page**: https://openrouter.ai/models

See [sources.md](sources.md) for complete list of references.

## Research Date

**Conducted**: January 30, 2026
**Method**: Documentation review, OpenAPI specification analysis, and API testing
**Sources**: Official OpenRouter documentation and API specifications

## File Statistics

- **Total Files**: 10 markdown documents
- **Total Lines**: ~5,925 lines
- **Total Size**: ~59KB

## Next Steps

This comprehensive research can be used to:

1. **Build a complete skill** for OpenRouter API
2. **Create SDK wrappers** in various programming languages
3. **Develop applications** using OpenRouter's features
4. **Implement best practices** for error handling and retry logic
5. **Optimize model selection** based on use case and cost

## Additional Resources

- **Discord Community**: https://openrouter.ai/discord
- **Support Email**: support@openrouter.ai
- **GitHub**: Check for example projects and integrations
- **RSS Feed**: https://openrouter.ai/api/v1/models?use_rss=true

---

**Research by**: AI Assistant
**Date**: January 30, 2026
**Purpose**: Skill development foundation
