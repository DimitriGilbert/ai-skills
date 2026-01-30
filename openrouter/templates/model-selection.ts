/**
 * Model Selection Template
 * Helper functions for selecting appropriate models based on requirements
 */

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

interface ModelRequirements {
  task?: 'general' | 'coding' | 'reasoning' | 'creative' | 'summarization' | 'translation';
  priority?: 'quality' | 'speed' | 'cost';
  needsCurrentInfo?: boolean;
  largeContext?: boolean;
  needsTools?: boolean;
  needsMultimodal?: boolean;
  budget?: 'free' | 'low' | 'medium' | 'high';
}

/**
 * Select appropriate model based on requirements
 */
function selectModel(requirements: ModelRequirements): string {
  const {
    task = 'general',
    priority = 'quality',
    needsCurrentInfo = false,
    largeContext = false,
    needsTools = true,
    needsMultimodal = false,
    budget = 'medium'
  } = requirements;

  console.log('🎯 Selecting model based on requirements:');
  console.log('   Task:', task);
  console.log('   Priority:', priority);
  console.log('   Current Info:', needsCurrentInfo);
  console.log('   Large Context:', largeContext);
  console.log('   Tools:', needsTools);
  console.log('   Multimodal:', needsMultimodal);
  console.log('   Budget:', budget);

  // Priority: Quality
  if (priority === 'quality') {
    if (task === 'reasoning') {
      const model = needsCurrentInfo
        ? 'anthropic/claude-opus-4:online'
        : 'anthropic/claude-opus-4';
      console.log('✅ Selected:', model);
      return model;
    }

    if (task === 'coding') {
      const model = largeContext
        ? 'anthropic/claude-opus-4:extended'
        : 'anthropic/claude-3.5-sonnet';
      console.log('✅ Selected:', model);
      return model;
    }

    // General quality
    const model = needsCurrentInfo
      ? 'anthropic/claude-3.5-sonnet:online'
      : 'anthropic/claude-3.5-sonnet';
    console.log('✅ Selected:', model);
    return model;
  }

  // Priority: Speed
  if (priority === 'speed') {
    if (task === 'coding') {
      const model = 'anthropic/claude-3.5-sonnet:nitro';
      console.log('✅ Selected:', model);
      return model;
    }

    const model = needsCurrentInfo
      ? 'google/gemini-2.0-flash:online:nitro'
      : 'google/gemini-2.0-flash:nitro';
    console.log('✅ Selected:', model);
    return model;
  }

  // Priority: Cost
  if (priority === 'cost') {
    if (budget === 'free') {
      const model = 'google/gemini-2.0-flash:free';
      console.log('✅ Selected:', model);
      return model;
    }

    if (task === 'coding') {
      const model = 'qwen/qwen-2.5-coder-32b';
      console.log('✅ Selected:', model);
      return model;
    }

    const model = 'google/gemini-2.0-flash';
    console.log('✅ Selected:', model);
    return model;
  }

  // Balanced (default)
  const model = needsCurrentInfo
    ? 'anthropic/claude-3.5-sonnet:online'
    : largeContext
      ? 'anthropic/claude-3.5-sonnet:extended'
      : 'anthropic/claude-3.5-sonnet';

  console.log('✅ Selected:', model);
  return model;
}

/**
 * Get model fallbacks list for reliability
 */
function getModelFallbacks(primaryModel: string): string[] {
  const fallbacks: Record<string, string[]> = {
    'anthropic/claude-3.5-sonnet': [
      'openai/gpt-4o',
      'google/gemini-2.5-pro',
      'meta-llama/llama-3.1-70b:free'
    ],
    'openai/gpt-4o': [
      'anthropic/claude-3.5-sonnet',
      'google/gemini-2.5-pro'
    ],
    'google/gemini-2.0-flash': [
      'openai/gpt-4o-mini',
      'anthropic/claude-haiku-4'
    ],
    'anthropic/claude-opus-4': [
      'openai/o1',
      'anthropic/claude-3.5-sonnet'
    ],
    'default': [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o',
      'google/gemini-2.0-flash'
    ]
  };

  return fallbacks[primaryModel] || fallbacks['default'];
}

/**
 * Select provider preferences
 */
function getProviderPreferences(priority: 'quality' | 'speed' | 'cost'): any {
  const preferences = {
    quality: {
      order: ['anthropic', 'openai', 'google'],
      allow_fallbacks: true,
      sort: null  // Let provider decide
    },
    speed: {
      order: ['google', 'anthropic', 'openai'],
      allow_fallbacks: true,
      sort: 'latency'
    },
    cost: {
      order: ['google', 'meta-llama', 'anthropic'],
      allow_fallbacks: true,
      sort: 'price'
    }
  };

  console.log('🏢 Provider preferences:', preferences[priority]);
  return preferences[priority];
}

/**
 * Build complete request with model selection and fallbacks
 */
function buildOptimizedRequest(
  userMessage: string,
  requirements: ModelRequirements
): any {
  const primaryModel = selectModel(requirements);
  const fallbacks = getModelFallbacks(primaryModel);
  const providerPrefs = getProviderPreferences(requirements.priority || 'quality');

  const request: any = {
    model: primaryModel,
    models: fallbacks,  // Enable fallbacks
    provider: providerPrefs,
    messages: [{ role: 'user', content: userMessage }]
  };

  // Add task-specific parameters
  if (requirements.task === 'coding') {
    request.temperature = 0.3;  // Lower for precise code
    request.max_tokens = 1500;
  } else if (requirements.task === 'creative') {
    request.temperature = 1.0;  // Higher for creativity
    request.max_tokens = 1000;
  } else if (requirements.task === 'summarization') {
    request.temperature = 0.2;  // Low for factual summary
    request.max_tokens = 500;
  } else {
    // Default
    request.temperature = 0.6;
    request.max_tokens = 1000;
  }

  // Add features based on requirements
  if (requirements.largeContext) {
    request.max_tokens = 4000;  // Allow longer output
  }

  if (requirements.needsCurrentInfo && !primaryModel.includes(':online')) {
    // Use :online variant if not already
    request.model = primaryModel + ':online';
  }

  return request;
}

/**
 * Example usage
 */
async function main() {
  console.log('🎛️  Model Selection Example\n' + '─'.repeat(60));

  const examples = [
    {
      name: 'General chat (balanced)',
      requirements: {
        task: 'general',
        priority: 'quality'
      }
    },
    {
      name: 'Fast coding (speed)',
      requirements: {
        task: 'coding',
        priority: 'speed',
        needsTools: true
      }
    },
    {
      name: 'Complex reasoning (quality)',
      requirements: {
        task: 'reasoning',
        priority: 'quality'
      }
    },
    {
      name: 'Current events (speed + web search)',
      requirements: {
        task: 'general',
        priority: 'speed',
        needsCurrentInfo: true
      }
    },
    {
      name: 'Cost-effective general (cost)',
      requirements: {
        task: 'general',
        priority: 'cost',
        budget: 'low'
      }
    },
    {
      name: 'Free tier (cost + free)',
      requirements: {
        task: 'general',
        priority: 'cost',
        budget: 'free'
      }
    }
  ];

  for (const example of examples) {
    console.log(`\n📍 ${example.name}`);
    console.log('─'.repeat(60));

    const request = buildOptimizedRequest('Hello, how are you?', example.requirements);

    console.log('📦 Request configuration:');
    console.log('   Model:', request.model);
    console.log('   Fallbacks:', request.models.slice(0, 3).join(', ') + '...');
    console.log('   Provider order:', request.provider.order);
    console.log('   Temperature:', request.temperature);
    console.log('   Max tokens:', request.max_tokens);

    // Uncomment to actually make request:
    // const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(request)
    // });
    // const data = await response.json();
    // console.log('✅ Response:', data.choices[0].message.content);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('✅ Model selection example complete');
}

// Uncomment to run
// main();
