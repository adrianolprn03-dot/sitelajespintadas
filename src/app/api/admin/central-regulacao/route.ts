import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/central-regulacao - Retorna itens de fila e as configurações
export async function GET() {
    try {
        const [itens, config] = await Promise.all([
            prisma.centralRegulacaoItem.findMany({
                orderBy: { ordem: "asc" }
            }),
            prisma.centralRegulacaoConfig.findUnique({
                where: { id: "config" }
            })
        ]);

        return NextResponse.json({
            itens,
            config: config || {
                id: "config",
                titulo: "Central de Regulação em Saúde",
                subtitulo: "Acompanhe as filas de espera para consultas especializadas, exames e cirurgias eletivas no SUS municipal.",
                comoFunciona: "A Central de Regulação de Saúde é responsável por organizar e garantir o acesso equânime dos cidadãos aos serviços de saúde de média e alta complexidade, respeitando critérios clínicos de prioridade e a ordem de chegada dos pedidos.",
                telefone: "(84) 3400-0000",
                horarioFuncionamento: "Segunda a Sexta, 07h às 13h",
                endereco: "Secretaria Municipal de Saúde de Lajes Pintadas",
                linkSistemaExterno: "",
                documentoRegulamento: ""
            }
        });
    } catch (error) {
        console.error("Erro ao buscar dados da regulação:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

// POST /api/admin/central-regulacao - Criar novo item de fila ou atualizar configurações gerais
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Se for atualização de configurações
        if (body.type === "config") {
            const { titulo, subtitulo, comoFunciona, telefone, horarioFuncionamento, endereco, linkSistemaExterno, documentoRegulamento } = body;
            const updatedConfig = await prisma.centralRegulacaoConfig.upsert({
                where: { id: "config" },
                update: {
                    titulo,
                    subtitulo,
                    comoFunciona,
                    telefone,
                    horarioFuncionamento,
                    endereco,
                    linkSistemaExterno,
                    documentoRegulamento
                },
                create: {
                    id: "config",
                    titulo: titulo || "Central de Regulação em Saúde",
                    subtitulo,
                    comoFunciona,
                    telefone,
                    horarioFuncionamento,
                    endereco,
                    linkSistemaExterno,
                    documentoRegulamento
                }
            });
            return NextResponse.json({ success: true, config: updatedConfig });
        }

        // Caso contrário, cria novo item de fila
        const { tipo, totalPacientes, tempoEspera, procedimentos, icone, cor, ordem, ativo } = body;

        if (!tipo || !tempoEspera) {
            return NextResponse.json({ error: "Tipo e tempo de espera são obrigatórios." }, { status: 400 });
        }

        const novoItem = await prisma.centralRegulacaoItem.create({
            data: {
                tipo,
                totalPacientes: Number(totalPacientes) || 0,
                tempoEspera,
                procedimentos: procedimentos || null,
                icone: icone || "FaUserMd",
                cor: cor || "from-blue-500 to-indigo-600",
                ordem: Number(ordem) || 0,
                ativo: ativo !== undefined ? Boolean(ativo) : true
            }
        });

        return NextResponse.json({ success: true, item: novoItem }, { status: 201 });
    } catch (error) {
        console.error("Erro ao salvar item/configuração:", error);
        return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 });
    }
}
