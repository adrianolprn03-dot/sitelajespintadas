"use client";

import Link from "next/link";
import { 
    TrendingUp, BarChart3, Gavel, FileSignature, Handshake, 
    Plane, Users, FileBarChart, Scale, Database, Construction, 
    Users2, ClipboardList, HelpCircle, BookOpen, Files, 
    Building2, UserCircle2, MapPinned, Truck, Globe2, 
    ExternalLink, ArrowRight,
    Headset, FileText, ScrollText, Briefcase, Landmark, 
    Info, FileStack, Activity, ListOrdered, PhoneCall, 
    Link2, ShieldCheck, HeartPulse, Search, Sparkles, 
    FileSearch, Coins, Receipt, Building, 
    Heart, ClipboardCheck, BarChart, GraduationCap, 
    FileClock, UserPlus, UserCheck, FilePieChart, 
    Presentation, Megaphone, Accessibility, Shield, Pill, 
    Calendar, FileCheck, X, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState, useRef, useMemo } from "react";
import { MUNICIPIO } from "@/config/municipio";

// Módulos mais procurados pelo cidadão (Design fiel aos botões aprovados)
const servicosMaisProcurados = [
    {
        titulo: "Despesas Públicas",
        desc: "Empenhos, liquidações e pagamentos",
        href: "/transparencia/despesas",
        icon: Receipt,
        corBg: "bg-blue-50 text-blue-600 border-blue-100",
        tag: "Gastos",
        tagColor: "bg-blue-100/80 text-blue-700"
    },
    {
        titulo: "Receitas Públicas",
        desc: "Arrecadação e repasses constitucionais",
        href: "/transparencia/receitas",
        icon: Coins,
        corBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        tag: "Arrecadação",
        tagColor: "bg-emerald-100/80 text-emerald-700"
    },
    {
        titulo: "Licitações & Editais",
        desc: "Processos, atas, editais e julgamentos",
        href: "/transparencia/licitacoes",
        icon: Gavel,
        corBg: "bg-amber-50 text-amber-600 border-amber-100",
        tag: "Compras",
        tagColor: "bg-amber-100/80 text-amber-700"
    },
    {
        titulo: "Servidores & Folha",
        desc: "Cargos, salários e quadro funcional",
        href: "/transparencia/servidores",
        icon: Users,
        corBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        tag: "RH",
        tagColor: "bg-indigo-100/80 text-indigo-700"
    },
    {
        titulo: "Diárias de Viagem",
        desc: "Valores concedidos a agentes públicos",
        href: "/transparencia/diarias",
        icon: Plane,
        corBg: "bg-sky-50 text-sky-600 border-sky-100",
        tag: "Diárias",
        tagColor: "bg-sky-100/80 text-sky-700"
    },
    {
        titulo: "Contratos Públicos",
        desc: "Contratos firmados, aditivos e valores",
        href: "/transparencia/contratos",
        icon: FileSignature,
        corBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
        tag: "Contratos",
        tagColor: "bg-cyan-100/80 text-cyan-700"
    },
    {
        titulo: "e-SIC / LAI",
        desc: "Pedidos de acesso à informação pública",
        href: "/servicos/esic",
        icon: ClipboardList,
        corBg: "bg-rose-50 text-rose-600 border-rose-100",
        tag: "Cidadão",
        tagColor: "bg-rose-100/80 text-rose-700"
    },
    {
        titulo: "Medicamentos SUS",
        desc: "Lista de remédios e estoque na rede",
        href: "/transparencia/medicamentos-sus",
        icon: Pill,
        corBg: "bg-teal-50 text-teal-600 border-teal-100",
        tag: "Saúde",
        tagColor: "bg-teal-100/80 text-teal-700"
    }
];

// Divisão das Áreas Temáticas (Inspirada no modelo de Pau dos Ferros e diretrizes do PNTP)
const categoriasDeModulos = [
    {
        tituloCategoria: "Atendimento ao Cidadão & Ouvidoria",
        fundamentacaoLegal: "Lei Federal nº 12.527/2011 (LAI) • Lei Federal nº 13.460/2017 (Carta de Serviços)",
        icon: Headset,
        desc: "Canais oficiais de acesso à informação pública, ouvidoria municipal, carta de serviços, estatísticas da LAI e participação social.",
        corTema: "from-blue-600 to-indigo-700",
        modulos: [
            { icon: ClipboardList, titulo: "e-SIC (LAI)", desc: "Abertura e consulta de pedidos de acesso à informação pública (Lei 12.527).", href: "/servicos/esic", badge: "LAI", tipoCriterio: "ESSENCIAL" },
            { icon: Headset, titulo: "Ouvidoria Municipal", desc: "Canal oficial para manifestações, denúncias, elogios, reclamações e críticas.", href: "/servicos/ouvidoria", badge: "OUVIDORIA", tipoCriterio: "ESSENCIAL" },
            { icon: MapPinned, titulo: "Carta de Serviços", desc: "Catálogo descritivo de todos os serviços públicos ofertados ao cidadão.", href: "/transparencia/carta-servicos", badge: "CIDADÃO", tipoCriterio: "ESSENCIAL" },
            { icon: HelpCircle, titulo: "Transparência Passiva", desc: "Relatórios de estatísticas de acesso e respostas fornecidas via LAI.", href: "/transparencia/passiva", badge: "ESTATÍSTICA", tipoCriterio: "ESSENCIAL" },
            { icon: ClipboardCheck, titulo: "Pesquisa de Satisfação", desc: "Avaliação periódica dos serviços municipais pelos usuários e cidadãos.", href: "/transparencia/pesquisa-satisfacao", badge: "SATISFAÇÃO", tipoCriterio: "RECOMENDADO" },
            { icon: HelpCircle, titulo: "FAQ - Dúvidas Frequentes", desc: "Esclarecimentos de dúvidas comuns sobre a gestão pública e serviços municipais.", href: "/transparencia/faq", badge: "AJUDA", tipoCriterio: "RECOMENDADO" },
            { icon: BookOpen, titulo: "Glossário de Termos", desc: "Termos técnicos e conceitos utilizados na administração do portal.", href: "/transparencia/glossario", badge: "CONCEITOS", tipoCriterio: "RECOMENDADO" },
            { icon: PhoneCall, titulo: "Fale Conosco", desc: "Contatos telefônicos, e-mails e horários de atendimento dos órgãos municipais.", href: "/contato", badge: "CONTATOS", tipoCriterio: "OBRIGATÓRIO" }
        ]
    },
    {
        tituloCategoria: "Execução Orçamentária e Financeira",
        fundamentacaoLegal: "Lei Federal nº 12.527/2011 • Lei Complementar nº 131/2009 (Transparência da Gestão Fiscal)",
        icon: Coins,
        desc: "Execução de despesas, arrecadação de tributos em tempo real, fila cronológica de pagamentos e transferências financeiras.",
        corTema: "from-emerald-600 to-teal-700",
        modulos: [
            { icon: Receipt, titulo: "Despesas Públicas", desc: "Detalhamento de empenhos, liquidações e ordens de pagamento municipais.", href: "/transparencia/despesas", badge: "GASTOS", tipoCriterio: "ESSENCIAL" },
            { icon: Coins, titulo: "Receitas Públicas", desc: "Arrecadação municipal em tempo real, receitas tributárias e transferências.", href: "/transparencia/receitas", badge: "ARRECADAÇÃO", tipoCriterio: "ESSENCIAL" },
            { icon: ListOrdered, titulo: "Ordem Cronológica", desc: "Fila cronológica e execuções de pagamentos a credores e fornecedores.", href: "/transparencia/ordem-cronologica", badge: "TESOURARIA", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Database, titulo: "Repasses e Transferências", desc: "Transferências voluntárias, repasses constitucionais e recursos federais.", href: "/transparencia/transferencias", badge: "RECURSOS", tipoCriterio: "ESSENCIAL" },
            { icon: Globe2, titulo: "Emendas Parlamentares", desc: "Acompanhamento de emendas destinadas ao município (estaduais e federais).", href: "/transparencia/emendas", badge: "EMENDAS", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Coins, titulo: "Emendas PIX", desc: "Transferências especiais diretas do governo federal e destinação local.", href: "/transparencia/emendas-pix", badge: "PIX", tipoCriterio: "ESSENCIAL" },
            { icon: Scale, titulo: "Dívida Ativa", desc: "Controle de créditos a receber e cobranças tributárias do município.", href: "/transparencia/divida-ativa", badge: "COBRANÇA", tipoCriterio: "OBRIGATÓRIO" },
            { icon: FileSearch, titulo: "Renúncias Fiscais", desc: "Relatórios de incentivos tributários e renúncias de receitas municipais.", href: "/transparencia/renuncias-fiscais", badge: "ISENÇÃO", tipoCriterio: "OBRIGATÓRIO" },
            { icon: TrendingUp, titulo: "Desonerações", desc: "Detalhamento e relatórios de desonerações fiscais concedidas.", href: "/transparencia/desoneracoes", badge: "BENEFÍCIOS", tipoCriterio: "RECOMENDADO" },
            { icon: Sparkles, titulo: "Incentivos Culturais", desc: "Fomento à cultura por meio de incentivos e editais governamentais.", href: "/transparencia/incentivos-culturais", badge: "CULTURA", tipoCriterio: "RECOMENDADO" }
        ]
    },
    {
        tituloCategoria: "Licitações, Contratos e Obras",
        fundamentacaoLegal: "Lei Federal nº 14.133/2021 (Nova Lei de Licitações) • Lei Federal nº 8.666/1993",
        icon: Gavel,
        desc: "Processos licitatórios, compras públicas, atas de registro de preço, instrumentos contratuais e acompanhamento de obras.",
        corTema: "from-amber-600 to-orange-700",
        modulos: [
            { icon: Gavel, titulo: "Licitações", desc: "Editais, atas, julgamentos, homologações e recursos de certames públicos.", href: "/transparencia/licitacoes", badge: "CERTAMES", tipoCriterio: "ESSENCIAL" },
            { icon: Megaphone, titulo: "Editais Diversos", desc: "Chamamentos públicos, avisos e outros atos convocatórios da gestão.", href: "/transparencia/editais", badge: "AVISOS", tipoCriterio: "OBRIGATÓRIO" },
            { icon: FileStack, titulo: "Atas de Registro de Preços", desc: "Registro de preços vigente para aquisições públicas e contratações.", href: "/transparencia/atas-registro", badge: "SRP", tipoCriterio: "OBRIGATÓRIO" },
            { icon: FileSignature, titulo: "Contratos Administrativos", desc: "Instrumentos contratuais celebrados, aditivos, valores e prazos.", href: "/transparencia/contratos", badge: "CONTRATOS", tipoCriterio: "ESSENCIAL" },
            { icon: FileText, titulo: "Plano de Contratação Anual", desc: "Planejamento anual de contratações públicas municipais (Lei 14.133).", href: "/transparencia/plano-contratacao", badge: "PCA", tipoCriterio: "RECOMENDADO" },
            { icon: Handshake, titulo: "Convênios Celebrados", desc: "Parcerias, convênios estaduais, federais e transferências de recursos.", href: "/transparencia/convenios", badge: "PARCERIAS", tipoCriterio: "ESSENCIAL" },
            { icon: Construction, titulo: "Obras Públicas", desc: "Contratos de obras, medições, relatórios físicos e andamento das construções.", href: "/transparencia/obras", badge: "EXECUÇÃO", tipoCriterio: "ESSENCIAL" },
            { icon: Handshake, titulo: "Acordos Firmados", desc: "Acordos de cooperação técnica e ajustes sem repasse financeiro.", href: "/transparencia/acordos-firmados", badge: "ACORDOS", tipoCriterio: "RECOMENDADO" },
            { icon: Link2, titulo: "Associações e Parcerias", desc: "Repasses e parcerias firmadas com entidades de classe e consórcios.", href: "/transparencia/associacoes", badge: "ENTIDADES", tipoCriterio: "RECOMENDADO" }
        ]
    },
    {
        tituloCategoria: "Gestão de Pessoal e Diárias",
        fundamentacaoLegal: "Lei Federal nº 12.527/2011 • Quadro Funcional, Remunerações e Concessão de Diárias",
        icon: Users,
        desc: "Quadro de servidores da prefeitura, folha de pagamento, pessoal terceirizado, estagiários, concessão de diárias e concursos.",
        corTema: "from-sky-600 to-blue-700",
        modulos: [
            { icon: Users, titulo: "Servidores Públicos", desc: "Folha de pagamento, cargos, remunerações e servidores municipais.", href: "/transparencia/servidores", badge: "PESSOAL", tipoCriterio: "ESSENCIAL" },
            { icon: Plane, titulo: "Diárias de Viagem", desc: "Diárias e passagens concedidas a servidores e agentes públicos.", href: "/transparencia/diarias", badge: "DIÁRIAS", tipoCriterio: "ESSENCIAL" },
            { icon: FileClock, titulo: "Tabela de Diárias", desc: "Tabela com os valores vigentes de diárias por nível e localidade.", href: "/transparencia/tabela-diarias", badge: "VALORES", tipoCriterio: "OBRIGATÓRIO" },
            { icon: ScrollText, titulo: "Regulamentação de Diárias", desc: "Leis e decretos municipais que regulamentam a concessão de diárias.", href: "/transparencia/regulamentacao-diarias", badge: "REGULAMENTO", tipoCriterio: "OBRIGATÓRIO" },
            { icon: UserPlus, titulo: "Pessoal Terceirizado", desc: "Listagem de trabalhadores terceirizados prestando serviço municipal.", href: "/transparencia/terceirizados", badge: "TERCEIROS", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Briefcase, titulo: "Estagiários", desc: "Termos de estágio vigentes nos setores públicos do município.", href: "/transparencia/estagiarios", badge: "ESTÁGIO", tipoCriterio: "RECOMENDADO" },
            { icon: GraduationCap, titulo: "Concursos Públicos", desc: "Editais, convocações e homologações de concursos efetivos.", href: "/transparencia/concursos", badge: "CONCURSO", tipoCriterio: "OBRIGATÓRIO" },
            { icon: UserCheck, titulo: "Processos Seletivos", desc: "Processo Seletivo Simplificado (PSS) para contratações temporárias.", href: "/transparencia/processo-seletivo", badge: "PSS", tipoCriterio: "OBRIGATÓRIO" }
        ]
    },
    {
        tituloCategoria: "Transparência Fiscal e Contas Públicas",
        fundamentacaoLegal: "Lei Complementar nº 101/2000 (Lei de Responsabilidade Fiscal - LRF)",
        icon: Landmark,
        desc: "Instrumentos de planejamento (LOA, LDO, PPA), demonstrativos fiscais da LRF, prestação de contas anual e pareceres do TCE.",
        corTema: "from-slate-700 to-slate-900",
        modulos: [
            { icon: Landmark, titulo: "Planejamento Orçamentário", desc: "Instrumentos de planejamento municipal: LOA, LDO e PPA.", href: "/transparencia/orcamento", badge: "PLANEJAMENTO", tipoCriterio: "ESSENCIAL" },
            { icon: BarChart3, titulo: "Relatórios da LRF", desc: "Demonstrativos fiscais exigidos pela LRF: RREO e RGF.", href: "/transparencia/lrf", badge: "FISCAL", tipoCriterio: "ESSENCIAL" },
            { icon: FilePieChart, titulo: "Prestação de Contas", desc: "Balanços contábeis e demonstrativos financeiros anuais.", href: "/transparencia/prestacao-contas", badge: "CONTABILIDADE", tipoCriterio: "ESSENCIAL" },
            { icon: BarChart, titulo: "Contas de Governo (PCG)", desc: "Prestação de contas anual do chefe do poder executivo municipal.", href: "/transparencia/pcg", badge: "GOVERNO", tipoCriterio: "ESSENCIAL" },
            { icon: FileBarChart, titulo: "Contas de Gestão (PCS)", desc: "Relatórios de prestação de contas dos administradores de fundos e órgãos.", href: "/transparencia/pcs", badge: "GESTÃO", tipoCriterio: "ESSENCIAL" },
            { icon: Gavel, titulo: "Julgamento de Contas", desc: "Julgamentos realizados pela Câmara Municipal sobre as contas do executivo.", href: "/transparencia/julgamento-contas", badge: "CÂMARA", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Scale, titulo: "Parecer Técnico do TCE", desc: "Pareceres emitidos pelo Tribunal de Contas sobre a contabilidade local.", href: "/transparencia/parecer-tce", badge: "TCE-RN", tipoCriterio: "OBRIGATÓRIO" },
            { icon: ClipboardList, titulo: "Relatório de Gestão", desc: "Metas físicas, financeiras e atividades desenvolvidas pela gestão.", href: "/transparencia/relatorio-gestao", badge: "RESULTADOS", tipoCriterio: "RECOMENDADO" },
            { icon: Users, titulo: "Conselhos Municipais", desc: "Pautas, composições, atas de reunião e atos dos Conselhos e do FUNDEB.", href: "/transparencia/conselhos", badge: "PARTICIPAÇÃO", tipoCriterio: "OBRIGATÓRIO" }
        ]
    },
    {
        tituloCategoria: "Informações Institucionais e Governança",
        fundamentacaoLegal: "Lei Federal nº 12.527/2011 • Estrutura Administrativa, Gestores e Governo Digital",
        icon: Building2,
        desc: "Identificação da entidade pública, competências legais, estrutura administrativa, contatos oficiais, frota e símbolos.",
        corTema: "from-blue-600 to-indigo-800",
        modulos: [
            { icon: Building2, titulo: "Institucional", desc: "Dados gerais e identificação da entidade municipal.", href: "/transparencia/institucional", badge: "ENTIDADE", tipoCriterio: "ESSENCIAL" },
            { icon: FileText, titulo: "Competências", desc: "Atribuições e funções legais do município.", href: "/transparencia/competencias", badge: "LEGAL", tipoCriterio: "ESSENCIAL" },
            { icon: Users2, titulo: "Organograma", desc: "Estrutura organizacional e administrativa da prefeitura.", href: "/transparencia/institucional", badge: "ESTRUTURA", tipoCriterio: "ESSENCIAL" },
            { icon: MapPinned, titulo: "Localização e Contatos", desc: "Endereços, telefones, e-mails e contatos das sedes públicas.", href: "/transparencia/institucional", badge: "CONTATOS", tipoCriterio: "ESSENCIAL" },
            { icon: UserCircle2, titulo: "Gestores Municipais", desc: "Identificação dos responsáveis por cada setor e secretaria.", href: "/transparencia/gestores", badge: "CONTATOS", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Truck, titulo: "Frota Municipal", desc: "Relação de veículos oficiais próprios, locados ou cedidos.", href: "/transparencia/frota", badge: "VEÍCULOS", tipoCriterio: "RECOMENDADO" },
            { icon: Accessibility, titulo: "Acessibilidade", desc: "Ferramentas e recursos de acessibilidade digital do portal.", href: "/transparencia/acessibilidade", badge: "INCLUSÃO", tipoCriterio: "OBRIGATÓRIO" },
            { icon: ShieldCheck, titulo: "Governo Digital", desc: "Desburocratização e oferta de serviços públicos por meios digitais.", href: "/transparencia/governo-digital", badge: "TECNOLOGIA", tipoCriterio: "RECOMENDADO" },
            { icon: Sparkles, titulo: "Símbolos Municipais", desc: `Brasão, bandeira, hino oficial e marcos de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`, href: "/transparencia/simbolos", badge: "HISTÓRIA", tipoCriterio: "RECOMENDADO" }
        ]
    },
    {
        tituloCategoria: "Legislação, Atos Oficiais e Privacidade",
        fundamentacaoLegal: "Atos Normativos Municipais, Legislação Vigente, LGPD (Lei 13.709/2018) e Integridade Pública",
        icon: Scale,
        desc: "Legislação municipal consolidada, leis ordinárias e complementares, decretos executivos, portarias, LGPD e dados abertos.",
        corTema: "from-indigo-600 to-purple-800",
        modulos: [
            { icon: Scale, titulo: "Legislação Municipal", desc: "Portal consolidado de atos normativos, leis orgânicas e regulamentações.", href: "/transparencia/legislacao", badge: "LEGISLAÇÃO", tipoCriterio: "ESSENCIAL" },
            { icon: Files, titulo: "Leis Municipais", desc: "Legislação completa aprovada pelo legislativo e executivo municipal.", href: "/transparencia/leis", badge: "LEIS", tipoCriterio: "ESSENCIAL" },
            { icon: FileText, titulo: "Decretos Municipais", desc: "Atos normativos regulamentares assinados pelo chefe do executivo.", href: "/transparencia/decretos", badge: "DECRETOS", tipoCriterio: "ESSENCIAL" },
            { icon: ScrollText, titulo: "Portarias Executivas", desc: "Atos administrativos de provimento, nomeações, delegações e atribuições.", href: "/transparencia/portarias", badge: "PORTARIAS", tipoCriterio: "ESSENCIAL" },
            { icon: ShieldCheck, titulo: "LGPD & Privacidade", desc: "Encarregado pelo tratamento de dados pessoais (DPO) e requisições de privacidade.", href: "/transparencia/lgpd", badge: "PRIVACIDADE", tipoCriterio: "ESSENCIAL" },
            { icon: Shield, titulo: "Integridade Pública", desc: "Código de conduta ética, plano de integridade, conformidade e governança.", href: "/transparencia/integridade", badge: "GOVERNANÇA", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Presentation, titulo: "Dados Abertos", desc: "Arquivos e catálogos em formatos abertos e estruturados (CSV, JSON, XML).", href: "/transparencia/dados-abertos", badge: "FORMATO-ABERTO", tipoCriterio: "RECOMENDADO" },
            { icon: Search, titulo: "Radar de Transparência", desc: "Notas de avaliação do município no Radar Nacional de Transparência Pública (PNTP).", href: "/transparencia/radar", badge: "PNTP", tipoCriterio: "RECOMENDADO" }
        ]
    },
    {
        tituloCategoria: "Saúde Pública e Educação",
        fundamentacaoLegal: "Transparência Finalística da Saúde Municipal (SUS) e da Educação Básica",
        icon: HeartPulse,
        desc: "Transparência finalística da saúde municipal, unidades de atendimento, medicamentos SUS, exames, regulação e planos municipais.",
        corTema: "from-rose-600 to-red-700",
        modulos: [
            { icon: HeartPulse, titulo: "Recursos da Saúde", desc: "Investimentos, repasses do SUS e execuções financeiras da Saúde.", href: "/transparencia/saude", badge: "SAÚDE", tipoCriterio: "ESSENCIAL" },
            { icon: Building, titulo: "Unidades de Saúde", desc: "Informações, contatos e funcionamento da rede municipal de saúde.", href: "/transparencia/unidades-saude", badge: "UNIDADES", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Pill, titulo: "Medicamentos SUS", desc: "Lista de remédios disponíveis na rede do SUS e controle de estoques.", href: "/transparencia/medicamentos-sus", badge: "FARMÁCIA", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Activity, titulo: "Central de Regulação", desc: "Agendamentos de exames, filas e regulação das especialidades.", href: "/transparencia/central-regulacao", badge: "EXAMES", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Heart, titulo: "Plano de Saúde", desc: "Diretrizes, metas e metas estratégicas de saúde do município.", href: "/transparencia/plano-saude", badge: "PLANO", tipoCriterio: "OBRIGATÓRIO" },
            { icon: Calendar, titulo: "Programação Anual de Saúde", desc: "Programação anual de ações, metas e alocação de recursos do SUS (PAS).", href: "/transparencia/programacao-anual-saude", badge: "PAS", tipoCriterio: "OBRIGATÓRIO" },
            { icon: FileCheck, titulo: "Relatório Anual de Gestão", desc: "Relatório de prestação de contas comprovando a execução da PAS e parecer CMS (RAG).", href: "/transparencia/relatorio-anual-gestao", badge: "RAG", tipoCriterio: "OBRIGATÓRIO" },
            { icon: GraduationCap, titulo: "Unidades Escolares", desc: "Escolas e creches municipais, contatos, horários e declaração de vagas.", href: "/unidades-escolares", badge: "UNIDADES", tipoCriterio: "OBRIGATÓRIO" },
            { icon: GraduationCap, titulo: "Plano de Educação", desc: "Diretrizes e metas do Plano Municipal de Educação.", href: "/transparencia/plano-educacao", badge: "ENSINO", tipoCriterio: "OBRIGATÓRIO" }
        ]
    }
];

export default function TransparenciaPage() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
    const [selectedCriterio, setSelectedCriterio] = useState<string>("TODOS");
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
                    if (Array.isArray(data)) {
                        setLinksExternos(data.filter((l: any) => l?.categoria === "transparencia" || l?.categoria === "geral"));
                    }
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
                    if (Array.isArray(data)) {
                        const pntpConfigs: Record<string, string> = {};
                        data.forEach((c: any) => {
                            if (c?.chave && typeof c.chave === "string" && c.chave.startsWith("transparencia_pntp_")) {
                                pntpConfigs[c.chave] = c.valor || "";
                            }
                        });
                        setConfigs(prev => ({ ...prev, ...pntpConfigs }));
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar configurações:", error);
            }
        }
        loadExternalLinks();
        loadConfigs();
    }, []);

    const countTotalModulos = useMemo(() => {
        return categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.length, 0);
    }, []);

    // Filtragem dinâmica baseada nos critérios e categorias
    const filteredCategories = useMemo(() => {
        return categoriasDeModulos.map(cat => {
            const matchesCategory = selectedCategory === "TODAS" || cat.tituloCategoria === selectedCategory;
            
            if (!matchesCategory) {
                return { ...cat, modulos: [] };
            }

            const cleanSearch = searchTerm.trim().toLowerCase();

            const filteredModulos = cat.modulos.filter(m => {
                const matchesSearch = !cleanSearch ||
                    m.titulo.toLowerCase().includes(cleanSearch) ||
                    m.desc.toLowerCase().includes(cleanSearch) ||
                    m.badge.toLowerCase().includes(cleanSearch) ||
                    m.tipoCriterio.toLowerCase().includes(cleanSearch);
                
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
    }, [selectedCategory, searchTerm, selectedCriterio]);

    const totalResultados = useMemo(() => {
        return filteredCategories.reduce((acc, cat) => acc + cat.modulos.length, 0);
    }, [filteredCategories]);

    const hasResults = totalResultados > 0;

    // Helper para destacar o texto buscado
    const highlightText = (text: string, search: string) => {
        const cleanSearch = search.trim();
        if (!cleanSearch) return text;
        const parts = text.split(new RegExp(`(${cleanSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
        return (
            <>
                {parts.map((part, i) => 
                    part.toLowerCase() === cleanSearch.toLowerCase() 
                        ? <mark key={i} className="bg-amber-100 text-amber-900 font-bold px-1 py-0.5 rounded transition-all">{part}</mark> 
                        : part
                )}
            </>
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
    };

    const itemVariants = {
        hidden: { y: 12, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.25 } }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif] text-slate-800">
            {/* Header da Página */}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-40 pb-32">

                {/* 1. SEÇÃO EM DESTAQUE: MAIS PROCURADOS PELO CIDADÃO (DESIGN LIMPO ORIGINAL) */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
                                <Sparkles size={16} className="text-amber-500" />
                                <span>Acesso Direto</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                Mais Procurados pelo Cidadão
                            </h2>
                            <p className="text-slate-500 text-xs mt-0.5">
                                Atalhos imediatos para os serviços e consultas públicas com maior volume de buscas
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 hidden sm:block">
                            8 consultas prioritárias
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {servicosMaisProcurados.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${item.corBg}`}>
                                                <IconComponent size={20} />
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                                                {item.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                                            {item.titulo}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-primary-600 transition-colors">
                                        <span>Consultar</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* 2. BARRA DE PESQUISA E FILTRO UNIFICADO (LIMPO, SEM POLUIÇÃO VISUAL) */}
                <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/40 border border-slate-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch">
                        {/* Campo de Busca Principal */}
                        <div className="flex-1 relative group">
                            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                <Search size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Buscar nos módulos da transparência (ex: 'folha', 'diárias', 'licitações', 'obras')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:bg-white rounded-2xl pl-12 sm:pl-14 pr-11 py-3.5 text-sm font-semibold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm("")}
                                    title="Limpar pesquisa"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Seletor de Áreas Temáticas (Inspirado no modelo compacto) */}
                        <div className="md:w-72">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                aria-label="Filtrar por Área Temática"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer hover:bg-slate-100 transition-all truncate"
                            >
                                <option value="TODAS">Todas as Áreas ({countTotalModulos} módulos)</option>
                                {categoriasDeModulos.map(cat => (
                                    <option key={cat.tituloCategoria} value={cat.tituloCategoria}>
                                        {cat.tituloCategoria} ({cat.modulos.length})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Navegação Rápida em Linha Única por Áreas Temáticas (Sem quebra de linhas) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
                        <button
                            onClick={() => setSelectedCategory("TODAS")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                                selectedCategory === "TODAS"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                            }`}
                        >
                            <span>Todas as Áreas</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                selectedCategory === "TODAS" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                                {countTotalModulos}
                            </span>
                        </button>

                        {categoriasDeModulos.map((cat) => {
                            const isSelected = selectedCategory === cat.tituloCategoria;
                            const CatIcon = cat.icon;
                            return (
                                <button
                                    key={cat.tituloCategoria}
                                    onClick={() => setSelectedCategory(cat.tituloCategoria)}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                                        isSelected
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                                    }`}
                                >
                                    <CatIcon size={14} className={isSelected ? "text-primary-300" : "text-slate-400"} />
                                    <span>{cat.tituloCategoria}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                        isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                                    }`}>
                                        {cat.modulos.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback quando algum filtro estiver ativo */}
                    {(searchTerm || selectedCategory !== "TODAS") && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-slate-400">Filtrando por:</span>
                                {selectedCategory !== "TODAS" && (
                                    <span className="inline-flex items-center gap-1 bg-primary-50 border border-primary-200 text-primary-800 px-2.5 py-0.5 rounded-full font-medium">
                                        Área: {selectedCategory}
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                                        Busca: "{searchTerm}"
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("TODAS");
                                }}
                                className="text-rose-600 hover:text-rose-700 font-bold hover:underline"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </section>

                {/* 3. DIVISÃO DAS ÁREAS TEMÁTICAS (MODELO ESTRUTURADO DE PAU DOS FERROS) */}
                <div ref={modulesGridRef} className="scroll-mt-8 space-y-10">
                    {hasResults ? (
                        filteredCategories.map((categoria) => {
                            const slug = categoria.tituloCategoria.toLowerCase().replace(/[^a-z0-9]/g, "-");
                            const CatIcon = categoria.icon;

                            return (
                                <section 
                                    id={slug}
                                    key={categoria.tituloCategoria}
                                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/30"
                                >
                                    {/* Cabeçalho da Seção com Fundamentação Legal (Estilo Pau dos Ferros) */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                                        <div className="flex items-start gap-3.5">
                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br ${categoria.corTema} text-white shadow-md shadow-primary-900/10 shrink-0 mt-0.5`}>
                                                <CatIcon size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                                        {categoria.tituloCategoria}
                                                    </h2>
                                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                        {categoria.modulos.length} {categoria.modulos.length === 1 ? "módulo" : "módulos"}
                                                    </span>
                                                </div>
                                                <p className="text-primary-700 font-semibold text-xs mt-1">
                                                    {categoria.fundamentacaoLegal}
                                                </p>
                                                <p className="text-slate-400 text-xs mt-0.5 max-w-3xl leading-relaxed">
                                                    {categoria.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grade de Botões/Cards com o Design Original dos Botões */}
                                    <motion.div 
                                        initial="hidden"
                                        animate="visible"
                                        variants={containerVariants}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                                    >
                                        {categoria.modulos.map((m) => {
                                            const identifier = (m.href || "").split("/").pop()?.toLowerCase() || "";
                                            const override = (Array.isArray(linksExternos) ? linksExternos : []).find((l: any) => 
                                                l?.moduloAlvo?.toLowerCase() === identifier
                                            );
                                            const finalHref = override ? override.url : m.href;
                                            const isExternal = !!override;
                                            const ModIcon = m.icon;

                                            const criterioBadgeColor = 
                                                m.tipoCriterio === "ESSENCIAL" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                                m.tipoCriterio === "OBRIGATÓRIO" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-primary-50 text-primary-700 border-primary-200";

                                            return (
                                                <motion.div key={m.href + m.titulo} variants={itemVariants}>
                                                    <Link 
                                                        href={finalHref} 
                                                        target={isExternal ? "_blank" : undefined}
                                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                                        className="group relative flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200/80 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/10 p-5 transition-all duration-300 hover:-translate-y-1"
                                                    >
                                                        <div>
                                                            {/* Topo do Card: Ícone e Badges */}
                                                            <div className="flex items-center justify-between mb-3.5">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-primary-50 border border-slate-100 group-hover:border-primary-200 flex items-center justify-center transition-colors">
                                                                    <ModIcon size={20} className="text-slate-700 group-hover:text-primary-600 transition-colors" />
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${criterioBadgeColor}`}>
                                                                        {m.tipoCriterio}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                                        {m.badge}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Conteúdo do Card */}
                                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug mb-1.5">
                                                                {highlightText(m.titulo, searchTerm)}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                                                {highlightText(m.desc, searchTerm)}
                                                            </p>
                                                        </div>

                                                        {/* Rodapé do Card */}
                                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                            {isExternal ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                                    <ExternalLink size={10} /> Sistema Integrado
                                                                </span>
                                                            ) : (
                                                                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-primary-600 transition-colors">
                                                                    Consultar
                                                                </span>
                                                            )}
                                                            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-primary-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                                                                {isExternal ? <ArrowUpRight size={13} /> : <ArrowRight size={13} />}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </section>
                            );
                        })
                    ) : (
                        /* Feedback sem resultados */
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Search size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                                Nenhum módulo encontrado
                            </h3>
                            <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
                                Não encontramos dados para o termo <span className="font-semibold text-slate-800">"{searchTerm}"</span> com os filtros selecionados.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("TODAS");
                                    setSelectedCriterio("TODOS");
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RODAPÉ INSTITUCIONAL DA TRANSPARÊNCIA */}
            <footer className="relative py-16 bg-slate-950 border-t border-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-400">
                                    <Landmark size={24} />
                                </div>
                                <div>
                                    <h4 className="text-base font-black uppercase tracking-wider text-white">Portal da Transparência</h4>
                                    <p className="text-xs text-white/50">{MUNICIPIO.nomeCompleto} - {MUNICIPIO.uf}</p>
                                </div>
                            </div>
                            <h5 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4 leading-snug">
                                Transparência Ativa e Controle Social do Cidadão
                            </h5>
                            <p className="text-white/60 text-xs leading-relaxed max-w-xl mb-6">
                                Em cumprimento integral à Lei Federal nº 12.527/2011 (Lei de Acesso à Informação) e à Lei de Responsabilidade Fiscal, garantimos a integridade, atualização contínua e disponibilidade dos atos da administração pública.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link 
                                    href="/servicos/esic" 
                                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-bold text-white transition-all shadow-md"
                                >
                                    Solicitar Informação (e-SIC)
                                </Link>
                                <Link 
                                    href="/servicos/ouvidoria" 
                                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
                                >
                                    Canal de Ouvidoria
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-sm">
                            <h6 className="text-xs font-black uppercase tracking-widest text-primary-400 mb-6 flex items-center gap-2">
                                <ShieldCheck size={16} /> Conformidade e Atendimento
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="border-l-2 border-primary-500 pl-3">
                                    <span className="text-white/40 block text-[10px] uppercase font-bold">Encarregado DPO / LAI</span>
                                    <span className="text-white font-medium block mt-0.5">{MUNICIPIO.dpo}</span>
                                    <span className="text-primary-400 text-[11px] block">{MUNICIPIO.dpoEmail}</span>
                                </div>
                                <div className="border-l-2 border-emerald-500 pl-3">
                                    <span className="text-white/40 block text-[10px] uppercase font-bold">Atendimento Presencial</span>
                                    <span className="text-white font-medium block mt-0.5">{MUNICIPIO.horario}</span>
                                    <span className="text-white/60 text-[11px] block">{MUNICIPIO.endereco}</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
                                <span>CNPJ: {MUNICIPIO.cnpj}</span>
                                <span>IBGE: {MUNICIPIO.ibge}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
                        <p>© {new Date().getFullYear()} Prefeitura Municipal de {MUNICIPIO.nome} - {MUNICIPIO.uf}. Todos os direitos reservados.</p>
                        <div className="flex gap-4">
                            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade & LGPD</Link>
                            <Link href="/transparencia/acessibilidade" className="hover:text-white transition-colors">Acessibilidade</Link>
                            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
