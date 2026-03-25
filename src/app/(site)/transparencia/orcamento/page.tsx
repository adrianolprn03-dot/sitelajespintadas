"use client";
import { useState, useEffect } from "react";
import { FaBalanceScale, FaDownload, FaSearch, FaSpinner, FaCalendarAlt, FaFileContract, FaInfoCircle, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type Documento = {
    id: string;
    titulo: string;
    tipo: string;
    arquivo: string;
    ano: number;
    tamanho: number;
};

const TIPO_DESCRICOES = {
    "PPA": "O Plano Plurianual define as diretrizes e metas da administração pública para um período de 4 anos.",
    "LDO": "A Lei de Diretrizes Orçamentárias orienta a elaboração da Lei Orçamentária Anual (LOA) do exercício seguinte.",
    "LOA": "A Lei Orçamentária Anual estima as receitas e fixa as despesas do governo para o ano seguinte."
};

export default function OrcamentoPage() {
    const [docs, setDocs] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipo, setTipo] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());

    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 15 }, (_, i) => (currentYear - i).toString());

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (ano) query.append("ano", ano);
            if (tipo) query.append("tipo", tipo.toUpperCase()); else query.append("tipo", "LOA,LDO,PPA");
            query.append("limit", "100");

            const res = await fetch(`/api/legislacao?${query.toString()}`);
            const data = await res.json();
            
            const mappedDocs = (data.items || []).map((item: any) => ({
                id: item.id,
                titulo: item.ementa,
                tipo: item.tipo,
                arquivo: item.arquivo,
                ano: item.ano,
                tamanho: 0
            }));
            
            setDocs(mappedDocs);
        } catch (error) {
            console.error("Erro ao buscar documentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ano, tipo]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Montserrat',sans-serif]">
            {/* Header Premium */}
            <div className="bg-[#1E293B] relative overflow-hidden py-20 px-6 border-b-4 border-[#3B82F6]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-1/2" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <nav className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-3">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <FaChevronRight className="text-[8px]" />
                        <span className="text-white">LOA, LDO e PPA</span>
                    </nav>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter flex items-center gap-4"
                    >
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                            <FaBalanceScale className="text-white" />
                        </div>
                        Planejamento e Orçamento
                    </motion.h1>
                    <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
                        Instrumentos de planejamento governamental que definem as prioridades e a aplicação dos recursos públicos de Lajes Pintadas.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 pb-20">
                {/* Painel de Filtros e Card Informativo */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filtros */}
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-white flex flex-wrap items-end gap-6">
                        <div className="flex-1 min-w-[240px]">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">Tipo de Documento</label>
                            <select
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="">Todos os Instrumentos</option>
                                <option value="loa">LOA - Lei Orçamentária Anual</option>
                                <option value="ldo">LDO - Lei de Diretrizes Orçamentárias</option>
                                <option value="ppa">PPA - Plano Plurianual</option>
                            </select>
                        </div>
                        <div className="w-40">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">Exercício</label>
                            <select
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                            >
                                {anos.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={fetchData}
                            className="bg-[#1E293B] hover:bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3"
                        >
                            <FaSearch /> Filtrar
                        </button>
                    </div>

                    {/* Card PNTP Info */}
                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <FaInfoCircle className="text-blue-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">PNTP 2025</span>
                        </div>
                        <p className="text-xs font-bold leading-loose text-blue-50">
                            Dados atualizados em conformidade com o Programa Nacional de Transparência Pública.
                        </p>
                    </div>
                </div>

                {/* Seção Informativa (PNTP Requirement: Explanations) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                    {Object.entries(TIPO_DESCRICOES).map(([key, desc]) => (
                        <div key={key} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FaFileContract size={20} />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-3">{key}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Lista de Documentos */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 px-4">
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Documentos Encontrados ({docs.length})
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100"
                            >
                                <div className="relative">
                                    <FaSpinner className="animate-spin text-blue-500 text-5xl mb-6" />
                                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                                </div>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Sincronizando com a base de dados...</p>
                            </motion.div>
                        ) : docs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                                    <FaCalendarAlt size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-4">Sem registros para {ano}</h2>
                                <p className="text-slate-400 font-medium max-w-md mx-auto">
                                    Não foram encontrados documentos para o filtro selecionado. Tente buscar em um exercício diferente.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {docs.map((d, idx) => (
                                    <motion.div 
                                        key={d.id} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 border border-white shadow-xl shadow-slate-200/40 hover:border-blue-100 hover:shadow-blue-500/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-8 flex-1">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 transition-all shadow-inner">
                                                <FaFileContract size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 tracking-widest">
                                                        {d.tipo}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        Exercício {d.ano}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                                                        <FaCheckCircle size={10} /> Consolidado
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter group-hover:text-blue-600 transition-colors">{d.titulo}</h3>
                                            </div>
                                        </div>
                                        <a
                                            href={d.arquivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#1E293B] hover:bg-blue-600 text-white flex items-center gap-4 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all active:scale-95 group/btn min-w-[260px] justify-center"
                                        >
                                            <FaDownload className="group-hover/btn:-translate-y-1 transition-transform" /> 
                                            Baixar Documento
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Footer de Apoio */}
            <div className="max-w-7xl mx-auto px-6 pb-20 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-emerald-500/20">
                    <h3 className="text-2xl font-black tracking-tight mb-4">Acesso à Informação</h3>
                    <p className="text-emerald-50 font-medium mb-8 leading-relaxed">
                        Em dúvida sobre algum dado orçamentário? Nossa equipe está pronta para ajudar através dos canais oficiais.
                    </p>
                    <a href="/ouvidoria" className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-700/20">
                        Ouvidoria Municipal
                    </a>
                </div>
                <div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-500/20">
                    <h3 className="text-2xl font-black tracking-tight mb-4">Transparência Ativa</h3>
                    <p className="text-blue-50 font-medium mb-8 leading-relaxed">
                        Compromisso com o PNTP 2025 para garantir que todo cidadão tenha acesso fácil e rápido aos recursos.
                    </p>
                    <div className="flex gap-4">
                        <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Lei 12.527/11</span>
                        <span className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">LC 101/00</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
