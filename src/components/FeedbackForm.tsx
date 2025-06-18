import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedbackFormProps {
  recipientUsername?: string
}

interface FeedbackData {
  anonymousId: string
  feedbackText: string
  context: string
  emailOptIn: boolean
  email?: string
}

const FeedbackForm = ({ recipientUsername }: FeedbackFormProps) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FeedbackData>({
    anonymousId: '',
    feedbackText: '',
    context: '',
    emailOptIn: false,
    email: ''
  })

  const totalSteps = 4

  const handleInputChange = (field: keyof FeedbackData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.anonymousId.trim().length >= 2
      case 2:
        return formData.feedbackText.trim().length >= 10
      case 3:
        return formData.context.trim().length >= 5
      case 4:
        return !formData.emailOptIn
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    } else {
      setError(getStepError(currentStep))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError(null)
  }

  const getStepError = (step: number): string => {
    switch (step) {
      case 1:
        return 'Please enter at least 2 characters for your identifier'
      case 2:
        return 'Please provide feedback with at least 10 characters'
      case 3:
        return 'Please provide some context (at least 5 characters)'
      case 4:
        return 'Please enter a valid email address'
      default:
        return 'Please complete this step'
    }
  }

  const submitFeedback = async () => {
    if (!validateStep(4)) {
      setError(getStepError(4))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://gzzdrs2tjx.ap-southeast-1.awsapprunner.com'
      
      const response = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recipientUsername: recipientUsername || 'anonymous',
          timestamp: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.statusText}`)
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-0 shadow-lg">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Feedback Sent!</CardTitle>
            <CardDescription className="text-green-600">
              Thank you for your honest feedback. It helps make things better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="anonymousId">How should we identify you?</Label>
              <Input
                id="anonymousId"
                placeholder="e.g., Anonymous Friend, Colleague, etc."
                value={formData.anonymousId}
                onChange={(e) => handleInputChange('anonymousId', e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This helps the recipient understand who the feedback is from without revealing your identity.
              </p>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedbackText">Your Honest Feedback</Label>
              <Textarea
                id="feedbackText"
                placeholder="Share your thoughts honestly and constructively..."
                value={formData.feedbackText}
                onChange={(e) => handleInputChange('feedbackText', e.target.value)}
                className="mt-2 min-h-[120px]"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Be specific and constructive. Your honest opinion helps them grow.
              </p>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="context">Context (Optional but Helpful)</Label>
              <Textarea
                id="context"
                placeholder="What's this feedback about? Any specific situation or project?"
                value={formData.context}
                onChange={(e) => handleInputChange('context', e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Providing context helps the recipient understand and act on your feedback better.
              </p>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailOptIn"
                  checked={formData.emailOptIn}
                  onChange={(e) => handleInputChange('emailOptIn', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="emailOptIn" className="text-sm">
                  I'd like to receive updates about Jujurly (optional)
                </Label>
              </div>
              
              {formData.emailOptIn && (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Ready to Submit</h4>
                <p className="text-sm text-blue-700">
                  Your feedback will be sent anonymously to {recipientUsername || 'the recipient'}. 
                  They won't see your personal information.
                </p>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          <CardTitle className="text-2xl">
            {currentStep === 1 && 'Identify Yourself'}
            {currentStep === 2 && 'Share Your Feedback'}
            {currentStep === 3 && 'Add Context'}
            {currentStep === 4 && 'Final Step'}
          </CardTitle>
          
          <CardDescription>
            {recipientUsername && (
              <span>Giving feedback to <strong>{recipientUsername}</strong></span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg mt-4">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className={cn(currentStep === 1 && 'invisible')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={submitFeedback} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </div>
                ) : (
                  <>
                    Send Feedback
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FeedbackForm
