"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FaPills,
    FaListUl,
    FaCircleInfo,
    FaCheck,
    FaTriangleExclamation,
    FaBoxOpen,
    FaClock,
    FaIdCard,
    FaLocationDot as FaMapMarkerAlt,
    FaEnvelope,
    FaHandHoldingHeart,
    FaFlaskVial,
    FaMagnifyingGlass as FaSearch,
    FaBolt,
    FaBuildingColumns,
    FaPhone,
    FaArrowUpRightFromSquare,
    FaShieldHalved,
} from "react-icons/fa6";
import ExportButtons from "@/components/transparencia/ExportButtons";
import {
    COMPONENTES_SUS,
    DEFAULT_ORIENTACOES_MEDICAMENTOS,
    type BlocoComponenteOrientacao,
    type OrientacoesMedicamentosSUS,
} from "@/lib/assistencia-farmaceutica";

type Medicamento = {
    id: string;
    nome: string;
    principioAtivo?: string | null;
    apresentacao?: string | null;
    concentracao?: string | null;
    formaFarmaceutica?: string | null;
    unidadeMedida?: string | null;
    quantidadeEstoque?: number | null;
    estoqueStatus?: string | null;
    unidadeSaude?: string | null;
    dataReferenciaEstoque?: string | null;
    atualizadoEm?: string | null;
    categoria?: string;
    tipoComponente?: string | null;
    status?: string;
    observacao?: string | null;
    ativo: boolean;
};

function BlocoOrientacaoPublica({
    bloco,
    tema,
    componenteAlvo,
    onFiltrarComponente,
    canaisApoio,
}: {
    bloco: BlocoComponenteOrientacao;
    tema: "cbaf" | "ceaf";
    componenteAlvo: string;
    onFiltrarComponente: (comp: string) => void;
    canaisApoio: OrientacoesMedicamentosSUS["canaisApoio"];
}) {
    const isCeaf = tema === "ceaf";
    const gradientClass = isCeaf
        ? "from-[#1e1b4b] via-[#312e81] to-[#6366f1]"
        : "from-[#002241] via-[#003366] to-[#01b0ef]";
    const accentBadgeClass = isCeaf ? "text-purple-200" : "text-blue-200";
    const accentIconColor = isCeaf ? "text-indigo-600" : "text-[#003366]";
    const accentIconBg = isCeaf
        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
        : "bg-blue-50 text-[#003366] border-blue-100";
    const stepBadgeClass = isCeaf ? "bg-indigo-700 text-white" : "bg-[#003366] text-white";

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Banner do Componente */}
            <div
                className={`bg-gradient-to-r ${gradientClass} rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden`}
            >
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="max-w-3xl space-y-4">
                        <span
                            className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest ${accentBadgeClass}`}
                        >
                            <FaHandHoldingHeart className="text-emerald-400" /> {bloco.subtitulo}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
                            {bloco.titulo}
                        </h2>
                        <p className="text-blue-100 text-xs md:text-sm font-medium leading-relaxed">
                            {bloco.descricaoGeral}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => onFiltrarComponente(componenteAlvo)}
                            className="px-5 py-3.5 bg-white text-slate-900 hover:bg-blue-50 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <FaPills /> Ver Lista ({componenteAlvo})
                        </button>
                        {bloco.linkExternoUrl && (
                            <a
                                href={bloco.linkExternoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
                            >
                                <span>{bloco.linkExternoLabel || "Consultar Portal Oficial"}</span>
                                <FaArrowUpRightFromSquare size={11} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* 1. Etapas do Serviço */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border ${accentIconBg}`}
                    >
                        <FaListUl />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#01b0ef]">
                            Passo a Passo
                        </span>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            Etapas para Obtenção do Medicamento
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bloco.etapas.map((etapa, idx) => (
                        <div
                            key={etapa.id || idx}
                            className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-3 group hover:border-blue-200 hover:bg-white transition-all"
                        >
                            <div
                                className={`w-10 h-10 font-black text-sm rounded-xl flex items-center justify-center shadow-md ${stepBadgeClass}`}
                            >
                                {String(idx + 1).padStart(2, "0")}
                            </div>
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                {etapa.titulo}
                            </h4>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                {etapa.descricao}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Documentos Exigidos */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border border-emerald-100">
                        <FaIdCard />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            Documentação Exigida
                        </span>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            Requisitos e Documentos Necessários
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bloco.documentosExigidos.map((doc, idx) => (
                        <div
                            key={doc.id || idx}
                            className={`p-6 rounded-2xl border space-y-2.5 ${
                                doc.obrigatorio
                                    ? "bg-emerald-50/50 border-emerald-100"
                                    : "bg-slate-50/80 border-slate-200"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                        doc.obrigatorio
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-slate-200 text-slate-700"
                                    }`}
                                >
                                    <FaCheck size={10} />
                                    {doc.obrigatorio ? "Obrigatório" : "Quando Aplicável / Recomendado"}
                                </span>
                            </div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">
                                {doc.titulo}
                            </h4>
                            {doc.descricao && (
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    {doc.descricao}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Informações Operacionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                        <FaBolt />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Prazo / Fluxo
                        </span>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight mt-1 leading-snug">
                            {bloco.prazoEstimado}
                        </h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                        <FaClock />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Horário de Atendimento
                        </span>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight mt-1 leading-snug">
                            {bloco.horarioAtendimento}
                        </h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                        <FaHandHoldingHeart />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Custo ao Cidadão
                        </span>
                        <h4 className="text-sm font-black text-emerald-700 uppercase tracking-tight mt-1">
                            {bloco.custoCidadao}
                        </h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                        <FaMapMarkerAlt />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Locais de Atendimento
                        </span>
                        <ul className="text-xs font-bold text-gray-800 mt-1 space-y-1">
                            {bloco.locaisDispensacao.map((local, idx) => (
                                <li key={idx}>• {local}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 4. Endereço e Contato Direto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-3">
                    <div className={`flex items-center gap-3 ${accentIconColor}`}>
                        <FaBuildingColumns size={22} />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                            Endereço de Referência
                        </span>
                    </div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight leading-relaxed">
                        {bloco.enderecoPrincipal}
                    </h4>
                    <div className="pt-2">
                        <Link
                            href="/unidades-de-saude"
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:underline"
                        >
                            Ver todas as Unidades de Saúde e Farmácias <FaArrowUpRightFromSquare size={10} />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-3">
                    <div className={`flex items-center gap-3 ${accentIconColor}`}>
                        <FaEnvelope size={22} />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                            Dúvidas, Acompanhamento e Ouvidoria
                        </span>
                    </div>
                    <div className="space-y-2 text-xs font-bold text-gray-700">
                        {bloco.contatoTelefone && (
                            <div className="flex items-center gap-2">
                                <FaPhone className="text-emerald-600" />
                                <span>{bloco.contatoTelefone}</span>
                            </div>
                        )}
                        {bloco.contatoEmail && (
                            <a
                                href={`mailto:${bloco.contatoEmail}`}
                                className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
                            >
                                <FaEnvelope /> {bloco.contatoEmail}
                            </a>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                        Você também pode solicitar informações pelo{" "}
                        <Link href="/esic" className="text-[#003366] font-bold underline">
                            e-SIC / Ouvidoria Digital
                        </Link>
                        .
                    </p>
                </div>
            </div>

            {/* 5. Observações Importantes e Base Legal */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 space-y-4">
                <div className="flex items-center gap-3 text-slate-900">
                    <FaCircleInfo size={20} className="text-[#003366]" />
                    <h3 className="text-base font-black uppercase tracking-tight">
                        Orientações Complementares e Regras Sanitárias
                    </h3>
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                    {bloco.observacoesImportantes.map((obs, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#003366] font-black mt-0.5">•</span>
                            <span>{obs}</span>
                        </li>
                    ))}
                </ul>
                {canaisApoio.fundamentacaoLegal && (
                    <div className="pt-4 border-t border-slate-200 text-[11px] font-semibold text-slate-500 flex items-start gap-2">
                        <FaShieldHalved className="shrink-0 mt-0.5 text-slate-400" />
                        <span>{canaisApoio.fundamentacaoLegal}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MedicamentosSUSClient({
    medicamentos,
    orientacoes = DEFAULT_ORIENTACOES_MEDICAMENTOS,
    abaInicial = "lista",
}: {
    medicamentos: Medicamento[];
    orientacoes?: OrientacoesMedicamentosSUS;
    abaInicial?: "lista" | "como-obter" | "especializado";
}) {
    const [abaAtiva, setAbaAtiva] = useState<"lista" | "como-obter" | "especializado">(abaInicial);
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
    const [componenteFiltro, setComponenteFiltro] = useState("todos");
    const [statusFiltro, setStatusFiltro] = useState("todos");

    useEffect(() => {
        setAbaAtiva(abaInicial);
    }, [abaInicial]);

    const medicamentosArray = Array.isArray(medicamentos) ? medicamentos : [];

    const categorias = Array.from(
        new Set(medicamentosArray.map((m) => m?.categoria).filter((c): c is string => Boolean(c)))
    ).sort();

    const medicamentosFiltrados = medicamentosArray.filter((item) => {
        if (!item) return false;
        const comp = item.tipoComponente || "Básico (CBAF)";
        const matchComp = componenteFiltro === "todos" || comp === componenteFiltro;
        const matchStatus = statusFiltro === "todos" || item.status === statusFiltro;
        const matchCat = categoriaFiltro === "todos" || item.categoria === categoriaFiltro;
        const term = busca.toLowerCase().trim();
        const matchBusca =
            !term ||
            (item.nome || "").toLowerCase().includes(term) ||
            (item.principioAtivo && item.principioAtivo.toLowerCase().includes(term)) ||
            (item.categoria && item.categoria.toLowerCase().includes(term)) ||
            (item.apresentacao && item.apresentacao.toLowerCase().includes(term)) ||
            (item.unidadeSaude && item.unidadeSaude.toLowerCase().includes(term)) ||
            (item.observacao && item.observacao.toLowerCase().includes(term));
        return matchComp && matchStatus && matchCat && matchBusca;
    });

    const irParaListaDoComponente = (comp: string) => {
        setComponenteFiltro(comp);
        setCategoriaFiltro("todos");
        setAbaAtiva("lista");
    };

    return (
        <div className="space-y-10">
            {/* Seletor de Abas Principal */}
            <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-2.5 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 max-w-4xl mx-auto">
                <button
                    type="button"
                    onClick={() => setAbaAtiva("lista")}
                    className={`flex-1 py-4 px-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        abaAtiva === "lista"
                            ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20 scale-[1.02]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <FaListUl className="text-base shrink-0" />
                    <span>Relação REMUME ({medicamentosArray.length})</span>
                </button>
                <button
                    type="button"
                    onClick={() => setAbaAtiva("como-obter")}
                    className={`flex-1 py-4 px-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        abaAtiva === "como-obter"
                            ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20 scale-[1.02]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <FaCircleInfo className="text-base shrink-0" />
                    <span>Como Obter Básicos (CBAF)</span>
                </button>
                <button
                    type="button"
                    onClick={() => setAbaAtiva("especializado")}
                    className={`flex-1 py-4 px-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        abaAtiva === "especializado"
                            ? "bg-indigo-800 text-white shadow-lg shadow-indigo-900/20 scale-[1.02]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <FaFlaskVial className="text-base shrink-0" />
                    <span>Alto Custo (CEAF / LME)</span>
                </button>
            </div>

            {/* ABA 1: RELAÇÃO DE MEDICAMENTOS */}
            {abaAtiva === "lista" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* Barra de Filtros e Busca */}
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/30 space-y-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                                    <FaFlaskVial size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                        Catálogo de Medicamentos do SUS
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {medicamentosFiltrados.length} Itens Encontrados
                                    </p>
                                </div>
                            </div>
                            <ExportButtons data={medicamentosFiltrados} filename="lista_medicamentos_sus" />
                        </div>

                        {/* Filtro por Componente SUS + Busca */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setComponenteFiltro("todos")}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                        componenteFiltro === "todos"
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    Todos os Componentes
                                </button>
                                {COMPONENTES_SUS.map((comp) => (
                                    <button
                                        key={comp}
                                        type="button"
                                        onClick={() => setComponenteFiltro(comp)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                            componenteFiltro === comp
                                                ? comp === "Especializado (CEAF)"
                                                    ? "bg-indigo-700 text-white shadow-sm"
                                                    : "bg-[#003366] text-white shadow-sm"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {comp === "Especializado (CEAF)"
                                            ? "Alto Custo (CEAF)"
                                            : comp}
                                    </button>
                                ))}

                                <select
                                    value={statusFiltro}
                                    onChange={(e) => setStatusFiltro(e.target.value)}
                                    aria-label="Filtrar por disponibilidade"
                                    className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-[#003366]"
                                >
                                    <option value="todos">Qualquer Situação</option>
                                    <option value="disponivel">Apenas Disponíveis</option>
                                    <option value="indisponivel">Em Falta / Indisponível</option>
                                </select>
                            </div>

                            <div className="relative w-full lg:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input
                                    type="text"
                                    placeholder="Buscar nome, princípio ativo, categoria..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#003366]"
                                />
                            </div>
                        </div>

                        {/* Filtro de Categoria */}
                        {categorias.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setCategoriaFiltro("todos")}
                                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                                        categoriaFiltro === "todos"
                                            ? "bg-[#003366] text-white shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    Todas as Categorias
                                </button>
                                {categorias.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategoriaFiltro(cat)}
                                        className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                                            categoriaFiltro === cat
                                                ? "bg-[#003366] text-white shadow-sm"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cards de Acesso Rápido às Orientações */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setAbaAtiva("como-obter")}
                            className="text-left bg-white hover:bg-blue-50/40 border border-blue-100 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4 transition-all group"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]">
                                    Atenção Básica (CBAF)
                                </span>
                                <h4 className="text-sm font-black text-gray-900 mt-0.5">
                                    Como obter medicamentos gratuitos nas UBS / Farmácia Básica?
                                </h4>
                            </div>
                            <span className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#003366] text-xs font-black shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-colors">
                                Ver Guia
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setAbaAtiva("especializado")}
                            className="text-left bg-white hover:bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4 transition-all group"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">
                                    Componente Especializado (CEAF)
                                </span>
                                <h4 className="text-sm font-black text-gray-900 mt-0.5">
                                    Precisa de Medicamento de Alto Custo? Veja LME, PCDT e documentos
                                </h4>
                            </div>
                            <span className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-black shrink-0 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
                                Ver Alto Custo
                            </span>
                        </button>
                    </div>

                    {/* Grid de Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {medicamentosFiltrados.length === 0 ? (
                            <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-200 space-y-4">
                                <FaPills className="text-4xl text-gray-300 mx-auto" />
                                <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                                    Nenhum medicamento encontrado
                                </h4>
                                <p className="text-xs text-gray-400 font-medium">
                                    Tente ajustar a busca ou os filtros acima.
                                </p>
                            </div>
                        ) : (
                            medicamentosFiltrados.map((item) => {
                                const rawStatus = (item.estoqueStatus || item.status || "Disponível").toLowerCase();
                                let StatusIcon = FaCheck;
                                let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                let statusLabel = item.estoqueStatus || "Disponível";

                                if (rawStatus.includes("falta") || rawStatus.includes("indispon")) {
                                    StatusIcon = FaTriangleExclamation;
                                    statusColor = "bg-rose-50 text-rose-700 border-rose-200";
                                    statusLabel = "Em Falta";
                                } else if (rawStatus.includes("baixo") || rawStatus.includes("parcial")) {
                                    StatusIcon = FaBoxOpen;
                                    statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                                    statusLabel = "Baixo Estoque";
                                }

                                const componente = item.tipoComponente || "Básico (CBAF)";
                                const isCeaf = componente === "Especializado (CEAF)";
                                const isCesaf = componente === "Estratégico (CESAF)";
                                const refEstoque = item.dataReferenciaEstoque || item.atualizadoEm;
                                const qtd = item.quantidadeEstoque ?? 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-5">
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                                                        isCeaf
                                                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                                                            : isCesaf
                                                              ? "bg-teal-50 text-teal-800 border-teal-200"
                                                              : "bg-blue-50 text-[#003366] border-blue-100"
                                                    }`}
                                                >
                                                    {isCeaf ? "Alto Custo • CEAF" : componente}
                                                </span>
                                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100 text-right">
                                                    {item.categoria || item.formaFarmaceutica || "REMUME"}
                                                </span>
                                            </div>

                                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-[#003366] transition-colors leading-tight">
                                                {item.nome}
                                            </h4>

                                            {(item.principioAtivo || item.apresentacao || item.concentracao) && (
                                                <p className="text-xs text-slate-600 font-semibold mb-3">
                                                    {[item.principioAtivo, item.apresentacao || item.concentracao]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </p>
                                            )}

                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4 space-y-1.5 text-xs">
                                                <div className="flex justify-between gap-2">
                                                    <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">
                                                        Local / Fluxo:
                                                    </span>
                                                    <span className="text-slate-700 font-bold text-right">
                                                        {item.unidadeSaude || "Farmácia Básica Central"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">
                                                        {isCeaf ? "Acesso:" : "Disponibilidade:"}
                                                    </span>
                                                    <span className="text-slate-800 font-black text-right">
                                                        {isCeaf
                                                            ? qtd > 0
                                                                ? `${qtd} ${item.unidadeMedida || "un."}`
                                                                : "Mediante LME / PCDT"
                                                            : qtd > 0
                                                              ? `${qtd} ${item.unidadeMedida || "un."}`
                                                              : statusLabel === "Em Falta"
                                                                ? "Sem saldo no momento"
                                                                : "Elenco Municipal Ativo"}
                                                    </span>
                                                </div>
                                                {refEstoque && (
                                                    <div className="flex justify-between gap-2">
                                                        <span className="text-slate-400 font-bold uppercase text-[10px]">
                                                            Ref. Estoque:
                                                        </span>
                                                        <span className="text-slate-600 font-medium">
                                                            {new Date(refEstoque).toLocaleDateString("pt-BR")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {item.observacao && (
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                                                        &ldquo;{item.observacao}&rdquo;
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                                            <div
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${statusColor}`}
                                            >
                                                <StatusIcon size={12} /> {statusLabel}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setAbaAtiva(isCeaf ? "especializado" : "como-obter")
                                                }
                                                className="text-[10px] font-black text-[#003366] hover:underline uppercase"
                                            >
                                                Como obter →
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* ABA 2: COMO OBTER MEDICAMENTO DO COMPONENTE BÁSICO (CBAF) + ESTRATÉGICO (CESAF) */}
            {abaAtiva === "como-obter" && (
                <div className="space-y-10">
                    <BlocoOrientacaoPublica
                        bloco={orientacoes.cbaf}
                        tema="cbaf"
                        componenteAlvo="Básico (CBAF)"
                        onFiltrarComponente={irParaListaDoComponente}
                        canaisApoio={orientacoes.canaisApoio}
                    />

                    {/* Bloco Componente Estratégico (CESAF) */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-teal-100 shadow-xl space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
                                    Programas de Saúde Pública
                                </span>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {orientacoes.cesaf.titulo}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => irParaListaDoComponente("Estratégico (CESAF)")}
                                className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-black rounded-xl text-xs uppercase shrink-0"
                            >
                                Filtrar Estratégicos na Lista
                            </button>
                        </div>

                        <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                            {orientacoes.cesaf.resumo}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-teal-50/50 rounded-2xl p-5 border border-teal-100 space-y-2">
                                <div className="text-[11px] font-black uppercase text-teal-900">
                                    Programas Atendidos
                                </div>
                                <ul className="space-y-1.5 text-xs text-gray-700 font-semibold">
                                    {orientacoes.cesaf.exemplosProgramas.map((p, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <FaCheck className="text-teal-600 mt-0.5 shrink-0" size={11} />
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 flex flex-col justify-center">
                                <div className="text-[11px] font-black uppercase text-slate-500">
                                    Onde Retirar / Fluxo de Dispensação
                                </div>
                                <p className="text-xs md:text-sm text-gray-800 font-bold leading-relaxed">
                                    {orientacoes.cesaf.ondeRetirar}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA 3: COMPONENTE ESPECIALIZADO / ALTO CUSTO (CEAF) */}
            {abaAtiva === "especializado" && (
                <BlocoOrientacaoPublica
                    bloco={orientacoes.ceaf}
                    tema="ceaf"
                    componenteAlvo="Especializado (CEAF)"
                    onFiltrarComponente={irParaListaDoComponente}
                    canaisApoio={orientacoes.canaisApoio}
                />
            )}
        </div>
    );
}
