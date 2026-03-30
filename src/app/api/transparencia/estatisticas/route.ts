import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Estatísticas da Ouvidoria
        const ouvidoriaPorTipo = await prisma.ouvidoria.groupBy({
            by: ["tipo"],
            _count: { _all: true },
        });

        const ouvidoriaPorStatus = await prisma.ouvidoria.groupBy({
            by: ["status"],
            _count: { _all: true },
        });

        // Estatísticas do e-SIC
        const esicPorOrgao = await prisma.esic.groupBy({
            by: ["orgao"],
            _count: { _all: true },
        });

        const esicPorStatus = await prisma.esic.groupBy({
            by: ["status"],
            _count: { _all: true },
        });

        const esicPorSigilo = await prisma.esic.groupBy({
            by: ["grauSigilo"],
            _count: { _all: true },
        });

        return NextResponse.json({
            ouvidoria: {
                porTipo: ouvidoriaPorTipo.map(item => ({
                    name: item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1),
                    value: item._count._all
                })),
                porStatus: ouvidoriaPorStatus.map(item => ({
                    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                    value: item._count._all
                }))
            },
            esic: {
                porOrgao: esicPorOrgao.map(item => ({
                    name: item.orgao,
                    value: item._count._all
                })),
                porStatus: esicPorStatus.map(item => ({
                    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
                    value: item._count._all
                })),
                porSigilo: esicPorSigilo.map(item => ({
                    name: item.grauSigilo,
                    value: item._count._all
                }))
            }
        });
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
