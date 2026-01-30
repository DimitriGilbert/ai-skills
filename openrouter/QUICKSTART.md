# Quick Start

Get started with OpenRouter API in 5 minutes.

---

## Step 1: Get API Key (1 minute)

1. Go to https://openrouter.ai
2. Sign up or log in
3. Navigate to Keys page
4. Click "Create new key"
5. Copy your API key (starts with `sk-or-`)

---

## Step 2: Set Environment Variable (30 seconds)

```bash
# Linux/macOS
export OPENROUTER_API_KEY=sk-or-your-key-here

# Windows (PowerShell)
$env:OPENROUTER_API_KEY="sk-or-your-key-here"

# Or add to your shell profile (~/.bashrc, ~/.zshrc)
echo 'export OPENROUTER_API_KEY=sk-or-your-key-here' >> ~/.bashrc
source ~/.bashrc
```

---

## Step 3: Test Your Setup (30 seconds)

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

You should see a JSON response with a message from Claude.

---

## Step 4: Use Templates (2 minutes)

Browse the templates directory for ready-to-use code:

| Template | Use Case |
|----------|----------|
| `basic-request.ts` | Simple chat completions |
| `streaming-request.ts` | Real-time streaming responses |
| `tool-calling.ts` | Agentic systems with external functions |
| `structured-output.ts` | JSON Schema enforcement |
| `error-handling.ts` | Retry logic and graceful degradation |
| `model-selection.ts` | Intelligent model selection |

**Run any template**:
```bash
node templates/basic-request.ts
```

---

## Step 5: Explore Documentation (ongoing)

For detailed information, see:

- **Main skill**: `SKILL.md` - Core API usage
- **Parameters**: `references/PARAMETERS.md` - Complete parameter reference
- **Error handling**: `references/ERROR_CODES.md` - Error codes and strategies
- **Model selection**: `references/MODEL_SELECTION.md` - Choose the right model
- **Routing**: `references/ROUTING_STRATEGIES.md` - Configure fallbacks and providers
- **Advanced patterns**: `references/ADVANCED_PATTERNS.md` - Tools, streaming, structured outputs
- **Examples**: `references/EXAMPLES.md` - Working code in multiple languages

---

## Common Tasks

### Make a Simple Chat Request

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Enable Streaming

Add `stream: true` to your request:
```typescript
{ stream: true }
```

### Use Web Search

Use the `:online` model variant:
```typescript
{ model: 'anthropic/claude-3.5-sonnet:online' }
```

### Add Model Fallbacks

Provide an array of models:
```typescript
{
  models: [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o',
    'google/gemini-2.0-flash'
  ]
}
```

---

## Quick Reference

| Want to | Use |
|----------|------|
| Chat with AI | `SKILL.md` - API Basics section |
| Stream responses | `templates/streaming-request.ts` |
| Use tools/functions | `templates/tool-calling.ts` |
| Get structured JSON | `templates/structured-output.ts` |
| Choose a model | `SKILL.md` - Model Selection section |
| Handle errors | `references/ERROR_CODES.md` |
| Configure routing | `references/ROUTING_STRATEGIES.md` |

---

## Default Model Recommendations

| Task | Recommended Model |
|------|------------------|
| General purpose | `anthropic/claude-3.5-sonnet` |
| Coding | `anthropic/claude-3.5-sonnet` |
| Complex reasoning | `anthropic/claude-opus-4` |
| Fast responses | `google/gemini-2.0-flash:nitro` |
| Cost-effective | `google/gemini-2.0-flash` |
| Free tier | `google/gemini-2.0-flash:free` |
| Current info | `anthropic/claude-3.5-sonnet:online` |

---

## Next Steps

1. **Review SKILL.md** for complete API usage patterns
2. **Explore templates** for ready-to-use code
3. **Check reference docs** for deep dives into specific features
4. **Start building** with the patterns that match your use case

---

**Need help?**
- OpenRouter docs: https://openrouter.ai/docs
- Discord: https://openrouter.ai/discord
- Support: support@openrouter.ai
