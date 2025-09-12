// Configuration file - rename to config.js and add your API keys

module.exports = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // OpenAI API
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',

  // Google Maps API
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'your_google_maps_api_key_here',

  // Database (if using MongoDB)
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-ai',

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',

  // Stripe (for payments)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key_here',

  // Email Service (for notifications)
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || 'your_email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your_app_password'
};
