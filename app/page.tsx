import { MusicPlayer } from "@/components/music-player"
import { FeaturedMusic } from "@/components/featured-music"
import { MusicLibrary } from "@/components/music-library"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedArtist } from "@/components/featured-artist"
import { LiturgicalCalendar } from "@/components/liturgical-calendar"
import { Testimonials } from "@/components/testimonials"
import { DecorativeDivider } from "@/components/decorative-divider"
import { DocumentsSection } from "@/components/documents-section"
import styles from "./page.module.css"



export default function Home() {
  return (
    <div className={styles.main}>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />

        <div className="container">
          <div className={styles.content}>
            <DecorativeDivider />
<FeaturedArtist />
            

            <DecorativeDivider variant="medium" />

             <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Estudos e Documentos</h2>
              <p className={styles.sectionSubtitle}>
                Explore nossa coleção de estudos acadêmicos, análises musicais e recursos educacionais sobre música
                sacra católica.
              </p>
              <DocumentsSection />
            </section>

            <DecorativeDivider variant="medium" />

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Biblioteca de Música Sacra</h2>
              <MusicLibrary />
            </section>

            <DecorativeDivider variant="medium" />

           
<section className={styles.section}>
              <h2 className={styles.sectionTitle}>Tesouro de Música Sacra</h2>
              <p className={styles.sectionSubtitle}>
                Descubra a beleza atemporal da música sacra católica, desde o canto gregoriano antigo até as composições
                modernas.
              </p>
              <FeaturedMusic />
            </section>
            <DecorativeDivider variant="medium" />

            <div className={styles.gridContainer}>
              <LiturgicalCalendar />
              <Testimonials />
            </div>
          </div>
        </div>
      </main>
      <div className={styles.musicPlayer}>
        <MusicPlayer />
      </div>
      <SiteFooter />
    </div>
  )
}
