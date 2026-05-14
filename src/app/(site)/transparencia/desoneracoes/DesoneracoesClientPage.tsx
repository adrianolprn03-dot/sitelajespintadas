"use client";
import { useState, useMemo } from "react";
import { FaPercentage, FaInfoCircle, FaFile, FaSearch } from "react-icons/fa";
import { TrendingDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import ExportButtons from "@/components/transparencia/ExportButtons";

type Desoneracao = {
    id: string;
    tipo: string;
    beneficiario: string | null;
    fundamentoLegal: string;
    valorRenunciado: number;
    vigencia: string | null;
    beneficiadosCount: string | null;
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DesoneracoesClientPage({ initialData }: { initialData: Desoneracao[] }) {
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => {
        if (!search) return initialData;
        const s = search.toLowerCase();
        return initialData.filter(i => 
            i.tipo.toLowerCase().includes(s) || 
            (i.beneficiario && i.beneficiario.toLowerCase().includes(s)) ||
            i.fundamentoLegal.toLowerCase().includes(s)
        );
    }, [initialData, search]);

    const totalRenunciado = filteredItems.reduce((s, d) => s + d.valorRenunciado, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Desonerações e Incentivos Fiscais"
                subtitle="Transparência sobre isenções, anistias e demais renúncias tributárias concedidas pelo município."
                variant="premium"
                icon={<TrendingDown />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Desonerações Fiscais" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Aviso Legal */}
                <div className="bg-teal-50 border border-teal-100 rounded-[2rem] p-6 mb-10 flex items-start gap-4 shadow-sm">
                    <FaInfoCircle className="text-teal-500 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="font-black text-teal-800 text-sm uppercase tracking-wide mb-1">Base Legal – LRF / LAI / PNTP</p>
                        <p className="text-teal-700 text-sm font-medium leading-relaxed">
                            A publicação das renúncias de receita é exigida pela LRF. Toda renúncia deve ser acompanhada de estimativa de impacto e medidas de compensação.
                        </p>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar desonerações..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ExportButtons data={filteredItems} filename="desoneracoes_fiscais_lajes" />
                </div>

                {/* Totalizadores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-teal-100 border-l-4 border-l-teal-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Renúncia Estimada</div>
                        <div className="text-2xl font-black text-teal-600">{fmt(totalRenunciado)}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Modalidades Ativas</div>
                        <div className="text-2xl font-black text-blue-600">{filteredItems.length}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-100 border-l-4 border-l-purple-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Referência</div>
                        <div className="text-2xl font-black text-purple-600">{filteredItems[0]?.vigencia || new Date().getFullYear()}</div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-12">
                    <div className="px-10 py-8 border-b border-gray-100 flex items-center gap-3">
                        <FaPercentage className="text-teal-500" size={20} />
                        <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Relação de Benefícios Tributários</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Tipo de Benefício</th>
                                    <th className="px-8 py-5">Beneficiários</th>
                                    <th className="px-8 py-5">Fundamento Legal</th>
                                    <th className="px-8 py-5 text-right">Valor Estimado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic">Nenhum registro localizado.</td>
                                    </tr>
                                ) : (
                                    filteredItems.map((d) => (
                                        <tr key={d.id} className="hover:bg-teal-50/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                                                        <FaPercentage size={12} />
                                                    </div>
                                                    <span className="font-black text-gray-800 text-sm group-hover:text-teal-700 transition-colors">{d.tipo}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm text-gray-600 font-medium">{d.beneficiario || "Geral"}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-[10px] font-mono text-gray-700">
                                                    <FaFile size={10} className="text-gray-400" /> {d.fundamentoLegal}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="font-black text-teal-600 text-sm">{fmt(d.valorRenunciado)}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
