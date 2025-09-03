# Full-Stack Note-Taking Application

A modern, full-stack note-taking application built with React.js frontend and Node.js/Express.js backend, featuring OTP-based authentication and MongoDB database integration.

## 🚀 Live Demo

- **Frontend**: [https://full-stack-note-taking-application-production.up.railway.app](https://full-stack-note-taking-application-production.up.railway.app)
- **Backend API**: [https://full-stack-note-taking-application.onrender.com](https://full-stack-note-taking-application.onrender.com)

## ✨ Features

- **🔐 OTP Authentication**: Secure email-based OTP verification for signup and signin
- **📝 Note Management**: Create, read, update, and delete notes
- **👤 User Management**: User registration and authentication
- **🎨 Modern UI**: Clean and responsive design with Tailwind CSS
- **☁️ Cloud Deployment**: Deployed on Railway (frontend) and Render (backend)
- **🗄️ Database**: MongoDB Atlas for data persistence

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service

### Deployment
- **Railway** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
full-stack-note-taking-application/
├── client/                    # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── pages/
│   │   │   ├── signin.tsx     # Sign-in page
│   │   │   ├── signup.tsx     # Sign-up page
│   │   │   └── dashboard.tsx  # Main dashboard
│   │   ├── config.js          # API configuration
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                    # Express backend
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Note.js            # Note model
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
├── package.json               # Root package.json
├── render.yaml                # Render deployment config
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- MongoDB Atlas account (for cloud database)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/RoshanAlawe07/full-stack-note-taking-application.git
   cd full-stack-note-taking-application
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server/` directory:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   
   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:5000

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client

#### Client Level
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

#### Server Level
- `npm start` - Start the Express server
- `npm run dev` - Start with nodemon (auto-restart)

## 🔧 API Endpoints

### Authentication
- `POST /api/send-otp` - Send OTP for registration
- `POST /api/verify-otp` - Verify OTP and register user
- `POST /api/signin-otp` - Send OTP for sign-in
- `POST /api/verify-signin` - Verify OTP and sign in

### Notes
- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Health
- `GET /api/health` - Health check endpoint

## 🌐 Deployment

### Frontend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables:
   - `REACT_APP_API_URL=https://full-stack-note-taking-application.onrender.com`
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret key
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email configuration
   - `FRONTEND_URL` - Your frontend URL
3. Deploy automatically on push to main branch

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas
2. Create a database user
3. Whitelist your IP addresses
4. Get your connection string and add it to environment variables

## 🔐 Environment Variables

### Frontend (Railway)
```env
REACT_APP_API_URL=https://full-stack-note-taking-application.onrender.com
```

### Backend (Render)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://full-stack-note-taking-application-production.up.railway.app
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend environment variables
   - Check that the frontend URL matches exactly (including https://)

2. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check that your database user has proper permissions

3. **Email OTP Not Working**
   - Verify email credentials in environment variables
   - Use app-specific password for Gmail
   - Check email service configuration

4. **Build Failures**
   - Ensure all dependencies are installed
   - Check for TypeScript/ESLint errors
   - Verify environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Roshan Alawe**
- GitHub: [@RoshanAlawe07](https://github.com/RoshanAlawe07)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Express.js for the robust backend framework
- MongoDB Atlas for free cloud database hosting
- Railway and Render for free hosting services
- Tailwind CSS for the utility-first CSS framework

---

**⭐ Star this repository if you found it helpful!**