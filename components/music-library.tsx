"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Plus, Clock, Heart, FileText, Trash2, Pause, Music2, Info, Loader2 } from "lucide-react"
import { useMusicStorage } from "@/hooks/use-music-storage"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { LyricsModal } from "./lyrics-modal"
import { AddMusicForm } from "./add-music-form"

export function MusicLibrary() {
  const { musics, isLoading, removeMusic, getAudioFile, hasAudioFile } = useMusicStorage()
  const { playMusic, pauseMusic, isPlaying, isLoading: isAudioLoading, currentMusic } = useAudioPlayer()
  const [selectedMusic, setSelectedMusic] = useState(null)
  const [showLyricsModal, setShowLyricsModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [audioStatus, setAudioStatus] = useState<Record<string, boolean>>({})
  const [loadingAudio, setLoadingAudio] = useState<Record<string, boolean>>({})

  // Verificar quais músicas têm áudio disponível
  useEffect(() => {
    const checkAudioAvailability = async () => {
      const status: Record<string, boolean> = {}

      for (const music of musics) {
        if (music.audioFile) {
          status[music.id] = true
        } else {
          status[music.id] = await hasAudioFile(music.id)
        }
      }

      setAudioStatus(status)
    }

    checkAudioAvailability()
  }, [musics, hasAudioFile])

  // Músicas padrão (exemplo)
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

  // Combinar músicas padrão com músicas adicionadas pelo usuário
  const allTracks = [...defaultTracks, ...musics]

  const handleShowLyrics = (music: any) => {
    setSelectedMusic(music)
    setShowLyricsModal(true)
  }

  const handleDeleteMusic = (musicId: string) => {
    if (confirm("Tem certeza que deseja excluir esta música?")) {
      removeMusic(musicId)
    }
  }

  const handlePlayPause = async (track: any) => {
    console.log("Tentando reproduzir/pausar:", track.title)

    // Se é a música atual e está tocando, pausar
    if (currentMusic?.id === track.id && isPlaying) {
      console.log("Pausando música atual")
      pauseMusic()
      return
    }

    // Marcar como carregando
    setLoadingAudio((prev) => ({ ...prev, [track.id]: true }))

    try {
      // Verificar se tem arquivo de áudio
      let audioFile = track.audioFile
      if (!audioFile || audioFile === "indexed-db") {
        console.log("Buscando arquivo de áudio do armazenamento...")
        audioFile = await getAudioFile(track.id)
        console.log("Arquivo de áudio obtido:", audioFile ? "Sim" : "Não")
      }

      if (audioFile) {
        const musicWithAudio = {
          ...track,
          audioFile: audioFile,
        }
        console.log("Reproduzindo música com áudio:", musicWithAudio.title)
        await playMusic(musicWithAudio)
      } else {
        console.warn("Música sem arquivo de áudio:", track.title)
        alert("Esta música não possui arquivo de áudio.")
      }
    } catch (error) {
      console.error("Erro ao reproduzir música:", error)
      alert("Erro ao reproduzir música. Verifique o console para mais detalhes.")
    } finally {
      setLoadingAudio((prev) => ({ ...prev, [track.id]: false }))
    }
  }

  if (isLoading) {
    return (
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-amber-900 font-cinzel">Carregando biblioteca musical...</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-amber-200/30 bg-amber-100/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-amber-600 rounded-full"></div>
            <h3 className="font-cinzel font-semibold text-amber-900 text-lg">Biblioteca de Música Sacra</h3>
            <span className="text-xs bg-amber-200/70 text-amber-900 px-2 py-1 rounded-full font-medium">
              {allTracks.length} música{allTracks.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-cinzel shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Música
            </Button>
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-900 hover:bg-amber-100 text-sm">
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-900 hover:bg-amber-100 text-sm">
              Ordenar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-200/30 hover:bg-amber-100/50 bg-amber-50/80">
                <TableHead className="w-12 font-cinzel text-amber-900 font-semibold">#</TableHead>
                <TableHead className="font-cinzel text-amber-900 font-semibold">Título</TableHead>
                <TableHead className="hidden md:table-cell font-cinzel text-amber-900 font-semibold">Artista</TableHead>
                <TableHead className="hidden lg:table-cell font-cinzel text-amber-900 font-semibold">Álbum</TableHead>
                <TableHead className="text-right font-cinzel text-amber-900 font-semibold">
                  <Clock className="h-4 w-4 ml-auto" />
                </TableHead>
                <TableHead className="w-40 font-cinzel text-amber-900 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTracks.map((track, index) => {
                const isCurrentTrack = currentMusic?.id === track.id
                const hasAudio = track.id.startsWith("default-") || audioStatus[track.id]
                const isLoadingTrack = loadingAudio[track.id] || (isAudioLoading && isCurrentTrack)

                return (
                  <TableRow
                    key={track.id}
                    className={`border-amber-200/30 hover:bg-amber-100/50 transition-colors ${
                      track.featured ? "bg-amber-50/80" : ""
                    } ${isCurrentTrack ? "bg-amber-200/30" : ""}`}
                  >
                    <TableCell className="font-medium text-amber-800">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handlePlayPause(track)}
                          disabled={!hasAudio || isLoadingTrack}
                          className={`h-8 w-8 rounded-full transition-colors ${
                            hasAudio
                              ? "text-amber-700 hover:bg-amber-200/50 hover:text-amber-800"
                              : "text-amber-400 cursor-not-allowed"
                          } ${isCurrentTrack && isPlaying ? "bg-amber-200/50" : ""}`}
                        >
                          {isLoadingTrack ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isCurrentTrack && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : hasAudio ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Music2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {isLoadingTrack ? "Carregando" : hasAudio ? "Reproduzir" : "Sem áudio"}
                          </span>
                        </Button>
                        <div className="flex-1">
                          <Link href={`/music/${track.id}`} className="block hover:text-amber-700 transition-colors">
                            <span
                              className={`font-medium block ${isCurrentTrack ? "text-amber-800" : "text-amber-900"}`}
                            >
                              {track.title}
                            </span>
                            <span className="text-xs text-amber-700 md:hidden block">{track.artist}</span>
                          </Link>
                        </div>
                        <div className="flex gap-1">
                          {track.featured && (
                            <span className="bg-amber-200/70 text-amber-900 text-xs px-2 py-0.5 rounded-full border border-amber-300/20 font-medium">
                              Destaque
                            </span>
                          )}
                          {hasAudio && (
                            <span className="bg-green-200/70 text-green-800 text-xs px-2 py-0.5 rounded-full border border-green-300/20 font-medium">
                              🎵
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-amber-700">{track.artist}</TableCell>
                    <TableCell className="hidden lg:table-cell text-amber-700">{track.album}</TableCell>
                    <TableCell className="text-right text-amber-700 font-mono text-sm">{track.duration}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Link href={`/music/${track.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-amber-700 hover:bg-amber-200/50"
                            title="Ver detalhes"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Ver detalhes</span>
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-amber-700 hover:bg-amber-200/50"
                          onClick={() => handleShowLyrics(track)}
                          title="Ver letra"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Ver letra</span>
                        </Button>

                        <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-700 hover:bg-amber-200/50">
                          <Heart className="h-4 w-4" />
                          <span className="sr-only">Favoritar</span>
                        </Button>

                        {!track.id.startsWith("default-") && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                            onClick={() => handleDeleteMusic(track.id)}
                            title="Excluir música"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {allTracks.length === 0 && (
          <div className="p-8 text-center">
            <Music2 className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <p className="text-amber-700 mb-4 font-cinzel">Nenhuma música encontrada na biblioteca.</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-cinzel shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Música
            </Button>
          </div>
        )}
      </div>

      {/* Modal para adicionar música */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <AddMusicForm onClose={() => setShowAddForm(false)} onSuccess={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Modal para visualizar letras */}
      <LyricsModal
        music={selectedMusic}
        isOpen={showLyricsModal}
        onClose={() => {
          setShowLyricsModal(false)
          setSelectedMusic(null)
        }}
      />
    </>
  )
}
