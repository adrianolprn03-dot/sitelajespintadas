"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
    FaExchangeAlt, FaExternalLinkAlt, FaInfoCircle, FaHospital, 
    FaSchool, FaMoneyCheck, FaBuilding, FaSync, FaGlobeAmericas,
    FaArrowRight, FaHeartbeat, FaGraduationCap, FaHandHoldingHeart,
    FaUsers, FaUserAlt
} from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ListaTransferenciasFederal from "@/components/transparencia/integracao/ListaTransferenciasFederal";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { MUNICIPIO } from "@/config/municipio";

interface Membro {
    cargo: string;
    nome: string;
    suplente?: string;
    descricao?: string;
}

interface Categoria {
    nome: string;
    membros: Membro[];
}

interface ConselhoInfo {
    id: string;
    nome: string;
    sigla: string;
    ato: string;
    periodo: string;
    objetivo: string;
    contato?: string;
    cor: string;
    corLight: string;
    corBg: string;
    icon: React.ReactNode;
    categorias: Categoria[];
}

export default function TransferenciasPage() {
    const dominio = MUNICIPIO.email.split("@")[1];

    const conselhosDados: ConselhoInfo[] = [
      {
        id: "saude",
        nome: "Conselho Municipal de Saúde",
        sigla: "CMS",
        ato: "Portaria nº 096/2026",
        periodo: "Biênio 2026/2027",
        objetivo: "Atuar na formulação de estratégias e no controle da execução da política de saúde do município, composto por usuários, trabalhadores e gestores.",
        contato: `cms@${dominio}`,
        cor: "from-blue-600 to-indigo-700",
        corLight: "bg-blue-50 text-blue-700 border-blue-100",
        corBg: "from-blue-500/10 to-indigo-500/10",
        icon: <FaHeartbeat size={24} />,
        categorias: [
          {
            nome: "Representantes do Poder Executivo (Governo)",
            membros: [
              { cargo: "Titular", nome: "Dayselane Adelino de Lima", suplente: "Antônio Bruno dos Santos" },
              { cargo: "Titular", nome: "José Humberto de Aguiar", suplente: "Haroldo Júnior da Silva Fernandes" },
              { cargo: "Titular", nome: "Esmael Suel da Silva", suplente: "Moisés Gomes de Lima" }
            ]
          },
          {
            nome: "Trabalhadores em Saúde",
            membros: [
              { cargo: "Titular", nome: "Sázilla Cândida Cabral de Souza", suplente: "Aldemir Francisca Pereira" },
              { cargo: "Titular", nome: "Célito Varela Leite", suplente: "Dagda Sara Gomes" }
            ]
          },
          {
            nome: "Representantes da Sociedade Civil",
            membros: [
              { cargo: "CEBIR", nome: "Josefa Leodiceia Lopes (Titular)", suplente: "Flávia Cely de Oliveira" },
              { cargo: "Cons. Com. São Sebastião", nome: "Ivanilson Feliciano de Lima (Titular)", suplente: "Micarla Linhares da Silva Lima" },
              { cargo: "46° G. Escoteiros José F. de Lima", nome: "Maria Izabel Ribeiro de Aguiar (Titular)", suplente: "Manoel Lopes Ferreira Júnior" },
              { cargo: "Assoc. Com. Riacho Fechado", nome: "Zilma Campelo de Lima Silva (Titular)", suplente: "Zilmara Lauriane Campelo da Silva" },
              { cargo: "Assoc. Veteranos e Amigos", nome: "Waldeiris Ferreira Adelino (Titular)", suplente: "José Jozimario da Silva" },
              { cargo: "Assoc. Cultural de Artes", nome: "Maria Ferreira da Silva (Titular)", suplente: "Everton Silva de Souza" }
            ]
          }
        ]
      },
      {
        id: "educacao",
        nome: "Conselho Municipal de Educação",
        sigla: "CME",
        ato: "Portaria nº 025/2026",
        periodo: "Vigência 2026",
        objetivo: "Responsável pela formulação e fiscalização das diretrizes e políticas educacionais da rede municipal de ensino.",
        cor: "from-amber-600 to-orange-700",
        corLight: "bg-amber-50 text-amber-700 border-amber-100",
        corBg: "from-amber-500/10 to-orange-500/10",
        icon: <FaGraduationCap size={24} />,
        categorias: [
          {
            nome: "Representantes do Colegiado (CME)",
            membros: [
              { cargo: "Secretaria de Educação", nome: "Ana Dark Pereira da Silva (Titular)", suplente: "Gladys Glay Lima de Oliveira" },
              { cargo: "Professores (Ens. Fundamental)", nome: "Micheline Nogueira de Souza Costa (Titular)", suplente: "Ana Lucia da Silva" },
              { cargo: "Gestores Escolares", nome: "Francisco Maciel da Silva (Titular)", suplente: "Maria de Fátima de Oliveira" },
              { cargo: "Poder Legislativo", nome: "Jefferson Bruno Franco (Titular)", suplente: "Valdilene Gomes Feitoza Pereira" },
              { cargo: "Pais de Alunos", nome: "Franciane Pereira Barros (Titular)", suplente: "Maria Das Vitórias Martins de Araújo" },
              { cargo: "Alunos", nome: "Elicleide de Souza dos Santos (Titular)", suplente: "Luiza Maria dos Santos" }
            ]
          },
          {
            nome: "Acompanhamento do FUNDEB (CACS-FUNDEB)",
            membros: [
              { cargo: "Presidente do Conselho", nome: "Prof. Marcos Vinícius Dias", descricao: "Acompanha e controla a distribuição, a transferência e a aplicação dos recursos do FUNDEB." }
            ]
          }
        ]
      },
      {
        id: "assistencia",
        nome: "Conselho Municipal de Assistência Social",
        sigla: "CMAS",
        ato: "Portaria nº 087/2025 & Portaria nº 163/2025",
        periodo: "Biênio 2025/2027",
        objetivo: "Órgão colegiado que fiscaliza e acompanha as ações da política de assistência social, gerindo também o Fundo Municipal de Assistência Social (FMAS).",
        contato: `cmas@${dominio}`,
        cor: "from-emerald-600 to-teal-700",
        corLight: "bg-emerald-50 text-emerald-700 border-emerald-100",
        corBg: "from-emerald-500/10 to-teal-500/10",
        icon: <FaHandHoldingHeart size={24} />,
        categorias: [
          {
            nome: "Representantes Governamentais (Executivo)",
            membros: [
              { cargo: "Secretaria de Assistência Social", nome: "Paula Francineide da Silva (Titular)", suplente: "Maria Jaíra da Silva (Vice-presidente)" },
              { cargo: "Secretaria de Saúde", nome: "Sázila Candida Cabral de Souza (Titular)", suplente: "Deize Gomes de Morais Oliveira" },
              { cargo: "Secretaria de Educação", nome: "Maria de Fátima de Oliveira (Titular)", suplente: "Patrícia de Lima da Silva Adelino" },
              { cargo: "Secretaria de Administração", nome: "Sidcley Gomes da Silva (Titular)", suplente: "Kátia Regina Bezerra de Lima" }
            ]
          },
          {
            nome: "Representantes da Sociedade Civil Organizada",
            membros: [
              { cargo: "Trabalhadores do SUAS", nome: "Elizama Pereira Barros (Presidente)", suplente: "Jucele Maria Gomes Rocha de Morais" },
              { cargo: "SEAPAC", nome: "Damião Santos de Medeiros (Titular)", suplente: "Verônica Maria de Barros" },
              { cargo: "Cons. Com. São Sebastião", nome: "Ivanilson Feliciano de Lima (Titular)", suplente: "Micarla Linhares da Silva Lima" },
              { cargo: "Usuárias do SUAS", nome: "Maria das Vitórias de Oliveira (Titular)", suplente: "Franciane Pereira Barros" }
            ]
          }
        ]
      }
    ];

    const [activeTab, setActiveTab] = useState<"saude" | "educacao" | "assistencia">("saude");
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
                            <FaMoneyCheck size={160} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">Painel de Investimentos Externos</span>
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Emendas Parlamentares</h3>
                            <p className="text-indigo-100/60 leading-relaxed font-bold italic text-sm mb-10 max-w-2xl">
                                Detalhamento dos recursos indicados por Deputados e Senadores para aplicação direta no município de ${MUNICIPIO.nome}.
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

                {/* Conselhos Municipais Section */}
                <motion.div id="conselhos" variants={itemVariants} className="mt-28 mb-24 scroll-mt-28">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em] flex items-center gap-4">
                                <span className="w-12 h-1 bg-blue-600 rounded-full" /> Conselhos Municipais de Controle Social
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-16 italic">
                                Representantes da sociedade e do governo na gestão dos recursos
                            </p>
                        </div>
                    </div>

                    {/* Interactive Bento container */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50">
                        {/* Custom Premium Tabs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-2 bg-slate-50 rounded-[2rem] border border-slate-100">
                            {conselhosDados.map((conselho) => {
                                const isActive = activeTab === conselho.id;
                                return (
                                    <button
                                        key={conselho.id}
                                        onClick={() => setActiveTab(conselho.id as any)}
                                        className={`flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-500 font-black text-xs uppercase tracking-wider ${
                                            isActive 
                                                ? `bg-white shadow-xl shadow-slate-200/80 border-b-2 border-slate-900 text-slate-955 scale-[1.02]` 
                                                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                            isActive 
                                                ? `bg-gradient-to-br ${conselho.cor} text-white` 
                                                : "bg-slate-200/60 text-slate-400"
                                        }`}>
                                            {conselho.icon}
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[8px] opacity-60 tracking-[0.2em]">{conselho.sigla}</span>
                                            <span className="block text-[11px] leading-tight font-black uppercase tracking-tight">{conselho.nome.replace("Conselho Municipal de ", "")}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content Area */}
                        <AnimatePresence mode="wait">
                            {conselhosDados.map((conselho) => {
                                if (conselho.id !== activeTab) return null;
                                return (
                                    <motion.div
                                        key={conselho.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-8"
                                    >
                                        {/* Header info */}
                                        <div className={`p-8 rounded-[2rem] bg-gradient-to-r ${conselho.corBg} border border-slate-100 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center`}>
                                            <div>
                                                <div className="flex flex-wrap gap-3 items-center mb-3">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md border border-slate-200">{conselho.sigla}</span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${conselho.corLight}`}>{conselho.periodo}</span>
                                                    {conselho.ato && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{conselho.ato}</span>}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none mb-3">
                                                    {conselho.nome}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-bold italic leading-relaxed max-w-4xl">
                                                    "{conselho.objetivo}"
                                                </p>
                                            </div>
                                            {conselho.contato && (
                                                <div className="shrink-0 flex flex-col items-start md:items-end">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">E-mail Oficial</span>
                                                    <a href={`mailto:${conselho.contato}`} className="text-xs font-black text-blue-600 hover:underline">{conselho.contato}</a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Categories Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {conselho.categorias.map((cat, idx) => (
                                                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 flex flex-col">
                                                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                        <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${conselho.cor}`} />
                                                        {cat.nome}
                                                    </h4>
                                                    
                                                    <div className="space-y-4 flex-grow">
                                                        {cat.membros.map((membro, mIdx) => (
                                                            <div 
                                                                key={mIdx} 
                                                                className="bg-white hover:bg-slate-50/20 border border-slate-100 hover:border-slate-200 p-4 rounded-[1.25rem] transition-all duration-300 shadow-sm flex items-start gap-4 hover:translate-x-1 group/membro"
                                                            >
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-500 group-hover/membro:bg-gradient-to-br ${conselho.cor} group-hover/membro:text-white transition-all`}>
                                                                    <FaUserAlt size={12} />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                                        <span className="text-xs font-black text-slate-800 leading-tight">{membro.nome}</span>
                                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{membro.cargo}</span>
                                                                    </div>
                                                                    {membro.suplente && (
                                                                        <p className="text-[10px] text-slate-500 font-bold mt-1.5 flex items-center gap-1.5">
                                                                            <span className="text-slate-400 font-black uppercase text-[8px]">Suplente:</span> {membro.suplente}
                                                                        </p>
                                                                    )}
                                                                    {membro.descricao && (
                                                                        <p className="text-[10px] text-slate-400 font-bold italic mt-1">{membro.descricao}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                </motion.div>
            </motion.div>
        </div>
    );
}

