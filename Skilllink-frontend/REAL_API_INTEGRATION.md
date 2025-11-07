# Real API Integration Guide

This document explains how to use the real backend API instead of mock data in the SkillLink frontend.

## Setup

1. Make sure the backend server is running on `http://localhost:5000`
2. The frontend is configured to proxy API requests to the backend during development

## Environment Variables

The frontend uses the following environment variables:

- `VITE_API_URL`: The base URL for the API (defaults to `http://localhost:5000/api`)
- `VITE_USE_MOCK_DATA`: Set to `true` to use mock data instead of real API

## Switching Between Mock and Real Data

By default, the frontend uses mock data. To switch to real data:

1. Create a `.env.local` file in the frontend directory
2. Add `VITE_USE_MOCK_DATA=false` to use real API data
3. Restart the frontend development server

## API Services

The real API integration is implemented in:

- `services/realApi.ts`: Contains all the real API calls
- `hooks/useRealApi.ts`: React hook for using the real API
- `contexts/RealAuthContext.tsx`: Authentication context for real API

## Testing the Integration

To test the API integration:

1. Start the backend server: `npm run dev` in the root directory
2. Start the frontend: `npm run dev` in the `Skilllink-frontend` directory
3. Open the browser and navigate to `http://localhost:3000`
4. Try to login or register with the real API

## API Endpoints Used

The frontend uses the following backend API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/cohorts` - Get all cohorts
- `GET /api/cohorts/:id` - Get a specific cohort
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get a specific assignment
- `POST /api/assignments` - Create a new assignment
- `GET /api/submissions/me` - Get user's submissions
- `POST /api/submissions` - Submit an assignment
- `PUT /api/submissions/:id/grade` - Grade a submission
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create a new resource
- `GET /api/discussions/:assignmentId` - Get discussion messages for an assignment
- `POST /api/discussions/:assignmentId` - Post a new discussion message
- `DELETE /api/discussions/:assignmentId/:messageId` - Delete a discussion message

## Authentication

Authentication is handled through JWT tokens:

1. User logs in with email and password
2. Server returns a JWT token
3. Token is stored in localStorage
4. Token is included in the Authorization header for all subsequent requests

## Error Handling

API errors are handled through:

1. HTTP status codes
2. Error messages in the response body
3. Try/catch blocks in the frontend code