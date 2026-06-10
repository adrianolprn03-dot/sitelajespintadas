"use client";

import Link from "next/link";
import { 
    TrendingUp, BarChart3, Gavel, FileSignature, Handshake, 
    Plane, Users, FileBarChart, Scale, Database, Construction, 
    Users2, ClipboardList, HelpCircle, BookOpen, Files, 
    Building2, UserCircle2, MapPinned, Truck, Globe2, 
    ExternalLink, Globe, ArrowRight, Check,
    Headset, FileText, ScrollText, Briefcase, Landmark, 
    Info, FileStack, Activity, ListOrdered, PhoneCall, 
    Link2, ShieldCheck, HeartPulse, Search, Sparkles, 
    ShieldAlert, FileSearch, Coins, Receipt, Building, 
    Heart, ClipboardCheck, BarChart, GraduationCap, 
    FileClock, UserPlus, UserCheck, FilePieChart, 
    Presentation, Megaphone, Accessibility, Shield, Pill, LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState, useRef } from "react";
import { MUNICIPIO } from "@/config/municipio";

// Categorias organizadas de acordo com as dimensões de avaliação do PNTP 2026
const categoriasDeModulos = [
    {
        tituloCategoria: "Institucional & Acessibilidade",
        icon: Building2,
        desc: "Dados oficiais, competências legais, estrutura administrativa, contatos dos órgãos públicos, acessibilidade e governo digital.",
        modulos: [
            { icon: Building2, titulo: "Institucional", desc: "Dados gerais e identificação da entidade municipal.", href: "/transparencia/institucional", badge: "ENTIDADE", tipoCriterio: "ESSENCIAL", cor: "from-blue-700 to-indigo-850" },
            { icon: FileText, titulo: "Competências", desc: "Atribuições e funções legais do município.", href: "/transparencia/competencias", badge: "LEGAL", tipoCriterio: "ESSENCIAL", cor: "from-emerald-600 to-teal-700" },
            { icon: Users2, titulo: "Organograma", desc: "Estrutura organizacional e administrativa da prefeitura.", href: "/transparencia/institucional", badge: "ESTRUTURA", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-blue-700" },
            { icon: MapPinned, titulo: "Localização e Contatos", desc: "Endereços, telefones, e-mails e contatos das sedes públicas.", href: "/transparencia/institucional", badge: "CONTATOS", tipoCriterio: "ESSENCIAL", cor: "from-slate-800 to-slate-950" },
            { icon: UserCircle2, titulo: "Gestores Municipais", desc: "Identificação dos responsáveis por cada setor e secretaria.", href: "/transparencia/gestores", badge: "CONTATOS", tipoCriterio: "OBRIGATÓRIO", cor: "from-teal-500 to-emerald-600" },
            { icon: Accessibility, titulo: "Acessibilidade", desc: "Ferramentas e recursos de acessibilidade digital do portal.", href: "/transparencia/acessibilidade", badge: "INCLUSÃO", tipoCriterio: "OBRIGATÓRIO", cor: "from-blue-600 to-cyan-700" },
            { icon: ShieldCheck, titulo: "Governo Digital", desc: "Desburocratização e oferta de serviços públicos por meios digitais.", href: "/transparencia/governo-digital", badge: "TECNOLOGIA", tipoCriterio: "RECOMENDADO", cor: "from-emerald-600 to-teal-700" },
            { icon: Sparkles, titulo: "Símbolos Municipais", desc: `Brasão, bandeira, hino oficial e marcos de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`, href: "/transparencia/simbolos", badge: "HISTÓRIA", tipoCriterio: "RECOMENDADO", cor: "from-amber-500 to-orange-600" }
        ]
    },
    {
        tituloCategoria: "Planejamento & Finanças",
        icon: Landmark,
        desc: "Leis orçamentárias (LOA, LDO, PPA), demonstrativos fiscais da LRF, prestação de contas do executivo, pareceres do TCE e conselhos municipais.",
        modulos: [
            { icon: Landmark, titulo: "Planejamento Orçamentário", desc: "Instrumentos de planejamento municipal: LOA, LDO e PPA.", href: "/transparencia/orcamento", badge: "PLANEJAMENTO", tipoCriterio: "ESSENCIAL", cor: "from-slate-800 to-slate-950" },
            { icon: BarChart3, titulo: "Relatórios da LRF", desc: "Demonstrativos fiscais exigidos pela LRF: RREO e RGF.", href: "/transparencia/lrf", badge: "FISCAL", tipoCriterio: "ESSENCIAL", cor: "from-blue-800 to-slate-900" },
            { icon: FilePieChart, titulo: "Prestação de Contas", desc: "Balanços contábeis e demonstrativos financeiros anuais.", href: "/transparencia/prestacao-contas", badge: "CONTABILIDADE", tipoCriterio: "ESSENCIAL", cor: "from-emerald-600 to-teal-700" },
            { icon: BarChart, titulo: "Contas de Governo (PCG)", desc: "Prestação de contas anual do prefeito municipal.", href: "/transparencia/pcg", badge: "GOVERNO", tipoCriterio: "ESSENCIAL", cor: "from-blue-700 to-indigo-800" },
            { icon: FileBarChart, titulo: "Contas de Gestão (PCS)", desc: "Relatórios de prestação de contas dos administradores de fundos e órgãos.", href: "/transparencia/pcs", badge: "GESTÃO", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: Gavel, titulo: "Julgamento de Contas", desc: "Julgamentos realizados pela Câmara Municipal sobre as contas do executivo.", href: "/transparencia/julgamento-contas", badge: "CÂMARA", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-600 to-orange-700" },
            { icon: Scale, titulo: "Parecer Técnico do TCE", desc: "Pareceres emitidos pelo Tribunal de Contas sobre a contabilidade local.", href: "/transparencia/parecer-tce", badge: "TCE-RN", tipoCriterio: "OBRIGATÓRIO", cor: "from-red-600 to-rose-700" },
            { icon: ClipboardList, titulo: "Relatório de Gestão", desc: "Metas físicas, financeiras e atividades desenvolvidas.", href: "/transparencia/relatorio-gestao", badge: "RESULTADOS", tipoCriterio: "RECOMENDADO", cor: "from-purple-600 to-violet-700" },
            { icon: Users, titulo: "Conselhos Municipais", desc: "Pautas, composições, atas de reunião e atos dos Conselhos e do FUNDEB.", href: "/transparencia/conselhos", badge: "PARTICIPAÇÃO", tipoCriterio: "OBRIGATÓRIO", cor: "from-indigo-600 to-indigo-850" }
        ]
    },
    {
        tituloCategoria: "Receitas & Arrecadação",
        icon: Coins,
        desc: "Arrecadação de tributos em tempo real, dívida ativa municipal, renúncias fiscais e fomento à cultura.",
        modulos: [
            { icon: Coins, titulo: "Receitas Públicas", desc: "Arrecadação municipal em tempo real, receitas tributárias e transferências.", href: "/transparencia/receitas", badge: "ARRECADAÇÃO", tipoCriterio: "ESSENCIAL", cor: "from-emerald-500 to-teal-600" },
            { icon: Scale, titulo: "Dívida Ativa", desc: "Controle de créditos a receber e cobranças tributárias do município.", href: "/transparencia/divida-ativa", badge: "COBRANÇA", tipoCriterio: "OBRIGATÓRIO", cor: "from-red-600 to-orange-700" },
            { icon: FileSearch, titulo: "Renúncias Fiscais", desc: "Relatórios de incentivos tributários e renúncias de receitas municipais.", href: "/transparencia/renuncias-fiscais", badge: "ISENÇÃO", tipoCriterio: "OBRIGATÓRIO", cor: "from-purple-600 to-indigo-700" },
            { icon: Sparkles, titulo: "Incentivos Culturais", desc: "Fomento à cultura por meio de incentivos e editais governamentais.", href: "/transparencia/incentivos-culturais", badge: "CULTURA", tipoCriterio: "RECOMENDADO", cor: "from-rose-500 to-pink-650" },
            { icon: TrendingUp, titulo: "Desonerações", desc: "Detalhamento e relatórios de desonerações fiscais concedidas.", href: "/transparencia/desoneracoes", badge: "BENEFÍCIOS", tipoCriterio: "RECOMENDADO", cor: "from-blue-500 to-cyan-600" }
        ]
    },
    {
        tituloCategoria: "Despesas, Licitações & Contratos",
        icon: FileSignature,
        desc: "Execução de despesas, fila cronológica de pagamentos, repasses voluntários, processos licitatórios, atas de registro de preço, plano de contratação anual, contratos e convênios.",
        modulos: [
            { icon: Receipt, titulo: "Despesas Públicas", desc: "Detalhamento de empenhos, liquidações e ordens de pagamento municipais.", href: "/transparencia/despesas", badge: "GASTOS", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-indigo-700" },
            { icon: ListOrdered, titulo: "Ordem Cronológica", desc: "Fila cronológica e execuções de pagamentos a credores e fornecedores.", href: "/transparencia/ordem-cronologica", badge: "TESOURARIA", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-500 to-orange-600" },
            { icon: Database, titulo: "Repasses e Transferências", desc: "Transferências voluntárias, repasses constitucionais e recursos federais.", href: "/transparencia/transferencias", badge: "RECURSOS", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-violet-700" },
            { icon: Gavel, titulo: "Licitações", desc: "Editais, atas, julgamentos, homologações e recursos de certames públicos.", href: "/transparencia/licitacoes", badge: "CERTAMES", tipoCriterio: "ESSENCIAL", cor: "from-orange-600 to-red-700" },
            { icon: Megaphone, titulo: "Editais Diversos", desc: "Chamamentos públicos, avisos e outros atos convocatórios da gestão.", href: "/transparencia/editais", badge: "AVISOS", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-500 to-orange-600" },
            { icon: FileStack, titulo: "Atas de Registro de Preços", desc: "Registro de preços vigente para aquisições públicas e contratações.", href: "/transparencia/atas-registro", badge: "SRP", tipoCriterio: "OBRIGATÓRIO", cor: "from-purple-600 to-violet-850" },
            { icon: FileText, titulo: "Plano de Contratação Anual", desc: "Planejamento anual de contratações públicas municipais (Lei 14.133).", href: "/transparencia/plano-contratacao", badge: "PCA", tipoCriterio: "RECOMENDADO", cor: "from-slate-650 to-slate-800" },
            { icon: FileSignature, titulo: "Contratos Administrativos", desc: "Instrumentos contratuais celebrados, aditivos, valores e prazos.", href: "/transparencia/contratos", badge: "CONTRATOS", tipoCriterio: "ESSENCIAL", cor: "from-blue-700 to-indigo-800" },
            { icon: Handshake, titulo: "Convênios Celebrados", desc: "Parcerias, convênios estaduais, federais e transferências de recursos.", href: "/transparencia/convenios", badge: "PARCERIAS", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-blue-700" },
            { icon: Globe2, titulo: "Emendas Parlamentares", desc: "Acompanhamento de emendas destinadas ao município (estaduais e federais).", href: "/transparencia/emendas", badge: "EMENDAS", tipoCriterio: "OBRIGATÓRIO", cor: "from-teal-600 to-emerald-800" },
            { icon: Coins, titulo: "Emendas PIX", desc: "Transferências especiais diretas do governo federal e destinação local.", href: "/transparencia/emendas-pix", badge: "PIX", tipoCriterio: "ESSENCIAL", cor: "from-pink-600 to-rose-700" },
            { icon: Handshake, titulo: "Acordos Firmados", desc: "Acordos de cooperação técnica e ajustes sem repasse financeiro.", href: "/transparencia/acordos-firmados", badge: "ACORDOS", tipoCriterio: "RECOMENDADO", cor: "from-indigo-500 to-blue-600" },
            { icon: Link2, titulo: "Associações e Parcerias", desc: "Repasses e parcerias firmadas com entidades de classe e consórcios.", href: "/transparencia/associacoes", badge: "ENTIDADES", tipoCriterio: "RECOMENDADO", cor: "from-blue-600 to-indigo-750" }
        ]
    },
    {
        tituloCategoria: "Pessoal & Diárias",
        icon: Users,
        desc: "Quadro de pessoal da prefeitura, servidores públicos, terceirizados, estagiários, concessão de diárias, concursos públicos e processos seletivos.",
        modulos: [
            { icon: Users, titulo: "Servidores Públicos", desc: "Folha de pagamento, cargos, remunerações e servidores municipais.", href: "/transparencia/servidores", badge: "PESSOAL", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: Plane, titulo: "Diárias de Viagem", desc: "Diárias e passagens concedidas a servidores e agentes públicos.", href: "/transparencia/diarias", badge: "DIÁRIAS", tipoCriterio: "ESSENCIAL", cor: "from-sky-500 to-blue-600" },
            { icon: FileClock, titulo: "Tabela de Diárias", desc: "Tabela com os valores vigentes de diárias por nível e localidade.", href: "/transparencia/tabela-diarias", badge: "VALORES", tipoCriterio: "OBRIGATÓRIO", cor: "from-indigo-650 to-indigo-800" },
            { icon: ScrollText, titulo: "Regulamentação de Diárias", desc: "Leis e decretos municipais que regulamentam a concessão de diárias.", href: "/transparencia/regulamentacao-diarias", badge: "REGULAMENTO", tipoCriterio: "OBRIGATÓRIO", cor: "from-slate-600 to-slate-750" },
            { icon: UserPlus, titulo: "Pessoal Terceirizado", desc: "Listagem de trabalhadores terceirizados prestando serviço municipal.", href: "/transparencia/terceirizados", badge: "TERCEIROS", tipoCriterio: "OBRIGATÓRIO", cor: "from-blue-600 to-indigo-700" },
            { icon: Briefcase, titulo: "Estagiários", desc: "Termos de estágio vigentes nos setores públicos do município.", href: "/transparencia/estagiarios", badge: "ESTÁGIO", tipoCriterio: "RECOMENDADO", cor: "from-amber-600 to-orange-700" },
            { icon: GraduationCap, titulo: "Concursos Públicos", desc: "Editais, convocações e homologações de concursos efetivos.", href: "/transparencia/concursos", badge: "CONCURSO", tipoCriterio: "OBRIGATÓRIO", cor: "from-indigo-600 to-blue-700" },
            { icon: UserCheck, titulo: "Processos Seletivos", desc: "Processo Seletivo Simplificado (PSS) para cargos temporários.", href: "/transparencia/processo-seletivo", badge: "PSS", tipoCriterio: "OBRIGATÓRIO", cor: "from-teal-600 to-emerald-700" }
        ]
    },
    {
        tituloCategoria: "Obras & Frota",
        icon: Construction,
        desc: "Contratos de obras municipais em andamento, medições financeiras e relação de frota de veículos oficiais.",
        modulos: [
            { icon: Construction, titulo: "Obras Públicas", desc: "Contratos de obras, medições, relatórios físicos e andamento.", href: "/transparencia/obras", badge: "EXECUÇÃO", tipoCriterio: "ESSENCIAL", cor: "from-amber-600 to-orange-700" },
            { icon: Truck, titulo: "Frota Municipal", desc: "Relação de veículos oficiais próprios, locados ou cedidos.", href: "/transparencia/frota", badge: "VEÍCULOS", tipoCriterio: "RECOMENDADO", cor: "from-sky-500 to-cyan-600" }
        ]
    },
    {
        tituloCategoria: "Cidadão, Ouvidoria & SIC",
        icon: Headset,
        desc: "Serviço de Informação ao Cidadão (e-SIC), Ouvidoria Municipal, Carta de Serviços ao Cidadão, FAQ, glossário de termos e relatórios de transparência passiva.",
        modulos: [
            { icon: ClipboardList, titulo: "e-SIC", desc: "Abertura e consulta de pedidos de acesso à informação (LAI).", href: "/servicos/esic", badge: "LAI", tipoCriterio: "ESSENCIAL", cor: "from-amber-600 to-orange-700" },
            { icon: Headset, titulo: "Ouvidoria Municipal", desc: "Canal oficial para manifestações, denúncias, elogios e críticas.", href: "/servicos/ouvidoria", badge: "OUVIDORIA", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-cyan-600" },
            { icon: MapPinned, titulo: "Carta de Serviços", desc: "Catálogo descritivo de todos os serviços públicos ofertados ao cidadão.", href: "/transparencia/carta-servicos", badge: "CIDADÃO", tipoCriterio: "ESSENCIAL", cor: "from-purple-600 to-indigo-700" },
            { icon: HelpCircle, titulo: "Transparência Passiva", desc: "Relatórios de estatísticas de acesso e respostas fornecidas via LAI.", href: "/transparencia/passiva", badge: "ESTATÍSTICA", tipoCriterio: "ESSENCIAL", cor: "from-slate-750 to-slate-900" },
            { icon: ClipboardCheck, titulo: "Pesquisa de Satisfação", desc: "Avaliação periódica dos serviços municipais pelos usuários.", href: "/transparencia/pesquisa-satisfacao", badge: "SATISFAÇÃO", tipoCriterio: "RECOMENDADO", cor: "from-fuchsia-600 to-pink-700" },
            { icon: HelpCircle, titulo: "FAQ - Dúvidas Frequentes", desc: "Esclarecimentos de dúvidas comuns sobre a gestão pública local.", href: "/transparencia/faq", badge: "AJUDA", tipoCriterio: "RECOMENDADO", cor: "from-slate-600 to-slate-800" },
            { icon: BookOpen, titulo: "Glossário de Termos", desc: "Termos técnicos e conceitos utilizados na administração do portal.", href: "/transparencia/glossario", badge: "CONCEITOS", tipoCriterio: "RECOMENDADO", cor: "from-indigo-500 to-blue-600" },
            { icon: PhoneCall, titulo: "Fale Conosco", desc: "Contatos telefônicos e horários de atendimento dos órgãos municipais.", href: "/contato", badge: "CONTATOS", tipoCriterio: "OBRIGATÓRIO", cor: "from-rose-500 to-pink-600" }
        ]
    },
    {
        tituloCategoria: "Saúde, Educação & Legislação",
        icon: HeartPulse,
        desc: "Transparência finalística da saúde municipal, unidades de atendimento, medicamentos SUS, planos de saúde e educação, leis municipais, decretos, portarias, LGPD, dados abertos e integridade.",
        modulos: [
            { icon: HeartPulse, titulo: "Recursos da Saúde", desc: "Investimentos, repasses do SUS e execuções financeiras da Saúde.", href: "/transparencia/saude", badge: "SAÚDE", tipoCriterio: "ESSENCIAL", cor: "from-rose-500 to-red-650" },
            { icon: Building, titulo: "Unidades de Saúde", desc: "Informações, contatos e funcionamento da rede municipal de saúde.", href: "/transparencia/unidades-saude", badge: "UNIDADES", tipoCriterio: "OBRIGATÓRIO", cor: "from-blue-500 to-cyan-600" },
            { icon: Pill, titulo: "Medicamentos SUS", desc: "Lista de remédios disponíveis na rede do SUS e controle de estoques.", href: "/transparencia/medicamentos-sus", badge: "FARMÁCIA", tipoCriterio: "OBRIGATÓRIO", cor: "from-emerald-500 to-teal-600" },
            { icon: Activity, titulo: "Central de Regulação", desc: "Agendamentos de exames, filas e regulação das especialidades.", href: "/transparencia/central-regulacao", badge: "EXAMES", tipoCriterio: "OBRIGATÓRIO", cor: "from-orange-500 to-amber-600" },
            { icon: Heart, titulo: "Plano de Saúde", desc: "Diretrizes, metas e metas estratégicas de saúde do município.", href: "/transparencia/plano-saude", badge: "PLANO", tipoCriterio: "OBRIGATÓRIO", cor: "from-pink-500 to-rose-600" },
            { icon: GraduationCap, titulo: "Plano de Educação", desc: "Diretrizes e metas do Plano Municipal de Educação.", href: "/transparencia/plano-educacao", badge: "ENSINO", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-600 to-orange-700" },
            { icon: Files, titulo: "Leis Municipais", desc: "Legislação completa aprovada pelo legislativo e executivo.", href: "/transparencia/leis", badge: "LEGISLAÇÃO", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-purple-700" },
            { icon: FileText, titulo: "Decretos Municipais", desc: "Atos normativos assinados pelo poder executivo do município.", href: "/transparencia/decretos", badge: "ATOS", tipoCriterio: "ESSENCIAL", cor: "from-slate-600 to-slate-800" },
            { icon: ScrollText, titulo: "Portarias Executivas", desc: "Atos administrativos de provimento, nomeações e atribuições.", href: "/transparencia/portarias", badge: "PORTARIAS", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-blue-800" },
            { icon: ShieldCheck, titulo: "LGPD", desc: "Encarregado pelo tratamento de dados e canal de requisições de privacidade.", href: "/transparencia/lgpd", badge: "PRIVACIDADE", tipoCriterio: "ESSENCIAL", cor: "from-emerald-500 to-green-700" },
            { icon: Presentation, titulo: "Dados Abertos", desc: "Arquivos estruturados (CSV, JSON, XML) para livre importação.", href: "/transparencia/dados-abertos", badge: "FORMATO-ABERTO", tipoCriterio: "RECOMENDADO", cor: "from-orange-500 to-amber-600" },
            { icon: ShieldCheck, titulo: "Integridade Pública", desc: "Código de conduta ética, conformidade e combate ao desvio de conduta.", href: "/transparencia/integridade", badge: "GOVERNANÇA", tipoCriterio: "OBRIGATÓRIO", cor: "from-emerald-600 to-teal-700" },
            { icon: Search, titulo: "Radar de Transparência", desc: "Notas de avaliação do município no Radar Nacional da Atricon.", href: "/transparencia/radar", badge: "PNTP", tipoCriterio: "RECOMENDADO", cor: "from-blue-800 to-slate-900" }
        ]
    }
];



export default function TransparenciaPage() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCriterio, setSelectedCriterio] = useState<string>("TODOS");
    const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
    const [configs, setConfigs] = useState<Record<string, string>>({
        transparencia_pntp_ativo: "false",
        transparencia_pntp_indice: "98.5%",
        transparencia_pntp_selo: "SELO DIAMANTE",
        transparencia_pntp_essenciais: "28 Módulos",
        transparencia_pntp_obrigatorios: "23 Módulos",
        transparencia_pntp_recomendados: "15 Módulos"
    });
    const modulesGridRef = useRef<HTMLDivElement>(null);

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
        async function loadConfigs() {
            try {
                const res = await fetch("/api/admin/configuracoes");
                if (res.ok) {
                    const data = await res.json();
                    const pntpConfigs: Record<string, string> = {};
                    data.forEach((c: any) => {
                        if (c.chave.startsWith("transparencia_pntp_")) {
                            pntpConfigs[c.chave] = c.valor;
                        }
                    });
                    setConfigs(prev => ({ ...prev, ...pntpConfigs }));
                }
            } catch (error) {
                console.error("Erro ao carregar configurações:", error);
            }
        }
        loadExternalLinks();
        loadConfigs();
    }, []);

    // Estatísticas dinâmicas dos critérios (essenciais, obrigatórios, recomendados)
    const countEssencial = categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.filter(m => m.tipoCriterio === "ESSENCIAL").length, 0);
    const countObrigatorio = categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.filter(m => m.tipoCriterio === "OBRIGATÓRIO").length, 0);
    const countRecomendado = categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.filter(m => m.tipoCriterio === "RECOMENDADO").length, 0);

    // Filtragem dinâmica baseada nos critérios e categorias
    const filteredCategories = categoriasDeModulos.map(cat => {
        const matchesCategory = selectedCategory === "TODAS" || cat.tituloCategoria === selectedCategory;
        
        if (!matchesCategory) {
            return { ...cat, modulos: [] };
        }

        const filteredModulos = cat.modulos.filter(m => {
            const matchesSearch = 
                m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.tipoCriterio.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCriterio = 
                selectedCriterio === "TODOS" || 
                m.tipoCriterio === selectedCriterio;

            return matchesSearch && matchesCriterio;
        });

        return {
            ...cat,
            modulos: filteredModulos
        };
    }).filter(cat => cat.modulos.length > 0);

    const hasResults = filteredCategories.length > 0;

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setTimeout(() => {
            if (modulesGridRef.current) {
                modulesGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    // Helper para destacar o texto buscado
    const highlightText = (text: string, search: string) => {
        if (!search) return text;
        const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
        return (
            <>
                {parts.map((part, i) => 
                    part.toLowerCase() === search.toLowerCase() 
                        ? <mark key={i} className="bg-amber-100 text-amber-950 font-semibold px-0.5 rounded transition-all">{part}</mark> 
                        : part
                )}
            </>
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif] text-slate-800">
            <PageHeader
                title="Portal da Transparência"
                subtitle={`Acesso integral aos dados públicos, fiscalização social e prestação de contas de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`}
                variant="premium"
                icon={<Landmark className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-40 pb-32">

                {/* 1. Painel de Conformidade (Transparômetro Dinâmico) */}
                {configs.transparencia_pntp_ativo === "true" && (
                    <motion.div 
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 mb-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Indicador Radial do Selo */}
                            <div className="lg:col-span-4 bg-slate-950 text-white rounded-[2rem] p-8 relative flex flex-col justify-between overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-650/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                                
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6 flex items-center gap-2 border border-cyan-500/20 px-4 py-1.5 rounded-full bg-cyan-500/5">
                                        <ShieldCheck size={12} className="text-cyan-400" /> PNTP Metodologia 2026
                                    </div>

                                    {/* Circular Progress */}
                                    <div className="relative flex items-center justify-center my-4 group">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="52"
                                                className="stroke-slate-800"
                                                strokeWidth="6"
                                                fill="transparent"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="52"
                                                className="stroke-cyan-400 transition-all duration-1000"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={2 * Math.PI * 52}
                                                strokeDashoffset={2 * Math.PI * 52 * (1 - parseFloat(configs.transparencia_pntp_indice.replace(",", ".").replace("%", "")) / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-3xl font-black text-white leading-none tracking-tight">{configs.transparencia_pntp_indice}</span>
                                            <span className="text-[9px] font-black text-cyan-400 tracking-widest mt-1 uppercase">ÍNDICE</span>
                                        </div>
                                    </div>

                                    {configs.transparencia_pntp_selo !== "SEM SELO" && (
                                        <div className="mt-4">
                                            <h4 className="text-md font-black text-white uppercase tracking-wider flex items-center gap-1.5 justify-center">
                                                <Sparkles size={16} className="text-amber-400 animate-pulse" /> {configs.transparencia_pntp_selo}
                                            </h4>
                                            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1 max-w-[200px] mx-auto leading-relaxed">
                                                Grau de Transparência Pública Recomendado pela ATRICON
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[8px] font-black text-white/40 tracking-widest uppercase">
                                    <span>ÚLTIMA AUDITORIA: 2026</span>
                                    <span className="text-emerald-400">ATIVO</span>
                                </div>
                            </div>

                            {/* Filtros por Classificação de Critério */}
                            <div className="lg:col-span-8 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-2 pl-1">Auditoria e Requisitos Legais</span>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                                        Classificação por <span className="text-slate-400 italic">Rigor de Critério</span>
                                    </h3>
                                    <p className="text-slate-500 font-semibold text-xs leading-relaxed max-w-xl mb-6">
                                        A cartilha de avaliação classifica os dados pelo nível de impacto legal. Clique nos contadores abaixo para isolar instantaneamente os módulos na visualização:
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* CARD ESSENCIAL */}
                                    <button
                                        onClick={() => setSelectedCriterio(selectedCriterio === "ESSENCIAL" ? "TODOS" : "ESSENCIAL")}
                                        className={`p-5 rounded-[2rem] border text-left transition-all duration-300 relative overflow-hidden group ${
                                            selectedCriterio === "ESSENCIAL"
                                                ? "bg-gradient-to-br from-red-500 to-rose-600 text-white border-transparent shadow-xl shadow-red-500/20"
                                                : "bg-red-50/50 hover:bg-red-50 hover:border-red-200 border-red-100 text-slate-900 shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCriterio === "ESSENCIAL" ? "bg-white/20" : "bg-red-100 text-red-600"}`}>
                                                <ShieldAlert size={20} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${selectedCriterio === "ESSENCIAL" ? "bg-white/20 text-white" : "bg-red-100 text-red-700"}`}>
                                                NÍVEL 1
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest block ${selectedCriterio === "ESSENCIAL" ? "text-red-100" : "text-slate-400"}`}>Essenciais</span>
                                        <span className="text-2xl font-black tracking-tight leading-none mt-1 block">{configs.transparencia_pntp_essenciais}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest mt-3 flex items-center gap-1.5 ${selectedCriterio === "ESSENCIAL" ? "text-white" : "text-red-600"}`}>
                                            <Check size={10} /> {selectedCriterio === "ESSENCIAL" ? "FILTRO ATIVO" : "CLIQUE PARA FILTRAR"}
                                        </span>
                                    </button>

                                    {/* CARD OBRIGATÓRIO */}
                                    <button
                                        onClick={() => setSelectedCriterio(selectedCriterio === "OBRIGATÓRIO" ? "TODOS" : "OBRIGATÓRIO")}
                                        className={`p-5 rounded-[2rem] border text-left transition-all duration-300 relative overflow-hidden group ${
                                            selectedCriterio === "OBRIGATÓRIO"
                                                ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent shadow-xl shadow-amber-500/20"
                                                : "bg-amber-50/50 hover:bg-amber-50 hover:border-amber-200 border-amber-100 text-slate-900 shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCriterio === "OBRIGATÓRIO" ? "bg-white/20" : "bg-amber-100 text-amber-600"}`}>
                                                <FileSearch size={20} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${selectedCriterio === "OBRIGATÓRIO" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                                                NÍVEL 2
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest block ${selectedCriterio === "OBRIGATÓRIO" ? "text-amber-100" : "text-slate-400"}`}>Obrigatórios</span>
                                        <span className="text-2xl font-black tracking-tight leading-none mt-1 block">{configs.transparencia_pntp_obrigatorios}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest mt-3 flex items-center gap-1.5 ${selectedCriterio === "OBRIGATÓRIO" ? "text-white" : "text-amber-600"}`}>
                                            <Check size={10} /> {selectedCriterio === "OBRIGATÓRIO" ? "FILTRO ATIVO" : "CLIQUE PARA FILTRAR"}
                                        </span>
                                    </button>

                                    {/* CARD RECOMENDADO */}
                                    <button
                                        onClick={() => setSelectedCriterio(selectedCriterio === "RECOMENDADO" ? "TODOS" : "RECOMENDADO")}
                                        className={`p-5 rounded-[2rem] border text-left transition-all duration-300 relative overflow-hidden group ${
                                            selectedCriterio === "RECOMENDADO"
                                                ? "bg-gradient-to-br from-blue-500 to-indigo-650 text-white border-transparent shadow-xl shadow-blue-500/20"
                                                : "bg-blue-50/50 hover:bg-blue-50 hover:border-blue-200 border-blue-100 text-slate-900 shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedCriterio === "RECOMENDADO" ? "bg-white/20" : "bg-blue-100 text-blue-600"}`}>
                                                <Sparkles size={20} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${selectedCriterio === "RECOMENDADO" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                                                BOAS PRÁTICAS
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest block ${selectedCriterio === "RECOMENDADO" ? "text-blue-100" : "text-slate-400"}`}>Recomendados</span>
                                        <span className="text-2xl font-black tracking-tight leading-none mt-1 block">{configs.transparencia_pntp_recomendados}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-widest mt-3 flex items-center gap-1.5 ${selectedCriterio === "RECOMENDADO" ? "text-white" : "text-blue-600"}`}>
                                            <Check size={10} /> {selectedCriterio === "RECOMENDADO" ? "FILTRO ATIVO" : "CLIQUE PARA FILTRAR"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}



                {/* 3. Índice Visual de Dimensões (NOVO HUB DE NAVEGAÇÃO INTERATIVO) */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-650">
                                <LayoutGrid size={20} />
                            </span>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Navegue por Dimensão Temática</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Clique em uma dimensão para filtrar e focar nos seus módulos</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedCategory("TODAS")}
                            className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                selectedCategory === "TODAS"
                                    ? "bg-slate-950 border-transparent text-white shadow-lg"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                        >
                            Ver Todas as Áreas
                        </button>
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                        {categoriasDeModulos.map((cat, idx) => {
                            const isSelected = selectedCategory === cat.tituloCategoria;
                            const countItems = cat.modulos.length;
                            return (
                                <button
                                    key={cat.tituloCategoria}
                                    onClick={() => handleCategorySelect(cat.tituloCategoria)}
                                    className={`p-5 rounded-[1.8rem] border text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                                        isSelected
                                            ? "bg-gradient-to-br from-indigo-600 to-indigo-850 text-white border-transparent shadow-xl shadow-indigo-600/25"
                                            : "bg-slate-50/50 hover:bg-white border-slate-200/60 hover:border-indigo-150 text-slate-850 hover:shadow-lg hover:shadow-slate-100"
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full mb-6">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-white/20" : "bg-indigo-50 text-indigo-650"}`}>
                                            <cat.icon size={16} />
                                        </div>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"}`}>
                                            {countItems} {countItems === 1 ? "MÓDULO" : "MÓDULOS"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? "text-indigo-200" : "text-indigo-650"} block mb-1`}>
                                            ÁREA {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                        </span>
                                        <h5 className="text-[10px] font-black uppercase tracking-tight leading-snug line-clamp-2">
                                            {cat.tituloCategoria}
                                        </h5>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* 4. Barra de Busca */}
                <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-100/80 border border-slate-100 mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                        {/* Campo de Pesquisa */}
                        <div className="flex-1 relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-650 transition-colors">
                                <Search size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Busque pelo nome do módulo, termo ou descrição (ex: 'folha', 'diárias', 'obras')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-16 pr-12 py-5 text-xs font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white focus:border-indigo-600/30 transition-all shadow-inner"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-800 transition-colors"
                                >
                                    LIMPAR
                                </button>
                            )}
                        </div>

                        {/* Dropdown Auxiliar */}
                        <div className="lg:w-80 relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-indigo-600/5 focus-within:bg-white focus-within:border-indigo-600/30 transition-all">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-transparent font-bold text-xs uppercase outline-none text-slate-700 cursor-pointer pr-4"
                            >
                                <option value="TODAS">Filtro: Todas as Áreas Temáticas</option>
                                {categoriasDeModulos.map(cat => (
                                    <option key={cat.tituloCategoria} value={cat.tituloCategoria}>
                                        {cat.tituloCategoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Badge de Filtros Ativos */}
                    {(searchTerm || selectedCriterio !== "TODOS" || selectedCategory !== "TODAS") && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Filtros Ativos:</span>
                                {selectedCriterio !== "TODOS" && (
                                    <span className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                        Rigor: {selectedCriterio}
                                    </span>
                                )}
                                {selectedCategory !== "TODAS" && (
                                    <span className="flex items-center gap-1 bg-cyan-50 border border-cyan-100 text-cyan-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                        Área: {selectedCategory}
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                        Busca: "{searchTerm}"
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCriterio("TODOS");
                                    setSelectedCategory("TODAS");
                                }}
                                className="text-[9px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-850 hover:underline transition-all"
                            >
                                Limpar Todos os Filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* Seção Principal de Cards */}
                <div ref={modulesGridRef} className="scroll-mt-6">
                    {hasResults ? (
                        <div className="space-y-20">
                            {filteredCategories.map((categoria, catIdx) => {
                                const slug = categoria.tituloCategoria.toLowerCase().replace(/[^a-z0-9]/g, "-");
                                if (categoria.modulos.length === 0) return null;

                                return (
                                    <motion.section 
                                        id={slug}
                                        key={categoria.tituloCategoria}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-120px" }}
                                        variants={containerVariants}
                                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/10"
                                    >
                                        {/* Título da Seção */}
                                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
                                            <div className="max-w-3xl">
                                                <motion.div variants={itemVariants} className="flex items-center gap-4 mb-3">
                                                    <span className="px-4 py-1.5 bg-slate-950 text-white rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-lg shadow-slate-950/20">
                                                        ÁREA TEMÁTICA {catIdx + 1 < 10 ? `0${catIdx + 1}` : catIdx + 1}
                                                    </span>
                                                    <div className="h-0.5 w-10 bg-indigo-650 rounded-full" />
                                                </motion.div>
                                                <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2 leading-none">
                                                    {categoria.tituloCategoria}
                                                </motion.h2>
                                                <motion.p variants={itemVariants} className="text-slate-400 font-bold uppercase tracking-wider text-[9px] leading-relaxed max-w-2xl opacity-90">
                                                    {categoria.desc}
                                                </motion.p>
                                            </div>
                                            <motion.div variants={itemVariants}>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-500 shadow-inner">
                                                    <FileSearch size={12} className="text-indigo-650" /> {categoria.modulos.length} {categoria.modulos.length === 1 ? "Módulo" : "Módulos"}
                                                </div>
                                            </motion.div>
                                        </div>
                                        
                                        {/* Grid de Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {categoria.modulos.map((m) => {
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
                                                        whileHover={{ y: -6, transition: { duration: 0.3 } }}
                                                    >
                                                        <Link 
                                                            href={finalHref} 
                                                            target={isExternal ? "_blank" : undefined}
                                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                                            className="group relative flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(30,41,59,0.08)] hover:border-indigo-600/10 transition-all duration-500 overflow-hidden"
                                                        >
                                                            {/* Header do Card (Gradiente de Identificação) */}
                                                            <div className={`h-20 bg-gradient-to-br ${m.cor} relative p-5 flex items-start justify-between`}>
                                                                <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px]" />
                                                                <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                                                                    <m.icon size={80} strokeWidth={1} />
                                                                </div>
                                                                <span className={`relative z-10 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-inner backdrop-blur-md ${
                                                                    m.tipoCriterio === "ESSENCIAL" 
                                                                        ? "bg-red-500/20 border-red-400/30 text-red-100" 
                                                                        : m.tipoCriterio === "OBRIGATÓRIO"
                                                                        ? "bg-amber-500/20 border-amber-400/30 text-amber-100"
                                                                        : "bg-blue-500/20 border-blue-400/30 text-blue-100"
                                                                }`}>
                                                                    {m.tipoCriterio}
                                                                </span>
                                                                <span className="relative z-10 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-white/20 shadow-sm">
                                                                    {m.badge}
                                                                </span>
                                                            </div>

                                                            {/* Ícone Flutuante */}
                                                            <div className="absolute top-10 left-6 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105">
                                                                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-slate-200/50 flex items-center justify-center border border-slate-50 group-hover:shadow-indigo-650/10 transition-all">
                                                                    <m.icon className="text-slate-900 group-hover:text-indigo-650 transition-colors" size={24} />
                                                                </div>
                                                            </div>

                                                            {/* Conteúdo do Card */}
                                                            <div className="px-6 pt-9 pb-6 flex flex-col flex-1 bg-white">
                                                                <h3 className="text-xs font-black text-slate-900 group-hover:text-indigo-650 transition-colors tracking-tight leading-snug mb-3 uppercase mt-2">
                                                                    {highlightText(m.titulo, searchTerm)}
                                                                </h3>
                                                                <p className="text-slate-400 text-[9px] font-semibold uppercase tracking-wider leading-relaxed mb-8 opacity-90 grow line-clamp-3">
                                                                    {highlightText(m.desc, searchTerm)}
                                                                </p>

                                                                {/* Footer de Acesso */}
                                                                <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                                                                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-indigo-650 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-300">
                                                                        ACESSAR BASE
                                                                    </span>
                                                                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-950 transition-all duration-350 shadow-inner group-hover:rotate-[360deg]">
                                                                        <ArrowRight size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {isExternal && (
                                                                <div className="absolute bottom-2.5 left-6">
                                                                    <span className="flex items-center gap-1.5 text-[7px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                                                                        <ExternalLink size={6} /> SISTEMA INTEGRADO
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Link>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.section>
                                );
                            })}
                        </div>
                    ) : (
                        /* Feedback Sem Resultados */
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200"
                        >
                            <div className="w-16 h-16 bg-slate-50 text-slate-350 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <Info size={28} />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-2">Nenhum módulo encontrado</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider max-w-md mx-auto mb-8">
                                Não encontramos nenhum item correspondente aos filtros ativos ou termo digitado: "{searchTerm}".
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCriterio("TODOS");
                                    setSelectedCategory("TODAS");
                                }}
                                className="bg-slate-950 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                Limpar Todos os Filtros
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Hub Footer - Ultra Premium */}
            <div className="relative py-24 overflow-hidden bg-slate-950 border-t border-slate-900">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-650/10 rounded-full blur-[120px]" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <Landmark className="text-white" size={40} />
                                <div className="h-8 w-px bg-white/15" />
                                <div className="text-left">
                                    <div className="text-white font-black text-md uppercase tracking-[0.25em] leading-none mb-1">Portal da Transparência</div>
                                    <div className="text-white/30 text-[9px] uppercase font-bold tracking-[0.2em]">{MUNICIPIO.nome} - {MUNICIPIO.uf}</div>
                                </div>
                            </div>
                            <h4 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-6 leading-tight italic">
                                Transparência Ativa e <br/> <span className="text-cyan-400">Controle Social do Cidadão.</span>
                            </h4>
                            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em] leading-relaxed max-w-lg mb-8 italic border-l border-white/10 pl-6">
                                Em cumprimento à Lei Federal nº 12.527/2011 (Lei de Acesso à Informação) e ao Programa Nacional de Transparência Pública, garantimos a integridade e atualização dos atos oficiais municipais.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/contato" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:text-white transition-all active:scale-95 shadow-md">Suporte e Dúvidas</Link>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/5 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                                <ShieldCheck size={140} className="text-white" />
                            </div>
                            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Certificações de Acesso
                            </h5>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "ACERVO DIGITAL", val: MUNICIPIO.email.split("@")[1] },
                                    { label: "RADAR PNTP", val: "SELO DIAMANTE" },
                                    { label: "AUDITOR", val: "TCE/RN" },
                                    { label: "TIPO DADOS", val: "DADOS ABERTOS" },
                                ].map((stat) => (
                                    <div key={stat.label} className="border-l border-white/10 pl-5 group/stat cursor-default">
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 group-hover/stat:text-cyan-400 transition-colors">{stat.label}</p>
                                        <p className="text-[11px] font-black text-white/50 group-hover/stat:text-white transition-colors uppercase tracking-widest">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.25em]">
                            © {new Date().getFullYear()} PREFEITURA DE {MUNICIPIO.nome.toUpperCase()}/{MUNICIPIO.uf} • CNPJ: {MUNICIPIO.cnpj}
                        </p>
                        <div className="flex gap-8">
                            {["Privacidade", "Termos", "Ouvidoria"].map(l => (
                                <Link key={l} href="#" className="text-white/20 hover:text-white transition-colors text-[8px] font-black uppercase tracking-widest">{l}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
