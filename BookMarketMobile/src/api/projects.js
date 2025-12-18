// Projects API - Handle research projects and papers
import apiClient from './client';

class ProjectsAPI {
  async getProjects() {
    try {
      const response = await apiClient.get('/projects/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error. Please check your connection.' 
      };
    }
  }

  async getProjectDetail(projectId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching project details:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async searchProjects(query) {
    try {
      const response = await apiClient.get('/projects/search/', {
        params: { q: query }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error searching projects:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async downloadProjectPDF(projectId) {
    try {
      const response = await apiClient.get(`/projects/${projectId}/download/`, {
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error downloading project PDF:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async rateProject(projectId, rating) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/rate/`, { rating });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error rating project:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async getFeaturedProjects() {
    try {
      const response = await apiClient.get('/projects/featured/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async getUserFavorites() {
    try {
      const response = await apiClient.get('/projects/favorites/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async addToFavorites(projectId) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/favorite/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }
}

export const projectsAPI = new ProjectsAPI();