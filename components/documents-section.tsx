"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Grid, List, Plus } from "lucide-react"

interface ModuleRecord {
  id: string
  title: string
  subtitle: string
  category: string
  difficulty: number
  description: string
  author: string
  estimatedReadTime: number
  tags: string[]
  topics: { title: string; content: string }[]
}

// Mock de módulos
const mockModules: ModuleRecord[] = [
  {
    id: "1",
    title: "Manual de Conversão",
    subtitle: "Converta-se à Fé Católica, já!",
    category: "Música Sacra",
    difficulty: 1,
    description: "É como um pequeno livro-guia feito para quem deseja conhecer e abraçar a Igreja de forma clara e segura.",
    author: "Immolatus",
    estimatedReadTime: 15,
    tags: ["Conversão", "História", "Iniciantes", "Manual"],
    topics: [
      { title: "O que é canto gregoriano?", content: "O canto gregoriano é..." },
      { title: "História", content: "Originou-se na Idade Média..." },
    ],
  },
  {
    id: "2",
    title: "Técnicas Avançadas de Canto",
    subtitle: "Controle de respiração e entonação",
    category: "Música Sacra",
    difficulty: 4,
    description: "Aprofunde suas técnicas de canto para apresentações e cerimônias.",
    author: "Maestro Carlos",
    estimatedReadTime: 25,
    tags: ["avançado", "respiração", "entonação"],
    topics: [
      { title: "Respiração correta", content: "Controle da respiração é fundamental..." },
      { title: "Projeção de voz", content: "Aprenda a projetar sua voz..." },
    ],
  },
  {
    id: "3",
    title: "Composição de Hinos",
    subtitle: "Criando melodias sacras",
    category: "Composição",
    difficulty: 3,
    description: "Aprenda a criar hinos e melodias dentro da tradição católica.",
    author: "Irmã Maria",
    estimatedReadTime: 20,
    tags: ["composição", "melodia", "sacra"],
    topics: [
      { title: "Estrutura de hinos", content: "Um hino geralmente possui..." },
      { title: "Exemplos práticos", content: "Estudos de casos de hinos famosos..." },
    ],
  },
   {
    id: "4",
    title: "Composição de Hinos2",
    subtitle: "Criando melodias sacras",
    category: "Composição",
    difficulty: 3,
    description: "Aprenda a criar hinos e melodias dentro da tradição católica.",
    author: "Irmã Maria",
    estimatedReadTime: 20,
    tags: ["composição", "melodia", "sacra"],
    topics: [
      { title: "Estrutura de hinos", content: "Um hino geralmente possui..." },
      { title: "Exemplos práticos", content: "Estudos de casos de hinos famosos..." },
    ],
  },
]

export function DocumentsSection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Biblioteca de Documentos</h2>
        <div className="flex gap-2">
          <Button onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-amber-600 text-white" : ""}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-amber-600 text-white" : ""}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {mockModules.map((module) => (
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
              <Link href={`/documents/${module.id}`}>
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
