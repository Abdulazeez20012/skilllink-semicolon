# SkillLink - Quick Start Guide

Get up and running with SkillLink in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v16+) - Run `node --version`
- ✅ MongoDB installed and running - Run `mongod --version`
- ✅ npm installed - Run `npm --version`

## 🚀 Quick Start (Windows)

### Option 1: One-Click Start (Recommended)

Double-click `start-all.bat` - This will:
- Install all dependencies automatically
- Start backend on http://localhost:5000
- Start frontend on http://localhost:5173
- Open two terminal windows

### Option 2: Manual Start

```bash
# Terminal 1 - Backend
npm install
npm run dev

# Terminal 2 - Frontend (new terminal)
cd Skilllink-frontend
npm install
npm run dev
```

## 🚀 Quick Start (Mac/Linux)

```bash
# Terminal 1 - Start MongoDB
sudo systemctl start mongod  # or: brew services start mongodb-community

# Terminal 2 - Backend
npm install
npm run dev

# Terminal 3 - Frontend
cd Skilllink-frontend
npm install
npm run dev
```

## 📱 Access the Application

Once both servers are running:

1. **Frontend:** Open http://localhost:5173 in your browser
2. **Backend API:** http://localhost:5000/api

## 👤 Create Your First Account

1. Click "Get Started" or "Sign Up"
2. Fill in the registration form:
   - Name: Your Name
   - Email: your.email@example.com
   - Password: (minimum 6 characters)
   - Role: Choose Student, Facilitator, or Admin
3. Click "Sign Up"
4. You'll be automatically logged in and redirected to the dashboard

## 🎯 Quick Feature Tour

### As a Student:
1. **Join a Cohort** - Use an invite code or get enrolled by admin
2. **View Assignments** - See all assignments for your cohorts
3. **Submit Work** - Submit GitHub links or upload files
4. **Track Attendance** - Scan QR codes to mark attendance
5. **Participate in Discussions** - Ask questions and help peers

### As a Facilitator:
1. **Create Cohorts** - Set up new learning cohorts
2. **Post Assignments** - Create assignments with rubrics
3. **Grade Submissions** - Review and grade student work
4. **Share Resources** - Upload learning materials
5. **Generate QR Codes** - Create attendance QR codes

### As an Admin:
1. **Manage Cohorts** - Full cohort management
2. **Assign Facilitators** - Add facilitators to cohorts
3. **Enroll Students** - Add students to cohorts
4. **Monitor Health** - View cohort health scores
5. **View Alerts** - See at-risk student predictions

## 🔧 Troubleshooting

### Backend won't start?

```bash
# Check if MongoDB is running
mongod --version

# Check if port 5000 is available
netstat -ano | findstr :5000  # Windows
lsof -ti:5000                  # Mac/Linux

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Frontend won't start?

```bash
# Check if port 5173 is available
netstat -ano | findstr :5173  # Windows
lsof -ti:5173                  # Mac/Linux

# Reinstall dependencies
cd Skilllink-frontend
rm -rf node_modules
npm install
```

### Can't connect to MongoDB?

1. **Local MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **MongoDB Atlas:**
   - Update `MONGO_URI` in `.env` file
   - Ensure your IP is whitelisted in Atlas

### CORS Errors?

Ensure `.env` has:
```
CLIENT_URL=http://localhost:5173
```

## 📚 Next Steps

1. ✅ Read `SETUP.md` for detailed setup instructions
2. ✅ Check `FIXES_APPLIED.md` to see what was fixed
3. ✅ Review `README.md` for API documentation
4. ✅ Explore the application features

## 🎓 Sample Test Flow

### Complete User Journey:

1. **Register as Admin**
   - Email: admin@test.com
   - Password: admin123
   - Role: Admin

2. **Create a Cohort**
   - Name: "Test Cohort - JavaScript"
   - Description: "Learning JavaScript fundamentals"
   - Programming Language: JavaScript
   - Start Date: Today
   - End Date: 3 months from now

3. **Register as Facilitator**
   - Email: facilitator@test.com
   - Password: fac123
   - Role: Facilitator

4. **Assign Facilitator to Cohort** (as Admin)
   - Go to Cohort Details
   - Add facilitator

5. **Create an Assignment** (as Facilitator)
   - Title: "Build a Calculator"
   - Description: "Create a basic calculator using JavaScript"
   - Due Date: 1 week from now
   - Add rubric criteria

6. **Register as Student**
   - Email: student@test.com
   - Password: student123
   - Role: Student

7. **Join Cohort** (as Student)
   - Use the invite code from cohort details

8. **Submit Assignment** (as Student)
   - Add GitHub repository link
   - Submit

9. **Grade Submission** (as Facilitator)
   - Review submission
   - Add grade and feedback
   - Submit grade

10. **Mark Attendance** (as Facilitator & Student)
    - Facilitator generates QR code
    - Student scans and marks attendance

## 🎉 You're All Set!

The application is now running and ready for use. Explore all the features and enjoy using SkillLink!

## 📞 Need Help?

- Check the detailed `SETUP.md` guide
- Review error messages in the terminal
- Ensure all prerequisites are met
- Verify MongoDB is running
- Check that ports 5000 and 5173 are available

---

**Happy Learning! 🚀**
