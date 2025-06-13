import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import styles from "./hero-section.module.css"
import Logo from '../public/logo.png';
import Image from 'next/image';

export function HeroSection() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroOverlay}></div>

      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoCircle}>
              {/* <div className={styles.logoInner}> */}
                {/* <span className={styles.logoInitials}>CC</span> */}
               <Image src={Logo} alt="Logo" />
              {/* </div> */}
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
