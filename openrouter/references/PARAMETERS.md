# Parameters Reference

Complete reference for all OpenRouter API request parameters with types, ranges, defaults, and usage guidance.

**Source**: https://openrouter.ai/docs/api/reference/parameters.mdx

---

## Core Parameters

### model

- **Type**: `string`
- **Required**: No (uses user default if unspecified)
- **Description**: Model identifier to use
- **Format**: `provider/model-name[:variant]`
- **Examples**:
  - `"anthropic/claude-3.5-sonnet"`
  - `"openai/gpt-4o:online"`
  - `"google/gemini-2.0-flash:free"`
- **Default**: User's default model
- **Guidance**: Always specify explicitly for consistency

---

### messages

- **Type**: `Message[]`
- **Required**: Yes
- **Description**: Conversation history

**Message structure**:
```typescript
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
  name?: string;  // For non-OpenAI models, prepends to content
}

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string; detail?: 'low' | 'auto' | 'high' } }
  | { type: 'input_audio'; input_audio: { data: string; format: string } }
  | { type: 'input_video'; video_url: { url: string } }
  | { type: 'input_file'; file_id: string };
```

**Tool response message**:
```typescript
{
  role: 'tool';
  tool_call_id: string;
  content: string;  // JSON string of result
  name?: string;
}
```

**Guidance**:
- Always start with system message for behavior guidance
- Include conversation history for context
- Use array of ContentPart for multimodal inputs

---

### stream

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Enable Server-Sent Events (SSE) streaming
- **Effect**: Returns response chunks as they're generated
- **Response format**: SSE stream with `data: { ... }` lines
- **Guidance**: Use for real-time responses, user-facing applications

---

## Sampling Parameters

### temperature

- **Type**: `float`
- **Range**: `0.0` to `2.0`
- **Default**: `1.0`
- **Description**: Controls randomness in token selection

**Behavior**:
- `0.0`: Deterministic, always same output
- `0.1-0.3`: Low randomness (factual, precise)
- `0.4-0.7`: Balanced
- `0.8-1.2`: Higher creativity
- `1.3-2.0`: Highly creative, unpredictable

**Guidance**:
- Code generation: `0.1-0.3`
- Factual responses: `0.0-0.3`
- Chat: `0.6-0.8`
- Creative writing: `0.8-1.2`
- Brainstorming: `1.0-1.5`

---

### top_p

- **Type**: `float`
- **Range**: `0.0` to `1.0`
- **Default**: `1.0`
- **Description**: Nucleus sampling - limit to tokens whose probabilities sum to P

**Behavior**:
- `0.9`: Only top 90% of tokens by probability
- `0.95`: Only top 95% of tokens
- `1.0`: Consider all tokens (no limit)

**Guidance**:
- Use as alternative to temperature
- Common values: `0.9`, `0.95`
- Combining with temperature: typically only use one

---

### top_k

- **Type**: `integer`
- **Range**: `0` or above
- **Default**: `0` (disabled)
- **Description**: Limit to K most likely tokens at each step

**Behavior**:
- `1`: Always pick most likely token (deterministic)
- `10`: Consider top 10 tokens
- `50`: Consider top 50 tokens
- `0`: Consider all tokens (disabled)

**Guidance**:
- Not available for OpenAI models
- Good alternative to top_p for some models
- Lower values = more predictable

---

### frequency_penalty

- **Type**: `float`
- **Range**: `-2.0` to `2.0`
- **Default**: `0.0`
- **Description**: Penalize tokens based on frequency in input

**Behavior**:
- `0.0`: No effect
- `0.5-1.0`: Reduce repetition (positive)
- `-0.5 to -1.0`: Encourage repetition (negative)
- Scales with occurrence count

**Guidance**:
- Use to reduce word/phrase repetition
- Higher values may reduce coherence
- Combine with presence_penalty for best results

---

### presence_penalty

- **Type**: `float`
- **Range**: `-2.0` to `2.0`
- **Default**: `0.0`
- **Description**: Penalize tokens already used (regardless of frequency)

**Behavior**:
- `0.0`: No effect
- `0.5-1.0`: Encourage new topics, reduce repetition
- `-0.5 to -1.0`: Encourage staying on topic
- Does NOT scale with occurrence count

**Guidance**:
- Use to encourage topic diversity
- Good for exploration, brainstorming
- Combine with frequency_penalty

---

### repetition_penalty

- **Type**: `float`
- **Range**: `0.0` to `2.0`
- **Default**: `1.0`
- **Description**: Reduce token repetition from input

**Behavior**:
- `1.0`: No effect
- `1.2-1.5`: Reduce repetition
- Too high: May cause incoherence, run-on sentences
- Scales based on original token probability

**Guidance**:
- Alternative to frequency/presence penalties
- Available on non-OpenAI models
- Start with `1.1-1.2`

---

### min_p

- **Type**: `float`
- **Range**: `0.0` to `1.0`
- **Default**: `0.0`
- **Description**: Minimum probability relative to most likely token

**Behavior**:
- `0.1`: Only tokens at least 10% as probable as best token
- `0.5`: Only tokens at least 50% as probable
- `0.0`: No filtering

**Guidance**:
- Dynamic filtering based on confidence
- Adjusts automatically per token position
- Good alternative to top_p for some models

---

### top_a

- **Type**: `float`
- **Range**: `0.0` to `1.0`
- **Default**: `0.0`
- **Description**: Filter tokens with "sufficiently high" probability

**Behavior**:
- Similar to top_p but probability-based
- Lower: Narrower focus
- Higher: Broader consideration
- Adjusts dynamically based on max probability

**Guidance**:
- Good for creative writing
- Experimental parameter
- Works well with some open-source models

---

## Length Control Parameters

### max_tokens

- **Type**: `integer`
- **Range**: `1` to (context_length - prompt_length)
- **Default**: Model-dependent
- **Description**: Maximum tokens to generate

**Guidance**:
- **Always set** to control cost
- Prevents runaway responses
- Typical values:
  - Short answers: 100-500
  - Medium: 500-1000
  - Long-form: 1000-2000
- Response stops at limit even if incomplete

---

### max_completion_tokens

- **Type**: `integer`
- **Range**: `1` to model limit
- **Default**: Model-dependent
- **Description**: Maximum tokens in completion (excluding reasoning tokens)

**Guidance**:
- Use with reasoning models
- Separate reasoning tokens from output tokens
- Controls actual response length, not reasoning

---

### stop

- **Type**: `string | string[]`
- **Default**: `null`
- **Description**: Stop sequences to halt generation

**Behavior**:
- Stops when any sequence encountered
- Sequences not included in output
- Case-sensitive

**Common examples**:
```typescript
stop: ['\n\n', '###', 'END', '---']
```

**Guidance**:
- Use to control output structure
- Good for code blocks, lists
- Prevents unwanted continuations

---

## Output Format Parameters

### response_format

- **Type**: `ResponseFormat`
- **Default**: `null`
- **Description**: Enforce specific output format

**Text mode** (default):
```typescript
{ type: 'text' }
```

**JSON object mode**:
```typescript
{ type: 'json_object' }
```
- Model returns valid JSON
- Must also instruct model in system message
- Does NOT enforce schema

**JSON Schema mode** (strict):
```typescript
{
  type: 'json_schema',
  json_schema: {
    name: 'schema_name',
    strict: true,
    schema: { /* JSON Schema */ }
  }
}
```
- Enforces exact schema
- Model must return valid JSON matching schema
- Supported by: OpenAI, Anthropic, Google, most open-source

**Grammar mode**:
```typescript
{
  type: 'grammar',
  grammar: 'custom_grammar'
}
```
- Model-specific grammar
- Advanced use cases

**Python mode**:
```typescript
{ type: 'python' }
```
- For Python code generation

**Guidance**:
- Use `json_object` for simple JSON
- Use `json_schema` for structured data, APIs
- Add response healing plugin for robustness
- Model support varies - check capabilities

---

## Tool/Function Calling Parameters

### tools

- **Type**: `Tool[]`
- **Default**: `[]`
- **Description**: Available functions for model to call

**Structure**:
```typescript
type Tool = {
  type: 'function';
  function: {
    name: string;                    // Function name
    description?: string;            // What it does
    parameters: object;              // JSON Schema for arguments
    strict?: boolean;               // Enforce schema
  };
};
```

**Example**:
```typescript
{
  tools: [{
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit']
          }
        },
        required: ['location']
      }
    }
  }]
}
```

**Guidance**:
- Provide clear descriptions for good tool selection
- Use JSON Schema for parameter validation
- Check model supports tools parameter
- Find supporting models: `openrouter.ai/models?supported_parameters=tools`

---

### tool_choice

- **Type**: `'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } }`
- **Default**: `'auto'`
- **Description**: Control when/if tools are called

**Options**:

**'auto'** (default):
- Model decides whether to call tools
- Good default for most cases

**'none'**:
- Never call tools
- Model generates text only
- Use when you don't want tools

**'required'**:
- Model must call at least one tool
- Forces tool use
- Good for agentic workflows

**Specific function**:
```typescript
{
  type: 'function',
  function: { name: 'specific_function' }
}
```
- Force specific tool call
- Use when you know which tool is needed

**Guidance**:
- Default to `'auto'`
- Use `'required'` for multi-step tasks
- Use specific function when context is clear

---

### parallel_tool_calls

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Allow parallel function calls

**Behavior**:
- `true`: Model can call multiple tools simultaneously
- `false`: Tools called sequentially

**Guidance**:
- Keep `true` for efficiency
- Set `false` when tools have dependencies
- Parallel calls reduce latency

---

## Reasoning Parameters

### reasoning

- **Type**: `object`
- **Default**: `null`
- **Description**: Configure model reasoning behavior

**Properties**:

**effort**:
- Type: `string`
- Options: `'xhigh' | 'high' | 'medium' | 'low' | 'minimal' | 'none'`
- Default: Model-dependent
- Description: Amount of computational effort

**summary**:
- Type: `string`
- Options: `'auto' | 'concise' | 'detailed'`
- Default: `'auto'`
- Description: Verbosity of reasoning summary

**Example**:
```typescript
{
  reasoning: {
    effort: 'high',
    summary: 'detailed'
  }
}
```

**Guidance**:
- Use with reasoning models (Claude Opus, OpenAI o1/o3)
- Higher effort = better reasoning, more cost
- Use `minimal` for simple tasks

---

### include_reasoning

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Include reasoning in response

**Guidance**:
- Supported by reasoning-capable models
- Increases token usage and cost
- Use for debugging or transparency

---

## Probability Parameters

### logprobs

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Return log probabilities for output tokens

**Guidance**:
- Requires model support
- Useful for debugging, analysis
- Increases response size

---

### top_logprobs

- **Type**: `integer`
- **Range**: `0` to `20`
- **Default**: `null`
- **Description**: Number of top log probs to return per token

**Requires**: `logprobs: true`

**Guidance**:
- Only available when logprobs enabled
- Used with top_k or top_p
- Good for understanding model confidence

---

### logit_bias

- **Type**: `Record<number, number>`
- **Default**: `null`
- **Description**: Bias specific tokens

**Format**: `{ token_id: bias_value }`

**Range**: `-100` to `100`

**Effect**:
- `-100`: Ban token
- `-10 to -1`: Less likely
- `1 to 10`: More likely
- `100`: Force selection

**Example**:
```typescript
{
  logit_bias: {
    12345: -100,  // Ban specific token
    67890: 5      // Encourage token
  }
}
```

**Guidance**:
- Token IDs depend on model's tokenizer
- Use for style control, preventing outputs
- Not available for all models

---

## Routing Parameters

### route

- **Type**: `'fallback' | 'sort' | null`
- **Default**: `null`
- **Description**: Routing strategy

**'fallback'**:
- Try models in order
- Use with `models` array

**'sort'**:
- Sort by provider preferences
- Use with `provider.sort`

**Guidance**:
- Use with models array for fallbacks
- Use with provider preferences for optimization

---

### models

- **Type**: `string[]`
- **Default**: `null`
- **Description**: Array of model IDs for automatic fallback

**Behavior**:
- Tries models in order
- Falls back to next on error
- Uses whichever model succeeds

**Example**:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.0-flash'
  ]
}
```

**Guidance**:
- Use for high reliability
- Order by preference
- Include models from different providers
- Returns actual model used in response

---

### provider

- **Type**: `ProviderPreferences`
- **Default**: `null`
- **Description**: Provider routing preferences

**Properties**:

**order** (`string[]`):
- Preferred provider order
- Example: `['openai', 'anthropic', 'google']`

**allow_fallbacks** (`boolean`):
- Enable automatic provider fallbacks
- Default: `true`

**require_parameters** (`boolean`):
- Only use providers supporting all parameters
- Default: `false`

**data_collection** (`'allow' | 'deny'`):
- Control data retention
- Default: `'allow'`

**only** (`string[]`):
- Whitelist specific providers
- Example: `['openai', 'anthropic']`

**ignore** (`string[]`):
- Blacklist specific providers
- Example: `['openai']`

**quantizations** (`string[]`):
- Filter by quantization level
- Options: `'int4' | 'int8' | 'fp4' | 'fp6' | 'fp8' | 'fp16' | 'bf16' | 'fp32'`

**sort** (`'price' | 'throughput' | 'latency'`):
- Sort providers by metric
- Default: `null`

**max_price** (`object`):
- Maximum pricing thresholds
- Properties:
  - `prompt`: Price per 1M prompt tokens
  - `completion`: Price per 1M completion tokens
  - `request`: Fixed price per request

**preferred_min_throughput** (`number`):
- Minimum tokens/second threshold
- Can be percentile object: `{ p50, p75, p90, p99 }`

**preferred_max_latency** (`number`):
- Maximum latency threshold in seconds
- Can be percentile object: `{ p50, p75, p90, p99 }`

**Example**:
```typescript
{
  provider: {
    order: ['openai', 'anthropic'],
    allow_fallbacks: true,
    data_collection: 'deny',
    sort: 'price',
    ignore: ['provider_to_exclude'],
    max_price: {
      prompt: 10,      // $10 per 1M prompt tokens
      completion: 30   // $30 per 1M completion tokens
    }
  }
}
```

**Guidance**:
- Use to optimize for cost, speed, or throughput
- Set allow_fallbacks: true for reliability
- Use sort to prioritize specific metric
- Set data_collection: 'deny' for Zero Data Retention

---

## Plugins

### plugins

- **Type**: `Plugin[]`
- **Default**: `[]`
- **Description**: Enable model plugins

**Available plugins**:

**Web Search** (`web`):
```typescript
{
  id: 'web',
  enabled: true,
  max_results?: number,        // Default: 5
  engine?: 'native' | 'exa',  // Default: native if available
  search_prompt?: string
}
```
- Real-time web search
- Exa: $4 per 1000 results
- Native: Provider-specific pricing

**File Parser** (`file-parser`):
```typescript
{
  id: 'file-parser',
  enabled: true,
  pdf?: {
    engine?: 'mistral-ocr' | 'pdf-text' | 'native'
  }
}
```
- Parse PDFs and documents
- OCR capabilities

**Response Healing** (`response-healing`):
```typescript
{
  id: 'response-healing',
  enabled: true
}
```
- Automatically repair malformed JSON
- Works with any model

**Auto Router** (`auto-router`):
```typescript
{
  id: 'auto-router',
  allowed_models?: string[]  // e.g., ['openai/*', 'anthropic/*']
}
```
- Automatic model selection
- Intelligent routing

**Moderation** (`moderation`):
```typescript
{
  id: 'moderation'
}
```
- Content moderation
- Safety filtering

**Example**:
```typescript
{
  plugins: [
    {
      id: 'web',
      enabled: true,
      max_results: 5
    },
    {
      id: 'response-healing'
    }
  ]
}
```

**Guidance**:
- Use `:online` model variant for simple web search
- Use plugin for advanced configuration
- Add response-healing for structured outputs
- Use file-parser for PDF processing

---

## Metadata Parameters

### user

- **Type**: `string`
- **Default**: `null`
- **Description**: Stable identifier for end-user

**Purpose**:
- Abuse detection
- Request caching
- Analytics and reporting

**Constraints**:
- Max length: 128 characters

**Guidance**:
- Set when you have user IDs
- Helps with caching and rate limiting
- Not the same as API key

---

### session_id

- **Type**: `string`
- **Default**: `null`
- **Description**: Group related requests

**Purpose**:
- Observability and analytics
- Conversation tracking
- Cache optimization

**Constraints**:
- Max length: 128 characters
- Body value overrides header value

**Guidance**:
- Use for conversation tracking
- Set once per conversation
- Improves caching for related requests

---

### metadata

- **Type**: `Record<string, string>`
- **Default**: `null`
- **Description**: Custom metadata for request

**Constraints**:
- Max 16 key-value pairs
- Keys: Max 64 characters, no brackets
- Values: Max 512 characters

**Purpose**:
- Analytics and tracking
- Request categorization
- Debugging

**Example**:
```typescript
{
  metadata: {
    application: 'my-app',
    version: '1.0.0',
    feature: 'chat',
    environment: 'production'
  }
}
```

**Guidance**:
- Use for observability
- Keep keys consistent across requests
- Don't include sensitive data

---

## Transform Parameters

### transforms

- **Type**: `string[]`
- **Default**: `[]`
- **Description**: Message transformation pipeline

**Guidance**:
- Advanced feature
- See Message Transforms documentation
- Used for pre/post-processing

---

## Debug Parameters

### debug

- **Type**: `DebugOptions`
- **Default**: `null`
- **Description**: Debugging options (streaming only)

**Properties**:

**echo_upstream_body** (`boolean`):
- Return transformed request body
- Default: `false`
- **WARNING**: Do not use in production
- Only works with streaming

**Example**:
```typescript
{
  stream: true,
  debug: {
    echo_upstream_body: true
  }
}
```

**Guidance**:
- For debugging only
- Never use in production
- Increases response size and latency

---

## Web Search Options

### web_search_options

- **Type**: `object`
- **Default**: `null`
- **Description**: Configure web search behavior

**Properties**:

**search_context_size** (`'low' | 'medium' | 'high'`):
- Amount of search context
- Default: Model-dependent
- Effect: More context = higher cost

**user_location** (`object`):
- User location for search
- Properties:
  - `type`: `'approximate'`
  - `city`?: string
  - `country`?: string
  - `region`?: string
  - `timezone`?: string

**Example**:
```typescript
{
  web_search_options: {
    search_context_size: 'high',
    user_location: {
      type: 'approximate',
      city: 'San Francisco',
      country: 'USA'
    }
  }
}
```

**Guidance**:
- Use with web search plugin or :online variant
- Higher context = better results, more cost
- Set user location for local search results

---

## Stream Options

### stream_options

- **Type**: `object`
- **Default**: `null`
- **Description**: Streaming configuration

**Properties**:

**include_usage** (`boolean`):
- Include usage in every chunk
- Default: `false`
- Note: Usage always in final chunk

**Example**:
```typescript
{
  stream: true,
  stream_options: {
    include_usage: true
  }
}
```

**Guidance**:
- Use for real-time usage tracking
- Adds small overhead to each chunk
- Final chunk always includes usage

---

## Prediction Parameter

### prediction

- **Type**: `object`
- **Default**: `null`
- **Description**: Provide predicted output to reduce latency

**Properties**:

**type**: Must be `'content'`

**content**: Predicted output text

**Example**:
```typescript
{
  prediction: {
    type: 'content',
    content: 'Expected response...'
  }
}
```

**Guidance**:
- Experimental feature
- Purpose: Latency optimization
- Requires good prediction to be effective
- Not widely supported

---

## Image Configuration

### image_config

- **Type**: `object`
- **Default**: `null`
- **Description**: Configure image generation

**Properties**: Model-specific

**Guidance**:
- For image-generation models
- See model documentation for details

---

### modalities

- **Type**: `string[]`
- **Default**: `null`
- **Options**: `['text'] | ['image'] | ['text', 'image']`
- **Description**: Request specific output modalities

**Guidance**:
- Only for models supporting multiple outputs
- Controls what model generates
- Most models only support text

---

## Verbosity

### verbosity

- **Type**: `'low' | 'medium' | 'high'`
- **Default**: `'medium'`
- **Description**: Control response verbosity

**Behavior**:
- `'low'`: Concise responses
- `'medium'`: Balanced (default)
- `'high'`: Detailed, comprehensive

**Guidance**:
- Introduced by OpenAI
- Maps to Anthropic's `output_config.effort`
- Use to control output length indirectly

---

## Parameter Support by Model

Not all models support all parameters. Check model's `supported_parameters` field:

### Common Parameters
- `temperature` - Widely supported
- `top_p` - Widely supported
- `top_k` - Not OpenAI models
- `min_p`, `top_a` - Some open-source models
- `frequency_penalty`, `presence_penalty` - OpenAI models
- `repetition_penalty` - Non-OpenAI models
- `max_tokens` - All models
- `logit_bias` - OpenAI, some others
- `logprobs` - OpenAI, some others
- `seed` - Most models (determinism not guaranteed)
- `response_format` - Growing support
- `structured_outputs` - OpenAI, Anthropic, Google, most open-source
- `stop` - All models
- `tools` - Growing support
- `tool_choice` - With tools support
- `parallel_tool_calls` - With tools support
- `include_reasoning` - Reasoning models
- `reasoning` - Reasoning models
- `web_search_options` - With web search support
- `verbosity` - OpenAI, Anthropic

### Check Support
```bash
curl https://openrouter.ai/api/v1/models
# Filter by supported_parameters in response
```

Or check models page: `openrouter.ai/models?supported_parameters=tools`

---

## Parameter Quick Reference

| Category | Parameter | Type | Range/Options | Default | When to Use |
|----------|-----------|------|---------------|---------|-------------|
| Core | model | string | - | User default | Always specify |
| Core | messages | Message[] | - | Required | Every request |
| Core | stream | boolean | - | false | Real-time responses |
| Sampling | temperature | float | 0-2 | 1.0 | Control creativity |
| Sampling | top_p | float | 0-1 | 1.0 | Alternative to temp |
| Sampling | top_k | integer | 0+ | 0 (disabled) | Not OpenAI |
| Sampling | frequency_penalty | float | -2 to 2 | 0.0 | Reduce repetition |
| Sampling | presence_penalty | float | -2 to 2 | 0.0 | Encourage variety |
| Sampling | repetition_penalty | float | 0-2 | 1.0 | Non-OpenAI |
| Sampling | min_p | float | 0-1 | 0.0 | Alternative to top_p |
| Sampling | top_a | float | 0-1 | 0.0 | Creative writing |
| Length | max_tokens | integer | 1+ | Model dep. | Control cost |
| Length | stop | string/array | - | null | Control structure |
| Output | response_format | object | - | null | Structured data |
| Tools | tools | Tool[] | - | [] | External functions |
| Tools | tool_choice | string/object | - | 'auto' | Control tool use |
| Tools | parallel_tool_calls | boolean | - | true | Efficiency |
| Reasoning | reasoning | object | - | null | Reasoning models |
| Reasoning | include_reasoning | boolean | - | false | Transparency |
| Routing | route | string | fallback/sort | null | Strategy |
| Routing | models | string[] | - | null | Fallbacks |
| Routing | provider | object | - | null | Preferences |
| Plugins | plugins | Plugin[] | - | [] | Extend capabilities |
| Metadata | user | string | 128 chars | null | Abuse detection |
| Metadata | session_id | string | 128 chars | null | Tracking |
| Metadata | metadata | map | 16 pairs | null | Analytics |
| Debug | debug | object | - | null | Debugging only |

---

**Sources**:
- https://openrouter.ai/docs/api/reference/parameters.mdx
- https://openrouter.ai/docs/api/reference/overview.mdx
- https://openrouter.ai/openapi.json
