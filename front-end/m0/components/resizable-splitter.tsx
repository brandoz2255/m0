"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ResizableSplitterProps {
  onResize: (width: number) => void
  minWidth?: number
  maxWidth?: number
  direction?: "horizontal" | "vertical"
}

export default function ResizableSplitter({
  onResize,
  minWidth = 180,
  maxWidth = 500,
  direction = "horizontal",
}: ResizableSplitterProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isTouchDragging, setIsTouchDragging] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX))
      onResize(newWidth)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDragging || !e.touches[0]) return

      const touchX = e.touches[0].clientX
      const deltaX = touchX - touchStartX

      // Calculate new width based on the starting position plus the delta
      const newWidth = Math.max(minWidth, Math.min(maxWidth, touchX))
      onResize(newWidth)

      // Update the touch start position for the next move
      setTouchStartX(touchX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = "default"
    }

    const handleTouchEnd = () => {
      setIsTouchDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = direction === "horizontal" ? "ew-resize" : "ns-resize"
    }

    if (isTouchDragging) {
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.body.style.cursor = "default"
    }
  }, [isDragging, isTouchDragging, minWidth, maxWidth, onResize, touchStartX, direction])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setTouchStartX(e.touches[0].clientX)
      setIsTouchDragging(true)
    }
  }

  const cursorClass = direction === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize"
  const dimensionClass = direction === "horizontal" ? "w-1 hover:w-1.5" : "h-1 hover:h-1.5"
  const activeClass = isDragging ? (direction === "horizontal" ? "w-1.5" : "h-1.5") : ""

  return (
    <div
      className={`${dimensionClass} ${cursorClass} bg-blue-800/30 hover:bg-neon-blue transition-all duration-200 ease-out ${
        isDragging ? `bg-neon-blue ${activeClass} shadow-glow-blue` : ""
      }`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={handleTouchStart}
      aria-hidden="true"
    >
      <div
        className={`absolute ${direction === "horizontal" ? "top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-4 h-12" : "left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 h-4 w-12"} flex items-center justify-center`}
      >
        <div
          className={`${direction === "horizontal" ? "h-8 w-1" : "w-8 h-1"} rounded-full ${isDragging || isTouchDragging ? "bg-neon-blue" : "bg-blue-700"}`}
        ></div>
      </div>
    </div>
  )
}
