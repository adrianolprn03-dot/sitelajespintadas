import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CONFIG_KEY = "incentivos_culturais_data";

const DEFAULT_DATA = {
    title: "Incentivos Culturais e Esportivos",
    subtitle: "Editais, programas de fomento e recursos destinados à cultura, esporte e lazer da comunidade.",
    recursosInvestidos: 137500,
    projetosApoiados: 28,
    exercicioAno: "2026",
    programas: [
        {
            id: "prog-1",
            icone: "musica",
            titulo: "Fomento à Cultura",
            descricao: "Apoio financeiro e logístico a projetos culturais, festivais, grupos folclóricos e manifestações artísticas locais.",
            cor: "from-purple-500 to-violet-600",
            recursos: 42000,
            projetos: 8,
            status: "Vigente",
        },
        {
            id: "prog-2",
            icone: "esporte",
            titulo: "Fomento ao Esporte",
            descricao: "Apoio a competições esportivas, escolinhas de esporte, atletas e times representativos do município.",
            cor: "from-blue-500 to-cyan-600",
            recursos: 28500,
            projetos: 12,
            status: "Vigente",
        },
        {
            id: "prog-3",
            icone: "teatro",
            titulo: "Festividades Municipais",
            descricao: "Organização e apoio de eventos festivos, datas comemorativas e festivais anuais do calendário oficial.",
            cor: "from-amber-500 to-orange-600",
            recursos: 55000,
            projetos: 5,
            status: "Vigente",
        },
        {
            id: "prog-4",
            icone: "livro",
            titulo: "Incentivo à Leitura",
            descricao: "Projeto de fomento à leitura, doação de livros e apoio à biblioteca pública municipal.",
            cor: "from-emerald-500 to-teal-600",
            recursos: 12000,
            projetos: 3,
            status: "Vigente",
        },
    ]
};

export async function GET() {
    try {
        const config = await prisma.configuracao.findUnique({
            where: { chave: CONFIG_KEY }
        });

        if (!config || !config.valor) {
            return NextResponse.json(DEFAULT_DATA);
        }

        const data = JSON.parse(config.valor);
        return NextResponse.json({ ...DEFAULT_DATA, ...data });
    } catch (error) {
        console.error("Erro ao buscar configurações de incentivos culturais:", error);
        return NextResponse.json(DEFAULT_DATA);
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    try {
        const body = await req.json();

        const config = await prisma.configuracao.upsert({
            where: { chave: CONFIG_KEY },
            update: {
                valor: JSON.stringify(body),
                grupo: "transparencia",
                descricao: "Dados e Programas da Página de Incentivos Culturais e Esportivos"
            },
            create: {
                chave: CONFIG_KEY,
                valor: JSON.stringify(body),
                grupo: "transparencia",
                descricao: "Dados e Programas da Página de Incentivos Culturais e Esportivos"
            }
        });

        return NextResponse.json({ success: true, data: JSON.parse(config.valor) });
    } catch (error) {
        console.error("Erro ao salvar configurações de incentivos culturais:", error);
        return NextResponse.json({ error: "Erro ao salvar informações." }, { status: 500 });
    }
}
