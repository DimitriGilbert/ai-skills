# Model Selection Guide

Comprehensive guide for selecting appropriate OpenRouter models, variants, and providers for different use cases.

**Source**: https://openrouter.ai/models

---

## Model Identifier Format

**Format**: `provider/model-name[:variant]`

**Examples**:
- `anthropic/claude-3.5-sonnet` - Specific model
- `openai/gpt-4o:online` - Model with web search variant
- `google/gemini-2.0-flash:free` - Model with free tier variant
- `meta-llama/llama-3.1-70b:thinking` - Model with thinking variant

**Parts**:
- **Provider**: Organization or platform (anthropic, openai, google, etc.)
- **Model Name**: Specific model (claude-3.5-sonnet, gpt-4o, gemini-2.0-flash)
- **Variant** (optional): Modifier for behavior (:free, :online, :extended, :thinking, :nitro, :exacto)

---

## Model Families

### OpenAI Models

**GPT-4o** (`openai/gpt-4o`)
- **Strengths**: Balanced, strong reasoning, multimodal (vision, audio)
- **Best for**: General purpose, coding, analysis
- **Context**: 128K
- **Cost**: High tier

**GPT-4o-mini** (`openai/gpt-4o-mini`)
- **Strengths**: Fast, cost-effective, good quality
- **Best for**: High-volume, real-time, cost-sensitive
- **Context**: 128K
- **Cost**: Low tier

**GPT-4.1** (`openai/gpt-4.1`)
- **Strengths**: Excellent reasoning, analysis
- **Best for**: Complex reasoning, research
- **Context**: 128K
- **Cost**: Very high tier

**O1 / O3** (`openai/o1`, `openai/o3`)
- **Strengths**: Deep reasoning, chain-of-thought
- **Best for**: Math, logic puzzles, complex problems
- **Context**: 200K (extended)
- **Cost**: Premium tier
- **Note**: Reasoning models, slower but smarter

---

### Anthropic Models

**Claude 3.5 Sonnet** (`anthropic/claude-3.5-sonnet`)
- **Strengths**: Excellent balance, strong coding, creative writing
- **Best for**: Most tasks, coding, writing
- **Context**: 200K
- **Cost**: Medium tier
- **Recommendation**: Default model for most use cases

**Claude Opus 4** (`anthropic/claude-opus-4`)
- **Strengths**: Best reasoning, analysis, nuanced understanding
- **Best for**: Complex reasoning, research, detailed analysis
- **Context**: 200K
- **Cost**: High tier

**Claude Haiku 4** (`anthropic/claude-haiku-4`)
- **Strengths**: Fast, cost-effective, good quality
- **Best for**: High-volume, simple tasks, cost-sensitive
- **Context**: 200K
- **Cost**: Low tier

---

### Google Models

**Gemini 2.5 Pro** (`google/gemini-2.5-pro`)
- **Strengths**: Strong reasoning, multimodal, competitive with GPT-4/Claude
- **Best for**: General purpose, multimodal, cost-effective alternative
- **Context**: 1M-2M
- **Cost**: Medium tier

**Gemini 2.0 Flash** (`google/gemini-2.0-flash`)
- **Strengths**: Very fast, good quality, multimodal
- **Best for**: Speed-critical, high-volume, real-time
- **Context**: 1M
- **Cost**: Low tier
- **Recommendation**: Best for speed-sensitive applications

---

### xAI Models

**Grok-2** (`xai/grok-2`)
- **Strengths**: Strong reasoning, Twitter knowledge
- **Best for**: Current events, reasoning
- **Context**: 128K
- **Cost**: Medium tier

---

### Cohere Models

**Command R+** (`cohere/command-r-plus`)
- **Strengths**: Good reasoning, retrieval-augmented
- **Best for**: RAG applications, enterprise
- **Context**: 128K
- **Cost**: Medium tier

**Command R** (`cohere/command-r`)
- **Strengths**: Fast, efficient, good quality
- **Best for**: High-volume, production
- **Context**: 128K
- **Cost**: Low tier

---

### Meta Models (Llama)

**Llama 3.1 70B** (`meta-llama/llama-3.1-70b`)
- **Strengths**: Open-source, good quality, cost-effective
- **Best for**: Cost-sensitive, privacy, deployment
- **Context**: 128K
- **Cost**: Low tier

**Llama 3.1 405B** (`meta-llama/llama-3.1-405b`)
- **Strengths**: Large, strong reasoning
- **Best for**: Research, complex tasks
- **Context**: 128K
- **Cost**: Medium tier

---

### Mistral Models

**Mistral Large 2** (`mistral/mistral-large`)
- **Strengths**: Good reasoning, efficient
- **Best for**: General purpose, European languages
- **Context**: 128K
- **Cost**: Medium tier

**Mistral Nemo** (`mistral/mistral-nemo`)
- **Strengths**: Fast, cost-effective
- **Best for**: High-volume, speed-critical
- **Context**: 128K
- **Cost**: Low tier

---

### Qwen Models

**Qwen 2.5 72B** (`qwen/qwen-2.5-72b`)
- **Strengths**: Strong coding, good reasoning
- **Best for**: Coding, technical tasks
- **Context**: 128K
- **Cost**: Low tier

**Qwen 2.5 Coder** (`qwen/qwen-2.5-coder-32b`)
- **Strengths**: Specialized for coding
- **Best for**: Code generation, debugging
- **Context**: 32K
- **Cost**: Very low tier

---

### DeepSeek Models

**DeepSeek V3** (`deepseek/deepseek-chat`)
- **Strengths**: Strong reasoning, cost-effective
- **Best for**: Cost-sensitive general purpose
- **Context**: 128K
- **Cost**: Low tier

---

## Model Variants

### :free - Free Tier

**Description**: Free access to models with rate limits

**When to use**:
- Testing and prototyping
- Low-complexity tasks
- High-volume, low-value operations
- Development/evaluation

**Limits**:
- 200 requests/minute (base)
- 200 requests/day (no credits)
- 2000 requests/day (with $5+ in credits)

**Examples**:
- `google/gemini-2.0-flash:free`
- `openai/gpt-4o-mini:free`
- `meta-llama/llama-3.1-70b:free`

**Tradeoffs**:
- Pros: No cost, good for testing
- Cons: Rate limits, often older or smaller models

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/free.mdx

---

### :online - Web Search Enabled

**Description**: Model with built-in web search capabilities

**When to use**:
- Need current information
- Questions about recent events
- Factual verification needed
- Real-time data required
- User explicitly asks for current info

**Examples**:
- `anthropic/claude-3.5-sonnet:online`
- `openai/gpt-4o:online`
- `google/gemini-2.5-pro:online`

**Cost**: Additional cost for web search queries

**Tradeoffs**:
- Pros: Real-time information, factual accuracy
- Cons: Higher cost, additional latency

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/online.mdx

---

### :extended - Extended Context

**Description**: Model with larger context window

**When to use**:
- Processing large documents
- Codebase understanding
- Long conversations
- Multi-document analysis
- Need to maintain large context

**Examples**:
- `anthropic/claude-3.5-sonnet:extended` (200K+)
- `google/gemini-2.5-pro:extended` (1M-2M)
- `openai/o1:extended` (200K)

**Tradeoffs**:
- Pros: Handle much larger inputs
- Cons: May be slower, higher cost

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/extended.mdx

---

### :thinking - Enhanced Reasoning

**Description**: Model with explicit chain-of-thought reasoning

**When to use**:
- Complex multi-step reasoning
- Mathematical problems
- Logic puzzles
- Decision trees
- Need transparent reasoning

**Examples**:
- `anthropic/claude-opus-4:thinking`
- `openai/o3:thinking`
- `deepseek/deepseek-r1:thinking`

**Cost**: Higher token usage (reasoning + response)

**Tradeoffs**:
- Pros: Better reasoning, transparent thought process
- Cons: Slower, higher cost, more tokens

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/thinking.mdx

---

### :nitro - High Speed

**Description**: Optimized for low latency

**When to use**:
- Speed is critical
- Real-time applications
- Chat interfaces
- User-facing where every millisecond matters
- High-frequency interactions

**Examples**:
- `openai/gpt-4o:nitro`
- `google/gemini-2.0-flash:nitro`
- `anthropic/claude-3.5-sonnet:nitro`

**Tradeoffs**:
- Pros: Minimal latency, faster responses
- Cons: May have quality tradeoffs, higher cost

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/nitro.mdx

---

### :exacto - Specific Provider

**Description**: Force specific provider

**When to use**:
- Need specific provider features
- Provider agreement/contract
- Regional compliance
- Provider-specific requirements

**Examples**:
- `openai/gpt-4o:exacto` (OpenAI only)
- `anthropic/claude-3.5-sonnet:exacto` (Anthropic only)

**Tradeoffs**:
- Pros: Guaranteed provider
- Cons: No fallbacks, potential availability issues

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/exacto.mdx

---

## Model Selection by Use Case

### General Purpose Chat

**Recommended**: `anthropic/claude-3.5-sonnet` or `openai/gpt-4o`

**Why**:
- Balanced quality, speed, cost
- Strong at most conversational tasks
- Wide feature support (tools, streaming, multimodal)

**Alternatives**:
- Cost-sensitive: `google/gemini-2.0-flash` or `openai/gpt-4o-mini`
- Speed-critical: `google/gemini-2.0-flash:nitro`
- Need web search: `:online` variant

---

### Coding

**Recommended**: `anthropic/claude-3.5-sonnet` or `openai/gpt-4o`

**Why**:
- Strong code generation and understanding
- Good at debugging and explaining
- Supports tools (code execution)

**Alternatives**:
- Cost-effective: `qwen/qwen-2.5-coder-32b`
- Very high quality: `openai/o1` or `anthropic/claude-opus-4`

---

### Complex Reasoning

**Recommended**: `anthropic/claude-opus-4` or `openai/o1`

**Why**:
- Deep reasoning capabilities
- Chain-of-thought approach
- Handles multi-step problems

**Alternatives**:
- Faster reasoning: `anthropic/claude-opus-4:thinking`
- Cost-sensitive: `openai/gpt-4.1`

---

### Creative Writing

**Recommended**: `anthropic/claude-3.5-sonnet` with `temperature: 0.8-1.2`

**Why**:
- Strong creative capabilities
- Nuanced language
- Good at style imitation

**Alternatives**:
- More creative: `openai/gpt-4o` with higher temperature
- Cost-sensitive: `meta-llama/llama-3.1-70b` with high temperature

---

### Factual/Informational

**Recommended**: `anthropic/claude-3.5-sonnet:online` or `google/gemini-2.5-pro:online`

**Why**:
- Web search for current information
- High factual accuracy
- Citations available

**Alternatives**:
- Cost-sensitive: `google/gemini-2.0-flash:online`
- Need verification: Use `:online` variant

---

### Summarization

**Recommended**: `anthropic/claude-3.5-sonnet` with `temperature: 0.2-0.4`

**Why**:
- Concise, accurate summaries
- Handles long documents with `:extended`
- Good extraction of key points

**Alternatives**:
- Long documents: `anthropic/claude-3.5-sonnet:extended`
- Cost-effective: `google/gemini-2.0-flash`

---

### Translation

**Recommended**: `google/gemini-2.5-pro` or `openai/gpt-4o`

**Why**:
- Strong multilingual capabilities
- Nuanced translations
- Context-aware

**Alternatives**:
- Cost-effective: `meta-llama/llama-3.1-70b`
- Specialized: `mistral/mistral-large` (European languages)

---

### Sentiment Analysis

**Recommended**: `anthropic/claude-3.5-sonnet` with structured outputs

**Why**:
- Consistent, accurate
- Can output structured JSON with sentiment labels
- Handles nuances

**Implementation**:
```typescript
{
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Analyze sentiment...' }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'sentiment',
      strict: true,
      schema: {
        type: 'object',
        properties: {
          sentiment: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
          confidence: { type: 'number' }
        }
      }
    }
  }
}
```

---

### RAG Applications

**Recommended**: `cohere/command-r-plus` or `anthropic/claude-3.5-sonnet`

**Why**:
- Strong at incorporating context
- Good at synthesis
- Cohere designed for RAG

**Parameters**:
```typescript
{
  model: 'anthropic/claude-3.5-sonnet',
  messages: [
    {
      role: 'system',
      content: 'Use the provided context to answer questions...'
    },
    {
      role: 'user',
      content: `Context:\n${context}\n\nQuestion:\n${query}`
    }
  ],
  temperature: 0.2,  // Lower for factual responses
  max_tokens: 500
}
```

---

### Agentic Systems

**Recommended**: `anthropic/claude-3.5-sonnet` or `openai/gpt-4o` with tools

**Why**:
- Strong tool use capabilities
- Good at decision-making
- Efficient multi-turn interactions

**Setup**:
```typescript
{
  model: 'anthropic/claude-3.5-sonnet',
  messages: [...],
  tools: [/* available tools */],
  tool_choice: 'auto',
  parallel_tool_calls: true
}
```

---

## Model Capability Matrix

### Context Length

| Model | Standard | Extended |
|-------|----------|----------|
| Claude 3.5 Sonnet | 200K | 200K+ |
| Claude Opus 4 | 200K | 200K+ |
| GPT-4o | 128K | 200K |
| GPT-4.1 | 128K | 200K |
| Gemini 2.5 Pro | 1M | 1M-2M |
| Gemini 2.0 Flash | 1M | 1M+ |
| Grok-2 | 128K | 128K+ |
| Llama 3.1 70B | 128K | 128K+ |
| Llama 3.1 405B | 128K | 128K+ |
| Mistral Large 2 | 128K | 128K+ |
| Qwen 2.5 72B | 128K | 128K+ |

---

### Feature Support

| Model | Tools | Streaming | Vision | Audio | Video | Structured Output | Web Search |
|-------|--------|-----------|---------|--------|--------|------------------|------------|
| Claude 3.5 Sonnet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Claude Opus 4 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GPT-4o | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GPT-4.1 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gemini 2.5 Pro | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gemini 2.0 Flash | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Grok-2 | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Llama 3.1 70B | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Mistral Large 2 | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Qwen 2.5 72B | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

**Note**: Check `supported_parameters` field for exact support

---

### Cost Tiers

**Very High**: OpenAI O1/O3, Claude Opus 4
**High**: OpenAI GPT-4.1, Claude Opus 4
**Medium**: Claude 3.5 Sonnet, GPT-4o, Gemini 2.5 Pro
**Low**: GPT-4o-mini, Gemini 2.0 Flash, Mistral Nemo
**Very Low**: Llama 3.1 70B, Qwen 2.5 72B, DeepSeek

**Free tier available**: Add `:free` variant

---

## Provider Selection

### Default Behavior

OpenRouter automatically selects the best available provider for each model based on:
- Cost
- Performance
- Availability

### Explicit Provider Order

**When to use**:
- Have preferred provider
- Need specific provider features
- Regional compliance requirements
- BYOK (Bring Your Own Key) arrangements

**Configuration**:
```typescript
{
  provider: {
    order: ['anthropic', 'openai', 'google'],
    allow_fallbacks: true,
    sort: 'price'  // or 'latency', 'throughput'
  }
}
```

### Provider Sorting Options

**'price'**: Optimize for lowest cost
**'latency'**: Optimize for fastest response
**'throughput'**: Optimize for highest tokens/second

### Provider Characteristics

| Provider | Strengths | Best For |
|----------|-----------|----------|
| OpenAI | Balanced, reliable, tools | General purpose, enterprise |
| Anthropic | Reasoning, coding, writing | Complex tasks, quality |
| Google | Fast, multimodal, long context | Speed, documents |
| xAI | Current events, reasoning | Real-time, news |
| Cohere | RAG, enterprise | Enterprise search |
| Meta | Open-source, cost-effective | Privacy, deployment |
| Mistral | Efficient, European languages | EU compliance, efficiency |

---

## Model Selection Algorithm

```typescript
function selectModel(requirements) {
  const {
    task,           // 'chat', 'coding', 'reasoning', etc.
    priority,       // 'quality', 'speed', 'cost'
    needsCurrentInfo,
    largeContext,
    tools,
    budget
  } = requirements;

  // Priority: Quality
  if (priority === 'quality') {
    if (task === 'reasoning') return 'anthropic/claude-opus-4';
    if (task === 'coding') return 'anthropic/claude-3.5-sonnet';
    return 'openai/gpt-4o';
  }

  // Priority: Speed
  if (priority === 'speed') {
    if (task === 'coding') return 'anthropic/claude-3.5-sonnet:nitro';
    return 'google/gemini-2.0-flash:nitro';
  }

  // Priority: Cost
  if (priority === 'cost') {
    if (budget === 'free') return 'google/gemini-2.0-flash:free';
    return 'google/gemini-2.0-flash';
  }

  // Balanced (default)
  if (needsCurrentInfo) return 'anthropic/claude-3.5-sonnet:online';
  if (largeContext) return 'anthropic/claude-3.5-sonnet:extended';
  if (tools) return 'anthropic/claude-3.5-sonnet';

  return 'anthropic/claude-3.5-sonnet';  // Default
}
```

---

## Best Practices

### Start with Balanced Model

**Default**: `anthropic/claude-3.5-sonnet`

**Why**:
- Strong performance across tasks
- Good cost-quality tradeoff
- Wide feature support

### Adjust Based on Feedback

**Monitor**:
- Response quality
- Latency
- Cost
- Error rates

**Iterate**:
- Upgrade to better model if quality insufficient
- Downgrade for speed if latency too high
- Switch to cheaper model if cost is concern

### Use Model Fallbacks

**Setup**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',  // Primary
    'openai/gpt-4o',                // Fallback 1
    'google/gemini-2.0-flash'        // Fallback 2
  ]
}
```

**Benefits**:
- Automatic failover
- Higher reliability
- Graceful degradation

### Test with Free Models First

**Before production**:
```typescript
// Development/testing
const model = 'google/gemini-2.0-flash:free';

// Production
const model = 'anthropic/claude-3.5-sonnet';
```

### Check Model Capabilities

**Verify**:
```bash
curl https://openrouter.ai/api/v1/models
# Check `supported_parameters` field
```

**Or check**:
```
https://openrouter.ai/models?supported_parameters=tools
```

---

## Quick Reference

### Default Model by Task

| Task | Default | Alternative |
|------|---------|-------------|
| Chat | claude-3.5-sonnet | gpt-4o, gemini-2.5-pro |
| Coding | claude-3.5-sonnet | gpt-4o, qwen-2.5-coder |
| Reasoning | claude-opus-4 | o1, o3 |
| Creative | claude-3.5-sonnet | gpt-4o (higher temp) |
| Speed | gemini-2.0-flash:nitro | gpt-4o-mini:nitro |
| Cost | gemini-2.0-flash | gpt-4o-mini, llama-3.1-70b |

### Variant Selection

| Need | Variant | Example |
|------|---------|---------|
| No cost | :free | gpt-4o-mini:free |
| Current info | :online | claude-3.5-sonnet:online |
| Large context | :extended | claude-3.5-sonnet:extended |
| Deep reasoning | :thinking | claude-opus-4:thinking |
| Speed | :nitro | gpt-4o:nitro |
| Specific provider | :exacto | gpt-4o:exacto |

---

**Sources**:
- https://openrouter.ai/models
- https://openrouter.ai/docs/guides/routing/model-variants/free.mdx
- https://openrouter.ai/docs/guides/routing/model-variants/online.mdx
- https://openrouter.ai/docs/guides/routing/model-variants/extended.mdx
- https://openrouter.ai/docs/guides/routing/model-variants/thinking.mdx
- https://openrouter.ai/docs/guides/routing/model-variants/nitro.mdx
- https://openrouter.ai/docs/guides/routing/model-variants/exacto.mdx
