"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MusicPlayer } from "@/components/music-player"
import styles from "./page.module.css"

const mockModules = [
  {
    id: "1",
    title: "Introdução ao Canto Gregoriano",
    subtitle: "História e fundamentos",
    description: "Aprenda os fundamentos do canto gregoriano, sua história e importância na liturgia.",
    tags: ["gregoriano", "história", "iniciantes"],
    pages: [
      { title: "O que é canto gregoriano?", content: "O canto gregoriano é um canto litúrgico monofônico usado na Igreja Católica desde a Idade Média." },
      { title: "História", content: "Originado na Europa nos séculos IX e X, atribuído ao Papa Gregório I." },
      { title: "Função litúrgica", content: "Serve para elevar a oração e unir os fiéis." },
      { title: "Modos gregorianos", content: "São escalas específicas usadas nesse estilo musical." },
      { title: "Neumas", content: "Sistema de notação usado para escrever o canto gregoriano." },
      { title: "Canto responsorial", content: "Estrutura com solista alternando com a assembleia." },
      { title: "Repertório principal", content: "Inclui Kyrie, Gloria, Credo, Sanctus e Agnus Dei." },
      { title: "Declínio e preservação", content: "Após o Concílio de Trento houve padronização do repertório." },
      { title: "Restauração moderna", content: "Movimento de Solesmes revitalizou o estudo do canto." },
      { title: "Uso atual", content: "Ainda usado em comunidades monásticas e celebrações especiais." },
    ],
  },
  {
    id: "2",
    title: "Técnicas Avançadas de Canto",
    subtitle: "Controle de respiração e entonação",
    description: "Aprofunde suas técnicas de canto para apresentações e cerimônias.",
    tags: ["avançado", "respiração", "entonação"],
    pages: [
      { title: "Respiração correta", content: "O controle da respiração é essencial para sustentar notas longas." },
      { title: "Projeção vocal", content: "Use ressonância natural sem forçar a garganta." },
      { title: "Afinação precisa", content: "Ouvir e ajustar constantemente." },
      { title: "Dicção", content: "Clareza nas palavras é fundamental." },
      { title: "Controle dinâmico", content: "Saber cantar forte e suave conforme necessidade." },
      { title: "Técnicas de vibrato", content: "Uso do vibrato para dar vida ao canto." },
      { title: "Exercícios diários", content: "Rotina prática para manter a qualidade vocal." },
      { title: "Apresentação em público", content: "Postura e confiança são essenciais ao cantar." },
    ],
  },
]

interface PageProps {
  params: { id: string }
}

export default function ModulePage({ params }: PageProps) {
  const module = mockModules.find((m) => m.id === params.id)
  const [pageIndex, setPageIndex] = useState(0)

  if (!module) return <div>Módulo não encontrado</div>

  const currentPage = module.pages[pageIndex]

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar / Sumário */}
        <aside className="w-64 sticky top-24 h-[80vh] overflow-y-auto bg-white border rounded-xl shadow p-4">
          <h2 className="text-xl font-bold text-amber-700 mb-4">Sumário</h2>
          <ul className="space-y-2">
            {module.pages.map((p, idx) => (
              <li
                key={idx}
                className={`cursor-pointer p-2 rounded hover:bg-amber-100 ${
                  idx === pageIndex ? "bg-amber-200 font-semibold" : ""
                }`}
                onClick={() => setPageIndex(idx)}
              >
                <span className="block">{p.title}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conteúdo principal */}
        <section className="flex-1">
          <Card className="rounded-2xl border border-amber-500/30 shadow-lg">
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-amber-700">{module.title}</h1>
              <p className="text-gray-700 mb-4">{module.subtitle}</p>

              <div className="flex gap-2 flex-wrap mb-6">
                {module.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>

              <p className="mb-6">{module.description}</p>

              {/* Conteúdo da página */}
              <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold">{currentPage.title}</h2>
                <p className="text-gray-700">{currentPage.content}</p>
              </div>

              {/* Paginação */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={pageIndex === 0}
                  onClick={() => setPageIndex((p) => p - 1)}
                >
                  &larr; Anterior
                </Button>
                <span>
                  Página {pageIndex + 1} de {module.pages.length}
                </span>
                <Button
                  variant="outline"
                  disabled={pageIndex === module.pages.length - 1}
                  onClick={() => setPageIndex((p) => p + 1)}
                >
                  Próxima &rarr;
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <div className="sticky bottom-0 w-full bg-stone-900/95 border-t border-amber-500/30 backdrop-blur-sm z-40">
        <MusicPlayer />
      </div>

      <SiteFooter />
    </div>
  )
}
