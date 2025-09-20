/**
 * Sistema de banco de dados usando IndexedDB para o Cantus Catholicus
 */

// Configurações do banco de dados
const DB_NAME = "cantus-catholicus-db"
const DB_VERSION = 2

// Stores do banco de dados
export const STORES = {
  MUSIC: "music",
  AUDIO_FILES: "audio-files",
  DOCUMENTS: "documents",
  MODULES: "modules",
  CHAPTERS: "chapters",
  USERS: "users",
  PLAYLISTS: "playlists",
} as const

// Interfaces do banco de dados
export interface MusicRecord {
  id: string
  title: string
  artist: string
  album: string
  lyrics: string
  duration: string
  dateAdded: string
  featured: boolean
  sheetMusic?: string
  audioFileId?: string
  tags: string[]
  genre: string
  period: string
  language: string
  difficulty: number // 1-5
  liturgicalSeason?: string
  feast?: string
}

export interface AudioFileRecord {
  id: string
  musicId: string
  audioData: string // Base64
  format: string
  size: number
  timestamp: number
}

export interface ModuleRecord {
  id: string
  title: string
  subtitle: string
  description: string
  author: string
  dateCreated: string
  dateModified: string
  category: string
  difficulty: number // 1-5
  estimatedReadTime: number // em minutos
  tags: string[]
  coverImage?: string
  published: boolean
  order: number
}

export interface ChapterRecord {
  id: string
  moduleId: string
  title: string
  content: string
  order: number
  dateCreated: string
  dateModified: string
  estimatedReadTime: number
  references: string[]
  attachments: string[]
}

export interface DocumentRecord {
  id: string
  title: string
  type: "pdf" | "text" | "image" | "audio" | "video"
  content?: string
  fileData?: string // Base64 para arquivos
  moduleId?: string
  chapterIds: string[]
  tags: string[]
  dateCreated: string
  dateModified: string
  author: string
  description: string
}

export interface UserRecord {
  id: string
  name: string
  email: string
  preferences: {
    theme: "light" | "dark"
    language: string
    autoplay: boolean
    volume: number
  }
  progress: {
    [moduleId: string]: {
      completedChapters: string[]
      lastAccessed: string
      timeSpent: number
    }
  }
  favorites: {
    music: string[]
    modules: string[]
    documents: string[]
  }
  dateCreated: string
  lastLogin: string
}

export interface PlaylistRecord {
  id: string
  name: string
  description: string
  musicIds: string[]
  userId: string
  isPublic: boolean
  dateCreated: string
  dateModified: string
  coverImage?: string
}

// Classe principal do banco de dados
export class CatholicMusicDB {
  private db: IDBDatabase | null = null
  private dbPromise: Promise<IDBDatabase> | null = null

  constructor() {
    this.dbPromise = this.initDB()
  }

  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error("Erro ao abrir banco de dados:", request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log("Banco de dados aberto com sucesso")
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        console.log("Atualizando estrutura do banco de dados...")

        // Store de músicas
        if (!db.objectStoreNames.contains(STORES.MUSIC)) {
          const musicStore = db.createObjectStore(STORES.MUSIC, { keyPath: "id" })
          musicStore.createIndex("title", "title", { unique: false })
          musicStore.createIndex("artist", "artist", { unique: false })
          musicStore.createIndex("genre", "genre", { unique: false })
          musicStore.createIndex("period", "period", { unique: false })
          musicStore.createIndex("featured", "featured", { unique: false })
          musicStore.createIndex("dateAdded", "dateAdded", { unique: false })
        }

        // Store de arquivos de áudio
        if (!db.objectStoreNames.contains(STORES.AUDIO_FILES)) {
          const audioStore = db.createObjectStore(STORES.AUDIO_FILES, { keyPath: "id" })
          audioStore.createIndex("musicId", "musicId", { unique: false })
        }

        // Store de módulos
        if (!db.objectStoreNames.contains(STORES.MODULES)) {
          const moduleStore = db.createObjectStore(STORES.MODULES, { keyPath: "id" })
          moduleStore.createIndex("category", "category", { unique: false })
          moduleStore.createIndex("published", "published", { unique: false })
          moduleStore.createIndex("order", "order", { unique: false })
          moduleStore.createIndex("dateCreated", "dateCreated", { unique: false })
        }

        // Store de capítulos
        if (!db.objectStoreNames.contains(STORES.CHAPTERS)) {
          const chapterStore = db.createObjectStore(STORES.CHAPTERS, { keyPath: "id" })
          chapterStore.createIndex("moduleId", "moduleId", { unique: false })
          chapterStore.createIndex("order", "order", { unique: false })
        }

        // Store de documentos
        if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
          const docStore = db.createObjectStore(STORES.DOCUMENTS, { keyPath: "id" })
          docStore.createIndex("type", "type", { unique: false })
          docStore.createIndex("moduleId", "moduleId", { unique: false })
          docStore.createIndex("author", "author", { unique: false })
          docStore.createIndex("dateCreated", "dateCreated", { unique: false })
        }

        // Store de usuários
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const userStore = db.createObjectStore(STORES.USERS, { keyPath: "id" })
          userStore.createIndex("email", "email", { unique: true })
        }

        // Store de playlists
        if (!db.objectStoreNames.contains(STORES.PLAYLISTS)) {
          const playlistStore = db.createObjectStore(STORES.PLAYLISTS, { keyPath: "id" })
          playlistStore.createIndex("userId", "userId", { unique: false })
          playlistStore.createIndex("isPublic", "isPublic", { unique: false })
        }

        console.log("Estrutura do banco de dados criada/atualizada")
      }
    })
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db
    if (this.dbPromise) return await this.dbPromise
    throw new Error("Banco de dados não inicializado")
  }

  // Métodos genéricos para CRUD
  async add<T>(storeName: string, data: T): Promise<T> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => resolve(data)
      request.onerror = () => reject(request.error)
    })
  }

  async update<T>(storeName: string, data: T): Promise<T> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(data)
      request.onerror = () => reject(request.error)
    })
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Métodos específicos para música
  async addMusic(music: Omit<MusicRecord, "id" | "dateAdded">): Promise<MusicRecord> {
    const musicRecord: MusicRecord = {
      ...music,
      id: `music_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString(),
    }
    return await this.add(STORES.MUSIC, musicRecord)
  }

  async getMusicWithAudio(musicId: string): Promise<{ music: MusicRecord; audioData?: string } | null> {
    const music = await this.get<MusicRecord>(STORES.MUSIC, musicId)
    if (!music) return null

    let audioData: string | undefined
    if (music.audioFileId) {
      const audioFile = await this.get<AudioFileRecord>(STORES.AUDIO_FILES, music.audioFileId)
      audioData = audioFile?.audioData
    }

    return { music, audioData }
  }

  // Métodos específicos para módulos e documentos
  async addModule(module: Omit<ModuleRecord, "id" | "dateCreated" | "dateModified">): Promise<ModuleRecord> {
    const moduleRecord: ModuleRecord = {
      ...module,
      id: `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    }
    return await this.add(STORES.MODULES, moduleRecord)
  }

  async addChapter(chapter: Omit<ChapterRecord, "id" | "dateCreated" | "dateModified">): Promise<ChapterRecord> {
    const chapterRecord: ChapterRecord = {
      ...chapter,
      id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    }
    return await this.add(STORES.CHAPTERS, chapterRecord)
  }

  async getModuleWithChapters(moduleId: string): Promise<{ module: ModuleRecord; chapters: ChapterRecord[] } | null> {
    const module = await this.get<ModuleRecord>(STORES.MODULES, moduleId)
    if (!module) return null

    const chapters = await this.getByIndex<ChapterRecord>(STORES.CHAPTERS, "moduleId", moduleId)
    chapters.sort((a, b) => a.order - b.order)

    return { module, chapters }
  }

  async searchMusic(query: string): Promise<MusicRecord[]> {
    const allMusic = await this.getAll<MusicRecord>(STORES.MUSIC)
    const searchTerm = query.toLowerCase()

    return allMusic.filter(
      (music) =>
        music.title.toLowerCase().includes(searchTerm) ||
        music.artist.toLowerCase().includes(searchTerm) ||
        music.album.toLowerCase().includes(searchTerm) ||
        music.lyrics.toLowerCase().includes(searchTerm) ||
        music.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  async searchModules(query: string): Promise<ModuleRecord[]> {
    const allModules = await this.getAll<ModuleRecord>(STORES.MODULES)
    const searchTerm = query.toLowerCase()

    return allModules.filter(
      (module) =>
        module.title.toLowerCase().includes(searchTerm) ||
        module.subtitle.toLowerCase().includes(searchTerm) ||
        module.description.toLowerCase().includes(searchTerm) ||
        module.author.toLowerCase().includes(searchTerm) ||
        module.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  // Método para inicializar dados de exemplo
  async initializeSampleData(): Promise<void> {
    try {
      // Verificar se já existem dados
      const existingModules = await this.getAll<ModuleRecord>(STORES.MODULES)
      if (existingModules.length > 0) {
        console.log("Dados de exemplo já existem")
        return
      }

      console.log("Inicializando dados de exemplo...")

      // Módulos de exemplo
      const sampleModules = [
        {
          title: "História do Canto Gregoriano",
          subtitle: "Das origens aos dias atuais",
          description: "Um estudo completo sobre a evolução do canto gregoriano na liturgia católica",
          author: "Pe. João Silva",
          category: "História",
          difficulty: 2,
          estimatedReadTime: 45,
          tags: ["canto gregoriano", "história", "liturgia"],
          published: true,
          order: 1,
        },
        {
          title: "Polifonia Sacra Renascentista",
          subtitle: "Palestrina e seus contemporâneos",
          description: "Análise das obras polifônicas do período renascentista",
          author: "Dra. Maria Santos",
          category: "Análise Musical",
          difficulty: 2,
          estimatedReadTime: 60,
          tags: ["polifonia", "renascimento", "palestrina"],
          published: true,
          order: 2,
        },
        {
          title: "Liturgia e Música Sacra",
          subtitle: "Princípios fundamentais",
          description: "Compreendendo a relação entre liturgia e música na tradição católica",
          author: "Pe. Carlos Mendes",
          category: "Liturgia",
          difficulty: 1,
          estimatedReadTime: 30,
          tags: ["liturgia", "música sacra", "tradição"],
          published: true,
          order: 3,
        },
      ]

      for (const moduleData of sampleModules) {
        const module = await this.addModule(moduleData)

        // Adicionar capítulos para cada módulo
        const chapterTitles = this.getChapterTitlesForModule(module.title)

        for (let i = 0; i < chapterTitles.length; i++) {
          await this.addChapter({
            moduleId: module.id,
            title: chapterTitles[i],
            content: this.generateSampleContent(chapterTitles[i]),
            order: i + 1,
            estimatedReadTime: 10,
            references: [],
            attachments: [],
          })
        }
      }

      console.log("Dados de exemplo inicializados com sucesso")
    } catch (error) {
      console.error("Erro ao inicializar dados de exemplo:", error)
    }
  }

  private getChapterTitlesForModule(moduleTitle: string): string[] {
    switch (moduleTitle) {
      case "História do Canto Gregoriano":
        return [
          "Origens do Canto Gregoriano",
          "Desenvolvimento na Idade Média",
          "Reforma Tridentina e o Canto",
          "Restauração no Século XIX",
          "O Canto Gregoriano Hoje",
        ]
      case "Polifonia Sacra Renascentista":
        return [
          "Contexto Histórico do Renascimento",
          "Giovanni Pierluigi da Palestrina",
          "Tomás Luis de Victoria",
          "William Byrd e a Escola Inglesa",
          "Técnicas Composicionais",
        ]
      case "Liturgia e Música Sacra":
        return [
          "Fundamentos Teológicos",
          "Documentos do Magistério",
          "Ano Litúrgico e Música",
          "Instrumentos na Liturgia",
          "Formação Musical Litúrgica",
        ]
      default:
        return ["Introdução", "Desenvolvimento", "Conclusão"]
    }
  }

  private generateSampleContent(chapterTitle: string): string {
    return `# ${chapterTitle}

Este é um capítulo de exemplo sobre ${chapterTitle.toLowerCase()}. O conteúdo seria desenvolvido com informações detalhadas sobre o tema.

## Introdução

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Desenvolvimento

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Subtópico 1

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Subtópico 2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Conclusão

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

---

*Este é um conteúdo de exemplo. Em uma implementação real, este texto seria substituído por conteúdo educacional específico sobre música sacra católica.*`
  }
}

// Instância global do banco de dados
export const db = new CatholicMusicDB()
