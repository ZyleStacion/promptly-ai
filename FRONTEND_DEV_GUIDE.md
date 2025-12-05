# Frontend Development Without Backend

## Quick Start

You can now work on the frontend design without needing the backend running!

### How to Run

```bash
cd frontend
npm run dev
```

That's it! The frontend will use **mock data** instead of real API calls.

## What's Set Up

1. **Mock API Service** (`src/api/mockApi.js`)

   - Fake user authentication
   - Sample chatbots data
   - Simulated network delays for realistic behavior

2. **Mock Mode Toggle**

   - In `src/api/mockApi.js`, set `USE_MOCK_API = true` (already set)
   - When backend is ready, change to `USE_MOCK_API = false`

3. **Mock Data Includes**
   - 3 sample chatbots with different statuses
   - User profile data
   - Chat history examples

## Sign In for Testing

Since mock mode is enabled, you can sign in with ANY credentials:

- Email: `anything@example.com`
- Password: `anything`

The mock API will accept any credentials and give you a fake token.

## Working on Design

Now you can freely:

- ✅ Design dashboard layouts
- ✅ Style components
- ✅ Add new UI elements
- ✅ Test responsive design
- ✅ See how components look with data
- ✅ No backend errors!

## When Backend is Ready

Simply change in `src/api/mockApi.js`:

```javascript
export const USE_MOCK_API = false; // Switch to real API
```

## Adding More Mock Data

Edit `src/api/mockApi.js` to add more:

- Chatbots
- User info
- Chat messages
- Any other data you need for design work

Enjoy designing! 🎨
