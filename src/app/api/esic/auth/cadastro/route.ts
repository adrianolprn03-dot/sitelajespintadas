import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signESICToken } from "@/lib/esic-auth";

export async function POST(req: NextRequest) {
  try {
    const { nome, cpf, email, senha } = await req.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Campos obrigatórios: nome, email e senha." },
        { status: 400 }
      );
    }

    const emailExiste = await prisma.cidadaoEsic.findUnique({
      where: { email },
    });

    if (emailExiste) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 400 }
      );
    }

    if (cpf) {
      const cpfExiste = await prisma.cidadaoEsic.findUnique({
        where: { cpf },
      });
      if (cpfExiste) {
        return NextResponse.json(
          { error: "Este CPF já está cadastrado." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const cidadao = await prisma.cidadaoEsic.create({
      data: {
        nome,
        email,
        cpf,
        senha: hashedPassword,
      },
    });

    const token = await signESICToken({
      id: cidadao.id,
      email: cidadao.email,
    });

    return NextResponse.json(
      {
        success: true,
        token,
        cidadao: { id: cidadao.id, nome: cidadao.nome, email: cidadao.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no cadastro de cidadão:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
