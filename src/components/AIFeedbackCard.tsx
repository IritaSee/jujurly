import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { 
  Brain, 
  Languages, 
  Lightbulb, 
  Copy, 
  RefreshCw, 
  Sparkles,
  Globe,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { type FeedbackItem } from '../store/feedbackStore';
import { useFeedbackStore } from '../store/feedbackStore';
import { toast } from 'sonner';

interface AIFeedbackCardProps {
  feedback: FeedbackItem;
  isSelected: boolean;
  isProcessingAI: boolean;
  showTranslations: boolean;
  bulkActionMode: boolean;
  selectedFeedback: Set<string>;
  feedbackReactions: Record<string, string>;
  draftResponses: Record<string, string>;
  archivedFeedback: Set<string>;
  onMarkAsRead: (id: string) => void;
  onMarkAsDone: (id: string) => void;
  onBulkSelect: (id: string) => void;
  onReaction: (id: string, reaction: string) => void;
  onPreview: (feedback: FeedbackItem) => void;
  onArchive: (id: string) => void;
  onDraftResponse: (id: string, response: string) => void;
  onSendResponse: (feedbackId: string, response: string) => void;
  onProcessWithAI: (id: string) => void;
  onSelectSuggestion: (feedbackId: string, suggestion: string) => void;
  onResponseSelect?: (response: string) => void;
}

export function AIFeedbackCard({ 
  feedback, 
  isProcessingAI, 
  showTranslations, 
  onProcessWithAI, 
  onSelectSuggestion, 
  onResponseSelect 
}: AIFeedbackCardProps) {
  useFeedbackStore();
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleProcessWithAIClick = () => {
    onProcessWithAI(feedback.id || '');
  };

  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    toast.success('Saran balasan disalin ke clipboard');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    onSelectSuggestion(feedback.id || '', suggestion);
    onResponseSelect?.(suggestion);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'friendly': return 'bg-green-100 text-green-800';
      case 'empathetic': return 'bg-purple-100 text-purple-800';
      case 'apologetic': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Feedback Analysis
          </CardTitle>
          {!feedback.aiAnalysis && (
            <Button
              onClick={handleProcessWithAIClick}
              disabled={isProcessingAI}
              size="sm"
              variant="outline"
            >
              {isProcessingAI ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analisis dengan AI
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {feedback.aiAnalysis && (
        <CardContent className="space-y-6">
          {/* Translation Section */}
          {showTranslations && !feedback.aiAnalysis.translation.isIndonesian && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold">Terjemahan</h4>
                <Badge variant="outline" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  {feedback.aiAnalysis.translation.detectedLanguage.toUpperCase()}
                </Badge>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Teks Asli:</p>
                <p className="text-sm italic">{feedback.aiAnalysis.translation.originalText}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Terjemahan Indonesia:</p>
                <p className="text-sm font-medium">{feedback.aiAnalysis.translation.translatedText}</p>
              </div>
            </div>
          )}

          {/* Enhanced Sentiment Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h4 className="font-semibold">Analisis Sentimen Lanjutan</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sentimen:</span>
                  <Badge className={getSentimentColor(feedback.aiAnalysis.sentiment.sentiment)}>
                    {feedback.aiAnalysis.sentiment.sentiment === 'positive' ? 'Positif' :
                     feedback.aiAnalysis.sentiment.sentiment === 'negative' ? 'Negatif' : 'Netral'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tingkat Keyakinan:</span>
                  <span className="text-sm font-bold">
                    {Math.round(feedback.aiAnalysis.sentiment.confidence * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {feedback.aiAnalysis.sentiment.emotions.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Emosi Terdeteksi:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feedback.aiAnalysis.sentiment.emotions.map((emotion, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {feedback.aiAnalysis.sentiment.keywords.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Kata Kunci:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feedback.aiAnalysis.sentiment.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Response Suggestions */}
          {feedback.aiAnalysis.suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <h4 className="font-semibold">Saran Balasan AI</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Sembunyikan' : 'Tampilkan Semua'}
                </Button>
              </div>
              
              <div className="space-y-3">
                {feedback.aiAnalysis.suggestions
                  .slice(0, isExpanded ? undefined : 2)
                  .map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getToneColor(suggestion.tone)}>
                          {suggestion.tone === 'professional' ? 'Profesional' :
                           suggestion.tone === 'friendly' ? 'Ramah' :
                           suggestion.tone === 'empathetic' ? 'Empatik' : 'Permintaan Maaf'}
                        </Badge>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority === 'high' ? 'Tinggi' :
                           suggestion.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopySuggestion(suggestion.suggestion)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectSuggestion(suggestion.suggestion)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {suggestion.suggestion}
                    </p>
                  </div>
                ))}
              </div>
              
              {!isExpanded && feedback.aiAnalysis.suggestions.length > 2 && (
                <p className="text-xs text-gray-500 text-center">
                  +{feedback.aiAnalysis.suggestions.length - 2} saran lainnya
                </p>
              )}
            </div>
          )}

          {/* Selected Response Preview */}
          {selectedSuggestion && (
            <div className="space-y-3">
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Balasan Terpilih:</h4>
                <Textarea
                  value={selectedSuggestion}
                  onChange={(e) => setSelectedSuggestion(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Edit balasan sesuai kebutuhan..."
                />
              </div>
            </div>
          )}

          {/* Processing Timestamp */}
          <div className="text-xs text-gray-500 text-right">
            Dianalisis pada: {new Date(feedback.aiAnalysis.processedAt).toLocaleString('id-ID')}
          </div>
        </CardContent>
      )}
    </Card>
  );
}