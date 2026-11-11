export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

function parseBrMonetary(raw: unknown): number | null {
    if (raw === undefined || raw === null) return null;
    const str = String(raw).trim();
    if (!str || str === "-" || str.toLowerCase() === "null") return null;
    const normalized = str.includes(",")
        ? str.replace(/\./g, "").replace(",", ".")
        : str;
    const num = Number(normalized);
    if (!Number.isFinite(num)) return null;
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export async function GET() {
    try {
        const rows = await prisma.importacaoCSV.findMany({
            orderBy: { criadoEm: "desc" },
            take: 30,
        });
        const items = rows.map((r) => ({
            ...r,
            tipo: r.modulo,
            nomeArquivo: r.arquivo,
            sistemaOrigem: r.origemSistema,
            registros: r.sucesso,
            duplicadosIgnorados: r.ignoradosDuplicados,
            errosCount: r.erros,
            usuario: r.executadoPor,
        }));
        return NextResponse.json({ items });
    } catch {
        return NextResponse.json({ items: [] });
    }
}

export async function POST(req: NextRequest) {
    const auth = await requireServerAuth(["admin", "controladoria", "integracao", "editor"]);
    if (!auth.authorized) return auth.response;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const modulo = formData.get("modulo") as string;
        const acao = (formData.get("acao") as string) || "importar"; // validar | importar
        const sistemaOrigem = (formData.get("sistemaOrigem") as string) || "Importação CSV";

        if (!file || !modulo) {
            return NextResponse.json({ error: "Arquivo e módulo são obrigatórios." }, { status: 400 });
        }

        const text = await file.text();
        const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l && !l.startsWith("#"));

        if (lines.length < 2) {
            return NextResponse.json({ error: "CSV vazio ou sem linhas de dados." }, { status: 400 });
        }

        const separator = lines[0].includes(";") ? ";" : ",";
        const headers = lines[0].split(separator).map((h) => h.trim().replace(/^"(.*)"$/, "$1"));
        const rows = lines.slice(1);

        let sucesso = 0;
        let duplicados = 0;
        let erros = 0;
        const mensagens: string[] = [];
        const preview: Record<string, unknown>[] = [];
        const now = new Date();

        for (let i = 0; i < rows.length; i++) {
            const values = rows[i].split(separator).map((v) => v.trim().replace(/^"(.*)"$/, "$1"));
            const obj: Record<string, string> = {};
            headers.forEach((h, idx) => {
                obj[h] = values[idx] ?? "";
            });

            if (preview.length < 5) {
                preview.push({ linha: i + 2, ...obj });
            }

            try {
                if (modulo === "receitas") {
                    const descricao = String(obj.descricao || "").trim();
                    const categoria = String(obj.categoria || "Corrente").trim();
                    const valor = parseBrMonetary(obj.valorArrecadado ?? obj.valor);
                    const mes = parseInt(String(obj.mes || ""), 10);
                    const ano = parseInt(String(obj.ano || ""), 10);

                    if (!descricao || valor === null || !Number.isFinite(mes) || !Number.isFinite(ano)) {
                        throw new Error("Campos obrigatórios ausentes ou inválidos (descricao, valor, mes, ano).");
                    }

                    if (acao === "importar") {
                        const existing = await prisma.receita.findFirst({
                            where: { descricao, categoria, mes, ano },
                        });
                        if (existing) {
                            await prisma.receita.update({
                                where: { id: existing.id },
                                data: {
                                    valor,
                                    valorPrevisto: parseBrMonetary(obj.valorPrevisto),
                                    valorArrecadado: valor,
                                    naturezaCodigo: obj.naturezaCodigo || existing.naturezaCodigo,
                                    fonte: obj.fonte || existing.fonte,
                                    fonteOrigem: sistemaOrigem,
                                    responsavelRevisao: auth.user.nome,
                                    dataAtualizacaoEfetiva: now,
                                    dataUltimaConferencia: now,
                                },
                            });
                            duplicados++;
                        } else {
                            await prisma.receita.create({
                                data: {
                                    descricao,
                                    categoria,
                                    naturezaCodigo: obj.naturezaCodigo || null,
                                    valor,
                                    valorPrevisto: parseBrMonetary(obj.valorPrevisto),
                                    valorAtualizado: parseBrMonetary(obj.valorAtualizado),
                                    valorLancado: parseBrMonetary(obj.valorLancado),
                                    valorArrecadado: valor,
                                    mes,
                                    ano,
                                    fonte: obj.fonte || null,
                                    fonteOrigem: sistemaOrigem,
                                    responsavelCadastro: auth.user.nome,
                                    dataAtualizacaoEfetiva: now,
                                    dataUltimaConferencia: now,
                                    criterioPntp: "3.1",
                                },
                            });
                        }
                    }
                } else if (modulo === "despesas") {
                    const descricao = String(obj.descricao || "").trim();
                    const secretaria = String(obj.secretaria || "Administração Geral").trim();
                    const valor = parseBrMonetary(obj.valorEmpenhado ?? obj.valor);
                    const mes = parseInt(String(obj.mes || ""), 10);
                    const ano = parseInt(String(obj.ano || ""), 10);

                    if (!descricao || valor === null || !Number.isFinite(mes) || !Number.isFinite(ano)) {
                        throw new Error("Campos obrigatórios ausentes ou inválidos (descricao, valor, mes, ano).");
                    }

                    if (acao === "importar") {
                        const numeroEmpenho = obj.numeroEmpenho ? String(obj.numeroEmpenho).trim() : null;
                        const existing = numeroEmpenho
                            ? await prisma.despesa.findFirst({ where: { numeroEmpenho, ano } })
                            : await prisma.despesa.findFirst({ where: { descricao, secretaria, mes, ano, valor } });

                        if (existing) {
                            await prisma.despesa.update({
                                where: { id: existing.id },
                                data: {
                                    valor,
                                    valorEmpenhado: valor,
                                    valorLiquidado: parseBrMonetary(obj.valorLiquidado) ?? existing.valorLiquidado,
                                    valorPago: parseBrMonetary(obj.valorPago) ?? existing.valorPago,
                                    fornecedor: obj.fornecedor || existing.fornecedor,
                                    credorCpfCnpj: obj.credorCpfCnpj || existing.credorCpfCnpj,
                                    fonteOrigem: sistemaOrigem,
                                    responsavelRevisao: auth.user.nome,
                                    dataAtualizacaoEfetiva: now,
                                    dataUltimaConferencia: now,
                                },
                            });
                            duplicados++;
                        } else {
                            await prisma.despesa.create({
                                data: {
                                    numeroEmpenho,
                                    dataEmpenho: obj.dataEmpenho ? new Date(obj.dataEmpenho) : null,
                                    descricao,
                                    categoria: String(obj.categoria || "Orçamentária"),
                                    secretaria,
                                    valor,
                                    valorEmpenhado: valor,
                                    valorLiquidado: parseBrMonetary(obj.valorLiquidado),
                                    valorPago: parseBrMonetary(obj.valorPago),
                                    mes,
                                    ano,
                                    fornecedor: obj.fornecedor || null,
                                    credorCpfCnpj: obj.credorCpfCnpj || null,
                                    fonteRecurso: obj.fonteRecurso || null,
                                    fonteOrigem: sistemaOrigem,
                                    responsavelCadastro: auth.user.nome,
                                    dataAtualizacaoEfetiva: now,
                                    dataUltimaConferencia: now,
                                    criterioPntp: "4.1",
                                },
                            });
                        }
                    }
                } else if (modulo === "servidores") {
                    const nome = String(obj.nome || "").trim();
                    const cargo = String(obj.cargo || "").trim();
                    const secretaria = String(obj.secretaria || "").trim();
                    const salarioBase = parseBrMonetary(obj.salarioBase);
                    const totalBruto = parseBrMonetary(obj.totalBruto);
                    const totalLiquido = parseBrMonetary(obj.totalLiquido);
                    const mes = parseInt(String(obj.mes || ""), 10);
                    const ano = parseInt(String(obj.ano || ""), 10);

                    if (!nome || !cargo || salarioBase === null || totalBruto === null || totalLiquido === null || !Number.isFinite(mes) || !Number.isFinite(ano)) {
                        throw new Error("Campos obrigatórios ausentes em servidor (nome, cargo, salarioBase, totalBruto, totalLiquido, mes, ano).");
                    }

                    if (acao === "importar") {
                        const existing = await prisma.servidor.findFirst({
                            where: { nome, cargo, mes, ano },
                        });
                        const ch = obj.cargaHoraria ? parseInt(String(obj.cargaHoraria).replace(/\D/g, ""), 10) : 40;
                        if (existing) {
                            await prisma.servidor.update({
                                where: { id: existing.id },
                                data: {
                                    salarioBase,
                                    totalBruto,
                                    totalLiquido,
                                    secretaria,
                                    vinculo: String(obj.vinculo || existing.vinculo),
                                    cargaHorariaSemanal: Number.isFinite(ch) ? ch : existing.cargaHorariaSemanal,
                                    fonteOrigem: sistemaOrigem,
                                    dataAtualizacaoEfetiva: now,
                                    dataUltimaConferencia: now,
                                },
                            });
                            duplicados++;
                        } else {
                            await prisma.servidor.create({
                                data: {
                                    nome,
                                    matricula: obj.matricula || null,
                                    cpfAnonimizado: obj.cpfMascarado || obj.cpfAnonimizado || null,
                                    cargo,
                                    vinculo: String(obj.vinculo || "efetivo"),
                                    secretaria,
                                    cargaHorariaSemanal: Number.isFinite(ch) ? ch : 40,
                                    salarioBase,
                                    vantagens: parseBrMonetary(obj.gratificacoes ?? obj.vantagens) ?? 0,
                                    descontos: parseBrMonetary(obj.descontos) ?? 0,
                                    totalBruto,
                                    totalLiquido,
                                    mes,
                                    ano,
                                    fonteOrigem: sistemaOrigem,
                                    dataAtualizacaoEfetiva: now,
                                    dataUltimaConferencia: now,
                                },
                            });
                        }
                    }
                } else if (modulo === "diarias") {
                    const servidor = String(obj.servidor || "").trim();
                    const destino = String(obj.destino || "").trim();
                    const valor = parseBrMonetary(obj.valor);
                    const mes = parseInt(String(obj.mes || ""), 10);
                    const ano = parseInt(String(obj.ano || ""), 10);

                    if (!servidor || !destino || valor === null || !Number.isFinite(mes) || !Number.isFinite(ano)) {
                        throw new Error("Campos obrigatórios ausentes em diária (servidor, destino, valor, mes, ano).");
                    }

                    if (acao === "importar") {
                        await prisma.diaria.create({
                            data: {
                                servidor,
                                cargo: String(obj.cargo || "Servidor"),
                                destino,
                                motivo: String(obj.motivo || "Interesse do serviço público"),
                                dataInicio: obj.dataInicio ? new Date(obj.dataInicio) : now,
                                dataFim: obj.dataFim ? new Date(obj.dataFim) : now,
                                valor,
                                valorUnitario: parseBrMonetary(obj.valorUnitario) ?? valor,
                                quantidadeDias: parseFloat(String(obj.quantidadeDias || "1")),
                                secretaria: String(obj.secretaria || "Administração"),
                                numeroPortaria: obj.portariaConcessao || obj.numeroPortaria || null,
                                relatorioViagemUrl: obj.relatorioViagemUrl || null,
                                mes,
                                ano,
                                fonteOrigem: sistemaOrigem,
                                responsavelCadastro: auth.user.nome,
                                dataAtualizacaoEfetiva: now,
                                dataUltimaConferencia: now,
                                criterioPntp: "7.1",
                            },
                        });
                    }
                } else if (modulo === "medicamentos") {
                    const nome = String(obj.nome || "").trim();
                    if (!nome) throw new Error("Nome do medicamento obrigatório.");
                    if (acao === "importar") {
                        const existing = await prisma.medicamento.findFirst({
                            where: { nome, unidadeSaude: obj.unidadeSaude || undefined },
                        });
                        const qtd = obj.quantidadeEstoque !== undefined ? parseInt(String(obj.quantidadeEstoque), 10) : null;
                        if (existing) {
                            await prisma.medicamento.update({
                                where: { id: existing.id },
                                data: {
                                    principioAtivo: obj.principioAtivo || existing.principioAtivo,
                                    apresentacao: obj.apresentacao || existing.apresentacao,
                                    unidadeMedida: obj.unidadeMedida || existing.unidadeMedida,
                                    quantidadeEstoque: qtd !== null && Number.isFinite(qtd) ? qtd : existing.quantidadeEstoque,
                                    status: obj.estoqueStatus || obj.status || existing.status,
                                    dataReferenciaEstoque: now,
                                },
                            });
                            duplicados++;
                        } else {
                            await prisma.medicamento.create({
                                data: {
                                    nome,
                                    principioAtivo: String(obj.principioAtivo || nome),
                                    apresentacao: obj.apresentacao || "Comprimido / Frasco",
                                    categoria: obj.categoria || "Atenção Básica",
                                    unidadeMedida: obj.unidadeMedida || "Unidade",
                                    quantidadeEstoque: qtd !== null && Number.isFinite(qtd) ? qtd : 0,
                                    status: obj.estoqueStatus || obj.status || "disponivel",
                                    unidadeSaude: obj.unidadeSaude || "Farmácia Básica Central",
                                    dataReferenciaEstoque: now,
                                },
                            });
                        }
                    }
                } else {
                    return NextResponse.json({ error: "Módulo não suportado." }, { status: 400 });
                }

                sucesso++;
            } catch (err) {
                erros++;
                mensagens.push(`Linha ${i + 2}: ${err instanceof Error ? err.message : "Erro de validação"}`);
            }
        }

        if (acao === "importar") {
            const statusFinal = erros === 0 ? "concluido" : sucesso > 0 ? "parcial" : "erro";
            await prisma.importacaoCSV.create({
                data: {
                    modulo,
                    arquivo: file.name,
                    origemSistema: sistemaOrigem,
                    total: rows.length,
                    sucesso,
                    ignoradosDuplicados: duplicados,
                    erros,
                    detalhesErros: JSON.stringify(mensagens.slice(0, 30)),
                    executadoPor: auth.user.nome,
                    status: statusFinal,
                },
            });

            await registrarHistoricoAlteracao({
                entidade: `ImportacaoCSV:${modulo}`,
                entidadeId: file.name,
                acao: "importacao",
                resumoAlteracao: `Importação em Lote (${modulo}) - ${file.name} | Processados: ${rows.length}, Sucesso: ${sucesso}, Duplicados: ${duplicados}, Erros: ${erros}`,
                dadosNovos: { modulo, sistemaOrigem, total: rows.length, sucesso, duplicados, erros },
                user: auth.user,
            });
        }

        return NextResponse.json({
            acao,
            colunasDetectadas: headers,
            total: rows.length,
            sucesso,
            duplicados,
            erros,
            mensagens,
            preview,
        });
    } catch (error) {
        console.error("[Importacao CSV]", error);
        return NextResponse.json({ error: "Erro ao processar arquivo CSV." }, { status: 500 });
    }
}
