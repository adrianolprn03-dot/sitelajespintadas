"use client";

import { useState, useEffect } from "react";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";
import { FaPlane, FaSearch, FaSpinner, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaFileAlt, FaDownload, FaMoneyBillWave, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    motivo: string;
    dataInicio: string;
    dataFim: string;
    valor: number;
    quantidadeDias: number;
    secretaria: string;
};

export default function DiariasPage() {
    const [items, setItems] = useState<Diaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [search, setSearch] = useState("");
    const [totalValor, setTotalValor] = useState(0);

    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());
    const meses = [
        { v: "1", l: "Janeiro" }, { v: "2", l: "Fevereiro" }, { v: "3", l: "Março" },
        { v: "4", l: "Abril" }, { v: "5", l: "Maio" }, { v: "6", l: "Junho" },
        { v: "7", l: "Julho" }, { v: "8", l: "Agosto" }, { v: "9", l: "Setembro" },
        { v: "10", l: "Outubro" }, { v: "11", l: "Novembro" }, { v: "12", l: "Dezembro" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (ano) query.append("ano", ano);
                if (mes) query.append("mes", mes);
                if (search) query.append("servidor", search);

                const res = await fetch(`/api/diarias?${query.toString()}`);
                const data = await res.json();
                setItems(data.items || []);
                setTotalValor(data.totalValor || 0);
            } catch (error) {
                console.error("Erro ao buscar diárias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ano, mes, search]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Diárias de Viagem"
                subtitle="Transparência no ressarcimento de despesas com deslocamentos de servidores a serviço do município."
                variant="premium"
                icon={<FaPlane />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Diárias" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Filtros e Resumo Premium */}
                <div className="flex flex-col lg:flex-row gap-8 mb-16 -mt-24 relative z-30">
                    <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-white flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-2">Servidor</label>
                                <div className="relative group">
                                    <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Nome do servidor..."
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-2">Ano</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                    <select
                                        className="w-full pl-14 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer"
                                        value={ano}
                                        onChange={(e) => setAno(e.target.value)}
                                    >
                                        {anos.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-2">Mês</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold appearance-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer"
                                    value={mes}
                                    onChange={(e) => setMes(e.target.value)}
                                >
                                    <option value="">Todos os meses</option>
                                    {meses.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-50">
                            <button onClick={() => exportToCSV(items, `diarias_${ano}`)} className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-100/50">
                                <FaDownload /> Exportar CSV
                            </button>
                            <button onClick={() => exportToJSON(items, `diarias_${ano}`)} className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-100/50">
                                <FaDownload /> Exportar JSON
                            </button>
                        </div>
                    </div>

                    {/* Card de Resumo */}
                    <div className="lg:w-80 bg-[#1E293B] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                        <FaMoneyBillWave className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Total Período</span>
                                </div>
                                <h4 className="text-3xl font-black tracking-tighter mb-2">{formatCurrency(totalValor)}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recursos Municipais</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    Valores referentes ao ressarcimento de despesas de viagem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listagem Estilo Premium */}
                <div className="space-y-6 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                Registros de Diárias
                            </h2>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100/50">
                            Resultados: {items.length}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-6">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                            </div>
                            <p className="font-black text-gray-300 text-[9px] uppercase tracking-[0.4em] animate-pulse">Consultando dados...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="bg-white rounded-[3.5rem] border border-dashed border-gray-200 p-24 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 text-gray-300 mb-8">
                                <FaSearch size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-3">Nenhum registro encontrado</h3>
                            <p className="text-gray-400 font-medium text-sm">Tente ajustar seus filtros ou termos de pesquisa.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((d, idx) => (
                                    <motion.div 
                                        key={d.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group bg-white rounded-[2rem] border border-gray-100 p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                            <FaUser size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100/50">
                                                    {d.cargo}
                                                </span>
                                                <span className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                                                    <FaCalendarAlt size={10} className="text-amber-500/70" /> {new Date(d.dataInicio).toLocaleDateString("pt-BR")} — {new Date(d.dataFim).toLocaleDateString("pt-BR")}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-2">
                                                {d.servidor}
                                            </h3>
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 text-xs font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <FaMapMarkerAlt className="text-blue-500" /> {d.destino}
                                                </div>
                                                <div className="flex-1 opacity-80">
                                                    {d.motivo}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-48 text-right bg-gray-50 lg:bg-transparent p-6 lg:p-0 rounded-2xl border border-gray-100 lg:border-none flex lg:flex-col items-center lg:items-end justify-between">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 lg:hidden">VALOR</p>
                                                <p className="text-2xl font-black text-blue-600 tracking-tighter">{formatCurrency(d.valor)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.quantidadeDias} {d.quantidadeDias === 1 ? "dia" : "dias"}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Rodapé Informativo Centralizado */}
                <div className="mt-32 pt-16 border-t border-gray-100 flex flex-col items-center text-center space-y-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200 relative overflow-hidden max-w-4xl w-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30 text-white">
                                <FaInfoCircle size={28} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-xl font-black uppercase tracking-tight mb-2">Transparência Ativa</h2>
                                <p className="text-blue-50 font-medium text-sm leading-relaxed">
                                    A prestação de contas de diárias é fundamental para o controle social. Qualquer cidadão pode solicitar detalhamentos via e-SIC.
                                </p>
                            </div>
                            <Link href="/servicos/esic" className="shrink-0 bg-white text-blue-700 font-black px-8 py-4 rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest text-[9px] shadow-lg">
                                Acessar e-SIC
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.4em]">Diário Oficial do Município • Portal da Transparência de Lajes Pintadas</p>
                        <div className="w-12 h-1 bg-blue-500/20 mx-auto rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
