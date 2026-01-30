# Advanced Patterns

Comprehensive guide to advanced OpenRouter API patterns including tool calling, structured outputs, web search, streaming, multimodal handling, and framework integrations.

**Source**: https://openrouter.ai/docs/guides/features/

---

## Tool / Function Calling

### Overview

Three-step process for enabling LLMs to execute external functions.

**1. Inference Request**: Send tools in initial request
**2. Tool Execution**: Execute requested tools client-side
**3. Response with Results**: Send tool results back to model

### Step 1: Request with Tools

**Define tools**:
```typescript
const tools = [{
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
}, {
  type: 'function',
  function: {
    name: 'search_database',
    description: 'Search the database for records',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query'
        },
        limit: {
          type: 'integer',
          description: 'Maximum results',
          default: 10
        }
      },
      required: ['query']
    }
  }
}];
```

**Make request**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      { role: 'user', content: 'What\'s the weather in San Francisco?' }
    ],
    tools: tools,
    tool_choice: 'auto'
  })
});

const data = await response.json();
```

### Step 2: Execute Tools

**Check for tool calls**:
```typescript
const toolCalls = data.choices[0].message.tool_calls;

if (toolCalls) {
  for (const toolCall of toolCalls) {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    console.log('Calling tool:', name, parsedArgs);

    // Execute tool
    const result = await executeTool(name, parsedArgs);
    console.log('Tool result:', result);
  }
}
```

**Tool execution function**:
```typescript
async function executeTool(name, args) {
  switch (name) {
    case 'get_weather':
      return await getWeatherAPI(args.location, args.unit);

    case 'search_database':
      return await searchDatabase(args.query, args.limit);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
```

### Step 3: Send Results Back

**Add tool response to messages**:
```typescript
const messages = [
  { role: 'user', content: 'What\'s the weather in San Francisco?' },
  {
    role: 'assistant',
    content: null,
    tool_calls: toolCalls
  }
];

// Add tool results
for (const toolCall of toolCalls) {
  const result = await executeTool(toolCall.function.name, JSON.parse(toolCall.function.arguments));

  messages.push({
    role: 'tool',
    tool_call_id: toolCall.id,
    content: JSON.stringify(result)
  });
}

// Send final request
const finalResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: messages,
    tools: tools
  })
});

const finalData = await finalResponse.json();
console.log('Final response:', finalData.choices[0].message.content);
```

### Agentic Loop Pattern

**Automatic multi-turn tool execution**:
```typescript
async function runAgenticLoop(initialPrompt, tools, maxIterations = 10) {
  let messages = [{ role: 'user', content: initialPrompt }];
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    // Call LLM
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
        parallel_tool_calls: true
      })
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    // Add assistant message to history
    messages.push(assistantMessage);

    // Check if done (no tool calls)
    if (!assistantMessage.tool_calls) {
      console.log('Agentic loop complete:', assistantMessage.content);
      return assistantMessage.content;
    }

    // Execute all tools in parallel
    const toolPromises = assistantMessage.tool_calls.map(async (toolCall) => {
      const result = await executeTool(toolCall.function.name, JSON.parse(toolCall.function.arguments));

      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      };
    });

    // Wait for all tools to complete
    const toolResults = await Promise.all(toolPromises);
    messages.push(...toolResults);

    console.log(`Iteration ${iterations} complete, ${toolResults.length} tools called`);
  }

  throw new Error('Agentic loop exceeded max iterations');
}
```

**Usage**:
```typescript
const tools = [/* tool definitions */];

const result = await runAgenticLoop(
  'Research the latest AI developments and summarize them',
  tools,
  10
);
```

### Tool Choice Control

**Auto** (default):
```typescript
{ tool_choice: 'auto' }
```
Model decides whether to call tools.

**None**:
```typescript
{ tool_choice: 'none' }
```
Never call tools, generate text only.

**Required**:
```typescript
{ tool_choice: 'required' }
```
Model must call at least one tool.

**Specific function**:
```typescript
{
  tool_choice: {
    type: 'function',
    function: { name: 'get_weather' }
  }
}
```
Force specific tool call.

### Parallel vs Sequential Tool Calls

**Parallel** (default, `parallel_tool_calls: true`):
```typescript
{
  tools: [tool1, tool2, tool3],
  parallel_tool_calls: true  // Default
}
```

**Sequential** (`parallel_tool_calls: false`):
```typescript
{
  tools: [tool1, tool2, tool3],
  parallel_tool_calls: false
}
```

**When to use parallel**:
- Independent tools (no dependencies)
- Speed matters
- Tools don't have side effects

**When to use sequential**:
- Tools have dependencies
- Order matters
- Tools have side effects

---

## Structured Outputs

### JSON Object Mode

**Simple JSON enforcement**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      {
        role: 'system',
        content: 'Output valid JSON only. No other text.'
      },
      {
        role: 'user',
        content: 'Describe the weather in San Francisco'
      }
    ],
    response_format: { type: 'json_object' }
  })
});

const data = await response.json();
const weatherData = JSON.parse(data.choices[0].message.content);
```

### JSON Schema Mode (Strict)

**Define JSON Schema**:
```typescript
const weatherSchema = {
  type: 'object',
  properties: {
    location: {
      type: 'string',
      description: 'City name'
    },
    temperature: {
      type: 'number',
      description: 'Temperature in Celsius'
    },
    conditions: {
      type: 'string',
      description: 'Weather conditions'
    },
    humidity: {
      type: 'number',
      description: 'Humidity percentage'
    }
  },
  required: ['location', 'temperature', 'conditions', 'humidity'],
  additionalProperties: false
};
```

**Make request**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{
      role: 'user',
      content: 'What\'s the weather in San Francisco?'
    }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'weather_report',
        strict: true,
        schema: weatherSchema
      }
    }
  })
});

const data = await response.json();
const weatherData = JSON.parse(data.choices[0].message.content);

// Validate against schema
const isValid = validateSchema(weatherData, weatherSchema);
if (!isValid) {
  throw new Error('Invalid response schema');
}
```

### Response Healing

**Automatically repair malformed JSON**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{
      role: 'user',
      content: 'Extract key information...'
    }],
    response_format: { type: 'json_object' },
    plugins: [{
      id: 'response-healing'  // Enable auto-repair
    }]
  })
});

const data = await response.json();
const content = data.choices[0].message.content;

// Parse JSON (will be valid even if model made errors)
const result = JSON.parse(content);
```

**Benefits**:
- Reduces parsing errors
- Fixes common JSON issues (missing quotes, trailing commas)
- Works with any model

---

## Web Search

### Simple :online Variant

**Easiest method**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet:online',
    messages: [{
      role: 'user',
      content: 'What are the latest AI developments in 2026?'
    }]
  })
});
```

**Works with free models**:
```typescript
{
  model: 'openai/gpt-oss-20b:free:online'
}
```

### Plugin Configuration

**Advanced web search**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'openrouter.ai/auto',
    plugins: [{
      id: 'web',
      enabled: true,
      max_results: 5,
      engine: 'exa'  // or 'native'
    }],
    messages: [{
      role: 'user',
      content: 'What\'s happening in AI today?'
    }]
  })
});
```

### Search Engines

**Native**: Provider's built-in search
- OpenAI, Anthropic, Perplexity, xAI

**Exa**: Third-party search API
- All other providers
- $4 per 1000 results

**Force Native**:
```typescript
{ plugins: [{ id: 'web', engine: 'native' }] }
```

**Force Exa**:
```typescript
{ plugins: [{ id: 'web', engine: 'exa' }] }
```

### Handling Citations

**Response with citations**:
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Latest AI developments include new models released in 2026. According to [OpenAI](https://openai.com), they launched GPT-4o...",
      "annotations": [{
        "type": "url_citation",
        "url_citation": {
          "url": "https://openai.com",
          "title": "OpenAI Blog",
          "start_index": 100,
          "end_index": 107
        }
      }]
    }
  }]
}
```

**Extract citations**:
```typescript
const message = data.choices[0].message;
const content = message.content;
const annotations = message.annotations || [];

for (const annotation of annotations) {
  if (annotation.type === 'url_citation') {
    const citation = annotation.url_citation;
    console.log('Source:', citation.url);
    console.log('Title:', citation.title);
    console.log('Position:', `${citation.start_index}-${citation.end_index}`);
  }
}
```

### Search Context Size

**Configure via web_search_options**:
```typescript
{
  web_search_options: {
    search_context_size: 'high'  // 'low' | 'medium' | 'high'
  }
}
```

**Effects**:
- `low`: Minimal context, lowest cost
- `medium`: Moderate context (default)
- `high`: Extensive context, higher cost

**User location**:
```typescript
{
  web_search_options: {
    user_location: {
      type: 'approximate',
      city: 'San Francisco',
      country: 'USA'
    }
  }
}
```

---

## Streaming

### Basic Streaming

**Enable streaming**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    stream: true
  })
});
```

**Process SSE stream**:
```typescript
let fullContent = '';
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

  for (const line of lines) {
    const data = line.slice(6); // Remove 'data: '
    if (data === '[DONE]') break;

    const parsed = JSON.parse(data);
    const content = parsed.choices?.[0]?.delta?.content;
    if (content) {
      fullContent += content;
      // Process incrementally...
      console.log(content);
    }

    // Usage in final chunk
    if (parsed.usage) {
      console.log('Usage:', parsed.usage);
    }
  }
}

console.log('Complete response:', fullContent);
```

### Streaming with Cancellation

**AbortController for cancellation**:
```typescript
const controller = new AbortController();

const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: '...' }],
    stream: true
  }),
  signal: controller.signal
});

// Process stream...

// Cancel stream
controller.abort();
```

**Handle cancellation**:
```typescript
try {
  await processStream(response);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Stream cancelled');
  } else {
    throw error;
  }
}
```

### Streaming Tool Calls

**Tool calls stream across multiple chunks**:
```typescript
let currentToolCall = null;
let toolArgs = '';
let isToolStreaming = false;

for await (const chunk of stream) {
  const parsed = JSON.parse(chunk);
  const delta = parsed.choices?.[0]?.delta;

  if (delta?.tool_calls) {
    for (const toolCallChunk of delta.tool_calls) {
      if (toolCallChunk.function?.name) {
        currentToolCall = { id: toolCallChunk.id, ...toolCallChunk.function };
        toolArgs = '';
        isToolStreaming = true;
      }

      if (toolCallChunk.function?.arguments) {
        toolArgs += toolCallChunk.function.arguments;
      }
    }
  }

  if (parsed.choices?.[0]?.finish_reason === 'tool_calls' && currentToolCall) {
    isToolStreaming = false;
    currentToolCall.arguments = toolArgs;

    console.log('Complete tool call:', currentToolCall);

    // Execute tool...
    const result = await executeTool(currentToolCall.name, JSON.parse(currentToolCall.arguments));

    // Send result back...
  }
}
```

### Streaming with Usage in Every Chunk

**Enable usage tracking**:
```typescript
{
  stream: true,
  stream_options: {
    include_usage: true  // Include usage in every chunk
  }
}
```

**Process usage**:
```typescript
for await (const chunk of stream) {
  const parsed = JSON.parse(chunk);

  // Content
  const content = parsed.choices?.[0]?.delta?.content;
  if (content) { /* ... */ }

  // Usage (in every chunk)
  if (parsed.usage) {
    console.log('Running usage:', parsed.usage);
  }
}
```

---

## Multimodal

### Image Input

**Vision model with image**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What\'s in this image?'
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://example.com/image.jpg',
            detail: 'high'  // 'low' | 'auto' | 'high'
          }
        }
      ]
    }]
  })
});
```

**Base64 encoded image**:
```typescript
{
  type: 'image_url',
  image_url: {
    url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
  }
}
```

**Detail levels**:
- `'low'`: Fastest, lowest resolution
- `'auto'`: Balanced (default)
- `'high'`: Slowest, highest resolution

### Audio Input

**Audio-capable model**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: [{
      role: 'user',
      content: [{
        type: 'input_audio',
        input_audio: {
          data: 'base64_encoded_audio...',
          format: 'mp3'  // mp3, wav, m4a, etc.
        }
      }]
    }]
  })
});
```

### Video Input

**Video-capable model**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'openai/gpt-4o',
    messages: [{
      role: 'user',
      content: [{
        type: 'input_video',
        video_url: {
          url: 'https://example.com/video.mp4'
        }
      }]
    }]
  })
});
```

### PDF Input

**Parse PDF with file-parser plugin**:
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { /* ... */ },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    plugins: [{
      id: 'file-parser',
      enabled: true,
      pdf: {
        engine: 'mistral-ocr'  // 'mistral-ocr' | 'pdf-text' | 'native'
      }
    }],
    messages: [{
      role: 'user',
      content: [{
        type: 'input_file',
        file_id: 'file_abc123'  // File ID from upload
      }]
    }]
  })
});
```

**PDF engines**:
- `'mistral-ocr'`: OCR with Mistral
- `'pdf-text'`: Text extraction
- `'native'`: Provider native

---

## Framework Integrations

### OpenAI SDK

**Basic setup**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://your-app.com',
    'X-Title': 'Your App'
  }
});

const completion = await openai.chat.completions.create({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Hello!' }]
});

console.log(completion.choices[0].message);
```

**Streaming with OpenAI SDK**:
```typescript
const stream = await openai.chat.completions.create({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    console.log(content);
  }
}
```

**Tool calling with OpenAI SDK**:
```typescript
const response = await openai.chat.completions.create({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'What\'s the weather?' }],
  tools: [/* tool definitions */],
  tool_choice: 'auto'
});

const toolCalls = response.choices[0].message.tool_calls;
if (toolCalls) {
  // Execute tools...
}
```

### @openrouter/sdk

**Official OpenRouter SDK**:
```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const completion = await openRouter.chat.send({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Hello!' }]
});

console.log(completion.choices[0].message);
```

**Streaming**:
```typescript
const stream = await openRouter.chat.send({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true
});

for await (const chunk of stream) {
  console.log(chunk.choices[0].delta.content);
}
```

---

## Advanced Patterns

### Retry with Backoff

**Robust retry logic**:
```typescript
async function requestWithRetry(options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });

      if (response.ok) {
        return await response.json();
      }

      // Retry on rate limit or server errors
      if (response.status === 429 || response.status >= 500) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        const jitter = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Batch Processing

**Process multiple requests in parallel**:
```typescript
async function batchProcess(prompts, model) {
  const batchSize = 5;  // Adjust based on rate limits
  const results = [];

  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    const batchPromises = batch.map(prompt =>
      fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { /* ... */ },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }]
        })
      }).then(r => r.json())
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Rate limiting delay if needed
    if (i + batchSize < prompts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
```

### Cost Tracking

**Track costs across requests**:
```typescript
let totalCost = 0;

async function trackCost(request) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { /* ... */ },
    body: JSON.stringify(request)
  });

  const data = await response.json();

  if (data.usage?.cost) {
    totalCost += data.usage.cost;
    console.log(`Request cost: $${data.usage.cost.toFixed(6)}`);
    console.log(`Total cost: $${totalCost.toFixed(6)}`);
  }

  return data;
}
```

---

## Quick Reference

### Tool Calling Pattern
1. Define tools
2. Request with tools
3. Check for tool_calls
4. Execute tools
5. Send results back
6. Repeat until final answer

### Structured Output Pattern
1. Define JSON Schema
2. Set response_format: { type: 'json_schema' }
3. Instruct model for JSON
4. Parse and validate response
5. Add response-healing plugin

### Web Search Pattern
1. Use :online variant (simplest)
2. Or use web plugin (advanced)
3. Handle citations in response
4. Configure search context as needed

### Streaming Pattern
1. Set stream: true
2. Read SSE stream
3. Parse each data: line
4. Extract delta content
5. Check for [DONE] marker

---

**Sources**:
- https://openrouter.ai/docs/guides/features/tool-calling.mdx
- https://openrouter.ai/docs/guides/features/structured-outputs.mdx
- https://openrouter.ai/docs/guides/features/plugins/web-search.mdx
- https://openrouter.ai/docs/api/reference/streaming.mdx
- https://openrouter.ai/docs/guides/overview/multimodal/images.mdx
