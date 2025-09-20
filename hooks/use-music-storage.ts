"use client"

import { useState, useEffect, useCallback } from "react"
import { useDatabase } from "@/hooks/use-database"
import type { MusicRecord } from "@/lib/database"
import { db, STORES } from "@/lib/database"

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
  // Novos campos do banco de dados
  tags?: string[]
  genre?: string
  period?: string
  language?: string
  difficulty?: number
  liturgicalSeason?: string
  feast?: string
}

const STORAGE_KEY = "cantus-catholicus-music"

export function useMusicStorage() {
  const [musics, setMusics] = useState<Music[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isInitialized } = useDatabase()

  useEffect(() => {
    if (isInitialized) {
      loadMusics()
    }
  }, [isInitialized])

  const loadMusics = async () => {
    try {
      setIsLoading(true)

      // Carregar do banco de dados
      const dbMusics = await db.getAll<MusicRecord>(STORES.MUSIC)

      // Converter para o formato esperado
      const convertedMusics: Music[] = dbMusics.map((dbMusic) => ({
        id: dbMusic.id,
        title: dbMusic.title,
        artist: dbMusic.artist,
        album: dbMusic.album,
        lyrics: dbMusic.lyrics,
        duration: dbMusic.duration,
        dateAdded: dbMusic.dateAdded,
        featured: dbMusic.featured,
        sheetMusic: dbMusic.sheetMusic,
        audioFile: dbMusic.audioFileId ? "indexed-db" : undefined,
        tags: dbMusic.tags,
        genre: dbMusic.genre,
        period: dbMusic.period,
        language: dbMusic.language,
        difficulty: dbMusic.difficulty,
        liturgicalSeason: dbMusic.liturgicalSeason,
        feast: dbMusic.feast,
      }))

      setMusics(convertedMusics)
    } catch (error) {
      console.error("Erro ao carregar músicas do banco:", error)

      // Fallback para localStorage se houver erro
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsedMusics = JSON.parse(stored)
          setMusics(parsedMusics)
        }
      } catch (localError) {
        console.error("Erro ao carregar do localStorage:", localError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveAudioFile = useCallback(async (musicId: string, audioFile: File): Promise<string> => {
    try {
      console.log(`Salvando arquivo de áudio para música ${musicId}...`)

      // Converter para base64
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string

            // Salvar no banco de dados
            const audioRecord = {
              id: `audio_${musicId}`,
              musicId: musicId,
              audioData: base64,
              format: audioFile.type,
              size: audioFile.size,
              timestamp: Date.now(),
            }

            await db.add(STORES.AUDIO_FILES, audioRecord)
            console.log(`Arquivo de áudio salvo no banco para música ${musicId}`)

            resolve(audioRecord.id)
          } catch (error) {
            console.error("Erro ao salvar arquivo de áudio no banco:", error)
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsDataURL(audioFile)
      })
    } catch (error) {
      console.error("Erro ao processar arquivo de áudio:", error)
      throw error
    }
  }, [])

  const getAudioFile = useCallback(async (musicId: string): Promise<string | undefined> => {
    try {
      console.log(`Buscando arquivo de áudio para música ${musicId}...`)

      // Buscar no banco de dados
      const audioFiles = await db.getByIndex(STORES.AUDIO_FILES, "musicId", musicId)

      if (audioFiles.length > 0) {
        const audioFile = audioFiles[0] as any
        console.log(`Arquivo de áudio encontrado para música ${musicId}`)
        return audioFile.audioData
      }

      console.log(`Nenhum arquivo de áudio encontrado para música ${musicId}`)
      return undefined
    } catch (error) {
      console.error("Erro ao recuperar arquivo de áudio:", error)
      return undefined
    }
  }, [])

  const addMusic = useCallback(
    async (musicData: Omit<Music, "id" | "dateAdded">, audioFile?: File) => {
      try {
        // Preparar dados para o banco
        const musicRecord: Omit<MusicRecord, "id" | "dateAdded"> = {
          title: musicData.title,
          artist: musicData.artist,
          album: musicData.album,
          lyrics: musicData.lyrics,
          duration: musicData.duration,
          featured: musicData.featured,
          sheetMusic: musicData.sheetMusic,
          tags: musicData.tags || [],
          genre: musicData.genre || "Música Sacra",
          period: musicData.period || "Contemporâneo",
          language: musicData.language || "Português",
          difficulty: musicData.difficulty || 1,
          liturgicalSeason: musicData.liturgicalSeason,
          feast: musicData.feast,
        }

        // Salvar música no banco
        const savedMusic = await db.addMusic(musicRecord)
        console.log(`Música salva no banco: ${savedMusic.title} (ID: ${savedMusic.id})`)

        // Salvar arquivo de áudio se fornecido
        if (audioFile) {
          try {
            const audioFileId = await saveAudioFile(savedMusic.id, audioFile)

            // Atualizar registro da música com ID do arquivo de áudio
            const updatedMusic = { ...savedMusic, audioFileId }
            await db.update(STORES.MUSIC, updatedMusic)

            console.log("Arquivo de áudio associado à música")
          } catch (error) {
            console.error("Erro ao salvar arquivo de áudio:", error)
          }
        }

        // Recarregar lista de músicas
        await loadMusics()

        // Converter para formato de retorno
        const newMusic: Music = {
          id: savedMusic.id,
          title: savedMusic.title,
          artist: savedMusic.artist,
          album: savedMusic.album,
          lyrics: savedMusic.lyrics,
          duration: savedMusic.duration,
          dateAdded: savedMusic.dateAdded,
          featured: savedMusic.featured,
          sheetMusic: savedMusic.sheetMusic,
          audioFile: audioFile ? "indexed-db" : undefined,
          tags: savedMusic.tags,
          genre: savedMusic.genre,
          period: savedMusic.period,
          language: savedMusic.language,
          difficulty: savedMusic.difficulty,
          liturgicalSeason: savedMusic.liturgicalSeason,
          feast: savedMusic.feast,
        }

        return newMusic
      } catch (error) {
        console.error("Erro ao adicionar música:", error)
        throw error
      }
    },
    [saveAudioFile],
  )

  const editMusic = useCallback(
    async (id: string, musicData: Partial<Music>) => {
      try {
        // Buscar música atual no banco
        const currentMusic = await db.get<MusicRecord>(STORES.MUSIC, id)
        if (!currentMusic) {
          console.error("Música não encontrada para edição:", id)
          return
        }

        // Preparar dados atualizados
        const updatedMusic: MusicRecord = {
          ...currentMusic,
          ...musicData,
          dateModified: new Date().toISOString(),
        }

        // Atualizar no banco
        await db.update(STORES.MUSIC, updatedMusic)
        console.log(`Música atualizada no banco: ${id}`)

        // Recarregar lista
        await loadMusics()
      } catch (error) {
        console.error("Erro ao editar música:", error)
        throw error
      }
    },
    [loadMusics],
  )

  const removeMusic = useCallback(
    async (id: string) => {
      try {
        // Remover arquivos de áudio associados
        const audioFiles = await db.getByIndex(STORES.AUDIO_FILES, "musicId", id)
        for (const audioFile of audioFiles) {
          await db.delete(STORES.AUDIO_FILES, (audioFile as any).id)
        }

        // Remover música do banco
        await db.delete(STORES.MUSIC, id)
        console.log(`Música removida do banco: ${id}`)

        // Recarregar lista
        await loadMusics()
      } catch (error) {
        console.error("Erro ao remover música:", error)
        throw error
      }
    },
    [loadMusics],
  )

  const getMusicById = useCallback(
    async (id: string) => {
      try {
        const music = musics.find((music) => music.id === id)
        if (music && music.audioFile === "indexed-db") {
          const audioData = await getAudioFile(id)
          if (audioData) {
            return { ...music, audioFile: audioData }
          }
        }
        return music
      } catch (error) {
        console.error("Erro ao buscar música por ID:", error)
        return undefined
      }
    },
    [musics, getAudioFile],
  )

  const hasAudioFile = useCallback(async (musicId: string): Promise<boolean> => {
    try {
      const audioFiles = await db.getByIndex(STORES.AUDIO_FILES, "musicId", musicId)
      return audioFiles.length > 0
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
