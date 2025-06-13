"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Music, Save, X, FileMusic, Play, Pause } from "lucide-react"
import { useMusicStorage } from "@/hooks/use-music-storage"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { SheetMusicEditor } from "./sheet-music-editor"

interface AddMusicFormProps {
  onClose?: () => void
  onSuccess?: () => void
}

export function AddMusicForm({ onClose, onSuccess }: AddMusicFormProps) {
  const { addMusic } = useMusicStorage()
  const { playMusic, pauseMusic, isPlaying, currentMusic, formatTime, duration } = useAudioPlayer()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSheetEditor, setShowSheetEditor] = useState(false)
  const [sheetMusicData, setSheetMusicData] = useState<string>("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    lyrics: "",
    duration: "",
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Por favor, insira o título da música")
      return
    }

    console.log("Submetendo música:", formData.title, "Com áudio:", !!audioFile)
    setIsSubmitting(true)

    try {
      // Se temos um arquivo de áudio, vamos garantir que temos a duração
      if (audioFile && !formData.duration) {
        try {
          if (audioRef.current) {
            const minutes = Math.floor(audioRef.current.duration / 60)
            const seconds = Math.floor(audioRef.current.duration % 60)
            const durationString = `${minutes}:${seconds.toString().padStart(2, "0")}`
            setFormData((prev) => ({ ...prev, duration: durationString }))
          }
        } catch (error) {
          console.error("Erro ao obter duração do áudio:", error)
        }
      }

      const newMusic = await addMusic(
        {
          ...formData,
          sheetMusic: sheetMusicData,
        },
        audioFile || undefined,
      )

      console.log("Música adicionada com sucesso:", newMusic.id)

      // Limpar formulário
      setFormData({
        title: "",
        artist: "",
        album: "",
        lyrics: "",
        duration: "",
        featured: false,
      })
      setSheetMusicData("")
      setAudioFile(null)
      setAudioPreviewUrl("")

      alert("Música adicionada com sucesso!")
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao adicionar música:", error)
      alert("Erro ao adicionar música. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      console.log("Arquivo de áudio selecionado:", file.name, "Tipo:", file.type, "Tamanho:", file.size)
      setAudioFile(file)

      // Criar URL para preview
      const url = URL.createObjectURL(file)
      setAudioPreviewUrl(url)
      console.log("URL de preview criada:", url)

      // Criar elemento de áudio para obter duração
      if (!audioRef.current) {
        audioRef.current = new Audio(url)
      } else {
        audioRef.current.src = url
      }

      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          const minutes = Math.floor(audioRef.current.duration / 60)
          const seconds = Math.floor(audioRef.current.duration % 60)
          const durationString = `${minutes}:${seconds.toString().padStart(2, "0")}`
          setFormData((prev) => ({ ...prev, duration: durationString }))
          console.log("Duração calculada:", durationString)
        }
      })

      audioRef.current.addEventListener("error", (e) => {
        console.error("Erro ao carregar áudio para calcular duração:", e)
      })
    } else {
      console.error("Arquivo inválido:", file?.type)
      alert("Por favor, selecione um arquivo de áudio válido (MP3, WAV, etc.)")
    }
  }

  const handleSheetMusicSave = (imageData: string) => {
    setSheetMusicData(imageData)
    setShowSheetEditor(false)
    alert("Partitura salva com sucesso!")
  }

  const toggleAudioPreview = () => {
    if (!audioPreviewUrl) return

    if (isPlaying && currentMusic?.audioFile === audioPreviewUrl) {
      pauseMusic()
    } else {
      const tempMusic = {
        id: "preview",
        title: formData.title || "Preview",
        artist: formData.artist || "Artista",
        album: "",
        lyrics: "",
        duration: "",
        dateAdded: "",
        featured: false,
        audioFile: audioPreviewUrl,
      }
      playMusic(tempMusic)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-amber-50/50 border-amber-200/50 shadow-lg">
        <CardHeader className="border-b border-amber-200/30 bg-amber-100/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-amber-800" />
              <CardTitle className="text-xl font-cinzel text-amber-900">
                {showSheetEditor ? "Editor de Partitura" : "Adicionar Nova Música"}
              </CardTitle>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} className="text-amber-900 hover:bg-amber-200/50">
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          {showSheetEditor ? (
            <div className="space-y-4">
              <div className="flex items-center justify-end mb-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSheetEditor(false)}
                  className="border-amber-300 text-amber-900 hover:bg-amber-100"
                >
                  Voltar ao Formulário
                </Button>
              </div>
              <SheetMusicEditor
                onSave={handleSheetMusicSave}
                initialImage={sheetMusicData || undefined}
                width={800}
                height={600}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-amber-900 font-cinzel font-medium">
                    Título da Música *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: Ave Maria"
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-amber-900 font-cinzel font-medium">
                    Artista/Compositor
                  </Label>
                  <Input
                    id="artist"
                    value={formData.artist}
                    onChange={(e) => handleInputChange("artist", e.target.value)}
                    placeholder="Ex: Franz Schubert"
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="album" className="text-amber-900 font-cinzel font-medium">
                    Álbum/Coleção
                  </Label>
                  <Input
                    id="album"
                    value={formData.album}
                    onChange={(e) => handleInputChange("album", e.target.value)}
                    placeholder="Ex: Cantos Marianos"
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-amber-900 font-cinzel font-medium">
                    Duração
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="Ex: 3:45"
                    className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Upload de Áudio */}
              <div className="space-y-2">
                <Label className="text-amber-900 font-cinzel font-medium">Arquivo de Áudio</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={toggleAudioPreview}
                      disabled={!audioPreviewUrl}
                      className="border-amber-300 text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                    >
                      {isPlaying && currentMusic?.audioFile === audioPreviewUrl ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {audioFile && (
                    <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
                      <div className="flex items-center justify-between">
                        <span>📁 {audioFile.name}</span>
                        <span>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                      {isPlaying && currentMusic?.audioFile === audioPreviewUrl && (
                        <div className="mt-2 text-xs">▶️ Reproduzindo... {formatTime(duration)}</div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-amber-700">Formatos suportados: MP3, WAV, OGG, M4A</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lyrics" className="text-amber-900 font-cinzel font-medium">
                  Letra da Música
                </Label>
                <Textarea
                  id="lyrics"
                  value={formData.lyrics}
                  onChange={(e) => handleInputChange("lyrics", e.target.value)}
                  placeholder="Digite a letra completa da música aqui..."
                  className="min-h-[150px] md:min-h-[200px] border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 resize-none"
                />
                <p className="text-xs text-amber-700">Dica: Use quebras de linha para separar versos e estrofes</p>
              </div>

              {/* Seção de Partitura */}
              <div className="space-y-2">
                <Label className="text-amber-900 font-cinzel font-medium">Partitura</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSheetEditor(true)}
                    className="border-amber-300 text-amber-900 hover:bg-amber-100 font-cinzel"
                  >
                    <FileMusic className="h-4 w-4 mr-2" />
                    {sheetMusicData ? "Editar Partitura" : "Criar Partitura"}
                  </Button>
                  {sheetMusicData && <div className="text-sm text-amber-700 flex items-center">✓ Partitura criada</div>}
                </div>
                {sheetMusicData && (
                  <div className="mt-2">
                    <img
                      src={sheetMusicData || "/placeholder.svg"}
                      alt="Partitura"
                      className="max-w-full h-auto border border-amber-300 rounded-md shadow-sm"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500/20"
                />
                <Label htmlFor="featured" className="text-amber-900 font-cinzel font-medium">
                  Marcar como música em destaque
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-cinzel shadow-md"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Salvando..." : "Salvar Música"}
                </Button>

                {onClose && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-amber-300 text-amber-900 hover:bg-amber-100 font-cinzel"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
