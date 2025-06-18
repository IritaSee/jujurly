import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  keywords: string[];
}

export interface ResponseSuggestion {
  suggestion: string;
  tone: 'professional' | 'friendly' | 'empathetic' | 'apologetic';
  priority: 'high' | 'medium' | 'low';
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  isIndonesian: boolean;
}

// Enhanced sentiment analysis with emotions and keywords
export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis expert. Analyze the given text and return a JSON response with:
          - sentiment: "positive", "negative", or "neutral"
          - confidence: number between 0 and 1
          - emotions: array of detected emotions (max 3)
          - keywords: array of important keywords (max 5)
          
          Respond only with valid JSON.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      sentiment: result.sentiment || 'neutral',
      confidence: result.confidence || 0.5,
      emotions: result.emotions || [],
      keywords: result.keywords || []
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      emotions: [],
      keywords: []
    };
  }
}

// Generate automated response suggestions
export async function generateResponseSuggestions(feedbackText: string, sentiment: string): Promise<ResponseSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a customer service expert. Generate 3 response suggestions for the given feedback in Indonesian language. Each suggestion should have different tones.
          
          Return a JSON array with objects containing:
          - suggestion: the response text in Indonesian
          - tone: "professional", "friendly", "empathetic", or "apologetic"
          - priority: "high", "medium", or "low" based on urgency
          
          Make responses appropriate for the sentiment: ${sentiment}
          Keep responses concise but helpful (max 100 words each).
          
          Respond only with valid JSON array.`
        },
        {
          role: 'user',
          content: feedbackText
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '[]');
    return result.map((item: any) => ({
      suggestion: item.suggestion || '',
      tone: item.tone || 'professional',
      priority: item.priority || 'medium'
    }));
  } catch (error) {
    console.error('Error generating response suggestions:', error);
    return [];
  }
}

// Detect language and translate to Indonesian if needed
export async function translateToIndonesian(text: string): Promise<TranslationResult> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a language detection and translation expert. 
          
          1. First, detect the language of the given text
          2. If the text is already in Indonesian, return it as is
          3. If the text is in another language, translate it to Indonesian
          
          Return a JSON response with:
          - originalText: the original text
          - translatedText: the text in Indonesian (same as original if already Indonesian)
          - detectedLanguage: the detected language code (e.g., "en", "id", "zh", etc.)
          - isIndonesian: boolean indicating if the original text was in Indonesian
          
          Respond only with valid JSON.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      originalText: text,
      translatedText: result.translatedText || text,
      detectedLanguage: result.detectedLanguage || 'unknown',
      isIndonesian: result.isIndonesian || false
    };
  } catch (error) {
    console.error('Error translating text:', error);
    return {
      originalText: text,
      translatedText: text,
      detectedLanguage: 'unknown',
      isIndonesian: true
    };
  }
}

// Batch process feedback for AI analysis
export async function processFeedbackWithAI(feedbackText: string) {
  try {
    const [sentimentResult, translationResult] = await Promise.all([
      analyzeSentiment(feedbackText),
      translateToIndonesian(feedbackText)
    ]);

    const responseSuggestions = await generateResponseSuggestions(
      translationResult.translatedText,
      sentimentResult.sentiment
    );

    return {
      sentiment: sentimentResult,
      translation: translationResult,
      suggestions: responseSuggestions
    };
  } catch (error) {
    console.error('Error processing feedback with AI:', error);
    throw error;
  }
}