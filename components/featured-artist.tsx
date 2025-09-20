import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function FeaturedArtist() {
  return (
    <section className="my-16">
      <div className="relative overflow-hidden rounded-lg border border-amber-800/30 bg-amber-100/30">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('/decorative-border.png')] bg-contain bg-right opacity-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-cinzel text-amber-900 mb-2">Manual de Conversão</h2>
            <div className="w-20 h-1 bg-amber-700 mb-6"></div>

            <h3 className="text-xl md:text-2xl font-cinzel text-amber-800 mb-4">Manual de Conversão para o conhecimento da Fé Católica</h3>

            <p className="text-amber-800 mb-4">
              O manual de conversão é um guia completo feito para esclarecer todas as suas dúvidas sobre a fé católica. Ele explica de forma clara os principais ensinamentos da Igreja, os sacramentos, a oração, a vida de Jesus Cristo e o papel de Maria e dos santos. Com ele, você encontrará respostas sobre como viver a fé no dia a dia, entender os mistérios da Igreja e se preparar para receber os sacramentos da iniciação cristã, como o Batismo, a Confirmação e a Eucaristia. É um passo seguro e orientado para quem deseja se converter de vez ao Catolicismo, com confiança e conhecimento.
            </p>

            <p className="text-amber-800 mb-6">
            Immolatus
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                Catolicismo
              </span>
              <span className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                Fé Católica
              </span>
              <span className="px-3 py-1 bg-amber-200/50 text-amber-900 text-sm rounded-full border border-amber-800/20">
                Conversão
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-700/50 font-cinzel">
                Ler Agora
              </Button>
              {/* <Button variant="outline" className="border-amber-800/30 text-amber-900 font-cinzel">
                Biografia do Artista
              </Button> */}
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
              <p className="text-sm font-medium text-amber-900">Livro em Destaque</p>
              <p className="text-xs text-amber-800">Immolatus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
