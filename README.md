# SkillLink by Semicolon - Backend API

A learning and assignment management platform for facilitators and students at Semicolon Tech School.

## Tech Stack

- **Node.js** + **Express.js** - Server-side framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication
- **BCrypt** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

## Project Structure

```
skilllink-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── app.js
├── .env
├── package.json
└── server.js
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Run the server: `npm run dev` (development) or `npm start` (production)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### 🔐 Authentication

| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| POST   | `/api/auth/register`| Register new user   |
| POST   | `/api/auth/login`   | Login existing user |

### 👥 Cohort Management

| Method | Endpoint                               | Description                      |
|--------|----------------------------------------|----------------------------------|
| POST   | `/api/cohorts`                         | Create cohort (Admin only)       |
| GET    | `/api/cohorts`                         | Get all cohorts                  |
| GET    | `/api/cohorts/:id`                     | Get cohort by ID                 |
| PUT    | `/api/cohorts/:id`                     | Update cohort (Admin only)       |
| DELETE | `/api/cohorts/:id`                     | Delete cohort (Admin only)       |
| POST   | `/api/cohorts/:id/facilitators`        | Assign facilitator (Admin only)  |
| DELETE | `/api/cohorts/:id/facilitators/:userId`| Remove facilitator (Admin only)  |
| POST   | `/api/cohorts/:id/students`            | Enroll student (Admin only)      |
| DELETE | `/api/cohorts/:id/students/:userId`    | Unenroll student (Admin only)    |
| POST   | `/api/cohorts/:id/assignments`         | Post assignment (Facilitator)    |
| GET    | `/api/cohorts/:id/assignments`         | Get cohort assignments           |

### 👩‍🏫 Facilitator Routes

| Method | Endpoint                           | Description                    |
|--------|------------------------------------|--------------------------------|
| POST   | `/api/assignments`                 | Create assignment              |
| GET    | `/api/assignments/:id/submissions` | View all student submissions   |
| PUT    | `/api/submissions/:id/grade`       | Grade and provide feedback     |
| POST   | `/api/resources`                   | Upload or share resource link  |
| DELETE | `/api/resources/:id`               | Delete resource                |

### 👨‍🎓 Student Routes

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/api/assignments`        | View all assignments            |
| GET    | `/api/assignments/:id`    | View single assignment details  |
| POST   | `/api/submissions`        | Submit assignment               |
| GET    | `/api/submissions/me`     | View all user submissions       |
| PUT    | `/api/submissions/:id`    | Update submission               |
| DELETE | `/api/submissions/:id`    | Delete submission               |

### 💬 Discussion Routes

| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| POST   | `/api/discussions/:assignmentId`      | Add comment           |
| GET    | `/api/discussions/:assignmentId`      | View all comments     |
| DELETE | `/api/discussions/:assignmentId/:commentId` | Delete comment  |

### 📚 Resource Routes

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/resources`  | View all resources       |

## Database Models

### User Model
- name: String
- email: String (unique)
- password: String (hashed)
- role: { type: String, enum: ['student', 'facilitator', 'admin'] }
- joinedDate: Date
- avatar: String (optional)
- cohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' }

### Assignment Model
- title: String
- description: String
- dueDate: Date
- resources: [String]
- createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
- cohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' }
- createdAt: Date

### Submission Model
- assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }
- studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
- projectLink: String
- fileUpload: String (optional)
- grade: Number
- feedback: String
- submittedAt: Date

### Discussion Model
- assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }
- comments: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: Date
  }
]

### Resource Model
- title: String
- link: String
- uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
- uploadedAt: Date

### Cohort Model
- name: String (unique)
- description: String
- programmingLanguage: String
- facilitators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
- students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
- assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }]

## Role-Based Access Control

- **Students** can view assignments, submit assignments, and participate in discussions
- **Facilitators** can create assignments, grade submissions, upload resources, and manage discussions
- **Admins** can manage cohorts, assign facilitators and students to cohorts, and perform administrative tasks

## License

MIT