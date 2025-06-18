import { useState, useEffect, useCallback, useRef } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
}

interface CacheResult<T> {
  get: (key: string) => T | null
  set: (key: string, value: T, customTtl?: number) => void
  remove: (key: string) => void
  clear: () => void
  has: (key: string) => boolean
  size: number
  getStats: () => {
    hits: number
    misses: number
    hitRate: number
  }
}

export function useCache<T>(
  options: CacheOptions = {}
): CacheResult<T> {
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options // Default 5 minutes TTL, 100 max entries
  
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map())
  const statsRef = useRef({ hits: 0, misses: 0 })
  const [, forceUpdate] = useState({})

  // Cleanup expired entries
  const cleanup = useCallback(() => {
    const now = Date.now()
    const cache = cacheRef.current
    
    for (const [key, entry] of cache.entries()) {
      if (now > entry.expiresAt) {
        cache.delete(key)
      }
    }
  }, [])

  // Cleanup on mount and set interval
  useEffect(() => {
    cleanup()
    const interval = setInterval(cleanup, 60000) // Cleanup every minute
    return () => clearInterval(interval)
  }, [cleanup])

  const get = useCallback((key: string): T | null => {
    const cache = cacheRef.current
    const entry = cache.get(key)
    
    if (!entry) {
      statsRef.current.misses++
      return null
    }
    
    const now = Date.now()
    if (now > entry.expiresAt) {
      cache.delete(key)
      statsRef.current.misses++
      return null
    }
    
    statsRef.current.hits++
    return entry.data
  }, [])

  const set = useCallback((key: string, value: T, customTtl?: number): void => {
    const cache = cacheRef.current
    const now = Date.now()
    const entryTtl = customTtl ?? ttl
    
    // Remove oldest entries if cache is full
    if (cache.size >= maxSize && !cache.has(key)) {
      const oldestKey = cache.keys().next().value
      if (oldestKey) {
        cache.delete(oldestKey)
      }
    }
    
    cache.set(key, {
      data: value,
      timestamp: now,
      expiresAt: now + entryTtl
    })
    
    forceUpdate({})
  }, [ttl, maxSize])

  const remove = useCallback((key: string): void => {
    cacheRef.current.delete(key)
    forceUpdate({})
  }, [])

  const clear = useCallback((): void => {
    cacheRef.current.clear()
    statsRef.current = { hits: 0, misses: 0 }
    forceUpdate({})
  }, [])

  const has = useCallback((key: string): boolean => {
    const cache = cacheRef.current
    const entry = cache.get(key)
    
    if (!entry) return false
    
    const now = Date.now()
    if (now > entry.expiresAt) {
      cache.delete(key)
      return false
    }
    
    return true
  }, [])

  const getStats = useCallback(() => {
    const { hits, misses } = statsRef.current
    const total = hits + misses
    return {
      hits,
      misses,
      hitRate: total > 0 ? hits / total : 0
    }
  }, [])

  return {
    get,
    set,
    remove,
    clear,
    has,
    size: cacheRef.current.size,
    getStats
  }
}

// Specialized hook for AI analysis caching
export function useAIAnalysisCache() {
  return useCache<any>({
    ttl: 30 * 60 * 1000, // 30 minutes for AI analysis
    maxSize: 200
  })
}