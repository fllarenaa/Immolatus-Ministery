import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function Testimonials() {
  return (
    <Card className="bg-amber-100/50 border-amber-800/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Quote className="h-5 w-5 text-amber-900" />
          <h3 className="text-xl font-cinzel text-amber-900">Depoimentos</h3>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -top-2 -left-2 text-4xl text-amber-800/20 font-serif">"</div>
            <div className="pl-6">
              <p className="italic text-amber-800 mb-3">
                A música sacra deste site transformou o coro da nossa paróquia. Os cantos gregorianos especialmente
                trouxeram um profundo senso de reverência às nossas liturgias.
              </p>
              <p className="text-sm font-medium text-amber-900">— Pe. Tomás, Paróquia Santa Maria</p>
            </div>
          </div>

          <div className="h-px bg-amber-800/20 my-4"></div>

          <div className="relative">
            <div className="absolute -top-2 -left-2 text-4xl text-amber-800/20 font-serif">"</div>
            <div className="pl-6">
              <p className="italic text-amber-800 mb-3">
                Como diretor musical, achei esta coleção inestimável. O contexto histórico fornecido junto com cada peça
                me ajuda a selecionar a música perfeita para cada tempo litúrgico.
              </p>
              <p className="text-sm font-medium text-amber-900">— Maria L., Diretora Musical da Catedral</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm font-medium text-amber-900 hover:text-amber-700 transition-colors">
            Ler Mais Depoimentos
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
