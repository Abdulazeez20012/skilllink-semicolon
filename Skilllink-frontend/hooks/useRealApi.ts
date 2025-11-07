import { useState, useEffect } from 'react';
import { realApi } from '../services/realApi';
import { User, UserRole, Assignment, Submission, Resource, DiscussionMessage, Cohort } from '../types';

export const useRealApi = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('skilllink_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await realApi.login({ email, password }, role);
      setToken(result.token);
      localStorage.setItem('skilllink_token', result.token);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await realApi.register({ name, email, password, role });
      setToken(result.token);
      localStorage.setItem('skilllink_token', result.token);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCohorts = async (): Promise<Cohort[]> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const cohorts = await realApi.getCohorts(token);
      return cohorts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cohorts';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCohortById = async (id: string): Promise<Cohort> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const cohort = await realApi.getCohortById(id, token);
      return cohort;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cohort';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAssignments = async (): Promise<Assignment[]> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const assignments = await realApi.getAssignments(token);
      return assignments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assignments';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsByCohort = async (cohortId: string): Promise<Assignment[]> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const assignments = await realApi.getAssignmentsByCohort(cohortId, token);
      return assignments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assignments';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentById = async (id: string): Promise<Assignment> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const assignment = await realApi.getAssignmentById(id, token);
      return assignment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assignment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (data: Omit<Assignment, 'id' | 'status' | 'facilitator' | 'resources'>): Promise<Assignment> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const assignment = await realApi.createAssignment(data, token);
      return assignment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create assignment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionsForAssignment = async (assignmentId: string): Promise<Submission[]> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const submissions = await realApi.getSubmissionsForAssignment(assignmentId, token);
      return submissions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submissions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (assignmentId: string, projectLink?: string): Promise<Submission> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const submission = await realApi.submitAssignment(assignmentId, { projectLink }, token);
      return submission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit assignment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (id: string, grade: number, feedback: string): Promise<Submission> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const submission = await realApi.gradeSubmission(id, grade, feedback, token);
      return submission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to grade submission';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getResources = async (): Promise<Resource[]> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const resources = await realApi.getResources(token);
      return resources;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch resources';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (data: Omit<Resource, 'id'>): Promise<Resource> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const resource = await realApi.createResource(data, token);
      return resource;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create resource';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDiscussionMessages = async (assignmentId: string): Promise<DiscussionMessage[]> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const messages = await realApi.getDiscussionMessages(assignmentId, token);
      return messages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch discussion messages';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const postDiscussionMessage = async (assignmentId: string, content: string): Promise<DiscussionMessage> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      const message = await realApi.postDiscussionMessage(assignmentId, { content }, token);
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to post discussion message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscussionMessage = async (assignmentId: string, messageId: string): Promise<void> => {
    if (!token) throw new Error('No authentication token');
    
    setLoading(true);
    setError(null);
    
    try {
      await realApi.deleteDiscussionMessage(assignmentId, messageId, token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete discussion message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('skilllink_token');
  };

  return {
    token,
    loading,
    error,
    login,
    register,
    logout,
    getCohorts,
    getCohortById,
    getAssignments,
    getAssignmentsByCohort,
    getAssignmentById,
    createAssignment,
    getSubmissionsForAssignment,
    submitAssignment,
    gradeSubmission,
    getResources,
    createResource,
    getDiscussionMessages,
    postDiscussionMessage,
    deleteDiscussionMessage,
  };
};