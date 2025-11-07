export enum UserRole {
  STUDENT = 'student',
  FACILITATOR = 'facilitator',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  joinDate: string;
  cohorts: string[]; // Array of cohort IDs
}

export enum AssignmentStatus {
  PENDING = 'Pending',
  SUBMITTED = 'Submitted',
  GRADED = 'Graded',
  LATE = 'Late',
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
}

export interface DiscussionMessage {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  content: string;
  timestamp: string;
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
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  facilitators: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
  students: Pick<User, 'id' | 'name' | 'avatarUrl'>[];
  imageUrl: string;
  tags?: string[];
}