# Deployment Guide (Render + Railway)

## Project Structure
```
/ (root)
├── client/           # React frontend (Railway)
├── server/           # Express backend (Render)
├── render.yaml       # Render configuration
└── package.json      # Root package
```

## Deployment Architecture
- **Backend**: Deployed on Render
- **Frontend**: Deployed on Railway

## Deployment Steps

### 1. Backend Service (API)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `full-stack-note-taking-application`
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

### 3. Frontend Service (Railway)
1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `client` folder
5. Configure:
   - **Name**: `note-taking-frontend`
   - **Environment**: `Node.js`
   - **Plan**: Free

### 4. Environment Variables for Frontend (Railway)
```
REACT_APP_API_URL=https://full-stack-note-taking-application.onrender.com
```

## URLs
- **Backend API**: `https://full-stack-note-taking-application.onrender.com` (Render)
- **Frontend**: `https://your-frontend-url.railway.app` (Railway)

## Testing
1. Deploy backend on Render first
2. Get backend URL: `https://full-stack-note-taking-application.onrender.com`
3. Deploy frontend on Railway
4. Set `REACT_APP_API_URL=https://full-stack-note-taking-application.onrender.com` in Railway
5. Update backend CORS with your Railway frontend URL
6. Test OTP functionality

## CORS Configuration
After getting your Railway frontend URL, update the backend environment variable:
```
FRONTEND_URL=https://your-frontend-url.railway.app
```
