import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.renunciaFiscal.findMany({
      where: { ativo: true },
      orderBy: { valorEstimado: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar renúncias" }, { status: 500 });
  }
}
