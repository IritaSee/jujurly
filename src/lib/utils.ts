import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Smile, Frown, Meh, HelpCircle } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return targetDate.toLocaleDateString()
  }
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'text-green-600'
    case 'negative':
      return 'text-red-600'
    case 'neutral':
      return 'text-gray-600'
    default:
      return 'text-gray-500'
  }
}

export function getSentimentIcon(sentiment: string) {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return Smile
    case 'negative':
      return Frown
    case 'neutral':
      return Meh
    default:
      return HelpCircle
  }
}
