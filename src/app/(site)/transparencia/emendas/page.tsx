import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import EmendasClientPage from "./EmendasClientPage";
import { FaCoins, FaUserTie, FaHandshake, FaChartPie, FaCalendarCheck } from "react-icons/fa";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

export const metadata: Metadata = {
    title: "Emendas Parlamentares | Portal da Transparência",
    description: "Acompanhamento de emendas parlamentares destinadas ao município de Lajes Pintadas. Dados importados de bases oficiais do Governo Federal.",
};

export const dynamic = "force-dynamic";

function fmt(v: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

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
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Emendas Parlamentares"
                subtitle="Transparência total sobre os recursos destinados ao desenvolvimento de Lajes Pintadas por emendas federais e estaduais."
                variant="premium"
                icon={<FaHandshake />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Emendas Parlamentares" },
                ]}
            />

            <div className="max-w-[1280px] mx-auto px-6 py-12 -mt-12 relative z-30">
                {/* Info & Legal Banner */}
                <div className="bg-white/60 backdrop-blur-xl border border-blue-100 rounded-[2.5rem] p-8 md:p-10 mb-12 shadow-2xl shadow-blue-500/5 flex flex-col md:flex-row items-center gap-8 group">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                        <FaChartPie size={28} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">Monitoramento Federativo</h2>
                        <p className="text-slate-500 leading-relaxed font-medium text-sm">
                            Em conformidade com o <span className="text-blue-600 font-bold">Programa Nacional de Transparência Pública (PNTP)</span>, 
                            apresentamos os dados integrados do Portal da Transparência Federal e Transferegov.
                        </p>
                    </div>
                    {ultimaImportacao && (
                        <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center shrink-0">
                            <span className="block text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Última atualização</span>
                            <div className="flex items-center gap-2 text-blue-700 font-black text-sm tracking-tighter">
                                <FaCalendarCheck className="opacity-50" />
                                {new Date(ultimaImportacao).toLocaleDateString("pt-BR")} – {new Date(ultimaImportacao).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid Summary Bento Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
                    {/* Previsto */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recurso Previsto</div>
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <FaCoins size={18} />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{fmt(totalPrevisto)}</div>
                        <div className="mt-2 h-1 w-12 bg-blue-500 rounded-full opacity-30" />
                    </div>

                    {/* Empenhado */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-emerald-200 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empenhado</div>
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                <FaCoins size={18} />
                            </div>
                        </div>
                        <div className="text-2xl font-black text-emerald-600 tracking-tighter">{fmt(totalEmpenhado)}</div>
                        <div className="mt-2 h-1 w-12 bg-emerald-500 rounded-full opacity-30" />
                    </div>

                    {/* Pago */}
                    <div className="xl:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700">
                            <FaCoins size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-6">Total Pago</div>
                            <div className="text-2xl font-black tracking-tighter">{fmt(totalPago)}</div>
                            <div className="mt-2 h-1 w-12 bg-white rounded-full opacity-40" />
                        </div>
                    </div>

                    {/* Autores */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Autores / Fontes</div>
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 transition-colors">
                                <FaUserTie size={18} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{autoresUnicos}</div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Parlamentares Distintos</div>
                    </div>

                    {/* Contagem */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between border border-slate-800">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total de Emendas</div>
                        <div className="text-4xl font-black tracking-tighter">{emendas.length}</div>
                    </div>
                </div>

                {/* Tabela interativa (Lado do Cliente) */}
                <div className="mb-20">
                    <EmendasClientPage
                        initialData={JSON.parse(JSON.stringify(emendas))}
                    />
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
