# Working Examples

Complete, working code examples for common OpenRouter API usage patterns in TypeScript and Python.

**Source**: https://openrouter.ai/docs/quickstart

---

## TypeScript Examples

### Basic Chat Completion

**Simple request**:
```typescript
const apiKey = process.env.OPENROUTER_API_KEY;

async function chatCompletion(userMessage: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  console.log('Response:', content);

  return content;
}

// Usage
chatCompletion('What is the meaning of life?');
```

### Streaming Response

**Process SSE stream**:
```typescript
async function streamingChat(userMessage: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'user', content: userMessage }
      ],
      stream: true
    })
  });

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') break;

      const parsed = JSON.parse(data);
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) {
        fullContent += content;
        process.stdout.write(content);  // Stream to console
      }

      if (parsed.usage) {
        console.log('\nUsage:', parsed.usage);
      }
    }
  }

  console.log('\nComplete:', fullContent);
  return fullContent;
}

// Usage
streamingChat('Tell me a short story');
```

### Tool Calling with Agentic Loop

**Complete tool calling example**:
```typescript
interface Tool {
  name: string;
  description: string;
  parameters: object;
}

const tools: Tool[] = [{
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
}, {
  name: 'calculate',
  description: 'Perform a calculation',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate'
      }
    },
    required: ['expression']
  }
}];

async function executeTool(name: string, args: any) {
  console.log(`Executing tool: ${name}`, args);

  switch (name) {
    case 'get_weather':
      return { location: args.location, temperature: 22, conditions: 'Sunny' };

    case 'calculate':
      try {
        const result = eval(args.expression);
        return { expression: args.expression, result };
      } catch (error) {
        return { error: 'Invalid expression' };
      }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function runAgent(userMessage: string, maxIterations = 5) {
  let messages = [{ role: 'user', content: userMessage }];

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: messages,
        tools: tools.map(tool => ({
          type: 'function',
          function: tool
        })),
        tool_choice: 'auto',
        parallel_tool_calls: true
      })
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message;
    messages.push(assistantMessage);

    if (!assistantMessage.tool_calls) {
      console.log('Final answer:', assistantMessage.content);
      return assistantMessage.content;
    }

    console.log(`Iteration ${iteration + 1}: ${assistantMessage.tool_calls.length} tools called`);

    // Execute tools
    const toolResults = await Promise.all(
      assistantMessage.tool_calls.map(async (toolCall) => {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args);
        const result = await executeTool(name, parsedArgs);

        return {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        };
      })
    );

    messages.push(...toolResults);
  }

  throw new Error('Max iterations exceeded');
}

// Usage
runAgent('What is the weather in Tokyo and what is 15 + 27?');
```

### Structured Output

**JSON Schema enforcement**:
```typescript
interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
}

async function getStructuredWeather(location: string): Promise<WeatherData> {
  const schema = {
    type: 'object',
    properties: {
      location: { type: 'string' },
      temperature: { type: 'number' },
      conditions: { type: 'string' },
      humidity: { type: 'number' }
    },
    required: ['location', 'temperature', 'conditions', 'humidity'],
    additionalProperties: false
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{
        role: 'user',
        content: `What is the weather in ${location}? Respond with JSON.`
      }],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'weather',
          strict: true,
          schema: schema
        }
      },
      plugins: [{
        id: 'response-healing'
      }]
    })
  });

  const data = await response.json();
  const weatherData = JSON.parse(data.choices[0].message.content);

  console.log('Weather data:', weatherData);
  return weatherData;
}

// Usage
getStructuredWeather('San Francisco');
```

### Web Search Integration

**Using :online variant**:
```typescript
async function webSearchQuery(query: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet:online',
      messages: [{
        role: 'user',
        content: query
      }]
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Extract citations
  const annotations = data.choices[0].message.annotations || [];
  console.log('Response:', content);
  console.log('Citations:', annotations);

  return { content, annotations };
}

// Usage
webSearchQuery('What are the latest AI developments in 2026?');
```

### Image Understanding

**Multimodal with image**:
```typescript
async function analyzeImage(imageUrl: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image in detail.' },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'high'
            }
          }
        ]
      }]
    })
  });

  const data = await response.json();
  const description = data.choices[0].message.content;

  console.log('Image description:', description);
  return description;
}

// Usage
analyzeImage('https://example.com/image.jpg');
```

### Model Fallbacks

**Automatic failover**:
```typescript
async function requestWithFallbacks(userMessage: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      models: [
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4o',
        'google/gemini-2.0-flash'
      ],
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  const data = await response.json();
  const actualModel = data.model;
  const content = data.choices[0].message.content;

  console.log(`Used model: ${actualModel}`);
  console.log('Response:', content);

  return { content, model: actualModel };
}

// Usage
requestWithFallbacks('Explain quantum computing');
```

### Error Handling with Retry

**Robust error handling**:
```typescript
async function requestWithRetry(
  body: any,
  maxRetries = 3
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        return await response.json();
      }

      // Don't retry client errors (except 408)
      if (response.status >= 400 && response.status < 500 &&
          response.status !== 408) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      // Retry on rate limit or server errors
      if (response.status === 429 || response.status >= 500) {
        if (attempt === maxRetries - 1) {
          const error = await response.json();
          throw new Error(`Max retries: ${error.error.message}`);
        }

        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        const jitter = Math.random() * 1000;
        console.log(`Retry ${attempt + 1} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
        continue;
      }
    } catch (error: any) {
      if (attempt === maxRetries - 1) throw error;

      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`Network error, retry ${attempt + 1} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

// Usage
const result = await requestWithRetry({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(result.choices[0].message.content);
```

### OpenAI SDK Integration

**Using OpenAI SDK**:
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

async function chatWithOpenAISDK(message: string) {
  const completion = await openai.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: message }],
    temperature: 0.7,
    max_tokens: 500
  });

  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

// Usage
chatWithOpenAISDK('What is the meaning of life?');
```

---

## Python Examples

### Basic Chat Completion

```python
import requests
import json

api_key = "your-openrouter-api-key"

def chat_completion(user_message):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    response = requests.post(url, headers=headers, json=data)
    result = response.json()

    content = result["choices"][0]["message"]["content"]
    print("Response:", content)

    return content

# Usage
chat_completion("What is the meaning of life?")
```

### Streaming Response

```python
import requests

def streaming_chat(user_message):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
            {"role": "user", "content": user_message}
        ],
        "stream": True
    }

    response = requests.post(url, headers=headers, json=data, stream=True)

    full_content = ""

    for line in response.iter_lines():
        if line.startswith("data: "):
            data_str = line[6:]
            if data_str == "[DONE]":
                break

            parsed = json.loads(data_str)
            content = parsed.get("choices", [{}])[0].get("delta", {}).get("content")
            if content:
                full_content += content
                print(content, end="", flush=True)

            if "usage" in parsed:
                print("\nUsage:", parsed["usage"])

    print("\nComplete:", full_content)
    return full_content

# Usage
streaming_chat("Tell me a short story")
```

### Tool Calling

```python
import requests
import json

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
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    }
]

def execute_tool(name, args):
    print(f"Executing tool: {name}", args)

    if name == "get_weather":
        return {"location": args["location"], "temperature": 22, "conditions": "Sunny"}

    raise Exception(f"Unknown tool: {name}")

def run_agent(user_message, max_iterations=5):
    messages = [{"role": "user", "content": user_message}]

    for iteration in range(max_iterations):
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "anthropic/claude-3.5-sonnet",
                "messages": messages,
                "tools": tools,
                "tool_choice": "auto",
                "parallel_tool_calls": True
            }
        )

        data = response.json()
        assistant_message = data["choices"][0]["message"]
        messages.append(assistant_message)

        if "tool_calls" not in assistant_message:
            print("Final answer:", assistant_message["content"])
            return assistant_message["content"]

        print(f"Iteration {iteration + 1}: {len(assistant_message['tool_calls'])} tools called")

        # Execute tools
        for tool_call in assistant_message["tool_calls"]:
            name = tool_call["function"]["name"]
            args = json.loads(tool_call["function"]["arguments"])
            result = execute_tool(name, args)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call["id"],
                "content": json.dumps(result)
            })

    raise Exception("Max iterations exceeded")

# Usage
run_agent("What is the weather in Tokyo?")
```

### Structured Output

```python
import requests
import json

def get_structured_weather(location):
    schema = {
        "type": "object",
        "properties": {
            "location": {"type": "string"},
            "temperature": {"type": "number"},
            "conditions": {"type": "string"},
            "humidity": {"type": "number"}
        },
        "required": ["location", "temperature", "conditions", "humidity"],
        "additionalProperties": False
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "anthropic/claude-3.5-sonnet",
            "messages": [{
                "role": "user",
                "content": f"What is the weather in {location}? Respond with JSON."
            }],
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "weather",
                    "strict": True,
                    "schema": schema
                }
            },
            "plugins": [{
                "id": "response-healing"
            }]
        }
    )

    data = response.json()
    weather_data = json.loads(data["choices"][0]["message"]["content"])

    print("Weather data:", weather_data)
    return weather_data

# Usage
get_structured_weather("San Francisco")
```

### OpenAI SDK (Python)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)

def chat_with_openai_sdk(message):
    completion = client.chat.completions.create(
        model="anthropic/claude-3.5-sonnet",
        messages=[{"role": "user", "content": message}],
        temperature=0.7,
        max_tokens=500
    )

    print(completion.choices[0].message.content)
    return completion.choices[0].message.content

# Usage
chat_with_openai_sdk("What is the meaning of life?")
```

---

## cURL Examples

### Basic Request

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Streaming

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {"role": "user", "content": "Tell me a story"}
    ],
    "stream": true
  }'
```

### With Tools

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {"role": "user", "content": "What'\''s the weather?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get weather for location",
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
    ],
    "tool_choice": "auto"
  }'
```

### With Web Search

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet:online",
    "messages": [
      {"role": "user", "content": "What'\''s happening in AI today?"}
    ]
  }'
```

---

## Quick Reference

### Common Patterns

| Pattern | Key Parameters | When to Use |
|---------|----------------|--------------|
| Basic chat | model, messages, temperature, max_tokens | Simple requests |
| Streaming | stream: true | Real-time responses |
| Tool calling | tools, tool_choice, parallel_tool_calls | External functions |
| Structured output | response_format: { type: 'json_schema' } | API responses, data extraction |
| Web search | model: 'xxx:online' or plugins: [{ id: 'web' }] | Current information |
| Image input | content: [{ type: 'image_url', ... }] | Vision tasks |
| Model fallbacks | models: [...] | Reliability |
| Retry logic | Exponential backoff | Error handling |

---

**Sources**:
- https://openrouter.ai/docs/quickstart
- https://openrouter.ai/docs/api/reference/overview.mdx
