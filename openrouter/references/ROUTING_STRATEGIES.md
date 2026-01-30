# Routing Strategies

Complete guide to configuring intelligent routing with OpenRouter for model fallbacks, provider selection, and automatic optimization.

**Source**: https://openrouter.ai/docs/guides/routing/model-fallbacks.mdx

---

## Overview

OpenRouter provides powerful routing capabilities to optimize for:
- **Reliability**: Automatic failover
- **Cost**: Optimize for lowest price
- **Latency**: Optimize for fastest response
- **Throughput**: Optimize for highest capacity

---

## Model Fallbacks

### What are Model Fallbacks?

Automatic failover between multiple models. If the primary model fails (5xx, 429, timeout), OpenRouter automatically tries the next model in the list.

### Basic Configuration

```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',  // Primary
    'openai/gpt-4o',                // Fallback 1
    'google/gemini-2.0-flash'        // Fallback 2
  ],
  messages: [{ role: 'user', content: '...' }]
}
```

### How It Works

1. **Try primary model** (`anthropic/claude-3.5-sonnet`)
2. **If error** (5xx, 429, timeout): Try next model
3. **Continue** until one succeeds or all fail
4. **Return response** from successful model
5. **Include** actual model used in `model` field

### When to Use Model Fallbacks

✅ **Use when**:
- High reliability required
- User-facing applications
- Critical business functions
- Multiple providers acceptable
- Want graceful degradation

❌ **Don't use when**:
- Need specific model for compliance
- Model behavior must be consistent
- Testing/model comparison
- Cost must be predictable

### Best Practices

**Order by preference**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',  // Most preferred
    'openai/gpt-4o',                // Second choice
    'google/gemini-2.0-flash'        // Last resort
  ]
}
```

**Use different providers**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',  // Anthropic
    'openai/gpt-4o',                // OpenAI
    'google/gemini-2.0-flash'        // Google
  ]
}
```

**Include cost options**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',  // Quality
    'google/gemini-2.0-flash',        // Speed
    'meta-llama/llama-3.1-70b:free'   // Free
  ]
}
```

### Advanced Patterns

**Quality -> Speed -> Free**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',     // Best quality
    'google/gemini-2.0-flash:nitro',  // Fastest
    'meta-llama/llama-3.1-70b:free'    // Free
  ]
}
```

**By cost tier**:
```typescript
{
  models: [
    'google/gemini-2.0-flash',           // Low cost
    'anthropic/claude-3.5-sonnet',       // Medium
    'anthropic/claude-opus-4'            // High quality
  ]
}
```

**For tools** (ensure all support tools):
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.5-pro'
  ],
  tools: [...]
}
```

### Response Handling

**Check actual model used**:
```typescript
const response = await fetch(/* ... */);
const data = await response.json();

console.log('Requested:', claude-3.5-sonnet');
console.log('Actual:', data.model);  // May be different!
```

**Handle partial fallbacks**:
- If fallback used, may have different behavior
- Response quality may vary
- Test with all fallback models

---

## Provider Selection

### What is Provider Selection?

Control which providers serve your requests. Set preferences for cost, latency, or throughput, and specify which providers to use or avoid.

### Basic Configuration

```typescript
{
  provider: {
    order: ['anthropic', 'openai', 'google'],
    allow_fallbacks: true,
    sort: 'price'
  },
  messages: [{ role: 'user', content: '...' }]
}
```

### Provider Preferences Properties

#### order (`string[]`)

Preferred provider order.

**Example**:
```typescript
{
  provider: {
    order: ['anthropic', 'openai', 'google']
  }
}
```

**When to use**:
- Have preferred providers
- Need specific provider features
- Provider agreements/contracts

---

#### allow_fallbacks (`boolean`)

Enable automatic provider fallbacks.

**Default**: `true`

**Example**:
```typescript
{
  provider: {
    order: ['anthropic', 'openai'],
    allow_fallbacks: true  // Allow falling back from Anthropic to OpenAI
  }
}
```

**When to use**:
- Always: `true` (default)
- Only: `false` when you strictly need first provider

---

#### require_parameters (`boolean`)

Only use providers that support all request parameters.

**Default**: `false`

**Example**:
```typescript
{
  provider: {
    require_parameters: true  // Only use providers supporting tools, streaming, etc.
  },
  tools: [...],
  stream: true
}
```

**When to use**:
- Using advanced features (tools, structured outputs)
- Need consistent behavior across providers
- Want to avoid parameter being ignored

---

#### data_collection (`'allow' | 'deny'`)

Control whether providers can retain data.

**Default**: `'allow'`

**Example**:
```typescript
{
  provider: {
    data_collection: 'deny'  // Zero Data Retention
  }
}
```

**When to use**:
- Privacy requirements
- Compliance (GDPR, HIPAA)
- Zero Data Retention (ZDR) policies

---

#### only (`string[]`)

Whitelist specific providers.

**Example**:
```typescript
{
  provider: {
    only: ['anthropic', 'openai']  // Only use these providers
  }
}
```

**When to use**:
- Want to restrict to specific providers
- Regional requirements
- Provider agreements

---

#### ignore (`string[]`)

Blacklist specific providers.

**Example**:
```typescript
{
  provider: {
    ignore: ['openai']  // Never use OpenAI
  }
}
```

**When to use**:
- Have issues with specific provider
- Exclude for cost/latency reasons
- Regional/compliance restrictions

---

#### quantizations (`string[]`)

Filter by model quantization level.

**Options**: `'int4' | 'int8' | 'fp4' | 'fp6' | 'fp8' | 'fp16' | 'bf16' | 'fp32'`

**Example**:
```typescript
{
  provider: {
    quantizations: ['fp16', 'bf16']  // Only 16-bit precision
  }
}
```

**When to use**:
- Quality requirements (higher precision = better quality)
- Speed requirements (lower precision = faster)
- Cost requirements (lower precision = cheaper)

**Tradeoffs**:
- `fp32`: Best quality, slowest, most expensive
- `fp16`/`bf16`: Balanced
- `fp8`/`int8`: Faster, cheaper, slight quality loss
- `int4`/`fp4`: Fastest, cheapest, more quality loss

---

#### sort (`'price' | 'latency' | 'throughput'`)

Sort providers by metric.

**Example**:
```typescript
{
  provider: {
    sort: 'price'  // Use cheapest provider
  }
}
```

**Options**:

**'price'**: Lowest cost per token
- **Best for**: Cost optimization
- **Tradeoff**: May be slower

**'latency'**: Fastest first token time
- **Best for**: Real-time applications, chat
- **Tradeoff**: May be more expensive

**'throughput'**: Highest tokens/second
- **Best for**: Batch processing, long documents
- **Tradeoff**: May be more expensive

---

#### max_price (`object`)

Maximum pricing thresholds.

**Properties**:
- `prompt`: Price per 1M prompt tokens
- `completion`: Price per 1M completion tokens
- `request`: Fixed price per request

**Example**:
```typescript
{
  provider: {
    max_price: {
      prompt: 10,      // Max $10 per 1M prompt tokens
      completion: 30   // Max $30 per 1M completion tokens
    }
  }
}
```

**When to use**:
- Budget constraints
- Cost predictability
- Avoid expensive providers

---

#### preferred_min_throughput (`number`)

Minimum tokens/second threshold.

**Can be percentile object**: `{ p50, p75, p90, p99 }`

**Example**:
```typescript
{
  provider: {
    preferred_min_throughput: {
      p50: 50,  // At least 50 tokens/s median
      p95: 30   // At least 30 tokens/s 95th percentile
    }
  }
}
```

**When to use**:
- Need consistent speed
- Batch processing
- Long document processing

---

#### preferred_max_latency (`number`)

Maximum latency threshold in seconds.

**Can be percentile object**: `{ p50, p75, p90, p99 }`

**Example**:
```typescript
{
  provider: {
    preferred_max_latency: {
      p50: 2.0,   // Median latency under 2 seconds
      p95: 5.0   // 95th percentile under 5 seconds
    }
  }
}
```

**When to use**:
- Real-time applications
- Chat interfaces
- User-facing where latency matters

---

## Complete Provider Configuration Example

```typescript
{
  model: 'anthropic/claude-3.5-sonnet',
  provider: {
    order: ['anthropic', 'openai', 'google'],
    allow_fallbacks: true,
    require_parameters: false,
    data_collection: 'deny',
    only: null,
    ignore: ['provider_to_exclude'],
    quantizations: ['fp16', 'bf16'],
    sort: 'price',
    max_price: {
      prompt: 10,
      completion: 30
    },
    preferred_min_throughput: {
      p50: 50
    },
    preferred_max_latency: {
      p95: 5.0
    }
  },
  messages: [...]
}
```

---

## Routing Strategies by Use Case

### Cost Optimization

**Goal**: Minimize total cost

**Configuration**:
```typescript
{
  provider: {
    sort: 'price',
    allow_fallbacks: true
  },
  models: [
    'google/gemini-2.0-flash',
    'meta-llama/llama-3.1-70b:free',
    'anthropic/claude-3.5-sonnet'
  ]
}
```

**Additional tips**:
- Use `:free` variants when possible
- Set `max_price` thresholds
- Prefer quantized models (int8, fp8)

---

### Latency Optimization

**Goal**: Minimize response time for real-time apps

**Configuration**:
```typescript
{
  provider: {
    sort: 'latency',
    preferred_max_latency: {
      p50: 1.5,
      p95: 3.0
    }
  },
  models: [
    'google/gemini-2.0-flash:nitro',
    'openai/gpt-4o-mini:nitro',
    'anthropic/claude-3.5-sonnet:nitro'
  ]
}
```

**Additional tips**:
- Use `:nitro` variants
- Prefer fast models (Flash, Mini)
- Use streaming for perceived speed

---

### Throughput Optimization

**Goal**: Maximize tokens/second for batch processing

**Configuration**:
```typescript
{
  provider: {
    sort: 'throughput',
    preferred_min_throughput: {
      p50: 100
    }
  },
  models: [
    'anthropic/claude-3.5-sonnet',
    'google/gemini-2.5-pro'
  ]
}
```

**Additional tips**:
- Use larger models (better throughput)
- Parallelize requests
- Use non-streaming for efficiency

---

### Quality Optimization

**Goal**: Maximize response quality

**Configuration**:
```typescript
{
  models: [
    'anthropic/claude-opus-4',
    'openai/o1',
    'anthropic/claude-3.5-sonnet'
  ],
  provider: {
    require_parameters: true,  // Ensure all features work
    allow_fallbacks: true
  }
}
```

**Additional tips**:
- Use best models (Opus, O1)
- Use `:thinking` variants for complex reasoning
- Enable all advanced features (tools, structured outputs)

---

### Reliability Optimization

**Goal**: Maximize availability and success rate

**Configuration**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.5-pro',
    'meta-llama/llama-3.1-70b'
  ],
  provider: {
    allow_fallbacks: true
  }
}
```

**Additional tips**:
- Use 3-5 models in fallback list
- Include models from different providers
- Test with all fallback models
- Implement retry logic with exponential backoff

---

### Privacy Optimization

**Goal**: Zero Data Retention (ZDR)

**Configuration**:
```typescript
{
  provider: {
    data_collection: 'deny',  // ZDR enabled
    ignore: ['providers_that_retain_data']
  },
  user: 'user-123',  // For abuse detection
  metadata: {
    privacy: 'zdr-enabled'
  }
}
```

**Additional tips**:
- Check provider privacy policies
- Use BYOK for full control
- Review data retention settings in dashboard

---

## Auto Router

### What is Auto Router?

Automatic model selection based on request complexity, cost, and availability.

### Basic Configuration

```typescript
{
  model: 'openrouter.ai/auto',
  messages: [{ role: 'user', content: '...' }]
}
```

**Behavior**:
- Automatically selects best model
- Considers cost and quality
- No model selection needed

### With Allowed Models

```typescript
{
  model: 'openrouter.ai/auto',
  plugins: [{
    id: 'auto-router',
    allowed_models: ['openai/*', 'anthropic/*']
  }],
  messages: [{ role: 'user', content: '...' }]
}
```

**Allowed patterns**:
- `'*'` - All models
- `'openai/*'` - All OpenAI models
- `'anthropic/claude-*'` - All Claude models
- Specific models: `'openai/gpt-4o', 'anthropic/claude-3.5-sonnet'`

### When to Use Auto Router

✅ **Use when**:
- Want automatic optimization
- Don't want to manage model selection
- Acceptable for variable model behavior
- Quick prototyping

❌ **Don't use when**:
- Need consistent model behavior
- Specific model requirements
- Compliance/regulatory needs
- Testing/comparison

---

## Combining Routing Strategies

### Model Fallbacks + Provider Selection

```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.0-flash'
  ],
  provider: {
    sort: 'price',
    allow_fallbacks: true
  }
}
```

**Behavior**:
- Try each model in order
- For each model, select cheapest provider
- Fall back to next model on error

### Provider Selection + Cost Thresholds

```typescript
{
  provider: {
    order: ['anthropic', 'openai', 'google'],
    sort: 'price',
    max_price: {
      prompt: 10,
      completion: 30
    }
  },
  model: 'anthropic/claude-3.5-sonnet'
}
```

**Behavior**:
- Prefer Anthropic, then OpenAI, then Google
- Within each provider, select cheapest
- Reject providers exceeding max_price

### Model Fallbacks + Data Collection

```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o'
  ],
  provider: {
    data_collection: 'deny',  // ZDR
    allow_fallbacks: true
  }
}
```

**Behavior**:
- Only use providers with ZDR enabled
- Fall back between models
- Maintain privacy across fallbacks

---

## Monitoring and Observability

### Track Routing Decisions

```typescript
const response = await fetch(/* ... */);
const data = await response.json();

// Log routing info
console.log({
  model: data.model,
  provider: data.provider,
  usage: data.usage,
  cost: data.usage?.cost
});
```

### Monitor Fallback Rates

```typescript
let primarySuccess = 0;
let fallbackUsed = 0;

function trackFallback(data) {
  if (data.model === 'anthropic/claude-3.5-sonnet') {
    primarySuccess++;
  } else {
    fallbackUsed++;
  }

  console.log({
    primaryRate: primarySuccess / (primarySuccess + fallbackUsed),
    fallbackRate: fallbackUsed / (primarySuccess + fallbackUsed)
  });
}
```

### Monitor Provider Performance

```typescript
const providerStats = {};

function trackProvider(data) {
  const provider = data.provider;
  if (!providerStats[provider]) {
    providerStats[provider] = { count: 0, totalLatency: 0, errors: 0 };
  }

  providerStats[provider].count++;
  providerStats[provider].totalLatency += data.latency;

  console.log('Provider stats:', providerStats);
}
```

---

## Best Practices

### Always Allow Fallbacks

```typescript
{
  provider: {
    allow_fallbacks: true  // Always true unless you have specific reason
  }
}
```

### Use Model Fallbacks for Critical Applications

```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.5-pro'
  ]
}
```

### Set Appropriate Price Limits

```typescript
{
  provider: {
    max_price: {
      prompt: 10,      // Set based on budget
      completion: 30
    }
  }
}
```

### Match Sorting to Use Case

- **Real-time chat**: `sort: 'latency'`
- **Batch processing**: `sort: 'throughput'`
- **Cost-sensitive**: `sort: 'price'`
- **General purpose**: No sorting (automatic)

### Use Data Collection: deny for Privacy

```typescript
{
  provider: {
    data_collection: 'deny'  // ZDR by default
  }
}
```

### Test Routing Configuration

**Before production**:
- Test with all models in fallback list
- Verify provider selection works
- Check cost estimates
- Monitor actual usage

---

## Quick Reference

### Routing Configuration

| Strategy | Configuration | Use Case |
|----------|---------------|-----------|
| Model fallbacks | `models: [...]` | Reliability |
| Provider order | `provider.order: [...]` | Preferred providers |
| Cost optimization | `provider.sort: 'price'` | Cost-sensitive |
| Latency optimization | `provider.sort: 'latency'` | Real-time apps |
| Throughput optimization | `provider.sort: 'throughput'` | Batch processing |
| ZDR | `provider.data_collection: 'deny'` | Privacy |
| Auto router | `model: 'openrouter.ai/auto'` | Automatic selection |

### Common Patterns

```typescript
// Cost-optimized with fallbacks
{
  models: ['gemini-2.0-flash', 'llama-3.1-70b:free'],
  provider: { sort: 'price' }
}

// Fast with reliability
{
  models: ['gpt-4o-mini:nitro', 'gemini-2.0-flash:nitro'],
  provider: { sort: 'latency', allow_fallbacks: true }
}

// Privacy-focused
{
  models: ['claude-3.5-sonnet', 'gpt-4o'],
  provider: { data_collection: 'deny', allow_fallbacks: true }
}
```

---

**Sources**:
- https://openrouter.ai/docs/guides/routing/model-fallbacks.mdx
- https://openrouter.ai/docs/guides/routing/provider-selection.mdx
- https://openrouter.ai/docs/guides/routing/routers/auto-router.mdx
