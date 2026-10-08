"use client";

import Link from "next/link";
import { 
    TrendingUp, BarChart3, Gavel, FileSignature, Handshake, 
    Plane, Users, FileBarChart, Scale, Database, Construction, 
    Users2, ClipboardList, HelpCircle, BookOpen, Files, 
    Building2, UserCircle2, MapPinned, Truck, Globe2, 
    ExternalLink, ArrowRight, Check,
    Headset, FileText, ScrollText, Briefcase, Landmark, 
    Info, FileStack, Activity, ListOrdered, PhoneCall, 
    Link2, ShieldCheck, HeartPulse, Search, Sparkles, 
    ShieldAlert, FileSearch, Coins, Receipt, Building, 
    Heart, ClipboardCheck, BarChart, GraduationCap, 
    FileClock, UserPlus, UserCheck, FilePieChart, 
    Presentation, Megaphone, Accessibility, Shield, Pill, 
    LayoutGrid, Calendar, FileCheck, LayoutList, X, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { useEffect, useState, useRef, useMemo } from "react";
import { MUNICIPIO } from "@/config/municipio";

// Módulos mais procurados pelo cidadão (Acesso Imediato)
const servicosMaisProcurados = [
    {
        titulo: "Despesas Públicas",
        desc: "Empenhos, liquidações e pagamentos",
        href: "/transparencia/despesas",
        icon: Receipt,
        imagem: "/images/transparencia/card-despesas.jpg",
        corBg: "bg-blue-50 text-blue-600 border-blue-100",
        tag: "Gastos",
        tagColor: "bg-blue-100/80 text-blue-700"
    },
    {
        titulo: "Receitas Públicas",
        desc: "Arrecadação e repasses constitucionais",
        href: "/transparencia/receitas",
        icon: Coins,
        imagem: "/images/transparencia/card-despesas.jpg",
        corBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        tag: "Arrecadação",
        tagColor: "bg-emerald-100/80 text-emerald-700"
    },
    {
        titulo: "Licitações & Editais",
        desc: "Processos, atas, editais e julgamentos",
        href: "/transparencia/licitacoes",
        icon: Gavel,
        imagem: "/images/transparencia/card-licitacoes.jpg",
        corBg: "bg-amber-50 text-amber-600 border-amber-100",
        tag: "Compras",
        tagColor: "bg-amber-100/80 text-amber-700"
    },
    {
        titulo: "Servidores & Folha",
        desc: "Cargos, salários e quadro funcional",
        href: "/transparencia/servidores",
        icon: Users,
        imagem: "/images/transparencia/card-servidores.jpg",
        corBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        tag: "RH",
        tagColor: "bg-indigo-100/80 text-indigo-700"
    },
    {
        titulo: "Diárias de Viagem",
        desc: "Valores concedidos a agentes públicos",
        href: "/transparencia/diarias",
        icon: Plane,
        imagem: "/images/transparencia/card-licitacoes.jpg",
        corBg: "bg-sky-50 text-sky-600 border-sky-100",
        tag: "Diárias",
        tagColor: "bg-sky-100/80 text-sky-700"
    },
    {
        titulo: "Contratos Públicos",
        desc: "Contratos firmados, aditivos e valores",
        href: "/transparencia/contratos",
        icon: FileSignature,
        imagem: "/images/transparencia/card-licitacoes.jpg",
        corBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
        tag: "Contratos",
        tagColor: "bg-cyan-100/80 text-cyan-700"
    },
    {
        titulo: "e-SIC / LAI",
        desc: "Pedidos de acesso à informação pública",
        href: "/servicos/esic",
        icon: ClipboardList,
        imagem: "/images/transparencia/card-esic.jpg",
        corBg: "bg-rose-50 text-rose-600 border-rose-100",
        tag: "Cidadão",
        tagColor: "bg-rose-100/80 text-rose-700"
    },
    {
        titulo: "Medicamentos SUS",
        desc: "Lista de remédios e estoque na rede",
        href: "/transparencia/medicamentos-sus",
        icon: Pill,
        imagem: "/images/transparencia/card-saude.jpg",
        corBg: "bg-teal-50 text-teal-600 border-teal-100",
        tag: "Saúde",
        tagColor: "bg-teal-100/80 text-teal-700"
    }
];

// Chips para preenchimento rápido da busca
const chipsSugeridos = [
    "Despesas", "Receitas", "Licitações", "Servidores", "Diárias", "Contratos", "Obras", "Medicamentos", "Decretos", "e-SIC", "Ouvidoria"
];

// Categorias organizadas de acordo com as dimensões de avaliação do PNTP 2026
const categoriasDeModulos = [
    {
        tituloCategoria: "Institucional & Acessibilidade",
        icon: Building2,
        desc: "Dados oficiais, competências legais, estrutura administrativa, contatos dos órgãos públicos, acessibilidade e governo digital.",
        corTema: "from-blue-600 to-indigo-700",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        modulos: [
            { icon: Building2, titulo: "Institucional", desc: "Dados gerais e identificação da entidade municipal.", href: "/transparencia/institucional", badge: "ENTIDADE", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-indigo-700" },
            { icon: FileText, titulo: "Competências", desc: "Atribuições e funções legais do município.", href: "/transparencia/competencias", badge: "LEGAL", tipoCriterio: "ESSENCIAL", cor: "from-emerald-600 to-teal-700" },
            { icon: Users2, titulo: "Organograma", desc: "Estrutura organizacional e administrativa da prefeitura.", href: "/transparencia/institucional", badge: "ESTRUTURA", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-blue-700" },
            { icon: MapPinned, titulo: "Localização e Contatos", desc: "Endereços, telefones, e-mails e contatos das sedes públicas.", href: "/transparencia/institucional", badge: "CONTATOS", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: UserCircle2, titulo: "Gestores Municipais", desc: "Identificação dos responsáveis por cada setor e secretaria.", href: "/transparencia/gestores", badge: "CONTATOS", tipoCriterio: "OBRIGATÓRIO", cor: "from-teal-600 to-emerald-700" },
            { icon: Accessibility, titulo: "Acessibilidade", desc: "Ferramentas e recursos de acessibilidade digital do portal.", href: "/transparencia/acessibilidade", badge: "INCLUSÃO", tipoCriterio: "OBRIGATÓRIO", cor: "from-blue-600 to-cyan-700" },
            { icon: ShieldCheck, titulo: "Governo Digital", desc: "Desburocratização e oferta de serviços públicos por meios digitais.", href: "/transparencia/governo-digital", badge: "TECNOLOGIA", tipoCriterio: "RECOMENDADO", cor: "from-emerald-600 to-teal-700" },
            { icon: Sparkles, titulo: "Símbolos Municipais", desc: `Brasão, bandeira, hino oficial e marcos de ${MUNICIPIO.nome}/${MUNICIPIO.uf}.`, href: "/transparencia/simbolos", badge: "HISTÓRIA", tipoCriterio: "RECOMENDADO", cor: "from-amber-600 to-orange-700" }
        ]
    },
    {
        tituloCategoria: "Planejamento & Finanças",
        icon: Landmark,
        desc: "Leis orçamentárias (LOA, LDO, PPA), demonstrativos fiscais da LRF, prestação de contas do executivo, pareceres do TCE e conselhos municipais.",
        corTema: "from-slate-700 to-slate-900",
        badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
        modulos: [
            { icon: Landmark, titulo: "Planejamento Orçamentário", desc: "Instrumentos de planejamento municipal: LOA, LDO e PPA.", href: "/transparencia/orcamento", badge: "PLANEJAMENTO", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: BarChart3, titulo: "Relatórios da LRF", desc: "Demonstrativos fiscais exigidos pela LRF: RREO e RGF.", href: "/transparencia/lrf", badge: "FISCAL", tipoCriterio: "ESSENCIAL", cor: "from-blue-700 to-slate-900" },
            { icon: FilePieChart, titulo: "Prestação de Contas", desc: "Balanços contábeis e demonstrativos financeiros anuais.", href: "/transparencia/prestacao-contas", badge: "CONTABILIDADE", tipoCriterio: "ESSENCIAL", cor: "from-emerald-600 to-teal-700" },
            { icon: BarChart, titulo: "Contas de Governo (PCG)", desc: "Prestação de contas anual do prefeito municipal.", href: "/transparencia/pcg", badge: "GOVERNO", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-indigo-700" },
            { icon: FileBarChart, titulo: "Contas de Gestão (PCS)", desc: "Relatórios de prestação de contas dos administradores de fundos e órgãos.", href: "/transparencia/pcs", badge: "GESTÃO", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: Gavel, titulo: "Julgamento de Contas", desc: "Julgamentos realizados pela Câmara Municipal sobre as contas do executivo.", href: "/transparencia/julgamento-contas", badge: "CÂMARA", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-600 to-orange-700" },
            { icon: Scale, titulo: "Parecer Técnico do TCE", desc: "Pareceres emitidos pelo Tribunal de Contas sobre a contabilidade local.", href: "/transparencia/parecer-tce", badge: "TCE-RN", tipoCriterio: "OBRIGATÓRIO", cor: "from-red-600 to-rose-700" },
            { icon: ClipboardList, titulo: "Relatório de Gestão", desc: "Metas físicas, financeiras e atividades desenvolvidas.", href: "/transparencia/relatorio-gestao", badge: "RESULTADOS", tipoCriterio: "RECOMENDADO", cor: "from-purple-600 to-violet-700" },
            { icon: Users, titulo: "Conselhos Municipais", desc: "Pautas, composições, atas de reunião e atos dos Conselhos e do FUNDEB.", href: "/transparencia/conselhos", badge: "PARTICIPAÇÃO", tipoCriterio: "OBRIGATÓRIO", cor: "from-indigo-600 to-indigo-800" }
        ]
    },
    {
        tituloCategoria: "Receitas & Arrecadação",
        icon: Coins,
        desc: "Arrecadação de tributos em tempo real, dívida ativa municipal, renúncias fiscais e fomento à cultura.",
        corTema: "from-emerald-600 to-teal-700",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        modulos: [
            { icon: Coins, titulo: "Receitas Públicas", desc: "Arrecadação municipal em tempo real, receitas tributárias e transferências.", href: "/transparencia/receitas", badge: "ARRECADAÇÃO", tipoCriterio: "ESSENCIAL", cor: "from-emerald-600 to-teal-700" },
            { icon: Scale, titulo: "Dívida Ativa", desc: "Controle de créditos a receber e cobranças tributárias do município.", href: "/transparencia/divida-ativa", badge: "COBRANÇA", tipoCriterio: "OBRIGATÓRIO", cor: "from-red-600 to-orange-700" },
            { icon: FileSearch, titulo: "Renúncias Fiscais", desc: "Relatórios de incentivos tributários e renúncias de receitas municipais.", href: "/transparencia/renuncias-fiscais", badge: "ISENÇÃO", tipoCriterio: "OBRIGATÓRIO", cor: "from-purple-600 to-indigo-700" },
            { icon: Sparkles, titulo: "Incentivos Culturais", desc: "Fomento à cultura por meio de incentivos e editais governamentais.", href: "/transparencia/incentivos-culturais", badge: "CULTURA", tipoCriterio: "RECOMENDADO", cor: "from-rose-600 to-pink-700" },
            { icon: TrendingUp, titulo: "Desonerações", desc: "Detalhamento e relatórios de desonerações fiscais concedidas.", href: "/transparencia/desoneracoes", badge: "BENEFÍCIOS", tipoCriterio: "RECOMENDADO", cor: "from-blue-600 to-cyan-700" }
        ]
    },
    {
        tituloCategoria: "Despesas, Licitações & Contratos",
        icon: FileSignature,
        desc: "Execução de despesas, fila cronológica de pagamentos, repasses voluntários, processos licitatórios, atas de registro de preço, plano de contratação anual, contratos e convênios.",
        corTema: "from-blue-600 to-indigo-800",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        modulos: [
            { icon: Receipt, titulo: "Despesas Públicas", desc: "Detalhamento de empenhos, liquidações e ordens de pagamento municipais.", href: "/transparencia/despesas", badge: "GASTOS", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-indigo-700" },
            { icon: ListOrdered, titulo: "Ordem Cronológica", desc: "Fila cronológica e execuções de pagamentos a credores e fornecedores.", href: "/transparencia/ordem-cronologica", badge: "TESOURARIA", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-600 to-orange-700" },
            { icon: Database, titulo: "Repasses e Transferências", desc: "Transferências voluntárias, repasses constitucionais e recursos federais.", href: "/transparencia/transferencias", badge: "RECURSOS", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-violet-700" },
            { icon: Gavel, titulo: "Licitações", desc: "Editais, atas, julgamentos, homologações e recursos de certames públicos.", href: "/transparencia/licitacoes", badge: "CERTAMES", tipoCriterio: "ESSENCIAL", cor: "from-orange-600 to-red-700" },
            { icon: Megaphone, titulo: "Editais Diversos", desc: "Chamamentos públicos, avisos e outros atos convocatórios da gestão.", href: "/transparencia/editais", badge: "AVISOS", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-600 to-orange-700" },
            { icon: FileStack, titulo: "Atas de Registro de Preços", desc: "Registro de preços vigente para aquisições públicas e contratações.", href: "/transparencia/atas-registro", badge: "SRP", tipoCriterio: "OBRIGATÓRIO", cor: "from-purple-600 to-violet-800" },
            { icon: FileText, titulo: "Plano de Contratação Anual", desc: "Planejamento anual de contratações públicas municipais (Lei 14.133).", href: "/transparencia/plano-contratacao", badge: "PCA", tipoCriterio: "RECOMENDADO", cor: "from-slate-700 to-slate-900" },
            { icon: FileSignature, titulo: "Contratos Administrativos", desc: "Instrumentos contratuais celebrados, aditivos, valores e prazos.", href: "/transparencia/contratos", badge: "CONTRATOS", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-indigo-700" },
            { icon: Handshake, titulo: "Convênios Celebrados", desc: "Parcerias, convênios estaduais, federais e transferências de recursos.", href: "/transparencia/convenios", badge: "PARCERIAS", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-blue-700" },
            { icon: Globe2, titulo: "Emendas Parlamentares", desc: "Acompanhamento de emendas destinadas ao município (estaduais e federais).", href: "/transparencia/emendas", badge: "EMENDAS", tipoCriterio: "OBRIGATÓRIO", cor: "from-teal-600 to-emerald-800" },
            { icon: Coins, titulo: "Emendas PIX", desc: "Transferências especiais diretas do governo federal e destinação local.", href: "/transparencia/emendas-pix", badge: "PIX", tipoCriterio: "ESSENCIAL", cor: "from-pink-600 to-rose-700" },
            { icon: Handshake, titulo: "Acordos Firmados", desc: "Acordos de cooperação técnica e ajustes sem repasse financeiro.", href: "/transparencia/acordos-firmados", badge: "ACORDOS", tipoCriterio: "RECOMENDADO", cor: "from-indigo-600 to-blue-700" },
            { icon: Link2, titulo: "Associações e Parcerias", desc: "Repasses e parcerias firmadas com entidades de classe e consórcios.", href: "/transparencia/associacoes", badge: "ENTIDADES", tipoCriterio: "RECOMENDADO", cor: "from-blue-600 to-indigo-700" }
        ]
    },
    {
        tituloCategoria: "Pessoal & Diárias",
        icon: Users,
        desc: "Quadro de pessoal da prefeitura, servidores públicos, terceirizados, estagiários, concessão de diárias, concursos públicos e processos seletivos.",
        corTema: "from-sky-600 to-blue-700",
        badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
        modulos: [
            { icon: Users, titulo: "Servidores Públicos", desc: "Folha de pagamento, cargos, remunerações e servidores municipais.", href: "/transparencia/servidores", badge: "PESSOAL", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: Plane, titulo: "Diárias de Viagem", desc: "Diárias e passagens concedidas a servidores e agentes públicos.", href: "/transparencia/diarias", badge: "DIÁRIAS", tipoCriterio: "ESSENCIAL", cor: "from-sky-600 to-blue-700" },
            { icon: FileClock, titulo: "Tabela de Diárias", desc: "Tabela com os valores vigentes de diárias por nível e localidade.", href: "/transparencia/tabela-diarias", badge: "VALORES", tipoCriterio: "OBRIGATÓRIO", cor: "from-indigo-600 to-indigo-800" },
            { icon: ScrollText, titulo: "Regulamentação de Diárias", desc: "Leis e decretos municipais que regulamentam a concessão de diárias.", href: "/transparencia/regulamentacao-diarias", badge: "REGULAMENTO", tipoCriterio: "OBRIGATÓRIO", cor: "from-slate-600 to-slate-800" },
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
        corTema: "from-amber-600 to-orange-700",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        modulos: [
            { icon: Construction, titulo: "Obras Públicas", desc: "Contratos de obras, medições, relatórios físicos e andamento.", href: "/transparencia/obras", badge: "EXECUÇÃO", tipoCriterio: "ESSENCIAL", cor: "from-amber-600 to-orange-700" },
            { icon: Truck, titulo: "Frota Municipal", desc: "Relação de veículos oficiais próprios, locados ou cedidos.", href: "/transparencia/frota", badge: "VEÍCULOS", tipoCriterio: "RECOMENDADO", cor: "from-sky-600 to-cyan-700" }
        ]
    },
    {
        tituloCategoria: "Cidadão, Ouvidoria & SIC",
        icon: Headset,
        desc: "Serviço de Informação ao Cidadão (e-SIC), Ouvidoria Municipal, Carta de Serviços ao Cidadão, FAQ, glossário de termos e relatórios de transparência passiva.",
        corTema: "from-purple-600 to-indigo-700",
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
        modulos: [
            { icon: ClipboardList, titulo: "e-SIC", desc: "Abertura e consulta de pedidos de acesso à informação (LAI).", href: "/servicos/esic", badge: "LAI", tipoCriterio: "ESSENCIAL", cor: "from-amber-600 to-orange-700" },
            { icon: Headset, titulo: "Ouvidoria Municipal", desc: "Canal oficial para manifestações, denúncias, elogios e críticas.", href: "/servicos/ouvidoria", badge: "OUVIDORIA", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-cyan-600" },
            { icon: MapPinned, titulo: "Carta de Serviços", desc: "Catálogo descritivo de todos os serviços públicos ofertados ao cidadão.", href: "/transparencia/carta-servicos", badge: "CIDADÃO", tipoCriterio: "ESSENCIAL", cor: "from-purple-600 to-indigo-700" },
            { icon: HelpCircle, titulo: "Transparência Passiva", desc: "Relatórios de estatísticas de acesso e respostas fornecidas via LAI.", href: "/transparencia/passiva", badge: "ESTATÍSTICA", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: ClipboardCheck, titulo: "Pesquisa de Satisfação", desc: "Avaliação periódica dos serviços municipais pelos usuários.", href: "/transparencia/pesquisa-satisfacao", badge: "SATISFAÇÃO", tipoCriterio: "RECOMENDADO", cor: "from-fuchsia-600 to-pink-700" },
            { icon: HelpCircle, titulo: "FAQ - Dúvidas Frequentes", desc: "Esclarecimentos de dúvidas comuns sobre a gestão pública local.", href: "/transparencia/faq", badge: "AJUDA", tipoCriterio: "RECOMENDADO", cor: "from-slate-600 to-slate-800" },
            { icon: BookOpen, titulo: "Glossário de Termos", desc: "Termos técnicos e conceitos utilizados na administração do portal.", href: "/transparencia/glossario", badge: "CONCEITOS", tipoCriterio: "RECOMENDADO", cor: "from-indigo-600 to-blue-700" },
            { icon: PhoneCall, titulo: "Fale Conosco", desc: "Contatos telefônicos e horários de atendimento dos órgãos municipais.", href: "/contato", badge: "CONTATOS", tipoCriterio: "OBRIGATÓRIO", cor: "from-rose-600 to-pink-700" }
        ]
    },
    {
        tituloCategoria: "Saúde & Educação",
        icon: HeartPulse,
        desc: "Transparência finalística da saúde municipal, unidades de atendimento, medicamentos SUS, exames, regulação e planos municipais de saúde e educação.",
        corTema: "from-rose-600 to-red-700",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        modulos: [
            { icon: HeartPulse, titulo: "Recursos da Saúde", desc: "Investimentos, repasses do SUS e execuções financeiras da Saúde.", href: "/transparencia/saude", badge: "SAÚDE", tipoCriterio: "ESSENCIAL", cor: "from-rose-600 to-red-700" },
            { icon: Building, titulo: "Unidades de Saúde", desc: "Informações, contatos e funcionamento da rede municipal de saúde.", href: "/transparencia/unidades-saude", badge: "UNIDADES", tipoCriterio: "OBRIGATÓRIO", cor: "from-blue-600 to-cyan-700" },
            { icon: Pill, titulo: "Medicamentos SUS", desc: "Lista de remédios disponíveis na rede do SUS e controle de estoques.", href: "/transparencia/medicamentos-sus", badge: "FARMÁCIA", tipoCriterio: "OBRIGATÓRIO", cor: "from-emerald-600 to-teal-700" },
            { icon: Activity, titulo: "Central de Regulação", desc: "Agendamentos de exames, filas e regulação das especialidades.", href: "/transparencia/central-regulacao", badge: "EXAMES", tipoCriterio: "OBRIGATÓRIO", cor: "from-orange-600 to-amber-700" },
            { icon: Heart, titulo: "Plano de Saúde", desc: "Diretrizes, metas e metas estratégicas de saúde do município.", href: "/transparencia/plano-saude", badge: "PLANO", tipoCriterio: "OBRIGATÓRIO", cor: "from-pink-600 to-rose-700" },
            { icon: Calendar, titulo: "Programação Anual de Saúde", desc: "Programação anual de ações, metas e alocação de recursos do SUS (PAS).", href: "/transparencia/programacao-anual-saude", badge: "PAS", tipoCriterio: "OBRIGATÓRIO", cor: "from-emerald-600 to-teal-700" },
            { icon: FileCheck, titulo: "Relatório Anual de Gestão", desc: "Relatório de prestação de contas comprovando a execução da PAS e parecer do CMS (RAG).", href: "/transparencia/relatorio-anual-gestao", badge: "RAG", tipoCriterio: "OBRIGATÓRIO", cor: "from-purple-600 to-indigo-700" },
            { icon: GraduationCap, titulo: "Unidades Escolares", desc: "Escolas e creches municipais, contatos, horários e declaração de vagas.", href: "/unidades-escolares", badge: "UNIDADES", tipoCriterio: "OBRIGATÓRIO", cor: "from-blue-600 to-indigo-700" },
            { icon: GraduationCap, titulo: "Plano de Educação", desc: "Diretrizes e metas do Plano Municipal de Educação.", href: "/transparencia/plano-educacao", badge: "ENSINO", tipoCriterio: "OBRIGATÓRIO", cor: "from-amber-600 to-orange-700" }
        ]
    },
    {
        tituloCategoria: "Legislação, Atos & Governança",
        icon: Scale,
        desc: "Legislação municipal completa, leis ordinárias e complementares, decretos executivos, portarias, LGPD, integridade pública, dados abertos e radar de transparência.",
        corTema: "from-indigo-600 to-purple-800",
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        modulos: [
            { icon: Scale, titulo: "Legislação Municipal", desc: "Portal consolidado de atos normativos, leis orgânicas, leis ordinárias e regulamentações.", href: "/transparencia/legislacao", badge: "LEGISLAÇÃO", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-purple-800" },
            { icon: Files, titulo: "Leis Municipais", desc: "Legislação completa aprovada pelo legislativo e executivo municipal.", href: "/transparencia/leis", badge: "LEIS", tipoCriterio: "ESSENCIAL", cor: "from-indigo-600 to-purple-700" },
            { icon: FileText, titulo: "Decretos Municipais", desc: "Atos normativos regulamentares assinados pelo chefe do poder executivo.", href: "/transparencia/decretos", badge: "DECRETOS", tipoCriterio: "ESSENCIAL", cor: "from-slate-700 to-slate-900" },
            { icon: ScrollText, titulo: "Portarias Executivas", desc: "Atos administrativos de provimento, nomeações, delegações e atribuições.", href: "/transparencia/portarias", badge: "PORTARIAS", tipoCriterio: "ESSENCIAL", cor: "from-blue-600 to-blue-800" },
            { icon: ShieldCheck, titulo: "LGPD & Privacidade", desc: "Encarregado pelo tratamento de dados pessoais (DPO) e requisições de privacidade.", href: "/transparencia/lgpd", badge: "PRIVACIDADE", tipoCriterio: "ESSENCIAL", cor: "from-emerald-600 to-teal-700" },
            { icon: Shield, titulo: "Integridade Pública", desc: "Código de conduta ética, plano de integridade, conformidade e governança.", href: "/transparencia/integridade", badge: "GOVERNANÇA", tipoCriterio: "OBRIGATÓRIO", cor: "from-emerald-600 to-teal-700" },
            { icon: Presentation, titulo: "Dados Abertos", desc: "Arquivos e catálogos em formatos abertos e estruturados (CSV, JSON, XML).", href: "/transparencia/dados-abertos", badge: "FORMATO-ABERTO", tipoCriterio: "RECOMENDADO", cor: "from-orange-600 to-amber-700" },
            { icon: Search, titulo: "Radar de Transparência", desc: "Notas de avaliação do município no Radar Nacional de Transparência Pública (PNTP).", href: "/transparencia/radar", badge: "PNTP", tipoCriterio: "RECOMENDADO", cor: "from-blue-700 to-slate-900" }
        ]
    }
];

export default function TransparenciaPage() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCriterio, setSelectedCriterio] = useState<string>("TODOS");
    const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [configs, setConfigs] = useState<Record<string, string>>({
        transparencia_pntp_ativo: "false",
        transparencia_pntp_indice: "98.5%",
        transparencia_pntp_selo: "SELO DIAMANTE",
        transparencia_pntp_essenciais: "28 Módulos",
        transparencia_pntp_obrigatorios: "23 Módulos",
        transparencia_pntp_recomendados: "15 Módulos"
    });
    const searchInputRef = useRef<HTMLInputElement>(null);
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

    // Estatísticas dinâmicas dos critérios (essenciais, obrigatórios, recomendados)
    const countTotalModulos = useMemo(() => {
        return categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.length, 0);
    }, []);

    const countEssencial = useMemo(() => {
        return categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.filter(m => m.tipoCriterio === "ESSENCIAL").length, 0);
    }, []);

    const countObrigatorio = useMemo(() => {
        return categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.filter(m => m.tipoCriterio === "OBRIGATÓRIO").length, 0);
    }, []);

    const countRecomendado = useMemo(() => {
        return categoriasDeModulos.reduce((acc, cat) => acc + cat.modulos.filter(m => m.tipoCriterio === "RECOMENDADO").length, 0);
    }, []);

    // Filtragem dinâmica com Memoização
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

    // Total de resultados visíveis
    const totalResultados = useMemo(() => {
        return filteredCategories.reduce((acc, cat) => acc + cat.modulos.length, 0);
    }, [filteredCategories]);

    const hasResults = totalResultados > 0;

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        if (modulesGridRef.current) {
            modulesGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleChipClick = (termo: string) => {
        setSearchTerm(termo);
        if (modulesGridRef.current) {
            modulesGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

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
        visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
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

                {/* BANNER INSTITUCIONAL FOTOGRÁFICO */}
                <motion.div 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative rounded-3xl overflow-hidden mb-8 border border-slate-100 shadow-xl shadow-slate-200/50 h-56 sm:h-64 lg:h-72"
                >
                    <img 
                        src="/images/transparencia/banner-transparencia.jpg" 
                        alt={`Portal da Transparência de ${MUNICIPIO.nome}`}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/20 flex flex-col justify-center p-6 sm:p-10 text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 backdrop-blur-md border border-primary-400/30 text-primary-300 text-[11px] font-bold uppercase tracking-wider mb-2.5 w-fit">
                            <ShieldCheck size={14} className="text-primary-400" />
                            <span>Controle Social e Conformidade Legal</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white max-w-xl leading-tight">
                            Transparência e Prestação de Contas
                        </h2>
                        <p className="text-white/80 text-xs sm:text-sm max-w-xl mt-2 leading-relaxed">
                            Consulte em tempo real receitas, despesas, contratos, licitações, folha de pagamento e atos da Prefeitura Municipal de {MUNICIPIO.nome}/{MUNICIPIO.uf}.
                        </p>
                    </div>
                </motion.div>

                {/* 1. SEÇÃO EM DESTAQUE: MAIS PROCURADOS PELO CIDADÃO */}
                <motion.section 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8"
                >
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

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                        {servicosMaisProcurados.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Imagem do Card com Overlay */}
                                    <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                                        <img 
                                            src={item.imagem} 
                                            alt={item.titulo} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                                        
                                        {/* Ícone no topo */}
                                        <div className="absolute top-2.5 left-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm text-primary-600 shadow-md flex items-center justify-center">
                                                <IconComponent size={16} />
                                            </div>
                                        </div>

                                        {/* Tag da categoria */}
                                        <div className="absolute bottom-2.5 left-2.5">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm">
                                                {item.tag}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col justify-between flex-1">
                                        <div>
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
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </motion.section>

                {/* 2. PAINEL DE CONFORMIDADE PNTP (QUANDO ATIVO EM CONFIGURAÇÕES) */}
                {configs.transparencia_pntp_ativo === "true" && (
                    <motion.div 
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 mb-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Radial Indicator */}
                            <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-4 flex items-center gap-1.5 border border-primary-500/20 px-3 py-1 rounded-full bg-primary-500/10">
                                        <ShieldCheck size={14} className="text-primary-400" /> PNTP Metodologia 2026
                                    </div>

                                    <div className="relative flex items-center justify-center my-3">
                                        <svg className="w-28 h-28 transform -rotate-90">
                                            <circle cx="56" cy="56" r="46" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                                            <circle
                                                cx="56" cy="56" r="46"
                                                className="stroke-primary-400 transition-all duration-1000"
                                                strokeWidth="8" fill="transparent"
                                                strokeDasharray={2 * Math.PI * 46}
                                                strokeDashoffset={2 * Math.PI * 46 * (1 - (parseFloat(String(configs?.transparencia_pntp_indice || "0").replace(",", ".").replace("%", "")) || 0) / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-2xl font-black text-white leading-none">{configs.transparencia_pntp_indice}</span>
                                            <span className="text-[9px] font-black text-primary-400 tracking-wider mt-0.5">ÍNDICE</span>
                                        </div>
                                    </div>

                                    {configs.transparencia_pntp_selo !== "SEM SELO" && (
                                        <div className="mt-2">
                                            <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5 justify-center">
                                                <Sparkles size={14} className="text-amber-400 animate-pulse" /> {configs.transparencia_pntp_selo}
                                            </h4>
                                            <p className="text-white/60 text-[10px] mt-0.5">Grau Recomendado pela ATRICON</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Filtros por Classificação de Rigor Legal */}
                            <div className="lg:col-span-8 flex flex-col justify-between">
                                <div className="mb-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Auditoria e Requisitos Legais</span>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                                        Classificação por Nível de Rigor
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Filtre diretamente pelo grau de impacto exigido pelas cartilhas do TCE e ATRICON:
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setSelectedCriterio(selectedCriterio === "ESSENCIAL" ? "TODOS" : "ESSENCIAL")}
                                        className={`p-4 rounded-2xl border text-left transition-all ${
                                            selectedCriterio === "ESSENCIAL"
                                                ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20"
                                                : "bg-rose-50/60 hover:bg-rose-50 border-rose-100 text-slate-800"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <ShieldAlert size={18} className={selectedCriterio === "ESSENCIAL" ? "text-white" : "text-rose-600"} />
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">NÍVEL 1</span>
                                        </div>
                                        <span className="text-xs font-semibold block opacity-80">Essenciais</span>
                                        <span className="text-xl font-black block mt-0.5">{configs.transparencia_pntp_essenciais}</span>
                                    </button>

                                    <button
                                        onClick={() => setSelectedCriterio(selectedCriterio === "OBRIGATÓRIO" ? "TODOS" : "OBRIGATÓRIO")}
                                        className={`p-4 rounded-2xl border text-left transition-all ${
                                            selectedCriterio === "OBRIGATÓRIO"
                                                ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                                                : "bg-amber-50/60 hover:bg-amber-50 border-amber-100 text-slate-800"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <FileSearch size={18} className={selectedCriterio === "OBRIGATÓRIO" ? "text-white" : "text-amber-600"} />
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">NÍVEL 2</span>
                                        </div>
                                        <span className="text-xs font-semibold block opacity-80">Obrigatórios</span>
                                        <span className="text-xl font-black block mt-0.5">{configs.transparencia_pntp_obrigatorios}</span>
                                    </button>

                                    <button
                                        onClick={() => setSelectedCriterio(selectedCriterio === "RECOMENDADO" ? "TODOS" : "RECOMENDADO")}
                                        className={`p-4 rounded-2xl border text-left transition-all ${
                                            selectedCriterio === "RECOMENDADO"
                                                ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20"
                                                : "bg-primary-50/60 hover:bg-primary-50 border-primary-100 text-slate-800"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Sparkles size={18} className={selectedCriterio === "RECOMENDADO" ? "text-white" : "text-primary-600"} />
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">NÍVEL 3</span>
                                        </div>
                                        <span className="text-xs font-semibold block opacity-80">Recomendados</span>
                                        <span className="text-xl font-black block mt-0.5">{configs.transparencia_pntp_recomendados}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. BUSCA INSTANTÂNEA, CHIPS SUGERIDOS E ALTERNADOR DE VISUALIZAÇÃO */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        {/* Campo de Busca Principal */}
                        <div className="flex-1 relative group">
                            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                <Search size={22} />
                            </div>
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                placeholder="Digite o que deseja encontrar (ex: 'diárias', 'folha', 'licitações', 'obras', 'remédios')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:bg-white rounded-2xl pl-12 sm:pl-14 pr-12 py-4 text-sm font-semibold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm("")}
                                    title="Limpar termo digitado"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Controles: Filtro de Rigor & Alternador de Visualização */}
                        <div className="flex items-center gap-3">
                            {/* Filtro Rápido de Rigor */}
                            <select
                                value={selectedCriterio}
                                onChange={(e) => setSelectedCriterio(e.target.value)}
                                aria-label="Filtrar por rigor legal"
                                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer hover:bg-slate-100/70 transition-all"
                            >
                                <option value="TODOS">Todos os Níveis ({countTotalModulos})</option>
                                <option value="ESSENCIAL">Essenciais ({countEssencial})</option>
                                <option value="OBRIGATÓRIO">Obrigatórios ({countObrigatorio})</option>
                                <option value="RECOMENDADO">Recomendados ({countRecomendado})</option>
                            </select>

                            {/* Alternador Grade / Lista */}
                            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    title="Visualização em Grade (Cards)"
                                    className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-primary-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    title="Visualização em Lista Compacta"
                                    className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-primary-600 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                                >
                                    <LayoutList size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chips de Termos Sugeridos */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                            <Search size={12} /> Sugestões rápidas:
                        </span>
                        {chipsSugeridos.map(chip => (
                            <button
                                key={chip}
                                onClick={() => handleChipClick(chip)}
                                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                                    searchTerm.toLowerCase() === chip.toLowerCase()
                                        ? "bg-primary-600 text-white border-primary-600 font-bold shadow-sm"
                                        : "bg-slate-50 hover:bg-primary-50 border-slate-200 text-slate-600 hover:text-primary-700 hover:border-primary-200"
                                }`}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Status de Filtros Ativos */}
                    {(searchTerm || selectedCriterio !== "TODOS" || selectedCategory !== "TODAS") && (
                        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-slate-400">Filtrando por:</span>
                                {searchTerm && (
                                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                                        Busca: "{searchTerm}"
                                    </span>
                                )}
                                {selectedCategory !== "TODAS" && (
                                    <span className="inline-flex items-center gap-1 bg-primary-50 border border-primary-200 text-primary-800 px-2.5 py-0.5 rounded-full font-medium">
                                        Área: {selectedCategory}
                                    </span>
                                )}
                                {selectedCriterio !== "TODOS" && (
                                    <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-800 px-2.5 py-0.5 rounded-full font-medium">
                                        Rigor: {selectedCriterio}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("TODAS");
                                    setSelectedCriterio("TODOS");
                                }}
                                className="text-rose-600 hover:text-rose-700 font-bold hover:underline"
                            >
                                Limpar todos os filtros
                            </button>
                        </div>
                    )}
                </section>

                {/* 4. SELETOR TEMÁTICO DE DIMENSÕES (BOTÕES DE ÁREA ERGONÔMICOS) */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                <LayoutGrid size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                                    Navegação por Dimensão Temática
                                </h3>
                                <p className="text-slate-400 text-xs">Selecione uma área para focar nos seus módulos ou explore todas</p>
                            </div>
                        </div>

                        {selectedCategory !== "TODAS" && (
                            <button
                                onClick={() => setSelectedCategory("TODAS")}
                                className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                            >
                                <span>Ver todas as áreas ({countTotalModulos})</span>
                                <ArrowRight size={14} />
                            </button>
                        )}
                    </div>

                    {/* Pills Horizontais com Scroll Suave e Quebra Responsiva */}
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        <button
                            onClick={() => setSelectedCategory("TODAS")}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                selectedCategory === "TODAS"
                                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                        >
                            <span>Todas as Áreas</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedCategory === "TODAS" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                                {countTotalModulos}
                            </span>
                        </button>

                        {categoriasDeModulos.map((cat) => {
                            const IconComp = cat.icon;
                            const isSelected = selectedCategory === cat.tituloCategoria;
                            const count = cat.modulos.length;
                            return (
                                <button
                                    key={cat.tituloCategoria}
                                    onClick={() => handleCategorySelect(cat.tituloCategoria)}
                                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                        isSelected
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <IconComp size={15} className={isSelected ? "text-white" : "text-slate-500"} />
                                    <span>{cat.tituloCategoria}</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 5. LISTAGEM DE MÓDULOS (GRADE OU LISTA COMPACTA) */}
                <div ref={modulesGridRef} className="scroll-mt-8">
                    {/* Barra de Contagem de Resultados */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-600">
                            Exibindo <span className="text-primary-600 font-black">{totalResultados}</span> {totalResultados === 1 ? "módulo" : "módulos"} em <span className="text-slate-900 font-black">{filteredCategories.length}</span> {filteredCategories.length === 1 ? "área" : "áreas"}
                        </p>
                        <span className="text-xs text-slate-400 font-medium">
                            {viewMode === "grid" ? "Modo Cartões" : "Modo Lista Compacta"}
                        </span>
                    </div>

                    {hasResults ? (
                        <div className="space-y-12">
                            {filteredCategories.map((categoria, catIdx) => {
                                const slug = categoria.tituloCategoria.toLowerCase().replace(/[^a-z0-9]/g, "-");
                                const CatIcon = categoria.icon;

                                return (
                                    <section 
                                        id={slug}
                                        key={categoria.tituloCategoria}
                                        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/30"
                                    >
                                        {/* Cabeçalho da Área Temática */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                                            <div className="flex items-start sm:items-center gap-3.5">
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br ${categoria.corTema} text-white shadow-md shadow-primary-900/10 shrink-0`}>
                                                    <CatIcon size={22} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                                            {categoria.tituloCategoria}
                                                        </h2>
                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                            {categoria.modulos.length} {categoria.modulos.length === 1 ? "item" : "itens"}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 text-xs mt-0.5 max-w-3xl leading-relaxed">
                                                        {categoria.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RENDERIZAÇÃO: MODO GRADE (CARDS MODERNOS) */}
                                        {viewMode === "grid" ? (
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
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-primary-50 border border-slate-100 group-hover:border-primary-200 flex items-center justify-center transition-colors">
                                                                            <ModIcon size={22} className="text-slate-700 group-hover:text-primary-600 transition-colors" />
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
                                                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                                                        {highlightText(m.desc, searchTerm)}
                                                                    </p>
                                                                </div>

                                                                {/* Rodapé do Card */}
                                                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                                    {isExternal ? (
                                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                                            <ExternalLink size={10} /> Sistema Integrado
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-primary-600 transition-colors">
                                                                            Consultar base
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
                                        ) : (
                                            /* RENDERIZAÇÃO: MODO LISTA COMPACTA */
                                            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                                                {categoria.modulos.map((m) => {
                                                    const identifier = (m.href || "").split("/").pop()?.toLowerCase() || "";
                                                    const override = (Array.isArray(linksExternos) ? linksExternos : []).find((l: any) => 
                                                        l?.moduloAlvo?.toLowerCase() === identifier
                                                    );
                                                    const finalHref = override ? override.url : m.href;
                                                    const isExternal = !!override;
                                                    const ModIcon = m.icon;

                                                    const criterioBadgeColor = 
                                                        m.tipoCriterio === "ESSENCIAL" ? "bg-rose-50 text-rose-700" :
                                                        m.tipoCriterio === "OBRIGATÓRIO" ? "bg-amber-50 text-amber-700" :
                                                        "bg-primary-50 text-primary-700";

                                                    return (
                                                        <Link 
                                                            key={m.href + m.titulo}
                                                            href={finalHref}
                                                            target={isExternal ? "_blank" : undefined}
                                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-slate-50/80 transition-colors gap-3"
                                                        >
                                                            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                                                                <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-primary-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                                    <ModIcon size={18} className="text-slate-600 group-hover:text-primary-600 transition-colors" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                                                                            {highlightText(m.titulo, searchTerm)}
                                                                        </h3>
                                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${criterioBadgeColor} hidden md:inline-block`}>
                                                                            {m.tipoCriterio}
                                                                        </span>
                                                                        {isExternal && (
                                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 hidden sm:inline-flex items-center gap-1">
                                                                                <ExternalLink size={8} /> Integrado
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                                                        {highlightText(m.desc, searchTerm)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                                    {m.badge}
                                                                </span>
                                                                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                                                                    <ArrowRight size={14} />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        /* FEEDBACK: NENHUM MÓDULO ENCONTRADO */
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-dashed border-slate-200"
                        >
                            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Search size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                                Nenhum módulo encontrado
                            </h3>
                            <p className="text-slate-500 text-xs max-w-md mx-auto mb-6">
                                Não encontramos dados para o termo <span className="font-semibold text-slate-800">"{searchTerm}"</span> com os filtros selecionados. Tente outras palavras ou limpe a busca.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("TODAS");
                                    setSelectedCriterio("TODOS");
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
                            >
                                Limpar Todos os Filtros
                            </button>
                        </motion.div>
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
