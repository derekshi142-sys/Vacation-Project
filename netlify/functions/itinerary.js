// Netlify Function: Generate itinerary using OpenAI + Serper with env vars
// Usage: POST /.netlify/functions/itinerary with JSON body containing
// { destination, startDate, endDate, travelers, budget, budgetType, travelStyle, interests, foodPreferences, accommodationType, customActivities }

/* eslint-disable no-console */

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    if (!OPENAI_API_KEY || !SERPER_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing API keys on server' }) };
    }

    const req = JSON.parse(event.body || '{}');
    const {
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      budgetType,
      travelStyle,
      interests = [],
      foodPreferences = [],
      accommodationType,
      customActivities
    } = req;

    if (!destination || !startDate || !endDate || !travelers) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (Number.isNaN(duration) || duration <= 0 || duration > 30) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid trip duration' }) };
    }

    // Serper real-time search
    const queries = [
      `best things to do in ${destination} 2024 attractions`,
      `top rated restaurants ${destination} ${(interests || []).join(' ')} dining`,
      `${destination} ${accommodationType || 'hotel'} ${travelStyle || ''} booking 2024`,
      `${destination} travel guide ${(interests || []).join(' ')} activities experiences`,
      `${destination} local authentic experiences hidden gems`,
      `${destination} transportation getting around public transit`
    ];

    async function serperSearch(q) {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': SERPER_API_KEY },
        body: JSON.stringify({ q, gl: 'us', hl: 'en', num: 6 })
      });
      if (!res.ok) throw new Error(`Serper ${res.status}`);
      const data = await res.json();
      return data.organic || [];
    }

    let searchContext = '\n=== REAL-TIME TRAVEL DATA ===';
    const results = await Promise.all(queries.map((q) => serperSearch(q)));
    results.forEach((arr, idx) => {
      const top = (arr || []).slice(0, 4);
      if (top.length > 0) {
        searchContext += `\n\n${queries[idx]}:\n`;
        top.forEach((item, i) => {
          searchContext += `${i + 1}. ${item.title}\n   ${item.snippet}\n   ${item.link}\n`;
        });
      }
    });
    if (searchContext.length < 200) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Insufficient real-time data' }) };
    }

    // Build prompt for JSON itinerary
    const prompt = `Create a detailed travel itinerary for the following trip:\n\nDestination: ${destination}\nDuration: ${duration} days (${startDate} to ${endDate})\nTravelers: ${travelers} people\nBudget: ${budget} ${budgetType}\nTravel Style: ${travelStyle}\nInterests: ${(interests || []).join(', ')}\nFood Preferences: ${(foodPreferences || []).join(', ')}\nAccommodation: ${accommodationType}\nCustom Activities: ${customActivities || 'None specified'}\n\nIMPORTANT: Use the real-time search data below to pick current restaurants, attractions, hotels, and practical tips. Prefer specific names from the data over generic placeholders.\n${searchContext}\n\nReturn ONLY a strict JSON object with keys: summary, flights, accommodation, dailyItinerary, tips, emergencyInfo. Provide realistic prices and times.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert travel planner. Reply with strictly valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });
    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI error', details: text }) };
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || '{}';
    let itinerary;
    try {
      itinerary = JSON.parse(content);
    } catch (e) {
      const s = content.indexOf('{');
      const eIdx = content.lastIndexOf('}');
      if (s !== -1 && eIdx !== -1) itinerary = JSON.parse(content.slice(s, eIdx + 1));
    }
    if (!itinerary || !itinerary.summary) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Invalid itinerary generated' }) };
    }

    // Include original request metadata
    const response = {
      ...itinerary,
      originalRequest: req,
      generatedWith: { openai: true, serper: true, realTimeData: true }
    };

    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', message: err.message }) };
  }
};


