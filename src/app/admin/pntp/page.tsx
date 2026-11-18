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
    FaFilePdf,
    FaArchive,
    FaTrash,
    FaMagic,
    FaStamp,
} from "react-icons/fa";
import AdminModal from "@/components/admin/AdminModal";
import {
    baixarCertidaoDeclaracaoPDF,
    type DeclaracaoRegistro,
} from "@/components/admin/DeclaracaoInexistenciaBanner";
import {
    CATALOGO_DECLARACOES_INEXISTENCIA,
    obterModeloDeclaracao,
} from "@/lib/declaracoes-catalogo";

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
    tipoSituacao?: string;
    exercicio: number;
    competencia?: string | null;
    justificativa: string;
    textoDeclaracao?: string;
    fundamentoLegal?: string | null;
    secretaria?: string | null;
    orgaoResponsavel?: string;
    responsavelNome: string;
    responsavelCargo?: string | null;
    arquivoAssinadoUrl?: string | null;
    dataDeclaracao: string;
    dataEmissao?: string;
    dataConferencia?: string;
    situacaoPublicacao?: string;
    ativa?: boolean;
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
    const [editingDecId, setEditingDecId] = useState<string | null>(null);
    const [novaDeclaracao, setNovaDeclaracao] = useState({
        modulo: "convenios_concedidos",
        criterioPntp: "5.2",
        tipoDeclaracao: "nao_ocorrencia_declarada",
        exercicio: new Date().getFullYear(),
        competencia: "Exercício Anual",
        justificativa: "",
        fundamentoLegal: "",
        secretaria: "Controladoria Geral do Município",
        responsavelNome: "Controladoria Geral do Município",
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

    const preencherModeloOficialDeclaracao = (slugAlvo = novaDeclaracao.modulo) => {
        const mod = obterModeloDeclaracao(slugAlvo || novaDeclaracao.criterioPntp);
        const ano = Number(novaDeclaracao.exercicio) || new Date().getFullYear();
        const comp = novaDeclaracao.competencia || "Exercício Anual";
        setNovaDeclaracao((prev) => ({
            ...prev,
            modulo: mod.slug !== "geral" ? mod.slug : prev.modulo,
            criterioPntp: mod.criterioPntp || prev.criterioPntp,
            secretaria: mod.orgaoResponsavelPadrao,
            responsavelNome: mod.responsavelNomePadrao,
            fundamentoLegal: mod.fundamentoLegalPadrao,
            justificativa: mod.gerarTextoPadrao(ano, comp, mod.orgaoResponsavelPadrao),
        }));
    };

    const abrirModalNovaDeclaracao = () => {
        setEditingDecId(null);
        const mod = obterModeloDeclaracao("terceirizados");
        const ano = new Date().getFullYear();
        setNovaDeclaracao({
            modulo: mod.slug,
            criterioPntp: mod.criterioPntp,
            tipoDeclaracao: "nao_ocorrencia_declarada",
            exercicio: ano,
            competencia: "Exercício Anual",
            justificativa: mod.gerarTextoPadrao(ano, "Exercício Anual", mod.orgaoResponsavelPadrao),
            fundamentoLegal: mod.fundamentoLegalPadrao,
            secretaria: mod.orgaoResponsavelPadrao,
            responsavelNome: mod.responsavelNomePadrao,
            documentoUrl: "",
        });
        setShowDeclaracaoModal(true);
    };

    const abrirModalEditarDeclaracao = (d: DeclaracaoItem) => {
        setEditingDecId(d.id);
        setNovaDeclaracao({
            modulo: d.modulo,
            criterioPntp: d.criterioPntp || "",
            tipoDeclaracao: d.tipoSituacao || d.tipoDeclaracao || "nao_ocorrencia_declarada",
            exercicio: d.exercicio,
            competencia: d.competencia ? String(d.competencia) : "Exercício Anual",
            justificativa: d.textoDeclaracao || d.justificativa || "",
            fundamentoLegal: d.fundamentoLegal || "",
            secretaria: d.orgaoResponsavel || d.secretaria || "Controladoria Geral do Município",
            responsavelNome: d.responsavelNome || "Controladoria Geral",
            documentoUrl: d.arquivoAssinadoUrl || "",
        });
        setShowDeclaracaoModal(true);
    };

    const handleDesativarDeclaracao = async (id: string) => {
        try {
            const res = await fetch(`/api/declaracoes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ativa: false }),
            });
            if (res.ok) {
                toast.success("Declaração arquivada e removida da exibição ativa.");
                carregarDados();
            } else {
                toast.error("Não foi possível arquivar a declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleExcluirDeclaracao = async (id: string) => {
        if (!confirm("Remover permanentemente esta declaração?")) return;
        try {
            const res = await fetch(`/api/declaracoes/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Declaração removida!");
                carregarDados();
            } else {
                toast.error("Não foi possível remover a declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleSalvarDeclaracao = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingDecId ? `/api/declaracoes/${editingDecId}` : "/api/declaracoes";
            const method = editingDecId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    modulo: novaDeclaracao.modulo,
                    criterioPntp: novaDeclaracao.criterioPntp || null,
                    tipoSituacao: novaDeclaracao.tipoDeclaracao,
                    exercicio: novaDeclaracao.exercicio,
                    competencia: novaDeclaracao.competencia || "Exercício Anual",
                    textoDeclaracao: novaDeclaracao.justificativa,
                    fundamentoLegal: novaDeclaracao.fundamentoLegal || null,
                    orgaoResponsavel: novaDeclaracao.secretaria,
                    responsavelNome: novaDeclaracao.responsavelNome,
                    arquivoAssinadoUrl: novaDeclaracao.documentoUrl || null,
                    ativa: true,
                    substituirAnteriores: true,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(
                    editingDecId
                        ? "Declaração atualizada com sucesso!"
                        : "Declaração formal registrada com sucesso!"
                );
                setShowDeclaracaoModal(false);
                setEditingDecId(null);
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
                        onClick={abrirModalNovaDeclaracao}
                        className="btn-primary flex items-center gap-2 text-xs"
                    >
                        <FaPlus /> Declarar Não Ocorrência / Não Aplicabilidade
                    </button>
                    <Link
                        href="/admin/declaracoes"
                        className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-bold text-[#0072CE] flex items-center gap-2"
                    >
                        <FaStamp /> Central de Declarações
                    </Link>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">
                            Declarações Formais Vigentes (Não Ocorrência no Período / Não Aplicabilidade)
                        </h3>
                        <p className="text-xs text-gray-500">
                            A ausência de registros no banco ou falha de integração nunca é convertida automaticamente em &ldquo;não houve ocorrência&rdquo;. Toda declaração exige ato formal abaixo.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Link
                            href="/admin/declaracoes"
                            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0072CE] text-xs font-bold flex items-center gap-1.5 border border-blue-200"
                        >
                            Central de Declarações <FaExternalLinkAlt size={10} />
                        </Link>
                        <button
                            type="button"
                            onClick={abrirModalNovaDeclaracao}
                            className="px-3.5 py-2 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-[#0F2942] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                        >
                            <FaPlus /> Nova Declaração
                        </button>
                    </div>
                </div>

                {declaracoes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">
                        Nenhuma declaração formal de inexistência de fato ou não aplicabilidade cadastrada.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {declaracoes.map((d) => {
                            const mod = obterModeloDeclaracao(d.modulo || d.criterioPntp);
                            const reg: DeclaracaoRegistro = {
                                id: d.id,
                                modulo: d.modulo,
                                criterioPntp: d.criterioPntp || null,
                                orgaoResponsavel: d.orgaoResponsavel || d.secretaria || "Administração",
                                exercicio: d.exercicio,
                                competencia: d.competencia ? String(d.competencia) : null,
                                tipoSituacao: d.tipoSituacao || d.tipoDeclaracao || "nao_ocorrencia_declarada",
                                textoDeclaracao: d.textoDeclaracao || d.justificativa,
                                fundamentoLegal: d.fundamentoLegal || null,
                                responsavelNome: d.responsavelNome,
                                responsavelCargo: d.responsavelCargo || null,
                                arquivoAssinadoUrl: d.arquivoAssinadoUrl || null,
                                dataEmissao: d.dataEmissao || d.dataDeclaracao,
                                dataConferencia: d.dataConferencia || d.dataDeclaracao,
                                situacaoPublicacao: d.situacaoPublicacao || "publicado",
                                ativa: d.ativa ?? true,
                            };
                            return (
                                <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-xs font-black text-slate-800 uppercase">
                                                {mod.slug !== "geral" ? mod.tituloCurto : d.modulo}
                                                {d.criterioPntp ? ` • Critério ${d.criterioPntp}` : ""} ({d.exercicio}
                                                {d.competencia ? ` / ${d.competencia}` : ""})
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

                                    <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => baixarCertidaoDeclaracaoPDF(reg, mod.titulo)}
                                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-[#0072CE] text-[#0072CE] hover:text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                                        >
                                            <FaFilePdf /> PDF
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => abrirModalEditarDeclaracao(d)}
                                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                                        >
                                            <FaEdit /> Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDesativarDeclaracao(d.id)}
                                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                                        >
                                            <FaArchive /> Arquivar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleExcluirDeclaracao(d.id)}
                                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                            title="Excluir declaração"
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Editar Critério */}
            <AdminModal
                open={Boolean(editingItem)}
                onClose={() => setEditingItem(null)}
                title={editingItem ? `Atualizar Critério ${editingItem.codigo} — ${editingItem.titulo}` : "Atualizar Critério"}
                maxWidth="lg"
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button type="submit" form="form-pntp-criterio" className="btn-primary text-xs">
                            Salvar e Auditar
                        </button>
                    </div>
                }
            >
                {editingItem && (
                    <form
                        id="form-pntp-criterio"
                        onSubmit={handleSalvarCriterio}
                        className="space-y-4"
                    >

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

                    </form>
                )}
            </AdminModal>

            {/* Modal Declaração Formal */}
            <AdminModal
                open={showDeclaracaoModal}
                onClose={() => setShowDeclaracaoModal(false)}
                title={editingDecId ? "Editar Declaração Formal de Transparência" : "Emitir Declaração Formal de Transparência"}
                maxWidth="xl"
                footer={
                    <div className="flex flex-wrap items-center justify-between w-full gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                preencherModeloOficialDeclaracao(novaDeclaracao.modulo);
                                toast.success("Modelo oficial PNTP preenchido!");
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-[#FACC15] text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-[#FACC15] transition cursor-pointer"
                        >
                            <FaMagic /> Preencher Modelo Oficial PNTP
                        </button>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDeclaracaoModal(false)}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button type="submit" form="form-pntp-declaracao" className="btn-primary text-xs">
                                {editingDecId ? "Salvar Alterações" : "Emitir Declaração"}
                            </button>
                        </div>
                    </div>
                }
            >
                <form
                    id="form-pntp-declaracao"
                    onSubmit={handleSalvarDeclaracao}
                    className="space-y-4"
                >

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Módulo / Assunto PNTP *</label>
                                <select
                                    value={
                                        CATALOGO_DECLARACOES_INEXISTENCIA.some((m) => m.slug === novaDeclaracao.modulo)
                                            ? novaDeclaracao.modulo
                                            : "geral"
                                    }
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!editingDecId) {
                                            preencherModeloOficialDeclaracao(val);
                                        } else {
                                            setNovaDeclaracao({ ...novaDeclaracao, modulo: val });
                                        }
                                    }}
                                    className="input-field text-xs font-semibold"
                                >
                                    {CATALOGO_DECLARACOES_INEXISTENCIA.map((m) => (
                                        <option key={m.slug} value={m.slug}>
                                            {m.criterioPntp ? `Critério ${m.criterioPntp} — ` : ""}
                                            {m.titulo}
                                        </option>
                                    ))}
                                </select>
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
                                    <option value="nao_ocorrencia_declarada">Não Houve Ocorrência / Inexistência no Período</option>
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
                                    placeholder="Ex: 6.6"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Competência / Período</label>
                                <input
                                    type="text"
                                    value={novaDeclaracao.competencia}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, competencia: e.target.value })
                                    }
                                    className="input-field text-xs"
                                    placeholder="Ex: Exercício Anual"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Órgão Responsável</label>
                                <input
                                    type="text"
                                    value={novaDeclaracao.secretaria}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, secretaria: e.target.value })
                                    }
                                    className="input-field text-xs"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Texto Oficial / Justificativa Formal *</label>
                            <textarea
                                rows={4}
                                required
                                value={novaDeclaracao.justificativa}
                                onChange={(e) =>
                                    setNovaDeclaracao({ ...novaDeclaracao, justificativa: e.target.value })
                                }
                                className="input-field text-xs"
                                placeholder="Declare formalmente a inexistência de ocorrências no período..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Fundamento Legal</label>
                                <input
                                    type="text"
                                    value={novaDeclaracao.fundamentoLegal}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, fundamentoLegal: e.target.value })
                                    }
                                    className="input-field text-xs"
                                    placeholder="Ex: Lei Federal nº 12.527/2011..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">URL PDF Assinado (Opcional)</label>
                                <input
                                    type="text"
                                    value={novaDeclaracao.documentoUrl}
                                    onChange={(e) =>
                                        setNovaDeclaracao({ ...novaDeclaracao, documentoUrl: e.target.value })
                                    }
                                    className="input-field text-xs"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                </form>
            </AdminModal>
        </div>
    );
}

