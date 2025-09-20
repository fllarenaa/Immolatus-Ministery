import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"
import styles from "./hero-section.module.css"
import ImmolatusLogo from "@/public/logo.png"

export function HeroSection() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroOverlay}></div>

      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoCircle}>
              <div className={styles.logoInner}>
                <span className={styles.logoInitials}>
                 <Image src={ImmolatusLogo} className={styles.Logo} alt="Immolatus Cantus" width={100} height={100} />
                </span>
              </div>
            </div>
          </div>

          <h1 className={styles.title}>Immolatus Cantus</h1>

          <p className={styles.subtitle}>Um tesouro de música sacra católica através dos séculos</p>

          <div className={styles.actions}>
            <Button size="lg">Explorar Coleção</Button>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input type="text" placeholder="Buscar música sacra..." className={styles.searchInput} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
