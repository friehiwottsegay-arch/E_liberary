// Audiobooks API Services
import apiClient from './client';

export const audiobooksAPI = {
  // Get all audiobooks for a book
  getBookAudiobooks: async (bookId) => {
    try {
      const response = await apiClient.get(`/audiobooks/${bookId}/detail/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch audiobooks',
      };
    }
  },

  // Generate AI audiobook
  generateAIAudiobook: async (bookId, voiceType = 'alloy') => {
    try {
      const response = await apiClient.post('/audiobooks/generate-audio/', {
        book_id: bookId,
        voice_type: voiceType,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to generate audiobook',
      };
    }
  },

  // Upload user recording
  uploadUserRecording: async (bookId, audioFile) => {
    try {
      const formData = new FormData();
      formData.append('book_id', bookId);
      formData.append('audio_file', {
        uri: audioFile.uri,
        type: 'audio/mp3',
        name: audioFile.fileName || 'recording.mp3',
      });

      const response = await apiClient.post('/audiobooks/save-recording/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to upload recording',
      };
    }
  },

  // Get audiobook detail
  getAudiobookDetail: async (audiobookId) => {
    try {
      const response = await apiClient.get(`/audiobooks/${audiobookId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch audiobook details',
      };
    }
  },

  // Delete audiobook
  deleteAudiobook: async (audiobookId) => {
    try {
      const response = await apiClient.delete(`/audiobooks/${audiobookId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to delete audiobook',
      };
    }
  },

  // Get user's audiobooks
  getUserAudiobooks: async () => {
    try {
      const response = await apiClient.get('/audiobooks/list/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to fetch user audiobooks',
      };
    }
  },
};
