"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Music } from "./use-music-storage"

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentMusic, setCurrentMusic] = useState<Music | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Inicializar o elemento de áudio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      console.log("Elemento de áudio inicializado")
    }

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(audio.duration)
      console.log("Duração do áudio atualizada:", audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      console.log("Reprodução finalizada")
    }

    const handleLoadedData = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      console.log("Áudio carregado com sucesso, duração:", audio.duration)
    }

    const handleError = (e: any) => {
      console.error("Erro no elemento de áudio:", e)
      setError("Erro ao carregar o áudio. Verifique o formato do arquivo.")
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("error", handleError)
      audio.pause()
    }
  }, [])

  // Atualizar volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const playMusic = useCallback(
    async (music: Music) => {
      if (!audioRef.current) {
        console.error("Elemento de áudio não inicializado")
        return
      }

      if (!music.audioFile) {
        console.error("Música não possui arquivo de áudio:", music.title)
        alert("Esta música não possui arquivo de áudio.")
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        console.log("Tentando reproduzir:", music.title)
        console.log("Arquivo de áudio:", typeof music.audioFile, music.audioFile.substring(0, 50) + "...")

        // Se é uma música diferente, carregar nova fonte
        if (currentMusic?.id !== music.id) {
          console.log("Definindo nova fonte de áudio")
          audioRef.current.src = music.audioFile
          setCurrentMusic(music)
          setCurrentTime(0)

          // Verificar se o áudio é válido
          if (!music.audioFile.startsWith("data:audio/") && !music.audioFile.startsWith("blob:")) {
            console.warn("Formato de áudio possivelmente não suportado:", music.audioFile.substring(0, 20))
          }

          // Aguardar o carregamento dos metadados
          await new Promise((resolve, reject) => {
            const audio = audioRef.current!

            const onLoadedData = () => {
              console.log("Áudio carregado com sucesso, duração:", audio.duration)
              audio.removeEventListener("loadeddata", onLoadedData)
              audio.removeEventListener("error", onError)
              resolve(true)
            }

            const onError = (e: any) => {
              console.error(
                "Erro ao carregar áudio:",
                e,
                "Código:",
                audio.error?.code,
                "Mensagem:",
                audio.error?.message,
              )
              audio.removeEventListener("loadeddata", onLoadedData)
              audio.removeEventListener("error", onError)
              reject(e)
            }

            audio.addEventListener("loadeddata", onLoadedData)
            audio.addEventListener("error", onError)

            // Se já está carregado
            if (audio.readyState >= 2) {
              console.log("Áudio já está carregado, readyState:", audio.readyState)
              onLoadedData()
            } else {
              console.log("Aguardando carregamento do áudio, readyState atual:", audio.readyState)
            }
          })
        }

        console.log("Iniciando reprodução...")
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              setIsLoading(false)
              console.log("Reprodução iniciada com sucesso")
            })
            .catch((error) => {
              console.error("Erro ao iniciar reprodução:", error)
              setIsPlaying(false)
              setIsLoading(false)
              setError("Erro ao reproduzir áudio. Verifique se o formato é suportado.")
            })
        }
      } catch (error) {
        console.error("Erro ao reproduzir música:", error)
        setIsPlaying(false)
        setIsLoading(false)
        setError("Erro ao reproduzir a música. Verifique se o arquivo de áudio é válido.")
      }
    },
    [currentMusic],
  )

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      console.log("Reprodução pausada")
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    console.log("Toggle play/pause - isPlaying:", isPlaying, "currentMusic:", currentMusic?.title)

    if (isPlaying) {
      pauseMusic()
    } else if (currentMusic && currentMusic.audioFile) {
      playMusic(currentMusic)
    } else {
      console.warn("Nenhuma música carregada ou sem arquivo de áudio")
    }
  }, [isPlaying, currentMusic, playMusic, pauseMusic])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const setVolumeLevel = useCallback((newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
  }, [isMuted])

  const formatTime = useCallback((time: number) => {
    if (isNaN(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }, [])

  return {
    currentMusic,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    volume,
    isMuted,
    playMusic,
    pauseMusic,
    togglePlayPause,
    seekTo,
    setVolumeLevel,
    toggleMute,
    formatTime,
  }
}
