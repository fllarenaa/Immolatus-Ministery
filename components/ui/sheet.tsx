"use client"

import React, { useState, useEffect } from "react"
import styles from "./sheet.module.css"

interface SheetProps {
  children: React.ReactNode
}

interface SheetTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

interface SheetContentProps {
  side?: "left" | "right"
  className?: string
  children: React.ReactNode
}

interface SheetHeaderProps {
  className?: string
  children: React.ReactNode
}

interface SheetTitleProps {
  className?: string
  children: React.ReactNode
}

const SheetContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function Sheet({ children }: SheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return <SheetContext.Provider value={{ isOpen, setIsOpen }}>{children}</SheetContext.Provider>
}

export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  const { setIsOpen } = React.useContext(SheetContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setIsOpen(true),
    })
  }

  return <button onClick={() => setIsOpen(true)}>{children}</button>
}

export function SheetContent({ side = "left", className = "", children }: SheetContentProps) {
  const { isOpen, setIsOpen } = React.useContext(SheetContext)

  if (!isOpen) return null

  const contentClass = side === "left" ? styles.contentLeft : styles.contentRight
  const openClass = side === "left" ? styles.contentLeftOpen : styles.contentRightOpen

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} onClick={() => setIsOpen(false)} />
      <div className={`${styles.content} ${contentClass} ${isOpen ? openClass : ""} ${className}`}>{children}</div>
    </>
  )
}

export function SheetHeader({ className = "", children }: SheetHeaderProps) {
  return <div className={`${styles.header} ${className}`}>{children}</div>
}

export function SheetTitle({ className = "", children }: SheetTitleProps) {
  return <h3 className={`${styles.title} ${className}`}>{children}</h3>
}
