"use client"

import { useState, useEffect, useCallback } from "react"
import { db, type MusicRecord, type ModuleRecord, type ChapterRecord, type DocumentRecord } from "@/lib/database"

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeDB = async () => {
      try {
        // Aguardar inicialização do banco
        await db.initializeSampleData()
        setIsInitialized(true)
      } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeDB()
  }, [])

  // Métodos para música
  const addMusic = useCallback(async (musicData: Omit<MusicRecord, "id" | "dateAdded">) => {
    return await db.addMusic(musicData)
  }, [])

  const getMusic = useCallback(async (id: string) => {
    return await db.get<MusicRecord>("music", id)
  }, [])

  const getAllMusic = useCallback(async () => {
    return await db.getAll<MusicRecord>("music")
  }, [])

  const searchMusic = useCallback(async (query: string) => {
    return await db.searchMusic(query)
  }, [])

  // Métodos para módulos
  const addModule = useCallback(async (moduleData: Omit<ModuleRecord, "id" | "dateCreated" | "dateModified">) => {
    return await db.addModule(moduleData)
  }, [])

  const getModule = useCallback(async (id: string) => {
    return await db.get<ModuleRecord>("modules", id)
  }, [])

  const getAllModules = useCallback(async () => {
    const modules = await db.getAll<ModuleRecord>("modules")
    return modules.sort((a, b) => a.order - b.order)
  }, [])

  const getModuleWithChapters = useCallback(async (moduleId: string) => {
    return await db.getModuleWithChapters(moduleId)
  }, [])

  const searchModules = useCallback(async (query: string) => {
    return await db.searchModules(query)
  }, [])

  // Métodos para capítulos
  const addChapter = useCallback(async (chapterData: Omit<ChapterRecord, "id" | "dateCreated" | "dateModified">) => {
    return await db.addChapter(chapterData)
  }, [])

  const getChapter = useCallback(async (id: string) => {
    return await db.get<ChapterRecord>("chapters", id)
  }, [])

  const getChaptersByModule = useCallback(async (moduleId: string) => {
    const chapters = await db.getByIndex<ChapterRecord>("chapters", "moduleId", moduleId)
    return chapters.sort((a, b) => a.order - b.order)
  }, [])

  // Métodos para documentos
  const addDocument = useCallback(async (document: DocumentRecord) => {
    return await db.add<DocumentRecord>("documents", document)
  }, [])

  const getDocument = useCallback(async (id: string) => {
    return await db.get<DocumentRecord>("documents", id)
  }, [])

  const getAllDocuments = useCallback(async () => {
    return await db.getAll<DocumentRecord>("documents")
  }, [])

  return {
    isInitialized,
    isLoading,
    // Música
    addMusic,
    getMusic,
    getAllMusic,
    searchMusic,
    // Módulos
    addModule,
    getModule,
    getAllModules,
    getModuleWithChapters,
    searchModules,
    // Capítulos
    addChapter,
    getChapter,
    getChaptersByModule,
    // Documentos
    addDocument,
    getDocument,
    getAllDocuments,
  }
}
