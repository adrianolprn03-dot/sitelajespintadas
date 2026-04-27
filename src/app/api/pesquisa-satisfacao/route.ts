import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Extrai e limpa o CPF (deixa apenas números)
        const cpfRaw = body.cpf || "";
        const cpf = cpfRaw.replace(/\D/g, "");

        if (!cpf || cpf.length !== 11) {
            return NextResponse.json(
                { error: "CPF inválido." },
                { status: 400 }
            );
        }

        const dataAtual = new Date();
        const mes = dataAtual.getMonth() + 1; // 1-12
        const ano = dataAtual.getFullYear();

        // Verifica se já votou neste mês
        // Usamos ts-ignore temporariamente até que o Prisma Client seja regenerado localmente
        // @ts-ignore
        const votoExistente = await prisma.pesquisaSatisfacao.findFirst({
            where: {
                cpf,
                mes,
                ano,
            },
        });

        if (votoExistente) {
            return NextResponse.json(
                { error: "Você já participou da pesquisa este mês. Obrigado!" },
                { status: 400 }
            );
        }

        // Salva no banco de dados
        // @ts-ignore
        const pesquisa = await prisma.pesquisaSatisfacao.create({
            data: {
                cpf,
                avaliacaoGestao: body.avaliacaoGestao,
                avaliacaoOuvidoria: body.avaliacaoOuvidoria,
                satisfacaoTransparencia: body.satisfacaoTransparencia,
                avaliacaoLixo: body.avaliacaoLixo,
                avaliacaoLimpezaRuas: body.avaliacaoLimpezaRuas,
                avaliacaoPatrimonio: body.avaliacaoPatrimonio,
                avaliacaoPracas: body.avaliacaoPracas,
                avaliacaoCultura: body.avaliacaoCultura,
                avaliacaoIluminacao: body.avaliacaoIluminacao,
                avaliacaoSeguranca: body.avaliacaoSeguranca,
                avaliacaoEsporte: body.avaliacaoEsporte,
                avaliacaoSaude: body.avaliacaoSaude,
                avaliacaoEducacao: body.avaliacaoEducacao,
                avaliacaoAssistenciaSocial: body.avaliacaoAssistenciaSocial,
                mes,
                ano,
            },
        });

        return NextResponse.json({ success: true, pesquisa }, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao salvar pesquisa de satisfação:", error);
        
        // Verifica erro de unicidade do Prisma (P2002) - redundância de segurança
        if (error.code === 'P2002') {
             return NextResponse.json(
                { error: "Você já participou da pesquisa este mês. Obrigado!" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Erro interno do servidor ao salvar a pesquisa." },
            { status: 500 }
        );
    }
}
