import React from "react";
import {
    FaLink,
    FaGlobe,
    FaFileLines,
    FaFilePdf,
    FaChartLine,
    FaChartPie,
    FaScaleBalanced,
    FaBuildingColumns,
    FaShieldHalved,
    FaHeartPulse,
    FaPills,
    FaGraduationCap,
    FaPersonDigging,
    FaTriangleExclamation,
    FaHandshake,
    FaGavel,
    FaCoins,
    FaReceipt,
    FaPlane,
    FaBus,
    FaClipboardList,
    FaBullhorn,
    FaComments,
    FaUserTie,
    FaUsers,
    FaIdCard,
    FaLock,
    FaBullseye,
    FaDownload,
    FaMapLocationDot,
    FaStar,
    FaBookOpen,
    FaSeedling,
} from "react-icons/fa6";

export interface ModuloAlvoOption {
    value: string;
    label: string;
    grupo: string;
}

export const CATEGORIAS_LINKS_EXTERNOS = [
    { value: "transparencia", label: "Transparência Pública" },
    { value: "relatorios", label: "Relatórios Fiscais / LRF" },
    { value: "legislacao", label: "Legislação & Atos Oficiais" },
    { value: "servicos", label: "Serviços ao Cidadão / Servidor" },
    { value: "geral", label: "Geral (todas as páginas)" },
];

export const MODULOS_ALVO_OPTIONS: ModuloAlvoOption[] = [
    { value: "", label: "Nenhum (Apenas listar nos links gerais)", grupo: "Geral" },

    // --- 1. PÁGINA INICIAL (HOME) ---
    { value: "home-transparencia", label: "Home: Atalho Portal da Transparência", grupo: "Página Inicial (Home)" },
    { value: "home-esic", label: "Home: Atalho e-SIC", grupo: "Página Inicial (Home)" },
    { value: "home-ouvidoria", label: "Home: Atalho Ouvidoria", grupo: "Página Inicial (Home)" },
    { value: "home-diario", label: "Home: Atalho Diário Oficial", grupo: "Página Inicial (Home)" },
    { value: "home-contribuinte", label: "Home: Atalho Portal do Contribuinte", grupo: "Página Inicial (Home)" },
    { value: "home-contracheque", label: "Home: Atalho Contracheque do Servidor", grupo: "Página Inicial (Home)" },
    { value: "home-licitacoes", label: "Home: Card Licitações Públicas", grupo: "Página Inicial (Home)" },
    { value: "home-contratos", label: "Home: Card Contratos Administrativos", grupo: "Página Inicial (Home)" },
    { value: "home-leis-decretos", label: "Home: Card Leis e Decretos", grupo: "Página Inicial (Home)" },
    { value: "home-prestacao-contas", label: "Home: Card Prestação de Contas (LRF)", grupo: "Página Inicial (Home)" },
    { value: "home-secretarias", label: "Home: Seção Secretarias Municipais", grupo: "Página Inicial (Home)" },
    { value: "home-simbolos", label: "Home: Card Identidade e Símbolos Oficiais", grupo: "Página Inicial (Home)" },
    { value: "home-historia", label: "Home: Card História da Cidade", grupo: "Página Inicial (Home)" },
    { value: "home-radar", label: "Home: Atalho Radar da Transparência", grupo: "Página Inicial (Home)" },
    { value: "home-webmail", label: "Home: Webmail Institucional", grupo: "Página Inicial (Home)" },

    // --- 2. EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA ---
    { value: "despesas", label: "Card: Despesas Públicas (Empenhos, Liquidações e Pagamentos)", grupo: "Execução Orçamentária" },
    { value: "receitas", label: "Card: Receitas Públicas e Arrecadação", grupo: "Execução Orçamentária" },
    { value: "ordem-cronologica", label: "Card: Ordem Cronológica de Pagamentos", grupo: "Execução Orçamentária" },
    { value: "transferencias", label: "Card: Repasses e Transferências Constitucionais", grupo: "Execução Orçamentária" },
    { value: "emendas", label: "Card: Emendas Parlamentares", grupo: "Execução Orçamentária" },
    { value: "emendas-pix", label: "Card: Emendas PIX (Transferências Especiais)", grupo: "Execução Orçamentária" },
    { value: "divida-ativa", label: "Card: Dívida Ativa Municipal", grupo: "Execução Orçamentária" },
    { value: "renuncias-fiscais", label: "Card: Renúncias Fiscais", grupo: "Execução Orçamentária" },
    { value: "desoneracoes", label: "Card: Desonerações Fiscais", grupo: "Execução Orçamentária" },
    { value: "incentivos-culturais", label: "Card: Incentivos Culturais e Esportivos", grupo: "Execução Orçamentária" },

    // --- 3. LICITAÇÕES, CONTRATOS E OBRAS ---
    { value: "licitacoes", label: "Card: Licitações Públicas (PNCP / Editais / Atas)", grupo: "Licitações, Contratos e Obras" },
    { value: "editais", label: "Card: Editais e Chamamentos Públicos", grupo: "Licitações, Contratos e Obras" },
    { value: "atas-registro", label: "Card: Atas de Registro de Preços (SRP)", grupo: "Licitações, Contratos e Obras" },
    { value: "contratos", label: "Card: Contratos Administrativos e Aditivos", grupo: "Licitações, Contratos e Obras" },
    { value: "fiscais-contratos", label: "Card: Fiscais de Contratos", grupo: "Licitações, Contratos e Obras" },
    { value: "sancoes", label: "Card: Sanções Administrativas e Empresas Impedidas", grupo: "Licitações, Contratos e Obras" },
    { value: "plano-contratacao", label: "Card: Plano de Contratação Anual (PCA / Lei 14.133)", grupo: "Licitações, Contratos e Obras" },
    { value: "convenios", label: "Card: Convênios Celebrados e Termos de Parceria", grupo: "Licitações, Contratos e Obras" },
    { value: "obras", label: "Card: Obras Públicas Municipais", grupo: "Licitações, Contratos e Obras" },
    { value: "obras-paralisadas", label: "Card: Obras Paralisadas (PNTP)", grupo: "Licitações, Contratos e Obras" },
    { value: "acordos-firmados", label: "Card: Acordos Firmados e Cooperação Técnica", grupo: "Licitações, Contratos e Obras" },
    { value: "associacoes", label: "Card: Associações e Consórcios Públicos", grupo: "Licitações, Contratos e Obras" },

    // --- 4. ATENDIMENTO AO CIDADÃO & OUVIDORIA ---
    { value: "esic", label: "Card: e-SIC (LAI - Acesso à Informação)", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "ouvidoria", label: "Card: Ouvidoria Municipal", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "carta-servicos", label: "Card: Carta de Serviços ao Usuário", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "passiva", label: "Card: Transparência Passiva (Estatísticas LAI)", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "pesquisa-satisfacao", label: "Card: Pesquisa de Satisfação", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "faq", label: "Card: Perguntas e Respostas Frequentes (FAQ)", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "glossario", label: "Card: Glossário de Termos Públicos", grupo: "Atendimento ao Cidadão & Ouvidoria" },
    { value: "contato", label: "Card: Fale Conosco / Contatos Oficiais", grupo: "Atendimento ao Cidadão & Ouvidoria" },

    // --- 5. GESTÃO DE PESSOAL E DIÁRIAS ---
    { value: "servidores", label: "Card: Servidores Públicos (Quadro de Pessoal)", grupo: "Gestão de Pessoal e Diárias" },
    { value: "folha-pagamento", label: "Card: Folha de Pagamento e Remunerações", grupo: "Gestão de Pessoal e Diárias" },
    { value: "cargos-e-salarios", label: "Card: Padrão Remuneratório (Cargos e Salários)", grupo: "Gestão de Pessoal e Diárias" },
    { value: "agentes-politicos", label: "Card: Relação de Agentes Políticos", grupo: "Gestão de Pessoal e Diárias" },
    { value: "diarias", label: "Card: Diárias e Passagens Concedidas", grupo: "Gestão de Pessoal e Diárias" },
    { value: "tabela-diarias", label: "Card: Tabela de Valores de Diárias (2021-2026)", grupo: "Gestão de Pessoal e Diárias" },
    { value: "regulamentacao-diarias", label: "Card: Regulamentação das Diárias", grupo: "Gestão de Pessoal e Diárias" },
    { value: "terceirizados", label: "Card: Trabalhadores Terceirizados", grupo: "Gestão de Pessoal e Diárias" },
    { value: "estagiarios", label: "Card: Estagiários Remunerados", grupo: "Gestão de Pessoal e Diárias" },
    { value: "concursos", label: "Card: Concursos Públicos Efetivos", grupo: "Gestão de Pessoal e Diárias" },
    { value: "processo-seletivo", label: "Card: Processos Seletivos Simplificados (PSS)", grupo: "Gestão de Pessoal e Diárias" },

    // --- 6. TRANSPARÊNCIA FISCAL E CONTAS PÚBLICAS ---
    { value: "orcamento", label: "Card: Planejamento Orçamentário (LOA, LDO, PPA)", grupo: "Transparência Fiscal e LRF" },
    { value: "lrf", label: "Card: Relatórios de Gestão Fiscal (RREO e RGF)", grupo: "Transparência Fiscal e LRF" },
    { value: "prestacao-contas", label: "Card: Prestação de Contas Anual e Balanço Geral", grupo: "Transparência Fiscal e LRF" },
    { value: "pcg", label: "Card: Contas de Governo (PCG - Chefe do Executivo)", grupo: "Transparência Fiscal e LRF" },
    { value: "pcs", label: "Card: Contas de Gestão (PCS - Fundos e Secretarias)", grupo: "Transparência Fiscal e LRF" },
    { value: "julgamento-contas", label: "Card: Julgamento das Contas pela Câmara", grupo: "Transparência Fiscal e LRF" },
    { value: "parecer-tce", label: "Card: Pareceres Prévios do TCE-RN", grupo: "Transparência Fiscal e LRF" },
    { value: "relatorio-gestao", label: "Card: Relatório de Gestão e Atividades", grupo: "Transparência Fiscal e LRF" },
    { value: "conselhos", label: "Card: Conselhos Municipais e FUNDEB", grupo: "Transparência Fiscal e LRF" },

    // --- 7. SAÚDE PÚBLICA E EDUCAÇÃO ---
    { value: "saude", label: "Card: Recursos e Investimentos da Saúde", grupo: "Saúde Pública e Educação" },
    { value: "unidades-saude", label: "Card: Unidades Básicas de Saúde (UBS)", grupo: "Saúde Pública e Educação" },
    { value: "medicamentos-sus", label: "Card: Lista de Medicamentos SUS (REMUME)", grupo: "Saúde Pública e Educação" },
    { value: "central-regulacao", label: "Card: Central de Regulação SUS (Exames e Filas)", grupo: "Saúde Pública e Educação" },
    { value: "plano-saude", label: "Card: Plano Municipal de Saúde (PMS)", grupo: "Saúde Pública e Educação" },
    { value: "programacao-anual-saude", label: "Card: Programação Anual de Saúde (PAS)", grupo: "Saúde Pública e Educação" },
    { value: "relatorio-anual-gestao", label: "Card: Relatório Anual de Gestão da Saúde (RAG)", grupo: "Saúde Pública e Educação" },
    { value: "unidades-escolares", label: "Card: Unidades Escolares (Escolas e Creches)", grupo: "Saúde Pública e Educação" },
    { value: "plano-educacao", label: "Card: Plano Municipal de Educação (PME)", grupo: "Saúde Pública e Educação" },

    // --- 8. INFORMAÇÕES INSTITUCIONAIS E GOVERNANÇA ---
    { value: "institucional", label: "Card: Dados Institucionais e Entidade", grupo: "Institucional e Governança" },
    { value: "competencias", label: "Card: Competências Legais e Atribuições", grupo: "Institucional e Governança" },
    { value: "organograma", label: "Card: Organograma Administrativo", grupo: "Institucional e Governança" },
    { value: "gestores", label: "Card: Gestores Municipais (Prefeito, Vice e Secretários)", grupo: "Institucional e Governança" },
    { value: "secretarias", label: "Card: Secretarias Municipais", grupo: "Institucional e Governança" },
    { value: "frota", label: "Card: Frota Municipal de Veículos", grupo: "Institucional e Governança" },
    { value: "acessibilidade", label: "Card: Recursos de Acessibilidade Digital", grupo: "Institucional e Governança" },
    { value: "governo-digital", label: "Card: Regulamentação do Governo Digital", grupo: "Institucional e Governança" },
    { value: "simbolos", label: "Card: Brasão, Hino e Bandeira Municipal", grupo: "Institucional e Governança" },

    // --- 9. LEGISLAÇÃO, ATOS OFICIAIS E PNTP 2026 ---
    { value: "legislacao", label: "Card: Legislação Municipal Consolidada", grupo: "Legislação e PNTP 2026" },
    { value: "leis", label: "Card: Leis Ordinárias e Complementares", grupo: "Legislação e PNTP 2026" },
    { value: "decretos", label: "Card: Decretos Executivos Municipais", grupo: "Legislação e PNTP 2026" },
    { value: "portarias", label: "Card: Portarias Administrativas", grupo: "Legislação e PNTP 2026" },
    { value: "publicacoes", label: "Card: Atos e Publicações Oficiais", grupo: "Legislação e PNTP 2026" },
    { value: "lgpd", label: "Card: LGPD e Privacidade (Encarregado DPO)", grupo: "Legislação e PNTP 2026" },
    { value: "integridade", label: "Card: Integridade Pública e Código de Conduta", grupo: "Legislação e PNTP 2026" },
    { value: "dados-abertos", label: "Card: Catálogo de Dados Abertos (CSV/JSON)", grupo: "Legislação e PNTP 2026" },
    { value: "radar", label: "Card: Radar da Transparência Pública (PNTP 2026)", grupo: "Legislação e PNTP 2026" },
];

export const ICONES_OPTIONS = [
    { value: "FaLink", label: "🔗 Link Genérico / URL Externa", grupo: "Navegação e Web" },
    { value: "FaGlobe", label: "🌐 Portal / Site Oficial Web", grupo: "Navegação e Web" },
    { value: "FaDownload", label: "📥 Arquivo para Download / Dados Abertos", grupo: "Navegação e Web" },
    { value: "FaMapLocationDot", label: "🗺️ Localização / Mapa do Site", grupo: "Navegação e Web" },
    { value: "FaStar", label: "⭐ Destaque Especial / Certificação Oficial", grupo: "Navegação e Web" },

    { value: "FaFileLines", label: "📄 Documento / Ofício / Portaria", grupo: "Documentos e Leis" },
    { value: "FaFilePdf", label: "📑 Arquivo PDF / Edital para Leitura", grupo: "Documentos e Leis" },
    { value: "FaBookOpen", label: "📖 Diário Oficial / Legislação Consolidada", grupo: "Documentos e Leis" },
    { value: "FaScaleBalanced", label: "⚖️ Legislação / Leis e Decretos", grupo: "Documentos e Leis" },
    { value: "FaLock", label: "🔒 LGPD / Privacidade / Segurança de Dados", grupo: "Documentos e Leis" },

    { value: "FaCoins", label: "💰 Receitas / Arrecadação / Finanças", grupo: "Finanças e Orçamento" },
    { value: "FaReceipt", label: "🧾 Despesas / Empenhos / Pagamentos", grupo: "Finanças e Orçamento" },
    { value: "FaChartLine", label: "📊 Relatório Financeiro / Gráfico LRF", grupo: "Finanças e Orçamento" },
    { value: "FaChartPie", label: "🥧 Prestação de Contas / Demonstrativo Contábil", grupo: "Finanças e Orçamento" },

    { value: "FaGavel", label: "🔨 Licitações / Pregões / Julgamento", grupo: "Compras e Contratos" },
    { value: "FaHandshake", label: "🤝 Contratos / Convênios / Parcerias", grupo: "Compras e Contratos" },
    { value: "FaPersonDigging", label: "🏗️ Obras Públicas / Infraestrutura", grupo: "Compras e Contratos" },
    { value: "FaTriangleExclamation", label: "🚧 Obras Paralisadas / Alertas", grupo: "Compras e Contratos" },

    { value: "FaHeartPulse", label: "🏥 Saúde Pública / UBS / SUS", grupo: "Saúde e Educação" },
    { value: "FaPills", label: "💊 Farmácia Básica / Medicamentos SUS", grupo: "Saúde e Educação" },
    { value: "FaGraduationCap", label: "🎓 Educação / Escolas / Creches", grupo: "Saúde e Educação" },

    { value: "FaBuildingColumns", label: "🏛️ Órgão Público / Sede Municipal / TCE", grupo: "Gestão e Pessoal" },
    { value: "FaShieldHalved", label: "🛡️ Transparência / Ouvidoria / Integridade", grupo: "Gestão e Pessoal" },
    { value: "FaUsers", label: "👥 Servidores / Quadro de Pessoal", grupo: "Gestão e Pessoal" },
    { value: "FaUserTie", label: "👤 Gestores / Prefeito / Secretários", grupo: "Gestão e Pessoal" },
    { value: "FaIdCard", label: "🪪 Contracheque / Holerite do Servidor", grupo: "Gestão e Pessoal" },
    { value: "FaPlane", label: "✈️ Diárias de Viagem / Deslocamentos", grupo: "Gestão e Pessoal" },
    { value: "FaBus", label: "🚍 Frota Municipal / Transporte Escolar", grupo: "Gestão e Pessoal" },
    { value: "FaClipboardList", label: "📋 Carta de Serviços / Protocolos", grupo: "Gestão e Pessoal" },
    { value: "FaBullhorn", label: "📢 Avisos Oficiais / Editais", grupo: "Gestão e Pessoal" },
    { value: "FaComments", label: "💬 Ouvidoria / e-SIC / Fale Conosco", grupo: "Gestão e Pessoal" },
    { value: "FaBullseye", label: "🎯 Radar da Transparência / Metas PNTP", grupo: "Gestão e Pessoal" },
    { value: "FaSeedling", label: "🌱 Agricultura / Meio Ambiente / Sustentabilidade", grupo: "Gestão e Pessoal" },
];

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    FaLink,
    FaGlobe,
    FaFileLines,
    FaFilePdf,
    FaChartLine,
    FaChartPie,
    FaScaleBalanced,
    FaBuildingColumns,
    FaShieldHalved,
    FaHeartPulse,
    FaPills,
    FaGraduationCap,
    FaPersonDigging,
    FaTriangleExclamation,
    FaHandshake,
    FaGavel,
    FaCoins,
    FaReceipt,
    FaPlane,
    FaBus,
    FaClipboardList,
    FaBullhorn,
    FaComments,
    FaUserTie,
    FaUsers,
    FaIdCard,
    FaLock,
    FaBullseye,
    FaDownload,
    FaMapLocationDot,
    FaStar,
    FaBookOpen,
    FaSeedling,
};

export function getIconComponent(iconName?: string | null): React.ComponentType<{ className?: string }> {
    if (!iconName) return FaLink;
    return ICON_MAP[iconName] || FaLink;
}

export function getModuloAlvoLabel(moduloAlvo?: string | null): string {
    if (!moduloAlvo) return "Geral / Sem vínculo específico";
    const found = MODULOS_ALVO_OPTIONS.find(
        (m) => m.value.toLowerCase() === moduloAlvo.toLowerCase()
    );
    return found ? found.label : `Módulo: ${moduloAlvo}`;
}

