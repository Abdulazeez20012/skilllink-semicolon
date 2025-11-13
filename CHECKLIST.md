# SkillLink - Pre-Launch Checklist

Use this checklist to ensure everything is set up correctly before running the application.

## ✅ Prerequisites

- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed (`mongod --version`)
- [ ] Git installed (optional, for version control)

## ✅ Backend Setup

- [ ] Navigate to project root directory
- [ ] Run `npm install` to install dependencies
- [ ] Verify `.env` file exists with correct values:
  - [ ] `PORT=5000`
  - [ ] `MONGO_URI` is set (default: `mongodb://localhost:27017/skilllink`)
  - [ ] `JWT_SECRET` is set
  - [ ] `CLIENT_URL=http://localhost:5173`
- [ ] MongoDB is running
  - Windows: `net start MongoDB`
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`
- [ ] Test backend: `npm run dev`
- [ ] Verify backend is running at http://localhost:5000/api

## ✅ Frontend Setup

- [ ] Navigate to `Skilllink-frontend` directory
- [ ] Run `npm install` to install dependencies
- [ ] Verify `.env.local` file exists with:
  - [ ] `VITE_API_URL=http://localhost:5000/api`
  - [ ] `VITE_USE_MOCK_DATA=false`
- [ ] Test frontend: `npm run dev`
- [ ] Verify frontend is running at http://localhost:5173

## ✅ Verification Tests

### Backend Tests
- [ ] Health check: Visit http://localhost:5000/api
  - Should return: `{"message":"SkillLink API is running","timestamp":"..."}`
- [ ] Register endpoint works:
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","password":"test123","role":"student"}'
  ```
- [ ] No errors in backend terminal

### Frontend Tests
- [ ] Visit http://localhost:5173
- [ ] Landing page loads correctly
- [ ] Can navigate to login page
- [ ] Can navigate to signup page
- [ ] No errors in browser console
- [ ] No errors in frontend terminal

### Integration Tests
- [ ] Register a new user through frontend
- [ ] Login with registered user
- [ ] Dashboard loads after login
- [ ] Can navigate between pages
- [ ] API calls work (check Network tab in browser DevTools)

## ✅ Feature Tests

### As Student
- [ ] Can register with student role
- [ ] Can login
- [ ] Can view dashboard
- [ ] Can view cohorts
- [ ] Can join cohort with invite code
- [ ] Can view assignments
- [ ] Can submit assignment
- [ ] Can view resources
- [ ] Can participate in discussions
- [ ] Can mark attendance

### As Facilitator
- [ ] Can register with facilitator role
- [ ] Can login
- [ ] Can create cohort
- [ ] Can create assignment
- [ ] Can view submissions
- [ ] Can grade submissions
- [ ] Can upload resources
- [ ] Can generate QR code for attendance
- [ ] Can view cohort analytics

### As Admin
- [ ] Can register with admin role
- [ ] Can login
- [ ] Can manage cohorts
- [ ] Can assign facilitators
- [ ] Can enroll students
- [ ] Can view cohort health scores
- [ ] Can view predictive alerts

## ✅ Common Issues Resolution

### Issue: MongoDB Connection Error
- [ ] MongoDB service is running
- [ ] `MONGO_URI` in `.env` is correct
- [ ] MongoDB is accessible on the specified port
- [ ] If using Atlas, IP is whitelisted

### Issue: Port Already in Use
- [ ] Port 5000 is not used by another application
- [ ] Port 5173 is not used by another application
- [ ] Kill processes if needed:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:5000 | xargs kill -9`

### Issue: CORS Errors
- [ ] `CLIENT_URL` in backend `.env` matches frontend URL
- [ ] Backend CORS is configured correctly
- [ ] Both servers are running

### Issue: Module Not Found
- [ ] Ran `npm install` in root directory
- [ ] Ran `npm install` in Skilllink-frontend directory
- [ ] node_modules folders exist in both locations
- [ ] No errors during npm install

### Issue: Cannot Login
- [ ] User is registered in database
- [ ] Password is correct (minimum 6 characters)
- [ ] Backend is running
- [ ] Check browser console for errors
- [ ] Check backend terminal for errors

## ✅ Performance Checks

- [ ] Backend responds within 1 second
- [ ] Frontend loads within 2 seconds
- [ ] No memory leaks in browser
- [ ] No excessive console warnings
- [ ] Database queries are efficient

## ✅ Security Checks

- [ ] JWT_SECRET is not the default value (for production)
- [ ] Passwords are hashed (not stored in plain text)
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] File upload size limits are set
- [ ] Input validation is working

## ✅ Documentation Review

- [ ] Read QUICK_START.md
- [ ] Read SETUP.md
- [ ] Read FIXES_APPLIED.md
- [ ] Read PROJECT_STATUS.md
- [ ] Understand API endpoints (README.md)

## ✅ Development Environment

- [ ] Code editor installed (VS Code recommended)
- [ ] Git configured (optional)
- [ ] Postman or similar API testing tool (optional)
- [ ] MongoDB Compass for database viewing (optional)

## ✅ Production Readiness (Future)

- [ ] Environment variables secured
- [ ] Database backed up
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] SSL/TLS certificates configured
- [ ] Domain name configured
- [ ] Hosting service selected
- [ ] CI/CD pipeline set up

## 🎯 Quick Start Commands

### Start Everything (Windows)
```bash
start-all.bat
```

### Start Backend Only
```bash
npm run dev
```

### Start Frontend Only
```bash
cd Skilllink-frontend
npm run dev
```

### Install Dependencies
```bash
# Backend
npm install

# Frontend
cd Skilllink-frontend
npm install
```

## 📞 Need Help?

If any checklist item fails:

1. Check the error message in terminal
2. Review the relevant documentation file
3. Verify all prerequisites are met
4. Check MongoDB is running
5. Ensure ports are available
6. Try restarting the servers

## ✅ Final Verification

- [ ] All checklist items above are completed
- [ ] Both servers are running without errors
- [ ] Can access frontend at http://localhost:5173
- [ ] Can access backend at http://localhost:5000/api
- [ ] Can register and login successfully
- [ ] Can perform basic CRUD operations
- [ ] No critical errors in any terminal or console

---

**If all items are checked, you're ready to use SkillLink! 🎉**

Date Completed: _______________
Completed By: _______________
