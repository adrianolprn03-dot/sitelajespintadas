export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonNoStore, revalidatePaths, REVALIDATE_GROUPS } from "@/lib/revalidate-site";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import {
    normalizeUnidadeRecord,
    serializeEquipe,
    serializeEspecialidades,
} from "@/lib/unidades";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tipo = searchParams.get("tipo");
        const all = searchParams.get("all");

        const where: Record<string, any> = {};

        if (all !== "true") {
            where.ativa = true;
        }

        if (tipo && tipo !== "todos") {
            const t = tipo.toLowerCase().trim();
            if (t === "saude" || t === "saúde") {
                where.tipo = { in: ["Saúde", "saude", "SAÚDE", "SAUDE", "saúde"] };
            } else if (t === "educacao" || t === "educação") {
                where.tipo = { in: ["Educação", "educacao", "EDUCAÇÃO", "EDUCACAO", "Educacao", "educação"] };
            } else if (t === "social" || t === "socioassistencial") {
                where.tipo = {
                    in: [
                        "Socioassistencial",
                        "social",
                        "SOCIOASSISTENCIAL",
                        "Social",
                        "Assistência Social",
                        "assistencia social",
                    ],
                };
            } else if (t === "cultura") {
                where.tipo = { in: ["Cultura", "cultura", "CULTURA"] };
            } else {
                where.tipo = { contains: tipo, mode: "insensitive" };
            }
        }

        const unidades = await prisma.unidadeAtendimento.findMany({
            where,
            orderBy: { nome: "asc" },
        });

        return jsonNoStore(unidades.map(normalizeUnidadeRecord));
    } catch (error) {
        console.error("Erro ao listar unidades:", error);
        return jsonNoStore({ error: "Erro ao buscar unidades" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return jsonNoStore({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const data = await req.json();
        const nome = String(data.nome || "").trim();
        const tipo = String(data.tipo || "").trim();
        const descricao = String(data.descricao || "").trim();
        const endereco = String(data.endereco || "").trim();
        const horario = String(data.horario || "").trim();

        if (!nome || !tipo || !endereco || !horario) {
            return jsonNoStore(
                { error: "Nome, tipo, endereço e horário são obrigatórios." },
                { status: 400 }
            );
        }

        const unidade = await prisma.unidadeAtendimento.create({
            data: {
                nome,
                tipo,
                subtipo: data.subtipo ? String(data.subtipo).trim() : null,
                cnes: data.cnes ? String(data.cnes).trim() : null,
                descricao: descricao || `${tipo} Municipal`,
                endereco,
                telefone: data.telefone ? String(data.telefone).trim() : null,
                horario,
                servicos: data.servicos ? String(data.servicos).trim() : null,
                especialidades: serializeEspecialidades(data.especialidades),
                equipe: serializeEquipe(data.equipe),
                mapa: data.mapa ? String(data.mapa).trim() : null,
                ativa: data.ativa !== undefined ? Boolean(data.ativa) : true,
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "UnidadeAtendimento",
            entidadeId: unidade.id,
            acao: "criacao",
            resumoAlteracao: `Unidade criada: ${unidade.nome} (${unidade.tipo})`,
            dadosNovos: unidade,
            secretaria: unidade.tipo,
        });

        revalidatePaths([...REVALIDATE_GROUPS.unidades, "/transparencia/educacao", "/transparencia/fila-creches", "/transparencia/saude"]);
        return jsonNoStore(normalizeUnidadeRecord(unidade), { status: 201 });
    } catch (error) {
        console.error("Erro ao criar unidade:", error);
        return jsonNoStore({ error: "Erro ao criar unidade" }, { status: 500 });
    }
}
