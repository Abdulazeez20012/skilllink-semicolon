// import { User, UserRole, Assignment, Submission, Resource, DiscussionMessage, Cohort, AssignmentStatus, ResourceType } from '../types';
// import { MOCK_STUDENT, MOCK_FACILITATOR, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_RESOURCES, MOCK_DISCUSSION_MESSAGES, MOCK_COHORTS } from '../constants';
// import { realApi, LoginCredentials as RealLoginCredentials } from './realApi';

// // Use real API if not in development mode with mock data flag
// const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// // Simulating a network delay
// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// // Make mock data mutable for API operations
// let assignments = [...MOCK_ASSIGNMENTS];
// let cohorts = [...MOCK_COHORTS];
// let submissions = [...MOCK_SUBMISSIONS];
// let messages = [...MOCK_DISCUSSION_MESSAGES];
// let resources = [...MOCK_RESOURCES];

// export interface LoginCredentials {
//   email: string;
//   password?: string; // Optional for mock
// }

// export const api = {
//   login: async (credentials: LoginCredentials, role: UserRole): Promise<User> => {
//     if (USE_MOCK_DATA) {
//       await delay(1000);
//       if (credentials.email) {
//           if (role === UserRole.STUDENT) return MOCK_STUDENT;
//           if (role === UserRole.FACILITATOR) return MOCK_FACILITATOR;
//       }
//       throw new Error('Invalid credentials');
//     } else {
//       // Use real API
//       const realCredentials: RealLoginCredentials = {
//         email: credentials.email,
//         password: credentials.password || 'defaultPassword123',
//       };
//       const result = await realApi.login(realCredentials, role);
//       return result.user;
//     }
//   },

//   getCohorts: async (user: User): Promise<Cohort[]> => {
//     if (USE_MOCK_DATA) {
//       await delay(600);
//       if (user.role === UserRole.FACILITATOR) {
//           return cohorts;
//       }
//       return cohorts.filter(c => user.cohorts.includes(c.id));
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return cohorts;
//     }
//   },
  
//   getCohortById: async(id: string): Promise<Cohort | undefined> => {
//     if (USE_MOCK_DATA) {
//       await delay(400);
//       return cohorts.find(c => c.id === id);
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return cohorts.find(c => c.id === id);
//     }
//   },

//   createCohort: async (data: Omit<Cohort, 'id' | 'facilitators' | 'students'>): Promise<Cohort> => {
//     if (USE_MOCK_DATA) {
//         await delay(800);
//         const newCohort: Cohort = {
//             ...data,
//             id: `cohort-${Date.now()}`,
//             facilitators: [MOCK_FACILITATOR], // mock
//             students: [],
//             imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`
//         };
//         cohorts = [newCohort, ...cohorts];
//         return newCohort;
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll return mock data as a fallback
//         const newCohort: Cohort = {
//             ...data,
//             id: `cohort-${Date.now()}`,
//             facilitators: [MOCK_FACILITATOR], // mock
//             students: [],
//             imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`
//         };
//         return newCohort;
//     }
//   },

//   updateCohort: async (id: string, updates: Partial<Cohort>): Promise<Cohort> => {
//     if (USE_MOCK_DATA) {
//         await delay(800);
//         let cohortToUpdate: Cohort | undefined;
//         cohorts = cohorts.map(c => {
//             if (c.id === id) {
//                 cohortToUpdate = { ...c, ...updates };
//                 return cohortToUpdate;
//             }
//             return c;
//         });
//         if (!cohortToUpdate) throw new Error("Cohort not found");
//         return cohortToUpdate;
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll return mock data as a fallback
//         let cohortToUpdate: Cohort | undefined;
//         cohorts = cohorts.map(c => {
//             if (c.id === id) {
//                 cohortToUpdate = { ...c, ...updates };
//                 return cohortToUpdate;
//             }
//             return c;
//         });
//         if (!cohortToUpdate) throw new Error("Cohort not found");
//         return cohortToUpdate;
//     }
//   },

//   deleteCohort: async (id: string): Promise<void> => {
//     if (USE_MOCK_DATA) {
//         await delay(500);
//         cohorts = cohorts.filter(c => c.id !== id);
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll just simulate the operation
//         cohorts = cohorts.filter(c => c.id !== id);
//     }
//   },

//   getAssignments: async (user: User): Promise<Assignment[]> => {
//     if (USE_MOCK_DATA) {
//       await delay(500);
//        if (user.role === UserRole.FACILITATOR) {
//           return assignments;
//       }
//       return assignments.filter(a => user.cohorts.includes(a.cohortId));
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return assignments;
//     }
//   },

//   getAssignmentsByCohort: async (cohortId: string): Promise<Assignment[]> => {
//     if (USE_MOCK_DATA) {
//       await delay(500);
//       return assignments.filter(a => a.cohortId === cohortId);
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return assignments.filter(a => a.cohortId === cohortId);
//     }
//   },

//   getAssignmentById: async (id: string): Promise<Assignment | undefined> => {
//     if (USE_MOCK_DATA) {
//       await delay(500);
//       return assignments.find(a => a.id === id);
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return assignments.find(a => a.id === id);
//     }
//   },
  
//   createAssignment: async (data: Omit<Assignment, 'id' | 'status' | 'facilitator' | 'resources'>): Promise<Assignment> => {
//     if (USE_MOCK_DATA) {
//         await delay(800);
//         const newAssignment: Assignment = {
//             ...data,
//             id: `asg-${Date.now()}`,
//             status: AssignmentStatus.PENDING,
//             facilitator: MOCK_FACILITATOR,
//             resources: [],
//         };
//         assignments = [newAssignment, ...assignments];
//         return newAssignment;
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll return mock data as a fallback
//         const newAssignment: Assignment = {
//             ...data,
//             id: `asg-${Date.now()}`,
//             status: AssignmentStatus.PENDING,
//             facilitator: MOCK_FACILITATOR,
//             resources: [],
//         };
//         return newAssignment;
//     }
//   },

//   updateAssignment: async (id: string, updates: Partial<Assignment>): Promise<Assignment> => {
//     if (USE_MOCK_DATA) {
//         await delay(800);
//         let assignmentToUpdate: Assignment | undefined;
//         assignments = assignments.map(a => {
//             if (a.id === id) {
//                 assignmentToUpdate = { ...a, ...updates };
//                 return assignmentToUpdate;
//             }
//             return a;
//         });
//         if (!assignmentToUpdate) throw new Error("Assignment not found");
//         return assignmentToUpdate;
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll return mock data as a fallback
//         let assignmentToUpdate: Assignment | undefined;
//         assignments = assignments.map(a => {
//             if (a.id === id) {
//                 assignmentToUpdate = { ...a, ...updates };
//                 return assignmentToUpdate;
//             }
//             return a;
//         });
//         if (!assignmentToUpdate) throw new Error("Assignment not found");
//         return assignmentToUpdate;
//     }
//   },

//   deleteAssignment: async (id: string): Promise<void> => {
//     if (USE_MOCK_DATA) {
//         await delay(500);
//         assignments = assignments.filter(a => a.id !== id);
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll just simulate the operation
//         assignments = assignments.filter(a => a.id !== id);
//     }
//   },

//   getSubmissionsForAssignment: async (assignmentId: string): Promise<Submission[]> => {
//     if (USE_MOCK_DATA) {
//       await delay(700);
//       return submissions;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return submissions;
//     }
//   },

//   gradeSubmission: async (id: string, grade: number, feedback: string): Promise<Submission> => {
//     if (USE_MOCK_DATA) {
//       await delay(1000);
//       let submissionToUpdate: Submission | undefined;
//       submissions = submissions.map(s => {
//           if (s.id === id) {
//               submissionToUpdate = { ...s, grade, feedback, status: AssignmentStatus.GRADED };
//               return submissionToUpdate;
//           }
//           return s;
//       });
//       if (!submissionToUpdate) throw new Error("Submission not found");
//       return submissionToUpdate;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       let submissionToUpdate: Submission | undefined;
//       submissions = submissions.map(s => {
//           if (s.id === id) {
//               submissionToUpdate = { ...s, grade, feedback, status: AssignmentStatus.GRADED };
//               return submissionToUpdate;
//           }
//           return s;
//       });
//       if (!submissionToUpdate) throw new Error("Submission not found");
//       return submissionToUpdate;
//     }
//   },

//   getResources: async (): Promise<Resource[]> => {
//     if (USE_MOCK_DATA) {
//       await delay(500);
//       return resources;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return resources;
//     }
//   },

//   createResource: async (data: Omit<Resource, 'id'>): Promise<Resource> => {
//     if (USE_MOCK_DATA) {
//         await delay(800);
//         const newResource: Resource = {
//             ...data,
//             id: `res-${Date.now()}`,
//         };
//         resources = [newResource, ...resources];
//         return newResource;
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll return mock data as a fallback
//         const newResource: Resource = {
//             ...data,
//             id: `res-${Date.now()}`,
//         };
//         return newResource;
//     }
//   },
  
//   getDiscussionMessages: async (assignmentId: string): Promise<DiscussionMessage[]> => {
//     if (USE_MOCK_DATA) {
//       await delay(300);
//       return messages;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       return messages;
//     }
//   },

//   postDiscussionMessage: async (assignmentId: string, message: Omit<DiscussionMessage, 'id' | 'timestamp'>): Promise<DiscussionMessage> => {
//     if (USE_MOCK_DATA) {
//       await delay(400);
//       const newMessage: DiscussionMessage = {
//         ...message,
//         id: `msg-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//       };
//       messages.push(newMessage);
//       return newMessage;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       const newMessage: DiscussionMessage = {
//         ...message,
//         id: `msg-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//       };
//       return newMessage;
//     }
//   },

//   deleteDiscussionMessage: async (id: string): Promise<void> => {
//     if (USE_MOCK_DATA) {
//         await delay(300);
//         messages = messages.filter(m => m.id !== id);
//     } else {
//         // For real API, we need a token - this would be passed from context
//         // For now, we'll just simulate the operation
//         messages = messages.filter(m => m.id !== id);
//     }
//   },

//   submitAssignment: async (assignmentId: string, submissionData: { projectLink?: string, file?: File }): Promise<Submission> => {
//     if (USE_MOCK_DATA) {
//       await delay(1200);
//       const newSubmission: Submission = {
//           id: `sub-${Date.now()}`,
//           student: { id: MOCK_STUDENT.id, name: MOCK_STUDENT.name, avatarUrl: MOCK_STUDENT.avatarUrl },
//           submittedAt: new Date().toISOString(),
//           grade: null,
//           feedback: null,
//           projectLink: submissionData.projectLink,
//           fileUrl: submissionData.file ? submissionData.file.name : undefined,
//           status: AssignmentStatus.SUBMITTED,
//       };
//       submissions.push(newSubmission);
//       assignments = assignments.map(a => a.id === assignmentId ? {...a, status: AssignmentStatus.SUBMITTED} : a)
//       return newSubmission;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       const newSubmission: Submission = {
//           id: `sub-${Date.now()}`,
//           student: { id: MOCK_STUDENT.id, name: MOCK_STUDENT.name, avatarUrl: MOCK_STUDENT.avatarUrl },
//           submittedAt: new Date().toISOString(),
//           grade: null,
//           feedback: null,
//           projectLink: submissionData.projectLink,
//           fileUrl: submissionData.file ? submissionData.file.name : undefined,
//           status: AssignmentStatus.SUBMITTED,
//       };
//       return newSubmission;
//     }
//   },

//   updateUserProfile: async (user: User, updates: Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>): Promise<User> => {
//     if (USE_MOCK_DATA) {
//       await delay(800);
//       if (!user) throw new Error("User not found");
//       const updatedUser = { ...user, ...updates };
//       // In a real app, you would also update MOCK_STUDENT or MOCK_FACILITATOR if they match
//       return updatedUser;
//     } else {
//       // For real API, we need a token - this would be passed from context
//       // For now, we'll return mock data as a fallback
//       const updatedUser = { ...user, ...updates };
//       return updatedUser;
//     }
//   },
// };