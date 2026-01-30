# OpenRouter API Endpoints

This document lists all available OpenRouter API endpoints with their purposes, methods, and key parameters.

**Source**: https://openrouter.ai/docs and https://openrouter.ai/openapi.json

## Base URL

```
https://openrouter.ai/api/v1
```

## Chat Completions

### POST /api/v1/chat/completions
Send a chat completion request to generate model responses.

**Documentation**: https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request.mdx

**Purpose**: Primary endpoint for generating text completions from conversational messages

**Method**: `POST`

**Authentication**: Bearer token required (Authorization header)

**Request Body**:
- `model` (string, optional): Model identifier (e.g., "openai/gpt-4")
- `messages` (array, required): Conversation messages array
- `models` (array, optional): Fallback models array for automatic failover
- `stream` (boolean, optional): Enable Server-Sent Events streaming
- `temperature` (number, 0-2): Sampling temperature
- `max_tokens` (number, optional): Maximum tokens to generate
- `top_p` (number, 0-1): Nucleus sampling parameter
- `tools` (array, optional): Tool/function definitions
- `tool_choice` (string/object): Tool selection mode
- `response_format` (object): Structured output format
- `stop` (string/array): Stop sequences
- `frequency_penalty` (number, -2 to 2): Frequency-based penalty
- `presence_penalty` (number, -2 to 2): Presence-based penalty
- `provider` (object): Provider routing preferences
- `plugins` (array): Plugins to enable (web search, etc.)
- `user` (string): User identifier for tracking
- `metadata` (object): Custom metadata
- And many more parameters (see [Parameters](parameters.md))

**Response**:
- `id` (string): Unique generation ID
- `choices` (array): Array of completion choices
- `created` (number): Unix timestamp
- `model` (string): Model actually used
- `object` (string): Object type ("chat.completion")
- `usage` (object): Token usage and cost information

**Example Request**:
```json
{
  "model": "openai/gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "max_tokens": 100
}
```

**Example Response**:
```json
{
  "id": "gen-abc123",
  "choices": [
    {
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      }
    }
  ],
  "created": 1234567890,
  "model": "openai/gpt-4",
  "object": "chat.completion",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 10,
    "total_tokens": 30
  }
}
```

## Models

### GET /api/v1/models
List all available models and their properties.

**Documentation**: https://openrouter.ai/docs/api/api-reference/models/get-models.mdx

**Purpose**: Retrieve comprehensive list of all available models with metadata

**Method**: `GET`

**Authentication**: Bearer token required

**Query Parameters**:
- `category` (string, optional): Filter by use case category
  - Values: `programming`, `roleplay`, `marketing`, `technology`, `science`, `translation`, `legal`, `finance`, `health`, `trivia`, `academia`
- `supported_parameters` (string, optional): Filter by supported features
  - Example: `tools`, `structured_outputs`, `reasoning`
- `use_rss` (string, optional): Return RSS feed instead of JSON

**Response**:
- `data` (array): Array of model objects
  - `id` (string): Unique model identifier
  - `name` (string): Display name
  - `description` (string): Model description
  - `context_length` (number): Maximum context tokens
  - `pricing` (object): Pricing information
  - `architecture` (object): Architecture details
  - `top_provider` (object): Top provider info
  - `supported_parameters` (array): List of supported features

**Example Response**:
```json
{
  "data": [
    {
      "id": "openai/gpt-4",
      "name": "GPT-4",
      "description": "Large multimodal model",
      "context_length": 128000,
      "pricing": {
        "prompt": "0.03",
        "completion": "0.06"
      },
      "architecture": {
        "input_modalities": ["text", "image"],
        "output_modalities": ["text"]
      }
    }
  ]
}
```

### GET /api/v1/models/count
Get total count of available models.

**Purpose**: Retrieve count of models without full details

**Method**: `GET`

**Response**: Integer count

## Embeddings

### POST /api/v1/embeddings
Generate vector embeddings from text.

**Documentation**: https://openrouter.ai/docs/api/reference/embeddings.mdx

**Purpose**: Convert text to numerical vectors for semantic search and similarity

**Method**: `POST`

**Request Body**:
- `model` (string, required): Embedding model identifier
- `input` (string/array, required): Text or array of texts to embed

**Response**:
- `data` (array): Array of embeddings
  - `embedding` (array): Vector of numbers
  - `index` (number): Index in input array
  - `object` (string): Object type ("embedding")

**Example Request**:
```json
{
  "model": "openai/text-embedding-3-small",
  "input": "The quick brown fox jumps over the lazy dog"
}
```

**Example Response**:
```json
{
  "data": [
    {
      "object": "embedding",
      "embedding": [0.0023, -0.0052, 0.0091, ...],
      "index": 0
    }
  ],
  "model": "openai/text-embedding-3-small",
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 10
  }
}
```

### GET /api/v1/embeddings/models
List all available embedding models.

**Purpose**: Get list of models that support embeddings

**Method**: `GET`

**Response**: Same structure as GET /api/v1/models, filtered to embedding models

## Credits

### GET /api/v1/credits
Get remaining credits for authenticated user.

**Documentation**: https://openrouter.ai/docs/api/api-reference/credits/get-credits.mdx

**Purpose**: Check credit balance and usage

**Method**: `GET`

**Authentication**: Bearer token required (provisioning key)

**Response**:
- `data` (object):
  - `total_credits` (number): Total credits purchased
  - `total_usage` (number): Total credits used

**Example Response**:
```json
{
  "data": {
    "total_credits": 100.00,
    "total_usage": 45.50
  }
}
```

### POST /api/v1/credits/coinbase
Create a Coinbase charge for crypto payment.

**Purpose**: Purchase credits using cryptocurrency

**Method**: `POST`

## API Keys

### GET /api/v1/auth/key
Get current API key information.

**Purpose**: Retrieve details about the API key making the request

**Method**: `GET`

**Authentication**: Bearer token required

**Response**:
- `data` (object):
  - `label` (string): Key name
  - `limit` (number/null): Credit limit
  - `limit_remaining` (number/null): Remaining credits
  - `usage` (number): Total usage
  - `usage_daily` (number): Today's usage
  - `usage_weekly` (number): Week's usage
  - `usage_monthly` (number): Month's usage
  - `is_free_tier` (boolean): Free tier status

### GET /api/v1/keys
List all API keys for authenticated user.

**Method**: `GET`

### POST /api/v1/keys
Create a new API key.

**Method**: `POST`

**Request Body**:
- `label` (string): Key name
- `limit` (number, optional): Credit limit
- `limit_reset` (string, optional): Reset period
- `enable_guardrails` (boolean, optional): Enable guardrails

### GET /api/v1/keys/{key_id}
Get a specific API key.

**Method**: `GET`

### DELETE /api/v1/keys/{key_id}
Delete an API key.

**Method**: `DELETE`

### PATCH /api/v1/keys/{key_id}
Update an API key.

**Method**: `PATCH`

## Generations

### GET /api/v1/generation?id={generation_id}
Get request & usage metadata for a generation.

**Purpose**: Retrieve detailed stats about a completed generation

**Method**: `GET`

**Query Parameters**:
- `id` (string, required): Generation ID from completion response

**Response**:
- `data` (object): Generation metadata
  - Token counts, costs, provider information
  - Timing and performance data
  - Error details if applicable

## Analytics

### GET /api/v1/analytics/endpoint
Get user activity grouped by endpoint.

**Purpose**: Retrieve usage analytics by endpoint

**Method**: `GET`

## Providers

### GET /api/v1/providers
List all available providers.

**Purpose**: Get list of AI model providers integrated with OpenRouter

**Method**: `GET`

**Response**:
- Array of provider objects with status, capabilities, and routing info

## Endpoints

### GET /api/v1/endpoints?model={model}
List all endpoints for a model.

**Purpose**: Get provider-specific endpoints for a given model

**Method**: `GET`

**Query Parameters**:
- `model` (string, required): Model identifier

### GET /api/v1/endpoints/zdr?model={model}
Preview impact of ZDR on available endpoints.

**Purpose**: See which endpoints support Zero Data Retention

**Method**: `GET`

## Guardrails

### GET /api/v1/guardrails
List all guardrails.

**Method**: `GET`

### POST /api/v1/guardrails
Create a new guardrail.

**Method**: `POST`

**Request Body**:
- `name` (string): Guardrail name
- `budget_limit` (number, optional): Spending limit
- `budget_reset_period` (string): Reset period (daily, weekly, monthly)
- `model_allowlist` (array, optional): Allowed models
- `provider_allowlist` (array, optional): Allowed providers
- `enforce_zdr` (boolean, optional): Require ZDR

### GET /api/v1/guardrails/{guardrail_id}
Get a specific guardrail.

**Method**: `GET`

### DELETE /api/v1/guardrails/{guardrail_id}
Delete a guardrail.

**Method**: `DELETE`

### PATCH /api/v1/guardrails/{guardrail_id}
Update a guardrail.

**Method**: `PATCH`

### POST /api/v1/guardrails/{guardrail_id}/assign-keys
Bulk assign keys to a guardrail.

**Method**: `POST`

### POST /api/v1/guardrails/{guardrail_id}/assign-members
Bulk assign members to a guardrail.

**Method**: `POST`

### GET /api/v1/guardrails/{guardrail_id}/keys
List key assignments for a guardrail.

**Method**: `GET`

### GET /api/v1/guardrails/{guardrail_id}/members
List member assignments for a guardrail.

**Method**: `GET`

## OAuth

### POST /api/v1/oauth/authorization
Create authorization code.

**Purpose**: Start OAuth PKCE flow for user authentication

**Method**: `POST`

### POST /api/v1/oauth/token
Exchange authorization code for API key.

**Purpose**: Complete OAuth PKCE flow and obtain API key

**Method**: `POST`

## Responses API (Beta)

### POST /api/alpha/responses
Create a response using Responses API.

**Purpose**: OpenAI-compatible Responses API with reasoning, tool calling, web search

**Method**: `POST`

**Documentation**: https://openrouter.ai/docs/api/reference/responses/overview.mdx

## Summary Table

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| /chat/completions | POST | Generate completions | Yes |
| /models | GET | List all models | No (for public) |
| /models/count | GET | Count models | No |
| /embeddings | POST | Generate embeddings | Yes |
| /embeddings/models | GET | List embedding models | Yes |
| /credits | GET | Get credit balance | Yes |
| /auth/key | GET | Get current key info | Yes |
| /keys | GET | List API keys | Yes |
| /keys | POST | Create API key | Yes |
| /keys/{id} | GET | Get API key | Yes |
| /keys/{id} | DELETE | Delete API key | Yes |
| /keys/{id} | PATCH | Update API key | Yes |
| /generation | GET | Get generation metadata | Yes |
| /analytics/endpoint | GET | Get usage analytics | Yes |
| /providers | GET | List providers | Yes |
| /endpoints | GET | List model endpoints | Yes |
| /guardrails | GET | List guardrails | Yes |
| /guardrails | POST | Create guardrail | Yes |
| /guardrails/{id} | GET/PATCH/DELETE | Manage guardrail | Yes |
| /oauth/authorization | POST | Create OAuth code | No |
| /oauth/token | POST | Exchange OAuth token | No |

## Rate Limits

- **Free Models**: 200 requests/minute for free variants
- **Daily Free Model Limits**: 
  - Without credits: 200 requests/day
  - With $5+ in credits: 2000 requests/day
- **General**: Cloudflare DDoS protection applies

**Source**: https://openrouter.ai/docs/api/reference/limits.mdx
