"use client"

import { useState } from "react"
import { AddMusicForm } from "@/components/add-music-form"
import { MusicLibrary } from "@/components/music-library"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Music } from "lucide-react"
import Link from "next/link"

export default function ManageMusicPage() {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-amber-900 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Music className="h-8 w-8 text-amber-900" />
            <h1 className="text-3xl md:text-4xl font-cinzel text-amber-900">Gerenciar Biblioteca Musical</h1>
          </div>
          <p className="text-amber-800 max-w-2xl">
            Adicione, edite e organize sua coleção pessoal de música sacra católica.
          </p>
        </div>

        {showAddForm ? (
          <div className="mb-8">
            <AddMusicForm onClose={() => setShowAddForm(false)} onSuccess={() => setShowAddForm(false)} />
          </div>
        ) : (
          <div className="mb-8 text-center">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-900 hover:bg-amber-800 text-amber-100 font-cinzel"
            >
              <Music className="h-4 w-4 mr-2" />
              Adicionar Nova Música
            </Button>
          </div>
        )}

        <MusicLibrary />
      </div>
    </div>
  )
}
