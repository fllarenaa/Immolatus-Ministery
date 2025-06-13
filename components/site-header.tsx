import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Music, BookOpen, User, Bell } from "lucide-react"
import { MobileNav } from "./mobile-nav"
import Logo from '../public/logo.png';
import Image from 'next/image';
import styles from "./site-header.module.css"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200/50 bg-stone-50/95 backdrop-blur supports-[backdrop-filter]:bg-stone-50/60">
      <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"></div>
      <div className="container mx-auto">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2">
             <div className={styles.logoCircle}>
              <Image src={Logo} className={styles.Logo} alt="Logo" />
              </div>
              <span className="hidden sm:inline-block text-lg font-cinzel font-bold text-amber-900">
                Immolatus Cantus
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/chant"
              className="font-cinzel font-medium text-amber-800 hover:text-amber-600 transition-colors"
            >
              Canto Gregoriano
            </Link>
            <Link
              href="/polyphony"
              className="font-cinzel font-medium text-amber-800 hover:text-amber-600 transition-colors"
            >
              Polifonia Sacra
            </Link>
            <Link
              href="/hymns"
              className="font-cinzel font-medium text-amber-800 hover:text-amber-600 transition-colors"
            >
              Hinos
            </Link>
            <Link
              href="/modern"
              className="font-cinzel font-medium text-amber-800 hover:text-amber-600 transition-colors"
            >
              Música Moderna
            </Link>
            <Link
              href="/manage-music"
              className="font-cinzel font-medium text-amber-800 hover:text-amber-600 transition-colors"
            >
              Gerenciar Músicas
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-amber-800 hover:bg-amber-100">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-amber-800 hover:bg-amber-100">
              <BookOpen className="h-4 w-4" />
              <span className="sr-only">Biblioteca</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-amber-800 hover:bg-amber-100">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notificações</span>
            </Button>
            <Button variant="outline" size="icon" className="border-amber-300 text-amber-800 hover:bg-amber-100">
              <User className="h-4 w-4" />
              <span className="sr-only">Conta</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
