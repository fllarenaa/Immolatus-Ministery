"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Music } from "lucide-react"
import type { Music as MusicType } from "@/hooks/use-music-storage"

interface LyricsModalProps {
  music: MusicType | null
  isOpen: boolean
  onClose: () => void
}

export function LyricsModal({ music, isOpen, onClose }: LyricsModalProps) {
  if (!isOpen || !music) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-amber-100/95 border-amber-800/30 overflow-hidden">
        <CardHeader className="border-b border-amber-800/20 bg-amber-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-amber-900" />
              <div>
                <CardTitle className="text-xl font-cinzel text-amber-900">{music.title}</CardTitle>
                {music.artist && <p className="text-sm text-amber-700">{music.artist}</p>}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-amber-900">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {music.lyrics ? (
            <div className="whitespace-pre-wrap text-amber-900 leading-relaxed">{music.lyrics}</div>
          ) : (
            <div className="text-center text-amber-700 py-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Letra não disponível para esta música.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
