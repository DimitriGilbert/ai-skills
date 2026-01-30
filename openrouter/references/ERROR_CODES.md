# Error Codes Reference

Complete guide to OpenRouter API error codes, response structure, and handling strategies.

**Source**: https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx

---

## HTTP Status Codes

### 400 Bad Request

**Description**: Invalid request format or parameters

**Common causes**:
- Missing required fields
- Invalid parameter values (out of range, wrong type)
- Malformed request body
- Invalid JSON structure
- Parameter not supported by model

**Example error**:
```json
{
  "error": {
    "code": 400,
    "message": "Invalid request: 'messages' is required"
  }
}
```

**How to handle**:
1. Validate request structure before sending
2. Check all required fields are present
3. Verify parameter types and ranges
4. Check model supports all parameters used
5. **Do not retry** - fix the request

**Common 400 errors**:
- Missing `messages` field
- `temperature` outside 0-2 range
- `max_tokens` exceeds model context length
- Invalid model ID
- Malformed JSON

---

### 401 Unauthorized

**Description**: Missing or invalid API key

**Common causes**:
- No `Authorization` header
- Invalid API key format
- API key does not exist
- API key has been revoked

**Example error**:
```json
{
  "error": {
    "code": 401,
    "message": "Invalid API key"
  }
}
```

**How to handle**:
1. Verify API key is set correctly
2. Check format: `Authorization: Bearer YOUR_KEY`
3. Ensure key is valid and active
4. Check if key was revoked
5. **Do not retry** - fix authentication

**Debug steps**:
```typescript
// Verify key format
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey?.startsWith('sk-or-')) {
  console.error('Invalid API key format');
}

// Verify header
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  // ...
};
```

---

### 402 Payment Required

**Description**: Insufficient credits

**Common causes**:
- Account balance is zero or low
- Cost of request exceeds available credits
- Spending limits reached

**Example error**:
```json
{
  "error": {
    "code": 402,
    "message": "Insufficient credits",
    "metadata": {
      "required": 0.00015,
      "available": 0.00000,
      "currency": "USD"
    }
  }
}
```

**How to handle**:
1. Check account balance
2. Add credits to account
3. Use cheaper models or :free variants
4. Set spending limits appropriately
5. **Retry after** adding credits

**Prevention**:
```typescript
// Use free models when credits low
const useFreeModel = balance < 0.01;
const model = useFreeModel
  ? 'google/gemini-2.0-flash:free'
  : 'anthropic/claude-3.5-sonnet';
```

---

### 403 Forbidden

**Description**: Insufficient permissions or access denied

**Common causes**:
- Model not allowed (guardrails)
- API key lacks permissions
- Organization restrictions
- Model access not purchased
- Rate limit exceeded (some cases)

**Example error**:
```json
{
  "error": {
    "code": 403,
    "message": "Model not allowed for this API key",
    "metadata": {
      "model": "anthropic/claude-opus-4",
      "restriction": "guardrails"
    }
  }
}
```

**How to handle**:
1. Check guardrails settings
2. Verify API key permissions
3. Check if model requires additional access
4. Review organization settings
5. Use allowed models

**Debug steps**:
- Check API key settings in dashboard
- Verify guardrail configuration
- Check if model is in allowed list
- Try a different model

---

### 408 Request Timeout

**Description**: Request took too long to complete

**Common causes**:
- Very long prompts
- Complex reasoning tasks
- Provider latency
- Network issues

**Example error**:
```json
{
  "error": {
    "code": 408,
    "message": "Request timeout after 60 seconds"
  }
}
```

**How to handle**:
1. Reduce prompt length
2. Use streaming for real-time feedback
3. Try a faster model (nitro variant)
4. Reduce max_tokens
5. **Retry with** simpler request

**Prevention**:
```typescript
// Use streaming for long responses
{
  stream: true,
  max_tokens: 1000,  // Limit output length
}

// Use faster model for quick responses
{
  model: 'openai/gpt-4o-mini:nitro'
}
```

---

### 429 Rate Limited

**Description**: Too many requests

**Common causes**:
- Exceeded request rate limit
- Too many concurrent requests
- Model-specific rate limits
- API key rate limits

**Example error**:
```json
{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded",
    "metadata": {
      "limit": 60,
      "remaining": 0,
      "reset": "2026-01-30T12:00:00Z"
    }
  }
}
```

**How to handle**:
1. Implement exponential backoff
2. Reduce request rate
3. Use API key with higher limits
4. Implement request queuing
5. **Retry with** backoff

**Exponential backoff strategy**:
```typescript
async function requestWithBackoff(url, options) {
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve =>
        setTimeout(resolve, baseDelay * Math.pow(2, attempt))
      );
    }
  }
}
```

**Prevention**:
- Use model fallbacks to distribute load
- Implement request throttling
- Monitor usage and adjust rate
- Use batch APIs when available

---

### 502 Bad Gateway

**Description**: Provider error or invalid response

**Common causes**:
- Provider returned error
- Provider timeout
- Invalid response from provider
- Provider service unavailable

**Example error**:
```json
{
  "error": {
    "code": 502,
    "message": "Provider returned invalid response",
    "metadata": {
      "provider": "openai",
      "native_error": "timeout"
    }
  }
}
```

**How to handle**:
1. Use model fallbacks
2. **Retry with** different model/provider
3. Check provider status
4. Implement graceful degradation

**Retry with fallback**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',  // Primary
    'openai/gpt-4o',                // Fallback 1
    'google/gemini-2.0-flash'        // Fallback 2
  ]
}
```

---

### 503 Service Unavailable

**Description**: Service overloaded or temporarily unavailable

**Common causes**:
- High demand/overload
- Provider maintenance
- Temporary outage
- Capacity issues

**Example error**:
```json
{
  "error": {
    "code": 503,
    "message": "Service temporarily unavailable",
    "metadata": {
      "retry_after": 30
    }
  }
}
```

**How to handle**:
1. **Retry with** exponential backoff
2. Use model fallbacks
3. Implement graceful degradation
4. Check status page if available

**Backoff with retry-after**:
```typescript
async function requestWithRetry(url, options) {
  const response = await fetch(url, options);

  if (response.status === 503) {
    const retryAfter = response.headers.get('Retry-After');
    const delay = retryAfter
      ? parseInt(retryAfter) * 1000
      : 5000; // Default 5 seconds

    await new Promise(resolve => setTimeout(resolve, delay));
    return await fetch(url, options); // Retry
  }

  return response;
}
```

---

## Error Response Structure

All errors follow this format:

```typescript
type ErrorResponse = {
  error: {
    code: number;                    // HTTP status code
    message: string;                 // Human-readable error message
    metadata?: {
      // Additional error-specific information
      provider?: string;
      model?: string;
      native_error?: string;
      limit?: number;
      remaining?: number;
      reset?: string;
      required?: number;
      available?: number;
      restriction?: string;
      retry_after?: number;
    };
  };
};
```

**Fields**:
- `code`: HTTP status code (400, 401, 402, 403, 408, 429, 502, 503)
- `message`: Description of error
- `metadata`: Additional context (varies by error type)

---

## Error Metadata Types

### Provider Metadata
```json
{
  "metadata": {
    "provider": "openai",
    "native_error": "timeout"
  }
}
```
**When**: Provider-specific errors (502, 503)

### Rate Limit Metadata
```json
{
  "metadata": {
    "limit": 60,
    "remaining": 0,
    "reset": "2026-01-30T12:00:00Z"
  }
}
```
**When**: Rate limited (429)

### Credit Metadata
```json
{
  "metadata": {
    "required": 0.00015,
    "available": 0.00000,
    "currency": "USD"
  }
}
```
**When**: Insufficient credits (402)

### Restriction Metadata
```json
{
  "metadata": {
    "model": "anthropic/claude-opus-4",
    "restriction": "guardrails"
  }
}
```
**When**: Access denied (403)

---

## Native Finish Reasons

Normalized finish reasons returned by OpenRouter:

| Finish Reason | Description | When Occurs |
|---------------|-------------|--------------|
| `stop` | Model naturally stopped | End of generation |
| `length` | Max tokens reached | Response truncated |
| `tool_calls` | Model wants to call tools | Tool calling response |
| `content_filter` | Content filtered | Safety/policy violation |
| `error` | Error occurred | Generation failed |

**Native finish reason**:
```json
{
  "choices": [{
    "finish_reason": "stop",           // Normalized
    "native_finish_reason": "stop"      // Provider's original
  }]
}
```

**Common native reasons by provider**:
- OpenAI: `stop`, `length`, `content_filter`, `function_call`
- Anthropic: `end_turn`, `max_tokens`, `stop_sequence`
- Google: `STOP`, `MAX_TOKENS`, `RECITATION`, `SAFETY`
- Mistral: `stop`, `length`, `error`

---

## Streaming Error Handling

### Pre-Stream Errors

Errors that occur before streaming starts:

**Format**: Standard HTTP error response

**Example**:
```json
{
  "error": {
    "code": 400,
    "message": "Invalid request"
  }
}
```

**How to handle**:
1. Parse first chunk as error check
2. If error, abort stream
3. Handle like non-streaming error

```typescript
const response = await fetch(url, { stream: true });

const reader = response.body.getReader();
const firstChunk = await reader.read();
const text = new TextDecoder().decode(firstChunk.value);

if (!text.startsWith('data: ')) {
  const error = JSON.parse(text);
  throw new Error(error.error.message);
}

// Process stream normally...
```

---

### Mid-Stream Errors

Errors that occur during streaming:

**Format**: SSE event with error field

**Example**:
```
data: {"id":"gen-abc","object":"chat.completion.chunk","error":{"code":502,"message":"Provider disconnected"},"choices":[{"index":0,"delta":{"content":""},"finish_reason":"error"}]}
```

**How to handle**:
1. Check for `error` field in each chunk
2. If error present, handle gracefully
3. Partial content may still be usable
4. Decide whether to continue or abort

```typescript
for await (const chunk of stream) {
  const parsed = JSON.parse(chunk);

  if (parsed.error) {
    console.error('Stream error:', parsed.error);
    // Decide: continue, retry, or abort
    if (parsed.error.code >= 500) {
      // Server error - can retry
      break;
    }
  }

  // Process content...
  const content = parsed.choices?.[0]?.delta?.content;
}
```

---

## Retry Strategy

### Retryable Status Codes

**Should retry**:
- `408` - Request Timeout
- `429` - Rate Limited
- `502` - Bad Gateway
- `503` - Service Unavailable

**Should NOT retry**:
- `400` - Bad Request (fix request)
- `401` - Unauthorized (fix auth)
- `403` - Forbidden (fix permissions)
- `402` - Payment Required (add credits)

---

### Exponential Backoff Implementation

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry client errors (except 408)
      if (response.status >= 400 && response.status < 500 &&
          response.status !== 408) {
        return response;
      }

      // Retry on rate limit or server errors
      if (response.status === 429 || response.status >= 500) {
        if (attempt === maxRetries - 1) {
          return response; // Final attempt, don't retry
        }

        // Exponential backoff with jitter
        const baseDelay = 1000;
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt),
          10000  // Max 10 seconds
        );
        const jitter = Math.random() * 1000;

        await new Promise(resolve =>
          setTimeout(resolve, delay + jitter)
        );
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      // Network error - retry with backoff
      const delay = Math.min(
        1000 * Math.pow(2, attempt),
        10000
      );
      await new Promise(resolve =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw new Error('Max retries exceeded');
}
```

---

## Graceful Degradation

### When Errors Occur

**Options**:
1. **Use cached responses** - if available
2. **Fall back to simpler model** - cheaper, more available
3. **Disable advanced features** - tools, web search, streaming
4. **Provide degraded experience** - partial functionality
5. **Show user-friendly error** - explain the situation

### Example Degradation Strategy

```typescript
async function requestWithDegradation(messages) {
  const strategies = [
    // Primary: Full-featured model
    async () => await fetchWithRetry({
      model: 'anthropic/claude-3.5-sonnet',
      messages,
      stream: true,
      tools: [...]
    }),

    // Fallback 1: Cheaper model, no streaming
    async () => await fetchWithRetry({
      model: 'google/gemini-2.0-flash',
      messages,
      stream: false
    }),

    // Fallback 2: Free model
    async () => await fetchWithRetry({
      model: 'google/gemini-2.0-flash:free',
      messages
    }),

    // Fallback 3: Cached response
    async () => getCachedResponse(messages)
  ];

  for (const strategy of strategies) {
    try {
      return await strategy();
    } catch (error) {
      console.warn('Strategy failed:', error.message);
      continue;
    }
  }

  throw new Error('All strategies failed');
}
```

---

## Error Handling Best Practices

### Do's

✅ **Always validate requests** before sending
✅ **Implement exponential backoff** for retryable errors
✅ **Use model fallbacks** for reliability
✅ **Log errors with context** (model, parameters, metadata)
✅ **Implement graceful degradation**
✅ **Check error metadata** for additional context
✅ **Monitor error rates** and adjust strategies
✅ **Set timeouts** to prevent hanging

### Don'ts

❌ **Retry on client errors** (400, 401, 402, 403)
❌ **Ignore error metadata** - contains valuable info
❌ **Retry without backoff** - can overload systems
❌ **Retry indefinitely** - set max retries
❌ **Expose raw errors** to users - sanitize and explain
❌ **Cache error responses** - only cache successes
❌ **Use fixed delays** - use exponential backoff with jitter

---

## Error Handling Checklist

### Before Request
- [ ] Validate API key format
- [ ] Validate request structure
- [ ] Check parameter types and ranges
- [ ] Verify model ID is valid
- [ ] Set reasonable timeouts

### After Error
- [ ] Identify error code
- [ ] Check error metadata
- [ ] Determine if retryable
- [ ] Implement appropriate backoff
- [ ] Log with full context
- [ ] Inform user appropriately

### Prevention
- [ ] Use model fallbacks
- [ ] Implement request throttling
- [ ] Monitor credit balance
- [ ] Check model capabilities
- [ ] Use appropriate parameters
- [ ] Test with :free models first

---

## Quick Reference

| Status Code | Name | Retry? | Backoff? | Action |
|-------------|------|--------|----------|--------|
| 400 | Bad Request | No | No | Fix request |
| 401 | Unauthorized | No | No | Check API key |
| 402 | Payment Required | Yes | No | Add credits |
| 403 | Forbidden | No | No | Check permissions |
| 408 | Timeout | Yes | Yes | Simplify/retry |
| 429 | Rate Limited | Yes | Yes | Backoff |
| 502 | Bad Gateway | Yes | Yes | Retry with fallback |
| 503 | Service Unavailable | Yes | Yes | Backoff |

---

**Sources**:
- https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx
- https://openrouter.ai/openapi.json
