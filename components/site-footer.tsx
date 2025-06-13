import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-amber-800/30 bg-amber-100/80 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-amber-900/90 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-amber-200/80 flex items-center justify-center">
              <span className="text-3xl font-cinzel text-amber-200">CC</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-cinzel text-amber-900 mb-2">Cantus Catholicus</h2>
          <p className="text-amber-800 max-w-md mx-auto">
            Preservando e compartilhando o rico patrimônio musical da Igreja Católica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <h3 className="text-lg font-cinzel text-amber-900 mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/music" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Biblioteca Musical
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Artistas em Destaque
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Calendário Litúrgico
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-cinzel text-amber-900 mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Artigos e Pesquisas
                </Link>
              </li>
              <li>
                <Link href="/sheet-music" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Partituras
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Tutoriais
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-amber-800 hover:text-amber-700 transition-colors">
                  Apoie Nossa Missão
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-cinzel text-amber-900 mb-4">Conecte-se Conosco</h3>
            <div className="flex justify-center space-x-3 mb-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-800/30 text-amber-900 hover:bg-amber-200/50"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-800/30 text-amber-900 hover:bg-amber-200/50"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-800/30 text-amber-900 hover:bg-amber-200/50"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-amber-800/30 text-amber-900 hover:bg-amber-200/50"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
            <p className="text-sm text-amber-800 mb-2">Inscreva-se em nossa newsletter</p>
            <form className="flex max-w-xs mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 rounded-l-md border border-amber-800/30 bg-amber-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
              <Button className="rounded-l-none bg-amber-900 hover:bg-amber-800 text-amber-100">Inscrever</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-amber-800/20 pt-8 text-center">
          <p className="text-sm text-amber-800">
            © {new Date().getFullYear()} Cantus Catholicus. Todos os direitos reservados.
          </p>
          <p className="text-xs text-amber-700 mt-1 font-serif italic">"Qui cantat, bis orat" — Santo Agostinho</p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-amber-800">
            <Link href="/terms" className="hover:text-amber-700 transition-colors">
              Termos
            </Link>
            <Link href="/privacy" className="hover:text-amber-700 transition-colors">
              Privacidade
            </Link>
            <Link href="/contact" className="hover:text-amber-700 transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
