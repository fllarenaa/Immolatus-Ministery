import type React from "react"
import styles from "./card.module.css"

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`${styles.card} ${className}`}>{children}</div>
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`${styles.cardHeader} ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`${styles.cardTitle} ${className}`}>{children}</h3>
}

export function CardContent({ children, className = "", noPadding = false }: CardContentProps) {
  const contentClass = noPadding ? styles.cardContentNoPadding : styles.cardContent
  return <div className={`${contentClass} ${className}`}>{children}</div>
}
