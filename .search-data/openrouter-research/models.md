# Models

Complete guide to models available on OpenRouter, how to select them, and their capabilities.

**Source**: https://openrouter.ai/docs/guides/overview/models.mdx

## Overview

OpenRouter provides access to **400+ models** from **90+ providers** through a unified API. Models range from state-of-the-art commercial models to open-source alternatives.

**Browse Models**: https://openrouter.ai/models

## Model Identifier Format

Models are identified using the format:

```
provider/model-name[:variant][, :variant]...
```

### Examples

- `openai/gpt-4` - Standard GPT-4
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `google/gemini-2.5-pro` - Gemini 2.5 Pro
- `openai/gpt-4o-mini:free` - Free variant
- `anthropic/claude-3.5-sonnet:online` - Web search enabled

## Major Model Families

### OpenAI Models

- **gpt-4o**: Latest flagship, multimodal
- **gpt-4o-mini**: Smaller, faster, cheaper
- **gpt-4-turbo**: Faster GPT-4 variant
- **gpt-3.5-turbo**: Legacy, cost-effective

**Pricing**: 
- GPT-4o: $5.00/1M prompt, $15.00/1M completion
- GPT-4o-mini: $0.15/1M prompt, $0.60/1M completion

**Context**: Up to 128K tokens

**Features**: Tools, streaming, multimodal, function calling

### Anthropic Claude

- **claude-3.5-sonnet**: Balanced performance/cost
- **claude-3.5-haiku**: Fast, lightweight
- **claude-opus-4**: Highest quality
- **claude-3-opus**: High-end reasoning

**Pricing**:
- Sonnet 3.5: $3.00/1M prompt, $15.00/1M completion
- Haiku 3.5: $1.00/1M prompt, $5.00/1M completion

**Context**: Up to 200K tokens (Sonnet 3.5)

**Features**: Extended context, vision, tools, artifacts

### Google Gemini

- **gemini-2.5-pro**: Latest flagship
- **gemini-2.0-flash**: Fast, multimodal
- **gemini-1.5-pro**: Previous generation

**Pricing**:
- Gemini 2.5 Pro: $1.25/1M prompt, $10.00/1M completion
- Gemini 2.0 Flash: $0.075/1M prompt, $0.30/1M completion

**Context**: Up to 1M tokens (Gemini 2.5 Pro)

**Features**: Multimodal, large context, tools

### xAI Grok

- **grok-2**: Latest Grok model
- **grok-beta**: Experimental versions

**Pricing**: Competitive with GPT-4

**Features**: Real-time web access, tools

### Cohere

- **command-r-plus**: Command R Plus
- **command**: Standard Command model

**Pricing**: Cost-effective alternatives

**Features**: RAG-native, tools

### Open Source Models

OpenRouter hosts many open-source models:

#### Meta Llama

- **meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo**: 405B parameter
- **meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo**: 70B parameter
- **meta-llama/Llama-3.2-3B-Instruct**: 3B parameter

#### Mistral

- **mistralai/mistral-large**: Mistral Large
- **mistralai/mistral-medium**: Mistral Medium
- **mistralai/mistral-small**: Mistral Small

#### Qwen (Alibaba)

- **qwen/qwen-2.5-72b-instruct**: 72B parameter
- **qwen/qwen-2.5-32b-instruct`: 32B parameter

#### DeepSeek

- **deepseek/deepseek-chat**: DeepSeek Chat
- **deepseek/deepseek-coder**: Coding-focused

#### Other Open Source

- Various fine-tuned models for specific tasks
- Roleplay models
- Coding models
- Multilingual models

## Model Capabilities

### Input Modalities

- **Text**: All models support text
- **Image**: Vision models (GPT-4o, Claude 3.5, Gemini)
- **Audio**: Speech models (GPT-4o Audio, Whisper)
- **Video**: Video models (select providers)
- **Files**: PDF/document models

### Output Modalities

- **Text**: Primary output for most models
- **Image**: Image generation models (DALL-E, Midjourney)
- **Audio**: TTS models
- **Embeddings**: Embedding models

### Supported Parameters

Check model capabilities via API:

```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_KEY"
```

**Common Parameters**:
- `temperature`: Most models
- `top_p`: Most models
- `max_tokens`: Most models
- `tools`: Select models
- `streaming`: All models
- `structured_outputs`: Select models

### Specialized Features

**Tools/Function Calling**:
```
https://openrouter.ai/models?supported_parameters=tools
```

**Structured Outputs**:
```
https://openrouter.ai/models?supported_parameters=structured_outputs
```

**Reasoning**:
```
https://openrouter.ai/models?supported_parameters=reasoning
```

**Web Search**:
Use `:online` variant or web plugin

**Zero Data Retention**:
```
https://openrouter.ai/models?enforce_zdr=true
```

## Model Selection

### By Use Case

#### General Purpose
- `openai/gpt-4o`
- `anthropic/claude-3.5-sonnet`
- `google/gemini-2.5-pro`

#### Fast/Cost-Effective
- `openai/gpt-4o-mini`
- `anthropic/claude-3.5-haiku`
- `google/gemini-2.0-flash`

#### High Quality
- `anthropic/claude-opus-4`
- `openai/gpt-4o`
- `google/gemini-2.5-pro`

#### Coding
- `anthropic/claude-3.5-sonnet` (excellent)
- `openai/gpt-4o` (good)
- `deepseek/deepseek-coder`

#### Large Context
- `google/gemini-2.5-pro` (1M tokens)
- `anthropic/claude-3.5-sonnet` (200K tokens)
- `openai/gpt-4o` (128K tokens)

#### Vision/Multimodal
- `openai/gpt-4o`
- `anthropic/claude-3.5-sonnet`
- `google/gemini-2.0-flash`

### By Provider

**OpenAI**: Most popular, great balance
**Anthropic**: Strong reasoning, large context
**Google**: Best multimodal, huge context
**xAI**: Real-time web integration
**Open Source**: Cost-effective, customizable

### By Cost

**Free** (use `:free` suffix):
- Limited daily requests
- Good for testing/development

**Low Cost**:
- `google/gemini-2.0-flash`
- `anthropic/claude-3.5-haiku`
- Open-source models

**Premium**:
- `openai/gpt-4o`
- `anthropic/claude-opus-4`
- `google/gemini-2.5-pro`

## Model Variants

### Free Models

Suffix: `:free`

```json
{ "model": "openai/gpt-4o-mini:free" }
```

**Limitations**:
- 200 requests/minute
- 200-2000 requests/day depending on credits

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/free.mdx

### Extended Context

Suffix: `:extended`

```json
{ "model": "anthropic/claude-3.5-sonnet:extended" }
```

**Purpose**: Larger context windows when available

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/extended.mdx

### Online (Web Search)

Suffix: `:online`

```json
{ "model": "google/gemini-pro:online" }
```

**Purpose**: Built-in web search capabilities

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/online.mdx

### Thinking (Reasoning)

Suffix: `:thinking`

```json
{ "model": "anthropic/claude-opus-4:thinking" }
```

**Purpose**: Enhanced reasoning capabilities

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/thinking.mdx

### Nitro (High Speed)

Suffix: `:nitro`

```json
{ "model": "openai/gpt-4o:nitro" }
```

**Purpose**: Fastest available inference

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/nitro.mdx

### Exacto (Provider-Specific)

Suffix: `:exacto`

```json
{ "model": "openai/gpt-4:exacto" }
```

**Purpose**: Target specific providers

**Source**: https://openrouter.ai/docs/guides/routing/model-variants/exacto.mdx

## Embedding Models

OpenRouter supports vector embeddings for semantic search:

### OpenAI Embeddings

- `openai/text-embedding-3-small`: 1536 dimensions, fast
- `openai/text-embedding-3-large`: 3072 dimensions, higher quality

### Cohere Embeddings

- `cohere/embed-english-v3.0`: English language
- `cohere/embed-multilingual-v3.0`: 100+ languages

### Other Providers

Multiple providers offer embedding models.

**Browse**: https://openrouter.ai/models?output_modalities=embeddings

**API**: GET /api/v1/embeddings/models

**Source**: https://openrouter.ai/docs/api/reference/embeddings.mdx

## Model Metadata

### API Response Structure

```json
{
  "id": "openai/gpt-4o",
  "name": "GPT-4o",
  "description": "Multimodal flagship model",
  "context_length": 128000,
  "architecture": {
    "modality": "text",
    "input_modalities": ["text", "image", "audio"],
    "output_modalities": ["text"]
  },
  "pricing": {
    "prompt": "5.00",
    "completion": "15.00",
    "request": "0.00"
  },
  "top_provider": {
    "context_length": 128000,
    "max_completion_tokens": 4096,
    "is_moderated": true
  },
  "supported_parameters": [
    "temperature",
    "max_tokens",
    "tools",
    "streaming",
    "structured_outputs"
  ]
}
```

### Pricing Structure

All prices in USD per 1 million tokens:

- `prompt`: Input tokens cost
- `completion`: Output tokens cost
- `request`: Fixed per-request cost (if any)
- `image`: Per-image cost
- `web_search`: Web search operation cost
- `internal_reasoning`: Reasoning token cost
- `input_cache_read`: Cached read cost
- `input_cache_write`: Cache write cost

### Context Length

Maximum tokens for input + output:

- **Small**: 4K - 8K tokens (compact models)
- **Medium**: 32K - 128K tokens (standard models)
- **Large**: 200K - 1M tokens (extended context models)

**Note**: Context length varies by provider and model.

### Per-Request Limits

Some models have limits:
- `prompt_tokens`: Max input tokens per request
- `completion_tokens`: Max output tokens per request

## Choosing the Right Model

### Decision Framework

1. **Budget Constraint**:
   - Use free models for testing
   - Use small/fast models for production
   - Use premium models only when needed

2. **Performance Needs**:
   - Simple tasks: Use fast models (GPT-4o-mini, Haiku)
   - Complex reasoning: Use high-end models (GPT-4o, Sonnet 3.5, Opus 4)
   - Speed critical: Use `:nitro` variants

3. **Feature Requirements**:
   - Tools/function calling: Check supported parameters
   - Structured outputs: Use models with `structured_outputs`
   - Web search: Use `:online` variants or web plugin
   - Multimodal: Use vision-capable models

4. **Context Needs**:
   - Short conversations: Any model
   - Long documents: Use large context (Gemini 2.5 Pro, Claude Sonnet 3.5)
   - RAG applications: Consider context windows

### Comparison Table

| Model | Context | Quality | Speed | Cost | Best For |
|--------|----------|----------|-------|---------|-----------|
| GPT-4o | 128K | ★★★★★ | ★★★★☆ | $$$ | General, coding, vision |
| Claude 3.5 Sonnet | 200K | ★★★★★ | ★★★☆☆ | $$$ | Reasoning, long context |
| GPT-4o-mini | 128K | ★★★★☆ | ★★★★★ | $ | Fast, cost-effective |
| Claude 3.5 Haiku | 200K | ★★★☆☆ | ★★★★★ | $ | Speed, lightweight |
| Gemini 2.5 Pro | 1M | ★★★★★ | ★★★☆☆ | $$ | Huge context, multimodal |
| Gemini 2.0 Flash | 1M | ★★★☆☆ | ★★★★★ | $ | Fast multimodal |
| DeepSeek Coder | 32K | ★★★☆☆ | ★★★★☆ | $ | Coding |
| Llama 3.1 405B | 128K | ★★★★☆ | ★★★☆☆ | $$ | Open-source alternative |

*Legend*: ★★★★★ = Best, ★★★★☆ = Good, ★★★☆☆ = Fair

## Model Filters

### Filter by Parameters

```bash
# Models supporting tools
https://openrouter.ai/models?supported_parameters=tools

# Models with structured outputs
https://openrouter.ai/models?supported_parameters=structured_outputs

# Models with reasoning
https://openrouter.ai/models?supported_parameters=reasoning
```

### Filter by Category

```bash
# Programming models
https://openrouter.ai/models?category=programming

# Roleplay models
https://openrouter.ai/models?category=roleplay

# Marketing models
https://openrouter.ai/models?category=marketing
```

### Filter by Modality

```bash
# Embedding models
https://openrouter.ai/models?output_modalities=embeddings

# Vision models
https://openrouter.ai/models?input_modalities=image
```

## Model Recommendations

### For Different Use Cases

**Chatbots & Assistants**:
- `openai/gpt-4o` (balanced)
- `anthropic/claude-3.5-sonnet` (reasoning)

**Content Generation**:
- `openai/gpt-4o` (creative)
- `anthropic/claude-opus-4` (high quality)

**Code Generation**:
- `anthropic/claude-3.5-sonnet` (excellent)
- `deepseek/deepseek-coder` (cost-effective)
- `openai/gpt-4o` (good)

**Analysis & Summarization**:
- `anthropic/claude-3.5-sonnet` (large context)
- `google/gemini-2.5-pro` (huge context)

**RAG Applications**:
- `anthropic/claude-3.5-sonnet` (200K context)
- `google/gemini-2.5-pro` (1M context)

**Customer Support**:
- `openai/gpt-4o-mini` (fast, cost-effective)
- `anthropic/claude-3.5-haiku` (speed)

**Education**:
- `openai/gpt-4o` (versatile)
- `google/gemini-2.0-flash` (multimodal, fast)

### Starting Model

For new implementations, start with:

**Development**: `openai/gpt-4o-mini:free`
- Free, fast, good quality
- Test and iterate cheaply

**Production**: `openai/gpt-4o-mini` or `anthropic/claude-3.5-haiku`
- Cost-effective, reliable
- Scale up as needed

**High-Quality**: `openai/gpt-4o` or `anthropic/claude-3.5-sonnet`
- Use for critical paths
- A/B test vs cheaper models

## Model Updates

OpenRouter regularly adds new models:

**Stay Updated**:
- Follow OpenRouter Discord
- Check models page regularly
- Subscribe to RSS feed: `https://openrouter.ai/api/v1/models?use_rss=true`

**Deprecation**:
- Models may be removed after expiration date
- Check `expiration_date` in model metadata
- Plan migrations accordingly

## Summary

- **400+ Models**: From 90+ providers
- **Unified API**: Single interface for all models
- **Model Selection**: By capability, cost, use case
- **Variants**: Free, extended, online, thinking, nitro
- **Metadata**: Full model information via API
- **Embeddings**: Vector models for semantic search
- **Regular Updates**: New models added frequently

**Sources**:
- https://openrouter.ai/docs/guides/overview/models.mdx
- https://openrouter.ai/models
- https://openrouter.ai/docs/api/api-reference/models/get-models.mdx
- https://openrouter.ai/docs/guides/routing/model-variants/free.mdx
