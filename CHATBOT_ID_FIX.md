# Fixing the Chatbot ID Error

## The Problem
You're getting this error:
```
kind: 'ObjectId',
value: 'chatbot-1766958224299',
path: '_id',
```

This means you're using an invalid chatbot ID format. MongoDB ObjectIds must be 24-character hexadecimal strings (like `507f1f77bcf86cd799439011`), not custom IDs like `chatbot-1766958224299`.

## The Solution

### Step 1: Get a Real Chatbot ID

Run this command in the backend directory:
```bash
cd backend
node getChatbotId.js
```

This will show you all available chatbots and their valid IDs.

### Step 2: Update Your Demo Files

Copy the chatbot ID from step 1 and update these files:

**frontend/public/widget-demo.html** (line 42):
```html
<div data-promptly-chatbot-id="YOUR_REAL_CHATBOT_ID_HERE"></div>
```

**frontend/public/widget-demo2.html** (line 481):
```html
<div data-promptly-chatbot-id="YOUR_REAL_CHATBOT_ID_HERE"></div>
```

### Step 3: Rebuild Frontend
```bash
cd frontend
npm run build
```

## If You Don't Have Any Chatbots

1. Start your backend server: `cd backend && npm start`
2. Start your frontend: `cd frontend && npm run dev`
3. Go to http://localhost:5173
4. Sign in/Sign up
5. Create a new chatbot through the dashboard
6. Then run `node getChatbotId.js` to get the ID

## What Changed in the Code

Added validation to prevent this error in the future:
- **backend/routes/embed.js**: Validates ObjectId format before querying
- **backend/controllers/embedController.js**: Validates ObjectId in chat endpoint
- Both now return helpful error messages instead of crashing

## Example Valid Embed Code
```html
<!-- Promptly Chatbot Widget -->
<div data-promptly-chatbot-id="6951b59cdbc5cfa144130283"></div>
<script>
  window.PROMPTLY_API_URL = 'http://localhost:3000';
</script>
<script src="http://localhost:5173/promptly-widget.js"></script>
```
