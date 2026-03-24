import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function parseDecimal(value: string): number {
    if (!value || value.trim() === "") return 0;
    // Remove espaços
    let cleaned = value.trim();
    // Formato brasileiro: 1.234.567,89 → remove pontos, troca vírgula por ponto
    if (cleaned.includes(",")) {
        cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Arquivo CSV é obrigatório." }, { status: 400 });
        }

        const text = await file.text();
        const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

        if (lines.length < 2) {
            return NextResponse.json({ error: "CSV vazio ou sem dados." }, { status: 400 });
        }

        const headers = lines[0].split(";").map(h => h.trim().replace(/^"(.*)"$/, "$1").toLowerCase());
        const rows = lines.slice(1);

        let importados = 0;
        let atualizados = 0;
        let erros = 0;
        const mensagens: string[] = [];

        for (let i = 0; i < rows.length; i++) {
            const values = rows[i].split(";").map(v => v.trim().replace(/^"(.*)"$/, "$1"));

            // Verificar se a linha está totalmente vazia
            if (values.every(v => v === "")) continue;

            const obj: Record<string, string> = {};
            headers.forEach((h, idx) => {
                obj[h] = values[idx] ?? "";
            });

            try {
                const codigoEmenda = obj["codigo_emenda"] || obj["codigoemenda"] || obj["codigo"];
                if (!codigoEmenda || codigoEmenda.trim() === "") {
                    erros++;
                    mensagens.push(`Linha ${i + 2}: codigo_emenda vazio ou ausente`);
                    continue;
                }

                const data = {
                    codigoEmenda: codigoEmenda.trim(),
                    anoEmenda: parseInt(obj["ano_emenda"] || obj["ano"] || "0") || new Date().getFullYear(),
                    autorNome: obj["autor_nome"] || obj["autor"] || "Não informado",
                    numeroEmenda: obj["numero_emenda"] || obj["numero"] || null,
                    tipoEmenda: obj["tipo_emenda"] || obj["tipo"] || null,
                    objeto: obj["objeto"] || null,
                    funcaoGoverno: obj["funcao_governo"] || obj["funcao"] || null,
                    subfuncaoGoverno: obj["subfuncao_governo"] || obj["subfuncao"] || null,
                    localidade: obj["localidade"] || obj["municipio"] || null,
                    uf: obj["uf"] || null,
                    favorecidoNome: obj["favorecido_nome"] || obj["favorecido"] || null,
                    favorecidoCnpjCpf: obj["favorecido_cnpj_cpf"] || obj["favorecido_cnpj"] || obj["cnpj"] || null,
                    valorPrevisto: parseDecimal(obj["valor_previsto"] || "0"),
                    valorEmpenhado: parseDecimal(obj["valor_empenhado"] || "0"),
                    valorLiquidado: parseDecimal(obj["valor_liquidado"] || "0"),
                    valorPago: parseDecimal(obj["valor_pago"] || "0"),
                    situacaoExecucao: obj["situacao_execucao"] || obj["situacao"] || null,
                    orgaoConcedente: obj["orgao_concedente"] || null,
                    instrumentoNumero: obj["instrumento_numero"] || null,
                    planoAcaoNumero: obj["plano_acao_numero"] || null,
                    convenioNumero: obj["convenio_numero"] || null,
                    urlFonteOficial: obj["url_fonte_oficial"] || obj["url"] || null,
                    fonteDado: obj["fonte_dado"] || obj["fonte"] || "Importação CSV",
                    dataImportacao: new Date(),
                };

                // Verificar se já existe
                const existing = await prisma.emendaParlamentar.findUnique({
                    where: { codigoEmenda: data.codigoEmenda },
                });

                if (existing) {
                    await prisma.emendaParlamentar.update({
                        where: { codigoEmenda: data.codigoEmenda },
                        data,
                    });
                    atualizados++;
                } else {
                    await prisma.emendaParlamentar.create({ data });
                    importados++;
                }
            } catch (err) {
                erros++;
                mensagens.push(`Linha ${i + 2}: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
            }
        }

        return NextResponse.json({
            total: rows.length,
            importados,
            atualizados,
            erros,
            mensagens: mensagens.slice(0, 50), // Limitar mensagens de erro
        });
    } catch (error) {
        console.error("Erro ao processar CSV de emendas:", error);
        return NextResponse.json({ error: "Erro ao processar arquivo." }, { status: 500 });
    }
}
