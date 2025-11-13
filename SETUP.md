# SkillLink Setup Guide

This guide will help you set up and run the SkillLink application (both backend and frontend).

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn package manager

## Backend Setup

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with default values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/skilllink
JWT_SECRET=4fb7bc81b8da9b079b245f4d7e33cc2b6f3872608a8f719a049a874ef17dba695d0914239fedb757dae2a830f2e970261432c2d2150d9fb93bf4cc564065e84c
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
FILE_SIZE_LIMIT=10mb
DEFAULT_PAGE_SIZE=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** If you're using MongoDB Atlas or a different MongoDB instance, update the `MONGO_URI` value.

### 3. Start MongoDB

If using local MongoDB:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Run Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend API will be available at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd Skilllink-frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env.local` file is already configured:

```
GEMINI_API_KEY=AIzaSyAq0Mg-JKgUi5WeDm5o25cuYKLE9N-I8ws
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_DATA=false
```

### 4. Run Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Testing the Application

### 1. Create Test Users

You can register users through the frontend UI or use the API directly:

**Register a Student:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Register a Facilitator:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "facilitator"
  }'
```

**Register an Admin:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. Login

Navigate to `http://localhost:5173/login` and use the credentials you created.

## Common Issues and Solutions

### Issue: MongoDB Connection Error

**Solution:** 
- Ensure MongoDB is running
- Check if the `MONGO_URI` in `.env` is correct
- If using MongoDB Atlas, ensure your IP is whitelisted

### Issue: Port Already in Use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Issue: CORS Errors

**Solution:** Ensure the `CLIENT_URL` in backend `.env` matches your frontend URL (default: `http://localhost:5173`)

### Issue: Module Not Found

**Solution:** 
```bash
# Backend
npm install

# Frontend
cd Skilllink-frontend
npm install
```

## Project Structure

```
skilllink-semicolon/
├── src/                      # Backend source code
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   └── services/            # Business logic services
├── Skilllink-frontend/      # Frontend React application
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── pages/               # Page components
│   ├── services/            # API service layer
│   └── types.ts             # TypeScript type definitions
├── uploads/                 # File upload directory
├── .env                     # Backend environment variables
├── server.js                # Backend entry point
└── package.json             # Backend dependencies
```

## API Documentation

The API is RESTful and follows standard conventions. Key endpoints:

- **Auth:** `/api/auth/register`, `/api/auth/login`
- **Cohorts:** `/api/cohorts`
- **Assignments:** `/api/assignments`
- **Submissions:** `/api/submissions`
- **Resources:** `/api/resources`
- **Discussions:** `/api/discussions`
- **Attendance:** `/api/attendance`

For detailed API documentation, see `README.md`

## Development Workflow

1. Start MongoDB
2. Start backend server: `npm run dev`
3. In a new terminal, navigate to frontend: `cd Skilllink-frontend`
4. Start frontend server: `npm run dev`
5. Open browser to `http://localhost:5173`

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Update `MONGO_URI` to production database
3. Update `CLIENT_URL` to production frontend URL
4. Run: `npm start`

### Frontend

1. Update `VITE_API_URL` in `.env.local` to production API URL
2. Build: `npm run build`
3. Deploy the `dist` folder to your hosting service

## Support

For issues or questions, please refer to the main README.md or contact the development team.
