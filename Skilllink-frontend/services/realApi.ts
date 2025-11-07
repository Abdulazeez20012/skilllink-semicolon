import { User, UserRole, Assignment, Submission, Resource, DiscussionMessage, Cohort, AssignmentStatus, ResourceType } from '../types';
import { getUserAvatar, getCohortImage } from '../images';

// Get API base URL from environment variables
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export const realApi = {
  // Authentication
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend user data to frontend user data structure
    const user: User = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatar || getUserAvatar(data._id, data.name),
      joinDate: new Date().toISOString(),
      cohorts: [], // Will be populated when getting cohorts
    };
    
    return { user, token: data.token };
  },

  register: async (userData: { name: string; email: string; password: string; role: UserRole }): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend user data to frontend user data structure
    const user: User = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatar || getUserAvatar(data._id, data.name),
      joinDate: new Date().toISOString(),
      cohorts: [],
    };
    
    return { user, token: data.token };
  },

  // Cohorts
  getCohorts: async (token: string): Promise<Cohort[]> => {
    const response = await fetch(`${API_BASE_URL}/cohorts`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend cohort data to frontend cohort data structure
    return data.map((cohort: any) => ({
      id: cohort._id,
      name: cohort.name,
      description: cohort.description,
      facilitators: cohort.facilitators.map((fac: any) => ({
        id: fac._id,
        name: fac.name,
        avatarUrl: fac.avatar || getUserAvatar(fac._id, fac.name),
      })),
      students: cohort.students.map((student: any) => ({
        id: student._id,
        name: student.name,
        avatarUrl: student.avatar || getUserAvatar(student._id, student.name),
      })),
      imageUrl: getCohortImage(cohort._id),
      tags: [cohort.programmingLanguage],
    }));
  },

  getCohortById: async (id: string, token: string): Promise<Cohort> => {
    const response = await fetch(`${API_BASE_URL}/cohorts/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend cohort data to frontend cohort data structure
    return {
      id: data._id,
      name: data.name,
      description: data.description,
      facilitators: data.facilitators.map((fac: any) => ({
        id: fac._id,
        name: fac.name,
        avatarUrl: fac.avatar || getUserAvatar(fac._id, fac.name),
      })),
      students: data.students.map((student: any) => ({
        id: student._id,
        name: student.name,
        avatarUrl: student.avatar || getUserAvatar(student._id, student.name),
      })),
      imageUrl: getCohortImage(data._id),
      tags: [data.programmingLanguage],
    };
  },

  // Assignments
  getAssignments: async (token: string): Promise<Assignment[]> => {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend assignment data to frontend assignment data structure
    return data.map((assignment: any) => ({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      status: AssignmentStatus.PENDING, // Will be updated when getting submissions
      facilitator: {
        id: assignment.createdBy._id,
        name: assignment.createdBy.name,
        avatarUrl: assignment.createdBy.avatar || getUserAvatar(assignment.createdBy._id, assignment.createdBy.name),
        
      },
      resources: [], // Will be populated when getting resources
      cohortId: assignment.cohort || '',
    }));
  },

  getAssignmentsByCohort: async (cohortId: string, token: string): Promise<Assignment[]> => {
    const response = await fetch(`${API_BASE_URL}/cohorts/${cohortId}/assignments`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend assignment data to frontend assignment data structure
    return data.map((assignment: any) => ({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      status: AssignmentStatus.PENDING, // Will be updated when getting submissions
      facilitator: {
        id: assignment.createdBy._id,
        name: assignment.createdBy.name,
        avatarUrl: assignment.createdBy.avatar || getUserAvatar(assignment.createdBy._id, assignment.createdBy.name),
        
      },
      resources: [], // Will be populated when getting resources
      cohortId: cohortId,
    }));
  },

  getAssignmentById: async (id: string, token: string): Promise<Assignment> => {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend assignment data to frontend assignment data structure
    return {
      id: data._id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: AssignmentStatus.PENDING, // Will be updated when getting submissions
      facilitator: {
        id: data.createdBy._id,
        name: data.createdBy.name,
        avatarUrl: data.createdBy.avatar || getUserAvatar(data.createdBy._id, data.createdBy.name),
        
      },
      resources: [], // Will be populated when getting resources
      cohortId: data.cohort || '',
    };
  },

  createAssignment: async (data: Omit<Assignment, 'id' | 'status' | 'facilitator' | 'resources'>, token: string): Promise<Assignment> => {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        cohort: data.cohortId,
      }),
    });
    
    const assignmentData = await handleResponse(response);
    
    // Transform backend assignment data to frontend assignment data structure
    return {
      id: assignmentData._id,
      title: assignmentData.title,
      description: assignmentData.description,
      dueDate: assignmentData.dueDate,
      status: AssignmentStatus.PENDING,
      facilitator: {
        id: assignmentData.createdBy._id,
        name: assignmentData.createdBy.name,
        avatarUrl: assignmentData.createdBy.avatar || getUserAvatar(assignmentData.createdBy._id, assignmentData.createdBy.name),
        
      },
      resources: [],
      cohortId: assignmentData.cohort || '',
    };
  },

  // Submissions
  getSubmissionsForAssignment: async (assignmentId: string, token: string): Promise<Submission[]> => {
    // For now, we'll get all user submissions and filter by assignment
    const response = await fetch(`${API_BASE_URL}/submissions/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Filter submissions for this assignment
    const assignmentSubmissions = data.filter((sub: any) => sub.assignmentId === assignmentId);
    
    // Transform backend submission data to frontend submission data structure
    return assignmentSubmissions.map((submission: any) => ({
      id: submission._id,
      student: {
        id: submission.studentId._id,
        name: submission.studentId.name,
        avatarUrl: submission.studentId.avatar || getUserAvatar(submission.studentId._id, submission.studentId.name),
      },
      submittedAt: submission.submittedAt,
      grade: submission.grade,
      feedback: submission.feedback,
      projectLink: submission.projectLink,
      fileUrl: submission.fileUpload,
      status: submission.grade !== undefined && submission.grade !== null 
        ? AssignmentStatus.GRADED 
        : submission.projectLink || submission.fileUpload 
          ? AssignmentStatus.SUBMITTED 
          : AssignmentStatus.PENDING,
    }));
  },

  submitAssignment: async (assignmentId: string, submissionData: { projectLink?: string }, token: string): Promise<Submission> => {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        assignmentId,
        projectLink: submissionData.projectLink,
      }),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend submission data to frontend submission data structure
    return {
      id: data._id,
      student: {
        id: data.studentId,
        name: data.studentId.name,
        avatarUrl: data.studentId.avatar || `https://ui-avatars.com/api/?name=${data.studentId.name}&background=random`,
      },
      submittedAt: data.submittedAt,
      grade: data.grade,
      feedback: data.feedback,
      projectLink: data.projectLink,
      fileUrl: data.fileUpload,
      status: AssignmentStatus.SUBMITTED,
    };
  },

  gradeSubmission: async (id: string, grade: number, feedback: string, token: string): Promise<Submission> => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}/grade`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        grade,
        feedback,
      }),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend submission data to frontend submission data structure
    return {
      id: data._id,
      student: {
        id: data.studentId,
        name: data.studentId.name,
        avatarUrl: data.studentId.avatar || `https://ui-avatars.com/api/?name=${data.studentId.name}&background=random`,
      },
      submittedAt: data.submittedAt,
      grade: data.grade,
      feedback: data.feedback,
      projectLink: data.projectLink,
      fileUrl: data.fileUpload,
      status: AssignmentStatus.GRADED,
    };
  },

  // Resources
  getResources: async (token: string): Promise<Resource[]> => {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend resource data to frontend resource data structure
    return data.map((resource: any) => ({
      id: resource._id,
      title: resource.title,
      description: resource.link,
      type: ResourceType.LINK, // Default to LINK, could be enhanced
      url: resource.link,
    }));
  },

  createResource: async (data: Omit<Resource, 'id'>, token: string): Promise<Resource> => {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        title: data.title,
        link: data.url,
      }),
    });
    
    const resourceData = await handleResponse(response);
    
    // Transform backend resource data to frontend resource data structure
    return {
      id: resourceData._id,
      title: resourceData.title,
      description: resourceData.link,
      type: ResourceType.LINK, // Default to LINK, could be enhanced
      url: resourceData.link,
    };
  },

  // Discussions
  getDiscussionMessages: async (assignmentId: string, token: string): Promise<DiscussionMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/discussions/${assignmentId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend discussion data to frontend discussion data structure
    return data.map((message: any) => ({
      id: message._id,
      user: {
        id: message.userId._id,
        name: message.userId.name,
        avatarUrl: message.userId.avatar || getUserAvatar(message.userId._id, message.userId.name),
        
      },
      content: message.message,
      timestamp: message.createdAt,
    }));
  },

  postDiscussionMessage: async (assignmentId: string, message: Omit<DiscussionMessage, 'id' | 'timestamp'>, token: string): Promise<DiscussionMessage> => {
    const response = await fetch(`${API_BASE_URL}/discussions/${assignmentId}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        message: message.content,
      }),
    });
    
    const data = await handleResponse(response);
    
    // Transform backend discussion data to frontend discussion data structure
    return {
      id: data._id,
      user: {
        id: data.userId._id,
        name: data.userId.name,
        avatarUrl: data.userId.avatar || getUserAvatar(data.userId._id, data.userId.name),
        
      },
      content: data.message,
      timestamp: data.createdAt,
    };
  },

  deleteDiscussionMessage: async (assignmentId: string, messageId: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/discussions/${assignmentId}/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    
    await handleResponse(response);
  },

  // User profile
  updateUserProfile: async (user: User, updates: Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>, token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: updates.name,
        email: updates.email,
        avatar: updates.avatarUrl,
      }),
    });

    const data = await handleResponse(response);
    
    // Transform backend user data to frontend user data structure
    return {
      id: data._id,
      name: data.name,
      email: data.email,
      role: user.role, // Role doesn't change
      avatarUrl: data.avatar || `https://ui-avatars.com/api/?name=${data.name}&background=random`,
      joinDate: user.joinDate, // Keep original join date
      cohorts: user.cohorts, // Keep original cohorts
    };
  },

  uploadAvatar: async (file: File, token: string): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/auth/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await handleResponse(response);
    return data.avatarUrl;
  },
};