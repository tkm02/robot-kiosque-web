"use client"

import { Maximize, Minimize } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export default function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-lg hover:bg-teal-50 hover:border-teal-300 hover:shadow-xl transition-all duration-200 group"
      title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
      aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
    >
      {isFullscreen ? (
        <Minimize className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
      ) : (
        <Maximize className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
      )}
    </button>
  )
}
