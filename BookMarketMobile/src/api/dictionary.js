// Dictionary API - Handle sign language dictionary functionality
import apiClient from './client';

class DictionaryAPI {
  async getSignWords() {
    try {
      const response = await apiClient.get('/signwords/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching sign words:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error. Please check your connection.' 
      };
    }
  }

  async searchWords(query) {
    try {
      const response = await apiClient.get('/signwords/search/', {
        params: { q: query }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error searching words:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async getWordDetail(wordId) {
    try {
      const response = await apiClient.get(`/signwords/${wordId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching word details:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async markWordAsLearned(wordId) {
    try {
      const response = await apiClient.post(`/signwords/${wordId}/learn/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error marking word as learned:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async addToFavorites(wordId) {
    try {
      const response = await apiClient.post(`/signwords/${wordId}/favorite/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async getWordCategories() {
    try {
      const response = await apiClient.get('/signwords/categories/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching word categories:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }

  async getUserProgress() {
    try {
      const response = await apiClient.get('/signwords/progress/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Network error' 
      };
    }
  }
}

export const dictionaryAPI = new DictionaryAPI();