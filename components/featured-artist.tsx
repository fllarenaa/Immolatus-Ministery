import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function FeaturedArtist() {
  return (
    <section className="my-16">
      <div className="relative overflow-hidden rounded-lg border border-amber-800/30 bg-amber-100/30">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('/decorative-border.png')] bg-contain bg-right opacity-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-cinzel text-amber-900 mb-2">Artista em Destaque</h2>
            <div className="w-20 h-1 bg-amber-700 mb-6"></div>

            <h3 className="text-xl md:text-2xl font-cinzel text-amber-800 mb-4">The Tallis Scholars</h3>

            <p className="text-amber-800 mb-4">
              Fundado em 1973 por Peter Phillips, The Tallis Scholars se estabeleceram como os principais expoentes da
              música sacra renascentista em todo o mundo.
            </p>

            <p className="text-amber-800 mb-6">
              Suas performances dão vida à beleza intrincada das obras-primas polifônicas de compositores como
              Palestrina, Victoria e o próprio Tallis.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                Renascimento
              </span>
              <span className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                Polifonia
              </span>
              <span className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                Coral Sacro
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-700/50 font-cinzel">
                Explorar Discografia
              </Button>
              <Button variant="outline" className="border-amber-800/30 text-amber-900 font-cinzel">
                Biografia do Artista
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-md overflow-hidden border-4 border-amber-800/20 shadow-lg relative">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="The Tallis Scholars"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  className="rounded-full h-16 w-16 bg-amber-900/80 hover:bg-amber-800 text-amber-100 border-2 border-amber-100/30"
                >
                  <Play className="h-8 w-8" />
                  <span className="sr-only">Reproduzir apresentação em destaque</span>
                </Button>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-amber-100 border border-amber-800/30 p-3 rounded shadow-md">
              <p className="text-sm font-medium text-amber-900">Gravação em Destaque</p>
              <p className="text-xs text-amber-800">Allegri: Miserere</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
