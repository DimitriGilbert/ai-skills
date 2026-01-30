# Code Examples

Complete working examples in multiple programming languages demonstrating how to use the OpenRouter API.

**Sources**: Various OpenRouter documentation pages

## Prerequisites

### Get API Key

1. Sign up at https://openrouter.ai
2. Navigate to https://openrouter.ai/keys
3. Create new API key
4. Store in environment variable

### Install Dependencies

**Python**:
```bash
pip install openai requests
```

**TypeScript/JavaScript**:
```bash
npm install openai
# or
npm install @openrouter/sdk
```

## Python Examples

### Basic Chat Completion (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

response = client.chat.completions.create(
  model="openai/gpt-4",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  max_tokens=100
)

print(response.choices[0].message.content)
```

### Streaming Chat Completion (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

stream = client.chat.completions.create(
  model="openai/gpt-4",
  messages=[
    {"role": "user", "content": "Tell me a short story"}
  ],
  stream=True
)

for chunk in stream:
  if chunk.choices[0].delta.content:
    print(chunk.choices[0].delta.content, end="", flush=True)
```

### Tool Calling (OpenAI SDK)

```python
from openai import OpenAI
import json

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

tools = [
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
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit"
          }
        },
        "required": ["location"]
      }
    }
  }
]

response = client.chat.completions.create(
  model="anthropic/claude-3.5-sonnet",
  messages=[{"role": "user", "content": "What's the weather in San Francisco?"}],
  tools=tools
)

if response.choices[0].message.tool_calls:
  for tool_call in response.choices[0].message.tool_calls:
    print(f"Tool: {tool_call.function.name}")
    print(f"Args: {tool_call.function.arguments}")
else:
  print(response.choices[0].message.content)
```

### Structured Outputs (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

response = client.chat.completions.create(
  model="openai/gpt-4",
  messages=[
    {"role": "user", "content": "Extract name and age from: John is 30 years old"}
  ],
  response_format={
    "type": "json_schema",
    "json_schema": {
      "name": "person_info",
      "strict": True,
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "age": {"type": "number"}
        },
        "required": ["name", "age"],
        "additionalProperties": False
      }
    }
  }
)

print(response.choices[0].message.content)
```

### Raw API Requests (requests Library)

```python
import requests
import json

# Chat completion
response = requests.post(
  "https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
    "Content-Type": "application/json"
  },
  json={
    "model": "openai/gpt-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }
)

data = response.json()
print(data["choices"][0]["message"]["content"])
```

### List Models

```python
import requests

response = requests.get(
  "https://openrouter.ai/api/v1/models",
  headers={
    "Authorization": "Bearer YOUR_OPENROUTER_API_KEY"
  }
)

models = response.json()["data"]
for model in models[:5]:  # Print first 5
  print(f"{model['id']}: {model['name']}")
```

### Embeddings

```python
import requests

response = requests.post(
  "https://openrouter.ai/api/v1/embeddings",
  headers={
    "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
    "Content-Type": "application/json"
  },
  json={
    "model": "openai/text-embedding-3-small",
    "input": "The quick brown fox jumps over the lazy dog"
  }
)

data = response.json()
embedding = data["data"][0]["embedding"]
print(f"Embedding dimension: {len(embedding)}")
```

### Get Credits

```python
import requests

response = requests.get(
  "https://openrouter.ai/api/v1/credits",
  headers={
    "Authorization": "Bearer YOUR_OPENROUTER_API_KEY"
  }
}

data = response.json()
print(f"Total Credits: ${data['data']['total_credits']}")
print(f"Total Usage: ${data['data']['total_usage']}")
```

### Web Search

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

response = client.chat.completions.create(
  model="google/gemini-pro:online",  # Online variant
  messages=[
    {"role": "user", "content": "What's the latest news about AI?"}
  ]
)

print(response.choices[0].message.content)
```

### Model Fallbacks

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_OPENROUTER_API_KEY"
)

response = client.chat.completions.create(
  model="openai/gpt-4",
  extra_body={
    "models": [
      "openai/gpt-4",
      "anthropic/claude-3.5-sonnet",
      "google/gemini-2.5-pro"
    ]
  },
  messages=[
    {"role": "user", "content": "Hello!"}
  ]
)

print(response.choices[0].message.content)
```

### Streaming with Error Handling

```python
import requests

response = requests.post(
  "https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
    "Content-Type": "application/json"
  },
  json={
    "model": "openai/gpt-4",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": True
  },
  stream=True
)

try:
  for line in response.iter_lines():
    if line.startswith('data: '):
      data = line[6:]
      if data == '[DONE]':
        break
      chunk = json.loads(data)
      if 'error' in chunk:
        print(f"Stream error: {chunk['error']['message']}")
        break
      content = chunk.get('choices', [{}])[0].get('delta', {}).get('content')
      if content:
        print(content, end='', flush=True)
except Exception as e:
  print(f"Error: {e}")
```

## TypeScript Examples

### Basic Chat Completion (OpenAI SDK)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' }
    ],
    max_tokens: 100,
  });

  console.log(completion.choices[0].message.content);
}

main().catch(console.error);
```

### Streaming Chat Completion (OpenAI SDK)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function streamChat() {
  const stream = await openai.chat.completions.create({
    model: 'openai/gpt-4',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      process.stdout.write(content);
    }
  }
}

streamChat().catch(console.error);
```

### Tool Calling (OpenAI SDK)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function callWithTools() {
  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: "What's the weather in SF?" }],
    tools: [
      {
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
      }
    ]
  });

  const toolCalls = response.choices[0].message.tool_calls;
  if (toolCalls) {
    for (const toolCall of toolCalls) {
      console.log(`Tool: ${toolCall.function.name}`);
      console.log(`Args: ${toolCall.function.arguments}`);
      // Execute tool and send result back...
    }
  } else {
    console.log(response.choices[0].message.content);
  }
}

callWithTools().catch(console.error);
```

### Structured Outputs (OpenAI SDK)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function getStructuredOutput() {
  const response = await openai.chat.completions.create({
    model: 'openai/gpt-4',
    messages: [{ 
      role: 'user', 
      content: 'Extract name and age from: John is 30 years old' 
    }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'person_info',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' }
          },
          required: ['name', 'age'],
          additionalProperties: false
        }
      }
    }
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  console.log(result);
}

getStructuredOutput().catch(console.error);
```

### OpenRouter TypeScript SDK

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function basicChat() {
  const completion = await openRouter.chat.send({
    model: 'openai/gpt-4',
    messages: [{ role: 'user', 'content': 'Hello!' }],
  });

  console.log(completion.choices[0].message.content);
}

basicChat().catch(console.error);
```

### Streaming (OpenRouter SDK)

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function streamChat() {
  const stream = await openRouter.chat.send({
    model: 'openai/gpt-4',
    messages: [{ role: 'user', 'content': 'Tell me a story' }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      console.log(content);
    }
  }
}

streamChat().catch(console.error);
```

### Raw Fetch API

```typescript
async function chatWithFetch() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4',
      messages: [{ role: 'user', 'content': 'Hello!' }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

chatWithFetch().catch(console.error);
```

### Streaming with Fetch

```typescript
async function streamWithFetch() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4',
      messages: [{ role: 'user', 'content': 'Tell me a story' }],
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const lineEnd = buffer.indexOf('\n');
        if (lineEnd === -1) break;

        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);

        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const chunk = JSON.parse(data);
            if ('error' in chunk) {
              console.error('Stream error:', chunk.error.message);
              return;
            }
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) console.log(content);
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

streamWithFetch().catch(console.error);
```

### Model Fallbacks

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function chatWithFallbacks() {
  const completion = await openRouter.chat.send({
    models: [
      'openai/gpt-4',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-2.5-pro'
    ],
    messages: [{ role: 'user', 'content': 'Hello!' }],
  });

  console.log(`Used model: ${completion.model}`);
  console.log(completion.choices[0].message.content);
}

chatWithFallbacks().catch(console.error);
```

### Web Search

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function chatWithWebSearch() {
  const response = await openai.chat.completions.create({
    model: 'google/gemini-pro:online',
    messages: [{ role: 'user', 'content': "What's the latest AI news?" }],
  });

  console.log(response.choices[0].message.content);
  
  // Check for web search citations
  if (response.choices[0].message.annotations) {
    console.log('Citations:', response.choices[0].message.annotations);
  }
}

chatWithWebSearch().catch(console.error);
```

## cURL Examples

### Basic Request

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "openai/gpt-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Streaming

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "openai/gpt-4",
    "messages": [
      {"role": "user", "content": "Tell me a story"}
    ],
    "stream": true
  }'
```

### Structured Output

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "openai/gpt-4",
    "messages": [
      {"role": "user", "content": "Extract name and age from: John is 30"}
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "person_info",
        "strict": true,
        "schema": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "age": {"type": "number"}
          },
          "required": ["name", "age"],
          "additionalProperties": false
        }
      }
    }
  }'
```

### With Web Search

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "google/gemini-pro:online",
    "messages": [
      {"role": "user", "content": "What'\''s the latest news?"}
    ]
  }'
```

### Tool Calling

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {"role": "user", "content": "What'\''s the weather in SF?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get current weather",
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
    ]
  }'
```

### List Models

```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY"
```

### Get Credits

```bash
curl https://openrouter.ai/api/v1/credits \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY"
```

## Advanced Examples

### Agentic Loop (TypeScript)

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

const tools = [
  {
    type: 'function',
    function: {
      name: 'search_database',
      description: 'Search database for information',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        },
        required: ['query']
      }
    }
  }
];

async function executeTool(name: string, args: any) {
  // Implement your tool execution logic
  console.log(`Executing ${name} with`, args);
  return { result: 'Data found' };
}

async function agenticLoop(userMessage: string) {
  const messages = [
    { role: 'user', content: userMessage }
  ];

  const maxIterations = 10;
  for (let i = 0; i < maxIterations; i++) {
    const response = await openRouter.chat.send({
      model: 'anthropic/claude-3.5-sonnet',
      messages,
      tools,
    });

    messages.push(response.choices[0].message);

    const toolCalls = response.choices[0].message.tool_calls;
    if (!toolCalls) {
      // No more tool calls, we're done
      console.log('Final answer:', response.choices[0].message.content);
      break;
    }

    // Execute all tool calls
    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.function.arguments);
      const result = await executeTool(toolCall.function.name, args);
      
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }
  }
}

agenticLoop('Find information about Python programming').catch(console.error);
```

### Multimodal Input

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function analyzeImage() {
  const response = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What'\''s in this image?' },
          {
            type: 'image_url',
            image_url: {
              url: 'https://example.com/image.jpg',
              detail: 'high'
            }
          }
        ]
      }
    ]
  });

  console.log(response.choices[0].message.content);
}

analyzeImage().catch(console.error);
```

### Provider Routing

```typescript
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function chatWithProviderRouting() {
  const completion = await openRouter.chat.send({
    model: 'openai/gpt-4',
    messages: [{ role: 'user', 'content': 'Hello!' }],
    provider: {
      order: ['openai', 'anthropic'],
      allow_fallbacks: true,
      data_collection: 'deny',
      sort: 'price'
    }
  });

  console.log(completion.choices[0].message.content);
}

chatWithProviderRouting().catch(console.error);
```

### Semantic Search with Embeddings

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function semanticSearch(query: string, documents: string[]) {
  // Generate embeddings for query and documents
  const response = await openai.embeddings.create({
    model: 'openai/text-embedding-3-small',
    input: [query, ...documents]
  });

  const queryEmbedding = response.data[0].embedding;
  const docEmbeddings = response.data.slice(1);

  // Calculate similarity and rank results
  const results = documents.map((doc, i) => ({
    document: doc,
    similarity: cosineSimilarity(queryEmbedding, docEmbeddings[i].embedding)
  }));

  results.sort((a, b) => b.similarity - a.similarity);
  
  return results;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

semanticSearch('cats', ['Dogs', 'Cats', 'Birds']).then(console.log);
```

### Error Handling

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});

async function safeChat(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific errors
    if (error.status === 402) {
      console.log('Payment required - add credits');
    } else if (error.status === 429) {
      console.log('Rate limited - implement backoff');
    } else if (error.status === 403) {
      console.log('Content moderated - modify request');
    }
    
    throw error;
  }
}

safeChat('Hello!').catch(console.error);
```

## Summary

| Language | SDK | Example |
|----------|-----|---------|
| Python | OpenAI | Basic, Streaming, Tools, Structured |
| Python | requests | Raw API, Embeddings |
| TypeScript | OpenAI | Basic, Streaming, Tools, Structured |
| TypeScript | @openrouter/sdk | Basic, Streaming, Fallbacks |
| cURL | N/A | All features |

**Sources**:
- https://openrouter.ai/docs/api/reference/overview.mdx
- https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request.mdx
- https://openrouter.ai/docs/guides/features/tool-calling.mdx
- https://openrouter.ai/docs/guides/features/structured-outputs.mdx
- https://openrouter.ai/docs/api/reference/streaming.mdx
