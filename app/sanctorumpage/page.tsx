"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SanctusSection } from "@/components/sanctus-section"
import { SanctumDay } from "@/components/sanctumday";
import { MusicPlayer } from "@/components/music-player"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { DecorativeDivider } from "@/components/decorative-divider"

export default function SanctorumPage() {
  return (


    



    <div className="min-h-screen bg-stone-50 flex flex-col">



      <SiteHeader />
   
      <main className="flex-1"> 
       
        <div className="container mx-auto px-4 py-8"> 
           
            <SanctumDay /> 
            <DecorativeDivider variant="medium" />
          <SanctusSection showAddButton={true} />
        </div>
      </main>

      <div className="sticky bottom-0 w-full bg-stone-900/95 border-t border-amber-500/30 backdrop-filter backdrop-blur-sm z-40">
        <MusicPlayer />
      </div>

      <SiteFooter />
    </div>
  )
}
