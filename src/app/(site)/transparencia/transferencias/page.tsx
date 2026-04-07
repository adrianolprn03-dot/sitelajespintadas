"use client";
import type { Metadata } from "next";
import Link from "next/link";
import { 
    FaExchangeAlt, FaExternalLinkAlt, FaInfoCircle, FaHospital, 
    FaSchool, FaMoneyCheckAlt, FaBuilding, FaSync, FaGlobeAmericas,
    FaArrowRight, FaShieldHalved
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ListaTransferenciasFederal from "@/components/transparencia/integracao/ListaTransferenciasFederal";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

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
                <motion.div variants={itemVariants} className="mb-16">
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
                            <p className="text-slate-500 leading-relaxed font-bold italic text-sm max-w-4xl">
                                Disponibilizamos canais diretos e integração em tempo real para consulta das transferências constitucionais e legais. Acesse os painéis oficiais da União e do Estado para total fidedignidade da aplicação do orçamento público.
                            </p>
                        </div>
                    </div>
                </motion.div>
                
                {/* Dashboard de Transferências Federais (CGU) - Integração Premium */}
                <motion.div variants={itemVariants} className="mb-24">
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
                            <FaMoneyCheckAlt size={160} />
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
