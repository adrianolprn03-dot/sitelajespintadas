export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signESICToken } from "@/lib/esic-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      nome, email, senha, tipoPessoa, cpf, cnpj, razaoSocial, nomeFantasia,
      telefone, dataNascimento, sexo, escolaridade, profissao,
      rg, orgaoEmissor, ufEmissor,
      cep, endereco, numero, bairro, cidade, uf, dataAbertura
    } = body;

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

    if (cpf && tipoPessoa === "Física") {
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

    if (cnpj && tipoPessoa === "Jurídica") {
      const cnpjExiste = await prisma.cidadaoEsic.findUnique({
        where: { cnpj },
      });
      if (cnpjExiste) {
        return NextResponse.json(
          { error: "Este CNPJ já está cadastrado." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const cidadao = await prisma.cidadaoEsic.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        tipoPessoa: tipoPessoa || "Física",
        cpf: tipoPessoa === "Física" ? cpf : null,
        cnpj: tipoPessoa === "Jurídica" ? cnpj : null,
        razaoSocial: tipoPessoa === "Jurídica" ? razaoSocial : null,
        nomeFantasia: tipoPessoa === "Jurídica" ? nomeFantasia : null,
        telefone,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        sexo,
        escolaridade,
        profissao,
        rg,
        orgaoEmissor,
        ufEmissor,
        cep,
        endereco,
        numero,
        bairro,
        cidade,
        uf,
        dataAbertura: dataAbertura ? new Date(dataAbertura) : null,
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


