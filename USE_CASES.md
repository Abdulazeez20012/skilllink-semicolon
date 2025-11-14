# SkillLink - Complete Use Cases Documentation

## Overview
SkillLink is a comprehensive Learning Management System (LMS) designed for coding bootcamps and educational institutions. It facilitates seamless interaction between students, facilitators, and administrators.

---

## User Roles

### 1. **Students** 👨‍🎓
Students enrolled in coding bootcamps who need to complete assignments, collaborate with peers, and track their progress.

### 2. **Facilitators** 👨‍🏫
Instructors, mentors, and teaching assistants who guide students, grade assignments, and provide feedback.

### 3. **Administrators** 👨‍💼
System administrators who manage the platform, monitor performance, and oversee all cohorts.

---

## Detailed Use Cases by Role

## 🎓 STUDENT USE CASES

### UC-S1: Account Management
**Actor:** Student  
**Goal:** Create and manage account

**Main Flow:**
1. Student visits SkillLink landing page
2. Clicks "Sign Up"
3. Enters name, email, password
4. Selects role as "Student"
5. Submits registration
6. Receives confirmation
7. Logs in with credentials

**Postcondition:** Student has active account and can access dashboard

---

### UC-S2: Join a Cohort
**Actor:** Student  
**Goal:** Join a specific bootcamp cohort

**Main Flow:**
1. Student logs into dashboard
2. Navigates to "Cohorts" page
3. Receives invite code from facilitator
4. Enters invite code
5. Clicks "Join Cohort"
6. System validates code
7. Student is added to cohort

**Alternative Flow:**
- If invite code is invalid, system shows error message
- Student can request new code from facilitator

**Postcondition:** Student is enrolled in cohort and can see cohort assignments

---

### UC-S3: View Assignments
**Actor:** Student  
**Goal:** See all assigned tasks and their status

**Main Flow:**
1. Student navigates to "Assignments" page
2. System displays list of assignments with:
   - Assignment title
   - Due date
   - Status (Pending/Submitted/Graded/Late)
   - Grade (if graded)
3. Student can filter by status
4. Student can sort by due date
5. Student clicks on assignment to view details

**Postcondition:** Student knows what assignments need attention

---

### UC-S4: Submit Assignment
**Actor:** Student  
**Goal:** Submit completed work for grading

**Main Flow:**
1. Student opens assignment detail page
2. Reads assignment requirements
3. Completes work and uploads to GitHub
4. Enters project URL in "Submit Your Work" section
5. Clicks "Submit Assignment"
6. System validates URL
7. System creates submission record
8. Status changes to "Submitted"
9. Student sees success message

**Alternative Flow:**
- If URL is invalid, system shows error
- Student can resubmit before deadline

**Postcondition:** Assignment is submitted and awaiting grading

---

### UC-S5: View GitHub Repository Info
**Actor:** Student  
**Goal:** See GitHub repository details for submitted work

**Main Flow:**
1. Student submits assignment with GitHub URL
2. System fetches repository information:
   - Repository name
   - Last commit message
   - Last commit date
   - README preview
3. Student can click to view full repository
4. Facilitator can see same information for grading

**Postcondition:** GitHub integration provides context for submission

---

### UC-S6: Ask Questions in Q&A Forum
**Actor:** Student  
**Goal:** Get help with assignment challenges

**Main Flow:**
1. Student scrolls to "Q&A Forum" section
2. Types question in input field
3. Adds relevant tags (#javascript, #bug, #help)
4. Clicks send button
5. Question appears in forum
6. Other students and facilitators can see question
7. Student receives answers
8. Student can upvote helpful answers
9. Student can mark answer as "Accepted"

**Alternative Flow:**
- Student can search existing questions by tags
- Student can upvote existing questions

**Postcondition:** Student gets help and learns from community

---

### UC-S7: View Progress and Grades
**Actor:** Student  
**Goal:** Track academic performance

**Main Flow:**
1. Student opens assignment detail page
2. Views "Your Progress" section showing:
   - Assignment status
   - Grade (if graded)
   - Progress bar
   - Feedback from facilitator
3. Student navigates to dashboard
4. Sees overall statistics:
   - Assignments completed
   - Average grade
   - Upcoming deadlines

**Postcondition:** Student understands their performance

---

### UC-S8: View Leaderboard
**Actor:** Student  
**Goal:** See ranking among peers

**Main Flow:**
1. Student clicks "Leaderboard" in sidebar
2. System displays rankings with:
   - Student position
   - Top performers (🥇🥈🥉)
   - Total scores
   - Score breakdown (Assignments 40%, Attendance 30%, Forum 30%)
3. Student sees personal position card
4. Student views statistics:
   - Assignments completed
   - Attendance rate
   - Helpful answers
   - Current streak 🔥

**Postcondition:** Student is motivated by gamification

---

### UC-S9: Showcase Projects
**Actor:** Student  
**Goal:** Display completed projects to peers and potential employers

**Main Flow:**
1. Student clicks "Project Showcase" in sidebar
2. Clicks "Add Project" button
3. Fills in project details:
   - Title
   - Description
   - Project URL
   - GitHub URL (optional)
   - Live Demo URL (optional)
   - Screenshot URL (optional)
   - Technologies (comma-separated)
4. Submits project
5. Project appears in showcase grid
6. Other students can like and comment
7. Facilitators can feature exceptional projects

**Alternative Flow:**
- Student can edit or delete their projects
- Student can view projects from other cohorts (if permitted)

**Postcondition:** Student has portfolio of work visible to community

---

### UC-S10: Interact with Peer Projects
**Actor:** Student  
**Goal:** Engage with community projects

**Main Flow:**
1. Student browses project showcase
2. Clicks on project card to view details
3. Clicks ❤️ to like project
4. Clicks 💬 to view comments
5. Types comment and clicks "Post"
6. Clicks technology badges to filter similar projects
7. Clicks "View Project" to see live demo
8. Clicks "GitHub" to view source code

**Postcondition:** Student learns from peers and builds community

---

### UC-S11: Access Learning Resources
**Actor:** Student  
**Goal:** Find study materials and references

**Main Flow:**
1. Student navigates to "Resources" page
2. Browses resources by:
   - Type (YouTube, PDF, GitHub, Link)
   - Module/Topic
   - Tags
3. Clicks on resource to access
4. System tracks resource usage
5. Student can bookmark favorites

**Postcondition:** Student has access to curated learning materials

---

### UC-S12: Track Attendance Streak
**Actor:** Student  
**Goal:** Maintain consistent attendance

**Main Flow:**
1. Student attends class/session
2. Facilitator marks attendance
3. System updates student's streak:
   - Current streak counter
   - Longest streak record
4. Student sees streak on:
   - Dashboard
   - Leaderboard
   - Profile
5. Streak badge appears if > 5 days

**Postcondition:** Student is motivated to maintain attendance

---

## 👨‍🏫 FACILITATOR USE CASES

### UC-F1: Create and Manage Cohorts
**Actor:** Facilitator  
**Goal:** Set up new bootcamp cohort

**Main Flow:**
1. Facilitator logs in
2. Navigates to "Cohorts" page
3. Clicks "Create Cohort"
4. Enters cohort details:
   - Name
   - Description
   - Start date
   - End date
   - Programming language
   - Curriculum track
5. System generates unique invite code
6. Facilitator shares code with students
7. Students join using code

**Alternative Flow:**
- Facilitator can edit cohort details
- Facilitator can archive completed cohorts

**Postcondition:** Cohort is created and ready for students

---

### UC-F2: Assign Facilitator Roles
**Actor:** Lead Facilitator/Admin  
**Goal:** Organize teaching team

**Main Flow:**
1. Facilitator opens cohort details
2. Clicks "Manage Facilitators"
3. Adds facilitators with roles:
   - Lead Instructor
   - Mentor
   - Teaching Assistant
   - Guest Lecturer
4. Sets assignment date for each role
5. System notifies assigned facilitators
6. Role hierarchy determines permissions

**Postcondition:** Teaching team is organized with clear roles

---

### UC-F3: Create Assignments
**Actor:** Facilitator  
**Goal:** Assign work to students

**Main Flow:**
1. Facilitator navigates to "Assignments"
2. Clicks "Create Assignment"
3. Enters assignment details:
   - Title
   - Description
   - Due date
   - Module/Topic
   - Tags
   - Rubric criteria (optional)
4. Attaches resources (optional)
5. Publishes assignment
6. All cohort students receive notification

**Alternative Flow:**
- Facilitator can save as draft
- Facilitator can schedule future publication

**Postcondition:** Assignment is available to students

---

### UC-F4: Grade Submissions
**Actor:** Facilitator  
**Goal:** Evaluate student work

**Main Flow:**
1. Facilitator opens assignment detail page
2. Views "Student Submissions" section
3. Clicks on student submission
4. Reviews:
   - Project link
   - GitHub repository
   - Commit history
   - README
5. Evaluates using rubric (if available)
6. Enters grade (0-100)
7. Provides written feedback
8. Clicks "Submit Grade"
9. Student receives notification

**Alternative Flow:**
- Facilitator can request resubmission
- Facilitator can grade in bulk

**Postcondition:** Student receives grade and feedback

---

### UC-F5: Monitor Student Progress
**Actor:** Facilitator  
**Goal:** Track individual and cohort performance

**Main Flow:**
1. Facilitator views dashboard
2. Sees cohort statistics:
   - Total students
   - Average grade
   - Submission rate
   - At-risk students
3. Clicks on individual student
4. Views student profile:
   - All submissions
   - Grades
   - Attendance
   - Forum participation
5. Identifies students needing help

**Postcondition:** Facilitator can provide targeted support

---

### UC-F6: Manage Q&A Forum
**Actor:** Facilitator  
**Goal:** Support student learning through discussions

**Main Flow:**
1. Facilitator monitors Q&A forum
2. Reads student questions
3. Provides answers
4. Endorses helpful student answers (⭐)
5. Upvotes quality questions
6. Tags questions for organization
7. Archives resolved questions

**Alternative Flow:**
- Facilitator can pin important questions
- Facilitator can close duplicate questions

**Postcondition:** Students receive expert guidance

---

### UC-F7: Mark Attendance
**Actor:** Facilitator  
**Goal:** Track student attendance

**Main Flow:**
1. Facilitator opens "Attendance" page
2. Selects date
3. Views student list
4. Marks students as:
   - Present
   - Absent
   - Late
5. System updates:
   - Attendance rate
   - Streak counters
   - Leaderboard scores
6. Saves attendance record

**Alternative Flow:**
- Geofence-based automatic attendance (if enabled)
- Students can self-check-in with code

**Postcondition:** Attendance is recorded and affects leaderboard

---

### UC-F8: Recalculate Leaderboard
**Actor:** Facilitator  
**Goal:** Update student rankings

**Main Flow:**
1. Facilitator opens leaderboard page
2. Clicks "Recalculate" button
3. System recalculates scores:
   - Assignment scores (40%)
   - Attendance scores (30%)
   - Forum participation (30%)
4. Rankings update
5. Students see new positions
6. Top performers get medals

**Postcondition:** Leaderboard reflects current performance

---

### UC-F9: Feature Student Projects
**Actor:** Facilitator  
**Goal:** Highlight exceptional work

**Main Flow:**
1. Facilitator browses project showcase
2. Identifies outstanding project
3. Clicks "Feature Project" (admin action)
4. Project gets ⭐ Featured banner
5. Project appears at top of showcase
6. Student receives recognition
7. Project visible to all cohorts

**Postcondition:** Exceptional work is recognized and showcased

---

### UC-F10: Upload Learning Resources
**Actor:** Facilitator  
**Goal:** Provide study materials

**Main Flow:**
1. Facilitator navigates to "Resources"
2. Clicks "Add Resource"
3. Enters resource details:
   - Title
   - Description
   - Type (YouTube/PDF/GitHub/Link)
   - URL
   - Module/Topic
   - Tags
4. Assigns to cohort(s)
5. Publishes resource
6. Students can access immediately

**Postcondition:** Students have curated learning materials

---

## 👨‍💼 ADMINISTRATOR USE CASES

### UC-A1: System Configuration
**Actor:** Administrator  
**Goal:** Configure platform settings

**Main Flow:**
1. Admin logs in
2. Accesses admin panel
3. Configures:
   - Email settings
   - Authentication settings
   - Storage settings
   - API integrations
4. Sets system-wide policies
5. Saves configuration

**Postcondition:** System operates with configured settings

---

### UC-A2: Manage All Cohorts
**Actor:** Administrator  
**Goal:** Oversee all bootcamp cohorts

**Main Flow:**
1. Admin views all cohorts
2. Monitors cohort health:
   - Enrollment numbers
   - Completion rates
   - Average grades
   - Facilitator performance
3. Creates/edits/archives cohorts
4. Assigns facilitators
5. Resolves conflicts

**Postcondition:** All cohorts are properly managed

---

### UC-A3: View Predictive Alerts
**Actor:** Administrator  
**Goal:** Identify at-risk students early

**Main Flow:**
1. Admin clicks "Predictive Alerts"
2. System displays analytics:
   - Cohort health scores
   - At-risk student list
   - Risk factors:
     - Low attendance
     - Missing assignments
     - Poor grades
     - Low forum participation
3. Admin reviews risk scores
4. Assigns interventions
5. Notifies facilitators

**Alternative Flow:**
- Admin can set custom risk thresholds
- Admin can export reports

**Postcondition:** At-risk students receive timely support

---

### UC-A4: Manage User Accounts
**Actor:** Administrator  
**Goal:** Control user access

**Main Flow:**
1. Admin views user list
2. Can:
   - Create new users
   - Edit user details
   - Change user roles
   - Deactivate accounts
   - Reset passwords
   - View user activity logs
3. Enforces security policies

**Postcondition:** User accounts are properly managed

---

### UC-A5: Monitor System Performance
**Actor:** Administrator  
**Goal:** Ensure platform reliability

**Main Flow:**
1. Admin views system dashboard
2. Monitors:
   - Server health
   - Database performance
   - API response times
   - Error logs
   - User activity
3. Identifies issues
4. Takes corrective action

**Postcondition:** System runs smoothly

---

### UC-A6: Generate Reports
**Actor:** Administrator  
**Goal:** Create analytics reports

**Main Flow:**
1. Admin navigates to reports section
2. Selects report type:
   - Cohort performance
   - Student progress
   - Facilitator effectiveness
   - Resource usage
   - Attendance trends
3. Sets date range
4. Generates report
5. Exports as PDF/CSV
6. Shares with stakeholders

**Postcondition:** Data-driven insights available

---

### UC-A7: Configure Plagiarism Detection
**Actor:** Administrator  
**Goal:** Set up plagiarism checking

**Main Flow:**
1. Admin accesses plagiarism settings
2. Configures detection service:
   - Copyscape API
   - MOSS integration
   - Turnitin connection
3. Sets detection thresholds
4. Enables automatic checking
5. Configures alert notifications

**Postcondition:** Plagiarism detection is active

---

### UC-A8: Manage Integrations
**Actor:** Administrator  
**Goal:** Connect external services

**Main Flow:**
1. Admin opens integrations panel
2. Configures:
   - GitHub OAuth
   - Email service (SendGrid)
   - Cloud storage
   - Analytics tools
3. Tests connections
4. Enables integrations
5. Monitors usage

**Postcondition:** External services are integrated

---

## 🔄 CROSS-ROLE USE CASES

### UC-CR1: Real-time Notifications
**Actors:** All Users  
**Goal:** Stay informed of important events

**Events:**
- New assignment published
- Assignment graded
- Question answered
- Project liked/commented
- Attendance marked
- Deadline approaching
- Leaderboard position changed

**Postcondition:** Users are notified of relevant activities

---

### UC-CR2: Profile Management
**Actors:** All Users  
**Goal:** Maintain personal information

**Main Flow:**
1. User clicks profile icon
2. Views/edits:
   - Name
   - Email
   - Avatar
   - Bio
   - Skills
   - Social links
3. Changes password
4. Updates preferences
5. Saves changes

**Postcondition:** Profile is up to date

---

### UC-CR3: Search and Filter
**Actors:** All Users  
**Goal:** Find specific content quickly

**Main Flow:**
1. User uses search bar
2. Enters keywords
3. Filters by:
   - Type (assignment/resource/project)
   - Date range
   - Status
   - Tags
4. Views results
5. Clicks to access content

**Postcondition:** User finds desired content

---

### UC-CR4: Dark Mode Toggle
**Actors:** All Users  
**Goal:** Customize visual experience

**Main Flow:**
1. User clicks theme toggle
2. System switches between:
   - Light mode
   - Dark mode
3. Preference is saved
4. Applied across all pages

**Postcondition:** User has preferred theme

---

## 📊 SYSTEM USE CASES

### UC-SYS1: Automatic Leaderboard Updates
**Actor:** System  
**Goal:** Keep rankings current

**Trigger:** Any score-affecting event  
**Process:**
1. Student submits assignment → +points
2. Assignment graded → update score
3. Attendance marked → update score
4. Helpful answer endorsed → +points
5. System recalculates rankings
6. Updates leaderboard display

**Postcondition:** Leaderboard is always current

---

### UC-SYS2: Deadline Notifications
**Actor:** System  
**Goal:** Remind users of upcoming deadlines

**Trigger:** Scheduled job  
**Process:**
1. System checks assignments daily
2. Identifies deadlines within 24 hours
3. Sends email notifications
4. Shows in-app alerts
5. Updates dashboard

**Postcondition:** Users are reminded of deadlines

---

### UC-SYS3: Automatic Backup
**Actor:** System  
**Goal:** Protect data

**Trigger:** Scheduled (daily)  
**Process:**
1. System backs up database
2. Backs up uploaded files
3. Stores in cloud storage
4. Verifies backup integrity
5. Logs backup status

**Postcondition:** Data is safely backed up

---

## 🎯 SUCCESS METRICS

### Student Success
- Assignment completion rate > 90%
- Average grade > 75%
- Forum participation > 50%
- Attendance rate > 85%
- Project showcase participation > 60%

### Facilitator Effectiveness
- Grading turnaround < 48 hours
- Forum response time < 24 hours
- Student satisfaction > 4/5
- Resource upload frequency

### Platform Health
- System uptime > 99.5%
- Page load time < 2 seconds
- API response time < 500ms
- Zero data loss
- User retention > 90%

---

## 📱 MOBILE CONSIDERATIONS

All use cases are designed to work on:
- Desktop browsers
- Tablet devices
- Mobile phones (responsive design)
- Progressive Web App (PWA) capabilities

---

## 🔐 SECURITY CONSIDERATIONS

- All use cases require authentication
- Role-based access control (RBAC)
- Data encryption in transit and at rest
- Session management
- CSRF protection
- XSS prevention
- SQL injection prevention

---

## 🌐 ACCESSIBILITY

All use cases support:
- Screen readers
- Keyboard navigation
- High contrast mode
- Adjustable font sizes
- ARIA labels
- WCAG 2.1 AA compliance

---

**Document Version:** 1.0  
**Last Updated:** November 14, 2025  
**Status:** Complete and Implemented ✅
