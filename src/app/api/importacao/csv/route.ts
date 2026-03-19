import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const modulo = formData.get("modulo") as string;

        if (!file || !modulo) {
            return NextResponse.json({ error: "Arquivo e módulo são obrigatórios." }, { status: 400 });
        }

        const text = await file.text();
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
            return NextResponse.json({ error: "CSV vazio ou sem dados." }, { status: 400 });
        }

        const headers = lines[0].split(";").map(h => h.trim().replace(/^"(.*)"$/, "$1"));
        const rows = lines.slice(1);

        let sucesso = 0;
        let erros = 0;
        const mensagens: string[] = [];

        for (let i = 0; i < rows.length; i++) {
            const values = rows[i].split(";").map(v => v.trim().replace(/^"(.*)"$/, "$1"));
            const obj: Record<string, string | number | boolean> = {};
            headers.forEach((h, idx) => { obj[h] = values[idx] ?? ""; });

            try {
                if (modulo === "receitas") {
                    await prisma.receita.create({ data: {
                        descricao: String(obj.descricao),
                        categoria: String(obj.categoria),
                        valor: parseFloat(String(obj.valor)),
                        mes: parseInt(String(obj.mes)),
                        ano: parseInt(String(obj.ano)),
                        fonte: obj.fonte ? String(obj.fonte) : null,
                    }});
                } else if (modulo === "despesas") {
                    await prisma.despesa.create({ data: {
                        descricao: String(obj.descricao),
                        categoria: String(obj.categoria),
                        secretaria: String(obj.secretaria),
                        valor: parseFloat(String(obj.valor)),
                        mes: parseInt(String(obj.mes)),
                        ano: parseInt(String(obj.ano)),
                        fornecedor: obj.fornecedor ? String(obj.fornecedor) : null,
                    }});
                } else if (modulo === "servidores") {
                    await prisma.servidor.create({ data: {
                        nome: String(obj.nome),
                        cargo: String(obj.cargo),
                        vinculo: String(obj.vinculo || "efetivo"),
                        secretaria: String(obj.secretaria),
                        salarioBase: parseFloat(String(obj.salarioBase)),
                        totalBruto: parseFloat(String(obj.totalBruto)),
                        totalLiquido: parseFloat(String(obj.totalLiquido)),
                        mes: parseInt(String(obj.mes)),
                        ano: parseInt(String(obj.ano)),
                    }});
                } else if (modulo === "diarias") {
                    await prisma.diaria.create({ data: {
                        servidor: String(obj.servidor),
                        cargo: String(obj.cargo),
                        destino: String(obj.destino),
                        motivo: String(obj.motivo),
                        dataInicio: new Date(String(obj.dataInicio)),
                        dataFim: new Date(String(obj.dataFim)),
                        valor: parseFloat(String(obj.valor)),
                        quantidadeDias: parseInt(String(obj.quantidadeDias || "1")),
                        secretaria: String(obj.secretaria),
                        mes: parseInt(String(obj.mes)),
                        ano: parseInt(String(obj.ano)),
                    }});
                } else {
                    return NextResponse.json({ error: "Módulo não suportado." }, { status: 400 });
                }
                sucesso++;
            } catch (err) {
                erros++;
                mensagens.push(`Linha ${i + 2}: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
            }
        }

        return NextResponse.json({ total: rows.length, sucesso, erros, mensagens });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao processar arquivo." }, { status: 500 });
    }
}
