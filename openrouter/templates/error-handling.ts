/**
 * Error Handling with Retry Template
 * Robust error handling with exponential backoff and graceful degradation
 */

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
}

/**
 * Make request with retry logic and exponential backoff
 */
async function requestWithRetry(
  requestBody: any,
  options: RetryOptions = {}
): Promise<any> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    jitter = true
  } = options;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}/${maxRetries}...`);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Check response status
      if (response.ok) {
        console.log(`✅ Success on attempt ${attempt + 1}`);
        return await response.json();
      }

      // Parse error response
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Unknown error';
      const errorCode = errorData.error?.code || response.status;

      console.log(`❌ Error ${errorCode}: ${errorMessage}`);

      // Don't retry on client errors (except 408)
      if (response.status >= 400 && response.status < 500 &&
          response.status !== 408) {
        console.log('⛔ Client error - not retrying');
        throw new Error(errorMessage);
      }

      // Check if this was the last attempt
      if (attempt === maxRetries - 1) {
        console.log('⛔ Max retries exceeded');
        throw new Error(`Max retries (${maxRetries}) exceeded: ${errorMessage}`);
      }

      // Retryable error - wait and retry
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitterMs = jitter ? Math.random() * 1000 : 0;
      const totalDelay = delay + jitterMs;

      console.log(`⏳ Retry after ${Math.round(totalDelay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));

    } catch (error: any) {
      // Network error or fetch failed
      console.log(`❌ Request failed: ${error.message}`);

      // Check if last attempt
      if (attempt === maxRetries - 1) {
        console.log('⛔ Max retries exceeded');
        throw error;
      }

      // Network error - retry with backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitterMs = jitter ? Math.random() * 1000 : 0;
      const totalDelay = delay + jitterMs;

      console.log(`⏳ Retry after ${Math.round(totalDelay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }

  throw new Error('Unexpected error in retry loop');
}

/**
 * Request with graceful degradation (model fallbacks)
 */
async function requestWithDegradation(
  userMessage: string
): Promise<any> {
  console.log('🎯 Attempting with degradation strategies...\n');

  const strategies = [
    {
      name: 'Primary (Claude 3.5 Sonnet)',
      request: {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
        max_tokens: 1000
      }
    },
    {
      name: 'Fallback 1 (GPT-4o)',
      request: {
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
        max_tokens: 1000
      }
    },
    {
      name: 'Fallback 2 (Gemini 2.0 Flash)',
      request: {
        model: 'google/gemini-2.0-flash',
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
        max_tokens: 1000
      }
    },
    {
      name: 'Fallback 3 (Free model)',
      request: {
        model: 'google/gemini-2.0-flash:free',
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
        max_tokens: 500
      }
    }
  ];

  for (const strategy of strategies) {
    console.log(`📋 Trying: ${strategy.name}`);

    try {
      const result = await requestWithRetry(strategy.request, {
        maxRetries: 2,
        baseDelay: 500
      });

      console.log(`✅ Success with: ${strategy.name}`);
      console.log(`📊 Model used: ${result.model}`);
      console.log(`💰 Cost: $${result.usage?.cost?.toFixed(6) || 'N/A'}`);

      return {
        ...result,
        strategy: strategy.name
      };

    } catch (error: any) {
      console.log(`⚠️  Strategy failed: ${strategy.name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  throw new Error('All degradation strategies failed');
}

/**
 * Handle specific error types
 */
function handleErrorResponse(errorData: any): void {
  const code = errorData.error?.code;
  const message = errorData.error?.message;
  const metadata = errorData.error?.metadata;

  console.log('\n' + '─'.repeat(60));
  console.log('🚨 ERROR DETAILS');
  console.log('─'.repeat(60));

  console.log(`Status Code: ${code}`);
  console.log(`Message: ${message}`);

  if (metadata) {
    console.log('\n📋 Metadata:');
    for (const [key, value] of Object.entries(metadata)) {
      console.log(`   ${key}: ${value}`);
    }
  }

  // Specific error handling
  switch (code) {
    case 400:
      console.log('\n💡 Fix: Check request structure and parameters');
      break;

    case 401:
      console.log('\n💡 Fix: Verify API key is valid and set correctly');
      break;

    case 402:
      console.log('\n💡 Fix: Add credits to your OpenRouter account');
      break;

    case 403:
      console.log('\n💡 Fix: Check permissions and guardrails settings');
      break;

    case 429:
      console.log('\n💡 Fix: Implement rate limiting, use retry logic');
      if (metadata?.reset) {
        console.log(`   Rate limit resets at: ${metadata.reset}`);
      }
      break;

    case 502:
    case 503:
      console.log('\n💡 Fix: Use model fallbacks, retry with backoff');
      break;

    default:
      console.log('\n💡 Fix: Check error message and metadata for guidance');
  }
}

// Example usage
async function main() {
  console.log('🔧 Error Handling Example\n' + '─'.repeat(60));

  try {
    // Example 1: Basic request with retry
    console.log('\n📍 Example 1: Basic request with retry');
    const result = await requestWithRetry({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    console.log('✅ Success:', result.choices[0].message.content);

  } catch (error: any) {
    console.error('❌ Final error:', error.message);
  }

  console.log('\n' + '─'.repeat(60));

  try {
    // Example 2: Graceful degradation with model fallbacks
    console.log('\n📍 Example 2: Graceful degradation');
    const degradedResult = await requestWithDegradation(
      'Explain quantum computing simply'
    );
    console.log('✅ Final result:', degradedResult.choices[0].message.content);

  } catch (error: any) {
    console.error('❌ All strategies failed:', error.message);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('✅ Error handling example complete');
}

// Uncomment to run
// main();
