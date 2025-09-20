import type React from "react"
import styles from "./button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "default" | "lg" | "icon"
  children: React.ReactNode
}

export function Button({ variant = "primary", size = "default", className = "", children, ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ")

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
