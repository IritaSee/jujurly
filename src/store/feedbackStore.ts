import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type SentimentAnalysis, type ResponseSuggestion, type TranslationResult } from '../lib/openai'

export interface FeedbackItem {
  id: string
  message: string
  sentiment: 'positive' | 'negative' | 'neutral'
  timestamp: string
  isAnonymous: boolean
  fromUser?: string
  isRead: boolean
  sender?: string
  isDone?: boolean
  // AI-powered features
  aiAnalysis?: {
    sentiment: SentimentAnalysis
    translation: TranslationResult
    suggestions: ResponseSuggestion[]
    processedAt: string
  }
  isProcessingAI?: boolean
}

export interface FeedbackState {
  // State
  feedbackItems: FeedbackItem[]
  isLoading: boolean
  error: string | null
  lastFetched: number | null
  hasMore: boolean
  currentPage: number
  totalItems: number
  // Caching
  aiAnalysisCache: Map<string, any>
  cacheTimestamps: Map<string, number>

  // Actions
  fetchFeedback: (username: string, page?: number, append?: boolean) => Promise<void>
  addFeedback: (feedback: Omit<FeedbackItem, 'id' | 'timestamp'>) => Promise<void>
  markAsRead: (feedbackId: string) => void
  markAsDone: (feedbackId: string) => void
  clearFeedback: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  refreshFeedback: (username: string) => Promise<void>
  loadMoreFeedback: (username: string) => Promise<void>
  // AI-powered actions
  processFeedbackWithAI: (feedbackId: string) => Promise<void>
  updateFeedbackSentiment: (feedbackId: string, sentiment: 'positive' | 'negative' | 'neutral') => void
  batchProcessFeedbackWithAI: (feedbackIds: string[]) => Promise<void>
  // Cache management
  getCachedAIAnalysis: (feedbackId: string) => any | null
  setCachedAIAnalysis: (feedbackId: string, analysis: any) => void
  clearAICache: () => void
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const AI_CACHE_DURATION = 30 * 60 * 1000 // 30 minutes for AI analysis
const ITEMS_PER_PAGE = 20

export const useFeedbackStore = create<FeedbackState>()(persist(
  (set, get) => ({
    // Initial state
    feedbackItems: [],
    isLoading: false,
    error: null,
    lastFetched: null,
    hasMore: true,
    currentPage: 1,
    totalItems: 0,
    aiAnalysisCache: new Map(),
    cacheTimestamps: new Map(),

    // Actions
    fetchFeedback: async (username, page = 1, append = false) => {
      try {
        const state = get()
        const now = Date.now()
        
        // Check if we have cached data and it's still fresh
        if (
          page === 1 && 
          !append &&
          state.lastFetched && 
          now - state.lastFetched < CACHE_DURATION && 
          state.feedbackItems.length > 0
        ) {
          return // Use cached data
        }

        set({ isLoading: true, error: null })
        
        const apiUrl = import.meta.env.VITE_API_URL || 'https://gzzdrs2tjx.ap-southeast-1.awsapprunner.com'
        const response = await fetch(`${apiUrl}/feedback/${username}?page=${page}&limit=${ITEMS_PER_PAGE}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch feedback: ${response.statusText}`)
        }

        const data = await response.json()
        const newFeedback = data.feedback || []
        const total = data.total || newFeedback.length
        
        // Restore cached AI analysis
        const enhancedFeedback = newFeedback.map((feedback: FeedbackItem) => {
          const cachedAnalysis = state.aiAnalysisCache.get(feedback.id)
          const cacheTimestamp = state.cacheTimestamps.get(feedback.id)
          
          if (cachedAnalysis && cacheTimestamp && (now - cacheTimestamp) < AI_CACHE_DURATION) {
            return { ...feedback, aiAnalysis: cachedAnalysis }
          }
          
          return feedback
        })
        
        set({
          feedbackItems: (page === 1 && !append) ? enhancedFeedback : [...state.feedbackItems, ...enhancedFeedback],
          isLoading: false,
          error: null,
          lastFetched: now,
          hasMore: newFeedback.length === ITEMS_PER_PAGE,
          currentPage: page,
          totalItems: total,
        })
      } catch (error) {
        // Fallback to mock data for development
        const mockFeedback: FeedbackItem[] = [
          {
            id: '1',
            message: 'Great work on the presentation today!',
            sentiment: 'positive',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isAnonymous: false,
            fromUser: 'colleague1',
            isRead: false
          },
          {
            id: '2',
            message: 'Could improve communication in meetings',
            sentiment: 'negative',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            isAnonymous: true,
            fromUser: undefined,
            isRead: true
          },
          {
            id: '3',
            message: 'Solid technical skills, keep it up!',
            sentiment: 'positive',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isAnonymous: false,
            fromUser: 'manager',
            isRead: false
          }
        ]

        set({
          feedbackItems: page === 1 ? mockFeedback : [...get().feedbackItems, ...mockFeedback],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch feedback',
          lastFetched: Date.now(),
          hasMore: false,
          currentPage: page,
          totalItems: mockFeedback.length,
        })
      }
    },

    addFeedback: async (feedback) => {
      try {
        set({ isLoading: true, error: null })
        
        const apiUrl = import.meta.env.VITE_API_URL || 'https://gzzdrs2tjx.ap-southeast-1.awsapprunner.com'
        const response = await fetch(`${apiUrl}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedback),
        })

        if (!response.ok) {
          throw new Error('Failed to submit feedback')
        }

        const newFeedback = await response.json()
        
        set((state) => ({
          feedbackItems: [newFeedback, ...state.feedbackItems],
          isLoading: false,
          error: null,
        }))
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to submit feedback',
          isLoading: false,
        })
        throw error
      }
    },

    loadMoreFeedback: async (username) => {
      const state = get()
      if (!state.hasMore || state.isLoading) return
      
      await state.fetchFeedback(username, state.currentPage + 1, true)
    },

    refreshFeedback: async (username) => {
      set({ lastFetched: null, currentPage: 1 }) // Clear cache and reset page
      await get().fetchFeedback(username, 1)
    },

    clearFeedback: () => {
      set({
        feedbackItems: [],
        lastFetched: null,
        hasMore: true,
        currentPage: 1,
        error: null,
      })
    },

    markAsRead: (feedbackId) => {
      set((state) => ({
        feedbackItems: state.feedbackItems.map((item) =>
          item.id === feedbackId ? { ...item, isRead: true } : item
        ),
      }))
    },

    markAsDone: (feedbackId) => {
      set((state) => ({
        feedbackItems: state.feedbackItems.map((item) =>
          item.id === feedbackId ? { ...item, isDone: true } : item
        ),
      }))
    },

    clearError: () => set({ error: null }),
    
    setLoading: (loading) => set({ isLoading: loading }),

    // AI-powered action implementations
    processFeedbackWithAI: async (feedbackId) => {
      const state = get()
      const feedback = state.feedbackItems.find(f => f.id === feedbackId)
      
      if (!feedback) return
      
      // Check cache first
      const cachedAnalysis = state.getCachedAIAnalysis(feedbackId)
      if (cachedAnalysis) {
        set({
          feedbackItems: state.feedbackItems.map(f => 
            f.id === feedbackId ? { ...f, aiAnalysis: cachedAnalysis } : f
          )
        })
        return
      }
      
      // Mark as processing
      set({
        feedbackItems: state.feedbackItems.map(f => 
          f.id === feedbackId ? { ...f, isProcessingAI: true } : f
        )
      })
      
      try {
        // Import OpenAI functions dynamically to avoid issues
        const { analyzeSentiment, translateToIndonesian, generateResponseSuggestions } = await import('../lib/openai')
        
        // Perform AI analysis
        const [sentimentAnalysis, translation, suggestions] = await Promise.all([
          analyzeSentiment(feedback.message),
          translateToIndonesian(feedback.message),
          generateResponseSuggestions(feedback.message, feedback.sentiment)
        ])
        
        const aiAnalysis = {
          sentiment: sentimentAnalysis,
          translation,
          suggestions,
          processedAt: new Date().toISOString()
        }
        
        // Cache the analysis
        state.setCachedAIAnalysis(feedbackId, aiAnalysis)
        
        // Update feedback with AI analysis
        set({
          feedbackItems: state.feedbackItems.map(f => 
            f.id === feedbackId 
              ? { ...f, aiAnalysis, isProcessingAI: false }
              : f
          )
        })
      } catch (error) {
        console.error('AI processing failed:', error)
        
        // Remove processing state on error
        set({
          feedbackItems: state.feedbackItems.map(f => 
            f.id === feedbackId ? { ...f, isProcessingAI: false } : f
          )
        })
      }
    },

    updateFeedbackSentiment: (feedbackId, sentiment) => {
      set((state) => ({
        feedbackItems: state.feedbackItems.map((item) =>
          item.id === feedbackId ? { ...item, sentiment } : item
        ),
      }))
    },

    batchProcessFeedbackWithAI: async (feedbackIds) => {
      const { processFeedbackWithAI } = await import('../lib/openai')
      
      // Mark all as processing
      set((state) => ({
        feedbackItems: state.feedbackItems.map((item) =>
          feedbackIds.includes(item.id) ? { ...item, isProcessingAI: true } : item
        ),
      }))

      try {
        const feedbackItems = get().feedbackItems.filter(item => feedbackIds.includes(item.id))
        
        // Process in batches of 3 to avoid rate limits
        const batchSize = 3
        for (let i = 0; i < feedbackItems.length; i += batchSize) {
          const batch = feedbackItems.slice(i, i + batchSize)
          
          await Promise.all(
            batch.map(async (feedback) => {
              try {
                const aiResult = await processFeedbackWithAI(feedback.message)
                
                set((state) => ({
                  feedbackItems: state.feedbackItems.map((item) =>
                    item.id === feedback.id
                      ? {
                          ...item,
                          isProcessingAI: false,
                          sentiment: aiResult.sentiment.sentiment,
                          aiAnalysis: {
                            sentiment: aiResult.sentiment,
                            translation: aiResult.translation,
                            suggestions: aiResult.suggestions,
                            processedAt: new Date().toISOString()
                          }
                        }
                      : item
                  ),
                }))
              } catch (error) {
                console.error(`Error processing feedback ${feedback.id}:`, error)
                set((state) => ({
                  feedbackItems: state.feedbackItems.map((item) =>
                    item.id === feedback.id ? { ...item, isProcessingAI: false } : item
                  ),
                }))
              }
            })
          )
          
          // Add delay between batches
          if (i + batchSize < feedbackItems.length) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      } catch (error) {
        console.error('Error in batch processing:', error)
        set((state) => ({
          feedbackItems: state.feedbackItems.map((item) =>
            feedbackIds.includes(item.id) ? { ...item, isProcessingAI: false } : item
          ),
          error: 'Failed to batch process feedback with AI'
        }))
      }
    },

    // Cache management methods
    getCachedAIAnalysis: (feedbackId) => {
      const state = get()
      const analysis = state.aiAnalysisCache.get(feedbackId)
      const timestamp = state.cacheTimestamps.get(feedbackId)
      
      if (analysis && timestamp && (Date.now() - timestamp) < AI_CACHE_DURATION) {
        return analysis
      }
      
      return null
    },

    setCachedAIAnalysis: (feedbackId, analysis) => {
      const state = get()
      const newCache = new Map(state.aiAnalysisCache)
      const newTimestamps = new Map(state.cacheTimestamps)
      
      newCache.set(feedbackId, analysis)
      newTimestamps.set(feedbackId, Date.now())
      
      set({
        aiAnalysisCache: newCache,
        cacheTimestamps: newTimestamps
      })
    },

    clearAICache: () => {
      set({
        aiAnalysisCache: new Map(),
        cacheTimestamps: new Map()
      })
    }
  }),
  {
    name: 'feedback-storage',
    partialize: (state) => ({
      feedbackItems: state.feedbackItems,
      lastFetched: state.lastFetched,
    }),
  }
))