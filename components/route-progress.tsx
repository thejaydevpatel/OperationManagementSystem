"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function RouteProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)

useEffect(() => {
  setProgress(10)

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return prev
      return prev + 10
    })
  }, 100)

  const done = setTimeout(() => {
    clearInterval(interval)
    setProgress(100)

    setTimeout(() => {
      setProgress(0)
    }, 200)
  }, 400)

  return () => {
    clearInterval(interval)
    clearTimeout(done)
  }
}, [pathname])


  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  )
}
