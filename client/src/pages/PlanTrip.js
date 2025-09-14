import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Plane, 
  Utensils, 
  Music,
  Camera,
  Zap,
  ArrowRight
} from 'lucide-react';
// Firebase imports
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PlanTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'User logged out');
    });

    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    budgetType: 'total', // total, per_person, per_day
    travelStyle: 'balanced', // budget, balanced, luxury
    interests: [],
    foodPreferences: [],
    accommodationType: 'hotel',
    customActivities: ''
  });

  const interests = [
    { id: 'culture', label: 'Culture & History', icon: <Camera className="h-5 w-5" /> },
    { id: 'food', label: 'Food & Dining', icon: <Utensils className="h-5 w-5" /> },
    { id: 'nightlife', label: 'Nightlife', icon: <Music className="h-5 w-5" /> },
    { id: 'nature', label: 'Nature & Outdoors', icon: <MapPin className="h-5 w-5" /> },
    { id: 'adventure', label: 'Adventure Sports', icon: <Zap className="h-5 w-5" /> },
    { id: 'relaxation', label: 'Relaxation', icon: <Users className="h-5 w-5" /> }
  ];

  const foodPreferences = [
    'Local Cuisine', 'Fine Dining', 'Street Food', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'No Restrictions'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleFoodToggle = (food) => {
    setFormData(prev => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(food)
        ? prev.foodPreferences.filter(f => f !== food)
        : [...prev.foodPreferences, food]
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      console.log('Form data to be saved:', formData);
      console.log('Current user:', user);
      
      if (!user) {
        alert('Please log in first to save your travel plan.');
        setIsLoading(false);
        return;
      }
      
      // Prepare data for Firestore
      const firestoreData = {
        // User information
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        
        // Form data
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        budget: formData.budget,
        budgetType: formData.budgetType,
        travelStyle: formData.travelStyle,
        interests: formData.interests,
        foodPreferences: formData.foodPreferences,
        accommodationType: formData.accommodationType,
        customActivities: formData.customActivities || '',
        
        // Metadata
        createdAt: new Date(),
        testMode: true,
        status: 'pending'
      };
      
      console.log('Saving to Firestore:', firestoreData);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'user-inputs-test'), firestoreData);
      console.log('✅ Document saved to Firestore with ID:', docRef.id);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to results page with data
      const queryParams = new URLSearchParams({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        budget: formData.budget,
        budgetType: formData.budgetType,
        travelStyle: formData.travelStyle,
        interests: JSON.stringify(formData.interests),
        foodPreferences: JSON.stringify(formData.foodPreferences),
        accommodationType: formData.accommodationType,
        customActivities: formData.customActivities || '',
        firestoreId: docRef.id
      });
      
      // Navigate to the HTML results page
      window.location.href = `/results.html?${queryParams.toString()}`;
      
    } catch (error) {
      console.error('❌ Error saving to Firestore:', error);
      
      let errorMessage = 'Failed to save travel data. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Please check your Firebase permissions.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Database is currently unavailable. Please try again.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.destination && formData.startDate && formData.endDate && formData.travelers;
      case 2:
        return formData.budget && formData.interests.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Checking authentication status</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to start planning your trip and save your preferences to Firestore.</p>
          <div className="space-y-3">
            <a 
              href="/login.html" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
            >
              Sign In
            </a>
            <p className="text-sm text-gray-500">
              Your travel plans will be securely saved to your account
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Saving to Firestore Database</h2>
          <p className="text-gray-600">Securely storing your travel preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plane className="h-6 w-6 mr-2 text-primary-600" />
                Where are you going?
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="input-field pl-10"
                      placeholder="e.g., Paris, France or Tokyo, Japan"
                      value={formData.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        className="input-field pl-10"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        className="input-field pl-10"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      className="input-field pl-10"
                      value={formData.travelers}
                      onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences & Budget */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-primary-600" />
                What's your style?
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        className="input-field pl-10"
                        placeholder="5000"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                      />
                    </div>
                    <select
                      className="input-field w-auto"
                      value={formData.budgetType}
                      onChange={(e) => handleInputChange('budgetType', e.target.value)}
                    >
                      <option value="total">Total Budget</option>
                      <option value="per_person">Per Person</option>
                      <option value="per_day">Per Day</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Travel Style
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'budget', label: 'Budget Traveler', desc: 'Hostels, street food, free activities' },
                      { value: 'balanced', label: 'Balanced', desc: 'Mix of comfort and value' },
                      { value: 'luxury', label: 'Luxury', desc: '5-star hotels, fine dining' }
                    ].map(style => (
                      <button
                        key={style.value}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.travelStyle === style.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('travelStyle', style.value)}
                      >
                        <div className="font-semibold text-gray-900">{style.label}</div>
                        <div className="text-sm text-gray-600">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What interests you? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map(interest => (
                      <button
                        key={interest.id}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                          formData.interests.includes(interest.id)
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        {interest.icon}
                        <span className="text-sm font-medium">{interest.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Food Preferences
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {foodPreferences.map(food => (
                      <button
                        key={food}
                        className={`p-2 rounded-lg border transition-all text-sm ${
                          formData.foodPreferences.includes(food)
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        onClick={() => handleFoodToggle(food)}
                      >
                        {food}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Final Details */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Final touches
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Accommodation Preference
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { value: 'hotel', label: 'Hotels' },
                      { value: 'airbnb', label: 'Airbnb' },
                      { value: 'hostel', label: 'Hostels' },
                      { value: 'mixed', label: 'Mix of All' }
                    ].map(type => (
                      <button
                        key={type.value}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.accommodationType === type.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('accommodationType', type.value)}
                      >
                        <div className="font-medium text-gray-900">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Activities (Optional)
                  </label>
                  <textarea
                    className="input-field h-24 resize-none"
                    placeholder="Any specific activities, restaurants, or places you want to include? e.g., 'Visit the Louvre Museum', 'Try authentic ramen in Shibuya'"
                    value={formData.customActivities}
                    onChange={(e) => handleInputChange('customActivities', e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• AI generates your personalized itinerary in minutes</li>
                    <li>• Get a free draft to review and customize</li>
                    <li>• Upgrade to book flights, hotels, and activities</li>
                    <li>• Receive professional PDF with maps and confirmations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              className={`btn-secondary ${step === 1 ? 'invisible' : ''}`}
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center space-x-2 ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Generate Itinerary</span>
                  <Zap className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
