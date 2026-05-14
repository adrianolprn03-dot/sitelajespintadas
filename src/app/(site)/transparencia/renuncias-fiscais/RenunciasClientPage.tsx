"use client";
import { useState, useMemo } from "react";
import { 
    FaChartLine, FaInfoCircle, FaDownload, 
    FaCoins, FaArrowRight, FaSearch
} from "react-icons/fa";
import { FaShieldHalved, FaClockRotateLeft, FaHandHoldingDollar } from "react-icons/fa6";
import { FaExternalLink, FaFile } from "react-icons/fa";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";
import ExportButtons from "@/components/transparencia/ExportButtons";

type Renuncia = {
    id: string;
    descricao: string;
    categoria: string;
    baseLegal: string;
    valorEstimado: number;
    beneficiarios: string | null;
    vigencia: string | null;
    ano: number;
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function RenunciasClientPage({ initialData }: { initialData: Renuncia[] }) {
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => {
        if (!search) return initialData;
        const s = search.toLowerCase();
        return initialData.filter(i => 
            i.descricao.toLowerCase().includes(s) || 
            i.categoria.toLowerCase().includes(s) || 
            i.baseLegal.toLowerCase().includes(s)
        );
    }, [initialData, search]);

    const totalGeral = useMemo(() => filteredItems.reduce((s, i) => s + i.valorEstimado, 0), [filteredItems]);
    
    const categoriasAgrupadas = useMemo(() => {
        const groups: Record<string, Renuncia[]> = {};
        filteredItems.forEach(item => {
            if (!groups[item.categoria]) groups[item.categoria] = [];
            groups[item.categoria].push(item);
        });
        return Object.entries(groups).map(([categoria, itens]) => ({ categoria, itens }));
    }, [filteredItems]);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Renúncias de Receitas"
                subtitle="Demonstrativo de isenções, reduções de alíquotas, anistias e subsídios fiscais."
                variant="premium"
                icon={<FaHandHoldingDollar />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Renúncias Fiscais" }
                ]}
            />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-12 -mt-12 relative z-30"
            >
                {/* Intro & Info Banner */}
                <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-8 mb-12 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/30">
                            <FaInfoCircle size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
                                Obrigação Legal <span className="text-orange-600">– Art. 14 da LRF</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed font-medium mb-6">
                                A concessão de incentivos ou benefícios tributários deve ser acompanhada do impacto orçamentário-financeiro, garantindo o equilíbrio das contas públicas.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl text-orange-700 text-[10px] font-black uppercase tracking-widest border border-orange-100">
                                    <FaShieldHalved /> Fiscalização Ativa
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <FaClockRotateLeft /> Atualizado
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filtros e Busca */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar renúncias por descrição ou lei..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ExportButtons data={filteredItems} filename="renuncias_fiscais_lajes" />
                </motion.div>

                {/* Grid de Resumo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100 border-l-4 border-l-orange-500">
                        <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Estimado</div>
                        <div className="text-3xl font-black text-orange-600">{fmt(totalGeral)}</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
                        <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Modalidades</div>
                        <div className="text-3xl font-black text-blue-600">{categoriasAgrupadas.length}</div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 border-l-4 border-l-gray-900">
                        <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Ano Exercício</div>
                        <div className="text-3xl font-black text-gray-900">{initialData[0]?.ano || "—"}</div>
                    </div>
                </motion.div>

                {/* Listagem */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold italic">Nenhuma renúncia localizada para sua busca.</p>
                    </div>
                ) : (
                    <div className="space-y-12 mb-16">
                        {categoriasAgrupadas.map((cat, ci) => (
                            <motion.div key={ci} variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
                                        <span className="w-2 h-6 bg-orange-500 rounded-full" /> {cat.categoria}
                                    </h3>
                                    <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl border border-orange-100 font-black text-sm tracking-tighter shadow-sm">
                                        {fmt(cat.itens.reduce((s, i) => s + i.valorEstimado, 0))}
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <th className="px-10 py-6">Descrição</th>
                                                <th className="px-10 py-6">Base Legal</th>
                                                <th className="px-10 py-6 text-right">Valor Estimado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {cat.itens.map((item) => (
                                                <tr key={item.id} className="hover:bg-orange-50/30 transition-all group">
                                                    <td className="px-10 py-6 text-sm font-bold text-gray-700">{item.descricao}</td>
                                                    <td className="px-10 py-6">
                                                        <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-100">{item.baseLegal}</span>
                                                    </td>
                                                    <td className="px-10 py-6 text-right font-black text-orange-600 text-sm">{fmt(item.valorEstimado)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <BannerPNTP />
            </motion.div>
        </div>
    );
}
