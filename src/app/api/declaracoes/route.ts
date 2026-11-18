export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth, type PerfilUsuario } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";
import { jsonNoStore, revalidatePaths } from "@/lib/revalidate-site";
import { obterModeloDeclaracao, resolverFiltroModuloDeclaracao } from "@/lib/declaracoes-catalogo";

const DECLARACAO_ALLOWED_ROLES: PerfilUsuario[] = [
    "admin",
    "controladoria",
    "editor",
    "integracao",
    "esic",
    "comunicacao",
];

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const modulo = searchParams.get("modulo");
        const criterioPntp = searchParams.get("criterioPntp");
        const exercicioParam = searchParams.get("exercicio");
        const apenasAtivas = searchParams.get("apenasAtivas") === "true";
        const tipoSituacao = searchParams.get("tipoSituacao");
        const busca = searchParams.get("busca")?.trim().toLowerCase();

        const whereAnd: any[] = [];

        if (modulo || criterioPntp) {
            const { aliases, criterioEfetivo } = resolverFiltroModuloDeclaracao(modulo, criterioPntp);
            const orConds: any[] = [];
            if (aliases.length > 0) {
                orConds.push({ modulo: { in: aliases } });
            }
            if (criterioEfetivo) {
                orConds.push({ criterioPntp: criterioEfetivo });
            }
            if (orConds.length > 0) {
                whereAnd.push({ OR: orConds });
            }
        }

        if (exercicioParam && exercicioParam !== "todos") {
            const anoNum = parseInt(exercicioParam, 10);
            if (!Number.isNaN(anoNum)) {
                whereAnd.push({ exercicio: anoNum });
            }
        }

        if (apenasAtivas) {
            whereAnd.push({ ativa: true });
        }

        if (tipoSituacao && tipoSituacao !== "todos") {
            whereAnd.push({ tipoSituacao });
        }

        const items = await prisma.declaracaoTransparencia.findMany({
            where: whereAnd.length > 0 ? { AND: whereAnd } : undefined,
            orderBy: [{ ativa: "desc" }, { exercicio: "desc" }, { dataEmissao: "desc" }],
        });

        const filtered = busca
            ? items.filter(
                  (d) =>
                      d.modulo.toLowerCase().includes(busca) ||
                      (d.criterioPntp || "").toLowerCase().includes(busca) ||
                      d.orgaoResponsavel.toLowerCase().includes(busca) ||
                      d.textoDeclaracao.toLowerCase().includes(busca) ||
                      d.responsavelNome.toLowerCase().includes(busca)
              )
            : items;

        return jsonNoStore({
            items: filtered,
            total: filtered.length,
        });
    } catch (error) {
        console.error("[API Declaracoes GET]", error);
        return NextResponse.json(
            { error: "Erro ao consultar declarações de transparência." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(DECLARACAO_ALLOWED_ROLES);
    if (!auth.authorized) return auth.response;

    try {
        const body = await req.json();

        const modulo = String(body.modulo || "").trim();
        const textoDeclaracao = String(body.textoDeclaracao || "").trim();
        const exercicio = parseInt(String(body.exercicio || new Date().getFullYear()), 10);

        if (!modulo || !textoDeclaracao || Number.isNaN(exercicio)) {
            return NextResponse.json(
                { error: "Módulo, exercício e texto oficial da declaração são obrigatórios." },
                { status: 400 }
            );
        }

        const modelo = obterModeloDeclaracao(modulo);
        const criterioPntp =
            body.criterioPntp !== undefined && body.criterioPntp !== null
                ? String(body.criterioPntp).trim() || null
                : modelo.criterioPntp || null;

        const tipoSituacao =
            body.tipoSituacao === "nao_aplicavel" ? "nao_aplicavel" : "nao_ocorrencia_declarada";

        const competencia = body.competencia ? String(body.competencia).trim() : "Exercício Anual";
        const orgaoResponsavel =
            String(body.orgaoResponsavel || "").trim() || modelo.orgaoResponsavelPadrao;
        const fundamentoLegal =
            String(body.fundamentoLegal || "").trim() || modelo.fundamentoLegalPadrao;
        const responsavelNome =
            String(body.responsavelNome || "").trim() || auth.user.nome;
        const responsavelCargo =
            String(body.responsavelCargo || "").trim() || modelo.responsavelCargoPadrao;
        const arquivoAssinadoUrl = body.arquivoAssinadoUrl
            ? String(body.arquivoAssinadoUrl).trim()
            : null;
        const ativa = body.ativa !== false;
        const substituirAnteriores = body.substituirAnteriores !== false;

        if (ativa && substituirAnteriores) {
            const { aliases } = resolverFiltroModuloDeclaracao(modulo, criterioPntp);
            const matchWhere: any = {
                modulo: { in: aliases.length > 0 ? aliases : [modulo] },
                exercicio,
                ativa: true,
            };
            if (competencia && competencia !== "Exercício Anual") {
                matchWhere.competencia = competencia;
            }
            await prisma.declaracaoTransparencia.updateMany({
                where: matchWhere,
                data: { ativa: false },
            });
        }

        const created = await prisma.declaracaoTransparencia.create({
            data: {
                modulo,
                criterioPntp,
                orgaoResponsavel,
                exercicio,
                competencia,
                tipoSituacao,
                textoDeclaracao,
                fundamentoLegal,
                responsavelNome,
                responsavelCargo,
                arquivoAssinadoUrl,
                dataEmissao: new Date(),
                dataConferencia: new Date(),
                situacaoPublicacao: "publicado",
                ativa,
            },
        });

        if (criterioPntp && ativa) {
            await prisma.criterioPNTP.updateMany({
                where: { codigo: criterioPntp },
                data: {
                    statusConteudo: tipoSituacao,
                    dataUltimaVerificacao: new Date(),
                },
            });
        }

        await registrarHistoricoAlteracao({
            entidade: "DeclaracaoTransparencia",
            entidadeId: created.id,
            acao: "publicacao",
            resumoAlteracao: `Declaração de Inexistência/Não Ocorrência emitida para ${created.modulo} (${created.exercicio}${created.competencia ? ` • ${created.competencia}` : ""})`,
            secretaria: created.orgaoResponsavel,
            dadosNovos: created,
            user: auth.user,
        });

        revalidatePaths([
            "/transparencia",
            "/admin",
            "/admin/pntp",
            "/admin/declaracoes",
            modelo.rotaPublica,
            modelo.rotaAdmin,
        ]);

        return jsonNoStore(created, { status: 201 });
    } catch (error) {
        console.error("[API Declaracoes POST]", error);
        return NextResponse.json(
            { error: "Erro ao registrar declaração de inexistência." },
            { status: 500 }
        );
    }
}
