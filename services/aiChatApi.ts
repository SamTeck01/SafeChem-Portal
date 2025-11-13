/**
 * AI Chat Service
 * Supports both OpenAI and Google Gemini (FREE)
 * Use Gemini for free unlimited usage!
 */

// API Keys - Add ONE of these to your .env file
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// API URLs
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Determine which AI to use (Gemini is FREE!)
const USE_GEMINI = !!GEMINI_API_KEY;
const USE_OPENAI = !!OPENAI_API_KEY;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface ChatContext {
  chemicalName?: string;
  chemicalFormula?: string;
  conversationHistory: ChatMessage[];
}

/**
 * System prompt for chemical safety assistant
 */
const SYSTEM_PROMPT = `You are SafeChem AI, an expert chemical safety assistant. Your role is to:

1. Provide accurate, science-based information about chemical safety
2. Help users understand Safety Data Sheets (SDS)
3. Explain proper handling, storage, and disposal procedures
4. Answer questions about chemical hazards and first aid
5. Use clear, professional language
6. Always prioritize safety and recommend consulting qualified personnel for critical decisions

Important guidelines:
- Be concise but thorough
- Use bullet points for clarity
- Cite safety standards when relevant (OSHA, NFPA, GHS)
- Never provide medical advice - recommend consulting healthcare professionals
- Emphasize the importance of proper PPE and safety protocols
- If unsure, acknowledge limitations and recommend expert consultation

Remember: Safety first, always.`;

class AIChatService {
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds for AI responses

  /**
   * Send message to AI and get response
   * Automatically uses Gemini (free) if available, otherwise OpenAI
   */
  async sendMessage(
    message: string,
    context?: ChatContext
  ): Promise<ChatMessage> {
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      throw new Error(
        'No AI API key configured.\n\n' +
        'FREE OPTION: Get Google Gemini API key at:\n' +
        'https://makersuite.google.com/app/apikey\n\n' +
        'Then add to .env:\n' +
        'EXPO_PUBLIC_GEMINI_API_KEY=your_key_here'
      );
    }

    // Use Gemini (free) if available, otherwise OpenAI
    if (USE_GEMINI) {
      return this.sendMessageGemini(message, context);
    } else {
      return this.sendMessageOpenAI(message, context);
    }
  }

  /**
   * Send message using Google Gemini (FREE)
   */
  private async sendMessageGemini(
    message: string,
    context?: ChatContext
  ): Promise<ChatMessage> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      // Build prompt with context
      let prompt = SYSTEM_PROMPT + '\n\n';
      
      if (context?.chemicalName) {
        prompt += `Current context: User is viewing ${context.chemicalName}${context.chemicalFormula ? ` (${context.chemicalFormula})` : ''}.\n\n`;
      }

      // Add conversation history
      if (context?.conversationHistory && context.conversationHistory.length > 0) {
        prompt += 'Previous conversation:\n';
        context.conversationHistory.slice(-6).forEach(msg => {
          prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        prompt += '\n';
      }

      prompt += `User: ${message}\nAssistant:`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                        'Sorry, I could not generate a response.';

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw error;
    }
  }

  /**
   * Send message using OpenAI (requires paid API key)
   */
  private async sendMessageOpenAI(
    message: string,
    context?: ChatContext
  ): Promise<ChatMessage> {

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

      // Build messages array
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPT }
      ];

      // Add context if available
      if (context?.chemicalName) {
        messages.push({
          role: 'system',
          content: `Current context: User is viewing information about ${context.chemicalName}${context.chemicalFormula ? ` (${context.chemicalFormula})` : ''}.`
        });
      }

      // Add conversation history (last 10 messages for context)
      if (context?.conversationHistory) {
        const recentHistory = context.conversationHistory.slice(-10);
        messages.push(...recentHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })));
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: message
      });

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Cost-effective model
          messages,
          temperature: 0.7,
          max_tokens: 500,
          presence_penalty: 0.6,
          frequency_penalty: 0.3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw error;
    }
  }

  /**
   * Get quick action suggestions based on context
   */
  getQuickActions(chemicalName?: string): string[] {
    const baseActions = [
      'What are the main hazards?',
      'How should I store this?',
      'What PPE do I need?',
      'First aid procedures?',
      'Disposal guidelines?',
    ];

    if (chemicalName) {
      return [
        `Tell me about ${chemicalName}`,
        ...baseActions,
      ];
    }

    return baseActions;
  }

  /**
   * Generate context-aware prompt
   */
  generateContextPrompt(action: string, chemicalName?: string): string {
    if (chemicalName && action.includes('this')) {
      return action.replace('this', chemicalName);
    }
    return action;
  }
}

export const aiChatService = new AIChatService();
