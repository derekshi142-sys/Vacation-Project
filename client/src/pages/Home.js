import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Users, 
  Star, 
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Minutes, Not Days",
      description: "Generate complete vacation plans in under 2 hours vs weeks of manual planning"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Save 90% on Costs",
      description: "Pay just 0.5% of your vacation budget instead of expensive travel agency fees"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Smart Route Planning",
      description: "Google Maps integration ensures realistic travel times and optimal routes"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personalized Experiences",
      description: "AI understands your preferences for food, activities, and travel style"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "San Francisco, CA",
      rating: 5,
      text: "Planned my entire European vacation in 90 minutes. The AI understood exactly what I wanted - no 10-hour drives, perfect pacing between cities!"
    },
    {
      name: "Mike Chen",
      location: "New York, NY", 
      rating: 5,
      text: "Saved over $3,000 compared to what travel agencies quoted me. The itinerary was flawless and included hidden gems I never would have found."
    },
    {
      name: "Emily Rodriguez",
      location: "Austin, TX",
      rating: 5,
      text: "As a busy mom, this was a lifesaver. Complete family vacation planned while the kids were napping. Everything was perfectly organized!"
    }
  ];

  const stats = [
    { number: "200+", label: "Happy Travelers Monthly" },
    { number: "90%", label: "Cost Savings vs Agencies" },
    { number: "2 hrs", label: "Average Planning Time" },
    { number: "4.9★", label: "Average Rating" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your trip, planned in
              <span className="text-yellow-300"> minutes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 animate-slide-up">
              Stop spending days planning vacations. Get a complete, personalized itinerary 
              with flights, hotels, and activities in under 2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/plan"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TravelAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with AI that understands what makes a perfect vacation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:shadow-lg transition-all duration-200">
                <div className="text-primary-600 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From dream to destination in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tell Us Your Dreams</h3>
              <p className="text-gray-600">
                Share your destination, dates, budget, and preferences. Our AI listens to what matters most to you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Creates Magic</h3>
              <p className="text-gray-600">
                Advanced AI analyzes millions of travel data points to craft your perfect itinerary with realistic timing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Travel</h3>
              <p className="text-gray-600">
                Get your complete itinerary with bookings, maps, and backup plans. Board your plane stress-free!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've discovered stress-free travel planning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Perfect Trip?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join 200+ monthly travelers who've discovered the joy of stress-free vacation planning
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-primary-200 text-sm mt-4">
            No credit card required • Free draft itinerary • Ready in minutes
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
