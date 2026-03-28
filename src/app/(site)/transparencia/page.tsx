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
    CalendarClock, PhoneCall, Link2, MonitorPlay, ShieldCheck, HeartPulse
} from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import RadarTransparencia from "@/components/home/RadarTransparencia";
import { useEffect, useState } from "react";

// Como estamos usando client component para as animações, 
// o metadata precisa ser movido para um layout ou exportado separadamente se necessário.
// No Next.js 14, client components não podem exportar metadata.
// Vou remover o export do metadata deste arquivo e focar na UI.

const categoriasDeModulos = [
    {
        tituloCategoria: "Atendimento ao Cidadão",
        modulos: [
            { icon: ClipboardList, titulo: "E-sic", desc: "Serviço de Informação ao Cidadão.", href: "/transparencia/passiva", cor: "from-amber-500 to-orange-600", badge: "LAI" },
            { icon: Headset, titulo: "Ouvidoria", desc: "Canal de denúncias, reclamações e sugestões.", href: "/servicos/ouvidoria", cor: "from-blue-500 to-cyan-500", badge: "Atendimento" },
            { icon: Mail, titulo: "Fale Conosco", desc: "Entre em contato com a prefeitura.", href: "/contato", cor: "from-teal-400 to-green-500", badge: "Contato" },
            { icon: MapPinned, titulo: "Carta de Serviço", desc: "Guia de serviços oferecidos pelo município.", href: "/transparencia/carta-servicos", cor: "from-emerald-500 to-green-600", badge: "Cidadão" },
        ]
    },
    {
        tituloCategoria: "Execução Orçamentária e Financeira",
        modulos: [
            { icon: TrendingUp, titulo: "Receitas Públicas", desc: "Arrecadação e transferência de recursos.", href: "/transparencia/receitas", cor: "from-emerald-400 to-teal-500", badge: "LC 131" },
            { icon: BarChart3, titulo: "Despesas Públicas", desc: "Empenhos, liquidações e pagamentos.", href: "/transparencia/despesas", cor: "from-blue-400 to-indigo-500", badge: "LC 131" },
            { icon: Globe2, titulo: "Emendas Parlamentares", desc: "Recursos recebidos via emendas.", href: "/transparencia/emendas", cor: "from-amber-400 to-orange-500", badge: "Recursos" },
            { icon: ListOrdered, titulo: "Ordem Cronológica", desc: "Fila de pagamentos a fornecedores.", href: "/transparencia/ordem-cronologica", cor: "from-slate-500 to-gray-700", badge: "Transparência" },
            { icon: QrCode, titulo: "Emenda PIX", desc: "Transferências especiais via PIX.", href: "/transparencia/emenda-pix", cor: "from-teal-500 to-emerald-600", badge: "Recursos" },
            { icon: Landmark, titulo: "Orçamento (LOA / LDO / PPA)", desc: "Planejamento orçamentário municipal.", href: "/transparencia/orcamento", cor: "from-blue-600 to-indigo-700", badge: "Planejamento" },
            { icon: Database, titulo: "Transferências", desc: "Repasses de recursos federais e estaduais.", href: "/transparencia/transferencias", cor: "from-amber-600 to-orange-700", badge: "Recursos" },
        ]
    },
    {
        tituloCategoria: "Gestão Administrativa",
        modulos: [
            { icon: FileStack, titulo: "Prestação de Contas", desc: "Demonstrativos de gestão.", href: "/transparencia/prestacao-contas", cor: "from-rose-400 to-red-600", badge: "Contas" },
            { icon: IdCard, titulo: "Concurso Público", desc: "Editais e resultados de certames.", href: "/transparencia/concursos", cor: "from-cyan-600 to-blue-700", badge: "Pessoal" },
            { icon: ScrollText, titulo: "Atas de Registro de Preços", desc: "Atas homologadas e vigentes.", href: "/transparencia/atas-registro", cor: "from-indigo-400 to-purple-500", badge: "Compras" },
            { icon: FileSignature, titulo: "Contratos", desc: "Ajustes firmados pela administração.", href: "/transparencia/contratos", cor: "from-blue-500 to-indigo-600", badge: "Atos" },
            { icon: Files, titulo: "Leis", desc: "Legislação municipal e leis orgânicas.", href: "/transparencia/leis", cor: "from-indigo-500 to-purple-600", badge: "Leis" },
            { icon: FileText, titulo: "Decretos", desc: "Decretos do poder executivo.", href: "/transparencia/decretos", cor: "from-slate-600 to-slate-800", badge: "Atos" },
            { icon: FileSignature, titulo: "Portarias", desc: "Portarias e atos administrativos.", href: "/transparencia/portarias", cor: "from-blue-500 to-indigo-600", badge: "Atos" },
            { icon: Plane, titulo: "Diárias", desc: "Concessão de diárias e passagens.", href: "/transparencia/diarias", cor: "from-sky-400 to-cyan-500", badge: "LAI" },
            { icon: Users, titulo: "Quadro Pessoal", desc: "Servidores, folha de pagamento e mais.", href: "/transparencia/servidores", cor: "from-teal-400 to-green-500", badge: "RH" },
            { icon: Gavel, titulo: "Licitações", desc: "Processos licitatórios do município.", href: "/transparencia/licitacoes", cor: "from-purple-400 to-violet-500", badge: "Licitações" },
            { icon: Briefcase, titulo: "Processo Seletivo", desc: "Contratações temporárias e seleções.", href: "/transparencia/processo-seletivo", cor: "from-orange-400 to-amber-500", badge: "RH" },
            { icon: Handshake, titulo: "Convênios e Parcerias", desc: "Termos firmados com terceiros.", href: "/transparencia/convenios", cor: "from-pink-400 to-rose-500", badge: "Convênios" },
            { icon: Construction, titulo: "Obras Públicas", desc: "Acompanhamento de obras e medições.", href: "/transparencia/obras", cor: "from-orange-500 to-red-500", badge: "Obras" },
            { icon: Files, titulo: "Publicações", desc: "Atos oficiais, editais e publicações diversas.", href: "/transparencia/publicacoes", cor: "from-slate-400 to-gray-600", badge: "Atos" },
            { icon: Users2, titulo: "Terceirizados", desc: "Relação de postos terceirizados.", href: "/transparencia/servidores/terceirizados", cor: "from-amber-500 to-orange-600", badge: "RH" },
            { icon: UserCircle2, titulo: "Estagiários", desc: "Relação de estagiários contratados.", href: "/transparencia/servidores/estagiarios", cor: "from-pink-500 to-rose-600", badge: "RH" },
            { icon: AlertTriangle, titulo: "Covid-19", desc: "Ações e gastos no combate à pandemia.", href: "/transparencia/covid19", cor: "from-red-500 to-red-700", badge: "Saúde" },
            { icon: Truck, titulo: "Frota Municipal", desc: "Veículos e máquinas do município.", href: "/transparencia/frota", cor: "from-slate-700 to-slate-900", badge: "Gestão" },
        ]
    },
    {
        tituloCategoria: "Transparência Fiscal e Contas Públicas",
        modulos: [
            { icon: FileBarChart, titulo: "Transparência Fiscal (LRF)", desc: "Relatórios de Gestão Fiscal e RREO.", href: "/transparencia/lrf", cor: "from-rose-400 to-red-600", badge: "LRF" },
            { icon: Landmark, titulo: "PCG - Prestação de contas de governo", desc: "Contas anuais do chefe do executivo.", href: "/transparencia/pcg", cor: "from-blue-600 to-blue-800", badge: "PCG" },
            { icon: ClipboardList, titulo: "PCS - Prestação de contas de gestão", desc: "Contas dos ordenadores de despesa.", href: "/transparencia/pcs", cor: "from-emerald-500 to-teal-700", badge: "PCS" },
        ]
    },
    {
        tituloCategoria: "Informações Institucionais",
        modulos: [
            { icon: Building2, titulo: "Dados Institucionais", desc: "História, localização e estrutura.", href: "/transparencia/institucional", cor: "from-slate-700 to-slate-900", badge: "Institucional" },
            { icon: UserCircle2, titulo: "Prefeito e Vice-prefeito", desc: "Perfil e gabinete dos gestores.", href: "/transparencia/gestores", cor: "from-blue-700 to-indigo-900", badge: "Gabinete" },
            { icon: Users2, titulo: "Secretarias Municipais", desc: "Estrutura administrativa e secretários.", href: "/secretarias", cor: "from-cyan-600 to-blue-700", badge: "Gestão" },
            { icon: Globe, titulo: "Brasão, Hino e Bandeira", desc: "Símbolos oficiais do município.", href: "/transparencia/simbolos", cor: "from-emerald-500 to-green-600", badge: "Cultura" },
            { icon: Users, titulo: "Conselhos e Membros", desc: "Conselhos municipais e composição.", href: "/transparencia/conselhos", cor: "from-indigo-500 to-purple-600", badge: "Participação" },
            { icon: BookOpen, titulo: "Glossário", desc: "Termos técnicos da administração pública.", href: "/transparencia/glossario", cor: "from-slate-400 to-gray-500", badge: "Info" },
            { icon: HelpCircle, titulo: "Perguntas e Respostas (FAQ)", desc: "Dúvidas frequentes da população.", href: "/transparencia/faq", cor: "from-blue-500 to-cyan-500", badge: "Acesso" },
            { icon: MapPinned, titulo: "Mapa do Site", desc: "Índice de todas as páginas do portal.", href: "/mapa-do-site", cor: "from-slate-600 to-gray-700", badge: "Ajuda" },
            { icon: Database, titulo: "Dados Abertos", desc: "Bases em formato aberto (CSV, JSON).", href: "/transparencia/dados-abertos", cor: "from-lime-400 to-green-500", badge: "Open Data" },
            { icon: PhoneCall, titulo: "Contatos", desc: "Telefones e e-mails úteis.", href: "/contato", cor: "from-teal-500 to-emerald-600", badge: "Contato" },
            { icon: Link2, titulo: "Associações", desc: "Entidades apoiadas e conveniadas.", href: "/transparencia/associacoes", cor: "from-orange-400 to-amber-500", badge: "Parceiros" },
            { icon: TrendingUp, titulo: "Plano Estratégico Institucional", desc: "Metas e objetivos de longo prazo.", href: "/transparencia/plano-estrategico", cor: "from-blue-500 to-indigo-600", badge: "Planejamento" },
            { icon: ClipboardList, titulo: "Pesquisa de Satisfação", desc: "Avalie os serviços prestados.", href: "/transparencia/pesquisa-satisfacao", cor: "from-pink-500 to-rose-600", badge: "Avaliação" },
        ]
    },
    {
        tituloCategoria: "Normas e Regulamentações",
        modulos: [
            { icon: Files, titulo: "Leis", desc: "Arcabouço legal do município.", href: "/transparencia/legislacao", cor: "from-indigo-500 to-purple-600", badge: "Leis" },
            { icon: FileText, titulo: "Regulamentação das Diárias", desc: "Leis e normas sobre concessão de viagens.", href: "/transparencia/regulamentacao-diarias", cor: "from-slate-600 to-slate-800", badge: "Normas" },
            { icon: Scale, titulo: "Parecer do Tribunal de Contas", desc: "Apreciação das contas anuais TCE.", href: "/transparencia/parecer-tce", cor: "from-teal-600 to-emerald-700", badge: "TCE" },
            { icon: BarChart3, titulo: "Renúncias Fiscais", desc: "Isenções e anistias concedidas.", href: "/transparencia/renuncias-fiscais", cor: "from-orange-500 to-red-600", badge: "Receita" },
            { icon: FileStack, titulo: "Relatório de Gestão e Atividades", desc: "Balanço das ações do executivo.", href: "/transparencia/relatorio-gestao", cor: "from-blue-500 to-cyan-600", badge: "Gestão" },
            { icon: MonitorPlay, titulo: "Regulamentação de Governo Digital", desc: "Avanços na prestação de serviços digitais.", href: "/transparencia/governo-digital", cor: "from-purple-500 to-indigo-600", badge: "TI" },
            { icon: ShieldCheck, titulo: "LGPD", desc: "Lei Geral de Proteção de Dados.", href: "/transparencia/lgpd", cor: "from-emerald-400 to-green-600", badge: "Privacidade" },
            { icon: FileText, titulo: "Tabelas de Valores de Diárias", desc: "Limites e tetos para indenizações de viagens.", href: "/transparencia/tabela-diarias", cor: "from-slate-500 to-gray-600", badge: "Consulta" },
        ]
    },
    {
        tituloCategoria: "Saúde Pública",
        modulos: [
            { icon: HeartPulse, titulo: "Lista de Medicamentos SUS", desc: "Relação Municipal de Medicamentos Essenciais (REMUME).", href: "/transparencia/medicamentos-sus", cor: "from-rose-500 to-pink-600", badge: "Saúde" },
            { icon: StethoscopeIcon, titulo: "Plano de Saúde", desc: "Plano Municipal de Saúde.", href: "/transparencia/plano-saude", cor: "from-teal-400 to-emerald-500", badge: "Planejamento" },
            { icon: Building2, titulo: "Unidades de Saúde", desc: "Hospitais, UPAs e UBSs.", href: "/transparencia/unidades-saude", cor: "from-blue-500 to-indigo-600", badge: "Locais" },
            { icon: Activity, titulo: "Central de Regulação", desc: "Fila de exames, consultas e cirurgias.", href: "/transparencia/central-regulacao", cor: "from-orange-400 to-red-500", badge: "Regulação" },
        ]
    },
    {
        tituloCategoria: "ATRICON",
        modulos: [
            { icon: CalendarClock, titulo: "Plano Anual de Contratação", desc: "Planejamento de compras para o ano.", href: "/transparencia/plano-contratacao", cor: "from-indigo-500 to-purple-600", badge: "Planejamento" },
            { icon: TrendingUp, titulo: "Desonerações", desc: "Incentivos e benefícios fiscais.", href: "/transparencia/desoneracoes", cor: "from-teal-500 to-green-600", badge: "Economia" },
            { icon: Activity, titulo: "Informações sobre o Radar", desc: "Radar Nacional de Transparência Pública.", href: "/transparencia/radar", cor: "from-blue-600 to-indigo-800", badge: "Radar" },
            { icon: FileSignature, titulo: "Dívida Ativa", desc: "Relação de devedores do município.", href: "/transparencia/divida-ativa", cor: "from-rose-500 to-red-700", badge: "Dívida" },
            { icon: BookOpen, titulo: "Plano de Educação", desc: "Plano Municipal de Educação.", href: "/transparencia/plano-educacao", cor: "from-amber-500 to-orange-600", badge: "Educação" },
            { icon: Users, titulo: "Incentivos Culturais e Esportivos", desc: "Editais e fomento à cultura e esporte.", href: "/transparencia/incentivos-culturais", cor: "from-cyan-500 to-blue-600", badge: "Cultura" },
        ]
    }
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
                variant="premium"
                icon={<Landmark />}
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

            {/* Secões Categorizadas de Módulos */}
            <div className="max-w-[1300px] mx-auto px-6 py-24 space-y-24">
                {categoriasDeModulos.map((categoria, catIdx) => (
                    <div key={categoria.tituloCategoria} className="relative">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
                                {categoria.tituloCategoria}
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                                        <div className="flex flex-col items-end gap-1.5">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                                                {m.badge}
                                                            </span>
                                                            {isExternal && (
                                                                <span className="bg-primary-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm flex items-center gap-1 animate-pulse">
                                                                    <ExternalLink size={8} /> Externo
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-gray-500 text-xs leading-relaxed font-medium mb-8 grow">
                                                        {m.desc}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-700 transition-colors">
                                                            {isExternal ? "Acessar Portal Externo" : "Ver Detalhes"}
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
                ))}
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

            {/* Seção Radar */}
            <RadarTransparencia />

            {/* Seção PNTP 2025 no Rodapé */}
            <div className="bg-white pt-10 pb-20 border-t border-gray-100">
                <BannerPNTP />
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
