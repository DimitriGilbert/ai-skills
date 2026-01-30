# Advanced Features

Comprehensive guide to OpenRouter's advanced capabilities including streaming, tool calling, structured outputs, web search, and other plugins.

**Sources**: 
- https://openrouter.ai/docs/api/reference/streaming.mdx
- https://openrouter.ai/docs/guides/features/tool-calling.mdx
- https://openrouter.ai/docs/guides/features/structured-outputs.mdx
- https://openrouter.ai/docs/guides/features/plugins/web-search.mdx
- https://openrouter.ai/docs/guides/features/plugins/overview.mdx

## Streaming

### Overview

OpenRouter supports Server-Sent Events (SSE) streaming for all models, enabling real-time response generation.

**Endpoint**: POST /api/v1/chat/completions
**Enable**: Set `stream: true` in request

### Basic Streaming

**Request**:
```json
{
  "model": "openai/gpt-4",
  "messages": [{"role": "user", "content": "Tell me a story"}],
  "stream": true
}
```

**Response Format (SSE)**:
```
data: {"id":"gen-abc123","choices":[{"delta":{"content":"Once"}}]}
data: {"id":"gen-abc123","choices":[{"delta":{"content":" upon"}}]}
data: {"id":"gen-abc123","choices":[{"delta":{"content":" a"}}]}
data: {"id":"gen-abc123","choices":[{"delta":{"content":" time"}}]}
data: {"id":"gen-abc123","choices":[{"finish_reason":"stop","delta":{}}]}
data: {"usage":{"prompt_tokens":5,"completion_tokens":4,"total_tokens":9}}
data: [DONE]
```

### SSE Comments

OpenRouter sends comments to prevent connection timeouts:

```
: OPENROUTER PROCESSING
```

**Note**: Comments can be safely ignored per SSE spec.

### Stream Cancellation

Supported providers allow immediate cancellation:

**Supported**: OpenAI, Anthropic, Azure, Fireworks, Many More
**Not Supported**: AWS Bedrock, Groq, Google, Mistral, and others

**TypeScript Example**:
```typescript
const controller = new AbortController();

try {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4',
      messages: [{ role: 'user', 'content': 'Hello' }],
      stream: true,
    }),
    signal: controller.signal,
  });

  // Process stream...
  
  // Cancel:
  controller.abort();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Stream cancelled');
  }
}
```

### Streaming with Tools

Tool calls also stream in chunks:

```
data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call_1","type":"function","function":{"name":"get_weather"}}]}}]}
data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"{\"location\":\"San"}}]}}]}
data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":" Francisco\"}"}}]}]}
data: {"choices":[{"finish_reason":"tool_calls"}]}
```

### Usage in Streaming

Token usage appears in final chunk before `[DONE]`:

```typescript
for await (const chunk of stream) {
  const content = chunk.choices?.[0]?.delta?.content;
  if (content) {
    console.log(content);
  }
  
  if (chunk.usage) {
    console.log('Usage:', chunk.usage);
  }
}
```

### Error Handling in Streaming

**Pre-stream errors**: Standard JSON error response with HTTP status code

**Mid-stream errors**: SSE event with error field:

```json
{
  "id": "gen-abc",
  "object": "chat.completion.chunk",
  "error": {
    "code": "server_error",
    "message": "Provider disconnected"
  },
  "choices": [{
    "index": 0,
    "delta": { "content": "" },
    "finish_reason": "error"
  }]
}
```

## Tool / Function Calling

### Overview

Tool calling allows LLMs to suggest and execute external functions. OpenRouter standardizes this across all providers.

**Source**: https://openrouter.ai/docs/guides/features/tool-calling.mdx

### Supported Models

Find models supporting tools:
```
https://openrouter.ai/models?supported_parameters=tools
```

### Three-Step Process

1. **Inference Request**: Send tools in initial request
2. **Tool Execution**: Execute requested tools client-side
3. **Response with Results**: Send tool results back to model

### Step 1: Request with Tools

**Request**:
```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {"role": "user", "content": "What's the weather in SF?"}
  ],
  "tools": [
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
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["location"]
        }
      }
    }
  ]
}
```

**Response**:
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"location\":\"San Francisco\",\"unit\":\"celsius\"}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }]
}
```

### Step 2: Execute Tools

**Client-side code**:
```typescript
async function executeTool(toolCall) {
  const { name, arguments: args } = toolCall.function;
  const parsedArgs = JSON.parse(args);
  
  if (name === 'get_weather') {
    return await getWeatherAPI(parsedArgs.location);
  }
}
```

### Step 3: Send Results Back

**Request**:
```json
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {"role": "user", "content": "What's the weather in SF?"},
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"location\":\"San Francisco\"}"
        }
      }]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "{\"temperature\":18,\"conditions\":\"Sunny\"}"
    }
  ],
  "tools": [...same tools...]
}
```

**Response**:
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "The weather in San Francisco is 18°C and sunny."
    }
  }]
}
```

### Tool Choice Control

**Auto** (default): Model decides
```json
{ "tool_choice": "auto" }
```

**None**: No tool calls
```json
{ "tool_choice": "none" }
```

**Required**: Must call a tool
```json
{ "tool_choice": "required" }
```

**Specific**: Force specific tool
```json
{
  "tool_choice": {
    "type": "function",
    "function": { "name": "get_weather" }
  }
}
```

### Parallel Tool Calls

Default: Multiple tools can be called simultaneously

Disable for sequential calls:
```json
{
  "parallel_tool_calls": false
}
```

### Interleaved Thinking

Models can reason between tool calls for better decision-making:

**Benefits**:
- More nuanced decisions based on intermediate results
- Chain multiple tool calls with reasoning
- Transparent reasoning process

**Trade-offs**:
- Higher token usage
- Increased latency
- Cost considerations

**Source**: https://openrouter.ai/docs/guides/features/tool-calling.mdx

### Agentic Loop Pattern

Automatic multi-turn tool execution:

```typescript
const maxIterations = 10;
let iterations = 0;

while (iterations < maxIterations) {
  iterations++;
  
  const response = await callLLM(messages);
  
  if (response.choices[0].message.tool_calls) {
    // Execute all tools
    for (const toolCall of response.choices[0].message.tool_calls) {
      const result = await executeTool(toolCall);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }
  } else {
    break; // Done
  }
}
```

## Structured Outputs

### Overview

Enforce JSON Schema validation on model responses for consistent, type-safe outputs.

**Source**: https://openrouter.ai/docs/guides/features/structured-outputs.mdx

### JSON Object Mode

**Request**:
```json
{
  "model": "openai/gpt-4",
  "messages": [
    {"role": "system", "content": "Output JSON only"},
    {"role": "user", "content": "Describe the weather"}
  ],
  "response_format": { "type": "json_object" }
}
```

**Response**:
```json
{
  "temperature": 22,
  "conditions": "Sunny",
  "humidity": 45
}
```

### JSON Schema Mode

**Request**:
```json
{
  "model": "openai/gpt-4",
  "messages": [
    {"role": "user", "content": "What's the weather like?"}
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "weather",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name"
          },
          "temperature": {
            "type": "number",
            "description": "Temperature in Celsius"
          },
          "conditions": {
            "type": "string",
            "description": "Weather conditions"
          }
        },
        "required": ["location", "temperature", "conditions"],
        "additionalProperties": false
      }
    }
  }
}
```

**Response**:
```json
{
  "location": "San Francisco",
  "temperature": 18,
  "conditions": "Sunny with light breeze"
}
```

### Supported Models

Check support:
```
https://openrouter.ai/models?supported_parameters=structured_outputs
```

**Supporting Models**:
- OpenAI: GPT-4o and later
- Google: Gemini models
- Anthropic: Claude Sonnet 4.5 and Opus 4.1
- Most open-source models
- All Fireworks models

### Best Practices

1. **Include descriptions**: Help model understand fields
2. **Use strict mode**: Enforce exact schema adherence
3. **Keep schemas simple**: Complex schemas may reduce quality
4. **Test validation**: Verify outputs match schema
5. **Handle errors**: Gracefully fallback if validation fails

### Response Healing

Automatically repair malformed JSON responses:

**Request**:
```json
{
  "model": "openai/gpt-4",
  "response_format": { "type": "json_schema", ... },
  "plugins": [
    { "id": "response-healing" }
  ]
}
```

**Benefits**:
- Reduces parsing errors
- Fixes common JSON issues
- Works with any model

**Source**: https://openrouter.ai/docs/guides/features/plugins/response-healing.mdx

## Web Search

### Overview

Enable real-time web search for any model, providing factual, up-to-date information.

**Source**: https://openrouter.ai/docs/guides/features/plugins/web-search.mdx

### Enable via Model Variant

**Simplest method**:
```json
{
  "model": "openai/gpt-4:online"
}
```

**Works with free models too**:
```json
{
  "model": "openai/gpt-oss-20b:free:online"
}
```

### Enable via Plugin

**Request**:
```json
{
  "model": "openrouter.ai/auto",
  "plugins": [
    {
      "id": "web",
      "enabled": true,
      "max_results": 5
    }
  ]
}
```

### Web Search Engines

**Native**: Provider's built-in search
- OpenAI, Anthropic, Perplexity, xAI

**Exa**: Third-party search API
- All other providers

**Default**: Native if available, otherwise Exa

**Force Native**:
```json
{
  "plugins": [
    {
      "id": "web",
      "engine": "native"
    }
  ]
}
```

**Force Exa**:
```json
{
  "plugins": [
    {
      "id": "web",
      "engine": "exa"
    }
  ]
}
```

### Citations in Response

Web search results include annotations:

```json
{
  "message": {
    "role": "assistant",
    "content": "Latest AI developments include new models released in 2024. According to [OpenAI](https://openai.com), they launched GPT-4o...",
    "annotations": [
      {
        "type": "url_citation",
        "url_citation": {
          "url": "https://openai.com",
          "title": "OpenAI Blog",
          "start_index": 100,
          "end_index": 107
        }
      }
    ]
  }
}
```

### Pricing

**Exa Search**: $4 per 1000 results
- Default 5 results = $0.02 per request

**Native Search**: Provider-specific pricing
- See individual provider documentation

**Source**: Provider pricing documentation

### Customization

**Max Results**:
```json
{
  "plugins": [
    {
      "id": "web",
      "max_results": 10
    }
  ]
}
```

**Search Prompt**:
```json
{
  "plugins": [
    {
      "id": "web",
      "search_prompt": "Use these results:"
    }
  ]
}
```

### Search Context Size

Configure via `web_search_options`:

```json
{
  "web_search_options": {
    "search_context_size": "high"
  }
}
```

**Levels**:
- `"low"`: Minimal context
- `"medium"`: Moderate context (default)
- `"high"`: Extensive context

## Other Plugins

### File Parser

Parse PDFs and other documents:

```json
{
  "plugins": [
    {
      "id": "file-parser",
      "enabled": true,
      "pdf": {
        "engine": "mistral-ocr"
      }
    }
  ]
}
```

**PDF Engines**:
- `"mistral-ocr"`: OCR with Mistral
- `"pdf-text"`: Text extraction
- `"native"`: Provider native

**Source**: https://openrouter.ai/docs/guides/features/plugins/file-parser.mdx

### Auto Router

Automatic model selection:

```json
{
  "plugins": [
    {
      "id": "auto-router",
      "allowed_models": ["openai/*", "anthropic/*"]
    }
  ]
}
```

**Source**: https://openrouter.ai/docs/guides/routing/routers/auto-router.mdx

### Moderation

Content moderation:

```json
{
  "plugins": [
    { "id": "moderation" }
  ]
}
```

## Model Variants

### Free Models

Access free variants:
```json
{ "model": "openai/gpt-4o-mini:free" }
```

**Limits**:
- 200 requests/minute
- 200 requests/day (no credits)
- 2000 requests/day (with $5+ in credits)

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/free.mdx

### Extended Context

Larger context windows:
```json
{ "model": "anthropic/claude-3.5-sonnet:extended" }
```

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/extended.mdx

### Online Models

Web search enabled:
```json
{ "model": "google/gemini-pro:online" }
```

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/online.mdx

### Thinking Models

Enhanced reasoning:
```json
{ "model": "anthropic/claude-opus-4:thinking" }
```

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/thinking.mdx

### Nitro Models

High-speed inference:
```json
{ "model": "openai/gpt-4o:nitro" }
```

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/nitro.mdx

### Exacto Models

Target specific providers:
```json
{ "model": "openai/gpt-4:exacto" }
```

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/exacto.mdx

## Multimodal Capabilities

### Image Input

Vision models accept images:

```json
{
  "model": "openai/gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "What's in this image?" },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg",
            "detail": "high"
          }
        }
      ]
    }
  ]
}
```

**Source**: https://openrouter.ai/docs/guides/overview/multimodal/images.mdx

### Audio Input

Speech-capable models:

```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_audio",
          "input_audio": {
            "data": "base64_encoded_audio",
            "format": "mp3"
          }
        }
      ]
    }
  ]
}
```

**Source**: https://openrouter.ai/docs/guides/overview/multimodal/audio.mdx

### Video Input

Video-capable models:

```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_video",
          "video_url": {
            "url": "https://example.com/video.mp4"
          }
        }
      ]
    }
  ]
}
```

**Source**: https://openrouter.ai/docs/guides/overview/multimodal/videos.mdx

### PDF Input

Send PDF documents:

```json
{
  "plugins": [
    {
      "id": "file-parser",
      "enabled": true
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "input_file",
          "file_id": "file_abc123"
        }
      ]
    }
  ]
}
```

**Source**: https://openrouter.ai/docs/guides/overview/multimodal/pdfs.mdx

## Advanced Routing

### Model Fallbacks

Automatic failover between models:

```json
{
  "models": [
    "openai/gpt-4",
    "anthropic/claude-3.5-sonnet",
    "google/gemini-pro"
  ]
}
```

**Behavior**:
- Tries first model
- Falls back to next on error
- Uses whichever model succeeds

**Source**: https://openrouter.ai/docs/guides/routing/model-fallbacks.mdx

### Provider Routing

Control which providers serve requests:

```json
{
  "provider": {
    "order": ["openai", "anthropic"],
    "allow_fallbacks": true,
    "data_collection": "deny",
    "sort": "price"
  }
}
```

**Source**: https://openrouter.ai/docs/guides/routing/provider-selection.mdx

## Summary

| Feature | Description | Enable Method |
|---------|-------------|---------------|
| Streaming | Real-time responses | `stream: true` |
| Tool Calling | Execute functions | `tools: [...]` |
| Structured Outputs | JSON Schema validation | `response_format: { type: "json_schema" }` |
| Web Search | Real-time web results | `:online` variant or `plugins: [{ id: "web" }]` |
| File Parser | Parse PDFs/files | `plugins: [{ id: "file-parser" }]` |
| Response Healing | Fix malformed JSON | `plugins: [{ id: "response-healing" }]` |
| Auto Router | Automatic model selection | `plugins: [{ id: "auto-router" }]` |
| Model Fallbacks | Failover between models | `models: [...]` |
| Free Models | No-cost inference | `:free` suffix |
| Extended Context | Larger context windows | `:extended` suffix |
| Online Models | Web search built-in | `:online` suffix |

**Sources**:
- https://openrouter.ai/docs/api/reference/streaming.mdx
- https://openrouter.ai/docs/guides/features/tool-calling.mdx
- https://openrouter.ai/docs/guides/features/structured-outputs.mdx
- https://openrouter.ai/docs/guides/features/plugins/web-search.mdx
- https://openrouter.ai/docs/guides/features/plugins/overview.mdx
- https://openrouter.ai/docs/guides/routing/model-fallbacks.mdx
- https://openrouter.ai/docs/guides/routing/provider-selection.mdx
