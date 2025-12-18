// Exams API Services
import apiClient from './client';

export const examsAPI = {
  // Get all exams
  getAllExams: async (params = {}) => {
    try {
      const response = await apiClient.get('/exams/', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch exams',
      };
    }
  },

  // Get exam detail
  getExamDetail: async (examId) => {
    try {
      const response = await apiClient.get(`/exams/${examId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch exam details',
      };
    }
  },

  // Submit exam answers
  submitExam: async (examId, answers) => {
    try {
      const response = await apiClient.post(`/exams/${examId}/submit/`, { answers });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to submit exam',
      };
    }
  },

  // Get user exam results
  getUserExamResults: async () => {
    try {
      const response = await apiClient.get('/exams/results/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch exam results',
      };
    }
  },

  // Get exam result detail
  getExamResult: async (resultId) => {
    try {
      const response = await apiClient.get(`/exams/results/${resultId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch exam result',
      };
    }
  },
};