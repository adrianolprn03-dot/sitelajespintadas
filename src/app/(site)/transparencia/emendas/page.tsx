import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import EmendasClientPage from "./EmendasClientPage";

export const metadata: Metadata = {
    title: "Emendas Parlamentares | Portal da Transparência",
    description: "Acompanhamento de emendas parlamentares destinadas ao município. Dados importados de bases oficiais do Governo Federal.",
};

export const dynamic = "force-dynamic";

export default async function EmendasTransparencyPage() {
    const emendas = await prisma.emendaParlamentar.findMany({
        orderBy: [{ anoEmenda: "desc" }, { autorNome: "asc" }],
    });

    const totalEmpenhado = emendas.reduce((s, e) => s + (e.valorEmpenhado || 0), 0);
    const totalLiquidado = emendas.reduce((s, e) => s + (e.valorLiquidado || 0), 0);
    const totalPago = emendas.reduce((s, e) => s + (e.valorPago || 0), 0);
    const totalPrevisto = emendas.reduce((s, e) => s + (e.valorPrevisto || 0), 0);
    const autoresUnicos = new Set(emendas.map(e => e.autorNome)).size;

    const ultimaImportacao = emendas.length > 0
        ? emendas.reduce((max, e) => e.dataImportacao > max ? e.dataImportacao : max, emendas[0].dataImportacao)
        : null;

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Emendas Parlamentares"
                subtitle="Acompanhamento de recursos destinados ao município por deputados e senadores."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Emendas Parlamentares" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Texto institucional */}
                <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 mb-12">
                    <p className="text-sm text-blue-800 font-medium leading-relaxed">
                        📋 Os dados desta página são importados a partir de bases oficiais do Governo Federal,
                        incluindo Portal da Transparência e Transferegov. Esta seção atende aos critérios do
                        Programa Nacional de Transparência Pública (PNTP).
                    </p>
                    {ultimaImportacao && (
                        <p className="text-xs text-blue-600 font-bold mt-3">
                            Última atualização em: {new Date(ultimaImportacao).toLocaleDateString("pt-BR")} às {new Date(ultimaImportacao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    )}
                </div>

                {/* Cards Resumo */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                    {[
                        { label: "Total Previsto", value: totalPrevisto, color: "text-gray-700", bg: "bg-white" },
                        { label: "Val. Empenhado", value: totalEmpenhado, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Val. Liquidado", value: totalLiquidado, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Val. Pago", value: totalPago, color: "text-indigo-600", bg: "bg-indigo-50" },
                    ].map((card) => (
                        <div key={card.label} className={`${card.bg} rounded-2xl p-6 shadow-sm border border-white`}>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{card.label}</span>
                            <h4 className={`text-xl font-black tracking-tighter ${card.color}`}>
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(card.value)}
                            </h4>
                        </div>
                    ))}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-white">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Emendas / Autores</span>
                        <h4 className="text-xl font-black text-gray-800 tracking-tighter">
                            {emendas.length} <span className="text-sm font-bold text-gray-400">/ {autoresUnicos}</span>
                        </h4>
                    </div>
                </div>

                {/* Tabela interativa (lado do cliente) */}
                <EmendasClientPage
                    initialData={JSON.parse(JSON.stringify(emendas))}
                />
            </div>
        </div>
    );
}
