# SkillLink - Quick Access Guide

## 🚀 Start the Application

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd Skilllink-frontend
npm run dev
```

## 🌐 Access URLs

- **Main App:** http://localhost:5173
- **Login:** http://localhost:5173/#/login
- **Dashboard:** http://localhost:5173/#/app/dashboard
- **Leaderboard:** http://localhost:5173/#/app/leaderboard
- **Project Showcase:** http://localhost:5173/#/app/showcase

## 📱 New Features

### 1. Leaderboard 🏆
**Location:** Sidebar → "Leaderboard"

**What You'll See:**
- Rankings table with student positions
- 🥇🥈🥉 medals for top 3
- Your personal position card (students only)
- Score breakdown (Assignments 40%, Attendance 30%, Forum 30%)
- Statistics (assignments completed, attendance rate, helpful answers)
- Streak tracking with 🔥 badges
- Recalculate button (facilitators/admins)

**How to Use:**
1. Click "Leaderboard" in sidebar
2. View rankings and your position
3. Click "Recalculate" to update scores (facilitators only)

### 2. Project Showcase 🎨
**Location:** Sidebar → "Project Showcase"

**What You'll See:**
- Grid of project cards
- Featured projects with ⭐ banner
- Like buttons with ❤️ icons
- Comment sections 💬
- Technology badges
- Links to GitHub, live demos

**How to Use (Students):**
1. Click "Project Showcase" in sidebar
2. Browse projects from your cohort
3. Like projects by clicking the heart
4. Add comments by clicking 💬
5. Click "Add Project" to showcase your work
6. Fill in project details and submit

**How to Use (Facilitators):**
1. View all student projects
2. Like and comment on projects
3. Feature exceptional projects (backend)

### 3. Tag System 🏷️
**Location:** Assignment Q&A sections

**What You'll See:**
- Tag input field below question box
- Interactive tag badges with #prefix
- Common tag suggestions

**How to Use:**
1. Go to any assignment
2. Scroll to Q&A section
3. Type your question
4. Add tags by typing and pressing Enter
5. Remove tags by clicking ×
6. Submit your question with tags

**Common Tags:**
- #javascript
- #react
- #bug
- #help
- #css
- #error
- #deployment

## 🎯 User Roles & Access

### Students
- ✅ View leaderboard and personal position
- ✅ Add projects to showcase
- ✅ Like and comment on projects
- ✅ Ask questions with tags
- ✅ View all cohort features

### Facilitators
- ✅ View leaderboard for all cohorts
- ✅ Recalculate leaderboard scores
- ✅ View and comment on projects
- ✅ Endorse helpful answers
- ✅ Manage cohort content

### Admins
- ✅ All facilitator features
- ✅ Access predictive alerts
- ✅ Manage all cohorts
- ✅ Feature projects
- ✅ Full system access

## 📊 Feature Availability

| Feature | Students | Facilitators | Admins |
|---------|----------|--------------|--------|
| View Leaderboard | ✅ | ✅ | ✅ |
| Recalculate Scores | ❌ | ✅ | ✅ |
| Add Projects | ✅ | ❌ | ❌ |
| Like/Comment | ✅ | ✅ | ✅ |
| Feature Projects | ❌ | ❌ | ✅ |
| Use Tags | ✅ | ✅ | ✅ |

## 🔧 Troubleshooting

### Leaderboard Not Loading
- Ensure you're in a cohort
- Check backend is running
- Try clicking "Recalculate" (facilitators)

### Can't Add Project
- Verify you're logged in as a student
- Check all required fields are filled
- Ensure cohort is selected

### Tags Not Saving
- Press Enter or comma to add tags
- Check tag limit (max 5)
- Ensure no duplicates

## 📝 Quick Tips

1. **Leaderboard updates automatically** when scores change
2. **Projects can be sorted** by recent or popular
3. **Tags help categorize** questions for easier searching
4. **Featured projects** appear with a special banner
5. **Streaks are tracked** automatically for attendance

## 🎊 All Features Complete!

SkillLink now has **41/41 features** fully implemented:
- ✅ Authentication & Authorization
- ✅ Cohort Management
- ✅ Assignment System
- ✅ Submission System
- ✅ Q&A Forum with Tags
- ✅ Resource Library
- ✅ Attendance System
- ✅ Admin Analytics
- ✅ Leaderboard
- ✅ Project Showcase

**Ready for production use!** 🚀
