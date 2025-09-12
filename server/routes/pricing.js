const express = require('express');
const router = express.Router();

// Calculate pricing based on trip parameters
router.post('/calculate', (req, res) => {
  try {
    const { budget, budgetType, travelers, duration, travelStyle } = req.body;

    if (!budget || !budgetType) {
      return res.status(400).json({ error: 'Budget and budget type are required' });
    }

    let totalBudget = parseFloat(budget);
    
    // Convert budget to total trip budget
    switch (budgetType) {
      case 'per_person':
        totalBudget = totalBudget * travelers;
        break;
      case 'per_day':
        totalBudget = totalBudget * duration * travelers;
        break;
      case 'total':
      default:
        // Already total budget
        break;
    }

    // Calculate planning fee based on pricing model
    let planningFee = 0;
    let bookingFee = 0;
    let tier = 'standard';

    // Determine tier and calculate fees
    const dailyBudgetPerPerson = totalBudget / (duration * travelers);
    
    if (dailyBudgetPerPerson > 2000) {
      // Premium tier: 1% for high-end trips
      tier = 'premium';
      planningFee = totalBudget * 0.01;
    } else {
      // Standard tier: 0.3-0.7% based on travel style and budget
      let percentage = 0.005; // 0.5% base
      
      switch (travelStyle) {
        case 'budget':
          percentage = 0.003; // 0.3%
          break;
        case 'balanced':
          percentage = 0.005; // 0.5%
          break;
        case 'luxury':
          percentage = 0.007; // 0.7%
          break;
      }
      
      planningFee = totalBudget * percentage;
    }

    // Booking fees (optional add-ons)
    const basicBookingFee = totalBudget * 0.002; // 0.2%
    const advancedBookingFee = totalBudget * 0.002; // Additional 0.2%

    // Calculate savings compared to traditional agencies (10-20%)
    const agencyFeeMin = totalBudget * 0.10;
    const agencyFeeMax = totalBudget * 0.20;
    const savingsMin = agencyFeeMin - planningFee;
    const savingsMax = agencyFeeMax - planningFee;

    const pricing = {
      totalBudget: Math.round(totalBudget),
      tier: tier,
      planningFee: Math.round(planningFee),
      basicBookingFee: Math.round(basicBookingFee),
      advancedBookingFee: Math.round(advancedBookingFee),
      totalWithBasicBooking: Math.round(planningFee + basicBookingFee),
      totalWithAdvancedBooking: Math.round(planningFee + basicBookingFee + advancedBookingFee),
      agencyComparison: {
        min: Math.round(agencyFeeMin),
        max: Math.round(agencyFeeMax),
        savingsMin: Math.round(savingsMin),
        savingsMax: Math.round(savingsMax),
        savingsPercentage: Math.round((savingsMin / agencyFeeMin) * 100)
      },
      breakdown: {
        planningFeePercentage: ((planningFee / totalBudget) * 100).toFixed(2),
        basicBookingPercentage: ((basicBookingFee / totalBudget) * 100).toFixed(2),
        advancedBookingPercentage: ((advancedBookingFee / totalBudget) * 100).toFixed(2)
      }
    };

    res.json(pricing);
  } catch (error) {
    console.error('Error calculating pricing:', error);
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
});

// Get pricing tiers information
router.get('/tiers', (req, res) => {
  const tiers = {
    free: {
      name: 'Free Draft',
      price: 0,
      features: [
        'Basic itinerary outline',
        'Flight and hotel suggestions',
        'Daily activity schedule',
        'Budget estimation'
      ],
      limitations: [
        'No booking assistance',
        'No detailed maps',
        'No PDF export'
      ]
    },
    standard: {
      name: 'Standard',
      priceRange: '0.3-0.7%',
      features: [
        'Everything in Free Draft',
        'Detailed itinerary with maps',
        'Budget calculation & breakdown',
        'Google Maps integration',
        'Professional PDF export',
        'Basic booking assistance (+0.2%)'
      ]
    },
    premium: {
      name: 'Premium',
      price: '1%',
      condition: 'for trips over $2,000/person/day',
      features: [
        'Everything in Standard',
        'Advanced booking (restaurants, events)',
        'Private transport arrangements',
        'Concierge support',
        'Real-time trip adjustments',
        '24/7 phone support'
      ]
    }
  };

  res.json(tiers);
});

module.exports = router;
