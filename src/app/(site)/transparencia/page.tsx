"use client";

import Link from "next/link";
import { 
    TrendingUp, BarChart3, Gavel, FileSignature, Handshake, 
    Plane, Users, FileBarChart, Scale, Database, Construction, 
    Users2, ClipboardList, HelpCircle, BookOpen, Files, 
    Building2, UserCircle2, MapPinned, Truck, Stethoscope as StethoscopeIcon, 
    Globe2, IdCard, ExternalLink, Globe, ArrowRight, Check,
    Headset, Mail, FileText, QrCode, ScrollText, AlertTriangle,
    Briefcase, Landmark, Info, FileStack, Activity, ListOrdered,
    CalendarClock, PhoneCall, Link2, MonitorPlay, ShieldCheck, HeartPulse,
    Search, Sparkles, ShieldAlert, FileSearch, Coins, Receipt,
    Stethoscope, Building, Heart,
    Calendar, Phone, LayoutGrid, ClipboardCheck,
    BarChart, HardHat, GraduationCap,
    Map, Pill, Shield, Lock, FileClock,
    UserPlus, UserCheck, FileJson, BadgeCheck,
    FilePieChart, Presentation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState } from "react";

const categoriasDeModulos = [
    {
        tituloCategoria: "Controle e Participação",
        desc: "Canais diretos de comunicação e consulta aos serviços públicos municipais.",
        modulos: [
            { icon: ClipboardList, titulo: "E-SIC", desc: "Acesso à Informação.", href: "/servicos/esic", cor: "from-amber-600 to-orange-700", badge: "LAI" },
            { icon: Headset, titulo: "Ouvidoria", desc: "Denúncias e sugestões.", href: "/servicos/ouvidoria", cor: "from-blue-600 to-cyan-600", badge: "FALA.BR" },
            { icon: ShieldCheck, titulo: "Integridade", desc: "Programa de Ética.", href: "/transparencia/integridade", cor: "from-emerald-600 to-teal-700", badge: "GOVERNANÇA" },
            { icon: MapPinned, titulo: "Serviços", desc: "Carta de Serviços.", href: "/transparencia/carta-servicos", cor: "from-purple-600 to-indigo-700", badge: "CIDADÃO" },
            { icon: HelpCircle, titulo: "FAQ", desc: "Dúvidas Frequentes.", href: "/transparencia/faq", cor: "from-slate-600 to-slate-800", badge: "AJUDA" },
            { icon: BookOpen, titulo: "Glossário", desc: "Termos da Gestão.", href: "/transparencia/glossario", cor: "from-indigo-500 to-blue-600", badge: "TERMOS" },
        ]
    },
    {
        tituloCategoria: "Finanças e Planejamento",
        desc: "Acompanhamento detalhado da execução orçamentária e financeira em tempo real.",
        modulos: [
            { icon: Coins, titulo: "Receitas", desc: "Arrecadação Municipal.", href: "/transparencia/receitas", cor: "from-emerald-500 to-teal-600", badge: "RECEITA" },
            { icon: Receipt, titulo: "Despesas", desc: "Gastos e Empenhos.", href: "/transparencia/despesas", cor: "from-blue-600 to-indigo-700", badge: "GASTOS" },
            { icon: Landmark, titulo: "Orçamento", desc: "LOA, LDO e PPA.", href: "/transparencia/orcamento", cor: "from-slate-800 to-slate-950", badge: "PLANEJAMENTO" },
            { icon: ListOrdered, titulo: "Pagamentos", desc: "Ordem Cronológica.", href: "/transparencia/ordem-cronologica", cor: "from-amber-500 to-orange-600", badge: "TESOURARIA" },
            { icon: Database, titulo: "Repasses", desc: "Transferências Legais.", href: "/transparencia/transferencias", cor: "from-indigo-600 to-violet-700", badge: "RECURSOS" },
            { icon: Globe2, titulo: "Emendas Parlamentares", desc: "Recursos Externos.", href: "/transparencia/emendas", cor: "from-teal-600 to-emerald-800", badge: "EXTERNO" },
            { icon: Coins, titulo: "Emendas PIX", desc: "Transferências Diretas.", href: "/transparencia/emenda-pix", cor: "from-pink-600 to-rose-700", badge: "PIX" },
        ]
    },
    {
        tituloCategoria: "Contratações e Pessoal",
        desc: "Transparência sobre processos licitatórios, contratos firmados e quadro de servidores.",
        modulos: [
            { icon: Gavel, titulo: "Licitações", desc: "Certames e Editais.", href: "/transparencia/licitacoes", cor: "from-orange-600 to-red-700", badge: "COMPRAS" },
            { icon: FileSignature, titulo: "Contratos", desc: "Ajustes e Aditivos.", href: "/transparencia/contratos", cor: "from-blue-700 to-indigo-800", badge: "ATOS" },
            { icon: FileStack, titulo: "Atas de Registro", desc: "Preços Registrados.", href: "/transparencia/atas-registro", cor: "from-purple-600 to-violet-800", badge: "SRP" },
            { icon: Users, titulo: "Servidores", desc: "Folha de Pagamento.", href: "/transparencia/servidores", cor: "from-slate-700 to-slate-900", badge: "PESSOAL" },
            { icon: Plane, titulo: "Diárias", desc: "Viagens e Passagens.", href: "/transparencia/diarias", cor: "from-sky-500 to-blue-600", badge: "DESPESA" },
            { icon: GraduationCap, titulo: "Concursos", desc: "Editais e Provas.", href: "/transparencia/concursos", cor: "from-indigo-600 to-blue-700", badge: "SELEÇÃO" },
            { icon: UserCheck, titulo: "Processo Seletivo", desc: "Vagas Temporárias.", href: "/transparencia/processo-seletivo", cor: "from-teal-600 to-emerald-700", badge: "PSS" },
        ]
    },
    {
        tituloCategoria: "Saúde e Bem-Estar",
        desc: "Gestão da saúde pública, investimentos e infraestrutura de atendimento.",
        modulos: [
            { icon: Stethoscope, titulo: "Saúde", desc: "Portal da Saúde.", href: "/transparencia/saude", cor: "from-rose-500 to-red-600", badge: "MUNICIPAL" },
            { icon: Building2, titulo: "Unidades de Saúde", desc: "Relação de UBS/Hospitais.", href: "/unidades-de-saude", cor: "from-blue-500 to-cyan-600", badge: "LOCAIS" },
            { icon: Pill, titulo: "Medicamentos SUS", desc: "Lista e Estoque.", href: "/transparencia/medicamentos-sus", cor: "from-emerald-500 to-teal-600", badge: "FARMÁCIA" },
            { icon: Activity, titulo: "Central Regulação", desc: "Filas e Agendamentos.", href: "/transparencia/central-regulacao", cor: "from-orange-500 to-amber-600", badge: "FILAS" },
            { icon: HeartPulse, titulo: "Plano de Saúde", desc: "Diretrizes Municipais.", href: "/transparencia/plano-saude", cor: "from-pink-500 to-rose-600", badge: "PLANO" },
            { icon: GraduationCap, titulo: "Plano Educação", desc: "Diretrizes do Ensino.", href: "/transparencia/plano-educacao", cor: "from-amber-600 to-orange-700", badge: "POLÍTICAS" },
        ]
    },
    {
        tituloCategoria: "Responsabilidade e Gestão",
        desc: "Relatórios de gestão, fiscalização, obras e patrimônio público.",
        modulos: [
            { icon: BarChart3, titulo: "LRF", desc: "Responsabilidade Fiscal.", href: "/transparencia/lrf", cor: "from-slate-700 to-slate-900", badge: "LEGAL" },
            { icon: FilePieChart, titulo: "PCG / PCS", desc: "Pareceres de Gestão.", href: "/transparencia/pcg", cor: "from-indigo-600 to-purple-700", badge: "TCE/RN" },
            { icon: Scale, titulo: "Julgamento Contas", desc: "Pareceres das Contas.", href: "/transparencia/julgamento-contas", cor: "from-amber-700 to-orange-800", badge: "CAMARA" },
            { icon: Construction, titulo: "Obras", desc: "Fiscalização de Obras.", href: "/transparencia/obras", cor: "from-amber-600 to-orange-800", badge: "INFRA" },
            { icon: Truck, titulo: "Frota", desc: "Veículos Municipais.", href: "/transparencia/frota", cor: "from-blue-600 to-indigo-700", badge: "TRANSPORTE" },
            { icon: Landmark, titulo: "Dívida Ativa", desc: "Créditos Municipais.", href: "/transparencia/divida-ativa", cor: "from-red-600 to-slate-900", badge: "FINANÇAS" },
            { icon: FileSearch, titulo: "PCP", desc: "Prestação de Contas.", href: "/transparencia/pcs", cor: "from-emerald-600 to-green-800", badge: "GESTÃO" },
        ]
    },
    {
        tituloCategoria: "Legislação e Normas",
        desc: "Base legal, decretos, portarias e regulamentações municipais.",
        modulos: [
            { icon: Files, titulo: "Leis", desc: "Legislação Municipal.", href: "/transparencia/leis", cor: "from-indigo-600 to-purple-700", badge: "LEGAL" },
            { icon: FileText, titulo: "Decretos", desc: "Atos do Executivo.", href: "/transparencia/decretos", cor: "from-slate-600 to-slate-800", badge: "ATOS" },
            { icon: ScrollText, titulo: "Portarias", desc: "Atos Administrativos.", href: "/transparencia/portarias", cor: "from-blue-600 to-blue-800", badge: "ADMIN" },
            { icon: ShieldCheck, titulo: "LGPD", desc: "Proteção de Dados.", href: "/transparencia/lgpd", cor: "from-emerald-500 to-green-700", badge: "PRIVACIDADE" },
            { icon: Presentation, titulo: "Dados Abertos", desc: "Exportação de Dados.", href: "/transparencia/dados-abertos", cor: "from-orange-500 to-amber-600", badge: "OPEN-DATA" },
            { icon: Search, titulo: "Radar", desc: "Índice Transparência.", href: "/transparencia/radar", cor: "from-blue-800 to-slate-900", badge: "PNTP" },
        ]
    }
];

export default function TransparenciaPage() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function loadExternalLinks() {
            try {
                const res = await fetch("/api/links-externos");
                if (res.ok) {
                    const data = await res.json();
                    setLinksExternos(data.filter((l: any) => l.categoria === "transparencia" || l.categoria === "geral"));
                }
            } catch (error) {
                console.error("Erro ao carregar links:", error);
            }
        }
        loadExternalLinks();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    // Filter modules based on search
    const filteredCategories = categoriasDeModulos.map(cat => ({
        ...cat,
        modulos: cat.modulos.filter(m => 
            m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.badge.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.modulos.length > 0);

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Portal da Transparência"
                subtitle="Acesso integral aos dados públicos, fiscalização social e prestação de contas de Lajes Pintadas/RN."
                variant="premium"
                icon={<Landmark className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência" }
                ]}
            />

            {/* Hub Hero Search & Compliance */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-40 pb-20">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[3rem] p-1 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-16 overflow-hidden"
                >
                    <div className="flex flex-col lg:flex-row items-stretch">
                        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Busca Inteligente</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                                O que você deseja <br/><span className="text-slate-400 italic">consultar hoje?</span>
                            </h1>
                            <div className="relative group max-w-2xl">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors">
                                    <Search size={24} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Folha de Pagamento, Licitações, Receitas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] pl-16 pr-8 py-7 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-8 focus:ring-orange-600/5 focus:bg-white transition-all shadow-inner"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <span className="hidden md:flex bg-slate-200 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">TRANSPARÊNCIA MUNICIPAL</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[400px] bg-slate-900 p-12 text-white relative flex flex-col justify-between overflow-hidden">
                             <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                             <div className="relative z-10">
                                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-10 border-l-2 border-orange-600 pl-4">Conformidade Legal</div>
                                 <div className="space-y-6">
                                     {[
                                         { label: "LAI - LEI 12.527/2011", status: "Auditado" },
                                         { label: "LC 131/2009 (CAPIBERIBE)", status: "Ativo" },
                                         { label: "RADAR TRANSPARÊNCIA", status: "GOLD" },
                                         { label: "PNTP 2025 COMPLIANCE", status: "V2" },
                                     ].map((item) => (
                                         <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-4 group/item cursor-default hover:border-orange-600/30 transition-colors">
                                             <span className="text-[10px] font-black tracking-widest text-white/50 group-hover/item:text-white transition-colors">{item.label}</span>
                                             <Check className="text-emerald-400" size={12} />
                                         </div>
                                     ))}
                                 </div>
                             </div>
                             <div className="relative z-10 mt-12">
                                 <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                     <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shrink-0">
                                         <ShieldAlert size={20} />
                                     </div>
                                     <p className="text-[9px] font-bold text-white/60 leading-tight uppercase tracking-widest">Dados atualizados conforme periodicidade legal.</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </motion.div>

                {/* Categories & Modules Grid */}
                <div className="space-y-32">
                    {filteredCategories.map((categoria, catIdx) => (
                        <motion.section 
                            key={categoria.tituloCategoria}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={containerVariants}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-slate-100 pb-12">
                                <div className="max-w-2xl">
                                    <motion.div variants={itemVariants} className="flex items-center gap-4 mb-5">
                                        <span className="px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20">0{catIdx + 1}</span>
                                        <div className="h-0.5 w-12 bg-orange-600 rounded-full" />
                                    </motion.div>
                                    <motion.h2 variants={itemVariants} className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none italic">
                                        {categoria.tituloCategoria}
                                    </motion.h2>
                                    <motion.p variants={itemVariants} className="text-slate-400 font-bold uppercase tracking-widest text-[11px] max-w-md leading-relaxed opacity-70">
                                        {categoria.desc}
                                    </motion.p>
                                </div>
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <FileSearch size={14} className="text-orange-600" /> {categoria.modulos.length} Módulos Integrados
                                    </div>
                                </motion.div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {categoria.modulos.map((m, idx) => {
                                    const identifier = m.href.split("/").pop()?.toLowerCase() || "";
                                    const override = linksExternos.find((l: any) => 
                                        l.moduloAlvo?.toLowerCase() === identifier
                                    );
                                    const finalHref = override ? override.url : m.href;
                                    const isExternal = !!override;

                                    return (
                                        <motion.div
                                            key={m.href}
                                            variants={itemVariants}
                                            whileHover={{ y: -10, transition: { duration: 0.4 } }}
                                        >
                                            <Link 
                                                href={finalHref} 
                                                target={isExternal ? "_blank" : undefined}
                                                rel={isExternal ? "noopener noreferrer" : undefined}
                                                className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(51,65,85,0.15)] hover:border-orange-600/20 transition-all duration-700 overflow-hidden"
                                            >
                                                {/* Header Visuality */}
                                                <div className={`h-24 bg-gradient-to-br ${m.cor} relative p-6 flex items-start justify-end`}>
                                                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
                                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 group-hover:scale-150 transition-all duration-1000">
                                                        <m.icon size={120} strokeWidth={1} />
                                                    </div>
                                                    <span className="relative z-10 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-white border border-white/20 shadow-sm">
                                                        {m.badge}
                                                    </span>
                                                </div>

                                                {/* Floating Icon */}
                                                <div className="absolute top-12 left-8 transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-110">
                                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-50 group-hover:shadow-orange-600/20 transition-all">
                                                        <m.icon className="text-slate-900 group-hover:text-orange-600 transition-colors" size={28} />
                                                    </div>
                                                </div>

                                                <div className="px-8 pt-10 pb-8 flex flex-col flex-1">
                                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors tracking-tighter leading-none mb-4 uppercase">
                                                        {m.titulo}
                                                    </h3>
                                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-80 grow line-clamp-3">
                                                        {m.desc}
                                                    </p>

                                                    <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                            ACESSAR BASE
                                                        </span>
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-all duration-500 group-hover:rotate-[360deg] shadow-inner group-hover:shadow-xl group-hover:shadow-slate-900/30">
                                                            <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {isExternal && (
                                                    <div className="absolute bottom-4 left-8">
                                                        <span className="flex items-center gap-1.5 text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                                            <ExternalLink size={8} /> PORTAL TERCEIRIZADO
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>

            {/* Hub Footer - Ultra Premium */}
            <div className="relative py-32 overflow-hidden bg-slate-950 border-t border-slate-900">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-orange-600/10 rounded-full blur-[150px]" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                             <div className="flex items-center gap-4 mb-10">
                                <Landmark className="text-white" size={48} />
                                <div className="h-10 w-px bg-white/10" />
                                <div className="text-left">
                                    <div className="text-white font-black text-lg uppercase tracking-[0.3em] leading-none mb-1">Portal da Transparência</div>
                                    <div className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">Lajes Pintadas - RN</div>
                                </div>
                            </div>
                            <h4 className="text-3xl font-black text-white tracking-tighter uppercase mb-6 italic">
                                Compromisso com o <br/> <span className="text-orange-600">Controle Social Ativo.</span>
                            </h4>
                            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose max-w-lg mb-12 italic border-l border-white/10 pl-8">
                                Em conformidade integral com as exigências do <span className="text-white/60">Programa Nacional de Transparência Pública (PNTP)</span>, asseguramos o livre acesso às informações institucionais e financeiras para todo cidadão.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/contato" className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-slate-950 transition-all active:scale-95 shadow-2xl">Suporte à Decisão</Link>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-[3rem] p-12 border border-white/5 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <ShieldCheck size={160} className="text-white" />
                            </div>
                            <h5 className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Certificações de Acesso
                            </h5>
                            <div className="grid grid-cols-2 gap-8">
                                {[
                                    { label: "ACERVO DIGITAL", val: "LajesPintadas.gov" },
                                    { label: "RADAR PNTP", status: "ATUALIZADO" },
                                    { label: "FISCALIZAÇÃO", val: "TCE/RN" },
                                    { label: "SINCRONIA", val: "REAL-TIME" },
                                ].map((stat) => (
                                    <div key={stat.label} className="border-l border-white/10 pl-6 group/stat cursor-default">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 group-hover/stat:text-orange-600 transition-colors">{stat.label}</p>
                                        <p className="text-[13px] font-black text-white/50 group-hover/stat:text-white transition-colors uppercase tracking-widest">{stat.val || stat.status}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} PREFEITURA DE LAJES PINTADAS/RN • CNPJ: 08.106.505/0001-24
                        </p>
                        <div className="flex gap-10">
                            {["Privacidade", "Termos", "Ouvidoria"].map(l => (
                                <Link key={l} href="#" className="text-white/20 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">{l}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
