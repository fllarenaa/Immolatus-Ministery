import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://liturgia.up.railway.app/v2/today"); // versão v2, dia de hoje
    if (!res.ok) {
      throw new Error("Status da resposta não OK: " + res.status);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar API Liturgia Diária:", error);
    return NextResponse.json(
      { error: "Erro ao buscar liturgia diária" },
      { status: 500 }
    );
  }
}
