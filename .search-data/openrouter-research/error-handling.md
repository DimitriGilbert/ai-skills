# Error Handling

Comprehensive guide to OpenRouter API errors, error codes, handling strategies, and debugging techniques.

**Source**: https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx

## Error Response Structure

### Standard Error Format

All errors follow this structure:

```typescript
type ErrorResponse = {
  error: {
    code: number;      // HTTP status code
    message: string;    // Human-readable error description
    metadata?: Record<string, unknown>;  // Additional error details
  };
};
```

**Example**:
```json
{
  "error": {
    "code": 401,
    "message": "Invalid API key provided",
    "metadata": {
      "key_id": "key_abc123",
      "reason": "expired"
    }
  }
}
```

## HTTP Status Codes

### 400 Bad Request

**Causes**:
- Invalid or missing required parameters
- Malformed request body
- Unsupported parameter for model
- CORS issues

**Example**:
```json
{
  "error": {
    "code": 400,
    "message": "Invalid model specified: invalid-model-name"
  }
}
```

**Solutions**:
- Verify model name from models API
- Check request format
- Ensure all required parameters present

### 401 Unauthorized

**Causes**:
- Invalid API key
- Expired API key
- Deleted API key
- Missing Authorization header

**Example**:
```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized: Invalid API key"
  }
}
```

**Solutions**:
- Check API key is correct
- Verify key hasn't been deleted
- Ensure Authorization header format: `Bearer YOUR_KEY`
- Check if key has necessary permissions

### 402 Payment Required

**Causes**:
- Insufficient credits
- Account balance negative
- Key's credit limit reached

**Example**:
```json
{
  "error": {
    "code": 402,
    "message": "Insufficient credits. Please add more credits.",
    "metadata": {
      "remaining_credits": 0.00,
      "required_credits": 0.05
    }
  }
}
```

**Solutions**:
- Purchase more credits at https://openrouter.ai
- Check credit usage at /api/v1/credits
- Verify key's credit limit
- Check guardrail limits if applicable

### 403 Forbidden

**Causes**:
- Content moderation flag
- Guardrails blocking request
- Model access restrictions
- Rate limiting on specific models

**Example** (Moderation):
```json
{
  "error": {
    "code": 403,
    "message": "Content flagged by moderation",
    "metadata": {
      "reasons": ["hate_speech", "violence"],
      "flagged_input": "...truncated to 100 chars...",
      "provider_name": "openai",
      "model_slug": "gpt-4"
    }
  }
}
```

**Solutions**:
- Review and modify flagged content
- Check guardrail restrictions
- Try different model
- Verify provider moderation policies

### 408 Request Timeout

**Causes**:
- Model taking too long to respond
- Network issues
- Provider timeouts

**Example**:
```json
{
  "error": {
    "code": 408,
    "message": "Request timeout: Model did not respond in time"
  }
}
```

**Solutions**:
- Implement retry logic with exponential backoff
- Reduce max_tokens
- Try faster model
- Check network connectivity
- Enable model fallbacks

### 429 Too Many Requests

**Causes**:
- Rate limit exceeded
- Too many concurrent requests
- Free model daily limit reached

**Example**:
```json
{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded. Please retry later.",
    "metadata": {
      "limit": 200,
      "remaining": 0,
      "reset_time": "2024-01-30T12:00:00Z"
    }
  }
}
```

**Solutions**:
- Implement exponential backoff
- Reduce request frequency
- Use multiple keys if needed
- Upgrade from free tier
- Enable provider fallbacks
- Use cached responses where possible

**Rate Limits**:
- Free models: 200 requests/minute
- General: Provider-specific
- Free daily: 200-2000 requests/day

### 502 Bad Gateway

**Causes**:
- Model provider is down
- Invalid response from provider
- Provider experiencing issues

**Example**:
```json
{
  "error": {
    "code": 502,
    "message": "Provider returned invalid response",
    "metadata": {
      "provider_name": "openai",
      "raw_error": "Connection reset by peer"
    }
  }
}
```

**Solutions**:
- Enable model fallbacks
- Try different provider
- Implement retry logic
- Check provider status page
- Use `allow_fallbacks: true`

### 503 Service Unavailable

**Causes**:
- No available providers meet requirements
- All matching providers down
- Guardrails blocking all options

**Example**:
```json
{
  "error": {
    "code": 503,
    "message": "No available provider meets routing requirements",
    "metadata": {
      "requested_model": "openai/gpt-4",
      "available_providers": [],
      "reason": "All providers blocked by guardrails"
    }
  }
}
```

**Solutions**:
- Relax guardrail restrictions
- Try different model
- Check provider availability
- Enable more providers
- Reduce routing requirements

## Error Metadata Types

### Moderation Error Metadata

**When**: Content moderation flags input

```typescript
type ModerationErrorMetadata = {
  reasons: string[];        // Why content was flagged
  flagged_input: string;     // Flagged content (truncated to 100 chars)
  provider_name: string;     // Which provider flagged it
  model_slug: string;        // Model identifier
};
```

**Example**:
```json
{
  "error": {
    "code": 403,
    "message": "Content violation",
    "metadata": {
      "reasons": ["hate_speech"],
      "flagged_input": "This is hate speech...",
      "provider_name": "anthropic",
      "model_slug": "claude-3.5-sonnet"
    }
  }
}
```

### Provider Error Metadata

**When**: Provider returns error

```typescript
type ProviderErrorMetadata = {
  provider_name: string;     // Which provider errored
  raw: unknown;             // Raw error from provider
};
```

**Example**:
```json
{
  "error": {
    "code": 502,
    "message": "Provider error",
    "metadata": {
      "provider_name": "openai",
      "raw": {
        "error": {
          "message": "Invalid API key",
          "type": "invalid_request_error",
          "code": "invalid_api_key"
        }
      }
    }
  }
}
```

## Streaming Error Handling

### Pre-Stream Errors

Errors before any tokens sent follow standard format:

**HTTP Status**: Non-200
**Response**: Standard `ErrorResponse`

```typescript
const response = await fetch(url, options);

if (!response.ok) {
  const error = await response.json();
  console.error(error.error.code, error.error.message);
}
```

### Mid-Stream Errors

Errors after tokens started sent as SSE events:

**Format**:
```typescript
type StreamError = {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  provider: string;
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

**Example**:
```
data: {"id":"gen-abc","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4","provider":"openai","error":{"code":"server_error","message":"Provider disconnected unexpectedly"},"choices":[{"index":0,"delta":{"content":""},"finish_reason":"error"}]}
```

**Handling**:
```typescript
for await (const chunk of stream) {
  if ('error' in chunk) {
    console.error('Stream error:', chunk.error.message);
    if (chunk.choices?.[0]?.finish_reason === 'error') {
      console.log('Stream terminated due to error');
    }
    return;
  }
  // Process normal content
}
```

### Handling Both Types

```typescript
async function handleStream(url, options) {
  const response = await fetch(url, options);
  
  // Check pre-stream errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pre-stream: ${error.error.message}`);
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    for (const line of buffer.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      
      const data = line.slice(6);
      if (data === '[DONE]') break;
      
      const chunk = JSON.parse(data);
      
      // Check mid-stream errors
      if (chunk.error) {
        console.error('Mid-stream error:', chunk.error.message);
        return;
      }
      
      // Process content
      console.log(chunk.choices?.[0]?.delta?.content);
    }
  }
}
```

## Special Error Cases

### Empty Responses

**Symptom**: No content generated

**Causes**:
- Model warming up (cold start)
- System scaling
- Provider issues

**Handling**:
```typescript
const completion = await openRouter.chat.send({...});

if (!completion.choices[0].message.content) {
  console.warn('No content generated, retrying...');
  // Implement retry logic
}
```

**Note**: You may still be charged for prompt tokens.

### Context Length Exceeded

**Symptom**: Request too long

**HTTP Status**: Varies (often 400 or provider-specific)

**Example**:
```json
{
  "error": {
    "code": 400,
    "message": "This model's maximum context length is 128000 tokens, but you provided 130000 tokens."
  }
}
```

**Solutions**:
- Reduce input length
- Use model with larger context
- Implement prompt compression
- Use message transforms

### Model Not Found

**Symptom**: Invalid model identifier

**Example**:
```json
{
  "error": {
    "code": 400,
    "message": "Model not found: openai/gpt-5 (model may not exist)"
  }
}
```

**Solutions**:
- Check models API for valid IDs
- Verify model spelling
- Check if model expired

### Tool Execution Errors

**Symptom**: Tool call fails

**Format**: Returned in response, not as HTTP error

**Example**:
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"location\":\"invalid\"}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }]
}
```

**Handling**:
```typescript
const completion = await openRouter.chat.send({...});

if (completion.choices[0].finish_reason === 'tool_calls') {
  for (const toolCall of completion.choices[0].message.tool_calls) {
    try {
      const result = await executeTool(toolCall);
      // Send result back...
    } catch (error) {
      console.error('Tool execution failed:', error);
      // Handle tool error...
    }
  }
}
```

## Debugging Options

### Debug Request Body

See what OpenRouter sends to providers:

**Request**:
```json
{
  "stream": true,  // Must be true
  "debug": {
    "echo_upstream_body": true
  },
  // ... other parameters
}
```

**Response** (first chunk):
```json
{
  "id": "gen-abc",
  "choices": [],
  "debug": {
    "echo_upstream_body": {
      "messages": [...],
      "model": "claude-3.5-sonnet-20241022",
      "max_tokens": 4096,
      "temperature": 1
    }
  }
}
```

**Use Cases**:
- Verify parameter transformations
- Check message formatting
- Understand applied defaults
- Debug provider fallbacks

**Important**:
- Only works with streaming (`stream: true`)
- Do not use in production
- May return sensitive information

### Request Tracing

Use `x-session-id` header for grouping requests:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "x-session-id: session-abc123" \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{...}'
```

**Benefits**:
- Group related requests in analytics
- Track conversation flows
- Debug multi-turn interactions

### User Tracking

Use `user` parameter for abuse detection:

```json
{
  "user": "user-123",
  "messages": [...]
}
```

**Benefits**:
- Improve caching performance
- Get detailed reporting
- Detect abuse patterns

## Best Practices

### Retry Strategy

```typescript
async function requestWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return await response.json();
      }
      
      // Don't retry on 4xx client errors (except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const error = await response.json();
        throw new Error(error.error.message);
      }
      
      // Wait before retry
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
  }
}
```

### Fallback Strategy

```typescript
const models = [
  'openai/gpt-4',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-2.5-pro'
];

for (const model of models) {
  try {
    const response = await openRouter.chat.send({
      model,
      messages: [...]
    });
    return response; // Success
  } catch (error) {
    console.log(`${model} failed, trying next...`);
    continue;
  }
}
throw new Error('All models failed');
```

### Error Logging

```typescript
function logError(error, context) {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    code: error.code,
    context: {
      model: context.model,
      params: context.params,
      user: context.user
    }
  });
}
```

### Graceful Degradation

```typescript
try {
  const response = await openRouter.chat.send({
    model: 'openai/gpt-4o',
    messages: [...]
  });
  return response.choices[0].message.content;
} catch (error) {
  if (error.code === 402) {
    // Payment required: try free model
    console.warn('Payment required, using fallback');
    return getFallbackResponse();
  } else if (error.code === 429) {
    // Rate limited: use cached response
    console.warn('Rate limited, using cache');
    return getCachedResponse();
  } else {
    throw error;
  }
}
```

## Summary Table

| Status Code | Error Type | Cause | Solution |
|-----------|------------|--------|-----------|
| 400 | Bad Request | Invalid params, malformed | Verify request |
| 401 | Unauthorized | Invalid/missing API key | Check key |
| 402 | Payment Required | Insufficient credits | Add credits |
| 403 | Forbidden | Moderation, guardrails | Modify content/relax guardrails |
| 408 | Timeout | Slow response | Retry, use faster model |
| 429 | Rate Limit | Too many requests | Implement backoff |
| 502 | Bad Gateway | Provider error | Enable fallbacks |
| 503 | Service Unavailable | No providers available | Try different model |

## Common Error Scenarios

### Scenario 1: First Request Fails

**Error**: 502 Bad Gateway
**Solution**: Enable model fallbacks or retry with different provider

### Scenario 2: Rate Limited

**Error**: 429 Too Many Requests
**Solution**: Implement exponential backoff, reduce frequency

### Scenario 3: Content Flagged

**Error**: 403 Forbidden with moderation metadata
**Solution**: Modify content, try different model

### Scenario 4: Empty Response

**Error**: No content in response
**Solution**: Implement retry logic, model warming

### Scenario 5: Stream Interrupted

**Error**: Mid-stream SSE error
**Solution**: Handle stream errors, implement graceful recovery

**Sources**:
- https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx
- https://openrouter.ai/docs/api/reference/streaming.mdx
- https://openrouter.ai/docs/api/reference/limits.mdx
- https://openrouter.ai/docs/guides/features/guardrails.mdx
