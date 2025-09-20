"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Music, BookOpen, Calendar, Users, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const navItems = [
    { icon: Music, label: "Canto Gregoriano", href: "/chant" },
    { icon: Music, label: "Polifonia Sacra", href: "/polyphony" },
    { icon: Music, label: "Hinos", href: "/hymns" },
    { icon: Music, label: "Música Sacra Moderna", href: "/modern" },
    { icon: BookOpen, label: "Minha Biblioteca", href: "/library" },
    { icon: Music, label: "Gerenciar Músicas", href: "/manage-music" },
    { icon: FileText, label: "Documentos", href: "/documents" },
    { icon: Calendar, label: "Calendário Litúrgico", href: "/calendar" },
    { icon: Users, label: "Artistas em Destaque", href: "/artists" },
    { icon: FileText, label: "Artigos", href: "/articles" },
    { icon: HelpCircle, label: "Sobre", href: "/about" },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Alternar menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Music className="h-5 w-5" />
            Cantus Catholicus
          </SheetTitle>
        </SheetHeader>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem",
                color: "var(--primary-dark)",
                textDecoration: "none",
                borderRadius: "6px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--gold-light)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <item.icon className="h-4 w-4" style={{ color: "var(--primary-gold)" }} />
              <span style={{ fontFamily: "Cinzel, serif" }}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ position: "absolute", bottom: "1rem", left: "1.5rem", right: "1.5rem" }}>
          <Button className="w-full">Entrar</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
