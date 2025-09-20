"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Share2,
  Download,
  Music,
  FileText,
  Calendar,
  Clock,
  User,
  Album,
  Star,
  Loader2,
} from "lucide-react"
import { useMusicStorage } from "@/hooks/use-music-storage"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import type { Music as MusicType } from "@/hooks/use-music-storage"

export default function MusicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getMusicById, getAudioFile, hasAudioFile } = useMusicStorage()
  const {
    playMusic,
    pauseMusic,
    isPlaying,
    currentMusic,
    formatTime,
    duration,
    currentTime,
    isLoading: isAudioLoading,
  } = useAudioPlayer()

  const [music, setMusic] = useState<MusicType | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<"info" | "lyrics" | "sheet">("info")
  const [isLoading, setIsLoading] = useState(true)
  const [hasAudio, setHasAudio] = useState(false)
  const [loadingAudio, setLoadingAudio] = useState(false)

  // Corrigir o useEffect para evitar loops infinitos
  useEffect(() => {
    const loadMusic = async () => {
      if (!params.id) return

      console.log("Carregando música com ID:", params.id)
      setIsLoading(true)

      // Buscar música padrão primeiro
      const defaultTracks = [
        {
          id: "default-1",
          title: "Salve Regina",
          artist: "Canto Gregoriano",
          album: "Cantos da Igreja",
          duration: "4:12",
          featured: true,
          lyrics:
            "Salve Regina, Mater misericordiae,\nVita, dulcedo et spes nostra, salve.\nAd te clamamus exsules filii Hevae,\nAd te suspiramus gementes et flentes\nIn hac lacrimarum valle.",
          dateAdded: "2024-01-01",
        },
        {
          id: "default-2",
          title: "Ave Maria",
          artist: "Tomás Luis de Victoria",
          album: "Motetos Sacros",
          duration: "5:36",
          featured: false,
          lyrics:
            "Ave Maria, gratia plena,\nDominus tecum.\nBenedicta tu in mulieribus,\nEt benedictus fructus ventris tui, Jesus.\nSancta Maria, Mater Dei,\nOra pro nobis peccatoribus,\nNunc et in hora mortis nostrae.\nAmen.",
          dateAdded: "2024-01-01",
        },
      ]

      // Verificar se é uma música padrão
      const defaultMusic = defaultTracks.find((track) => track.id === params.id)

      let musicData: MusicType | undefined

      if (defaultMusic) {
        musicData = defaultMusic as MusicType
        console.log("Música padrão encontrada:", musicData.title)
        setHasAudio(false) // Músicas padrão não têm áudio
      } else {
        // Buscar nas músicas do usuário
        musicData = await getMusicById(params.id as string)
        if (musicData) {
          console.log("Música do usuário encontrada:", musicData.title)

          // Verificar se tem arquivo de áudio
          const audioAvailable = await hasAudioFile(musicData.id)
          setHasAudio(audioAvailable || !!musicData.audioFile)
          console.log("Tem áudio disponível:", audioAvailable || !!musicData.audioFile)
        }
      }

      if (musicData) {
        setMusic(musicData)
        console.log("Música carregada")
      } else {
        console.warn("Música não encontrada para ID:", params.id)
      }

      setIsLoading(false)
    }

    loadMusic()
  }, [params.id, getMusicById, hasAudioFile])

  const handlePlayPause = async () => {
    if (!music) {
      console.warn("Nenhuma música carregada")
      return
    }

    console.log("Toggle play/pause para:", music.title, "Tem áudio:", hasAudio)

    if (currentMusic?.id === music.id && isPlaying) {
      console.log("Pausando música atual")
      pauseMusic()
      return
    }

    setLoadingAudio(true)

    try {
      // Carregar áudio se necessário
      let audioFile = music.audioFile
      if ((!audioFile || audioFile === "indexed-db") && hasAudio) {
        audioFile = await getAudioFile(music.id)
      }

      if (audioFile) {
        const musicWithAudio = { ...music, audioFile }
        console.log("Reproduzindo música")
        await playMusic(musicWithAudio)
      } else {
        console.warn("Música sem arquivo de áudio")
        alert("Esta música não possui arquivo de áudio.")
      }
    } catch (error) {
      console.error("Erro ao reproduzir música:", error)
      alert("Erro ao reproduzir música. Verifique o console para mais detalhes.")
    } finally {
      setLoadingAudio(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: music?.title,
          text: `Ouça "${music?.title}" por ${music?.artist} no Cantus Catholicus`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Erro ao compartilhar:", error)
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-900 font-cinzel">Carregando música...</p>
        </div>
      </div>
    )
  }

  if (!music) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-cinzel text-amber-900 mb-2">Música não encontrada</h1>
          <p className="text-amber-700 mb-4">A música que você está procurando não existe.</p>
          <Button onClick={() => router.back()} className="bg-amber-600 hover:bg-amber-700 text-white font-cinzel">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const isCurrentTrack = currentMusic?.id === music.id
  const isLoadingTrack = loadingAudio || (isAudioLoading && isCurrentTrack)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-100 via-stone-100 to-amber-50 border-b border-amber-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-amber-900 hover:bg-amber-200/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Capa e controles */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="aspect-square rounded-lg bg-amber-200/30 border-2 border-amber-300/50 shadow-lg overflow-hidden">
                  {music.sheetMusic ? (
                    <img
                      src={music.sheetMusic || "/placeholder.svg"}
                      alt={`Partitura de ${music.title}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-24 w-24 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Controles de reprodução */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="text-amber-700 hover:bg-amber-200/50"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : ""}`} />
                  </Button>

                  <Button
                    size="lg"
                    onClick={handlePlayPause}
                    disabled={!hasAudio || isLoadingTrack}
                    className={`h-16 w-16 rounded-full shadow-lg ${
                      hasAudio
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoadingTrack ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : isCurrentTrack && isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="text-amber-700 hover:bg-amber-200/50"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progresso da música */}
                {isCurrentTrack && hasAudio && (
                  <div className="mt-4 text-center">
                    <div className="text-sm text-amber-700 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <div className="w-full bg-amber-200/30 rounded-full h-2 mt-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informações principais */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-amber-900 mb-2">{music.title}</h1>
                  <p className="text-xl text-amber-700 mb-4">{music.artist}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {music.featured && (
                      <Badge className="bg-amber-200 text-amber-900 border-amber-300">
                        <Star className="h-3 w-3 mr-1" />
                        Em Destaque
                      </Badge>
                    )}
                    {hasAudio && <Badge className="bg-green-200 text-green-800 border-green-300">🎵 Com Áudio</Badge>}
                    {music.sheetMusic && (
                      <Badge className="bg-blue-200 text-blue-800 border-blue-300">🎼 Com Partitura</Badge>
                    )}
                  </div>
                </div>

                {/* Informações detalhadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {music.album && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <Album className="h-4 w-4" />
                      <span className="font-medium">Álbum:</span>
                      <span>{music.album}</span>
                    </div>
                  )}

                  {music.duration && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Duração:</span>
                      <span className="font-mono">{music.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-amber-700">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Adicionada em:</span>
                    <span>{new Date(music.dateAdded).toLocaleDateString("pt-BR")}</span>
                  </div>

                  <div className="flex items-center gap-2 text-amber-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Compositor:</span>
                    <span>{music.artist}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-amber-200">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 font-cinzel font-medium transition-colors ${
                activeTab === "info"
                  ? "text-amber-900 border-b-2 border-amber-600"
                  : "text-amber-700 hover:text-amber-900"
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab("lyrics")}
              className={`px-4 py-2 font-cinzel font-medium transition-colors ${
                activeTab === "lyrics"
                  ? "text-amber-900 border-b-2 border-amber-600"
                  : "text-amber-700 hover:text-amber-900"
              }`}
            >
              <FileText className="h-4 w-4 mr-1 inline" />
              Letra
            </button>
            {music.sheetMusic && (
              <button
                onClick={() => setActiveTab("sheet")}
                className={`px-4 py-2 font-cinzel font-medium transition-colors ${
                  activeTab === "sheet"
                    ? "text-amber-900 border-b-2 border-amber-600"
                    : "text-amber-700 hover:text-amber-900"
                }`}
              >
                <Music className="h-4 w-4 mr-1 inline" />
                Partitura
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo das tabs */}
        <div className="space-y-6">
          {activeTab === "info" && (
            <Card className="bg-amber-50/50 border-amber-200/50">
              <CardHeader>
                <CardTitle className="font-cinzel text-amber-900">Detalhes da Música</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-cinzel font-semibold text-amber-900 mb-2">Informações Básicas</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-amber-700">Título:</dt>
                        <dd className="text-amber-900">{music.title}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-amber-700">Artista/Compositor:</dt>
                        <dd className="text-amber-900">{music.artist}</dd>
                      </div>
                      {music.album && (
                        <div>
                          <dt className="text-sm font-medium text-amber-700">Álbum/Coleção:</dt>
                          <dd className="text-amber-900">{music.album}</dd>
                        </div>
                      )}
                      {music.duration && (
                        <div>
                          <dt className="text-sm font-medium text-amber-700">Duração:</dt>
                          <dd className="text-amber-900 font-mono">{music.duration}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-cinzel font-semibold text-amber-900 mb-2">Recursos Disponíveis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${hasAudio ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-amber-700">Arquivo de Áudio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${music.lyrics ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-amber-700">Letra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${music.sheetMusic ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-amber-700">Partitura</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "lyrics" && (
            <Card className="bg-amber-50/50 border-amber-200/50">
              <CardHeader>
                <CardTitle className="font-cinzel text-amber-900 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Letra da Música
                </CardTitle>
              </CardHeader>
              <CardContent>
                {music.lyrics ? (
                  <div className="prose prose-amber max-w-none">
                    <div className="whitespace-pre-wrap text-amber-900 leading-relaxed font-cormorant text-lg">
                      {music.lyrics}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                    <p className="text-amber-700 font-cinzel">Letra não disponível para esta música.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "sheet" && music.sheetMusic && (
            <Card className="bg-amber-50/50 border-amber-200/50">
              <CardHeader>
                <CardTitle className="font-cinzel text-amber-900 flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Partitura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img
                    src={music.sheetMusic || "/placeholder.svg"}
                    alt={`Partitura de ${music.title}`}
                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg border border-amber-200"
                  />
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = music.sheetMusic!
                        link.download = `${music.title} - Partitura.png`
                        link.click()
                      }}
                      className="border-amber-300 text-amber-900 hover:bg-amber-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Partitura
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
