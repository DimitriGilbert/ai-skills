# Parameters Reference

Complete reference of all available parameters for OpenRouter API requests, including types, ranges, defaults, and descriptions.

**Source**: https://openrouter.ai/docs/api/reference/parameters.mdx

## Core Parameters

### model

- **Type**: `string`
- **Required**: No* (uses user default if unspecified)
- **Description**: Model identifier to use
- **Examples**: 
  - `"openai/gpt-4"`
  - `"anthropic/claude-3.5-sonnet"`
  - `"google/gemini-2.5-pro"`
- **Default**: User's default model
- **Note**: Must be from available models list

**Source**: https://openrouter.ai/docs/api/reference/overview.mdx

### models

- **Type**: `string[]`
- **Required**: No
- **Description**: Array of model IDs for automatic fallback
- **Default**: `null`
- **Behavior**: Tries models in order if primary fails
- **Example**: `["anthropic/claude-3.5-sonnet", "openai/gpt-4o"]`

**Source**: https://openrouter.ai/docs/guides/routing/model-fallbacks.mdx

### messages

- **Type**: `Message[]`
- **Required**: Yes
- **Description**: Conversation messages array
- **Structure**: See Request/Response Schemas document

### stream

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Enable Server-Sent Events streaming
- **Effect**: Returns response chunks as they're generated
- **Notes**: 
  - Usage stats returned in final chunk
  - SSE comments sent to prevent timeouts

**Source**: https://openrouter.ai/docs/api/reference/streaming.mdx

## Sampling Parameters

### temperature

- **Type**: `float`
- **Range**: `0.0` to `2.0`
- **Default**: `1.0`
- **Description**: Controls randomness in response
- **Behavior**:
  - `0.0`: Deterministic, always same response
  - `1.0`: Balanced randomness
  - `2.0`: Highly random and diverse
- **Notes**: Lower values = more predictable, higher = more creative

### top_p

- **Type**: `float`
- **Range**: `0.0` to `1.0`
- **Default**: `1.0`
- **Description**: Nucleus sampling - limits to top probability mass
- **Behavior**:
  - `0.1`: Only top 10% of tokens
  - `1.0`: Consider all tokens
- **Notes**: Dynamic Top-K, adjusts based on probability distribution

### top_k

- **Type**: `integer`
- **Range**: `0` or above
- **Default**: `0` (disabled)
- **Description**: Limits choices to K most likely tokens
- **Behavior**:
  - `1`: Always pick most likely
  - `50`: Consider top 50
  - `0`: Consider all tokens
- **Notes**: Not available for OpenAI models

### frequency_penalty

- **Type**: `float`
- **Range**: `-2.0` to `2.0`
- **Default**: `0.0`
- **Description**: Penalizes tokens based on frequency in input
- **Behavior**:
  - Negative values: Encourage repetition
  - Positive values: Discourage frequent tokens
  - Scales with occurrence count
- **Notes**: Helps reduce repetition from input

### presence_penalty

- **Type**: `float`
- **Range**: `-2.0` to `2.0`
- **Default**: `0.0`
- **Description**: Penalizes tokens already used
- **Behavior**:
  - Negative values: Encourage reuse
  - Positive values: Encourage new topics
  - Doesn't scale with occurrence count
- **Notes**: Encourages topic diversity

### repetition_penalty

- **Type**: `float`
- **Range**: `0.0` to `2.0`
- **Default**: `1.0`
- **Description**: Reduces token repetition from input
- **Behavior**:
  - `1.0`: No effect
  - Higher values: Less likely to repeat
  - Too high: May cause incoherence
- **Notes**: Scales based on original token probability

### min_p

- **Type**: `float`
- **Range**: `0.0` to `1.0`
- **Default**: `0.0`
- **Description**: Minimum probability relative to top token
- **Behavior**:
  - `0.1`: Only tokens at least 1/10th as probable as best
  - `0.5`: Only tokens at least 1/2 as probable as best
- **Notes**: Adjusts dynamically based on confidence

### top_a

- **Type**: `float`
- **Range**: `0.0` to `1.0`
- **Default**: `0.0`
- **Description**: Filters tokens with sufficient probability
- **Behavior**:
  - Similar to top_p but probability-based
  - Lower = narrower focus
- **Notes**: Dynamic filtering based on max probability

## Length Control

### max_tokens

- **Type**: `integer`
- **Range**: `1` to context_length
- **Default**: Model-dependent
- **Description**: Maximum tokens to generate
- **Limit**: Context length minus prompt length
- **Notes**: Response stops at this limit even if incomplete

### stop

- **Type**: `string | string[]`
- **Required**: No
- **Default**: `null`
- **Description**: Stop sequences to halt generation
- **Behavior**: Stops when any sequence is encountered
- **Example**: `["\n\n", "###", "END"]`
- **Notes**: Sequences are not included in output

## Output Control

### response_format

- **Type**: `ResponseFormat object`
- **Required**: No
- **Default**: `null`
- **Description**: Enforce specific output format

#### Options:

**Text Mode**:
```json
{ "type": "text" }
```

**JSON Object Mode**:
```json
{ "type": "json_object" }
```

**JSON Schema Mode**:
```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "schema_name",
    "strict": true,
    "schema": { /* JSON Schema */ }
  }
}
```

**Grammar Mode**:
```json
{
  "type": "grammar",
  "grammar": "custom_grammar"
}
```

**Python Mode**:
```json
{ "type": "python" }
```

- **Note**: See [Structured Outputs](advanced-features.md) for details

**Source**: https://openrouter.ai/docs/guides/features/structured-outputs.mdx

### max_completion_tokens

- **Type**: `integer`
- **Range**: `1` to model limit
- **Default**: Model-dependent
- **Description**: Maximum tokens in completion (excluding reasoning)
- **Notes**: Separate from reasoning tokens for reasoning models

## Tool/Function Parameters

### tools

- **Type**: `Tool[]`
- **Required**: No
- **Default**: `[]`
- **Description**: Available functions/tools for model to call
- **Structure**:
```json
{
  "type": "function",
  "function": {
    "name": "function_name",
    "description": "What the function does",
    "parameters": { /* JSON Schema */ }
  }
}
```
- **Note**: Model decides when and how to use tools

**Source**: https://openrouter.ai/docs/guides/features/tool-calling.mdx

### tool_choice

- **Type**: `string | object`
- **Default**: `"auto"`
- **Description**: Control when/if tools are called

#### Options:

**Auto** (default):
```json
"auto"
```

**None** (no tools):
```json
"none"
```

**Required** (must call):
```json
"required"
```

**Specific Function**:
```json
{
  "type": "function",
  "function": {
    "name": "specific_function"
  }
}
```

### parallel_tool_calls

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable parallel function calls
- **Behavior**:
  - `true`: Model can call multiple tools at once
  - `false`: Tools called sequentially
- **Note**: Only applies when tools are provided

## Reasoning Parameters

### reasoning

- **Type**: `object`
- **Required**: No
- **Description**: Configure model reasoning behavior

#### Properties:

**effort**:
- Type: `string`
- Options: `"xhigh" | "high" | "medium" | "low" | "minimal" | "none"`
- Default: Model-dependent
- Description: Amount of computational effort

**summary**:
- Type: `string`
- Options: `"auto" | "concise" | "detailed"`
- Default: `"auto"`
- Description: Verbosity of reasoning summary

**Example**:
```json
{
  "reasoning": {
    "effort": "high",
    "summary": "detailed"
  }
}
```

### include_reasoning

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Include reasoning in response
- **Note**: Supported by reasoning-capable models

## Advanced Probability

### logprobs

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Return log probabilities for output tokens
- **Note**: Requires model support

### top_logprobs

- **Type**: `integer`
- **Range**: `0` to `20`
- **Default**: `null`
- **Description**: Number of top log probs to return per token
- **Requires**: `logprobs: true`
- **Note**: Only available when logprobs enabled

### logit_bias

- **Type**: `Record<number, number>`
- **Default**: `null`
- **Description**: Bias specific tokens
- **Format**: `{ token_id: bias_value }`
- **Range**: `-100` to `100`
- **Effect**:
  - `-100`: Ban token
  - `100`: Force selection
  - `-1` to `1`: Modify likelihood
- **Note**: Token IDs depend on model's tokenizer

## Repetition Reduction

### seed

- **Type**: `integer`
- **Default**: `null`
- **Description**: Set deterministic sampling
- **Behavior**: Same seed + parameters = same output
- **Note**: Not guaranteed for all models

## Verbosity

### verbosity

- **Type**: `string`
- **Default**: `"medium"`
- **Options**: `"low" | "medium" | "high"`
- **Description**: Control response verbosity
- **Behavior**:
  - `"low"`: Concise responses
  - `"medium"`: Balanced (default)
  - `"high"`: Detailed, comprehensive

## Routing Parameters

### route

- **Type**: `string`
- **Default**: `null`
- **Options**: `"fallback" | "sort"`
- **Description**: Routing strategy

**fallback**: Try models in order
**sort**: Sort by provider preferences

**Source**: https://openrouter.ai/docs/guides/routing/provider-selection.mdx

### provider

- **Type**: `ProviderPreferences object`
- **Default**: `null`
- **Description**: Provider routing preferences

#### Properties:

**order** (`string[]`):
- Preferred provider order
- Example: `["openai", "anthropic"]`

**allow_fallbacks** (`boolean`):
- Enable automatic provider fallbacks
- Default: `true`

**require_parameters** (`boolean`):
- Only use providers supporting all parameters
- Default: `false`

**data_collection** (`"allow" | "deny"`):
- Control data retention
- Default: `"allow"`

**only** (`string[]`):
- Whitelist specific providers

**ignore** (`string[]`):
- Blacklist specific providers

**quantizations** (`string[]`):
- Filter by quantization level
- Options: `"int4" | "int8" | "fp4" | "fp6" | "fp8" | "fp16" | "bf16" | "fp32"`

**sort** (`"price" | "throughput" | "latency"`):
- Sort providers by metric

**max_price** (`object`):
- Maximum pricing thresholds
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

## Plugins

### plugins

- **Type**: `Plugin[]`
- **Default**: `[]`
- **Description**: Enable model plugins

#### Available Plugins:

**Web Search** (`web`):
- Enable real-time web search
- Options: `engine`, `max_results`, `search_prompt`
- Example:
```json
{
  "id": "web",
  "enabled": true,
  "max_results": 5,
  "engine": "exa"
}
```

**File Parser** (`file-parser`):
- Parse PDFs and other files
- Options: `pdf` configuration
- Example:
```json
{
  "id": "file-parser",
  "enabled": true,
  "pdf": {
    "engine": "mistral-ocr"
  }
}
```

**Response Healing** (`response-healing`):
- Automatically repair malformed JSON
- Example:
```json
{
  "id": "response-healing",
  "enabled": true
}
```

**Auto Router** (`auto-router`):
- Automatic model selection
- Example:
```json
{
  "id": "auto-router",
  "allowed_models": ["openai/*", "anthropic/*"]
}
```

**Moderation** (`moderation`):
- Content moderation
- Example:
```json
{
  "id": "moderation"
}
```

**Source**: https://openrouter.ai/docs/guides/features/plugins/overview.mdx

## Metadata

### user

- **Type**: `string`
- **Default**: `null`
- **Description**: Stable identifier for end-user
- **Purpose**: Abuse detection, caching, reporting
- **Max Length**: 128 characters
- **Note**: Not the same as API key

### session_id

- **Type**: `string`
- **Default**: `null`
- **Description**: Group related requests
- **Purpose**: Observability, analytics
- **Max Length**: 128 characters
- **Override**: Body value takes precedence over header

### metadata

- **Type**: `Record<string, string>`
- **Default**: `null`
- **Description**: Custom metadata for request
- **Limits**:
  - Max 16 key-value pairs
  - Keys: Max 64 characters, no brackets
  - Values: Max 512 characters
- **Purpose**: Analytics, tracking

## Transforms

### transforms

- **Type**: `string[]`
- **Default**: `[]`
- **Description**: Message transformation pipeline
- **Options**: Depends on available transforms
- **Note**: See Message Transforms documentation

**Source**: https://openrouter.ai/docs/guides/features/message-transforms.mdx

## Debug Options

### debug

- **Type**: `DebugOptions object`
- **Default**: `null`
- **Description**: Debugging options

#### Properties:

**echo_upstream_body** (`boolean`):
- Return transformed request body
- Default: `false`
- **Note**: Only works with streaming
- **Warning**: Do not use in production

**Example**:
```json
{
  "debug": {
    "echo_upstream_body": true
  }
}
```

**Source**: https://openrouter.ai/docs/api/reference/errors-and-debugging.mdx

## Web Search Options

### web_search_options

- **Type**: `object`
- **Default**: `null`
- **Description**: Configure web search behavior

#### Properties:

**search_context_size** (`"low" | "medium" | "high"`):
- Amount of search context
- Default: Model-dependent
- **Effect**: More context = higher cost

**user_location** (`object`):
- User location for search
- Properties:
  - `type`: `"approximate"`
  - `city`, `country`, `region`, `timezone`: Optional strings

**Example**:
```json
{
  "web_search_options": {
    "search_context_size": "high",
    "user_location": {
      "type": "approximate",
      "city": "San Francisco",
      "country": "USA"
    }
  }
}
```

**Source**: https://openrouter.ai/docs/guides/features/plugins/web-search.mdx

## Image Configuration

### image_config

- **Type**: `object`
- **Default**: `null`
- **Description**: Configure image generation
- **Properties**: Model-specific
- **Note**: For image-generation models

### modalities

- **Type**: `string[]`
- **Default**: `null`
- **Options**: `["text"] | ["image"] | ["text", "image"]`
- **Description**: Request specific output modalities
- **Note**: Only for models supporting multiple outputs

## Streaming Options

### stream_options

- **Type**: `object`
- **Default**: `null`
- **Description**: Streaming configuration

#### Properties:

**include_usage** (`boolean`):
- Include usage in every chunk
- Default: `false`
- **Note**: Usage always in final chunk

## Prediction (Advanced)

### prediction

- **Type**: `object`
- **Default**: `null`
- **Description**: Provide predicted output to reduce latency

#### Properties:

**type** (`string`):
- Must be `"content"`

**content** (`string`):
- Predicted output text

**Example**:
```json
{
  "prediction": {
    "type": "content",
    "content": "Expected response..."
  }
}
```

- **Note**: Experimental feature
- **Purpose**: Latency optimization

## Parameter Support by Model

Not all models support all parameters. Check model's `supported_parameters` field:

- `temperature`
- `top_p`
- `top_k`
- `min_p`
- `top_a`
- `frequency_penalty`
- `presence_penalty`
- `repetition_penalty`
- `max_tokens`
- `logit_bias`
- `logprobs`
- `top_logprobs`
- `seed`
- `response_format`
- `structured_outputs`
- `stop`
- `tools`
- `tool_choice`
- `parallel_tool_calls`
- `include_reasoning`
- `reasoning`
- `reasoning_effort`
- `web_search_options`
- `verbosity`

**Source**: https://openrouter.ai/docs/api/api-reference/models/get-models.mdx

## Summary Table

| Category | Parameter | Type | Range | Default |
|----------|-----------|------|--------|---------|
| Core | model | string | - | User default |
| Core | messages | Message[] | - | - (required) |
| Core | stream | boolean | - | false |
| Sampling | temperature | float | 0-2 | 1.0 |
| Sampling | top_p | float | 0-1 | 1.0 |
| Sampling | top_k | integer | 0+ | 0 (disabled) |
| Sampling | frequency_penalty | float | -2 to 2 | 0.0 |
| Sampling | presence_penalty | float | -2 to 2 | 0.0 |
| Sampling | repetition_penalty | float | 0-2 | 1.0 |
| Sampling | min_p | float | 0-1 | 0.0 |
| Sampling | top_a | float | 0-1 | 0.0 |
| Length | max_tokens | integer | 1+ | Model dep. |
| Length | stop | string/array | - | null |
| Output | response_format | object | - | null |
| Tools | tools | Tool[] | - | [] |
| Tools | tool_choice | string/object | - | "auto" |
| Tools | parallel_tool_calls | boolean | - | true |
| Reasoning | reasoning | object | - | null |
| Prob. | logprobs | boolean | - | false |
| Prob. | top_logprobs | integer | 0-20 | null |
| Prob. | logit_bias | map | -100 to 100 | null |
| Control | seed | integer | - | null |
| Routing | route | string | - | null |
| Routing | provider | object | - | null |
| Plugins | plugins | Plugin[] | - | [] |
| Metadata | user | string | - | null |
| Metadata | session_id | string | - | null |
| Metadata | metadata | map | - | null |
| Debug | debug | object | - | null |

**Sources**:
- https://openrouter.ai/docs/api/reference/parameters.mdx
- https://openrouter.ai/docs/api/reference/overview.mdx
- https://openrouter.ai/openapi.json
