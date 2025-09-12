# TravelAI Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Configure API Keys**
   ```bash
   cp server/config.example.js server/config.js
   # Edit server/config.js with your API keys
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Open Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## API Keys Required

### OpenAI API Key (Required for AI features)
1. Sign up at https://openai.com
2. Create an API key in your dashboard
3. Add to `server/config.js`:
   ```javascript
   OPENAI_API_KEY: 'your_actual_api_key_here'
   ```

### Google Maps API Key (Optional but recommended)
1. Go to Google Cloud Console
2. Enable Google Maps JavaScript API and Places API
3. Create an API key
4. Add to `server/config.js`:
   ```javascript
   GOOGLE_MAPS_API_KEY: 'your_actual_api_key_here'
   ```

## Development Commands

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend  
npm run client

# Build for production
npm run build
```

## Project Structure

```
Final Project/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root dependencies
└── README.md        # Main documentation
```

## Testing the Application

1. Visit http://localhost:3000
2. Click "Start Planning"
3. Fill in trip details:
   - Destination: "Paris, France"
   - Dates: Pick future dates
   - Travelers: 2
   - Budget: $5000
4. Complete the 3-step form
5. View your generated itinerary

## Production Deployment

1. Set environment variables on your hosting platform
2. Build the frontend: `cd client && npm run build`
3. Deploy the server with the client build folder
4. Configure your domain and SSL

## Troubleshooting

**Port already in use:**
- Change PORT in server/config.js
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

**API key errors:**
- Ensure API keys are properly set in server/config.js
- Check API key permissions and quotas

**Module not found:**
- Run `npm run install-all` again
- Delete node_modules and reinstall

## Support

For issues or questions, check the main README.md or create an issue in the repository.
