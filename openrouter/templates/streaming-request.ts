/**
 * Streaming Response Template
 * SSE streaming with cancellation support and error handling
 */

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

interface StreamChunk {
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
      tool_calls?: any[];
    };
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
}

async function streamingChatCompletion(userMessage: string) {
  // AbortController for cancellation
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 60000); // 60 second timeout

  try {
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
        stream: true,
        // Include usage in every chunk
        stream_options: {
          include_usage: true
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error.message}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let totalTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        // Skip empty lines and comments
        if (!line.trim() || line.startsWith(':')) continue;

        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          // End of stream
          if (data === '[DONE]') break;

          try {
            const parsed: StreamChunk = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            const usage = parsed.usage;

            // Accumulate content
            if (content) {
              fullContent += content;
              // Stream to stdout (or your UI)
              process.stdout.write(content);
            }

            // Track usage
            if (usage) {
              totalTokens = usage.total_tokens;
            }

            // Check for finish
            if (parsed.choices?.[0]?.finish_reason) {
              console.log('\n\nFinish reason:', parsed.choices[0].finish_reason);
            }
          } catch (parseError) {
            console.error('Parse error:', parseError);
          }
        }
      }
    }

    console.log('\n\nComplete response received');
    console.log('Total tokens:', totalTokens);

    return {
      content: fullContent,
      totalTokens
    };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Stream cancelled by timeout');
      throw new Error('Stream timeout');
    }
    throw error;
  }
}

// Example usage with cancellation
async function main() {
  try {
    const result = await streamingChatCompletion('Tell me a story about AI');
    console.log('\nFinal content:', result.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// For manual cancellation:
// const controller = new AbortController();
// signal: controller.signal in fetch options
// controller.abort(); // Cancel stream

// Uncomment to run
// main();
