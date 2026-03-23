"use client";
import Link from "next/link";
import { 
    TrendingUp, BarChart3, Gavel, FileSignature, Handshake, 
    Plane, Users, FileBarChart, Scale, Database, Construction, 
    Users2, ClipboardList, HelpCircle, BookOpen, Files, 
    Building2, UserCircle2, MapPinned, Truck, Stethoscope, 
    Globe2, IdCard, ExternalLink, Globe, ArrowRight, Check
} from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState } from "react";

// Como estamos usando client component para as animações, 
// o metadata precisa ser movido para um layout ou exportado separadamente se necessário.
// No Next.js 14, client components não podem exportar metadata.
// Vou remover o export do metadata deste arquivo e focar na UI.

const modulos = [
    {
        icon: TrendingUp,
        titulo: "Receitas Públicas",
        desc: "Arrecadação por categoria, tributos, transferências e outras receitas.",
        href: "/transparencia/receitas",
        cor: "from-emerald-400 to-teal-500",
        badge: "LC 131",
    },
    {
        icon: BarChart3,
        titulo: "Despesas Públicas",
        desc: "Empenhos, liquidações e pagamentos realizados por secretaria.",
        href: "/transparencia/despesas",
        cor: "from-blue-400 to-indigo-500",
        badge: "LC 131",
    },
    {
        icon: Gavel,
        titulo: "Licitações",
        desc: "Acompanhamento detalhado de todos os processos licitatórios.",
        href: "/transparencia/licitacoes",
        cor: "from-purple-400 to-violet-500",
        badge: "Lei 14.133",
    },
    {
        icon: FileSignature,
        titulo: "Contratos",
        desc: "Contratos celebrados, valores, vigência e fornecedores.",
        href: "/transparencia/contratos",
        cor: "from-orange-400 to-amber-500",
        badge: "LAI",
    },
    {
        icon: Handshake,
        titulo: "Convênios",
        desc: "Convênios firmados com órgãos estaduais e federais.",
        href: "/transparencia/convenios",
        cor: "from-pink-400 to-rose-500",
        badge: "LAI",
    },
    {
        icon: Plane,
        titulo: "Diárias",
        desc: "Diárias concedidas a servidores em viagens a serviço.",
        href: "/transparencia/diarias",
        cor: "from-sky-400 to-cyan-500",
        badge: "LAI",
    },
    {
        icon: Users,
        titulo: "Servidores",
        desc: "Relação de servidores, cargos e folha de pagamento mensal.",
        href: "/transparencia/servidores",
        cor: "from-teal-400 to-green-500",
        badge: "LC 131",
    },
    {
        icon: Scale,
        titulo: "Padrão Remuneratório",
        desc: "Tabelas de vencimentos, níveis e classes de cargos.",
        href: "/transparencia/servidores/cargos-e-salarios",
        cor: "from-blue-600 to-cyan-700",
        badge: "PNTP",
    },
    {
        icon: FileBarChart,
        titulo: "Relatórios Fiscais",
        desc: "RREO, RGF e relatórios de gestão fiscal periódicos.",
        href: "/transparencia/relatorios",
        cor: "from-rose-400 to-red-600",
        badge: "LRF",
    },
    {
        icon: Scale,
        titulo: "Orçamento",
        desc: "Consultas ao PPA, LDO e LOA (Leis Orçamentárias).",
        href: "/transparencia/orcamento",
        cor: "from-slate-500 to-gray-700",
        badge: "CF/88",
    },
    {
        icon: Database,
        titulo: "Dados Abertos",
        desc: "Bases de dados para reutilização por pesquisadores.",
        href: "/transparencia/dados-abertos",
        cor: "from-lime-400 to-green-500",
        badge: "Open Data",
    },
    {
        icon: Construction,
        titulo: "Obras Públicas",
        desc: "Acompanhamento de obras e reformas no município.",
        href: "/transparencia/obras",
        cor: "from-orange-500 to-red-500",
        badge: "PNTP",
    },
    {
        icon: Users2,
        titulo: "Conselhos",
        desc: "Participação popular e atas das reuniões dos conselhos.",
        href: "/transparencia/conselhos",
        cor: "from-blue-600 to-indigo-700",
        badge: "PNTP",
    },
    {
        icon: ClipboardList,
        titulo: "Transparência Passiva",
        desc: "Relatórios estatísticos de solicitações e prazos (LAI).",
        href: "/transparencia/passiva",
        cor: "from-amber-500 to-orange-600",
        badge: "LAI",
    },
    {
        icon: HelpCircle,
        titulo: "FAQ",
        desc: "Respostas para as dúvidas mais comuns dos cidadãos.",
        href: "/transparencia/faq",
        cor: "from-blue-500 to-cyan-500",
        badge: "Acesso",
    },
    {
        icon: BookOpen,
        titulo: "Glossário",
        desc: "Definições de termos técnicos da administração pública.",
        href: "/transparencia/glossario",
        cor: "from-slate-400 to-gray-500",
        badge: "Info",
    },
    {
        icon: Files,
        titulo: "Legislação",
        desc: "Leis, decretos e portarias municipais atualizadas.",
        href: "/transparencia/legislacao",
        cor: "from-indigo-500 to-purple-600",
        badge: "Legal",
    },
    {
        icon: Building2,
        titulo: "Institucional",
        desc: "Organograma, sede oficial e símbolos municipais.",
        href: "/transparencia/institucional",
        cor: "from-slate-700 to-slate-900",
        badge: "Prefeitura",
    },
    {
        icon: UserCircle2,
        titulo: "Prefeito e Vice",
        desc: "Identificação dos gestores e biografia oficial.",
        href: "/transparencia/gestores",
        cor: "from-blue-700 to-indigo-900",
        badge: "Gabinete",
    },
    {
        icon: MapPinned,
        titulo: "Carta de Serviços",
        desc: "Guia sobre como acessar os serviços municipais.",
        href: "/transparencia/carta-servicos",
        cor: "from-emerald-500 to-green-600",
        badge: "Cidadão",
    },
    {
        icon: Truck,
        titulo: "Frota",
        desc: "Relação de veículos e máquinas da prefeitura.",
        href: "/transparencia/frota",
        cor: "from-zinc-500 to-zinc-700",
        badge: "Patrimônio",
    },
    {
        icon: Stethoscope,
        titulo: "Saúde",
        desc: "Relação de medicamentos e disponibilidade em estoque.",
        href: "/transparencia/saude",
        cor: "from-rose-500 to-red-600",
        badge: "Saúde",
    },
    {
        icon: Globe2,
        titulo: "Emendas",
        desc: "Recursos recebidos via emendas parlamentares.",
        href: "/transparencia/emendas",
        cor: "from-amber-400 to-orange-500",
        badge: "Recursos",
    },
    {
        icon: IdCard,
        titulo: "Concursos",
        desc: "Editais e resultados de processos seletivos.",
        href: "/transparencia/concursos",
        cor: "from-cyan-600 to-blue-700",
        badge: "Pessoal",
    },
];

export default function TransparenciaPage() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);

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

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Portal da Transparência"
                subtitle="Acesso integral aos dados públicos de Lajes Pintadas – RN, promovendo clareza e controle social."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência" }
                ]}
            />

            {/* Banner de Conformidade */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-8 px-6 shadow-inner">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -ml-20 -mt-20" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl -mr-20 -mb-20" />
                </div>
                <div className="max-w-[1240px] mx-auto relative z-10 flex flex-wrap items-center justify-center gap-4 text-white text-[10px] font-black uppercase tracking-wider">
                    {["Lei 12.527/2011 (LAI)", "Lei Complementar 131/2009", "e-MAG", "WCAG 2.1 AA", "LGPD"].map((item) => (
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item} 
                            className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl"
                        >
                            <Check size={12} className="text-emerald-400" /> {item}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Grid de Módulos */}
            <div className="max-w-[1300px] mx-auto px-6 py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {modulos.map((m, idx) => {
                        const identifier = m.href.split("/").pop()?.toLowerCase() || "";
                        const override = linksExternos.find((l: any) => 
                            l.moduloAlvo?.toLowerCase() === identifier
                        );
                        const finalHref = override ? override.url : m.href;
                        const isExternal = !!override;

                        return (
                            <motion.div
                                key={m.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link 
                                    href={finalHref} 
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="group block h-full"
                                >
                                    <div className="relative h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                                        {/* Efeito de Glossmorphism no Topo */}
                                        <div className={`h-24 bg-gradient-to-br ${m.cor} relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                        </div>

                                        {/* Ícone sobreposto */}
                                        <div className="absolute top-12 left-8">
                                            <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-gray-50">
                                                <m.icon className="text-gray-800 lg:group-hover:text-blue-600 transition-colors" size={32} strokeWidth={1.5} />
                                            </div>
                                        </div>

                                        <div className="pt-12 p-8 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="font-black text-gray-800 text-base uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                    {m.titulo}
                                                </h2>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                                    {m.badge}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-500 text-xs leading-relaxed font-medium mb-8 grow">
                                                {m.desc}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-700 transition-colors">
                                                    {isExternal ? "Portal Externo" : "Ver Detalhes"}
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                {isExternal && <ExternalLink size={12} className="text-gray-300" />}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Seção e-SIC com Design Refinado */}
            <div className="bg-white py-32 border-t border-gray-100">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="relative rounded-[4rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-1 md:p-1.5 shadow-2xl shadow-blue-900/20 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        
                        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[3.8rem] p-12 md:p-20 text-center text-white overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -ml-32 -mb-32" />

                             <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-xl mb-10"
                             >
                                <HelpCircle size={48} className="text-blue-600" />
                             </motion.div>

                             <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase">Acesso à Informação (e-SIC)</h2>
                             <p className="max-w-2xl mx-auto text-blue-100/80 text-lg font-medium leading-relaxed mb-12">
                                Direito do cidadão, dever do Estado. Use nossos canais oficiais para solicitar informações não disponíveis no portal.
                             </p>

                             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link href="/servicos/esic" className="w-full sm:w-auto bg-white text-blue-700 px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-50 hover-scale-105 transition-all">
                                    Abrir Solicitação
                                </Link>
                                <Link href="/servicos/ouvidoria" className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                                    Falar com Ouvidoria 
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rodapé Interno */}
            <div className="bg-gray-50 py-12 border-t border-gray-100">
                <div className="max-w-[1240px] mx-auto px-6 text-center">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
                        Portal da Transparência © {new Date().getFullYear()} – Prefeitura de Lajes Pintadas / RN
                    </p>
                </div>
            </div>
        </div>
    );
}
