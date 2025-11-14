# Admin Registration Guide

## 🔐 How to Register as Admin

The SkillLink application now includes an **Admin role selector** on the signup page. Here's how to register as an admin:

---

## 📝 Step-by-Step Guide

### 1. Navigate to Signup Page
- Open your browser and go to: **http://localhost:5173**
- Click on **"Get Started"** or **"Sign Up"** button
- Or directly visit: **http://localhost:5173/#/signup**

### 2. Fill in Your Details
- **Full Name:** Enter your name (e.g., "John Admin")
- **Email Address:** Enter your email (e.g., "admin@example.com")
- **Password:** Enter a secure password (minimum 6 characters)

### 3. Select Admin Role ✨ NEW
You'll see three role options:
- **Student** - For learners
- **Facilitator** - For instructors
- **Admin** - For administrators ⭐

Click on the **"Admin"** button to select the admin role.

### 4. Complete Registration
- Click the **"Sign Up"** button
- You'll be automatically logged in
- You'll be redirected to the dashboard

---

## 🎯 Admin Features Access

Once logged in as admin, you'll have access to:

### Navigation Menu
- ✅ Dashboard (with admin analytics)
- ✅ Assignments
- ✅ Cohorts
- ✅ Discussions
- ✅ Resources
- ✅ **Predictive Alerts** ⭐ (Admin Only)
- ✅ Profile

### Admin-Specific Features
1. **Cohort Health Monitoring**
   - View health scores for all cohorts
   - See metrics breakdown (Attendance, Completion, Forum Activity)
   - Monitor cohort statistics

2. **Predictive Alerts**
   - Identify at-risk students
   - View risk scores and factors
   - See attendance and submission patterns
   - Track student streaks

3. **Cohort Management**
   - Create and manage cohorts
   - Assign facilitators to cohorts
   - Enroll students in cohorts
   - Update cohort settings

4. **Full Analytics Dashboard**
   - Total students across all cohorts
   - Total facilitators
   - Active cohorts count
   - Assignment statistics
   - Cohort distribution charts

---

## 🧪 Test Admin Account

You can create a test admin account with these details:

```
Name: Test Admin
Email: admin@test.com
Password: admin123456
Role: Admin
```

---

## 🔄 Switching Between Roles

If you want to test different roles:

1. **Logout** from current account
2. **Sign Up** with a different email
3. **Select different role** (Student, Facilitator, or Admin)
4. **Complete registration**

---

## 📊 Role Comparison

| Feature | Student | Facilitator | Admin |
|---------|---------|-------------|-------|
| View Assignments | ✅ | ✅ | ✅ |
| Submit Assignments | ✅ | ❌ | ❌ |
| Create Assignments | ❌ | ✅ | ✅ |
| Grade Submissions | ❌ | ✅ | ✅ |
| Create Cohorts | ❌ | ✅ | ✅ |
| Manage Members | ❌ | ❌ | ✅ |
| View Health Scores | ❌ | ❌ | ✅ |
| Predictive Alerts | ❌ | ❌ | ✅ |
| Full Analytics | ❌ | ❌ | ✅ |

---

## 🎨 Visual Guide

### Signup Page Layout

```
┌─────────────────────────────────────────┐
│  SkillLink Logo & Branding              │
│                                         │
│  Create Account                         │
│  Join the community.                    │
│                                         │
│  Full Name: [________________]          │
│                                         │
│  I am a...                              │
│  ┌─────────┬──────────┬────────┐       │
│  │ Student │Facilitator│ Admin  │       │
│  └─────────┴──────────┴────────┘       │
│                                         │
│  Email: [____________________]          │
│  Password: [_________________]          │
│                                         │
│  [      Sign Up Button      ]          │
│                                         │
│  Already have an account? Log In        │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start Commands

### Register Admin via API (Alternative Method)

If you prefer to register via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123456",
    "role": "admin"
  }'
```

### PowerShell (Windows)

```powershell
$body = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "admin123456"
    role = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

---

## ✅ Verification

After registering as admin, verify your access:

1. **Check Navigation Menu**
   - You should see "Predictive Alerts" link in the sidebar

2. **Visit Dashboard**
   - You should see admin analytics
   - Cohort health visualization
   - Assignment status charts

3. **Access Predictive Alerts**
   - Navigate to `/app/alerts`
   - Select a cohort
   - View at-risk students

---

## 🐛 Troubleshooting

### Issue: Role selector not showing
**Solution:** Make sure you're on the **Signup** page, not the Login page. The role selector only appears during registration.

### Issue: Can't see admin features
**Solution:** 
1. Logout and login again
2. Verify your role in the profile section
3. Check that you selected "Admin" during registration

### Issue: Registration fails
**Solution:**
1. Check that email is unique (not already registered)
2. Ensure password is at least 6 characters
3. Verify backend is running on port 5000

---

## 📞 Support

If you encounter any issues:
1. Check that both servers are running
2. Clear browser cache and cookies
3. Try registering with a different email
4. Check browser console for errors

---

## 🎉 Success!

Once registered as admin, you'll have full access to:
- ✅ All student features
- ✅ All facilitator features
- ✅ Admin-only analytics
- ✅ Predictive alerts
- ✅ Cohort health monitoring
- ✅ Full system management

**Enjoy your admin privileges! 🚀**

---

**Last Updated:** November 13, 2025  
**Version:** 1.0.0
