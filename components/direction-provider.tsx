"use client"

import { useEffect, useState } from "react"

export default function DirectionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedDir = localStorage.getItem("dir") || "ltr"
    document.documentElement.setAttribute("dir", savedDir)
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <>{children}</>
}
