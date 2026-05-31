"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    FaExchangeAlt, FaExternalLinkAlt, FaInfoCircle, FaHospital, 
    FaSchool, FaMoneyCheck, FaBuilding, FaSync, FaGlobeAmericas,
    FaArrowRight, FaHandsHelping, FaBook, FaCheckCircle, FaClock,
    FaExclamationTriangle, FaChevronRight
} from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ListaTransferenciasFederal from "@/components/transparencia/integracao/ListaTransferenciasFederal";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type TransferenciaConselho = {
    id: string;
    tipoConselho: string;
    nomeConselho: string;
    mes: number;
    ano: number;
    valorRepasse: number;
    natureza: string;
    fonteRecurso: string;
    statusPrestacao: string;
};

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const CONSELHOS_CONFIG = [
    {
        tipo: "saude",
        titulo: "Conselho de Saúde",
        sigla: "CMS",
        Icon: FaHospital,
        cor: "from-blue-500 to-cyan-600",
        corBg: "bg-blue-50",
        corTexto: "text-blue-600",
        corBorda: "border-blue-200",
        corHover: "hover:border-blue-300 hover:shadow-blue-100",
        descricao: "Repasses do Fundo Municipal de Saúde para custeio, investimento e vigilância em saúde.",
    },
    {
        tipo: "fundeb",
        titulo: "Conselho do FUNDEB",
        sigla: "FUNDEB",
        Icon: FaBook,
        cor: "from-amber-500 to-orange-600",
        corBg: "bg-amber-50",
        corTexto: "text-amber-600",
        corBorda: "border-amber-200",
        corHover: "hover:border-amber-300 hover:shadow-amber-100",
        descricao: "Recursos do FUNDEB destinados à valorização do magistério e manutenção da rede de ensino.",
    },
    {
        tipo: "assistencia_social",
        titulo: "Assistência Social",
        sigla: "CMAS",
        Icon: FaHandsHelping,
        cor: "from-violet-500 to-purple-600",
        corBg: "bg-violet-50",
        corTexto: "text-violet-600",
        corBorda: "border-violet-200",
        corHover: "hover:border-violet-300 hover:shadow-violet-100",
        descricao: "Repasses do FMAS para serviços de proteção social básica e especial à população vulnerável.",
    },
];

function StatusBadge({ status }: { status: string }) {
    if (status === "regular") return (
        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <FaCheckCircle size={8} /> Regular
        </span>
    );
    if (status === "pendente") return (
        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <FaClock size={8} /> Pendente
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
            <FaExclamationTriangle size={8} /> Irregular
        </span>
    );
}

function CardsConselhos() {
    const [dados, setDados] = useState<{
        totais: { tipoConselho: string; _sum: { valorRepasse: number | null }; _count: { id: number } }[];
        ultimoSaude: TransferenciaConselho | null;
        ultimoFundeb: TransferenciaConselho | null;
        ultimoAssistencia: TransferenciaConselho | null;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/transferencias-conselhos")
            .then(r => r.json())
            .then(d => { setDados(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const getTotal = (tipo: string) => {
        const t = dados?.totais?.find(t => t.tipoConselho === tipo);
        return t?._sum?.valorRepasse || 0;
    };
    const getCount = (tipo: string) => {
        const t = dados?.totais?.find(t => t.tipoConselho === tipo);
        return t?._count?.id || 0;
    };
    const getUltimo = (tipo: string) => {
        if (tipo === "saude") return dados?.ultimoSaude;
        if (tipo === "fundeb") return dados?.ultimoFundeb;
        return dados?.ultimoAssistencia;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONSELHOS_CONFIG.map((c) => {
                const total = getTotal(c.tipo);
                const count = getCount(c.tipo);
                const ultimo = getUltimo(c.tipo);

                return (
                    <div key={c.tipo} className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${c.corHover}`}>
                        {/* Gradiente top */}
                        <div className={`h-2 bg-gradient-to-r ${c.cor}`} />

                        <div className="p-8">
                            {/* Ícone e título */}
                            <div className="flex items-start justify-between mb-5">
                                <div className={`w-14 h-14 bg-gradient-to-br ${c.cor} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <c.Icon size={24} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${c.corTexto} ${c.corBg} border ${c.corBorda} px-2.5 py-1 rounded-full`}>
                                    {c.sigla}
                                </span>
                            </div>

                            <h3 className="font-black text-slate-800 text-base uppercase tracking-tighter mb-2 group-hover:text-slate-900 transition-colors">
                                {c.titulo}
                            </h3>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                                {c.descricao}
                            </p>

                            {/* Dados financeiros */}
                            {loading ? (
                                <div className="animate-pulse space-y-2">
                                    <div className="h-7 bg-gray-100 rounded-xl w-2/3" />
                                    <div className="h-4 bg-gray-100 rounded-xl w-1/2" />
                                </div>
                            ) : total > 0 ? (
                                <div className="space-y-4">
                                    <div className={`${c.corBg} border ${c.corBorda} rounded-2xl p-4`}>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            Total Repassado ({new Date().getFullYear()})
                                        </div>
                                        <div className={`text-xl font-black ${c.corTexto}`}>{fmt(total)}</div>
                                        <div className="text-[9px] text-slate-400 font-bold mt-0.5">{count} repasse(s) registrado(s)</div>
                                    </div>

                                    {ultimo && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Último repasse</div>
                                                <div className="text-xs font-black text-slate-700">
                                                    {fmt(ultimo.valorRepasse)} · {MESES[ultimo.mes - 1]}/{ultimo.ano}
                                                </div>
                                            </div>
                                            <StatusBadge status={ultimo.statusPrestacao} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Nenhum repasse registrado em {new Date().getFullYear()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer do card */}
                        <div className={`px-8 py-4 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between`}>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PNTP 2026</span>
                            <span className={`flex items-center gap-1 text-[9px] font-black ${c.corTexto} uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>
                                Ver detalhes <FaChevronRight size={8} />
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function TransferenciasPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Transferências e Repasses"
                subtitle="Acompanhe os recursos fiscais, constitucionais e legais repassados pela União e pelo Estado ao nosso município."
                variant="premium"
                icon={<FaExchangeAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transferências" }
                ]}
            />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1280px] mx-auto px-6 py-12 -mt-12 relative z-30"
            >
                {/* Intro Bento Box - Premium Context */}
                <motion.div variants={itemVariants} className="mb-10">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 lg:p-12 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                            <FaGlobeAmericas size={240} />
                        </div>
                        
                        <div className="w-24 h-24 shrink-0 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 relative z-10">
                            <FaExchangeAlt size={40} />
                        </div>
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Transparência Ativa</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Lei Complementar 131/2009</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4 leading-none">Recursos Externos Aplicados</h2>
                            <p className="text-slate-500 leading-relaxed font-bold italic text-sm max-w-4xl mb-6">
                                Disponibilizamos canais diretos e integração em tempo real para consulta das transferências constitucionais e legais. Acesse os painéis oficiais da União e do Estado para total fidedignidade da aplicação do orçamento público.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="#conselhos" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-colors shadow-lg shadow-violet-500/20">
                                    <FaHandsHelping size={12} /> Repasses aos Conselhos
                                </a>
                                <a href="#cgu" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-colors">
                                    <FaExchangeAlt size={12} /> Sincronização CGU
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ===== REPASSES AOS CONSELHOS MUNICIPAIS – PNTP 2026 ===== */}
                <motion.div id="conselhos" variants={itemVariants} className="mb-24 scroll-mt-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-4">
                                <span className="w-8 h-1 bg-violet-600 rounded-full" /> Repasses aos Conselhos Municipais
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-12">
                                Conselho de Saúde · FUNDEB · Assistência Social · PNTP 2026
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-violet-50 text-violet-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-violet-100 shadow-sm">
                            <FaHandsHelping size={12} /> Transparência Ativa – PNTP 2026
                        </div>
                    </div>
                    <CardsConselhos />
                </motion.div>

                {/* Dashboard de Transferências Federais (CGU) - Integração Premium */}
                <motion.div id="cgu" variants={itemVariants} className="mb-24 scroll-mt-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em] flex items-center gap-4">
                                <span className="w-12 h-1 bg-blue-600 rounded-full" /> Sincronização CGU (União)
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-16 italic">Repasses federais consolidados em tempo real</p>
                        </div>
                        <div className="flex items-center gap-4 bg-emerald-50 text-emerald-700 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-xl shadow-emerald-700/5 transition-all hover:scale-105 duration-500">
                            <FaSync className="animate-spin-slow" /> Repasses da União Sincronizados
                        </div>
                    </div>
                    
                    <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-1 border border-slate-100/50 shadow-inner">
                        <ListaTransferenciasFederal />
                    </div>
                </motion.div>

                {/* Hub de Portais Externos - Bento Grid Premium */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {/* Governo Federal */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50 hover:shadow-emerald-500/10 transition-all duration-700 hover:border-emerald-100 group flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-bl-[10rem] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20">
                                    <FaBuilding size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-800 uppercase tracking-tighter">Portal da União</h3>
                                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">Dados Consolidados CGU</p>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-500 mb-10 flex-1 font-bold italic leading-relaxed">
                                Repasses constitucionais: FPM, Fundeb, ITR e Royalties. Acesso direto ao histórico completo do Governo Federal.
                            </p>
                            
                            <a 
                                href="https://portaldatransparencia.gov.br/transferencias" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-16 flex items-center justify-between bg-slate-900 hover:bg-emerald-600 text-white font-black px-8 rounded-2xl transition-all duration-500 shadow-xl shadow-slate-200 text-[10px] uppercase tracking-widest group/btn"
                            >
                                Acessar Portal CGU <FaExternalLinkAlt className="group-hover/btn:rotate-12 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* FNS / Saúde */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50 hover:shadow-blue-500/10 transition-all duration-700 hover:border-blue-100 group flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                                    <FaHospital size={24} />
                                </div>
                                <h3 className="font-black text-lg text-slate-800 uppercase tracking-tighter">Fundo Saúde</h3>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-10 flex-1 font-bold italic leading-relaxed">
                                Blocos de custeio e investimento do Fundo Nacional de Saúde (FNS).
                            </p>
                            
                            <a 
                                href="https://portalfns.saude.gov.br/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-14 flex items-center justify-between bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-black px-6 rounded-2xl transition-all border border-slate-100 hover:border-blue-200 text-[9px] uppercase tracking-widest"
                            >
                                Acessar FNS <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>

                    {/* FNDE / Educação */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50 hover:shadow-amber-500/10 transition-all duration-700 hover:border-amber-100 group flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[5rem] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20">
                                    <FaSchool size={24} />
                                </div>
                                <h3 className="font-black text-lg text-slate-800 uppercase tracking-tighter">FNDE Educ.</h3>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-10 flex-1 font-bold italic leading-relaxed">
                                Merenda, Transporte Escolar, PDDE e recursos do Caminho da Escola.
                            </p>
                            
                            <a 
                                href="https://www.fnde.gov.br/liberacaoderecursos/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-14 flex items-center justify-between bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-black px-6 rounded-2xl transition-all border border-slate-100 hover:border-amber-200 text-[9px] uppercase tracking-widest"
                            >
                                Acessar FNDE <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Emendas e Alerta Legal */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Emendas Parlamentares - Destaque */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-10 lg:p-12 text-white shadow-2xl shadow-indigo-900/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                            <FaMoneyCheck size={160} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Painel de Investimentos Externos</span>
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Emendas Parlamentares</h3>
                            <p className="text-indigo-100/60 leading-relaxed font-bold italic text-sm mb-10 max-w-2xl">
                                Detalhamento dos recursos indicados por Deputados e Senadores para aplicação direta no município de Lajes Pintadas.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a 
                                    href="https://portaldatransparencia.gov.br/emendas" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-16 inline-flex items-center gap-4 bg-white text-slate-900 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl group/btn"
                                >
                                    Ver Painel Completo <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                                <Link 
                                    href="/transparencia/emendas" 
                                    className="h-16 inline-flex items-center gap-4 bg-indigo-500/20 backdrop-blur-md text-white px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500/40 transition-all border border-indigo-400/20"
                                >
                                    Filtro Local Municipal
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Nota de Segurança/Legalidade */}
                    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group">
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                            <FaShieldHalved className="text-blue-600" size={32} />
                        </div>
                        <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg mb-4">Conformidade Legal</h4>
                        <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed">
                            Direcionamos o cidadão aos painéis originais da União/Estado conforme o Art. 48 da LC 101/00, garantindo fidedignidade absoluta.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                            <FaInfoCircle /> Base de Dados Atualizada
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                </motion.div>
            </motion.div>
        </div>
    );
}
