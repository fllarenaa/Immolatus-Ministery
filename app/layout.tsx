import type React from "react"
import "./globals.css"
import { Cinzel, Cormorant_Garamond } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata = {
  title: "Cantus Catholicus - Música Sacra Católica",
  description: "Um tesouro de música sacra católica através dos séculos",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}
