"use client"

import { Button } from "@/components/ui/button"

export default function DirectionToggle() {
  const toggleDirection = () => {
    const current = document.documentElement.getAttribute("dir")
    const newDir = current === "rtl" ? "ltr" : "rtl"

    document.documentElement.setAttribute("dir", newDir)
    localStorage.setItem("dir", newDir)
  }

  return (
    <Button className="my-5" variant="ghost" size="sm" onClick={toggleDirection}>
      RTL
    </Button>
  )
}
