"use client"

import { useState, useRef, useEffect, ReactNode } from "react"

type LazySectionProps = {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
}

export function LazySection({ children, fallback = null, threshold = 0.1 }: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className="min-h-[100px]">
      {isVisible ? children : fallback}
    </div>
  )
}