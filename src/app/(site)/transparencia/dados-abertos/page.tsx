"use client";
import Link from "next/link";
import { FaDownload, FaDatabase, FaTable, FaCheckCircle, FaLock, FaBolt } from "react-icons/fa";
import { FaFileCode, FaCircleInfo } from "react-icons/fa6";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { exportToCSV, exportToJSON, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

const conjuntos = [
    {
        titulo: "Servidores Municipais",
        descricao: "Remuneração, cargos e lotação de todos os agentes públicos ativos.",
        endpoint: "/api/servidores",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Mensal",
        lei: "LC 131/2009",
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/20"
    },
    {
        titulo: "Receitas Públicas",
        descricao: "Detalhamento da arrecadação municipal por fonte e categoria.",
        endpoint: "/api/receitas",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Mensal",
        lei: "LC 131/2009",
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/20"
    },
    {
        titulo: "Despesas Públicas",
        descricao: "Fluxo completo de empenhos, liquidações e pagamentos efetuados.",
        endpoint: "/api/despesas",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Mensal",
        lei: "LC 131/2009",
        gradient: "from-slate-800 to-slate-900",
        shadow: "shadow-slate-900/20"
    },
    {
        titulo: "Licitações",
        descricao: "Editais, atas e resultados de processos licitatórios municipais.",
        endpoint: "/api/licitacoes",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "Lei 14.133/2021",
        gradient: "from-purple-500 to-violet-600",
        shadow: "shadow-purple-500/20"
    },
    {
        titulo: "Contratos",
        descricao: "Integra de contratos e aditivos firmados pela prefeitura.",
        endpoint: "/api/contratos",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "Lei 14.133/2021",
        gradient: "from-orange-500 to-amber-600",
        shadow: "shadow-orange-500/20"
    },
    {
        titulo: "Convênios",
        descricao: "Repasses e termos de cooperação com entes federativos.",
        endpoint: "/api/convenios",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "LAI",
        gradient: "from-rose-500 to-pink-600",
        shadow: "shadow-rose-500/20"
    },
    {
        titulo: "Obras Públicas",
        descricao: "Dados técnicos e execução financeira de obras em curso.",
        endpoint: "/api/admin/obras",
        formatos: ["JSON", "XLSX"],
        atualizacao: "Semanal",
        lei: "PNTP",
        gradient: "from-orange-600 to-red-700",
        shadow: "shadow-red-600/20"
    },
    {
        titulo: "Diárias",
        descricao: "Concessão de diárias e ajuda de custo para deslocamentos.",
        endpoint: "/api/diarias",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "LAI",
        gradient: "from-sky-500 to-cyan-600",
        shadow: "shadow-sky-500/20"
    },
    {
        titulo: "Emendas Parlamentares (PIX)",
        descricao: "Transferências especiais recebidas de emendas individuais.",
        endpoint: "/api/transparencia/emendas-parlamentares",
        formatos: ["JSON", "CSV"],
        atualizacao: "Contínua",
        lei: "PNTP",
        gradient: "from-teal-400 to-emerald-500",
        shadow: "shadow-teal-500/20"
    },
    {
        titulo: "Renúncias e Desonerações",
        descricao: "Demonstrativo de incentivos, isenções e anistias fiscais.",
        endpoint: "/api/transparencia/renuncias-fiscais",
        formatos: ["JSON", "CSV"],
        atualizacao: "Anual",
        lei: "Art. 14 LRF",
        gradient: "from-orange-400 to-red-500",
        shadow: "shadow-orange-500/20"
    },
    {
        titulo: "Glossário Técnico",
        descricao: "Dicionário de termos da administração pública.",
        endpoint: "/api/transparencia/glossario",
        formatos: ["JSON", "CSV"],
        atualizacao: "Ocasional",
        lei: "PNTP",
        gradient: "from-blue-400 to-indigo-500",
        shadow: "shadow-blue-500/20"
    },
];

export default function DadosAbertosPage() {
    const handleDownload = async (endpoint: string, titulo: string, formato: string) => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.items || []);
            const filename = `dados-${titulo.toLowerCase().replace(/\s+/g, "-")}`;

            if (formato === "JSON") exportToJSON(items, filename);
            if (formato === "CSV") exportToCSV(items, filename);
            if (formato === "XLSX") exportToXLSX(items, filename);
            
        } catch {
            alert("Erro ao baixar dados. Tente novamente.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Dados Abertos"
                subtitle="Democratizando o acesso à informação pública através de datasets estruturados e reutilizáveis."
                variant="premium"
                icon={<FaDatabase />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dados Abertos" }
                ]}
            />

            {/* Tagline de Conformidade Estilo Bento */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-10 py-5 px-6">
                    {[
                        { label: "Open Data Charter", icon: <FaBolt className="text-blue-400" /> },
                        { label: "CKAN compliant", icon: <FaDatabase className="text-emerald-400" /> },
                        { label: "API REST / JSON", icon: <FaFileCode className="text-orange-400" /> },
                        { label: "Decreto 8.777/2016", icon: <FaLock className="text-rose-400" /> }
                    ].map((item) => (
                        <span key={item.label} className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                            {item.icon} {item.label}
                        </span>
                    ))}
                </div>
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-16 -mt-12 relative z-30"
            >
                {/* Intro Bento Box */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 lg:p-14 mb-16 flex flex-col md:flex-row items-center gap-12 group">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 border border-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-inner group-hover:rotate-12">
                        <FaDatabase size={36} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Manual do Desenvolvedor</span>
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        </div>
                        <h2 className="font-black text-slate-800 text-3xl uppercase tracking-tighter mb-4 leading-none">Como consumir nossos dados</h2>
                        <p className="text-slate-500 text-base leading-relaxed font-bold italic max-w-2xl">
                            Disponibilizamos conjuntos de dados em formatos interoperáveis (JSON e CSV) sem restrições de uso, permitindo que qualquer cidadão ou desenvolvedor crie soluções baseadas em dados públicos oficiais.
                        </p>
                    </div>
                </motion.div>

                {/* Grid de Datasets */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {conjuntos.map((c) => (
                        <motion.div 
                            key={c.titulo} 
                            variants={itemVariants}
                            className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-700 relative hover:border-blue-100`}
                        >
                            <div className={`h-3 w-full bg-gradient-to-r ${c.gradient}`} />
                            
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Dataset Oficial / {c.lei}</span>
                                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter group-hover:text-blue-600 transition-colors leading-none">{c.titulo}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <FaTable size={20} />
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm font-bold leading-relaxed mb-10 h-10 line-clamp-2 italic">
                                    "{c.descricao}"
                                </p>

                                <div className="flex items-center justify-between mb-10 pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-10 bg-blue-100 rounded-full" />
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Frequência</span>
                                            <span className="text-xs font-black text-slate-800 uppercase tabular-nums tracking-wider">{c.atualizacao}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {c.formatos.map((f) => (
                                            <span key={f} className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-lg border border-slate-100 group-hover:border-blue-100 transition-colors">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {c.formatos.includes("JSON") && (
                                        <button
                                            onClick={() => handleDownload(c.endpoint, c.titulo, "JSON")}
                                            className="flex-1 flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 text-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-950/20"
                                        >
                                            <FaFileCode size={16} className="text-blue-400" /> API JSON
                                        </button>
                                    )}
                                    {c.formatos.includes("CSV") && (
                                        <button
                                            onClick={() => handleDownload(c.endpoint, c.titulo, "CSV")}
                                            className="flex-1 flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shadow-slate-200/50"
                                        >
                                            <FaTable size={16} className="text-emerald-500" /> Exportar CSV
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Licença e Uso Bento Footer */}
                <motion.div variants={itemVariants} className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-slate-950/20">
                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30">
                            <FaCircleInfo size={32} />
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Licenciamento de Uso Livre</h4>
                        <p className="text-slate-400 font-bold text-sm max-w-2xl leading-relaxed mb-8">
                            Os dados são publicados sob a Licença <strong className="text-white">Creative Commons CC BY 4.0</strong>. Você tem liberdade para compartilhar, adaptar e usar para fins comerciais, desde que atribua o crédito à Prefeitura de Lajes Pintadas.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/servicos/esic" className="h-14 flex items-center px-10 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                                Solicitar Novos Datasets (e-SIC)
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-24">
                    <BannerPNTP />
                </div>
            </motion.div>
        </div>
    );
}
