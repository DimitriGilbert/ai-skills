# Request and Response Schemas

This document provides detailed information about OpenRouter API request and response schemas, based on the OpenAI Chat API format with OpenRouter-specific extensions.

**Source**: https://openrouter.ai/docs/api/reference/overview.mdx

## Request Schema

### Chat Completion Request

**Endpoint**: POST /api/v1/chat/completions

#### Core Parameters

```typescript
type ChatCompletionRequest = {
  // Required
  messages: Message[];
  
  // Optional
  model?: string;
  models?: string[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
  min_p?: number;
  top_a?: number;
  seed?: number;
  stop?: string | string[];
  tools?: Tool[];
  tool_choice?: ToolChoice;
  parallel_tool_calls?: boolean;
  response_format?: ResponseFormat;
  logprobs?: boolean;
  top_logprobs?: number;
  logit_bias?: Record<number, number>;
  provider?: ProviderPreferences;
  plugins?: Plugin[];
  transforms?: string[];
  route?: 'fallback' | 'sort';
  user?: string;
  session_id?: string;
  metadata?: Record<string, string>;
  debug?: DebugOptions;
};
```

### Message Schema

Messages represent the conversation history.

#### Text Message (System/User/Assistant)

```typescript
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
  name?: string;
};
```

#### Multimodal Content Parts

For vision models and multimodal inputs:

```typescript
type ContentPart = TextContentPart | ImageContentPart | AudioContentPart | VideoContentPart;

type TextContentPart = {
  type: 'text';
  text: string;
  cache_control?: CacheControl;
};

type ImageContentPart = {
  type: 'image_url';
  image_url: {
    url: string;  // URL or base64 data
    detail?: 'auto' | 'low' | 'high';
  };
};

type AudioContentPart = {
  type: 'input_audio';
  input_audio: {
    data: string;  // base64 encoded
    format: 'mp3' | 'wav';
  };
};

type VideoContentPart = {
  type: 'input_video' | 'video_url';
  video_url: {
    url: string;
  };
};
```

**Example**:
```json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "What's in this image?"
    },
    {
      "type": "image_url",
      "image_url": {
        "url": "https://example.com/image.jpg",
        "detail": "high"
      }
    }
  ]
}
```

#### Tool Response Message

```typescript
type ToolMessage = {
  role: 'tool';
  tool_call_id: string;
  content: string;
  name?: string;
};
```

#### Developer Message (New)

```typescript
type DeveloperMessage = {
  role: 'developer';
  content: string | ContentPart[];
  name?: string;
};
```

### Tool Schema

```typescript
type Tool = {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: object;  // JSON Schema
    strict?: boolean;
  };
};
```

**Example**:
```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get current weather for a location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "City name"
        }
      },
      "required": ["location"]
    }
  }
}
```

### Response Format Schema

#### JSON Mode

```typescript
type ResponseFormatJSON = {
  type: 'json_object';
};
```

#### JSON Schema Mode

```typescript
type ResponseFormatJSONSchema = {
  type: 'json_schema';
  json_schema: {
    name: string;
    description?: string;
    strict?: boolean;
    schema: object;  // JSON Schema
  };
};
```

#### Text Mode

```typescript
type ResponseFormatText = {
  type: 'text';
};
```

#### Grammar Mode

```typescript
type ResponseFormatGrammar = {
  type: 'grammar';
  grammar: string;
};
```

**Example**:
```json
{
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "weather_info",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "temperature": { "type": "number" },
          "conditions": { "type": "string" }
        },
        "required": ["temperature", "conditions"]
      }
    }
  }
}
```

### Provider Preferences Schema

```typescript
type ProviderPreferences = {
  order?: string[];  // Preferred provider order
  allow_fallbacks?: boolean;  // Enable fallbacks
  require_parameters?: boolean;  // Filter to supporting providers
  data_collection?: 'allow' | 'deny';  // Data retention
  only?: string[];  // Whitelist providers
  ignore?: string[];  // Blacklist providers
  quantizations?: ('int4' | 'int8' | 'fp4' | 'fp8' | 'fp16' | 'bf16' | 'fp32')[];
  sort?: 'price' | 'throughput' | 'latency';
  max_price?: {
    prompt?: number;
    completion?: number;
    request?: number;
  };
  preferred_min_throughput?: number;
  preferred_max_latency?: number;
};
```

**Example**:
```json
{
  "provider": {
    "order": ["openai", "anthropic"],
    "allow_fallbacks": true,
    "require_parameters": true,
    "data_collection": "deny",
    "sort": "price"
  }
}
```

### Plugin Schema

```typescript
type Plugin = {
  id: 'web' | 'file-parser' | 'response-healing' | 'auto-router' | 'moderation';
  enabled?: boolean;
  // Plugin-specific options
  max_results?: number;
  search_prompt?: string;
  engine?: 'native' | 'exa';
  pdf?: {
    engine?: 'mistral-ocr' | 'pdf-text' | 'native';
  };
};
```

**Example**:
```json
{
  "plugins": [
    {
      "id": "web",
      "enabled": true,
      "max_results": 5,
      "engine": "exa"
    },
    {
      "id": "response-healing"
    }
  ]
}
```

### Reasoning Schema

```typescript
type ReasoningConfig = {
  effort?: 'xhigh' | 'high' | 'medium' | 'low' | 'minimal' | 'none';
  summary?: 'auto' | 'concise' | 'detailed';
  max_tokens?: number;
};
```

**Example**:
```json
{
  "reasoning": {
    "effort": "high",
    "summary": "detailed"
  }
}
```

## Response Schema

### Chat Completion Response

```typescript
type ChatCompletionResponse = {
  id: string;
  object: 'chat.completion' | 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Choice[];
  system_fingerprint?: string;
  usage?: Usage;
  provider?: string;
};
```

### Choice Schema

#### Non-Streaming Choice

```typescript
type Choice = {
  index: number;
  message: AssistantMessage;
  finish_reason: FinishReason;
  logprobs?: LogProbs;
};
```

#### Streaming Choice

```typescript
type StreamingChoice = {
  index: number;
  delta: {
    role?: string;
    content?: string | null;
    tool_calls?: ToolCall[];
  };
  finish_reason: FinishReason | null;
};
```

### Assistant Message Schema

```typescript
type AssistantMessage = {
  role: 'assistant';
  content?: string | null;
  name?: string;
  tool_calls?: ToolCall[];
  refusal?: string | null;
  reasoning?: string | null;
  reasoning_details?: ReasoningDetails[];
  images?: ImageOutput[];
};
```

### Tool Call Schema

```typescript
type ToolCall = {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;  // JSON stringified
  };
};
```

**Example Response with Tool Call**:
```json
{
  "id": "gen-abc123",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_123",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"location\":\"San Francisco\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}
```

### Reasoning Details Schema

```typescript
type ReasoningDetails = {
  type: 'reasoning.summary' | 'reasoning.encrypted' | 'reasoning.text';
  id?: string;
  format?: string;
  index?: number;
  summary?: string;
  data?: string;
  text?: string;
  signature?: string;
};
```

### Finish Reasons

Normalized finish reasons:

```typescript
type FinishReason = 
  | 'stop'        // Natural completion
  | 'length'      // Max tokens reached
  | 'tool_calls'  // Tool calls generated
  | 'content_filter'  // Content filtered
  | 'error';      // Error occurred
```

### Usage Schema

```typescript
type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  
  // Prompt details
  prompt_tokens_details?: {
    cached_tokens: number;
    cache_write_tokens?: number;
    audio_tokens?: number;
    video_tokens?: number;
  };
  
  // Completion details
  completion_tokens_details?: {
    reasoning_tokens?: number;
    accepted_prediction_tokens?: number;
    rejected_prediction_tokens?: number;
    audio_tokens?: number;
  };
  
  // Cost information
  cost?: number;
  is_byok?: boolean;
  cost_details?: {
    upstream_inference_cost?: number;
    upstream_inference_prompt_cost: number;
    upstream_inference_completions_cost: number;
  };
};
```

**Example**:
```json
{
  "prompt_tokens": 100,
  "completion_tokens": 50,
  "total_tokens": 150,
  "prompt_tokens_details": {
    "cached_tokens": 20
  },
  "completion_tokens_details": {
    "reasoning_tokens": 10
  },
  "cost": 0.0035,
  "cost_details": {
    "upstream_inference_prompt_cost": 0.002,
    "upstream_inference_completions_cost": 0.0015
  }
}
```

### LogProbs Schema

```typescript
type LogProbs = {
  content: TokenLogProb[];
  refusal?: TokenLogProb[];
};

type TokenLogProb = {
  token: string;
  logprob: number;
  bytes?: number[];
  top_logprobs?: TopLogProb[];
};

type TopLogProb = {
  token: string;
  logprob: number;
  bytes?: number[];
};
```

### Image Output Schema (for image generation)

```typescript
type ImageOutput = {
  image_url: {
    url: string;
  };
};
```

### Annotation Schema

For web search citations:

```typescript
type Annotation = URLCitation | FileCitation;

type URLCitation = {
  type: 'url_citation';
  url_citation: {
    url: string;
    title: string;
    content?: string;
    start_index: number;
    end_index: number;
  };
};

type FileCitation = {
  type: 'file_citation';
  file_id: string;
  filename: string;
  index: number;
};
```

**Example**:
```json
{
  "message": {
    "role": "assistant",
    "content": "Here's some information from [OpenRouter](https://openrouter.ai).",
    "annotations": [
      {
        "type": "url_citation",
        "url_citation": {
          "url": "https://openrouter.ai",
          "title": "OpenRouter",
          "start_index": 40,
          "end_index": 51
        }
      }
    ]
  }
}
```

## Streaming Response Format

Server-Sent Events (SSE) stream chunks:

```
data: {"id":"gen-abc","choices":[{"delta":{"content":"Hello"}}]}
data: {"id":"gen-abc","choices":[{"delta":{"content":" there!"}}]}
data: {"id":"gen-abc","choices":[{"finish_reason":"stop","delta":{}}]}
data: [DONE]
```

### SSE Comment Payload

OpenRouter sends comments to prevent timeout:

```
: OPENROUTER PROCESSING
```

### Mid-Stream Error Format

```typescript
type StreamError = {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  error: {
    code: string | number;
    message: string;
  };
  choices: [{
    index: number;
    delta: { content: '' };
    finish_reason: 'error';
  }];
};
```

## Embeddings Request/Response

### Request Schema

```typescript
type EmbeddingsRequest = {
  model: string;
  input: string | string[];
  encoding_format?: 'float' | 'base64';
  dimensions?: number;
};
```

### Response Schema

```typescript
type EmbeddingsResponse = {
  object: 'list';
  data: Array<{
    object: 'embedding';
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
};
```

**Example**:
```json
{
  "object": "list",
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

## Model Information Schema

### Single Model

```typescript
type Model = {
  id: string;
  name: string;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    input_modalities: InputModality[];
    output_modalities: OutputModality[];
    instruct_type?: string;
  };
  pricing: Pricing;
  top_provider: TopProvider;
  per_request_limits?: PerRequestLimits;
  supported_parameters: Parameter[];
  created: number;
};
```

### Pricing Schema

```typescript
type Pricing = {
  prompt: string;        // Cost per 1M prompt tokens
  completion: string;    // Cost per 1M completion tokens
  request?: string;      // Fixed cost per request
  image?: string;        // Cost per image
  web_search?: string;   // Cost per web search
  internal_reasoning?: string;
  input_cache_read?: string;
  input_cache_write?: string;
  discount?: number;
};
```

## Error Response Schema

```typescript
type ErrorResponse = {
  error: {
    code: number;
    message: string;
    metadata?: Record<string, unknown>;
  };
};
```

### Error Metadata

**Moderation Error**:
```typescript
type ModerationErrorMetadata = {
  reasons: string[];
  flagged_input: string;
  provider_name: string;
  model_slug: string;
};
```

**Provider Error**:
```typescript
type ProviderErrorMetadata = {
  provider_name: string;
  raw: unknown;
};
```

## Summary Tables

### Request Parameter Types

| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| messages | Message[] | Yes | - |
| model | string | No* | User default |
| temperature | number | No | 1.0 |
| max_tokens | number | No | Model max |
| stream | boolean | No | false |
| tools | Tool[] | No | [] |

### Response Field Types

| Field | Type | Always Present |
|-------|------|---------------|
| id | string | Yes |
| object | string | Yes |
| created | number | Yes |
| model | string | Yes |
| choices | Choice[] | Yes |
| usage | Usage | No (streaming) |

**Sources**:
- https://openrouter.ai/docs/api/reference/overview.mdx
- https://openrouter.ai/openapi.json
