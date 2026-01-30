/**
 * Basic OpenRouter API Request Template
 * Minimal working example for simple chat completions
 */

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

async function basicChatCompletion(userMessage: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Optional: App attribution
      'HTTP-Referer': 'https://your-app.com',
      'X-Title': 'Your App Name'
    },
    body: JSON.stringify({
      // Use a good default model
      model: 'anthropic/claude-3.5-sonnet',

      // Conversation history
      messages: [
        { role: 'user', content: userMessage }
      ],

      // Sampling parameters (adjust based on needs)
      temperature: 0.6,     // Balanced creativity
      top_p: 0.95,          // Common for quality
      max_tokens: 1000,      // Control cost and length

      // Optional: Metadata for tracking
      user: 'user-123',
      session_id: 'session-abc',
      metadata: {
        application: 'my-app',
        version: '1.0.0'
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error.message}`);
  }

  const data = await response.json();

  // Extract response
  const content = data.choices[0].message.content;
  const finishReason = data.choices[0].finish_reason;
  const usage = data.usage;
  const actualModel = data.model;

  console.log('Model used:', actualModel);
  console.log('Finish reason:', finishReason);
  console.log('Response:', content);
  console.log('Usage:', usage);

  return {
    content,
    finishReason,
    usage,
    model: actualModel
  };
}

// Example usage
async function main() {
  try {
    const result = await basicChatCompletion('What is the meaning of life?');
    console.log('Success:', result.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uncomment to run
// main();
