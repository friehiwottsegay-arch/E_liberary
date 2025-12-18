import apiClient, { API_ENDPOINTS, apiGet, apiPost } from './config/apiConfig';

// Exam API endpoints
export const examAPI = {
  // Get all subjects
  getSubjects: () => apiClient.get(API_ENDPOINTS.SUBJECTS),
  
  // Get exam by subject ID (returns { name, duration, questions })
  getExam: (subjectId) => apiClient.get(API_ENDPOINTS.EXAM_DETAIL(subjectId)),
  
  // Get questions by subject name
  getQuestionsByName: (subjectName) => apiClient.get(API_ENDPOINTS.QUESTIONS(subjectName)),
  
  // Get all categories
  getCategories: () => apiClient.get(API_ENDPOINTS.QCATEGORIES),
  
  // Get user progress
  getUserProgress: () => apiClient.get(`${API_ENDPOINTS.SUBJECTS}/my_progress/`),
  
  // Enroll in category
  enrollCategory: (categoryId) => apiClient.post(`${API_ENDPOINTS.QCATEGORIES}/${categoryId}/enroll/`)
};

export const submitOrder = async (orderData) => {
  try {
    const response = await apiPost('/orders/', orderData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  } catch (error) {
    console.error("Order submission failed:", error);
    throw error;
  }
};
