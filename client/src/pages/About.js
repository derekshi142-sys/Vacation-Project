import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Award, 
  Zap,
  Heart,
  Globe,
  TrendingUp,
  Shield
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: "200+", label: "Monthly Users", icon: <Users className="h-6 w-6" /> },
    { number: "90%", label: "Cost Savings", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "2 hrs", label: "Avg Planning Time", icon: <Zap className="h-6 w-6" /> },
    { number: "50+", label: "Destinations", icon: <Globe className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Speed & Efficiency",
      description: "We believe vacation planning shouldn't take weeks. Our AI delivers complete itineraries in minutes, not days."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Personalization",
      description: "Every traveler is unique. Our AI understands your preferences and creates experiences tailored just for you."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Transparency",
      description: "No hidden fees or markups. You pay a tiny fraction of your budget for planning, and we're upfront about every cost."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality",
      description: "We don't just generate lists. Our itineraries include realistic timing, local insights, and backup plans."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former travel industry executive with 15 years at Expedia. Passionate about making travel accessible to everyone.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-founder", 
      bio: "AI researcher from Stanford. Built recommendation systems at Google before founding TravelAI.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Emily Johnson",
      role: "Head of Product",
      bio: "Product manager who's planned 100+ trips. Obsessed with creating delightful user experiences.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We're Revolutionizing Travel Planning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Born from frustration with expensive travel agencies and time-consuming planning, 
            TravelAI uses artificial intelligence to create perfect vacations in minutes, not weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plan" className="btn-primary">
              Try It Free
            </Link>
            <Link to="/pricing" className="btn-secondary">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 text-primary-200">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To make incredible travel experiences accessible to everyone by eliminating the time, 
              cost, and complexity of vacation planning. We believe everyone deserves to explore 
              the world without the stress of planning.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-6">
              <Target className="h-10 w-10 text-primary-600" />
              <h3 className="text-2xl font-bold text-gray-900">The Problem We're Solving</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Traditional travel planning is broken. Travel agencies charge 10-20% of your vacation budget, 
                take weeks to respond, and often suggest generic, overpriced packages.
              </p>
              <p>
                DIY planning means spending countless hours researching flights, hotels, restaurants, and 
                activities, often missing hidden gems and making costly mistakes with timing and logistics.
              </p>
              <p>
                We built TravelAI to give you the best of both worlds: expert-level planning at a fraction 
                of the cost, delivered in minutes instead of weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card">
                <div className="text-primary-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Travel enthusiasts and tech experts working to transform your vacation experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How We're Different</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary-600">TravelAI</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Travel Agencies</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">DIY Planning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4 font-medium text-gray-900">Planning Time</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">2 hours</td>
                  <td className="px-6 py-4 text-center text-red-600">2-4 weeks</td>
                  <td className="px-6 py-4 text-center text-red-600">20-40 hours</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Cost</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">0.3-1% of budget</td>
                  <td className="px-6 py-4 text-center text-red-600">10-20% of budget</td>
                  <td className="px-6 py-4 text-center text-green-600">Free (but time-consuming)</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4 font-medium text-gray-900">Personalization</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">AI-powered custom</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Limited templates</td>
                  <td className="px-6 py-4 text-center text-green-600">Full control</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Local Insights</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">AI knowledge base</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Agent dependent</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Research required</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4 font-medium text-gray-900">Booking Support</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">Optional add-on</td>
                  <td className="px-6 py-4 text-center text-green-600">Included</td>
                  <td className="px-6 py-4 text-center text-red-600">Do it yourself</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of Travel Planning?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of travelers who've discovered the joy of stress-free vacation planning
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
          >
            <span>Start Planning Free</span>
            <Zap className="h-5 w-5" />
          </Link>
          <p className="text-primary-200 text-sm mt-4">
            No credit card required • Free draft itinerary • Ready in minutes
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
