/**
 * Tool Calling Template
 * Complete agentic loop with automatic tool execution
 */

import { evaluate } from 'mathjs';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

interface Tool {
  name: string;
  description: string;
  parameters: any;
}

// Define available tools
const tools: Tool[] = [
  {
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
  },
  {
    name: 'search_database',
    description: 'Search database for records',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query'
        },
        limit: {
          type: 'integer',
          description: 'Maximum results to return',
          default: 10
        }
      },
      required: ['query']
    }
  },
  {
    name: 'calculate',
    description: 'Perform mathematical calculations',
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
  }
];

// Execute tools
async function executeTool(name: string, args: any) {
  console.log(`\n🔧 Executing tool: ${name}`);
  console.log('   Args:', args);

  switch (name) {
    case 'get_weather':
      // Simulate weather API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return {
        location: args.location,
        temperature: 22,
        conditions: 'Sunny',
        humidity: 45
      };

    case 'search_database':
      // Simulate database search
      await new Promise(resolve => setTimeout(resolve, 150));
      return {
        query: args.query,
        results: [
          { id: 1, title: `Result for ${args.query}` },
          { id: 2, title: `Another result for ${args.query}` }
        ]
      };

    case 'calculate':
      try {
        const result = evaluate(args.expression);

        await new Promise(resolve => setTimeout(resolve, 50));
        return {
          expression: args.expression,
          result
        };
      } catch (error) {
        return {
          error: 'Invalid expression',
          expression: args.expression
        };
      }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Main agentic loop
async function runAgenticLoop(userMessage: string, maxIterations = 10) {
  let messages: any[] = [
    { role: 'user', content: userMessage }
  ];

  console.log('🤖 Starting agentic loop...');
  console.log('User:', userMessage);
  console.log('─'.repeat(60));

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    console.log(`\n📍 Iteration ${iteration + 1}/${maxIterations}`);

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
        tools: tools.map(tool => ({
          type: 'function',
          function: tool
        })),
        tool_choice: 'auto',
        parallel_tool_calls: true  // Allow parallel tool calls
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error.message}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message;
    messages.push(assistantMessage);

    // Check if done (no tool calls)
    if (!assistantMessage.tool_calls) {
      console.log('\n✅ Agentic loop complete');
      console.log('─'.repeat(60));
      console.log('Final answer:', assistantMessage.content);
      return {
        content: assistantMessage.content,
        iterations: iteration + 1
      };
    }

    // Tool calls detected
    console.log(`🔨 Model requested ${assistantMessage.tool_calls.length} tool(s)`);

    // Execute tools (parallel)
    const toolResults = await Promise.all(
      assistantMessage.tool_calls.map(async (toolCall: any) => {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args);
        const result = await executeTool(name, parsedArgs);

        console.log(`✅ Tool result:`, result);

        return {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        };
      })
    );

    // Add tool results to message history
    messages.push(...toolResults);
  }

  throw new Error(`Agentic loop exceeded max iterations (${maxIterations})`);
}

// Example usage
async function main() {
  try {
    const result = await runAgenticLoop(
      'What is the weather in Tokyo, and what is 15 + 27, and search for AI news?',
      10
    );

    console.log('\n\n📊 Summary:');
    console.log('- Iterations:', result.iterations);
    console.log('- Content:', result.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Uncomment to run
// main();
