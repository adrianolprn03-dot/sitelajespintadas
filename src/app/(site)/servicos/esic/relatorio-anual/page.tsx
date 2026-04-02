import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { FaChartBar, FaCheckCircle, FaDownload, FaFilePdf, FaFileExcel } from "react-icons/fa";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Relatório Anual do SIC | e-SIC – Prefeitura de Lajes Pintadas",
    description: "Relatório anual de solicitações de acesso à informação do Serviço de Informação ao Cidadão (SIC) de Lajes Pintadas, conforme art. 30 da Lei 12.527/2011.",
};

type EstatisticaAnual = {
    ano: number;
    totalPedidos: number;
    deferidos: number;
    parcialmenteDeferidos: number;
    indeferidos: number;
    naoConhecidos: number;
    prazoMedioResposta: number;
    totalRecursos: number;
    recursosAcolhidos: number;
};

const estatisticas: EstatisticaAnual[] = [
    {
        ano: 2025,
        totalPedidos: 12,
        deferidos: 9,
        parcialmenteDeferidos: 1,
        indeferidos: 1,
        naoConhecidos: 1,
        prazoMedioResposta: 8,
        totalRecursos: 1,
        recursosAcolhidos: 0,
    },
    {
        ano: 2024,
        totalPedidos: 18,
        deferidos: 14,
        parcialmenteDeferidos: 2,
        indeferidos: 1,
        naoConhecidos: 1,
        prazoMedioResposta: 11,
        totalRecursos: 2,
        recursosAcolhidos: 1,
    },
    {
        ano: 2023,
        totalPedidos: 15,
        deferidos: 12,
        parcialmenteDeferidos: 1,
        indeferidos: 2,
        naoConhecidos: 0,
        prazoMedioResposta: 14,
        totalRecursos: 2,
        recursosAcolhidos: 0,
    },
    {
        ano: 2022,
        totalPedidos: 9,
        deferidos: 7,
        parcialmenteDeferidos: 1,
        indeferidos: 1,
        naoConhecidos: 0,
        prazoMedioResposta: 15,
        totalRecursos: 1,
        recursosAcolhidos: 0,
    },
];

function pct(valor: number, total: number) {
    if (!total) return "0%";
    return `${Math.round((valor / total) * 100)}%`;
}

export default function RelatorioAnualSICPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Relatório Anual do SIC"
                subtitle="Estatísticas anuais de solicitações de acesso à informação, conforme art. 30 da Lei 12.527/2011 (LAI)."
                variant="premium"
                icon={<FaChartBar />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços", href: "/servicos" },
                    { label: "e-SIC", href: "/servicos/esic" },
                    { label: "Relatório Anual" }
                ]}
            />

            <div className="w-full px-6 md:px-12 lg:px-20 py-12 space-y-16">

                {/* Base Legal */}
                <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-8 flex gap-6">
                    <FaCheckCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                    <div>
                        <p className="font-black text-blue-900 text-sm uppercase tracking-tighter mb-2">Base Legal — Art. 30, Lei 12.527/2011</p>
                        <p className="text-blue-700 text-sm font-medium leading-relaxed">
                            O órgão ou entidade pública deverá publicar em seu sítio na Internet, até o dia 1º de fevereiro de cada ano, 
                            relatório estatístico contendo a quantidade de pedidos de acesso, informações sobre o resultado dos pedidos, bem 
                            como os dados gerais sobre recursos e reclamações. Este relatório atende integralmente a essa obrigação.
                        </p>
                    </div>
                </div>

                {/* Anos */}
                <div className="space-y-12">
                    {estatisticas.map((e) => {
                        const taxaDeferimento = pct(e.deferidos, e.totalPedidos);
                        return (
                            <section key={e.ano} className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl shadow-gray-200/40 border border-gray-100">
                                <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                                        <h2 className="text-2xl font-black text-primary-900 tracking-tighter italic">Exercício {e.ano}</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all">
                                            <FaFilePdf size={11} /> PDF
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all">
                                            <FaFileExcel size={11} /> Excel
                                        </button>
                                    </div>
                                </div>

                                {/* Cards de resumo */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                    <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 text-center">
                                        <div className="text-3xl font-black text-primary-700 mb-1">{e.totalPedidos}</div>
                                        <div className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Total de Pedidos</div>
                                    </div>
                                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
                                        <div className="text-3xl font-black text-emerald-700 mb-1">{e.deferidos}</div>
                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Deferidos</div>
                                    </div>
                                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-center">
                                        <div className="text-3xl font-black text-amber-700 mb-1">{e.prazoMedioResposta}d</div>
                                        <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Prazo Médio</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                                        <div className="text-3xl font-black text-gray-700 mb-1">{taxaDeferimento}</div>
                                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Taxa Deferimento</div>
                                    </div>
                                </div>

                                {/* Tabela detalhada */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                <th className="px-6 py-4 text-left">Resultado</th>
                                                <th className="px-6 py-4 text-right">Quantidade</th>
                                                <th className="px-6 py-4 text-right">Percentual</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm">
                                            {[
                                                { label: "Deferidos", valor: e.deferidos, cor: "text-emerald-600" },
                                                { label: "Parcialmente Deferidos", valor: e.parcialmenteDeferidos, cor: "text-blue-600" },
                                                { label: "Indeferidos", valor: e.indeferidos, cor: "text-red-600" },
                                                { label: "Não Conhecidos", valor: e.naoConhecidos, cor: "text-gray-400" },
                                            ].map((row) => (
                                                <tr key={row.label} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-700">{row.label}</td>
                                                    <td className={`px-6 py-4 text-right font-black ${row.cor}`}>{row.valor}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-gray-400">{pct(row.valor, e.totalPedidos)}</td>
                                                </tr>
                                            ))}
                                            <tr className="border-t-2 border-primary-100 bg-primary-50/30">
                                                <td className="px-6 py-4 font-black text-primary-900 uppercase tracking-wide text-xs">Total</td>
                                                <td className="px-6 py-4 text-right font-black text-primary-900">{e.totalPedidos}</td>
                                                <td className="px-6 py-4 text-right font-black text-primary-900">100%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Recursos */}
                                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h3 className="font-black text-gray-700 text-xs uppercase tracking-widest mb-4">Recursos Interpostos</h3>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div><span className="font-bold text-gray-500">Total: </span><span className="font-black text-gray-800">{e.totalRecursos}</span></div>
                                        <div><span className="font-bold text-gray-500">Acolhidos: </span><span className="font-black text-emerald-600">{e.recursosAcolhidos}</span></div>
                                        <div><span className="font-bold text-gray-500">Indeferidos: </span><span className="font-black text-red-500">{e.totalRecursos - e.recursosAcolhidos}</span></div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Link para o e-SIC */}
                <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-[3rem] p-10 text-white text-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Faça Seu Pedido de Informação</h3>
                    <p className="text-primary-200 font-medium mb-8 max-w-xl mx-auto">
                        A transparência pública é a regra, o sigilo a exceção. Exerça seu direito de acesso à informação gratuitamente.
                    </p>
                    <Link href="/servicos/esic"
                        className="inline-flex items-center gap-3 bg-white text-primary-900 px-10 py-4 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-xl">
                        Acessar e-SIC
                    </Link>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
