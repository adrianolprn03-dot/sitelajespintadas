"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaExternalLinkAlt,
    FaEdit,
    FaClipboardCheck,
    FaPlus,
    FaFileAlt,
    FaSearch,
} from "react-icons/fa";

interface CriterioItem {
    codigo: string;
    dimensao: string;
    titulo: string;
    classificacao: "ESSENCIAL" | "OBRIGATORIO" | "RECOMENDADO";
    peso: number;
    periodicidade: string;
    periodicidadeDias: number;
    exigeDisponibilidade: boolean;
    exigeAtualidade: boolean;
    exigeSerieHistorica: boolean;
    exigeGravacaoRelatorio: boolean;
    exigeFiltroPesquisa: boolean;
    rotaPublica: string;
    rotaAdmin: string;
    secretariaResponsavel: string;
    servidorResponsavel?: string | null;
    statusFuncionalidade: string;
    statusConteudo: string;
    statusEvidencia: string;
    statusValidacao: string;
    resultadoAvaliacaoExterna: string;
    resultadoCiclo?: {
        ciclo: string;
        classe?: string;
        disponibilidade: string;
        atualidade: string;
        serieHistorica: string;
        gravacaoRelatorio: string;
        filtro: string;
        evidenciaRadar?: string;
        evidenciaObs?: string;
        encaminhamento?: string;
    };
    evidenciaUrl?: string | null;
    observacoes?: string | null;
    ultimaAtualizacaoConteudo?: string | null;
    ultimaConferenciaEm?: string | null;
    diasDesdeConferencia?: number | null;
    prazoVencido: boolean;
}

interface ResumoPNTP {
    totalCriterios: number;
    totalEssenciais: number;
    essenciaisValidados: number;
    essenciaisPendentes: number;
    criteriosPrazoVencido: number;
    aguardandoRevisao: number;
    pesoTotal: number;
    percentualFuncionalidadeTecnica: number;
    percentualConteudoValidadoInterno: number;
    notaMetodologica: string;
}

interface DeclaracaoItem {
    id: string;
    modulo: string;
    criterioPntp?: string | null;
    tipoDeclaracao: string;
    exercicio: number;
    competencia?: number | null;
    justificativa: string;
    fundamentoLegal?: string | null;
    secretaria?: string | null;
    responsavelNome: string;
    dataDeclaracao: string;
}

export default function AdminPNTPPage() {
    const searchParams = useSearchParams();
    const [items, setItems] = useState<CriterioItem[]>([]);
    const [resumo, setResumo] = useState<ResumoPNTP | null>(null);
    const [declaracoes, setDeclaracoes] = useState<DeclaracaoItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [dimensao, setDimensao] = useState(searchParams.get("dimensao") || "Todas");
    const [classificacao, setClassificacao] = useState(searchParams.get("classificacao") || "Todas");
    const [secretaria, setSecretaria] = useState(searchParams.get("secretaria") || "Todas");
    const [filtro, setFiltro] = useState(searchParams.get("filtro") || "todos");

    const [editingItem, setEditingItem] = useState<CriterioItem | null>(null);
    const [showDeclaracaoModal, setShowDeclaracaoModal] = useState(false);
    const [novaDeclaracao, setNovaDeclaracao] = useState({
        modulo: "Convênios / Obras / Licitações",
        criterioPntp: "8.1",
        tipoDeclaracao: "nao_ocorrencia_declarada",
        exercicio: new Date().getFullYear(),
        competencia: "",
        justificativa: "",
        fundamentoLegal: "",
        secretaria: "Controladoria Geral",
        documentoUrl: "",
    });

    const [buscaAdmin, setBuscaAdmin] = useState("");

    const DIMENSOES_PNTP = [
        "Todas",
        "Informações Prioritárias",
        "Informações Institucionais",
        "Receita",
        "Despesa",
        "Convênios e Transferências",
        "Recursos Humanos",
        "Diárias",
        "Licitações",
        "Contratos",
        "Obras",
        "Planejamento e Prestação de Contas",
        "SIC",
        "Acessibilidade",
        "Ouvidoria",
        "LGPD e Governo Digital",
        "Renúncia de Receita",
        "Emendas Parlamentares",
        "Saúde",
        "Educação e Assistência Social"
    ];

    const carregarDados = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dimensao !== "Todas") params.set("dimensao", dimensao);
            if (classificacao !== "Todas") params.set("classificacao", classificacao);
            if (secretaria !== "Todas") params.set("secretaria", secretaria);
            if (filtro !== "todos") params.set("filtro", filtro);

            const res = await fetch(`/api/admin/pntp?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
                setResumo(data.resumo || null);
                setDeclaracoes(data.declaracoes || []);
            }
        } catch {
            toast.error("Erro ao carregar matriz PNTP.");
        } finally {
            setLoading(false);
        }
    }, [dimensao, classificacao, secretaria, filtro]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const handleConferirSemAlteracao = async (criterio: CriterioItem) => {
        if (!criterio.evidenciaUrl) {
            toast.error("Para homologar a conferência, registre a URL da evidência pública testada.");
            setEditingItem(criterio);
            return;
        }
        try {
            const res = await fetch("/api/admin/pntp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigo: criterio.codigo,
                    acao: "conferir",
                    evidenciaUrl: criterio.evidenciaUrl,
                }),
            });
            if (res.ok) {
                toast.success(`Conferência periódica registrada para o critério ${criterio.codigo} (sem alterar a data de conteúdo).`);
                carregarDados();
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao registrar conferência.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleSalvarCriterio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        if (editingItem.statusValidacao === "validado" && !editingItem.evidenciaUrl) {
            toast.error("É obrigatório registrar o link da evidência pública testada para homologar a validação.");
            return;
        }
        try {
            const res = await fetch("/api/admin/pntp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigo: editingItem.codigo,
                    acao: "atualizar",
                    statusFuncionalidade: editingItem.statusFuncionalidade,
                    statusConteudo: editingItem.statusConteudo,
                    statusEvidencia: editingItem.statusEvidencia,
                    statusValidacao: editingItem.statusValidacao,
                    resultadoAvaliacaoExterna: editingItem.resultadoAvaliacaoExterna,
                    secretariaResponsavel: editingItem.secretariaResponsavel,
                    evidenciaUrl: editingItem.evidenciaUrl,
                    observacoes: editingItem.observacoes,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Critério ${editingItem.codigo} atualizado!`);
                setEditingItem(null);
                carregarDados();
            } else {
                toast.error(data.error || "Erro ao salvar critério.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleSalvarDeclaracao = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/pntp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "declaracao",
                    ...novaDeclaracao,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Declaração formal registrada com sucesso!");
                setShowDeclaracaoModal(false);
                setNovaDeclaracao({
                    ...novaDeclaracao,
                    justificativa: "",
                    fundamentoLegal: "",
                });
                carregarDados();
            } else {
                toast.error(data.error || "Erro ao registrar declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaShieldAlt className="text-primary-600" /> Acompanhamento e Governança PNTP 2026
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Controle de critérios do Executivo Municipal (Cartilha PNTP 2026), prazos de atualidade, revisão pela Controladoria e declarações formais.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setShowDeclaracaoModal(true)}
                        className="btn-primary flex items-center gap-2 text-xs"
                    >
                        <FaPlus /> Declarar Não Ocorrência / Não Aplicabilidade
                    </button>
                    <Link
                        href="/admin/historico"
                        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2"
                    >
                        <FaFileAlt /> Histórico de Auditoria
                    </Link>
                </div>
            </div>

            {/* Estimativa Interna com Origem Demonstrada */}
            {resumo && (
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                                Indicador Interno de Governança (Não substitui certificação externa ATRICON)
                            </span>
                            <h2 className="text-lg font-black">
                                Demonstração da Origem dos Indicadores PNTP ({resumo.totalCriterios} Critérios Mapeados · Peso Total: {resumo.pesoTotal})
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                            <div className="text-2xl font-black text-emerald-400">
                                {resumo.percentualFuncionalidadeTecnica}%
                            </div>
                            <div className="text-xs font-bold text-slate-200 mt-1">1. Funcionalidade Técnica</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                                Soma dos pesos de módulos implementados / {resumo.pesoTotal}
                            </div>
                        </div>

                        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                            <div className="text-2xl font-black text-blue-400">
                                {resumo.percentualConteudoValidadoInterno}%
                            </div>
                            <div className="text-xs font-bold text-slate-200 mt-1">2. Conteúdo Validado (Interno)</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                                Critérios com conteúdo atualizado e homologado pela Controladoria
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setFiltro(filtro === "essenciais_pendentes" ? "todos" : "essenciais_pendentes")}
                            className="bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl p-4 border border-rose-500/40 transition-colors"
                        >
                            <div className="text-2xl font-black text-rose-400">
                                {resumo.essenciaisValidados} / {resumo.totalEssenciais}
                            </div>
                            <div className="text-xs font-bold text-slate-200 mt-1">3. Critérios Essenciais</div>
                            <div className="text-[10px] text-rose-300 mt-0.5">
                                {resumo.essenciaisPendentes} essenciais aguardando validação (clique p/ filtrar)
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFiltro(filtro === "vencidos" ? "todos" : "vencidos")}
                            className="bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl p-4 border border-amber-500/40 transition-colors"
                        >
                            <div className="text-2xl font-black text-amber-400">
                                {resumo.criteriosPrazoVencido}
                            </div>
                            <div className="text-xs font-bold text-slate-200 mt-1">4. Prazo de Conferência Vencido</div>
                            <div className="text-[10px] text-amber-300 mt-0.5">
                                Excederam a periodicidade máxima PNTP (clique p/ filtrar)
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFiltro(filtro === "aguardando_revisao" ? "todos" : "aguardando_revisao")}
                            className="bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl p-4 border border-indigo-500/40 transition-colors"
                        >
                            <div className="text-2xl font-black text-indigo-400">
                                {resumo.aguardandoRevisao}
                            </div>
                            <div className="text-xs font-bold text-slate-200 mt-1">5. Aguardando Revisão</div>
                            <div className="text-[10px] text-indigo-300 mt-0.5">
                                Pendentes de aprovação pela Controladoria (clique p/ filtrar)
                            </div>
                        </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong>Metodologia:</strong> {resumo.notaMetodologica}
                    </p>
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white rounded-2xl p-5 border border-[#DDE3EA] shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="lg:col-span-2">
                        <label htmlFor="f-busca" className="block text-[10px] font-black text-[#5B738B] uppercase mb-1">
                            Buscar Critério ou Termo
                        </label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                            <input
                                id="f-busca"
                                type="text"
                                value={buscaAdmin}
                                onChange={(e) => setBuscaAdmin(e.target.value)}
                                placeholder="Filtrar por código (1.1, 7.2), título..."
                                className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-medium text-[#12304A] outline-none focus:border-[#1254A3]"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="f-dimensao" className="block text-[10px] font-black text-[#5B738B] uppercase mb-1">
                            Dimensão PNTP
                        </label>
                        <select
                            id="f-dimensao"
                            value={dimensao}
                            onChange={(e) => setDimensao(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3] cursor-pointer"
                        >
                            {DIMENSOES_PNTP.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="f-classificacao" className="block text-[10px] font-black text-[#5B738B] uppercase mb-1">
                            Classificação PNTP
                        </label>
                        <select
                            id="f-classificacao"
                            value={classificacao}
                            onChange={(e) => setClassificacao(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3] cursor-pointer"
                        >
                            <option value="Todas">Todas</option>
                            <option value="ESSENCIAL">Essenciais</option>
                            <option value="OBRIGATORIO">Obrigatórios</option>
                            <option value="RECOMENDADO">Recomendados</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="f-filtro" className="block text-[10px] font-black text-[#5B738B] uppercase mb-1">
                            Filtro Operacional
                        </label>
                        <select
                            id="f-filtro"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3] cursor-pointer"
                        >
                            <option value="todos">Todos</option>
                            <option value="essenciais_pendentes">Essenciais Pendentes</option>
                            <option value="vencidos">Prazos Vencidos</option>
                            <option value="aguardando_revisao">Aguardando Revisão</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[#5B738B] font-medium">
                        Exibindo <strong>{items.filter(c => !buscaAdmin || c.codigo.includes(buscaAdmin) || c.titulo.toLowerCase().includes(buscaAdmin.toLowerCase()) || c.dimensao.toLowerCase().includes(buscaAdmin.toLowerCase())).length}</strong> critérios
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setBuscaAdmin("");
                            setDimensao("Todas");
                            setClassificacao("Todas");
                            setSecretaria("Todas");
                            setFiltro("todos");
                        }}
                        className="text-[#1254A3] font-bold hover:underline cursor-pointer"
                    >
                        Limpar todos os filtros
                    </button>
                </div>
            </div>

            {/* Tabela de Critérios */}
            <div className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8FAFC] text-[#5B738B] uppercase font-bold border-b border-[#DDE3EA]">
                            <tr>
                                <th className="px-4 py-3.5">Critério</th>
                                <th className="px-4 py-3.5">Classificação / Peso</th>
                                <th className="px-4 py-3.5">Secretaria / Periodicidade</th>
                                <th className="px-4 py-3.5">1. Funcionalidade</th>
                                <th className="px-4 py-3.5">2. Conteúdo</th>
                                <th className="px-4 py-3.5">3. Validação Interna</th>
                                <th className="px-4 py-3.5">4. Avaliação Externa</th>
                                <th className="px-4 py-3.5">Última Conferência</th>
                                <th className="px-4 py-3.5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DDE3EA]">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-[#5B738B]">
                                        Carregando matriz PNTP 2026...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-[#5B738B]">
                                        Nenhum critério encontrado para o filtro selecionado.
                                    </td>
                                </tr>
                            ) : (
                                items
                                    .filter(c => !buscaAdmin || c.codigo.includes(buscaAdmin) || c.titulo.toLowerCase().includes(buscaAdmin.toLowerCase()) || c.dimensao.toLowerCase().includes(buscaAdmin.toLowerCase()))
                                    .map((c) => (
                                    <tr key={c.codigo} className="hover:bg-gray-50/80">
                                        <td className="px-4 py-3.5 max-w-xs">
                                            <div className="font-black text-gray-900">
                                                {c.codigo} — {c.titulo}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">{c.dimensao}</div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <Link
                                                    href={c.rotaPublica}
                                                    target="_blank"
                                                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    Página Pública <FaExternalLinkAlt size={8} />
                                                </Link>
                                                <Link
                                                    href={c.rotaAdmin}
                                                    className="text-[10px] font-bold text-primary-600 hover:underline"
                                                >
                                                    Tela Admin →
                                                </Link>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <span

                                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${c.classificacao === "ESSENCIAL"
                                                    ? "bg-rose-100 text-rose-800"
                                                    : c.classificacao === "OBRIGATORIO"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {c.classificacao}
                                            </span>
                                            <div className="text-[10px] text-gray-500 mt-1">Peso {c.peso}</div>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-gray-700">{c.secretariaResponsavel}</div>
                                            <div className="text-[10px] text-gray-500">
                                                Regra: {c.periodicidade} ({c.periodicidadeDias}d)
                                            </div>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                                                {c.statusFuncionalidade}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.statusConteudo === "atualizado"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : c.statusConteudo === "nao_ocorrencia" || c.statusConteudo === "nao_aplicavel"
                                                        ? "bg-slate-100 text-slate-700"
                                                        : "bg-amber-100 text-amber-800"
                                                    }`}
                                            >
                                                {c.statusConteudo}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.statusValidacao === "validado"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : c.statusValidacao === "aguardando_revisao"
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {c.statusValidacao}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            {c.resultadoCiclo ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 font-mono text-[9px]">
                                                        <span title="Disponibilidade" className={`px-1 py-0.5 rounded font-black ${c.resultadoCiclo.disponibilidade === 'S' ? 'bg-emerald-100 text-emerald-800' : c.resultadoCiclo.disponibilidade === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>D:{c.resultadoCiclo.disponibilidade}</span>
                                                        <span title="Atualidade" className={`px-1 py-0.5 rounded font-black ${c.resultadoCiclo.atualidade === 'S' ? 'bg-emerald-100 text-emerald-800' : c.resultadoCiclo.atualidade === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>A:{c.resultadoCiclo.atualidade}</span>
                                                        <span title="Série Histórica" className={`px-1 py-0.5 rounded font-black ${c.resultadoCiclo.serieHistorica === 'S' ? 'bg-emerald-100 text-emerald-800' : c.resultadoCiclo.serieHistorica === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>H:{c.resultadoCiclo.serieHistorica}</span>
                                                        <span title="Gravação de Relatórios" className={`px-1 py-0.5 rounded font-black ${c.resultadoCiclo.gravacaoRelatorio === 'S' ? 'bg-emerald-100 text-emerald-800' : c.resultadoCiclo.gravacaoRelatorio === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>R:{c.resultadoCiclo.gravacaoRelatorio}</span>
                                                        <span title="Filtro" className={`px-1 py-0.5 rounded font-black ${c.resultadoCiclo.filtro === 'S' ? 'bg-emerald-100 text-emerald-800' : c.resultadoCiclo.filtro === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>F:{c.resultadoCiclo.filtro}</span>
                                                    </div>
                                                    {c.resultadoCiclo.evidenciaObs && (
                                                        <div className="text-[10px] text-gray-500 max-w-[180px] truncate italic" title={c.resultadoCiclo.evidenciaObs}>
                                                            {c.resultadoCiclo.evidenciaObs}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                                                    {c.resultadoAvaliacaoExterna}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5">
                                            {c.ultimaConferenciaEm ? (
                                                <div>
                                                    <div className="font-semibold text-gray-700">
                                                        {new Date(c.ultimaConferenciaEm).toLocaleDateString("pt-BR")}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">
                                                        há {c.diasDesdeConferencia ?? 0} dia(s)
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                                                    <FaExclamationTriangle /> Sem conferência
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleConferirSemAlteracao(c)}
                                                    title="Registrar Conferência Setorial Sem Alterar Conteúdo"
                                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1"
                                                >
                                                    <FaClipboardCheck /> Conferir
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingItem(c)}
                                                    title="Editar Status e Evidência"
                                                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center gap-1"
                                                >
                                                    <FaEdit /> Status
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Declarações Formais de Não Ocorrência / Não Aplicabilidade */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">
                            Declarações Formais Vigentes (Não Ocorrência no Período / Não Aplicabilidade)
                        </h3>
                        <p className="text-xs text-gray-500">
                            A ausência de registros no banco ou falha de integração nunca é convertida automaticamente em &ldquo;não houve ocorrência&rdquo;. Toda declaração exige ato formal abaixo.
                        </p>
                    </div>
                </div>

                {declaracoes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">
                        Nenhuma declaração formal de inexistência de fato ou não aplicabilidade cadastrada.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {declaracoes.map((d) => (
                            <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-slate-800 uppercase">
                                        {d.modulo} (Exercício {d.exercicio}
                                        {d.competencia ? ` / Mês ${d.competencia}` : ""})
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                                        {d.tipoDeclaracao}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600">{d.justificativa}</p>
                                {d.fundamentoLegal && (
                                    <p className="text-[11px] text-slate-500">
                                        <strong>Fundamento Legal:</strong> {d.fundamentoLegal}
                                    </p>
                                )}
                                <p className="text-[10px] text-slate-400">
                                    Declarado por {d.responsavelNome} ({d.secretaria || "Administração"}) em{" "}
                                    {new Date(d.dataDeclaracao).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Editar Critério */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSalvarCriterio}
                        className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
                    >
                        <h3 className="text-base font-bold text-gray-800">
                            Atualizar Critério {editingItem.codigo} — {editingItem.titulo}
                        </h3>

                        {editingItem.resultadoCiclo && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                                <div className="font-bold text-slate-800 flex items-center justify-between">
                                    <span>Auditoria Ciclo Oficial (Radar PNTP 2026):</span>
                                    <div className="flex gap-1 font-mono text-[9px]">
                                        <span title="Disponibilidade" className={`px-1.5 py-0.5 rounded font-black ${editingItem.resultadoCiclo.disponibilidade === 'S' ? 'bg-emerald-100 text-emerald-800' : editingItem.resultadoCiclo.disponibilidade === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>D:{editingItem.resultadoCiclo.disponibilidade}</span>
                                        <span title="Atualidade" className={`px-1.5 py-0.5 rounded font-black ${editingItem.resultadoCiclo.atualidade === 'S' ? 'bg-emerald-100 text-emerald-800' : editingItem.resultadoCiclo.atualidade === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>A:{editingItem.resultadoCiclo.atualidade}</span>
                                        <span title="Série Histórica" className={`px-1.5 py-0.5 rounded font-black ${editingItem.resultadoCiclo.serieHistorica === 'S' ? 'bg-emerald-100 text-emerald-800' : editingItem.resultadoCiclo.serieHistorica === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>H:{editingItem.resultadoCiclo.serieHistorica}</span>
                                        <span title="Gravação de Relatório" className={`px-1.5 py-0.5 rounded font-black ${editingItem.resultadoCiclo.gravacaoRelatorio === 'S' ? 'bg-emerald-100 text-emerald-800' : editingItem.resultadoCiclo.gravacaoRelatorio === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>R:{editingItem.resultadoCiclo.gravacaoRelatorio}</span>
                                        <span title="Filtro" className={`px-1.5 py-0.5 rounded font-black ${editingItem.resultadoCiclo.filtro === 'S' ? 'bg-emerald-100 text-emerald-800' : editingItem.resultadoCiclo.filtro === 'N' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'}`}>F:{editingItem.resultadoCiclo.filtro}</span>
                                    </div>
                                </div>
                                {editingItem.resultadoCiclo.evidenciaObs && (
                                    <p className="text-slate-600 text-[11px] italic">“{editingItem.resultadoCiclo.evidenciaObs}”</p>
                                )}
                                {editingItem.resultadoCiclo.encaminhamento && (
                                    <p className="text-blue-700 font-semibold text-[11px]">Encaminhamento Oficial: {editingItem.resultadoCiclo.encaminhamento}</p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Status Funcionalidade</label>
                                <select
                                    value={editingItem.statusFuncionalidade}
                                    onChange={(e) =>
                                        setEditingItem({ ...editingItem, statusFuncionalidade: e.target.value })
                                    }
                                    className="input-field text-xs"
                                >
                                    <option value="implementada">Implementada</option>
                                    <option value="em_ajuste">Em Ajuste</option>
                                    <option value="pendente">Pendente</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Status do Conteúdo</label>
                                <select
                                    value={editingItem.statusConteudo}
                                    onChange={(e) => setEditingItem({ ...editingItem, statusConteudo: e.target.value })}
                                    className="input-field text-xs"
                                >
                                    <option value="atualizado">Publicado e Atualizado</option>
                                    <option value="desatualizado">Necessita Atualização</option>
                                    <option value="pendente">Conteúdo Ainda Não Publicado</option>
                                    <option value="nao_ocorrencia">Não Ocorrência Formalmente Declarada</option>
                                    <option value="nao_aplicavel">Não Aplicável (Fundamentado)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Validação Interna (Controladoria)</label>
                                <select
                                    value={editingItem.statusValidacao}
                                    onChange={(e) =>
                                        setEditingItem({ ...editingItem, statusValidacao: e.target.value })
                                    }
                                    className="input-field text-xs"
                                >
                                    <option value="pendente">Pendente</option>
                                    <option value="aguardando_revisao">Aguardando Revisão</option>
                                    <option value="validado">Validado pela Controladoria</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Avaliação Externa (TCE/ATRICON)</label>
                                <select
                                    value={editingItem.resultadoAvaliacaoExterna}
                                    onChange={(e) =>
                                        setEditingItem({ ...editingItem, resultadoAvaliacaoExterna: e.target.value })
                                    }
                                    className="input-field text-xs"
                                >
                                    <option value="nao_avaliado">Ainda Não Avaliado</option>
                                    <option value="atendido">Atendido na Avaliação Externa</option>
                                    <option value="nao_atendido">Apontado para Correção</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Link de Evidência / Comprovante</label>
                            <input
                                type="text"
                                value={editingItem.evidenciaUrl || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, evidenciaUrl: e.target.value })}
                                className="input-field text-xs"
                                placeholder="https://... ou caminho do documento"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Observações da Revisão</label>
                            <textarea
                                rows={3}
                                value={editingItem.observacoes || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, observacoes: e.target.value })}
                                className="input-field text-xs"
                                placeholder="Detalhe pendências, documentos conferidos ou orientações..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary text-xs">
                                Salvar e Auditar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal Declaração Formal */}
            {showDeclaracaoModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSalvarDeclaracao}
                        className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
                    >
                        <h3 className="text-base font-bold text-gray-800">
                            Emitir Declaração Formal de Transparência
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Módulo / Assunto *</label>
                                <input
                                    type="text"
                                    required
                                    value={novaDeclaracao.modulo}
                                    onChange={(e) => setNovaDeclaracao({ ...novaDeclaracao, modulo: e.target.value })}
                                    className="input-field text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Tipo de Declaração *</label>
                                <select
                                    value={novaDeclaracao.tipoDeclaracao}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, tipoDeclaracao: e.target.value })
                                    }
                                    className="input-field text-xs"
                                >
                                    <option value="nao_ocorrencia_declarada">Não Houve Ocorrência no Período</option>
                                    <option value="nao_aplicavel">Não Aplicável ao Município</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Exercício *</label>
                                <input
                                    type="number"
                                    required
                                    value={novaDeclaracao.exercicio}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, exercicio: Number(e.target.value) })
                                    }
                                    className="input-field text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Critério PNTP</label>
                                <input
                                    type="text"
                                    value={novaDeclaracao.criterioPntp}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, criterioPntp: e.target.value })
                                    }
                                    className="input-field text-xs"
                                    placeholder="Ex: 8.4"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Justificativa Formal *</label>
                            <textarea
                                rows={3}
                                required
                                value={novaDeclaracao.justificativa}
                                onChange={(e) =>
                                    setNovaDeclaracao({ ...novaDeclaracao, justificativa: e.target.value })
                                }
                                className="input-field text-xs"
                                placeholder="Declare formalmente a inexistência de ocorrências no período..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Fundamento Legal (quando Não Aplicável)</label>
                            <input
                                type="text"
                                value={novaDeclaracao.fundamentoLegal}
                                onChange={(e) =>
                                    setNovaDeclaracao({ ...novaDeclaracao, fundamentoLegal: e.target.value })
                                }
                                className="input-field text-xs"
                                placeholder="Ex: Lei Municipal nº ..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t">
                            <button
                                type="button"
                                onClick={() => setShowDeclaracaoModal(false)}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary text-xs">
                                Emitir Declaração
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

