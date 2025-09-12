import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  MapPin, 
  Calendar,
  CreditCard,
  FileText,
  Headphones
} from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Free Draft',
      price: '$0',
      description: 'Perfect for exploring what\'s possible',
      features: [
        'Basic itinerary outline',
        'Flight and hotel suggestions',
        'Daily activity schedule',
        'Budget estimation',
        'Valid for 7 days'
      ],
      limitations: [
        'No booking assistance',
        'No detailed maps',
        'No PDF export',
        'Limited customization'
      ],
      cta: 'Start Free Draft',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Standard',
      price: '0.3-0.7%',
      priceDetail: 'of trip budget',
      description: 'Complete planning with smart automation',
      features: [
        'Everything in Free Draft',
        'Detailed itinerary with maps',
        'Budget calculation & breakdown',
        'Google Maps integration',
        'Professional PDF export',
        'Basic booking assistance (+0.2%)',
        'Email support'
      ],
      limitations: [
        'No concierge support',
        'No private transport booking'
      ],
      cta: 'Choose Standard',
      popular: true,
      color: 'primary'
    },
    {
      name: 'Premium',
      price: '1%',
      priceDetail: 'for trips over $2,000/person/day',
      description: 'White-glove service with concierge support',
      features: [
        'Everything in Standard',
        'Advanced booking (restaurants, events)',
        'Private transport arrangements',
        'Concierge support',
        'Real-time trip adjustments',
        'Weather & event monitoring',
        'Backup plans included',
        '24/7 phone support'
      ],
      limitations: [],
      cta: 'Go Premium',
      popular: false,
      color: 'yellow'
    }
  ];

  const examples = [
    {
      scenario: '$3,000 Weekend Getaway (2 people)',
      free: '$0',
      standard: '$9-21 (0.3-0.7%)',
      premium: 'Not applicable',
      agency: '$300-600 (10-20%)'
    },
    {
      scenario: '$8,000 Week in Europe (2 people)',
      free: '$0',
      standard: '$24-56 (0.3-0.7%)',
      premium: 'Not applicable',
      agency: '$800-1,600 (10-20%)'
    },
    {
      scenario: '$15,000 Luxury Safari (2 people)',
      free: '$0',
      standard: '$45-105 (0.3-0.7%)',
      premium: '$150 (1%)',
      agency: '$1,500-3,000 (10-20%)'
    }
  ];

  const faqs = [
    {
      question: 'How is the percentage calculated?',
      answer: 'The fee is calculated based on your total trip budget including flights, accommodation, food, and activities. We only charge when you\'re completely satisfied with your itinerary.'
    },
    {
      question: 'What if I need to change my plans?',
      answer: 'Standard plans include one major revision. Premium plans include unlimited revisions and real-time adjustments during your trip.'
    },
    {
      question: 'Do you charge for cancellations?',
      answer: 'No cancellation fees! If you cancel before we start booking, you only pay for the planning service already provided.'
    },
    {
      question: 'How does the booking service work?',
      answer: 'We use your credit card to book directly with airlines, hotels, and activity providers. You get all confirmation details and can manage bookings yourself.'
    },
    {
      question: 'What about the referral program?',
      answer: 'Refer someone who books a trip over $1,000 and get $100 credit towards your next vacation. No limits on referrals!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay a tiny fraction of your vacation budget instead of expensive agency fees. 
            Save 90%+ compared to traditional travel planning services.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card relative ${
                plan.popular ? 'ring-2 ring-primary-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.priceDetail && (
                    <span className="text-gray-600 ml-2">{plan.priceDetail}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Not included:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Link
                to="/plan"
                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Cost Comparison */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See How Much You Save
            </h2>
            <p className="text-xl text-gray-600">
              Compare our pricing to traditional travel agencies
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Trip Scenario</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Free Draft</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Standard</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Premium</th>
                  <th className="px-6 py-4 text-center font-semibold text-red-600">Travel Agency</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((example, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium text-gray-900">{example.scenario}</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">{example.free}</td>
                    <td className="px-6 py-4 text-center text-primary-600 font-semibold">{example.standard}</td>
                    <td className="px-6 py-4 text-center text-yellow-600 font-semibold">{example.premium}</td>
                    <td className="px-6 py-4 text-center text-red-600 font-semibold">{example.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Get your complete itinerary in under 2 hours instead of weeks of back-and-forth
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hidden Fees</h3>
            <p className="text-gray-600">
              Transparent pricing with no markups on hotels or flights. You pay exactly what we pay.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
            <p className="text-gray-600">
              Not happy? We'll revise your itinerary until it's perfect or refund your planning fee.
            </p>
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Earn $100 for Every Referral</h2>
            <p className="text-xl mb-6 text-primary-100">
              Know someone planning a vacation? Refer them and earn $100 credit when they book a trip over $1,000
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">$100</div>
                <div className="text-sm">Per Referral</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">No Limit</div>
                <div className="text-sm">On Referrals</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">$1,000+</div>
                <div className="text-sm">Minimum Trip</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Save 90% on Travel Planning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start with a free draft and see why thousands choose TravelAI
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
          >
            <span>Get Started Free</span>
            <Zap className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
