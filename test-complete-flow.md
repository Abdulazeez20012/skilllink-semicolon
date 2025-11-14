# Complete Flow Test - Verify Everything Works

## Prerequisites
```bash
# Terminal 1 - Start Backend
npm run dev

# Terminal 2 - Start Frontend
cd Skilllink-frontend
npm run dev
```

## Test Flow 1: Student Journey

### 1. Register as Student
- Go to http://localhost:5173/#/signup
- Enter:
  - Name: Test Student
  - Email: student@test.com
  - Password: password123
  - Role: Student
- Click "Sign Up"
- **Expected:** Redirected to dashboard

### 2. Join Cohort
- Go to Cohorts page
- Click "Join Cohort"
- Enter invite code (get from facilitator)
- Click "Join"
- **Expected:** Added to cohort, see cohort in list

### 3. View Assignments
- Go to Assignments page
- **Expected:** See list of assignments

### 4. Submit Assignment
- Click on an assignment
- Enter project URL
- Click "Submit Assignment"
- **Expected:** Success message, status changes to "Submitted"

### 5. View Leaderboard
- Click "Leaderboard" in sidebar
- **Expected:** See rankings, your position

### 6. Add Project to Showcase
- Click "Project Showcase" in sidebar
- Click "Add Project"
- Fill in details
- Submit
- **Expected:** Project appears in showcase

---

## Test Flow 2: Facilitator Journey

### 1. Register as Facilitator
- Go to http://localhost:5173/#/signup
- Enter:
  - Name: Test Facilitator
  - Email: facilitator@test.com
  - Password: password123
  - Role: Facilitator
- Click "Sign Up"

### 2. Create Cohort
- Go to Cohorts page
- Click "Create Cohort"
- Fill in:
  - Name: Test Cohort 2025
  - Description: Test cohort for verification
  - Programming Language: JavaScript
  - Start Date: Today
  - End Date: 3 months from now
  - Curriculum Track: Full-Stack
- Click "Save"
- **Expected:** Cohort created, invite code shown

### 3. Create Assignment
- Go to cohort detail page
- Click "Create Assignment"
- Fill in:
  - Title: Test Assignment
  - Description: Complete this test
  - Due Date: Next week
- Click "Create"
- **Expected:** Assignment created, visible to students

### 4. Grade Submission
- Go to assignment detail page
- View student submissions
- Enter grade and feedback
- Click "Submit Grade"
- **Expected:** Student receives grade

---

## Test Flow 3: Admin Journey

### 1. Login as Admin
- Use admin credentials from ADMIN_REGISTRATION_GUIDE.md

### 2. View Predictive Alerts
- Click "Predictive Alerts" in sidebar
- **Expected:** See at-risk students

### 3. View Cohort Health
- Go to any cohort
- View health score
- **Expected:** See metrics and statistics

---

## Verification Checklist

### Backend API
- [ ] POST /api/auth/register works
- [ ] POST /api/auth/login works
- [ ] GET /api/cohorts works
- [ ] POST /api/cohorts works
- [ ] POST /api/cohorts/join/:inviteCode works
- [ ] GET /api/assignments works
- [ ] POST /api/submissions works
- [ ] GET /api/leaderboard/:cohortId works
- [ ] GET /api/showcase/cohort/:cohortId works

### Frontend Pages
- [ ] Login page works
- [ ] Dashboard loads
- [ ] Cohorts page loads
- [ ] Assignments page loads
- [ ] Assignment detail page loads
- [ ] Leaderboard page loads
- [ ] Showcase page loads
- [ ] Q&A forum works

### Data Flow
- [ ] Token saved to localStorage
- [ ] API calls include Authorization header
- [ ] Data displays correctly
- [ ] Forms submit successfully
- [ ] Errors show toast messages

---

## Common Issues & Fixes

### Issue: "Network Error"
**Fix:** Make sure backend is running on port 5000

### Issue: "Unauthorized"
**Fix:** Check token in localStorage, try logging in again

### Issue: "CORS Error"
**Fix:** Backend should have CORS enabled (already configured)

### Issue: "No data showing"
**Fix:** Check console for errors, verify API calls in Network tab

---

## Success Criteria

✅ Can register and login
✅ Can create and join cohorts
✅ Can create and submit assignments
✅ Can view and update leaderboard
✅ Can add and view projects in showcase
✅ Q&A forum works
✅ Grading system works

**If all above work, the app is PRODUCTION READY!**
