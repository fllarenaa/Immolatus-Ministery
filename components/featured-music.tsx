import { Button } from "@/components/ui/button"
import { Play, Plus, Info } from "lucide-react"
import styles from "./featured-music.module.css"

export function FeaturedMusic() {
  const featuredAlbums = [
    {
      id: 1,
      title: "Coleção de Canto Gregoriano",
      artist: "Coro da Abadia de Solesmes",
      cover: "/placeholder.svg?height=200&width=200",
      era: "Medieval",
    },
    {
      id: 2,
      title: "Palestrina: Missa Papae Marcelli",
      artist: "The Tallis Scholars",
      cover: "/placeholder.svg?height=200&width=200",
      era: "Renascimento",
    },
    {
      id: 3,
      title: "Hinos Sacros do Renascimento",
      artist: "Oxford Camerata",
      cover: "/placeholder.svg?height=200&width=200",
      era: "Renascimento",
    },
    {
      id: 4,
      title: "Byrd: Missas para 3, 4 e 5 Vozes",
      artist: "The Cardinall's Musick",
      cover: "/placeholder.svg?height=200&width=200",
      era: "Renascimento",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {featuredAlbums.map((album) => (
          <div key={album.id} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.imageContainer}>
                <div className={styles.eraLabel}>{album.era}</div>
                <img src={album.cover || "/placeholder.svg"} alt={album.title} className={styles.image} />
                <div className={styles.overlay}>
                  <button className={styles.overlayButton}>
                    <Play className="h-5 w-5" />
                    <span className="sr-only">Reproduzir</span>
                  </button>
                  <button className={styles.overlayButton}>
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Adicionar à biblioteca</span>
                  </button>
                  <button className={styles.overlayButton}>
                    <Info className="h-5 w-5" />
                    <span className="sr-only">Mais informações</span>
                  </button>
                </div>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{album.title}</h3>
                <p className={styles.cardArtist}>{album.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <Button variant="outline" className={styles.viewAllButton}>
          Ver Todas as Coleções
        </Button>
      </div>
    </div>
  )
}
