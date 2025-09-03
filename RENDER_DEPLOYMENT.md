# Render Deployment Guide

## Project Structure
```
/ (root)
├── client/           # React frontend
├── server/           # Express backend
├── render.yaml       # Render configuration
└── package.json      # Root package
```

## Deployment Steps

### 1. Backend Service (API)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `note-taking-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### 2. Environment Variables for Backend
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://roshanalawe39:K%40if1234@blog.ufd9cl8.mongodb.net/blog?retryWrites=true&w=majority&appName=Blog
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=roshanalawe39@gmail.com
EMAIL_PASS=ymaf aknd egea atux
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-very-long-and-secure-key
PORT=10000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### 3. Frontend Service (Static Site)
1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `note-taking-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Plan**: Free

### 4. Environment Variables for Frontend
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## URLs
- **Backend API**: `https://note-taking-backend.onrender.com`
- **Frontend**: `https://note-taking-frontend.onrender.com`

## Testing
1. Deploy backend first
2. Get backend URL
3. Set `REACT_APP_API_URL` in frontend
4. Deploy frontend
5. Test OTP functionality
