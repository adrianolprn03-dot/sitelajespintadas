export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.glossario.findMany({
      orderBy: { termo: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar glossário" }, { status: 500 });
  }
}

