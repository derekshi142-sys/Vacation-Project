// Simple AI Service for TravelAI HTML version
// This simulates AI responses with intelligent mock data

class TravelAI {
    constructor() {
        this.destinations = {
            'paris': {
                activities: ['Louvre Museum', 'Eiffel Tower', 'Notre-Dame', 'Champs-Élysées', 'Montmartre', 'Seine River Cruise'],
                restaurants: ['Le Comptoir du Relais', 'L\'As du Fallafel', 'Bistrot Paul Bert', 'Le Procope', 'Café de Flore'],
                hotels: ['Hotel des Grands Boulevards', 'Hotel des Grands Hommes', 'Hotel des Saints-Pères'],
                themes: ['Romantic Paris', 'Art & Culture', 'Food & Wine', 'Historic Paris', 'Fashion & Shopping']
            },
            'tokyo': {
                activities: ['Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Tsukiji Fish Market', 'Meiji Shrine', 'Harajuku District'],
                restaurants: ['Sukiyabashi Jiro', 'Narisawa', 'Tsuta', 'Nakamura', 'Sushi Dai'],
                hotels: ['The Ritz-Carlton Tokyo', 'Aman Tokyo', 'Park Hyatt Tokyo'],
                themes: ['Modern Tokyo', 'Traditional Culture', 'Food Adventure', 'Shopping & Fashion', 'Technology & Innovation']
            },
            'new york': {
                activities: ['Central Park', 'Statue of Liberty', 'Times Square', 'Brooklyn Bridge', 'High Line', 'Metropolitan Museum'],
                restaurants: ['Le Bernardin', 'Eleven Madison Park', 'Peter Luger', 'Katz\'s Delicatessen', 'Joe\'s Pizza'],
                hotels: ['The Plaza', 'The St. Regis New York', 'The Carlyle'],
                themes: ['City That Never Sleeps', 'Art & Culture', 'Food Scene', 'Broadway & Entertainment', 'Shopping & Fashion']
            }
        };
    }

    async generateItinerary(formData) {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const destination = formData.destination.toLowerCase();
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalBudget = parseInt(formData.budget) || 5000;
        
        // Get destination data or use generic
        const destData = this.destinations[destination] || this.getGenericDestinationData();
        
        return {
            summary: {
                destination: formData.destination,
                duration: duration,
                totalBudget: totalBudget,
                budgetBreakdown: this.calculateBudgetBreakdown(totalBudget, formData.travelStyle)
            },
            flights: this.generateFlights(formData.destination, totalBudget),
            accommodation: this.generateAccommodation(destData.hotels, totalBudget, duration, formData.accommodationType),
            dailyItinerary: this.generateDailyItinerary(destData, formData, duration, startDate, totalBudget),
            tips: this.generateTips(formData.destination, formData.travelStyle),
            emergencyInfo: this.generateEmergencyInfo(formData.destination)
        };
    }

    calculateBudgetBreakdown(totalBudget, travelStyle) {
        const multipliers = {
            budget: { flights: 0.25, accommodation: 0.20, food: 0.20, activities: 0.20, transportation: 0.15 },
            balanced: { flights: 0.30, accommodation: 0.25, food: 0.25, activities: 0.15, transportation: 0.05 },
            luxury: { flights: 0.20, accommodation: 0.40, food: 0.25, activities: 0.10, transportation: 0.05 }
        };
        
        const style = multipliers[travelStyle] || multipliers.balanced;
        return {
            flights: Math.round(totalBudget * style.flights),
            accommodation: Math.round(totalBudget * style.accommodation),
            food: Math.round(totalBudget * style.food),
            activities: Math.round(totalBudget * style.activities),
            transportation: Math.round(totalBudget * style.transportation)
        };
    }

    generateFlights(destination, totalBudget) {
        const airlines = ['Delta', 'United', 'American', 'Lufthansa', 'Air France', 'British Airways'];
        const flightCost = Math.round(totalBudget * 0.15);
        
        return {
            outbound: {
                airline: airlines[Math.floor(Math.random() * airlines.length)],
                price: flightCost,
                duration: this.getFlightDuration(destination),
                notes: 'Book 2-3 months in advance for best prices'
            },
            return: {
                airline: airlines[Math.floor(Math.random() * airlines.length)],
                price: flightCost,
                duration: this.getFlightDuration(destination),
                notes: 'Return flight included'
            }
        };
    }

    getFlightDuration(destination) {
        const durations = {
            'paris': '8-10 hours',
            'london': '7-9 hours',
            'tokyo': '12-14 hours',
            'sydney': '15-17 hours',
            'new york': '5-7 hours'
        };
        return durations[destination.toLowerCase()] || '6-8 hours';
    }

    generateAccommodation(hotels, totalBudget, duration, accommodationType) {
        const pricePerNight = Math.round((totalBudget * 0.25) / duration);
        
        return [{
            name: hotels[Math.floor(Math.random() * hotels.length)],
            type: accommodationType,
            pricePerNight: pricePerNight,
            rating: 4.2 + Math.random() * 0.8,
            location: 'City Center',
            amenities: ['WiFi', 'Breakfast', 'Gym', 'Pool', 'Spa']
        }];
    }

    generateDailyItinerary(destData, formData, duration, startDate, totalBudget) {
        const itinerary = [];
        
        for (let i = 0; i < duration; i++) {
            const dayDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const theme = destData.themes[i % destData.themes.length];
            
            itinerary.push({
                day: i + 1,
                date: dayDate.toISOString().split('T')[0],
                theme: theme,
                activities: this.generateDayActivities(destData, formData, totalBudget),
                meals: this.generateDayMeals(destData, formData, totalBudget),
                transportation: this.generateTransportation(formData.travelStyle, totalBudget)
            });
        }
        
        return itinerary;
    }

    generateDayActivities(destData, formData, totalBudget) {
        const activities = [];
        const activityCost = Math.round(totalBudget * 0.05);
        
        // Morning activity
        activities.push({
            time: '9:00 AM',
            activity: this.selectActivity(destData.activities, formData.interests, 'morning'),
            location: `${formData.destination} City Center`,
            cost: activityCost,
            duration: '2-3 hours',
            notes: 'Start your day with this must-see attraction'
        });
        
        // Afternoon activity
        activities.push({
            time: '2:00 PM',
            activity: this.selectActivity(destData.activities, formData.interests, 'afternoon'),
            location: `${formData.destination} Main District`,
            cost: Math.round(activityCost * 1.4),
            duration: '3-4 hours',
            notes: 'Afternoon highlight activity'
        });
        
        return activities;
    }

    selectActivity(activities, interests, timeOfDay) {
        if (interests && interests.length > 0) {
            const interestActivities = {
                culture: activities.filter(a => a.includes('Museum') || a.includes('Temple') || a.includes('Shrine')),
                food: activities.filter(a => a.includes('Market') || a.includes('Food')),
                nature: activities.filter(a => a.includes('Park') || a.includes('Garden')),
                adventure: activities.filter(a => a.includes('Bridge') || a.includes('Tower'))
            };
            
            for (const interest of interests) {
                if (interestActivities[interest] && interestActivities[interest].length > 0) {
                    return interestActivities[interest][Math.floor(Math.random() * interestActivities[interest].length)];
                }
            }
        }
        
        return activities[Math.floor(Math.random() * activities.length)];
    }

    generateDayMeals(destData, formData, totalBudget) {
        const mealCosts = {
            budget: { breakfast: 0.02, lunch: 0.03, dinner: 0.05 },
            balanced: { breakfast: 0.02, lunch: 0.04, dinner: 0.06 },
            luxury: { breakfast: 0.03, lunch: 0.05, dinner: 0.10 }
        };
        
        const costs = mealCosts[formData.travelStyle] || mealCosts.balanced;
        
        return {
            breakfast: {
                restaurant: 'Local Morning Cafe',
                cuisine: 'Continental',
                cost: Math.round(totalBudget * costs.breakfast),
                location: 'Near hotel'
            },
            lunch: {
                restaurant: destData.restaurants[Math.floor(Math.random() * destData.restaurants.length)],
                cuisine: 'Local',
                cost: Math.round(totalBudget * costs.lunch),
                location: 'City center'
            },
            dinner: {
                restaurant: destData.restaurants[Math.floor(Math.random() * destData.restaurants.length)],
                cuisine: 'Fine Dining',
                cost: Math.round(totalBudget * costs.dinner),
                location: 'Entertainment district'
            }
        };
    }

    generateTransportation(travelStyle, totalBudget) {
        const transportCost = travelStyle === 'luxury' ? 
            Math.round(totalBudget * 0.02) : 
            Math.round(totalBudget * 0.005);
            
        return {
            method: travelStyle === 'luxury' ? 'Private car' : 'Public transport',
            cost: transportCost,
            notes: 'Daily transport within city'
        };
    }

    generateTips(destination, travelStyle) {
        const tips = [
            `Best time to visit ${destination} is during shoulder season for fewer crowds`,
            'Book accommodations early for better rates',
            'Learn basic local phrases to enhance your experience',
            'Keep copies of important documents in separate locations',
            'Check visa requirements well in advance',
            'Pack weather-appropriate clothing and comfortable walking shoes'
        ];
        
        if (travelStyle === 'budget') {
            tips.push('Look for free walking tours and museum free days');
        } else if (travelStyle === 'luxury') {
            tips.push('Consider private guides for exclusive experiences');
        }
        
        return tips;
    }

    generateEmergencyInfo(destination) {
        return {
            embassy: 'Contact your local embassy for assistance',
            hospitalNearby: 'Research nearest hospital and medical facilities',
            emergencyNumbers: 'Local emergency numbers: 911 (US), 112 (EU), 110 (Japan)'
        };
    }

    getGenericDestinationData() {
        return {
            activities: ['City Walking Tour', 'Local Market Visit', 'Historic District', 'Scenic Viewpoint', 'Cultural Center'],
            restaurants: ['Local Bistro', 'Traditional Restaurant', 'Popular Cafe', 'Fine Dining', 'Street Food'],
            hotels: ['City Center Hotel', 'Boutique Hotel', 'Business Hotel'],
            themes: ['City Discovery', 'Cultural Experience', 'Local Life', 'Historic Tour', 'Modern Exploration']
        };
    }
}

// Global AI service instance
window.travelAI = new TravelAI();

// Simple API endpoint simulation
window.addEventListener('DOMContentLoaded', function() {
    // Override fetch to handle AI requests
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        if (url.includes('/api/generate-itinerary')) {
            const formData = JSON.parse(options.body);
            const result = await window.travelAI.generateItinerary(formData);
            return {
                ok: true,
                json: () => Promise.resolve(result)
            };
        }
        return originalFetch.apply(this, arguments);
    };
});
