import { User, UserRole, Assignment, AssignmentStatus, Submission, Resource, ResourceType, DiscussionMessage, Cohort } from './types';
import { USER_AVATARS, COHORT_IMAGES } from './images';

// App Routes
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/app/dashboard',
  COHORTS: '/app/cohorts',
  COHORT_DETAIL: '/app/cohorts/:id',
  ASSIGNMENTS: '/app/assignments',
  ASSIGNMENT_DETAIL: '/app/assignments/:id',
  DISCUSSIONS: '/app/discussions',
  RESOURCES: '/app/resources',
  PROFILE: '/app/profile',
};

// Mock Data
export const MOCK_FACILITATOR: User = {
  id: 'facilitator-01',
  name: 'Dr. Ada Lovelace',
  email: 'ada@semicolon.tech',
  role: UserRole.FACILITATOR,
  avatarUrl: USER_AVATARS.ADA_LOVELACE,
  joinDate: '2022-08-15T10:00:00Z',
  cohorts: ['cohort-java-2024', 'cohort-python-2024'],
};

export const MOCK_STUDENT: User = {
  id: 'student-01',
  name: 'Charles Babbage',
  email: 'charles@semicolon.tech',
  role: UserRole.STUDENT,
  avatarUrl: USER_AVATARS.CHARLES_BABBAGE,
  joinDate: '2023-01-20T14:30:00Z',
  cohorts: ['cohort-java-2024'],
};

const MOCK_STUDENTS_LIST = [
    MOCK_STUDENT,
    { id: 'student-02', name: 'Grace Hopper', avatarUrl: USER_AVATARS.GRACE_HOPPER, cohorts: ['cohort-java-2024'] },
    { id: 'student-03', name: 'Alan Turing', avatarUrl: USER_AVATARS.ALAN_TURING, cohorts: ['cohort-python-2024'] },
    { id: 'student-04', name: 'Margaret Hamilton', avatarUrl: USER_AVATARS.MARGARET_HAMILTON, cohorts: ['cohort-python-2024'] },
] as Pick<User, 'id' | 'name' | 'avatarUrl'>[];


export let MOCK_COHORTS: Cohort[] = [
    {
        id: 'cohort-java-2024',
        name: 'Cohort 1 - Java',
        description: 'A deep dive into Java programming, from fundamentals to advanced enterprise applications.',
        facilitators: [MOCK_FACILITATOR],
        students: MOCK_STUDENTS_LIST.filter(s => s.id !== 'student-03' && s.id !== 'student-04'),
        imageUrl: COHORT_IMAGES.JAVA,
        tags: ['Java', 'Backend'],
    },
    {
        id: 'cohort-python-2024',
        name: 'Cohort 2 - Python',
        description: 'Master Python for data science, web development, and automation.',
        facilitators: [MOCK_FACILITATOR],
        students: MOCK_STUDENTS_LIST.filter(s => s.id === 'student-03' || s.id === 'student-04'),
        imageUrl: COHORT_IMAGES.PYTHON,
        tags: ['Python', 'Data Science'],
    },
    {
        id: 'cohort-frontend-2024',
        name: 'Cohort 3 - Frontend',
        description: 'Become a master of the modern frontend with React, Tailwind, and TypeScript.',
        facilitators: [{ id: 'fac-02', name: 'Tim Berners-Lee', avatarUrl: USER_AVATARS.TIM_BERNERS_LEE }],
        students: [],
        imageUrl: COHORT_IMAGES.FRONTEND,
        tags: ['React', 'Frontend'],
    }
];

export let MOCK_RESOURCES: Resource[] = [
    { id: 'res-01', title: 'React Official Docs', description: 'The official documentation for React.', type: ResourceType.LINK, url: 'https://react.dev' },
    { id: 'res-02', title: 'Tailwind CSS Crash Course', description: 'A comprehensive video tutorial on Tailwind CSS.', type: ResourceType.YOUTUBE, url: 'https://youtube.com' },
    { id: 'res-03', title: 'Modern JavaScript Deep Dive', description: 'An in-depth PDF book on advanced JS concepts.', type: ResourceType.PDF, url: '#' },
    { id: 'res-04', title: 'SkillLink Project Repository', description: 'The source code for this project on GitHub.', type: ResourceType.GITHUB, url: 'https://github.com' },
];

export let MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Build a Responsive Portfolio Website',
    description: 'Create a personal portfolio website using React and Tailwind CSS. It should be fully responsive and showcase at least three of your projects.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: AssignmentStatus.PENDING,
    facilitator: MOCK_FACILITATOR,
    resources: [MOCK_RESOURCES[0], MOCK_RESOURCES[1]],
    cohortId: 'cohort-java-2024',
  },
  {
    id: 'asg-02',
    title: 'State Management with Context API',
    description: 'Implement a theme switcher (light/dark mode) for a simple application using React\'s Context API. No external libraries allowed for state management.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: AssignmentStatus.SUBMITTED,
    facilitator: MOCK_FACILITATOR,
    resources: [MOCK_RESOURCES[0]],
    cohortId: 'cohort-java-2024',
  },
  {
    id: 'asg-03',
    title: 'Backend API Integration',
    description: 'Connect a React frontend to a mock API. You need to fetch, display, and create data. Handle loading and error states gracefully.',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: AssignmentStatus.GRADED,
    facilitator: MOCK_FACILITATOR,
    resources: [],
    cohortId: 'cohort-python-2024',
  },
   {
    id: 'asg-04',
    title: 'Final Project: Full-Stack Application',
    description: 'Develop a full-stack MERN application of your choice. The project must include user authentication, CRUD operations, and be deployed to a cloud service.',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: AssignmentStatus.PENDING,
    facilitator: MOCK_FACILITATOR,
    resources: [MOCK_RESOURCES[3]],
    cohortId: 'cohort-python-2024',
  },
];

export let MOCK_SUBMISSIONS: Submission[] = [
    {
        id: 'sub-01',
        student: { id: 'student-02', name: 'Grace Hopper', avatarUrl: USER_AVATARS.GRACE_HOPPER },
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        grade: 95,
        feedback: 'Excellent work! The UI is clean and the code is well-structured.',
        projectLink: 'https://gracehopper.dev',
        status: AssignmentStatus.GRADED,
    },
    {
        id: 'sub-02',
        student: MOCK_STUDENT,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        grade: null,
        feedback: null,
        projectLink: 'https://charlesbabbage.dev',
        status: AssignmentStatus.SUBMITTED,
    }
];

export let MOCK_DISCUSSION_MESSAGES: DiscussionMessage[] = [
    { id: 'msg-01', user: MOCK_FACILITATOR, content: 'Welcome to the discussion for Assignment 1! Feel free to ask any questions here.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-02', user: MOCK_STUDENT, content: 'Thanks! For the portfolio, are we allowed to use any component libraries like ShadCN?', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-03', user: MOCK_FACILITATOR, content: 'Good question! For this assignment, I\'d prefer you build the components from scratch using Tailwind CSS to practice your styling skills.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
];