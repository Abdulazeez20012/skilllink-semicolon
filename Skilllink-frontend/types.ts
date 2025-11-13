export enum UserRole {
  STUDENT = 'student',
  FACILITATOR = 'facilitator',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  joinDate: string;
  cohorts: string[]; // Array of cohort IDs
  // Attendance streak tracking
  currentStreak?: number;
  longestStreak?: number;
}

export enum AssignmentStatus {
  PENDING = 'Pending',
  SUBMITTED = 'Submitted',
  GRADED = 'Graded',
  LATE = 'Late',
}

export interface RubricCriterion {
  id: string;
  criterion: string;
  description?: string;
  maxPoints: number;
}

export interface RubricScore {
  criterionId: string;
  points: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  facilitator: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  resources: Resource[];
  cohortId: string;
  rubric?: RubricCriterion[];
  // Additional fields
  module?: string;
  tags?: string[];
}

export interface Submission {
  id: string;
  student: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  submittedAt: string;
  grade: number | null;
  feedback: string | null;
  projectLink?: string;
  fileUrl?: string;
  status: AssignmentStatus;
  // Rubric-based grading fields
  rubricScores?: RubricScore[];
  // GitHub integration fields
  githubRepoUrl?: string;
  githubCommitMessage?: string;
  githubLastCommitDate?: string;
  githubReadme?: string;
}

export interface DiscussionMessage {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  content: string;
  timestamp: string;
  // Q&A Forum features
  upvotes?: number;
  isAcceptedAnswer?: boolean;
  isEndorsed?: boolean;
}

export enum ResourceType {
    YOUTUBE = 'YouTube',
    PDF = 'PDF',
    GITHUB = 'GitHub',
    LINK = 'Link'
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    url: string;
    // Additional fields
    cohortId?: string;
    module?: string;
    tags?: string[];
}

export interface CurriculumItem {
  week: number;
  topics: string[];
  assignments: string[]; // Assignment IDs
}

export interface AttendanceRecord {
  id: string;
  sessionDate: string;
  students: {
    student: Pick<User, 'id' | 'name' | 'email'>;
    timestamp: string;
  }[];
  geofenceEnabled?: boolean;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  facilitators: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
  students: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
  imageUrl: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  curriculumTrack?: string;
  curriculum?: CurriculumItem[];
  inviteCode?: string;
  // Additional fields for enhanced cohort management
  programmingLanguage?: string;
}

// Admin dashboard types
export interface CohortHealthData {
  cohortId: string;
  cohortName: string;
  healthScore: number;
  healthStatus: string;
  metrics: {
    attendance: {
      score: number;
      weight: string;
    };
    completion: {
      score: number;
      weight: string;
    };
    forumActivity: {
      score: number;
      weight: string;
    };
  };
  statistics: {
    totalStudents: number;
    totalSessions: number;
    totalAssignments: number;
    totalSubmissions: number;
    totalComments: number;
  };
}

export interface StudentRiskAlert {
  student: {
    id: string;
    name: string;
    email: string;
  };
  riskScore: number;
  alertLevel: 'low' | 'medium' | 'high';
  riskFactors: {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  streak: {
    current: number;
    longest: number;
  };
}

export interface PredictiveAlertsData {
  cohortId: string;
  cohortName: string;
  totalStudents: number;
  atRiskStudents: number;
  alerts: StudentRiskAlert[];
}