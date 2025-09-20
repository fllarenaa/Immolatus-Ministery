"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

interface LiturgicalData {
  data: string
  liturgia: string
  cor: string
  oracoes: {
    coleta: string
    oferendas: string
    comunhao: string
    extras: any[]
  }
  leituras: {
    primeiraLeitura: any[]
    salmo: any[]
    segundaLeitura: any[]
    evangelho: any[]
    extras: any[]
  }
  antifonas: {
    entrada: string
    comunhao: string
  }
}


  export function LiturgicalCalendar() {
  const [liturgia, setLiturgia] = useState<LiturgicalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://liturgia.up.railway.app/v2/")
      .then((res) => res.json())
      .then((data) => {
        setLiturgia(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando...</p>
  if (!liturgia) return <p>Erro ao carregar dados.</p>

  return (
    <Card className="bg-amber-100/50 border-amber-800/30">
      <CardHeader className="border-b border-amber-800/20 bg-amber-200/30">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-amber-900" />
          <CardTitle className="text-xl font-cinzel text-amber-900">Calendário Litúrgico</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-amber-800/20">
          {/* {liturgicalEvents.map((event, index) => ( */}
            <li  className="bg-amber-50/80 p-4 hover:bg-amber-200/20 transition-colors">
              <div className="flex items-start gap-3">
                <div
               className={`w-3 h-3 rounded-full mt-1.5 ${
    liturgia.cor === "Verde"
      ? "bg-green-600"
      : liturgia.cor === "Vermelho"
      ? "bg-rose-600"
      : liturgia.cor === "Roxo"
      ? "bg-purple-600"
      : liturgia.cor === "Rosa"
      ? "bg-pink-600"
      : liturgia.cor === "Branco"
      ? "bg-gray-200"
      : "bg-amber-600"
  }`}
                ></div>
                <p><strong>Cor Litúrgica:</strong> {liturgia.cor}</p>
                <div>
                  <p className="text-sm text-amber-700">{liturgia.data}</p>
                  <h4 className="font-cinzel font-medium text-amber-900">{liturgia.liturgia}</h4>
                  {/* <p className="text-sm text-amber-800">Música Recomendada: {event.music}</p> */}
                </div>
              </div>
            </li>
          {/* ))} */}
        </ul>
        <div className="p-4 text-center border-t border-amber-800/20">
          <a href="#" className="text-sm font-medium text-amber-900 hover:text-amber-700 transition-colors">
            Ver Calendário Completo
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
