/**
 * Structured Output Template
 * JSON Schema enforcement with response validation
 */

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

// Example schema for weather data
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
      description: 'Weather conditions (e.g., Sunny, Rainy, Cloudy)'
    },
    humidity: {
      type: 'number',
      description: 'Humidity percentage (0-100)'
    },
    wind_speed: {
      type: 'number',
      description: 'Wind speed in km/h'
    },
    forecast: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: {
            type: 'string',
            description: 'Day of the week'
          },
          high: { type: 'number' },
          low: { type: 'number' },
          conditions: { type: 'string' }
        }
      }
    }
  },
  required: ['location', 'temperature', 'conditions', 'humidity'],
  additionalProperties: false
};

// Example schema for API response
const apiResponseSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['success', 'error']
    },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        value: { type: 'number' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    },
    error: {
      type: 'string',
      description: 'Error message if status is error'
    }
  },
  required: ['status']
};

// Validate JSON against schema
function validateJson(json: any, schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in json)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Check property types
  if (schema.properties) {
    for (const [field, fieldSchema] of Object.entries(schema.properties)) {
      if (json[field] !== undefined) {
        const type = fieldSchema.type;

        if (type === 'number' && typeof json[field] !== 'number') {
          errors.push(`Field ${field} should be number, got ${typeof json[field]}`);
        }

        if (type === 'string' && typeof json[field] !== 'string') {
          errors.push(`Field ${field} should be string, got ${typeof json[field]}`);
        }

        if (type === 'array' && !Array.isArray(json[field])) {
          errors.push(`Field ${field} should be array`);
        }

        if (type === 'object' && (typeof json[field] !== 'object' || Array.isArray(json[field]))) {
          errors.push(`Field ${field} should be object`);
        }

        // Check enum values
        if (fieldSchema.enum && !fieldSchema.enum.includes(json[field])) {
          errors.push(`Field ${field} must be one of: ${fieldSchema.enum.join(', ')}`);
        }
      }
    }
  }

  // Check for additional properties
  if (schema.additionalProperties === false) {
    for (const field of Object.keys(json)) {
      if (!schema.properties || !(field in schema.properties)) {
        errors.push(`Unexpected field: ${field}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Request with structured output
async function getStructuredWeather(location: string): Promise<any> {
  console.log(`🌤 Fetching weather for: ${location}`);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are a weather API. Always respond with valid JSON matching the schema.'
        },
        {
          role: 'user',
          content: `What is the weather in ${location}? Include current conditions, temperature, humidity, wind speed, and a 3-day forecast.`
        }
      ],
      // Enforce JSON Schema
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'weather_report',
          strict: true,
          schema: weatherSchema
        }
      },
      // Enable response healing for robustness
      plugins: [{
        id: 'response-healing'
      }],
      temperature: 0.3  // Lower for consistent structure
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error.message}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse JSON
  let weatherData: any;
  try {
    weatherData = JSON.parse(content);
  } catch (parseError) {
    throw new Error(`Failed to parse JSON: ${parseError}`);
  }

  // Validate against schema
  const validation = validateJson(weatherData, weatherSchema);

  if (!validation.valid) {
    console.warn('⚠️  Validation errors:', validation.errors);
    // You can decide whether to accept or reject
  }

  console.log('✅ Weather data:', JSON.stringify(weatherData, null, 2));
  return weatherData;
}

// Request structured API response
async function callStructuredAPI(endpoint: string, params: any): Promise<any> {
  console.log(`🔌 Calling structured API: ${endpoint}`);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an API gateway. Convert requests to structured JSON responses.'
        },
        {
          role: 'user',
          content: `Call the ${endpoint} endpoint with params: ${JSON.stringify(params)}. Respond with the exact schema.`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'api_response',
          strict: true,
          schema: apiResponseSchema
        }
      },
      plugins: [{
        id: 'response-healing'
      }],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error.message}`);
  }

  const data = await response.json();
  const apiResponse = JSON.parse(data.choices[0].message.content);

  const validation = validateJson(apiResponse, apiResponseSchema);

  if (!validation.valid) {
    console.warn('⚠️  API response validation errors:', validation.errors);
  }

  console.log('✅ API response:', JSON.stringify(apiResponse, null, 2));
  return apiResponse;
}

// Example usage
async function main() {
  try {
    // Get weather data
    const weather = await getStructuredWeather('San Francisco');
    console.log('\n📊 Weather summary:');
    console.log('- Location:', weather.location);
    console.log('- Temperature:', weather.temperature, '°C');
    console.log('- Conditions:', weather.conditions);
    console.log('- Humidity:', weather.humidity, '%');
    console.log('- Forecast:', weather.forecast?.length || 0, ' days');

    console.log('\n' + '─'.repeat(60));

    // Call structured API
    const apiResponse = await callStructuredAPI('users', {
      action: 'get',
      id: 123
    });
    console.log('\n📊 API response summary:');
    console.log('- Status:', apiResponse.status);
    console.log('- Data:', apiResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Uncomment to run
// main();
