"use client"

import { useState, useEffect, useCallback } from "react"
import * as AudioStorage from "@/services/audio-storage"

export interface Music {
  id: string
  title: string
  artist: string
  album: string
  lyrics: string
  duration: string
  dateAdded: string
  featured: boolean
  sheetMusic?: string
  audioFile?: string | Blob | File | { url?: string; src?: string; data?: string | Blob }
  audioBlob?: Blob
}

const STORAGE_KEY = "cantus-catholicus-music"

export function useMusicStorage() {
  const [musics, setMusics] = useState<Music[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMusics = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsedMusics = JSON.parse(stored)
          setMusics(parsedMusics)
        }
      } catch (error) {
        console.error("Erro ao carregar músicas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMusics()
  }, [])

  const saveMusics = useCallback((newMusics: Music[]) => {
    try {
      const serializableMusics = newMusics.map((music) => {
        const { audioBlob, ...rest } = music

        if (typeof rest.audioFile !== "string" && rest.audioFile !== undefined) {
          return { ...rest, audioFile: "indexed-db" }
        }

        return rest
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableMusics))
      setMusics(newMusics)
    } catch (error) {
      console.error("Erro ao salvar músicas:", error)
    }
  }, [])

  const saveAudioFile = useCallback(async (musicId: string, audioFile: File): Promise<Blob> => {
    try {
      if (!musicId) {
        throw new Error("ID da música é obrigatório para salvar o arquivo de áudio")
      }

      const audioBlob = new Blob([audioFile], { type: audioFile.type })

      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string
            await AudioStorage.saveAudio(musicId, base64)
            resolve(audioBlob)
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.readAsDataURL(audioFile)
      })
    } catch (error) {
      console.error("Erro ao salvar arquivo de áudio:", error)
      throw error
    }
  }, [])

  const getAudioFile = useCallback(async (musicId: string): Promise<string | undefined> => {
    try {
      if (!musicId) return undefined
      const audioData = await AudioStorage.getAudio(musicId)
      return audioData || undefined
    } catch (error) {
      console.error("Erro ao recuperar arquivo de áudio:", error)
      return undefined
    }
  }, [])

  const addMusic = useCallback(
    async (musicData: Omit<Music, "id" | "dateAdded">, audioFile?: File) => {
      const newMusic: Music = {
        ...musicData,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      }

      if (audioFile) {
        try {
          const audioBlob = await saveAudioFile(newMusic.id, audioFile)
          newMusic.audioBlob = audioBlob
          newMusic.audioFile = URL.createObjectURL(audioBlob)
        } catch (error) {
          console.error("Erro ao salvar arquivo de áudio:", error)
        }
      }

      const updatedMusics = [...musics, newMusic]
      saveMusics(updatedMusics)
      return newMusic
    },
    [musics, saveMusics, saveAudioFile],
  )

  const editMusic = useCallback(
    (id: string, musicData: Partial<Music>) => {
      if (!id) return
      const updatedMusics = musics.map((music) => (music.id === id ? { ...music, ...musicData } : music))
      saveMusics(updatedMusics)
    },
    [musics, saveMusics],
  )

  const removeMusic = useCallback(
    async (id: string) => {
      if (!id) return
      try {
        await AudioStorage.removeAudio(id)
      } catch (error) {
        console.error("Erro ao remover arquivo de áudio:", error)
      }

      const updatedMusics = musics.filter((music) => music.id !== id)
      saveMusics(updatedMusics)
    },
    [musics, saveMusics],
  )

  const getMusicById = useCallback(
    async (id: string) => {
      if (!id) return undefined
      const music = musics.find((music) => music.id === id)
      if (music?.audioFile === "indexed-db") {
        try {
          const audioData = await getAudioFile(id)
          if (audioData) {
            return { ...music, audioFile: audioData }
          }
        } catch (error) {
          console.error("Erro ao carregar áudio:", error)
        }
      }
      return music
    },
    [musics, getAudioFile],
  )

  const hasAudioFile = useCallback(async (musicId: string): Promise<boolean> => {
    try {
      if (!musicId) return false
      return await AudioStorage.hasAudio(musicId)
    } catch (error) {
      console.error("Erro ao verificar arquivo de áudio:", error)
      return false
    }
  }, [])

  return {
    musics,
    isLoading,
    addMusic,
    editMusic,
    removeMusic,
    getMusicById,
    getAudioFile,
    hasAudioFile,
  }
}
