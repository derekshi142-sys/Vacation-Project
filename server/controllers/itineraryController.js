const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo (use database in production)
const itineraries = new Map();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (duration <= 0 || duration > 30) {
      return res.status(400).json({ error: 'Invalid trip duration' });
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

Please create a comprehensive itinerary that includes:
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

    // For demo purposes, create a structured response without calling OpenAI
    // In production, uncomment the OpenAI call below
    
    /*
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner with extensive knowledge of destinations worldwide. Create detailed, realistic itineraries that balance must-see attractions with local experiences. Always consider practical factors like travel time, opening hours, and realistic pacing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    */

    // Demo response structure
    const itineraryData = {
      summary: {
        destination: destination,
        duration: duration,
        totalBudget: budget || 5000,
        budgetBreakdown: {
          flights: Math.round((budget || 5000) * 0.3),
          accommodation: Math.round((budget || 5000) * 0.25),
          food: Math.round((budget || 5000) * 0.25),
          activities: Math.round((budget || 5000) * 0.15),
          transportation: Math.round((budget || 5000) * 0.05)
        }
      },
      flights: {
        outbound: { 
          airline: "Major Airline", 
          price: Math.round((budget || 5000) * 0.15), 
          duration: "6-8 hours", 
          notes: "Book 2-3 months in advance for best prices" 
        },
        return: { 
          airline: "Major Airline", 
          price: Math.round((budget || 5000) * 0.15), 
          duration: "6-8 hours", 
          notes: "Return flight included" 
        }
      },
      accommodation: [
        { 
          name: `${destination} Grand Hotel`, 
          type: accommodationType, 
          pricePerNight: Math.round((budget || 5000) * 0.25 / duration), 
          rating: 4.2, 
          location: "City Center", 
          amenities: ["WiFi", "Breakfast", "Gym", "Pool"] 
        }
      ],
      dailyItinerary: Array.from({length: duration}, (_, i) => ({
        day: i + 1,
        date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        theme: i === 0 ? "Arrival & City Orientation" : 
               i === duration - 1 ? "Departure Day" : 
               interests.includes('culture') ? "Cultural Exploration" :
               interests.includes('food') ? "Culinary Adventure" :
               interests.includes('nature') ? "Natural Wonders" : "City Discovery",
        activities: [
          { 
            time: "9:00 AM", 
            activity: interests.includes('culture') ? "Museum Visit" :
                     interests.includes('nature') ? "Nature Walk" :
                     interests.includes('food') ? "Food Market Tour" : "City Walking Tour", 
            location: `${destination} City Center`, 
            cost: Math.round((budget || 5000) * 0.05), 
            duration: "2-3 hours", 
            notes: "Start your day with this must-see attraction" 
          },
          { 
            time: "2:00 PM", 
            activity: interests.includes('adventure') ? "Adventure Activity" :
                     interests.includes('culture') ? "Historical Site" :
                     interests.includes('relaxation') ? "Spa & Wellness" : "Local Experience", 
            location: `${destination} Main District`, 
            cost: Math.round((budget || 5000) * 0.07), 
            duration: "3-4 hours", 
            notes: "Afternoon highlight activity" 
          }
        ],
        meals: {
          breakfast: { 
            restaurant: "Local Morning Cafe", 
            cuisine: "Continental", 
            cost: Math.round((budget || 5000) * 0.02), 
            location: "Near hotel" 
          },
          lunch: { 
            restaurant: `${destination} Bistro`, 
            cuisine: foodPreferences.includes('Local Cuisine') ? "Local" : "International", 
            cost: Math.round((budget || 5000) * 0.04), 
            location: "City center" 
          },
          dinner: { 
            restaurant: travelStyle === 'luxury' ? "Fine Dining Restaurant" : 
                       travelStyle === 'budget' ? "Local Eatery" : "Popular Restaurant", 
            cuisine: foodPreferences.includes('Local Cuisine') ? "Traditional Local" : "Fusion", 
            cost: travelStyle === 'luxury' ? Math.round((budget || 5000) * 0.08) :
                  travelStyle === 'budget' ? Math.round((budget || 5000) * 0.03) :
                  Math.round((budget || 5000) * 0.05), 
            location: "Entertainment district" 
          }
        },
        transportation: { 
          method: travelStyle === 'luxury' ? "Private car" : "Public transport", 
          cost: travelStyle === 'luxury' ? Math.round((budget || 5000) * 0.02) : Math.round((budget || 5000) * 0.005), 
          notes: "Daily transport within city" 
        }
      })),
      tips: [
        `Best time to visit ${destination} is during shoulder season for fewer crowds`,
        "Book accommodations early for better rates",
        "Learn basic local phrases to enhance your experience",
        "Keep copies of important documents in separate locations",
        "Check visa requirements well in advance",
        "Pack weather-appropriate clothing and comfortable walking shoes",
        customActivities ? `Don't forget: ${customActivities}` : "Consider travel insurance for peace of mind"
      ].filter(Boolean),
      emergencyInfo: {
        embassy: "Contact your local embassy for assistance",
        hospitalNearby: "Research nearest hospital and medical facilities",
        emergencyNumbers: "Save local emergency numbers in your phone"
      }
    };

    // Generate unique ID and store
    const itineraryId = uuidv4();
    const itinerary = {
      id: itineraryId,
      ...itineraryData,
      originalRequest: req.body,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    itineraries.set(itineraryId, itinerary);

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