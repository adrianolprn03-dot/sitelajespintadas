import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signESICToken } from "@/lib/esic-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const cidadao = await prisma.cidadaoEsic.findUnique({
      where: { email },
    });

    if (!cidadao || !cidadao.senha) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const senhaCorreta = await bcrypt.compare(senha, cidadao.senha);

    if (!senhaCorreta) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const token = await signESICToken({
      id: cidadao.id,
      email: cidadao.email,
    });

    return NextResponse.json({
      success: true,
      token,
      cidadao: { id: cidadao.id, nome: cidadao.nome, email: cidadao.email },
    });
  } catch (error) {
    console.error("Erro no login de cidadão:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
