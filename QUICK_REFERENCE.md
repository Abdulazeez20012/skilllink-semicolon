# SkillLink - Quick Reference Card

## 🚀 Quick Start

```bash
# Start everything
start-all.bat

# Or manually
npm run dev                           # Backend
cd Skilllink-frontend && npm run dev  # Frontend
```

## 🌐 Access Points

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000/api
- **Health:** http://localhost:5000/api

## 👥 Test Users

Create users via UI at http://localhost:5173/signup

**Roles (Select during signup):**
- `Student` - View and submit assignments
- `Facilitator` - Create and grade assignments
- `Admin` ⭐ - Full access + analytics + alerts

**To register as Admin:**
1. Go to http://localhost:5173/#/signup
2. Fill in your details
3. Click on "Admin" button in role selector
4. Complete registration

## 📊 Key Features

### Student
- Join cohorts with invite code
- Submit assignments
- Participate in Q&A
- Track progress

### Facilitator
- Create cohorts & assignments
- Grade with rubrics
- Generate QR codes
- Manage attendance

### Admin
- View cohort health
- Predictive alerts
- Manage members
- Analytics

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Cohorts
- `GET /api/cohorts` - List all
- `POST /api/cohorts` - Create
- `POST /api/cohorts/join/:code` - Join

### Assignments
- `GET /api/assignments` - List all
- `POST /api/assignments` - Create
- `PUT /api/submissions/:id/grade` - Grade

### Admin
- `GET /api/cohorts/:id/health` - Health score
- `GET /api/cohorts/:id/alerts` - Alerts

## 📁 Important Files

- `.env` - Backend config
- `Skilllink-frontend/.env.local` - Frontend config
- `COMPLETE_PROJECT_SUMMARY.md` - Full docs

## 🐛 Troubleshooting

**MongoDB not running?**
```bash
net start MongoDB  # Windows
```

**Port in use?**
```bash
netstat -ano | findstr :5000  # Check port
taskkill /PID <PID> /F        # Kill process
```

**Module errors?**
```bash
npm install                    # Backend
cd Skilllink-frontend && npm install  # Frontend
```

## 📚 Documentation

1. **QUICK_START.md** - 5-min setup
2. **SETUP.md** - Detailed setup
3. **API_TEST_REPORT.md** - API tests
4. **UI_INTEGRATION_TEST_REPORT.md** - Integration tests
5. **COMPLETE_PROJECT_SUMMARY.md** - Everything

## ✅ Status

- Backend: ✅ Running
- Frontend: ✅ Running
- Database: ✅ Connected
- Tests: ✅ 100% Pass
- Integration: ✅ Seamless

**Ready for use! 🎉**
