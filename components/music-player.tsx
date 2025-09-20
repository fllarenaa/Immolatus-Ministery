"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, ListMusic, Shuffle, Repeat } from "lucide-react"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { useMusicStorage } from "@/hooks/use-music-storage"

export function MusicPlayer() {
  const {
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    togglePlayPause,
    seekTo,
    setVolumeLevel,
    toggleMute,
    formatTime,
  } = useAudioPlayer()

  const { musics } = useMusicStorage()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none")

  // Calcular progresso
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration
    seekTo(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolumeLevel(value[0] / 100)
  }

  if (!currentMusic) {
    return (
      <div className="bg-stone-900/95 backdrop-blur-sm border-t border-amber-500/30 p-3">
      
      </div>
    )
  }

  return (
    <div className="bg-stone-900/95 backdrop-blur-sm border-t border-amber-500/30 p-2 md:p-3">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Informações da música */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 md:flex-none md:w-1/4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 relative">
              <img
                src="/placeholder.svg?height=48&width=48"
                alt="Capa do álbum"
                className="h-full w-full object-cover rounded-md"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <div className="animate-spin h-5 w-5 border-2 border-amber-300 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 md:flex-none">
              <p className="text-amber-200 font-cinzel font-medium text-sm md:text-base truncate">
                {currentMusic.title}
              </p>
              <p className="text-amber-300/70 text-xs md:text-sm truncate">{currentMusic.artist}</p>
            </div>
          </div>

          {/* Controles centrais */}
          <div className="flex flex-col items-center gap-1 md:gap-2 flex-1 max-w-md">
            {/* Botões de controle */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
                onClick={() => setIsShuffled(!isShuffled)}
              >
                <Shuffle className={`h-3 w-3 md:h-4 md:w-4 ${isShuffled ? "text-amber-400" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
              >
                <SkipBack className="h-3 w-3 md:h-4 md:w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="h-10 w-10 md:h-12 md:w-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Play className="h-4 w-4 md:h-5 md:w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
              >
                <SkipForward className="h-3 w-3 md:h-4 md:w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
                onClick={() => {
                  const modes: ("none" | "one" | "all")[] = ["none", "one", "all"]
                  const currentIndex = modes.indexOf(repeatMode)
                  const nextMode = modes[(currentIndex + 1) % modes.length]
                  setRepeatMode(nextMode)
                }}
              >
                <Repeat className={`h-3 w-3 md:h-4 md:w-4 ${repeatMode !== "none" ? "text-amber-400" : ""}`} />
              </Button>
            </div>

            {/* Barra de progresso */}
            <div className="w-full flex items-center gap-2 text-xs text-amber-300/70">
              <span className="text-xs font-mono min-w-[35px]">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  value={[progress]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span className="text-xs font-mono min-w-[35px]">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controles direitos */}
          <div className="hidden md:flex items-center gap-2 w-1/4 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="h-8 w-8 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-red-400" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
            >
              <ListMusic className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 min-w-[120px]">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Controles móveis */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="h-8 w-8 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
            >
              <Heart className={`h-3 w-3 ${isFavorite ? "fill-current text-red-400" : ""}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
