export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { protocolo, recurso, tipoBusca, instancia } = body;

        if (!protocolo || !recurso || !tipoBusca) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
        }

        if (tipoBusca === "ouvidoria") {
            const result = await prisma.ouvidoria.update({
                where: { protocolo },
                data: {
                    recurso,
                    dataRecurso: new Date(),
                    status: "em-recurso",
                },
            });
            return NextResponse.json({ success: true, data: { protocolo: result.protocolo, status: result.status } });
        } else if (tipoBusca === "esic") {
            const existing = await prisma.esic.findUnique({ where: { protocolo } });
            if (!existing) {
                return NextResponse.json({ error: "Protocolo não encontrado." }, { status: 404 });
            }

            let historico: any[] = [];
            try {
                historico = JSON.parse(existing.historicoTramitacao || "[]");
            } catch {
                historico = [];
            }

            const isSegundaInstancia = instancia === 2 || Boolean(existing.respostaRecurso);

            if (isSegundaInstancia) {
                historico.push({
                    data: new Date().toISOString(),
                    evento: "Interposição de Recurso em 2ª Instância (Prefeito / Controladoria Geral)",
                    detalhe: recurso,
                });

                const result = await prisma.esic.update({
                    where: { protocolo },
                    data: {
                        recursoSegundaInstancia: recurso,
                        dataRecursoSegunda: new Date(),
                        status: "em-recurso",
                        historicoTramitacao: JSON.stringify(historico),
                    },
                });
                return NextResponse.json({
                    success: true,
                    instancia: 2,
                    data: { protocolo: result.protocolo, status: result.status },
                });
            } else {
                historico.push({
                    data: new Date().toISOString(),
                    evento: "Interposição de Recurso em 1ª Instância (Autoridade Hierarquicamente Superior)",
                    detalhe: recurso,
                });

                const result = await prisma.esic.update({
                    where: { protocolo },
                    data: {
                        recurso,
                        dataRecurso: new Date(),
                        status: "em-recurso",
                        historicoTramitacao: JSON.stringify(historico),
                    },
                });
                return NextResponse.json({
                    success: true,
                    instancia: 1,
                    data: { protocolo: result.protocolo, status: result.status },
                });
            }
        } else {
            return NextResponse.json({ error: "Tipo de busca inválido." }, { status: 400 });
        }
    } catch (error) {
        console.error("Erro ao registrar recurso:", error);
        return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
    }
}
