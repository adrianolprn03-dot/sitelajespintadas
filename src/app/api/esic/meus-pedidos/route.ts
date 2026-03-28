import { NextRequest, NextResponse } from "next/server";
import { verifyESICToken } from "@/lib/esic-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyESICToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
    }

    const pedidos = await prisma.esic.findMany({
      where: { cidadaoId: decoded.id },
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos do cidadão:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
