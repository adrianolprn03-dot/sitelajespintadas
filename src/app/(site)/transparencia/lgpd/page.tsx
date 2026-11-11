"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import { 
    FaShieldAlt, FaUserShield, FaServer, FaBalanceScale, FaCheckCircle, 
    FaLock, FaUserCheck, FaEye, FaDownload, FaFilter, FaCalendarAlt
} from "react-icons/fa";
import { FaScaleBalanced, FaFilePdf, FaFileLines } from "react-icons/fa6";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

type DocumentoPrivacidade = {
    id: string;
    titulo: string;
    subtitulo: string;
    desc: string;
    tipo: string;
    ano: number;
    mes: number;
    dataPublicacao: string;
    url: string;
};

const DOCUMENTOS_LGPD: DocumentoPrivacidade[] = [
    {
        id: "1",
        titulo: "Política Municipal de Privacidade e Proteção de Dados (PMPD)",
        subtitulo: "Decreto Municipal nº 042/2026",
        desc: "Regulamenta a aplicação da LGPD no âmbito da administração pública municipal de Lajes Pintadas/RN, estabelecendo competências, governança e salvaguardas para o tratamento de dados pessoais.",
        tipo: "Decreto Regulamentar",
        ano: 2026,
        mes: 6,
        dataPublicacao: "2026-06-15",
        url: "/docs/lgpd/decreto-regulamentacao-lgpd.pdf"
    },
    {
        id: "2",
        titulo: "Portaria de Designação do Encarregado de Dados (DPO)",
        subtitulo: "Portaria Municipal nº 018/2026",
        desc: "Designa formalmente o servidor público responsável pelas funções de Encarregado pelo Tratamento de Dados Pessoais do município, estabelecendo canais e atribuições regimentais.",
        tipo: "Portaria DPO",
        ano: 2026,
        mes: 1,
        dataPublicacao: "2026-01-20",
        url: "/docs/lgpd/portaria-designacao-dpo.pdf"
    },
    {
        id: "3",
        titulo: "Relatório de Impacto à Proteção de Dados Pessoais (RIPD)",
        subtitulo: "Ciclo de Conformidade 2026 / PNTP",
        desc: "Documento técnico contendo a descrição dos processos de tratamento de dados pessoais que podem gerar riscos às liberdades civis, bem como medidas e mecanismos de mitigação de riscos.",
        tipo: "Relatório de Impacto",
        ano: 2026,
        mes: 3,
        dataPublicacao: "2026-03-10",
        url: "/docs/lgpd/ripd-impacto-dados.pdf"
    },
    {
        id: "4",
        titulo: "Termo de Consentimento e Tratamento de Dados Pessoais",
        subtitulo: "Instrução Normativa nº 002/2026",
        desc: "Diretrizes e formulários operacionais para órgãos municipais regulando a coleta mínima de dados e atendimento aos princípios do consentimento esclarecido.",
        tipo: "Termos & Diretrizes",
        ano: 2026,
        mes: 2,
        dataPublicacao: "2026-02-14",
        url: "/docs/lgpd/termo-consentimento-lgpd.pdf"
    },
    {
        id: "5",
        titulo: "Procedimento Operacional de Atendimento aos Direitos do Titular",
        subtitulo: "Fluxo e-SIC / Ouvidoria Municipal",
        desc: "Regulamento para recebimento, triagem, apuração e resposta de requerimentos de titulares de dados pessoais com fulcro no Art. 18 da Lei Federal 13.709/2018.",
        tipo: "Procedimento",
        ano: 2026,
        mes: 4,
        dataPublicacao: "2026-04-05",
        url: "/docs/lgpd/procedimento-direitos-titular.pdf"
    },
    {
        id: "6",
        titulo: "Lei Geral de Proteção de Dados Pessoais (LGPD)",
        subtitulo: "Lei Federal nº 13.709/2018",
        desc: "Dispõe sobre o tratamento de dados pessoais, inclusive nos meios digitais, por pessoa natural ou jurídica de direito público ou privado, protegendo a liberdade e a privacidade.",
        tipo: "Legislação Federal",
        ano: 2025,
        mes: 8,
        dataPublicacao: "2025-08-14",
        url: "/docs/lgpd/lei-federal-13709-2018.pdf"
    },
    {
        id: "7",
        titulo: "Lei do Governo Digital",
        subtitulo: "Lei Federal nº 14.129/2021",
        desc: "Estabelece princípios, regras e instrumentos para o Governo Digital e para o aumento da eficiência pública nas administrações públicas municipais.",
        tipo: "Legislação Federal",
        ano: 2025,
        mes: 3,
        dataPublicacao: "2025-03-29",
        url: "/docs/lgpd/lei-federal-14129-2021.pdf"
    }
];

const TIPOS_PRIVACIDADE = [
    "Decreto Regulamentar",
    "Portaria DPO",
    "Relatório de Impacto",
    "Termos & Diretrizes",
    "Procedimento",
    "Legislação Federal"
];

export default function LGPDPage() {
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("2026");
    const [mes, setMes] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("");

    const filtrados = useMemo(() => {
        return DOCUMENTOS_LGPD.filter((doc) => {
            const b = busca.toLowerCase();
            const matchBusca = !busca || doc.titulo.toLowerCase().includes(b) || doc.desc.toLowerCase().includes(b) || doc.subtitulo.toLowerCase().includes(b);
            const matchAno = !ano || doc.ano.toString() === ano;
            const matchMes = !mes || doc.mes.toString() === mes;
            const matchTipo = !tipoFiltro || doc.tipo === tipoFiltro;
            return matchBusca && matchAno && matchMes && matchTipo;
        });
    }, [busca, ano, mes, tipoFiltro]);

    const handleClear = () => {
        setBusca("");
        setAno("2026");
        setMes("");
        setTipoFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map(d => ({
            "Título": d.titulo,
            "Ato / Referência": d.subtitulo,
            "Tipo": d.tipo,
            "Exercício": d.ano,
            "Mês": d.mes,
            "Data Publicação": new Date(d.dataPublicacao).toLocaleDateString("pt-BR"),
            "Descrição": d.desc
        }));

        const filename = `privacidade_lgpd_lajespintadas_${ano}${mes ? `_mes_${mes}` : ""}`;
        const title = `Atos de Privacidade e Proteção de Dados (LGPD) – Lajes Pintadas/RN (${ano}${mes ? ` - Mês ${mes}` : ""})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Privacidade e Proteção de Dados (LGPD)"
                subtitle="Segurança jurídica, diretrizes institucionais e integridade digital no tratamento das informações da nossa população."
                icon={<FaShieldAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Privacidade e LGPD" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Destaque e Canal DPO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Card de Compromisso Institucional */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-[#DDE3EA] shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold text-[#1254A3] uppercase tracking-wider mb-2 block">
                                Governança e Transparência Pública
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#12304A] mb-4 tracking-tight">
                                Proteção de Dados Pessoais em Lajes Pintadas
                            </h2>
                            <p className="text-sm text-[#5B738B] leading-relaxed mb-6 font-medium">
                                A Prefeitura Municipal de {MUNICIPIO.nome} implementa medidas de segurança, privacidade por padrão (Privacy by Default) e transparência no tratamento de dados pessoais, assegurando o cumprimento integral da Lei Federal nº 13.709/2018 (LGPD).
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[#DDE3EA] grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#12304A]">
                                <FaCheckCircle className="text-emerald-500 shrink-0" />
                                <span>Consentimento Legítimo</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#12304A]">
                                <FaLock className="text-[#1254A3] shrink-0" />
                                <span>Criptografia e Segurança</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#12304A]">
                                <FaUserCheck className="text-[#F39A32] shrink-0" />
                                <span>Direitos do Titular (Art. 18)</span>
                            </div>
                        </div>
                    </div>

                    {/* Card do Encarregado de Dados (DPO) */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDE3EA] shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-blue-50 text-[#1254A3] rounded-xl flex items-center justify-center mb-4">
                                <FaUserShield size={24} />
                            </div>
                            <span className="text-xs font-bold text-[#1254A3] uppercase tracking-wider block mb-1">
                                Encarregado pelo Tratamento (DPO)
                            </span>
                            <h3 className="text-lg font-black text-[#12304A] mb-4">Canal Oficial com o Cidadão</h3>
                            
                            <div className="space-y-3 text-xs mb-6">
                                <div>
                                    <span className="text-[10px] font-bold text-[#5B738B] uppercase block">Nome do Encarregado:</span>
                                    <span className="font-bold text-[#12304A]">{MUNICIPIO.dpo}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-[#5B738B] uppercase block">E-mail Institucional:</span>
                                    <a href={`mailto:${MUNICIPIO.dpoEmail}`} className="font-bold text-[#1254A3] hover:underline break-all">
                                        {MUNICIPIO.dpoEmail}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-[#5B738B] uppercase block">Horário de Expediente:</span>
                                    <span className="font-medium text-[#5B738B]">07h às 13h (segunda a sexta-feira)</span>
                                </div>
                            </div>
                        </div>

                        <a 
                            href="/servicos/esic" 
                            className="w-full py-2.5 px-4 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all text-center shadow-sm"
                        >
                            Solicitar Acesso / Exercer Direitos (e-SIC)
                        </a>
                    </div>
                </div>

                {/* Filtro de Mês, Ano e Busca para Atos de Privacidade */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-6 bg-[#1254A3] rounded-full" />
                            <h3 className="text-lg font-bold text-[#12304A]">
                                Atos Normativos, Regulamentações e Documentos de Privacidade
                            </h3>
                        </div>
                        <span className="text-xs font-semibold text-[#5B738B]">
                            {filtrados.length} documento{filtrados.length !== 1 ? "s" : ""} localizado{filtrados.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClear}
                        onExport={handleExport}
                        placeholder="Buscar por política, regulamentação, portaria ou termo..."
                    >
                        <select
                            value={tipoFiltro}
                            onChange={(e) => setTipoFiltro(e.target.value)}
                            className="bg-[#F5F7FA] border border-[#DDE3EA] px-4 py-2.5 rounded-xl text-xs font-bold text-[#12304A] outline-none shadow-sm cursor-pointer"
                        >
                            <option value="">Todos os Tipos de Documento</option>
                            {TIPOS_PRIVACIDADE.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </TransparencyFilters>
                </div>

                {/* Lista de Documentos Filtrados */}
                <div className="space-y-4 mb-12">
                    {filtrados.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm">
                            <FaShieldAlt className="text-slate-300 text-4xl mx-auto mb-3" />
                            <h4 className="text-base font-bold text-[#12304A] mb-1">Nenhum documento localizado</h4>
                            <p className="text-xs text-[#5B738B] mb-4">Verifique o período de mês/ano selecionado ou limpe os filtros de busca.</p>
                            <button 
                                onClick={handleClear} 
                                className="px-5 py-2.5 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm"
                            >
                                Resetar Filtros
                            </button>
                        </div>
                    ) : (
                        filtrados.map((doc) => (
                            <div 
                                key={doc.id}
                                className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm hover:border-[#1254A3]/50 transition-all p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center shrink-0 border border-blue-100">
                                        <FaFilePdf size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 uppercase tracking-wider">
                                                {doc.tipo}
                                            </span>
                                            <span className="text-xs font-semibold text-[#5B738B] flex items-center gap-1">
                                                <FaCalendarAlt size={10} className="text-slate-400" />
                                                {new Date(doc.dataPublicacao).toLocaleDateString("pt-BR")} (Mês {doc.mes})
                                            </span>
                                        </div>
                                        <h4 className="text-base font-bold text-[#12304A] mb-1">
                                            {doc.titulo}
                                        </h4>
                                        <p className="text-xs font-semibold text-[#1254A3] mb-1">
                                            {doc.subtitulo}
                                        </p>
                                        <p className="text-xs text-[#5B738B] leading-relaxed">
                                            {doc.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-[#1254A3] border border-[#DDE3EA] rounded-xl text-xs font-bold hover:bg-[#1254A3] hover:text-white hover:border-[#1254A3] transition-all shadow-sm"
                                    >
                                        <FaEye size={12} /> Visualizar
                                    </a>
                                    <a
                                        href={doc.url}
                                        download
                                        className="flex items-center gap-2 px-4 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm"
                                    >
                                        <FaDownload size={11} /> Baixar PDF
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Finalidade do Tratamento */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDE3EA] shadow-sm mb-12">
                    <h3 className="text-lg font-bold text-[#12304A] mb-2">Finalidades de Tratamento no Poder Público</h3>
                    <p className="text-xs text-[#5B738B] mb-6">Embasamento legal estrito conforme os artigos 7º e 11 da Lei Federal nº 13.709/2018:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium text-[#12304A]">
                        {[
                            "Execução de serviços públicos de Saúde Básica e Farmácia SUS",
                            "Matrículas e registros escolares na Rede Municipal de Ensino",
                            "Gestão de assistência social, CRAS e benefícios do Cadastro Único",
                            "Cumprimento de contratos, termos de cooperação e licitações",
                            "Folha de pagamento e recolhimento de obrigações previdenciárias",
                            "Processamento de pedidos via Sistema Eletrônico do e-SIC e Ouvidoria"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F7FA] border border-[#DDE3EA]">
                                <FaCheckCircle className="text-emerald-500 text-xs shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}