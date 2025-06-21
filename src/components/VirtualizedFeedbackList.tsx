import React from 'react'
import { useVirtualScrolling } from '../hooks/useVirtualScrolling'
import { AIFeedbackCard } from './AIFeedbackCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { formatRelativeTime, getSentimentIcon } from '../lib/utils'
import { type FeedbackItem } from '../store/feedbackStore'
import {
  MessageSquare,
  Heart,
  Archive,
  CheckSquare,
  Reply,
  Sparkles
} from 'lucide-react'

interface VirtualizedFeedbackListProps {
  feedbackItems: FeedbackItem[]
  containerHeight: number
  itemHeight?: number
  showAIAnalysis: boolean
  showTranslations: boolean
  bulkActionMode: boolean
  selectedFeedback: Set<string>
  feedbackReactions: { [key: string]: string }
  draftResponses: { [key: string]: string }
  archivedFeedback: Set<string>
  aiProcessingQueue: Set<string>
  onMarkAsRead: (id: string) => void
  onMarkAsDone: (id: string) => void
  onBulkSelect: (id: string) => void
  onReaction: (id: string, reaction: string) => void
  onPreview: (feedback: FeedbackItem) => void
  onArchive: (id: string) => void
  onDraftResponse: (id: string, response: string) => void
  onSendResponse: (id: string, response: string) => void
  onProcessWithAI: (id: string) => void
  onSelectSuggestion: (id: string, suggestion: string) => void
}

export function VirtualizedFeedbackList({
  feedbackItems,
  containerHeight,
  itemHeight = 200,
  showAIAnalysis,
  showTranslations,
  bulkActionMode,
  selectedFeedback,
  feedbackReactions,
  draftResponses,
  archivedFeedback,
  aiProcessingQueue,
  onMarkAsRead,
  onMarkAsDone,
  onBulkSelect,
  onReaction,
  onPreview,
  onArchive,
  onDraftResponse,
  onSendResponse,
  onProcessWithAI,
  onSelectSuggestion
}: VirtualizedFeedbackListProps) {
  const { virtualItems, scrollElementProps, containerProps } = useVirtualScrolling(
    feedbackItems,
    {
      itemHeight,
      containerHeight,
      overscan: 5
    }
  )

  const renderFeedbackItem = (feedback: FeedbackItem, style: React.CSSProperties) => {
    const SentimentIcon = getSentimentIcon(feedback.sentiment)
    const isSelected = selectedFeedback.has(feedback.id || '')
    const isProcessingAI = aiProcessingQueue.has(feedback.id || '')

    // Use AI-enhanced card if AI analysis is enabled and available, or if currently processing
    if ((showAIAnalysis && feedback.aiAnalysis) || isProcessingAI) {
      return (
        <div key={feedback.id} style={style} className="px-4 pb-4 relative bg-white">
          <AIFeedbackCard
            feedback={feedback}
            isSelected={isSelected}
            isProcessingAI={isProcessingAI}
            showTranslations={showTranslations}
            bulkActionMode={bulkActionMode}
            selectedFeedback={selectedFeedback}
            feedbackReactions={feedbackReactions}
            draftResponses={draftResponses}
            archivedFeedback={archivedFeedback}
            onMarkAsRead={onMarkAsRead}
            onMarkAsDone={onMarkAsDone}
            onBulkSelect={onBulkSelect}
            onReaction={onReaction}
            onPreview={onPreview}
            onArchive={onArchive}
            onDraftResponse={onDraftResponse}
            onSendResponse={onSendResponse}
            onProcessWithAI={onProcessWithAI}
            onSelectSuggestion={onSelectSuggestion}
          />
        </div>
      )
    }

    // Regular feedback card
    return (
      <div key={feedback.id} style={style} className="px-4 pb-4 relative bg-white">
        <Card 
          className={`hover:shadow-md transition-shadow cursor-pointer ${
            feedback.isDone ? 'ring-2 ring-green-200 bg-green-50/50' :
            !feedback.isRead ? 'ring-2 ring-blue-200 bg-blue-50/50' : ''
          } ${
            isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onMarkAsRead(feedback.id || '')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Bulk Selection Checkbox */}
              {(bulkActionMode || selectedFeedback.size > 0) && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onBulkSelect(feedback.id || '')}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
              )}
              
              {/* Avatar */}
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {feedback.fromUser?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {feedback.fromUser || 'Anonymous'}
                    </h3>
                    <Badge 
                      variant="secondary"
                      className={`${
                        feedback.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        feedback.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <SentimentIcon className="w-3 h-3 mr-1" />
                      {feedback.sentiment === 'positive' ? 'Positif' :
                       feedback.sentiment === 'negative' ? 'Negatif' :
                       'Netral'}
                    </Badge>
                    {!feedback.isRead && (
                      <Badge variant="default" className="bg-blue-500">
                        Baru
                      </Badge>
                    )}
                    {feedback.isDone && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckSquare className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatRelativeTime(feedback.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-foreground mb-4 leading-relaxed">
                  {feedback.message}
                </p>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Reaction */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        const currentReaction = feedbackReactions[feedback.id || '']
                        const newReaction = currentReaction === '❤️' ? '' : '❤️'
                        onReaction(feedback.id || '', newReaction)
                      }}
                      className={`h-8 px-2 ${
                        feedbackReactions[feedback.id || ''] === '❤️' 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        feedbackReactions[feedback.id || ''] === '❤️' ? 'fill-current' : ''
                      }`} />
                    </Button>
                    
                    {/* Preview */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPreview(feedback)
                      }}
                      className="h-8 px-2"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Balas
                    </Button>
                    
                    {/* AI Process */}
                    {!feedback.aiAnalysis && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onProcessWithAI(feedback.id || '')
                        }}
                        disabled={isProcessingAI}
                        className="h-8 px-2"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        {isProcessingAI ? 'Processing...' : 'AI Analysis'}
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Archive */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onArchive(feedback.id || '')
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    
                    {/* Mark as Done */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAsDone(feedback.id || '')
                      }}
                      className={`h-8 w-8 p-0 ${
                        feedback.isDone ? 'text-green-600 bg-green-50' : ''
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (feedbackItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Belum ada feedback
        </h3>
        <p className="text-muted-foreground max-w-md">
          Feedback yang masuk akan ditampilkan di sini. Bagikan link profil Anda untuk mulai menerima feedback.
        </p>
      </div>
    )
  }

  return (
    <div {...scrollElementProps}>
      <div {...containerProps}>
        {virtualItems.map(({ start, item }) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            top: start,
            left: 0,
            right: 0,
            minHeight: itemHeight,
            zIndex: 1
          }
          
          return renderFeedbackItem(item, style)
        })}
      </div>
    </div>
  )
}