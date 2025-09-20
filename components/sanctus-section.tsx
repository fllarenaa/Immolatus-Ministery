"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Grid, List } from "lucide-react"
import style from "./santos.module.css"
import Image from "next/image"
import modulesData from '@/app/sanctorumpage/sanctusday.json'

interface ModuleRecord {
  date: string
  id: string
  title: string
  subtitle: string
  category: string
  difficulty: number
  principaldescription: string
  description: string
  author: string
  estimatedReadTime: number
  image?: string
  tags: string[]
  topics: { title: string; content: string }[]
}

const mockModules: ModuleRecord[] = modulesData

export function SanctusSection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800 border-green-200"
      case 2: return "bg-blue-100 text-blue-800 border-blue-200"
      case 3: return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 4: return "bg-orange-100 text-orange-800 border-orange-200"
      case 5: return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Iniciante"
      case 2: return "Básico"
      case 3: return "Intermediário"
      case 4: return "Avançado"
      case 5: return "Especialista"
      default: return "Não definido"
    }
  }

  // 🔎 Filtragem + ordenação alfabética
  const filteredModules = mockModules
    .filter((module) =>
      module.title.toLowerCase().includes(search.toLowerCase()) ||
      module.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      module.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => a.title.localeCompare(b.title))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">A vida dos Santos</h2>
        <div className="flex gap-2">
          <Button onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-amber-600 text-white" : ""}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-amber-600 text-white" : ""}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 🔍 Campo de pesquisa */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      {/* 📊 Total de cards */}
      <p className="text-sm text-gray-600">
        Total de módulos encontrados: <span className="font-semibold">{filteredModules.length}</span>
      </p>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredModules.map((module) => (
          <Card key={module.id} className={viewMode === "list" ? "flex" : ""}>
            <CardContent className="flex-1">
              <div className="flex justify-between mb-2">
                <Badge className={getDifficultyColor(module.difficulty)}>{getDifficultyText(module.difficulty)}</Badge>
                <Badge variant="outline">{module.category}</Badge>
              </div>
              <CardTitle className="text-lg font-bold">{module.title}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{module.subtitle}</p>
              <p className="text-sm mb-2 line-clamp-3">{module.description}</p>
              <div className="flex gap-2 flex-wrap mb-2">
                {module.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <Link href={`/sanctorumpage/${module.id}`}>
                <Image
                  src={module.image ?? "/default.jpg"}
                  alt={module.title}
                  className={style.imageContainer}
                  width={300}
                  height={300}
                />
                <br />
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ler Módulo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
