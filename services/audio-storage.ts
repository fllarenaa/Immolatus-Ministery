/**
 * Serviço para armazenamento de arquivos de áudio usando IndexedDB
 */

// Nome do banco de dados e da store
const DB_NAME = "cantus-catholicus-db"
const AUDIO_STORE = "audio-files"
const DB_VERSION = 1

// Interface para os itens armazenados
interface AudioItem {
  id: string
  audioData: string // Base64 do arquivo de áudio
  timestamp: number
}

// Função para abrir a conexão com o banco de dados
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("Erro ao abrir o banco de dados:", event)
      reject("Não foi possível abrir o banco de dados")
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Criar object store se não existir
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: "id" })
        console.log("Object store de áudio criada")
      }
    }
  })
}

// Validar ID da música
function validateMusicId(musicId: any): string {
  if (!musicId) {
    throw new Error("ID da música é obrigatório")
  }

  if (typeof musicId !== "string") {
    console.warn(`ID da música não é uma string: ${typeof musicId}. Convertendo para string.`)
    return String(musicId)
  }

  return musicId
}

// Salvar um arquivo de áudio
export async function saveAudio(musicId: string, audioData: string): Promise<void> {
  try {
    // Validar parâmetros
    const validMusicId = validateMusicId(musicId)
    console.log(`Salvando áudio para música ${validMusicId} no IndexedDB...`)

    // Verificar se audioData é uma string
    if (typeof audioData !== "string") {
      throw new Error(`audioData deve ser uma string, recebido: ${typeof audioData}`)
    }

    const db = await openDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([AUDIO_STORE], "readwrite")
      const store = transaction.objectStore(AUDIO_STORE)

      const item: AudioItem = {
        id: validMusicId,
        audioData,
        timestamp: Date.now(),
      }

      const request = store.put(item)

      request.onsuccess = () => {
        console.log(`Áudio para música ${validMusicId} salvo com sucesso no IndexedDB`)
        resolve()
      }

      request.onerror = (event) => {
        console.error("Erro ao salvar áudio:", event)
        reject("Erro ao salvar o arquivo de áudio")
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("Erro ao salvar áudio:", error)
    throw error
  }
}

// Obter um arquivo de áudio
export async function getAudio(musicId: string): Promise<string | undefined> {
  try {
    // Validar parâmetros
    if (!musicId) {
      console.error("ID da música não fornecido para getAudio")
      return undefined
    }

    const validMusicId = validateMusicId(musicId)
    console.log(`Buscando áudio para música ${validMusicId} no IndexedDB...`)

    const db = await openDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([AUDIO_STORE], "readonly")
      const store = transaction.objectStore(AUDIO_STORE)

      const request = store.get(validMusicId)

      request.onsuccess = () => {
        const result = request.result as AudioItem | undefined
        if (result) {
          console.log(`Áudio para música ${validMusicId} encontrado no IndexedDB`)

          // Verificar se audioData é uma string
          if (typeof result.audioData !== "string") {
            console.error(`Erro: audioData não é uma string, é ${typeof result.audioData}`)
            resolve(undefined)
            return
          }

          resolve(result.audioData)
        } else {
          console.log(`Áudio para música ${validMusicId} não encontrado no IndexedDB`)
          resolve(undefined)
        }
      }

      request.onerror = (event) => {
        console.error("Erro ao buscar áudio:", event)
        reject("Erro ao buscar o arquivo de áudio")
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("Erro ao buscar áudio:", error)
    return undefined
  }
}

// Verificar se um arquivo de áudio existe
export async function hasAudio(musicId: string): Promise<boolean> {
  try {
    // Validar parâmetros
    if (!musicId) {
      console.error("ID da música não fornecido para hasAudio")
      return false
    }

    const validMusicId = validateMusicId(musicId)
    const audio = await getAudio(validMusicId)
    return audio !== undefined
  } catch (error) {
    console.error("Erro ao verificar áudio:", error)
    return false
  }
}

// Remover um arquivo de áudio
export async function removeAudio(musicId: string): Promise<void> {
  try {
    // Validar parâmetros
    if (!musicId) {
      console.error("ID da música não fornecido para removeAudio")
      return
    }

    const validMusicId = validateMusicId(musicId)
    console.log(`Removendo áudio para música ${validMusicId} do IndexedDB...`)

    const db = await openDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([AUDIO_STORE], "readwrite")
      const store = transaction.objectStore(AUDIO_STORE)

      const request = store.delete(validMusicId)

      request.onsuccess = () => {
        console.log(`Áudio para música ${validMusicId} removido com sucesso do IndexedDB`)
        resolve()
      }

      request.onerror = (event) => {
        console.error("Erro ao remover áudio:", event)
        reject("Erro ao remover o arquivo de áudio")
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error("Erro ao remover áudio:", error)
    throw error
  }
}
