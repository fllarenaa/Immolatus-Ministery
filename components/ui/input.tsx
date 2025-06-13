import type React from "react"
import styles from "./input.module.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  className?: string
}

export function Input({ className = "", ...props }: InputProps) {
  return <input className={`${styles.input} ${className}`} {...props} />
}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return <textarea className={`${styles.textarea} ${className}`} {...props} />
}

export function Label({ children, className = "", ...props }: LabelProps) {
  return (
    <label className={`${styles.label} ${className}`} {...props}>
      {children}
    </label>
  )
}
