"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
    FaUsers, FaMoneyBillWave, FaFileInvoiceDollar, 
    FaUserTie, FaTable, FaChevronRight, FaInfoCircle,
    FaArrowRight, FaBriefcase, FaExternalLink
} from "react-icons/fa";
import {
    FaShieldHalved, FaClockRotateLeft,
    FaCircleCheck, FaUserGroup, FaBuildingUser
} from "react-icons/fa6";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const servidoresLinks = [
    {
        title: "Folha de Pagamento",
        description: "Consulta detalhada de remunerações, proventos e descontos de todos os agentes públicos.",
        icon: <FaMoneyBillWave size={28} />,
        href: "/transparencia/servidores/folha-pagamento",
        category: "Financeiro",
        color: "emerald",
        featured: true
    },
    {
        title: "Quadro de Servidores",
        description: "Relação completa de cargos, funções e tipos de vínculo dos servidores municipais.",
        icon: <FaUsers size={24} />,
        href: "/transparencia/servidores/quadro",
        category: "Recursos Humanos",
        color: "blue"
    },
    {
        title: "Padrão Remuneratório",
        description: "Estrutura remuneratória e níveis salariais conforme legislação municipal vigente.",
        icon: <FaTable size={24} />,
        href: "/transparencia/servidores/cargos-e-salarios",
        category: "Legislação",
        color: "indigo"
    },
    {
        title: "Diárias e Passagens",
        description: "Relatórios de gastos com deslocamentos e hospedagens a serviço da municipalidade.",
        icon: <FaFileInvoiceDollar size={24} />,
        href: "/transparencia/servidores/diarias",
        category: "Despesas",
        color: "amber"
    },
    {
        title: "Agentes Políticos",
        description: "Perfil institucional, competências e atos de nomeação dos gestores municipais.",
        icon: <FaUserTie size={24} />,
        href: "/transparencia/servidores/agentes",
        category: "Institucional",
        color: "slate"
    }
];

export default function ServidoresHub() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);

    useEffect(() => {
        async function loadExternalLinks() {
            try {
                const res = await fetch("/api/links-externos");
                if (res.ok) {
                    const data = await res.json();
                    setLinksExternos(data.filter((l: any) => l.categoria === "servidores" || l.categoria === "geral" || l.categoria === "transparencia"));
                }
            } catch (error) {
                console.error("Erro ao carregar links:", error);
            }
        }
        loadExternalLinks();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Gestão de Pessoas"
                subtitle="Transparência total sobre o quadro funcional, remunerações e movimentações dos servidores públicos."
                variant="premium"
                icon={<FaUserGroup />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Servidores" }
                ]}
            />

            <motion.main 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-width-[1240px] mx-auto px-6 py-12 -mt-20 relative z-30"
            >
                {/* Featured Highlight Section */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
                    
                    {/* Primary Bento Box - Portal Info */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-blue-600/20 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Base de Dados Integrada</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-2">
                                            <FaCircleCheck className="text-emerald-400" size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Certificado LAI</span>
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-5xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">
                                    Ativos e <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">Vencimentos</span>
                                </h1>
                                <p className="text-white/40 font-medium text-lg leading-relaxed max-w-xl">
                                    Em conformidade com a Lei 12.527/11, disponibilizamos o acesso público aos dados funcionais, 
                                    financeiros e administrativos de todos os colaboradores municipais.
                                </p>
                            </div>
                            
                            <div className="mt-16 flex flex-wrap gap-12 items-center border-t border-white/5 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Atualização</span>
                                    <span className="text-2xl font-black tracking-tight uppercase italic text-blue-400">Tempo Real</span>
                                </div>
                                <div className="w-px h-12 bg-white/5 hidden md:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Padrão</span>
                                    <span className="text-2xl font-black tracking-tight uppercase italic">Federal <span className="text-white/40 font-bold uppercase italic tracking-tighter">PNTP</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Bento - Suporte */}
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100/50 flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                         <div className="relative">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner group-hover:shadow-blue-600/40">
                                <FaBuildingUser className="text-blue-300 group-hover:text-white transition-colors" size={36} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase text-balance">
                                Portal do <br/> <span className="text-blue-600">Servidor</span>
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed opacity-80">
                                Dúvidas sobre o quadro funcional ou remunerações? Acesse o canal oficial.
                            </p>
                         </div>
                         <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                            <Link href="/ouvidoria" className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-widest group/link hover:gap-5 transition-all">
                                Acessar e-SIC <FaArrowRight />
                            </Link>
                            <FaInfoCircle className="text-slate-200" size={18} />
                         </div>
                    </div>
                </motion.div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servidoresLinks.map((link, idx) => {
                        const identifier = link.href.split("/").pop()?.toLowerCase() || "";
                        const override = linksExternos.find((l: any) => 
                            l.moduloAlvo?.toLowerCase() === identifier
                        );
                        const finalHref = override ? override.url : link.href;
                        const isExternal = !!override;

                        return (
                        <motion.div
                            key={link.title}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className={`group relative h-full ${link.featured ? 'lg:col-span-1' : ''}`}
                        >
                            <Link 
                                href={finalHref} 
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="flex flex-col h-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100/50 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden group">
                                <div className="flex justify-between items-start mb-12">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-lg group-hover:rotate-6 group-hover:scale-110 ${
                                        link.color === 'emerald' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                        link.color === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' :
                                        link.color === 'indigo' ? 'bg-indigo-500 text-white shadow-indigo-500/20' :
                                        link.color === 'amber' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                                        'bg-slate-700 text-white shadow-slate-700/20'
                                    }`}>
                                        {link.icon}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${
                                        link.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        link.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        link.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                        link.color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>
                                        {link.category}
                                    </span>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-blue-600 transition-colors">
                                        {link.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {link.description}
                                    </p>
                                    
                                    <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 group-hover:gap-5 transition-all">
                                        {isExternal ? "ACESSAR MÓDULO EXTERNO" : "Ver Dados"} 
                                        {isExternal ? <FaExternalLink className="ml-2" /> : <FaChevronRight className="ml-2 group-hover:translate-x-1" />}
                                    </div>
                                </div>

                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 -z-0" />
                                
                                {isExternal && (
                                    <div className="absolute top-8 right-8">
                                        <span className="flex items-center gap-1.5 text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">
                                            <FaExternalLink size={8} /> PORTAL TERCEIRIZADO
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    )})}
                </div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            GESTÃO DE RECURSOS HUMANOS • PREFEITURA DE LAJES PINTADAS/RN <br/>
                            <span className="opacity-40 font-bold italic">Portal auditado conforme as normas da Controladoria Geral do Município.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
