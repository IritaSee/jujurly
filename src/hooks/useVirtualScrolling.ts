import { useState, useRef, useMemo } from 'react'

interface VirtualScrollingOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface VirtualScrollingResult<T> {
  virtualItems: Array<{
    index: number
    start: number
    end: number
    item: T
  }>
  totalHeight: number
  scrollElementProps: {
    ref: React.RefObject<HTMLDivElement>
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void
    style: React.CSSProperties
  }
  containerProps: {
    style: React.CSSProperties
  }
}

export function useVirtualScrolling<T>(
  items: T[],
  options: VirtualScrollingOptions
): VirtualScrollingResult<T> {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight

  const virtualItems = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    )

    const start = Math.max(0, visibleStart - overscan)
    const end = Math.min(items.length - 1, visibleEnd + overscan)

    const result = []
    for (let i = start; i <= end; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        item: items[i]
      })
    }

    return result
  }, [items, itemHeight, scrollTop, containerHeight, overscan])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return {
    virtualItems,
    totalHeight,
    scrollElementProps: {
      ref: scrollElementRef as React.RefObject<HTMLDivElement>,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto'
      }
    },
    containerProps: {
      style: {
        height: totalHeight,
        position: 'relative'
      }
    }
  }
}