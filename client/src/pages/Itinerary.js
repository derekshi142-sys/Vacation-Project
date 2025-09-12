import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Users,
  Plane,
  Utensils,
  Camera,
  Download,
  Share2,
  Edit3,
  CheckCircle,
  Star,
  Navigation
} from 'lucide-react';
import axios from 'axios';

const Itinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/itinerary/${id}`);
      setItinerary(response.data);
    } catch (err) {
      setError('Failed to load itinerary');
      console.error('Error fetching itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // PDF export functionality would go here
    alert('PDF export feature coming soon!');
  };

  const shareItinerary = () => {
    if (navigator.share) {
      navigator.share({
        title: `${itinerary.summary.destination} Trip Itinerary`,
        text: `Check out my ${itinerary.summary.duration}-day trip to ${itinerary.summary.destination}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Your Itinerary</h2>
          <p className="text-gray-600">Preparing your travel plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/plan" className="btn-primary">
            Plan New Trip
          </Link>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {itinerary.summary.destination} Adventure
              </h1>
              <div className="flex flex-wrap items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{itinerary.summary.duration} days</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{itinerary.originalRequest?.travelers || 1} travelers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${itinerary.summary.totalBudget?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={shareItinerary}
                className="btn-secondary flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button
                onClick={exportToPDF}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
              <Link to="/plan" className="btn-primary flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Edit Trip</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Budget Breakdown */}
            {itinerary.summary.budgetBreakdown && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(itinerary.summary.budgetBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-600 capitalize">{category}</span>
                      <span className="font-semibold">${amount?.toLocaleString() || 0}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>${itinerary.summary.totalBudget?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Flight Information */}
            {itinerary.flights && (
              <div className="card mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Flights
                </h3>
                <div className="space-y-4">
                  {itinerary.flights.outbound && (
                    <div>
                      <div className="text-sm font-medium text-gray-900">Outbound</div>
                      <div className="text-sm text-gray-600">
                        {itinerary.flights.outbound.airline} - ${itinerary.flights.outbound.price}
                      </div>
                      <div className="text-xs text-gray-500">{itinerary.flights.outbound.duration}</div>
                    </div>
                  )}
                  {itinerary.flights.return && (
                    <div>
                      <div className="text-sm font-medium text-gray-900">Return</div>
                      <div className="text-sm text-gray-600">
                        {itinerary.flights.return.airline} - ${itinerary.flights.return.price}
                      </div>
                      <div className="text-xs text-gray-500">{itinerary.flights.return.duration}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Day Navigation */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Days</h3>
              <div className="space-y-2">
                {itinerary.dailyItinerary?.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDay(day.day)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeDay === day.day
                        ? 'bg-primary-100 text-primary-700 border-primary-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">Day {day.day}</div>
                    <div className="text-sm opacity-75">{day.date}</div>
                    <div className="text-xs opacity-60">{day.theme}</div>
                  </button>
                )) || (
                  <div className="text-gray-500 text-sm">No daily itinerary available</div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Daily Itinerary */}
            {itinerary.dailyItinerary && itinerary.dailyItinerary.length > 0 ? (
              <div className="space-y-6">
                {itinerary.dailyItinerary
                  .filter(day => day.day === activeDay)
                  .map((day, index) => (
                    <div key={index} className="card">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Day {day.day}</h2>
                          <p className="text-gray-600">{day.date} • {day.theme}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Daily Budget</div>
                          <div className="font-semibold">
                            ${(day.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Camera className="h-5 w-5 mr-2" />
                          Activities
                        </h3>
                        {day.activities?.map((activity, actIndex) => (
                          <div key={actIndex} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-sm font-medium">
                                    {activity.time}
                                  </div>
                                  <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{activity.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{activity.duration}</span>
                                  </div>
                                </div>
                                {activity.notes && (
                                  <p className="text-sm text-gray-600">{activity.notes}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ${activity.cost?.toLocaleString() || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        )) || <p className="text-gray-500">No activities planned for this day</p>}
                      </div>

                      {/* Meals */}
                      {day.meals && (
                        <div className="mt-6 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Utensils className="h-5 w-5 mr-2" />
                            Meals
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['breakfast', 'lunch', 'dinner'].map(mealType => {
                              const meal = day.meals[mealType];
                              if (!meal) return null;
                              
                              return (
                                <div key={mealType} className="bg-gray-50 rounded-lg p-4">
                                  <div className="font-semibold text-gray-900 capitalize mb-2">
                                    {mealType}
                                  </div>
                                  <div className="text-sm text-gray-600 mb-1">
                                    {meal.restaurant}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-2">
                                    {meal.cuisine} • {meal.location}
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    ${meal.cost?.toLocaleString() || 0}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Transportation */}
                      {day.transportation && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-3">
                            <Navigation className="h-5 w-5 mr-2" />
                            Transportation
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-gray-900">{day.transportation.method}</div>
                                {day.transportation.notes && (
                                  <div className="text-sm text-gray-600">{day.transportation.notes}</div>
                                )}
                              </div>
                              <div className="font-semibold text-gray-900">
                                ${day.transportation.cost?.toLocaleString() || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Itinerary Available</h3>
                <p className="text-gray-600 mb-4">
                  This itinerary is still being generated or there was an issue with the AI response.
                </p>
                <Link to="/plan" className="btn-primary">
                  Create New Trip
                </Link>
              </div>
            )}

            {/* Tips */}
            {itinerary.tips && itinerary.tips.length > 0 && (
              <div className="card mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Travel Tips
                </h3>
                <ul className="space-y-2">
                  {itinerary.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Love Your Itinerary?</h2>
          <p className="text-lg mb-6 text-primary-100">
            Upgrade to book everything automatically and get detailed maps, confirmations, and concierge support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              View Pricing
            </Link>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold py-3 px-6 rounded-lg transition-colors">
              Book This Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
