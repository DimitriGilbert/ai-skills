# OpenRouter API Research Sources

This document lists all sources used in researching the OpenRouter API.

## Primary Documentation

- **Main Documentation**: https://openrouter.ai/docs
  - Complete documentation index with all available guides and API references

- **API Reference Overview**: https://openrouter.ai/docs/api/reference/overview.mdx
  - Comprehensive guide to OpenRouter's API including request/response schemas

- **Authentication**: https://openrouter.ai/docs/api/reference/authentication.mdx
  - How to authenticate with OpenRouter using API keys and Bearer tokens

- **Parameters**: https://openrouter.ai/docs/api/reference/parameters.mdx
  - All available parameters for OpenRouter API requests

- **Errors and Debugging**: https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx
  - Error codes, messages, and debugging options

- **Streaming**: https://openrouter.ai/docs/api/reference/streaming.mdx
  - Server-Sent Events (SSE) and real-time model outputs

- **Embeddings**: https://openrouter.ai/docs/api/reference/embeddings.mdx
  - Generate vector embeddings using OpenRouter's unified embeddings API

- **Limits**: https://openrouter.ai/docs/api/reference/limits.mdx
  - Rate limits, credit-based quotas, and DDoS protection

- **Models**: https://openrouter.ai/docs/guides/overview/models.mdx
  - Access all major language models through OpenRouter's unified API

- **OpenAPI Specification**: https://openrouter.ai/openapi.json
  - Complete OpenAPI 3.1.0 specification for the OpenRouter API

## API Endpoints

- **Chat Completions**: https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request.mdx
  - POST /api/v1/chat/completions - Send chat completion requests

- **List Models**: https://openrouter.ai/docs/api/api-reference/models/get-models.mdx
  - GET /api/v1/models - List all available models

- **Get Credits**: https://openrouter.ai/docs/api/api-reference/credits/get-credits.mdx
  - GET /api/v1/credits - Get remaining credits

- **Get Key Info**: GET /api/v1/key (referenced in Limits docs)
  - Get API key information including rate limits and credits

## Advanced Features

- **Tool & Function Calling**: https://openrouter.ai/docs/guides/features/tool-calling.mdx
  - Use tools/functions in prompts with OpenRouter

- **Structured Outputs**: https://openrouter.ai/docs/guides/features/structured-outputs.mdx
  - Enforce JSON Schema validation on AI model responses

- **Web Search Plugin**: https://openrouter.ai/docs/guides/features/plugins/web-search.mdx
  - Enable real-time web search capabilities

- **Model Fallbacks**: https://openrouter.ai/docs/guides/routing/model-fallbacks.mdx
  - Automatic failover between AI models

- **Guardrails**: https://openrouter.ai/docs/guides/features/guardrails.mdx
  - Spending limits, model restrictions, and data policies

## Additional Features Referenced

- **Response Healing**: Referenced in documentation
- **Zero Data Retention (ZDR)**: Referenced in documentation
- **Message Transforms**: Referenced in documentation
- **Provider Routing**: Referenced in documentation
- **Prompt Caching**: Referenced in documentation
- **Model Variants** (:free, :extended, :exacto, :thinking, :online, :nitro): Referenced in docs

## Models and Providers

- **Models Page**: https://openrouter.ai/models
  - Browse 400+ models and providers

- **Filter by Parameters**: https://openrouter.ai/models?supported_parameters=tools
  - Find models supporting specific features

- **Embeddings Models**: https://openrouter.ai/models?output_modalities=embeddings
  - Browse embedding models

## Community and Integration

- **Frameworks and Integrations**: Referenced in main docs
- **OpenAI SDK**: Compatible with OpenRouter (use base_url parameter)
- **LangChain**: Integration available
- **Vercel AI SDK**: Integration available
- **TypeScript SDK**: @openrouter/sdk
- **Python SDK**: openrouter

## Research Date

- **Date**: January 30, 2026
- **Research Method**: Documentation review, OpenAPI specification analysis, and API testing
