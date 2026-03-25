import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import EmendaPixClientPage from "./EmendaPixClientPage";
import { Info } from "lucide-react";

export const metadata: Metadata = {
    title: "Emendas PIX | Portal da Transparência",
    description: "Acompanhamento de transferências especiais (Emendas PIX) destinadas ao município.",
};

export const dynamic = "force-dynamic";

export default async function EmendaPixTransparencyPage() {
    // Busca apenas emendas do tipo Transferência Especial (conhecidas como Emendas PIX)
    const emendas = await prisma.emendaParlamentar.findMany({
        where: {
            OR: [
                { tipoEmenda: { contains: "Transferência Especial", mode: "insensitive" } },
                { fonteDado: { contains: "PIX", mode: "insensitive" } }
            ]
        },
        orderBy: [{ anoEmenda: "desc" }, { autorNome: "asc" }],
    });

    const totalPago = emendas.reduce((s, e) => s + (e.valorPago || 0), 0);
    const autoresUnicos = new Set(emendas.map(e => e.autorNome)).size;

    const ultimaImportacao = emendas.length > 0
        ? emendas.reduce((max, e) => e.dataImportacao > max ? e.dataImportacao : max, emendas[0].dataImportacao)
        : null;

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Emendas PIX"
                subtitle="Transferências especiais enviadas diretamente ao caixa do município sem finalidade definida."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Emendas PIX" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Texto institucional sobre Emenda PIX */}
                <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100 mb-12 flex flex-col md:flex-row gap-6 items-start">
                    <div className="bg-teal-600 p-4 rounded-2xl text-white shadow-lg shadow-teal-200">
                        <Info size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-teal-800 uppercase tracking-tighter mb-2">O que são Emendas PIX?</h3>
                        <p className="text-sm text-teal-700 font-medium leading-relaxed mb-4">
                            As Transferências Especiais, popularmente conhecidas como "Emendas PIX", são recursos 
                            repassados por parlamentares diretamente ao município sem a necessidade de convênio prévio. 
                            Diferente das emendas com finalidade definida, esses recursos podem ser aplicados em 
                            diversas áreas, exceto pagamento de pessoal e encargos sociais.
                        </p>
                        {ultimaImportacao && (
                            <p className="text-xs text-teal-600 font-bold">
                                Dados atualizados em: {new Date(ultimaImportacao).toLocaleDateString("pt-BR")} às {new Date(ultimaImportacao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cards Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-white">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Total Recebido (Pago)</span>
                        <h4 className="text-4xl font-black text-teal-600 tracking-tighter">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPago)}
                        </h4>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-white">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Número de Emendas</span>
                        <h4 className="text-4xl font-black text-gray-800 tracking-tighter">
                            {emendas.length}
                        </h4>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-white">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Autores Beneficiários</span>
                        <h4 className="text-4xl font-black text-blue-600 tracking-tighter">
                            {autoresUnicos}
                        </h4>
                    </div>
                </div>

                {/* Tabela interativa */}
                <EmendaPixClientPage
                    initialData={JSON.parse(JSON.stringify(emendas))}
                />
            </div>
        </div>
    );
}
