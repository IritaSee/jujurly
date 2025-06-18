import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, addDays } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { useFeedbackStore } from '../store/feedbackStore'
import { DashboardSkeleton } from '../components/LoadingStates'
import { useAnnouncement } from '../components/Accessibility'
import { AIFeedbackCard } from '../components/AIFeedbackCard'
import { VirtualizedFeedbackList } from '../components/VirtualizedFeedbackList'
import { Pagination, PaginationInfo } from '../components/Pagination'
import { usePagination } from '../hooks/usePagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import MoodTracker from '../components/MoodTracker'
import { 
  LogOut, 
  User,
  Search, 
  MessageSquare, 
  Star,
  TrendingUp, 
  Users, 
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  ExternalLink,
  Share2,
  Bell,
  Copy,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Heart,
  Repeat,
  HelpCircle,
  BarChart3,
  Settings,
  Plus,
  Menu,
  X,
  Download,
  CheckSquare,
  Square,
  Trash2,
  Archive,
  MoreHorizontal,
  Command,
  Keyboard,
  CheckCircle,
  Eye,
  Send,
  Brain,
  Sparkles,
  Zap,
  Languages
} from 'lucide-react'
import { formatRelativeTime, getSentimentColor, getSentimentIcon } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
// import { useCallback, useEffect, useMemo, useState } from 'react'

interface FeedbackItem {
  id: string
  message: string
  sentiment: 'positive' | 'negative' | 'neutral'
  timestamp: string
  isAnonymous: boolean
  fromUser?: string
  isRead: boolean
  sender?: string
  isArchived?: boolean
  isDone?: boolean
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { 
    feedbackItems, 
    isLoading, 
    error, 
    fetchFeedback, 
    refreshFeedback,
    markAsRead,
    markAsDone,
    processFeedbackWithAI,
    batchProcessFeedbackWithAI,
    updateFeedbackSentiment
  } = useFeedbackStore();
  const { announce } = useAnnouncement();
  
  // Helper functions - getSentimentIcon is imported from utils
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [shareUrl, setShareUrl] = useState<string>('')
  const [userMood, setUserMood] = useState<string>('😊')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isStatsCollapsed, setIsStatsCollapsed] = useState<boolean>(false)
  const [feedbackReactions, setFeedbackReactions] = useState<{[key: string]: string}>({})
  
  // New state for enhanced features
  const [selectedFeedback, setSelectedFeedback] = useState<Set<string>>(new Set())
  const [dateRange, setDateRange] = useState<{from?: Date, to?: Date}>({})
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [bulkActionMode, setBulkActionMode] = useState(false)
  // const [markAsDone, setMarkAsDone] = useState(false)
  // New improvements state
  const [selectedFeedbackForPreview, setSelectedFeedbackForPreview] = useState<FeedbackItem | null>(null)
  const [draftResponses, setDraftResponses] = useState<{[key: string]: string}>({})
  const [archivedFeedback, setArchivedFeedback] = useState<Set<string>>(new Set())
  const [showArchivedFeedback, setShowArchivedFeedback] = useState(false)
  
  // AI-powered features state
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [aiProcessingQueue, setAiProcessingQueue] = useState<Set<string>>(new Set())
  const [selectedResponseSuggestion, setSelectedResponseSuggestion] = useState<{[key: string]: string}>({})
  const [showTranslations, setShowTranslations] = useState(true)

  // Dark mode persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('jujurly-dark-mode')
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode)
      setIsDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  // Auto-save draft responses
  useEffect(() => {
    const savedDrafts = localStorage.getItem('jujurly-draft-responses')
    if (savedDrafts) {
      setDraftResponses(JSON.parse(savedDrafts))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('jujurly-draft-responses', JSON.stringify(draftResponses))
  }, [draftResponses])

  // Load archived feedback from localStorage
  useEffect(() => {
    const savedArchived = localStorage.getItem('jujurly-archived-feedback')
    if (savedArchived) {
      setArchivedFeedback(new Set(JSON.parse(savedArchived)))
    }
  }, [])

  // Save archived feedback to localStorage
  useEffect(() => {
    localStorage.setItem('jujurly-archived-feedback', JSON.stringify(Array.from(archivedFeedback)))
  }, [archivedFeedback])

  // Fetch feedback data on component mount
  useEffect(() => {
    if (user?.username) {
      fetchFeedback(user.username);
      setShareUrl(`${window.location.origin}/ke/${user.username}`);
    }
  }, [user?.username, fetchFeedback]);

   // Filtered feedback - moved here to be available for all functions
  const filteredFeedback = useMemo(() => {
    return feedbackItems.filter(feedback => {
      const isArchived = archivedFeedback.has(feedback.id || '')
      
      // Show archived items only when explicitly requested
      if (showArchivedFeedback !== isArchived) {
        return false
      }
      
      const matchesSearch = !searchTerm || 
        feedback.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.fromUser?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSentiment = selectedSentiment === 'all' || feedback.sentiment === selectedSentiment
      
      const matchesDate = !dateRange.from || !dateRange.to || 
        (new Date(feedback.timestamp) >= dateRange.from && new Date(feedback.timestamp) <= dateRange.to)
      
      return matchesSearch && matchesSentiment && matchesDate
    })
  }, [feedbackItems, searchTerm, selectedSentiment, dateRange, archivedFeedback, showArchivedFeedback])

  const handleLogout = () => {
    logout()
    announce('Berhasil logout. Sampai jumpa!')
    navigate('/login')
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      announce('Link berhasil disalin! 📋')
      toast.success('Link berhasil disalin! 📋', {
        description: 'Sekarang kamu bisa bagikan link ini ke teman-teman',
      })
    } catch (err) {
      console.error('Failed to copy URL:', err)
      announce('Gagal menyalin link. Coba lagi ya!')
      toast.error('Gagal menyalin link', {
        description: 'Coba lagi ya! 😅'
      })
    }
  }

  const handleMarkAsRead = (feedbackId: string) => {
    markAsRead(feedbackId)
    announce('Feedback sudah ditandai sebagai dibaca ✓')
  }

  const handleMarkAsDone = (feedbackId: string) => {
    markAsDone(feedbackId)
    announce('Feedback sudah ditandai sebagai selesai ✓')
  }

  const handleMoodChange = async (mood: any) => {
    setUserMood(mood.emoji)
    announce(`Mood kamu hari ini: ${mood.label}`)
    toast.success(`Mood updated! ${mood.emoji}`, {
      description: `Semoga harimu ${mood.id === 'happy' ? 'tetap menyenangkan' : mood.id === 'neutral' ? 'semakin membaik' : 'segera membaik'} ya! 💪`
    })
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('jujurly-dark-mode', JSON.stringify(newDarkMode))
    announce(newDarkMode ? 'Mode gelap diaktifkan' : 'Mode terang diaktifkan')
  }

  const handleReaction = (feedbackId: string, reaction: string) => {
    setFeedbackReactions(prev => ({
      ...prev,
      [feedbackId]: prev[feedbackId] === reaction ? '' : reaction
    }))
    announce(`Reaksi ${reaction} ${feedbackReactions[feedbackId] === reaction ? 'dihapus' : 'ditambahkan'}`)
  }

  // New handler functions for improvements
  const handleArchiveFeedback = useCallback((feedbackId: string) => {
    setArchivedFeedback(prev => {
      const newSet = new Set(prev)
      if (newSet.has(feedbackId)) {
        newSet.delete(feedbackId)
        announce('Feedback dipulihkan dari arsip')
      } else {
        newSet.add(feedbackId)
        announce('Feedback diarsipkan')
      }
      return newSet
    })
  }, [announce])

  const handleDraftResponse = useCallback((feedbackId: string, draft: string) => {
    setDraftResponses(prev => ({
      ...prev,
      [feedbackId]: draft
    }))
  }, [])

  const handlePreviewFeedback = useCallback((feedback: FeedbackItem) => {
    setSelectedFeedbackForPreview(feedback)
  }, [])

  const handleSendResponse = useCallback((feedbackId: string, response: string) => {
    // Here you would typically send the response to your backend
    console.log('Sending response:', { feedbackId, response })
    
    // Clear the draft after sending
    setDraftResponses(prev => {
      const newDrafts = { ...prev }
      delete newDrafts[feedbackId]
      return newDrafts
    })
    
    toast.success('Respons berhasil dikirim!')
    announce('Respons berhasil dikirim')
  }, [announce])

  // AI-powered handler functions
  const handleProcessWithAI = useCallback(async (feedbackId: string) => {
    try {
      setAiProcessingQueue(prev => new Set(prev).add(feedbackId))
      await processFeedbackWithAI(feedbackId)
      toast.success('Feedback berhasil dianalisis dengan AI!')
      announce('Feedback berhasil dianalisis dengan AI')
    } catch (error) {
      toast.error('Gagal menganalisis feedback dengan AI')
      announce('Gagal menganalisis feedback dengan AI')
    } finally {
      setAiProcessingQueue(prev => {
        const newSet = new Set(prev)
        newSet.delete(feedbackId)
        return newSet
      })
    }
  }, [processFeedbackWithAI, announce])

  const handleBatchProcessAI = useCallback(async () => {
    if (selectedFeedback.size === 0) {
      toast.error('Pilih feedback yang ingin dianalisis')
      return
    }

    try {
      const feedbackIds = Array.from(selectedFeedback)
      setAiProcessingQueue(prev => new Set([...prev, ...feedbackIds]))
      await batchProcessFeedbackWithAI(feedbackIds)
      toast.success(`${feedbackIds.length} feedback berhasil dianalisis dengan AI!`)
      announce(`${feedbackIds.length} feedback berhasil dianalisis dengan AI`)
      setSelectedFeedback(new Set()) // Clear selection
    } catch (error) {
      toast.error('Gagal menganalisis feedback secara batch')
      announce('Gagal menganalisis feedback secara batch')
    } finally {
      setAiProcessingQueue(new Set())
    }
  }, [selectedFeedback, batchProcessFeedbackWithAI, announce])

  const handleSelectResponseSuggestion = useCallback((feedbackId: string, suggestion: string) => {
    setSelectedResponseSuggestion(prev => ({
      ...prev,
      [feedbackId]: suggestion
    }))
    handleDraftResponse(feedbackId, suggestion)
    toast.success('Saran balasan dipilih!')
  }, [handleDraftResponse])

  const toggleAIAnalysis = useCallback(() => {
    setShowAIAnalysis(prev => !prev)
    announce(showAIAnalysis ? 'Panel AI disembunyikan' : 'Panel AI ditampilkan')
  }, [showAIAnalysis, announce])

  // Enhanced functionality handlers
  const handleBulkSelect = useCallback((feedbackId: string) => {
    setSelectedFeedback(prev => {
      const newSet = new Set(prev)
      if (newSet.has(feedbackId)) {
        newSet.delete(feedbackId)
      } else {
        newSet.add(feedbackId)
      }
      return newSet
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedFeedback.size === filteredFeedback.length) {
      setSelectedFeedback(new Set())
    } else {
      setSelectedFeedback(new Set(filteredFeedback.map(f => f.id || '')))
    }
  }, [selectedFeedback.size, filteredFeedback])

  const handleBulkAction = useCallback(async (action: 'markRead' | 'archive' | 'delete') => {
    const selectedIds = Array.from(selectedFeedback)
    
    switch (action) {
      case 'markRead':
        selectedIds.forEach(id => markAsRead(id))
        announce(`${selectedIds.length} feedback ditandai sebagai dibaca`)
        break
      case 'archive':
        // Implement archive functionality
        announce(`${selectedIds.length} feedback diarsipkan`)
        break
      case 'delete':
        // Implement delete functionality
        announce(`${selectedIds.length} feedback dihapus`)
        break
    }
    
    setSelectedFeedback(new Set())
    setBulkActionMode(false)
  }, [selectedFeedback, markAsRead, announce])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      const dataToExport = filteredFeedback.map(feedback => ({
        id: feedback.id,
        message: feedback.message,
        sentiment: feedback.sentiment,
        timestamp: feedback.timestamp,
        fromUser: feedback.fromUser || 'Anonymous',
        isRead: feedback.isRead
      }))
      
      const csvContent = [
        ['ID', 'Message', 'Sentiment', 'Timestamp', 'From User', 'Is Read'],
        ...dataToExport.map(item => [
          item.id,
          `"${item.message.replace(/"/g, '""')}"`,
          item.sentiment,
          item.timestamp,
          item.fromUser,
          item.isRead ? 'Yes' : 'No'
        ])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `feedback-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Data berhasil diekspor! 📊')
      announce('Data feedback berhasil diekspor ke file CSV')
    } catch (error) {
      toast.error('Gagal mengekspor data')
      announce('Gagal mengekspor data feedback')
    } finally {
      setIsExporting(false)
    }
  }, [filteredFeedback, announce])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            document.getElementById('search-input')?.focus()
            break
          case 'a':
            e.preventDefault()
            handleSelectAll()
            break
          case 'e':
            e.preventDefault()
            handleExport()
            break
          case 'r':
            e.preventDefault()
            user?.username && refreshFeedback(user.username)
            break
          case '/':
            e.preventDefault()
            setShowKeyboardShortcuts(true)
            break
        }
      }
      
      if (e.key === 'Escape') {
        setSelectedFeedback(new Set())
        setBulkActionMode(false)
        setShowKeyboardShortcuts(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSelectAll, handleExport, user?.username, refreshFeedback])

  // Search suggestions
  const searchSuggestionsData = useMemo(() => {
    const suggestions = new Set<string>()
    feedbackItems.forEach(item => {
      if (item.fromUser) suggestions.add(item.fromUser)
      // Add common words from feedback messages
      const words = item.message.toLowerCase().split(' ').filter(word => word.length > 3)
      words.forEach(word => suggestions.add(word))
    })
    return Array.from(suggestions).slice(0, 5)
  }, [feedbackItems])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = searchSuggestionsData.filter(suggestion => 
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchSuggestions(filtered.slice(0, 5))
    } else {
      setSearchSuggestions([])
    }
  }, [searchTerm, searchSuggestionsData])

  const stats = {
    total: feedbackItems.length,
    unread: feedbackItems.filter((item) => !item.isRead).length,
    positive: feedbackItems.filter((item) => item.sentiment === 'positive').length,
    negative: feedbackItems.filter((item) => item.sentiment === 'negative').length,
    neutral: feedbackItems.filter((item) => item.sentiment === 'neutral').length,
    archived: archivedFeedback.size,
    active: feedbackItems.length - archivedFeedback.size
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your feedback...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Jujurly Dashboard</h2>
      </div> */}
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Overview</h3>
          <div className="grid gap-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Feedback</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Bell className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Belum dibaca</p>
                  <p className="text-xl font-semibold">{stats.unread}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Positif Vibes</p>
                  <p className="text-xl font-semibold">{stats.positive}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aktif</p>
                  <p className="text-xl font-semibold">{stats.active}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Archive className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diarsipkan</p>
                  <p className="text-xl font-semibold">{stats.archived}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Mood Tracker */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Mood Tracker</h3>
          <MoodTracker
            onMoodSelect={handleMoodChange}
            initialMood={userMood === '😊' ? 'happy' : userMood === '😐' ? 'neutral' : 'sad'}
            showDescription={false}
            size="sm"
          />
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={copyShareUrl}>
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan Link
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => user?.username && refreshFeedback(user.username)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold text-foreground">Jujurly Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={copyShareUrl}>
              <Plus className="w-4 h-4 mr-2" />
              Bagikan Link
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
              {stats.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border bg-muted/30">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Feedback Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  {/* Search and Filters Row */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 w-full sm:w-auto relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search-input"
                        placeholder="🔍 Cari feedback kamu di sini... (Cmd+K)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      {/* Search Suggestions */}
                      {searchSuggestions.length > 0 && searchTerm && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                              onClick={() => setSearchTerm(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <select
                        value={selectedSentiment}
                        onChange={(e) => setSelectedSentiment(e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                      >
                        <option value="all">Semua Sentimen</option>
                        <option value="positive">😊 Positif</option>
                        <option value="neutral">😐 Netral</option>
                        <option value="negative">😞 Negatif</option>
                      </select>
                      
                      {/* Date Range Picker */}
                      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                              ) : (
                                dateRange.from.toLocaleDateString()
                              )
                            ) : (
                              "Pilih tanggal"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.from}
                            selected={dateRange as { from: Date; to?: Date }}
                            onSelect={(range) => {
                              setDateRange(range || { from: undefined, to: undefined })
                              if (range?.from && range?.to) {
                                setShowDatePicker(false)
                              }
                            }}
                            numberOfMonths={2}
                          />
                          <div className="p-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDateRange({ from: undefined, to: undefined })
                                setShowDatePicker(false)
                              }}
                              className="w-full"
                            >
                              Reset Filter
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => user?.username && refreshFeedback(user.username)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Bulk Actions Row */}
                  {(selectedFeedback.size > 0 || bulkActionMode) && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedFeedback.size === filteredFeedback.length && filteredFeedback.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-medium text-blue-700">
                          {selectedFeedback.size > 0 ? `${selectedFeedback.size} dipilih` : 'Pilih semua'}
                        </span>
                      </div>
                      
                      {selectedFeedback.size > 0 && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('markRead')}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Tandai Dibaca
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('archive')}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Archive className="h-4 w-4 mr-1" />
                            Arsipkan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkAction('delete')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleBatchProcessAI}
                            disabled={aiProcessingQueue.size > 0}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            {aiProcessingQueue.size > 0 ? 'Memproses...' : 'Analisis AI'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setBulkActionMode(!bulkActionMode)}
                        variant="outline"
                        size="sm"
                        className={bulkActionMode ? 'bg-blue-50 border-blue-200' : ''}
                      >
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Mode Pilih
                      </Button>
                      
                      <Button
                        onClick={handleExport}
                        variant="outline"
                        size="sm"
                        disabled={isExporting || filteredFeedback.length === 0}
                      >
                        <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                        {isExporting ? 'Mengekspor...' : 'Ekspor Data'}
                      </Button>
                      
                      <Button
                        onClick={toggleAIAnalysis}
                        variant="outline"
                        size="sm"
                        className={showAIAnalysis ? 'bg-purple-50 border-purple-200' : ''}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Analysis
                      </Button>
                      
                      <Button
                        onClick={() => {
                          console.log('Terjemahan button clicked, current state:', showTranslations)
                          setShowTranslations(!showTranslations)
                        }}
                        variant="outline"
                        size="sm"
                        className={`${showTranslations ? 'bg-blue-50 border-blue-200 border-2' : 'border-2 border-gray-300'} cursor-pointer`}
                        style={{ pointerEvents: 'auto', zIndex: 10 }}
                        type="button"
                      >
                        <Languages className="h-4 w-4 mr-2" />
                        Terjemahan {showTranslations ? '✓' : ''}
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => setShowKeyboardShortcuts(true)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500"
                    >
                      <Keyboard className="h-4 w-4 mr-2" />
                      Shortcuts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State with Skeletons */}
            {isLoading && <DashboardSkeleton />}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">Terjadi Kesalahan</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button 
                  onClick={() => user?.username && refreshFeedback(user.username)}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Feedback List */}
            <div className="space-y-4">
              {!isLoading && !error && filteredFeedback.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">💬</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">Belum ada feedback yang cocok</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm || selectedSentiment !== 'all' || dateRange.from ? 
                      'Coba ubah filter pencarian atau tambahkan feedback baru' :
                      'Feedback dari pengguna akan muncul di sini. Bagikan link untuk mulai menerima feedback!'
                    }
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => copyShareUrl()}
                      variant="default"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan Link
                    </Button>
                    {(searchTerm || selectedSentiment !== 'all' || dateRange.from) && (
                      <Button 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedSentiment('all')
                          setDateRange({ from: undefined, to: undefined })
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Reset Filter
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                filteredFeedback.map((feedback) => {
                  const SentimentIcon = getSentimentIcon(feedback.sentiment)
                  const isSelected = selectedFeedback.has(feedback.id || '')
                  const isProcessingAI = aiProcessingQueue.has(feedback.id || '')
                  
                  // Use AI-enhanced card if AI analysis is enabled and available
                  if (showAIAnalysis && (feedback.aiAnalysis || isProcessingAI)) {
                    return (
                      <AIFeedbackCard
                        key={feedback.id}
                        feedback={feedback}
                        isSelected={isSelected}
                        isProcessingAI={isProcessingAI}
                        showTranslations={showTranslations}
                        bulkActionMode={bulkActionMode}
                        selectedFeedback={selectedFeedback}
                        feedbackReactions={feedbackReactions}
                        draftResponses={draftResponses}
                        archivedFeedback={archivedFeedback}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAsDone={handleMarkAsDone}
                        onBulkSelect={handleBulkSelect}
                        onReaction={handleReaction}
                        onPreview={handlePreviewFeedback}
                        onArchive={handleArchiveFeedback}
                        onDraftResponse={handleDraftResponse}
                        onSendResponse={handleSendResponse}
                        onProcessWithAI={handleProcessWithAI}
                        onSelectSuggestion={handleSelectResponseSuggestion}
                      />
                    )
                  }
                  
                  return (
                    <Card 
                      key={feedback.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        feedback.isDone ? 'ring-2 ring-green-200 bg-green-50/50' :
                        !feedback.isRead ? 'ring-2 ring-blue-200 bg-blue-50/50' : ''
                      } ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleMarkAsRead(feedback.id || '')}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Bulk Selection Checkbox */}
                          {(bulkActionMode || selectedFeedback.size > 0) && (
                            <div className="flex items-center pt-1">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleBulkSelect(feedback.id || '')}
                                className="h-4 w-4"
                              />
                            </div>
                          )}
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="" />
                            <AvatarFallback>{feedback.fromUser?.charAt(0) || 'A'}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-foreground">{feedback.fromUser || 'Anonymous'}</h4>
                                <p className="text-sm text-muted-foreground">{formatRelativeTime(feedback.timestamp)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!feedback.isRead && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    Baru
                                  </Badge>
                                )}
                                <Badge 
                                  variant="secondary"
                                  className={`${
                                    feedback.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                    feedback.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {feedback.sentiment === 'positive' ? '😊 Positif' :
                                   feedback.sentiment === 'negative' ? '😞 Negatif' :
                                   '😐 Netral'}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-foreground leading-relaxed">{feedback.message}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleReaction(feedback.id || '', 'heart')
                                  }}
                                  className={`flex items-center gap-1 text-xs ${
                                    feedbackReactions[feedback.id || ''] === 'heart' ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500'
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 ${
                                    feedbackReactions[feedback.id || ''] === 'heart' ? 'fill-current' : ''
                                  }`} />
                                  <span>{feedbackReactions[feedback.id || ''] === 'heart' ? '1' : '0'}</span>
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleReaction(feedback.id || '', 'repost')
                                  }}
                                  className={`flex items-center gap-1 text-xs ${
                                    feedbackReactions[feedback.id || ''] === 'repost' ? 'text-green-500 bg-green-50' : 'text-gray-500 hover:text-green-500'
                                  }`}
                                >
                                  <Repeat className="w-3 h-3" />
                                  <span>{feedbackReactions[feedback.id || ''] === 'repost' ? '1' : '0'}</span>
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePreviewFeedback(feedback)
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleArchiveFeedback(feedback.id || '')
                                  }}
                                  className={archivedFeedback.has(feedback.id || '') ? 'bg-gray-100' : ''}
                                >
                                  <Archive className="w-3 h-3 mr-1" />
                                  {archivedFeedback.has(feedback.id || '') ? 'Pulihkan' : 'Arsip'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleProcessWithAI(feedback.id || '')
                                  }}
                                  disabled={isProcessingAI || !!feedback.aiAnalysis}
                                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                                >
                                  <Brain className="w-3 h-3 mr-1" />
                                  {isProcessingAI ? 'AI...' : feedback.aiAnalysis ? 'AI ✓' : 'AI'}
                                </Button>
                                <Button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsDone(feedback.id || '')
                                }}
                                variant={feedback.isDone ? "default" : "outline"}
                                size="sm"
                                className={feedback.isDone ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                disabled={feedback.isDone}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {feedback.isDone ? 'Selesai ✓' : 'Selesai'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboardShortcuts(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fokus ke pencarian</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">K</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pilih semua</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">A</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ekspor data</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">E</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Refresh data</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">R</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tampilkan shortcuts</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">/</kbd>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tutup modal/Reset pilihan</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Esc</kbd>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Gunakan ⌘ (Mac) atau Ctrl (Windows/Linux)
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback Preview Modal */}
      <Dialog open={!!selectedFeedbackForPreview} onOpenChange={() => setSelectedFeedbackForPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Preview Feedback
            </DialogTitle>
          </DialogHeader>
          
          {selectedFeedbackForPreview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{selectedFeedbackForPreview.fromUser?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedFeedbackForPreview.fromUser || 'Anonymous'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(selectedFeedbackForPreview.timestamp)}
                  </p>
                </div>
                <Badge 
                  variant="secondary"
                  className={`ml-auto ${
                    selectedFeedbackForPreview.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                    selectedFeedbackForPreview.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {selectedFeedbackForPreview.sentiment === 'positive' ? '😊 Positif' :
                   selectedFeedbackForPreview.sentiment === 'negative' ? '😞 Negatif' :
                   '😐 Netral'}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed">{selectedFeedbackForPreview.message}</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Balas Feedback:</label>
                <Textarea
                  placeholder="Tulis balasan Anda di sini..."
                  value={draftResponses[selectedFeedbackForPreview.id || ''] || ''}
                  onChange={(e) => handleDraftResponse(selectedFeedbackForPreview.id || '', e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedFeedbackForPreview(null)}
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={() => {
                      const response = draftResponses[selectedFeedbackForPreview.id || ''] || ''
                      if (response.trim()) {
                        handleSendResponse(selectedFeedbackForPreview.id || '', response)
                        setSelectedFeedbackForPreview(null)
                      }
                    }}
                    disabled={!draftResponses[selectedFeedbackForPreview.id || '']?.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                     Kirim Balasan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Archive Toggle Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowArchivedFeedback(!showArchivedFeedback)}
          variant={showArchivedFeedback ? "default" : "outline"}
          size="lg"
          className="shadow-lg"
        >
          <Archive className="w-4 h-4 mr-2" />
          {showArchivedFeedback ? 'Tampilkan Aktif' : 'Tampilkan Arsip'}
          {!showArchivedFeedback && stats.archived > 0 && (
            <Badge variant="secondary" className="ml-2">
              {stats.archived}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )
}

export default DashboardPage
