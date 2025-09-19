const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

// In-memory storage for demo (use database in production)
const itineraries = new Map();

let OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let SERPER_API_KEY = process.env.SERPER_API_KEY;
try {
  const local = require('../local-secret');
  if (local && local.OPENAI_API_KEY) OPENAI_API_KEY = local.OPENAI_API_KEY;
  if (local && local.SERPER_API_KEY) SERPER_API_KEY = local.SERPER_API_KEY;
} catch (_) {}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Helper function to perform Serper searches - REQUIRED for all itinerary generation
const performSerperSearch = async (query) => {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SERPER_API_KEY,
      },
      body: JSON.stringify({
        q: query,
        gl: 'us',
        hl: 'en',
        num: 8
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API returned status ${response.status}`);
    }

    const data = await response.json();
    const results = data.organic || [];
    
    if (results.length === 0) {
      throw new Error(`No search results found for query: "${query}"`);
    }
    
    return results;
  } catch (error) {
    console.error(`Critical error performing Serper search for "${query}":`, error.message);
    throw error; // Re-throw to ensure itinerary generation fails if search fails
  }
};

const generateItinerary = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      budgetType,
      travelStyle,
      interests,
      foodPreferences,
      accommodationType,
      customActivities
    } = req.body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !travelers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate that both OpenAI and Serper APIs are available
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    if (!SERPER_API_KEY) {
      return res.status(500).json({ error: 'Serper API key not configured. Real-time data is required for itinerary generation.' });
    }

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (duration <= 0 || duration > 30) {
      return res.status(400).json({ error: 'Invalid trip duration' });
    }

    // MANDATORY: Perform Serper searches for real-time itinerary data
    console.log('🔍 Performing REQUIRED Serper searches for real-time itinerary generation...');
    const searchQueries = [
      `best things to do in ${destination} 2024 attractions`,
      `top rated restaurants ${destination} ${interests.join(' ')} dining`,
      `${destination} ${accommodationType} hotels ${travelStyle} booking 2024`,
      `${destination} travel guide ${interests.join(' ')} activities experiences`,
      `${destination} local authentic experiences hidden gems`,
      `${destination} transportation getting around public transit`
    ];

    let searchResults;
    try {
      searchResults = await Promise.all(
        searchQueries.map(query => performSerperSearch(query))
      );
    } catch (error) {
      console.error('❌ Failed to get required real-time data from Serper:', error.message);
      return res.status(500).json({ 
        error: 'Failed to retrieve real-time travel data', 
        message: 'Serper API is required for up-to-date itinerary generation',
        details: error.message
      });
    }

    // Process search results - MUST have data for generation
    let searchContext = '\n=== REAL-TIME TRAVEL DATA (Use this information for accurate recommendations) ===';
    searchResults.forEach((results, index) => {
      if (results && results.length > 0) {
        const topResults = results.slice(0, 4); // Top 4 results per query
        searchContext += `\n\n🔍 ${searchQueries[index]}:\n`;
        topResults.forEach((item, i) => {
          searchContext += `${i + 1}. ${item.title}\n   📝 ${item.snippet}\n   🔗 ${item.link}\n`;
        });
      }
    });
    
    if (searchContext.length < 200) {
      return res.status(500).json({ 
        error: 'Insufficient real-time data retrieved', 
        message: 'Unable to generate accurate itinerary without current travel information'
      });
    }

// Create AI prompt
    const prompt = `Create a detailed travel itinerary for the following trip:

Destination: ${destination}
Duration: ${duration} days (${startDate} to ${endDate})
Travelers: ${travelers} people
Budget: ${budget} ${budgetType}
Travel Style: ${travelStyle}
Interests: ${interests.join(', ')}
Food Preferences: ${foodPreferences.join(', ')}
Accommodation: ${accommodationType}
Custom Activities: ${customActivities || 'None specified'}

IMPORTANT: Use the following real-time search data to create accurate, current recommendations:
${searchContext}

Based on the above search results and user preferences, please create a comprehensive itinerary that includes:
1. Daily schedule with realistic timing and travel considerations
2. Recommended flights (with rough pricing)
3. Accommodation suggestions
4. Restaurant recommendations for each meal
5. Activity suggestions based on interests
6. Transportation between locations
7. Budget breakdown by category
8. Important tips and considerations

Format the response as a detailed JSON object with the following structure:
{
  "summary": {
    "destination": "${destination}",
    "duration": ${duration},
    "totalBudget": ${budget || 5000},
    "budgetBreakdown": {
      "flights": ${Math.round((budget || 5000) * 0.3)},
      "accommodation": ${Math.round((budget || 5000) * 0.25)},
      "food": ${Math.round((budget || 5000) * 0.25)},
      "activities": ${Math.round((budget || 5000) * 0.15)},
      "transportation": ${Math.round((budget || 5000) * 0.05)}
    }
  },
  "flights": {
    "outbound": { "airline": "Major Airline", "price": ${Math.round((budget || 5000) * 0.15)}, "duration": "6-8 hours", "notes": "Book 2-3 months in advance for best prices" },
    "return": { "airline": "Major Airline", "price": ${Math.round((budget || 5000) * 0.15)}, "duration": "6-8 hours", "notes": "Return flight included" }
  },
  "accommodation": [
    { "name": "Recommended Hotel", "type": "${accommodationType}", "pricePerNight": ${Math.round((budget || 5000) * 0.25 / duration)}, "rating": 4.2, "location": "City Center", "amenities": ["WiFi", "Breakfast", "Gym"] }
  ],
  "dailyItinerary": [
    ${Array.from({length: duration}, (_, i) => `{
      "day": ${i + 1},
      "date": "${new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}",
      "theme": "Day ${i + 1} Theme",
      "activities": [
        { "time": "9:00 AM", "activity": "Morning Activity", "location": "Location", "cost": ${Math.round((budget || 5000) * 0.05)}, "duration": "2 hours", "notes": "Activity description" },
        { "time": "2:00 PM", "activity": "Afternoon Activity", "location": "Location", "cost": ${Math.round((budget || 5000) * 0.05)}, "duration": "3 hours", "notes": "Activity description" }
      ],
      "meals": {
        "breakfast": { "restaurant": "Local Cafe", "cuisine": "Local", "cost": ${Math.round((budget || 5000) * 0.03)}, "location": "Near hotel" },
        "lunch": { "restaurant": "Popular Restaurant", "cuisine": "Local", "cost": ${Math.round((budget || 5000) * 0.04)}, "location": "City center" },
        "dinner": { "restaurant": "Fine Dining", "cuisine": "International", "cost": ${Math.round((budget || 5000) * 0.06)}, "location": "Downtown" }
      },
      "transportation": { "method": "Public transport/Walking", "cost": ${Math.round((budget || 5000) * 0.01)}, "notes": "Daily transport within city" }
    }`).join(',\n    ')}
  ],
  "tips": [
    "Book accommodations early for better rates",
    "Learn basic local phrases",
    "Keep copies of important documents",
    "Check visa requirements",
    "Pack weather-appropriate clothing"
  ],
  "emergencyInfo": {
    "embassy": "Local embassy contact",
    "hospitalNearby": "Nearest hospital information",
    "emergencyNumbers": "Local emergency numbers"
  }
}

Make sure the itinerary is realistic, well-paced, and accounts for travel time between locations. Include specific restaurant and activity names where possible.`;

    // MANDATORY: Use OpenAI with Serper real-time data (no fallbacks)
    console.log('🤖 Generating itinerary with OpenAI using real-time Serper data...');
    let itineraryData;
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o';
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert travel planner with extensive knowledge of destinations worldwide. Create detailed, realistic itineraries that balance must-see attractions with local experiences. Always consider practical factors like travel time, opening hours, and realistic pacing. CRITICAL: You MUST use the real-time search data provided to give current, accurate recommendations. Use specific restaurant names, attractions, hotels, and activities mentioned in the search results. Never use generic placeholder names when real data is available. The search results contain the most up-to-date information about the destination.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('OpenAI returned empty response');
      }
      
      try {
        itineraryData = JSON.parse(content);
      } catch (parseError) {
        // If the model did not return strict JSON, attempt to extract JSON
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          itineraryData = JSON.parse(content.slice(start, end + 1));
        } else {
          throw new Error('Failed to parse OpenAI JSON response');
        }
      }
    } catch (error) {
      console.error('❌ OpenAI generation failed:', error.message);
      return res.status(500).json({ 
        error: 'Failed to generate itinerary with AI', 
        message: 'Both OpenAI and Serper are required for itinerary generation',
        details: error.message
      });
    }

    // Validate that we have complete itinerary data
    if (!itineraryData || !itineraryData.summary) {
      return res.status(500).json({ 
        error: 'Invalid itinerary data generated', 
        message: 'Failed to generate complete itinerary with real-time data'
      });
    }

    // Generate unique ID and store
    const itineraryId = uuidv4();
    const itinerary = {
      id: itineraryId,
      ...itineraryData,
      originalRequest: req.body,
      createdAt: new Date().toISOString(),
      status: 'draft',
      generatedWith: {
        openai: true,
        serper: true,
        realTimeData: true,
        searchQueries: searchQueries.length
      }
    };

    itineraries.set(itineraryId, itinerary);

    console.log('✅ Itinerary generated successfully using OpenAI + Serper real-time data');
    res.json({ 
      id: itineraryId,
      ...itinerary
    });

  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ 
      error: 'Failed to generate itinerary',
      message: error.message 
    });
  }
};

const getItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const itinerary = itineraries.get(id);

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
};

const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const itinerary = itineraries.get(id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const updatedItinerary = {
      ...itinerary,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    itineraries.set(id, updatedItinerary);
    res.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
};

module.exports = {
  generateItinerary,
  getItinerary,
  updateItinerary
};