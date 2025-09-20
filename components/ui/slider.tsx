"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import styles from "./slider.module.css"

interface SliderProps {
  defaultValue?: number[]
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  disabled?: boolean
  className?: string
}

export function Slider({
  defaultValue = [0],
  value,
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  disabled = false,
  className = "",
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const currentValue = value !== undefined ? value : internalValue

  const updateValue = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || disabled) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const rawValue = min + percentage * (max - min)
      const steppedValue = Math.round(rawValue / step) * step
      const clampedValue = Math.max(min, Math.min(max, steppedValue))

      const newValues = [clampedValue]

      if (value === undefined) {
        setInternalValue(newValues)
      }
      onValueChange?.(newValues)
    },
    [min, max, step, disabled, value, onValueChange],
  )

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return
      event.preventDefault()
      isDragging.current = true
      updateValue(event.clientX)
    },
    [updateValue, disabled],
  )

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (disabled) return
      event.preventDefault()
      isDragging.current = true
      updateValue(event.touches[0].clientX)
    },
    [updateValue, disabled],
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging.current) return
      event.preventDefault()
      updateValue(event.clientX)
    },
    [updateValue],
  )

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isDragging.current) return
      event.preventDefault()
      updateValue(event.touches[0].clientX)
    },
    [updateValue],
  )

  const handleEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  useEffect(() => {
    const handleMouseUp = () => handleEnd()
    const handleTouchEnd = () => handleEnd()

    if (isDragging.current) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [handleMouseMove, handleTouchMove, handleEnd])

  const percentage = ((currentValue[0] - min) / (max - min)) * 100

  return (
    <div
      ref={sliderRef}
      className={`${styles.slider} ${disabled ? styles.sliderDisabled : ""} ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className={styles.track}>
        <div className={styles.range} style={{ width: `${percentage}%` }} />
      </div>
      <div
        ref={thumbRef}
        className={styles.thumb}
        style={{ left: `${percentage}%` }}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue[0]}
      />
    </div>
  )
}
