"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import modulesData from '@/app/sanctorumpage/sanctusday.json'
import { useState, useEffect } from "react"

interface ModuleRecord {
  date: string
  id: string
  title: string
  subtitle: string
  category: string
  difficulty: number
  principaldescription?: string
  description: string
  author: string
  estimatedReadTime: number
  image?: string
  tags: string[]
  topics: { title: string; content: string }[]
}

export function SanctumDay() {
  const [todayModule, setTodayModule] = useState<ModuleRecord | null>(null)

  useEffect(() => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const todayKey = `${day}/${month}` // formato "DD/MM"

    // Procura módulo do dia
    let found = modulesData.find((m) => m.date === todayKey)

    // Se não encontrou, pega módulo aleatório baseado no dia do ano
    if (!found) {
      const start = new Date(today.getFullYear(), 0, 0)
      const diff = today.getTime() - start.getTime()
      const oneDay = 1000 * 60 * 60 * 24
      const dayOfYear = Math.floor(diff / oneDay) // número do dia no ano
      const index = dayOfYear % modulesData.length // índice "aleatório" fixo para o dia
      found = modulesData[index]
    }

    setTodayModule(found || null)
  }, [])

  if (!todayModule) return null

  const module = todayModule

  return (
    <section className="my-16">
      <div className="relative overflow-hidden rounded-lg border border-amber-800/30 bg-amber-100/30">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('/decorative-border.png')] bg-contain bg-right opacity-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-cinzel text-amber-900 mb-2">{module.title}</h2>
            <div className="w-20 h-1 bg-amber-700 mb-6"></div>

            <h3 className="text-xl md:text-2xl font-cinzel text-amber-800 mb-4">
              Manual de Conversão para o conhecimento da Fé Católica
            </h3>

            <p className="text-amber-800 mb-4">{module.principaldescription}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {module.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-700/50 font-cinzel">
                Ler Agora
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-md overflow-hidden border-4 border-amber-800/20 shadow-lg relative">
              <img
                src={module.image || "/placeholder.svg"}
                alt={module.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* <Button
                  size="icon"
                  className="rounded-full h-16 w-16 bg-amber-900/80 hover:bg-amber-800 text-amber-100 border-2 border-amber-100/30"
                >
                  <Play className="h-8 w-8" />
                  <span className="sr-only">Reproduzir apresentação em destaque</span>
                </Button> */}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-amber-100 border border-amber-800/30 p-3 rounded shadow-md">
              <p className="text-sm font-medium text-amber-900">Immolatus</p>
              <p className="text-xs text-amber-800">{module.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
