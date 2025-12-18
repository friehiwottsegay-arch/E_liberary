// AI API - Google Gemini AI integration
import { API_CONFIG } from '../../config/api';

const GEMINI_API_KEY = 'AIzaSyATLGcwV8Lz1Gbl-E_RtET9ZlAHRdvSIc0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class AIAPI {
  async sendMessage(message, conversationHistory = []) {
    try {
      // Build context from conversation history
      let context = conversationHistory
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');

      // Add educational context
      const systemPrompt = `You are an AI study assistant for a book market mobile app. 
You help students with:
- Explaining academic concepts
- Summarizing study materials
- Creating quizzes and practice questions
- Recommending books and study topics
- Answering questions about exams and subjects
- Providing study tips and strategies

Context of previous conversation:
${context}

Current user question: ${message}

Please provide a helpful, educational response. If the user asks about specific books, exams, or projects, relate your response to the available content in our platform.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return { 
          success: true, 
          data: { 
            response: generatedText,
            usage: data.usageMetadata 
          } 
        };
      } else {
        throw new Error('No response generated');
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback responses for offline or API errors
      const fallbackResponses = [
        "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        "Let me help you with that. Could you please rephrase your question?",
        "I'm here to help with your studies. What specific topic would you like to learn about?",
        "I'd be happy to assist you! Can you tell me more about what you're studying?",
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return { 
        success: true, 
        data: { 
          response: randomResponse,
          isOffline: true 
        } 
      };
    }
  }

  async generateQuiz(subject, difficulty = 'medium', questionCount = 5) {
    try {
      const prompt = `Create a ${questionCount}-question quiz about ${subject} with ${difficulty} difficulty level. 
Format each question with:
1. Question text
2. 4 multiple choice options (A, B, C, D)
3. Correct answer
4. Brief explanation

Make sure questions are educational and help students learn.`;

      const response = await this.sendMessage(prompt);
      return response;

    } catch (error) {
      console.error('Quiz generation error:', error);
      return { success: false, message: 'Failed to generate quiz' };
    }
  }

  async explainConcept(concept, context = '') {
    try {
      const prompt = `Please explain the concept of "${concept}" in a clear, educational way. 
${context ? `Context: ${context}` : ''}
Use simple language, provide examples, and structure your explanation with:
1. Simple definition
2. Key points
3. Real-world examples
4. Common misconceptions (if any)`;

      const response = await this.sendMessage(prompt);
      return response;

    } catch (error) {
      console.error('Concept explanation error:', error);
      return { success: false, message: 'Failed to explain concept' };
    }
  }

  async summarizeContent(content, focus = 'main points') {
    try {
      const prompt = `Please summarize the following content focusing on ${focus}:
${content}

Provide a structured summary with:
1. Key takeaways
2. Important details
3. Actionable insights`;

;

      const response = await this.sendMessage(prompt);
      return response;

    } catch (error) {
      console.error('Content summarization error:', error);
      return { success: false, message: 'Failed to summarize content' };
    }
  }

  async getStudyRecommendations(studyHistory = [], preferences = {}) {
    try {
      const prompt = `Based on the user's study history and preferences, provide personalized study recommendations.
Study history: ${JSON.stringify(studyHistory)}
Preferences: ${JSON.stringify(preferences)}

Suggest:
1. Next topics to study
2. Recommended books
3. Study methods
4. Practice areas`;

      const response = await this.sendMessage(prompt);
      return response;

    } catch (error) {
      console.error('Study recommendations error:', error);
      return { success: false, message: 'Failed to generate recommendations' };
    }
  }

  async analyzeStudyProgress(activities = []) {
    try {
      const prompt = `Analyze the user's study activities and provide insights:
${JSON.stringify(activities)}

Provide feedback on:
1. Strengths
2. Areas for improvement
3. Study patterns
4. Recommendations`;

      const response = await this.sendMessage(prompt);
      return response;

    } catch (error) {
      console.error('Study progress analysis error:', error);
      return { success: false, message: 'Failed to analyze progress' };
    }
  }

  // Utility method to save conversation to local storage
  async saveConversation(messages) {
    try {
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('ai_conversation', JSON.stringify(messages));
      return { success: true };
    } catch (error) {
      console.error('Error saving conversation:', error);
      return { success: false, message: 'Failed to save conversation' };
    }
  }

  // Utility method to load conversation from local storage
  async loadConversation() {
    try {
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const conversation = await AsyncStorage.getItem('ai_conversation');
      return { 
        success: true, 
        data: conversation ? JSON.parse(conversation) : [] 
      };
    } catch (error) {
      console.error('Error loading conversation:', error);
      return { success: false, message: 'Failed to load conversation' };
    }
  }

  // Clear conversation history
  async clearConversation() {
    try {
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem('ai_conversation');
      return { success: true };
    } catch (error) {
      console.error('Error clearing conversation:', error);
      return { success: false, message: 'Failed to clear conversation' };
    }
  }
}

export const aiAPI = new AIAPI();