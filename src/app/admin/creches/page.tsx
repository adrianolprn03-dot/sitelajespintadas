"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaBabyCarriage,
    FaCheckCircle,
    FaEdit,
    FaListOl,
    FaPlus,
    FaSave,
    FaShieldAlt,
    FaSpinner,
    FaTrash,
} from "react-icons/fa";
import AdminModal from "@/components/admin/AdminModal";
import { CriterioPrioridadeCreche } from "@/lib/educacao";

type FilaItem = {
    id: string;
    protocoloAnonimizado: string;
    iniciaisCrianca: string;
    dataNascimentoMesAno: string;
    unidadeEscolar: string;
    turmaEtapa: string;
    criterioPrioridade: string;
    posicaoFila: number;
    status: string;
    ano: number;
};

type Declaracao = {
    id: string;
    exercicio: number;
    textoDeclaracao: string;
    fundamentoLegal: string;
    arquivoAssinadoUrl?: string | null;
    responsavelNome?: string | null;
    orgaoResponsavel?: string | null;
    dataEmissao: string;
    ativa: boolean;
};

export default function AdminCrechesPage() {
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const [fila, setFila] = useState<FilaItem[]>([]);
    const [declaracoes, setDeclaracoes] = useState<Declaracao[]>([]);
    const [criterios, setCriterios] = useState<CriterioPrioridadeCreche[]>([]);
    const [unidadesEscolares, setUnidadesEscolares] = useState<{ id: string; nome: string }[]>([]);

    // Modal Declaração (criação ou edição)
    const [modalDeclaracao, setModalDeclaracao] = useState(false);
    const [editDecId, setEditDecId] = useState<string | null>(null);
    const [decAno, setDecAno] = useState("2026");
    const [decOrgao, setDecOrgao] = useState("Secretaria Municipal de Educação, Cultura e Desporto");
    const [decResponsavel, setDecResponsavel] = useState("Secretaria Municipal de Educação");
    const [decTexto, setDecTexto] = useState(
        "A Prefeitura Municipal e a Secretaria de Educação declaram oficialmente que, até a presente competência, não há fila de espera para matrícula em creches e pré-escolas na rede pública municipal, visto que 100% da demanda foi atendida."
    );
    const [decFundamento, setDecFundamento] = useState(
        "Lei nº 9.394/96 (LDB), ECA (Lei nº 8.069/90) e Lei nº 12.527/11 (LAI)"
    );
    const [decArquivo, setDecArquivo] = useState("");
    const [decAtiva, setDecAtiva] = useState(true);

    // Modal Inscrição na Fila (criação ou edição)
    const [modalInscricao, setModalInscricao] = useState(false);
    const [editFilaId, setEditFilaId] = useState<string | null>(null);
    const [insProtocolo, setInsProtocolo] = useState("");
    const [insIniciais, setInsIniciais] = useState("");
    const [insNascimento, setInsNascimento] = useState("");
    const [insUnidade, setInsUnidade] = useState("");
    const [insTurma, setInsTurma] = useState("Berçário I (0 a 1 ano)");
    const [insCriterio, setInsCriterio] = useState("Proximidade da Residência");
    const [insPosicao, setInsPosicao] = useState(1);
    const [insStatus, setInsStatus] = useState("aguardando");
    const [insAno, setInsAno] = useState(2026);

    // Critérios de Priorização (aba/seção editável)
    const [novoCritTitulo, setNovoCritTitulo] = useState("");
    const [novoCritFund, setNovoCritFund] = useState("");
    const [novoCritDesc, setNovoCritDesc] = useState("");
    const [salvandoCriterios, setSalvandoCriterios] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/creches", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setFila(data.fila || []);
                setDeclaracoes(data.declaracoes || []);
                setCriterios(data.criteriosPrioridade || []);
                setUnidadesEscolares(data.unidadesEscolares || []);
            }
        } catch {
            toast.error("Erro ao carregar dados de creches.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const abrirNovaDeclaracao = () => {
        setEditDecId(null);
        setDecAno(String(new Date().getFullYear()));
        setDecOrgao("Secretaria Municipal de Educação, Cultura e Desporto");
        setDecResponsavel("Secretaria Municipal de Educação");
        setDecTexto(
            "A Prefeitura Municipal e a Secretaria de Educação declaram oficialmente que, até a presente competência, não há fila de espera para matrícula em creches e pré-escolas na rede pública municipal, visto que 100% da demanda foi atendida."
        );
        setDecFundamento("Lei nº 9.394/96 (LDB), ECA (Lei nº 8.069/90) e Lei nº 12.527/11 (LAI)");
        setDecArquivo("");
        setDecAtiva(true);
        setModalDeclaracao(true);
    };

    const abrirEditarDeclaracao = (d: Declaracao) => {
        setEditDecId(d.id);
        setDecAno(String(d.exercicio));
        setDecOrgao(d.orgaoResponsavel || "Secretaria Municipal de Educação");
        setDecResponsavel(d.responsavelNome || "");
        setDecTexto(d.textoDeclaracao);
        setDecFundamento(d.fundamentoLegal);
        setDecArquivo(d.arquivoAssinadoUrl || "");
        setDecAtiva(Boolean(d.ativa));
        setModalDeclaracao(true);
    };

    const handleSalvarDeclaracao = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const method = editDecId ? "PUT" : "POST";
            const res = await fetch("/api/admin/creches", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editDecId || undefined,
                    tipoOperacao: "declaracao",
                    exercicio: Number(decAno) || new Date().getFullYear(),
                    orgaoResponsavel: decOrgao,
                    responsavelNome: decResponsavel,
                    textoDeclaracao: decTexto,
                    fundamentoLegal: decFundamento,
                    arquivoAssinadoUrl: decArquivo,
                    ativa: decAtiva,
                }),
            });

            if (res.ok) {
                toast.success(editDecId ? "Declaração atualizada!" : "Declaração oficial publicada!");
                setModalDeclaracao(false);
                fetchData();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao salvar declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSalvando(false);
        }
    };

    const handleExcluirDeclaracao = async (id: string) => {
        if (!confirm("Remover esta declaração oficial do histórico?")) return;
        try {
            const res = await fetch(`/api/admin/creches?type=declaracao&id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Declaração removida!");
                fetchData();
            } else {
                toast.error("Erro ao remover declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const abrirNovaInscricao = () => {
        setEditFilaId(null);
        setInsProtocolo("");
        setInsIniciais("");
        setInsNascimento("");
        setInsUnidade(unidadesEscolares[0]?.nome || "");
        setInsTurma("Berçário I (0 a 1 ano)");
        setInsCriterio(criterios[0]?.titulo || "Proximidade da Residência");
        setInsPosicao(fila.length + 1);
        setInsStatus("aguardando");
        setInsAno(new Date().getFullYear());
        setModalInscricao(true);
    };

    const abrirEditarInscricao = (item: FilaItem) => {
        setEditFilaId(item.id);
        setInsProtocolo(item.protocoloAnonimizado);
        setInsIniciais(item.iniciaisCrianca);
        setInsNascimento(item.dataNascimentoMesAno);
        setInsUnidade(item.unidadeEscolar);
        setInsTurma(item.turmaEtapa);
        setInsCriterio(item.criterioPrioridade);
        setInsPosicao(item.posicaoFila);
        setInsStatus(item.status);
        setInsAno(item.ano);
        setModalInscricao(true);
    };

    const handleSalvarInscricao = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const method = editFilaId ? "PUT" : "POST";
            const res = await fetch("/api/admin/creches", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editFilaId || undefined,
                    tipoOperacao: "fila",
                    protocoloAnonimizado: insProtocolo,
                    iniciaisCrianca: insIniciais,
                    dataNascimentoMesAno: insNascimento,
                    unidadeEscolar: insUnidade,
                    turmaEtapa: insTurma,
                    criterioPrioridade: insCriterio,
                    posicaoFila: insPosicao,
                    status: insStatus,
                    ano: insAno,
                }),
            });
            if (res.ok) {
                toast.success(editFilaId ? "Inscrição atualizada!" : "Inscrição registrada na fila!");
                setModalInscricao(false);
                fetchData();
            } else {
                toast.error("Erro ao salvar inscrição.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSalvando(false);
        }
    };

    const handleAlterarStatusRapido = async (id: string, novoStatus: string) => {
        try {
            const res = await fetch("/api/admin/creches", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, tipoOperacao: "fila", status: novoStatus }),
            });
            if (res.ok) {
                toast.success("Status atualizado!");
                setFila((prev) => prev.map((f) => (f.id === id ? { ...f, status: novoStatus } : f)));
            }
        } catch {
            toast.error("Erro ao alterar status.");
        }
    };

    const handleExcluirInscricao = async (id: string, protocolo: string) => {
        if (!confirm(`Excluir a inscrição "${protocolo}" da fila de creches?`)) return;
        try {
            const res = await fetch(`/api/admin/creches?type=fila&id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Inscrição removida!");
                setFila((prev) => prev.filter((f) => f.id !== id));
            } else {
                toast.error("Erro ao excluir inscrição.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleAdicionarCriterio = () => {
        if (!novoCritTitulo.trim()) {
            toast.error("Informe o título do critério de priorização.");
            return;
        }
        const proximo = [
            ...criterios,
            {
                ordem: criterios.length + 1,
                titulo: novoCritTitulo.trim(),
                fundamento: novoCritFund.trim() || "ECA / LDB / Resolução Municipal",
                descricao: novoCritDesc.trim(),
            },
        ];
        setCriterios(proximo);
        setNovoCritTitulo("");
        setNovoCritFund("");
        setNovoCritDesc("");
    };

    const handleRemoverCriterio = (idx: number) => {
        const atualizado = criterios
            .filter((_, i) => i !== idx)
            .map((c, index) => ({ ...c, ordem: index + 1 }));
        setCriterios(atualizado);
    };

    const handleSalvarCriterios = async () => {
        setSalvandoCriterios(true);
        try {
            const res = await fetch("/api/admin/creches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "criterios",
                    criterios,
                }),
            });
            if (res.ok) {
                toast.success("Critérios de priorização salvos e publicados no portal!");
                fetchData();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao salvar critérios.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSalvandoCriterios(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FaBabyCarriage className="text-[#1254A3]" />
                        Gestão de Creches, Critérios e Demanda Escolar (PNTP 19.2)
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Controle da fila de espera anonimizada, critérios legais de priorização e declaração formal de inexistência de demanda reprimida.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={abrirNovaDeclaracao}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-sm cursor-pointer"
                    >
                        <FaShieldAlt /> Nova Declaração Oficial
                    </button>
                    <button
                        onClick={abrirNovaInscricao}
                        className="px-4 py-2.5 bg-[#1254A3] hover:bg-blue-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-sm cursor-pointer"
                    >
                        <FaPlus /> Nova Inscrição na Fila
                    </button>
                </div>
            </div>

            {/* Cards Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Situação Geral</span>
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xl font-bold text-gray-800">
                            {fila.filter((f) => f.status === "aguardando").length === 0
                                ? "Demanda 100% Atendida"
                                : `${fila.filter((f) => f.status === "aguardando").length} Aguardando na Fila`}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">Atualizado em tempo real no Portal da Transparência.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        Critérios de Priorização (19.2)
                    </span>
                    <span className="text-2xl font-black text-[#1254A3]">{criterios.length}</span>
                    <p className="text-xs text-gray-500">Regras oficiais ordenadas por prioridade legal.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        Declarações Publicadas
                    </span>
                    <span className="text-2xl font-black text-emerald-600">{declaracoes.length}</span>
                    <p className="text-xs text-gray-500">Registro histórico em PostgreSQL com vigência anual.</p>
                </div>
            </div>

            {/* Declarações Oficiais */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaShieldAlt className="text-amber-500" /> Declarações Oficiais Publicadas
                </h2>

                {declaracoes.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-sm">
                        <p className="font-bold">Nenhuma declaração cadastrada no banco de dados.</p>
                        <p className="text-xs mt-1">
                            Clique em “Nova Declaração Oficial” para publicar a declaração oficial do exercício atual.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {declaracoes.map((d) => (
                            <div
                                key={d.id}
                                className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-start justify-between gap-4"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-sm text-gray-800">
                                            Exercício: {d.exercicio} • {d.orgaoResponsavel}
                                        </span>
                                        <span
                                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                                d.ativa
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-slate-200 text-slate-600"
                                            }`}
                                        >
                                            {d.ativa ? "Ativa no Portal" : "Inativa / Arquivada"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-700 italic">“{d.textoDeclaracao}”</p>
                                    <div className="text-[11px] text-gray-500 flex flex-wrap gap-4">
                                        <span>Fundamento: {d.fundamentoLegal}</span>
                                        <span>Responsável: {d.responsavelNome || "Secretaria Municipal de Educação"}</span>
                                        <span>Emitida em: {new Date(d.dataEmissao).toLocaleDateString("pt-BR")}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => abrirEditarDeclaracao(d)}
                                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExcluirDeclaracao(d.id)}
                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                                        title="Excluir declaração"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Critérios de Priorização Editáveis (PNTP 19.2) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaListOl className="text-[#1254A3]" /> Critérios de Priorização de Acesso em Creches (PNTP 19.2)
                        </h2>
                        <p className="text-xs text-gray-500">
                            Defina a ordem de prioridade legal publicada na aba “Critérios de Prioridade” do portal público.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSalvarCriterios}
                        disabled={salvandoCriterios}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                        {salvandoCriterios ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Ordem de Critérios
                    </button>
                </div>

                <div className="space-y-3">
                    {criterios.map((crit, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
                        >
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ordem</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={crit.ordem}
                                    onChange={(e) =>
                                        setCriterios((prev) =>
                                            prev.map((c, i) =>
                                                i === idx ? { ...c, ordem: parseInt(e.target.value, 10) || 1 } : c
                                            )
                                        )
                                    }
                                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-center"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título do Critério</label>
                                <input
                                    type="text"
                                    value={crit.titulo}
                                    onChange={(e) =>
                                        setCriterios((prev) =>
                                            prev.map((c, i) => (i === idx ? { ...c, titulo: e.target.value } : c))
                                        )
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fundamento Legal</label>
                                <input
                                    type="text"
                                    value={crit.fundamento}
                                    onChange={(e) =>
                                        setCriterios((prev) =>
                                            prev.map((c, i) => (i === idx ? { ...c, fundamento: e.target.value } : c))
                                        )
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descrição</label>
                                <input
                                    type="text"
                                    value={crit.descricao}
                                    onChange={(e) =>
                                        setCriterios((prev) =>
                                            prev.map((c, i) => (i === idx ? { ...c, descricao: e.target.value } : c))
                                        )
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                                />
                            </div>
                            <div className="md:col-span-1 flex justify-end md:pt-5">
                                <button
                                    type="button"
                                    onClick={() => handleRemoverCriterio(idx)}
                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                                    title="Remover critério"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Adicionar novo critério */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Novo Critério</label>
                        <input
                            type="text"
                            placeholder="Ex: Criança em acolhimento institucional"
                            value={novoCritTitulo}
                            onChange={(e) => setNovoCritTitulo(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-xs"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fundamento Legal</label>
                        <input
                            type="text"
                            placeholder="Ex: Art. 53 do ECA"
                            value={novoCritFund}
                            onChange={(e) => setNovoCritFund(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-xs"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detalhamento</label>
                        <input
                            type="text"
                            placeholder="Descrição resumida..."
                            value={novoCritDesc}
                            onChange={(e) => setNovoCritDesc(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-xs"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            onClick={handleAdicionarCriterio}
                            className="w-full py-2 px-3 bg-[#1254A3] hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <FaPlus /> Incluir
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabela de Inscrições na Fila */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-800">Inscrições Registradas na Lista de Espera</h2>
                    <span className="text-xs text-gray-400">Total: {fila.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Posição</th>
                                <th className="p-4">Protocolo</th>
                                <th className="p-4">Iniciais</th>
                                <th className="p-4">Unidade Escolar</th>
                                <th className="p-4">Etapa/Turma</th>
                                <th className="p-4">Critério Prioridade</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400">
                                        <FaSpinner className="animate-spin inline-block mr-2" /> Carregando...
                                    </td>
                                </tr>
                            ) : fila.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400 italic">
                                        Nenhuma criança na fila de espera. Demanda atendida integralmente pela rede municipal.
                                    </td>
                                </tr>
                            ) : (
                                fila.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-[#1254A3]">#{item.posicaoFila}</td>
                                        <td className="p-4 font-mono font-bold">{item.protocoloAnonimizado}</td>
                                        <td className="p-4">{item.iniciaisCrianca}</td>
                                        <td className="p-4">{item.unidadeEscolar}</td>
                                        <td className="p-4">{item.turmaEtapa}</td>
                                        <td className="p-4 text-xs">{item.criterioPrioridade}</td>
                                        <td className="p-4">
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleAlterarStatusRapido(item.id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${
                                                    item.status === "matriculado"
                                                        ? "bg-green-100 text-green-800"
                                                        : item.status === "convocado"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-amber-100 text-amber-800"
                                                }`}
                                            >
                                                <option value="aguardando">aguardando</option>
                                                <option value="convocado">convocado</option>
                                                <option value="matriculado">matriculado</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => abrirEditarInscricao(item)}
                                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                                title="Editar inscrição"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExcluirInscricao(item.id, item.protocoloAnonimizado)}
                                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                                                title="Excluir inscrição"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Declaração */}
            <AdminModal
                open={modalDeclaracao}
                onClose={() => setModalDeclaracao(false)}
                title={editDecId ? "Editar Declaração Oficial" : "Publicar Declaração Oficial de Inexistência de Fila"}
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setModalDeclaracao(false)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-creche-declaracao"
                            disabled={salvando}
                            className="px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                        >
                            {salvando ? "Salvando..." : editDecId ? "Atualizar Declaração" : "Publicar Declaração"}
                        </button>
                    </>
                }
            >
                <form id="form-creche-declaracao" onSubmit={handleSalvarDeclaracao} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Exercício</label>
                            <input
                                type="number"
                                value={decAno}
                                onChange={(e) => setDecAno(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Órgão Responsável</label>
                            <input
                                type="text"
                                value={decOrgao}
                                onChange={(e) => setDecOrgao(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Texto da Declaração Formal
                        </label>
                        <textarea
                            value={decTexto}
                            onChange={(e) => setDecTexto(e.target.value)}
                            rows={4}
                            className="w-full border rounded-xl p-3 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fundamento Legal</label>
                        <input
                            type="text"
                            value={decFundamento}
                            onChange={(e) => setDecFundamento(e.target.value)}
                            className="w-full border rounded-xl p-2.5 text-sm"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Responsável pela Emissão</label>
                            <input
                                type="text"
                                value={decResponsavel}
                                onChange={(e) => setDecResponsavel(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Link do Documento Assinado (PDF)
                            </label>
                            <input
                                type="text"
                                placeholder="https://... ou caminho do PDF"
                                value={decArquivo}
                                onChange={(e) => setDecArquivo(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                            />
                        </div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={decAtiva}
                            onChange={(e) => setDecAtiva(e.target.checked)}
                            className="w-4 h-4 accent-emerald-600"
                        />
                        <FaCheckCircle className="text-emerald-600" /> Declaração Ativa e Vigente no Portal
                    </label>
                </form>
            </AdminModal>

            {/* Modal Inscrição */}
            <AdminModal
                open={modalInscricao}
                onClose={() => setModalInscricao(false)}
                title={editFilaId ? "Editar Inscrição na Fila" : "Registrar Inscrição na Fila de Creches"}
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setModalInscricao(false)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-creche-inscricao"
                            disabled={salvando}
                            className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-sm font-bold hover:bg-blue-800 disabled:opacity-50 cursor-pointer"
                        >
                            {salvando ? "Salvando..." : editFilaId ? "Atualizar Inscrição" : "Salvar Inscrição"}
                        </button>
                    </>
                }
            >
                <form id="form-creche-inscricao" onSubmit={handleSalvarInscricao} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Protocolo LGPD (opcional)
                            </label>
                            <input
                                type="text"
                                placeholder="Automático se vazio"
                                value={insProtocolo}
                                onChange={(e) => setInsProtocolo(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm font-mono"
                                disabled={Boolean(editFilaId)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Iniciais da Criança</label>
                            <input
                                type="text"
                                placeholder="Ex: A. S. M."
                                value={insIniciais}
                                onChange={(e) => setInsIniciais(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mês/Ano Nasc.</label>
                            <input
                                type="text"
                                placeholder="Ex: 05/2023"
                                value={insNascimento}
                                onChange={(e) => setInsNascimento(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Unidade Escolar Pretendida
                        </label>
                        <input
                            type="text"
                            list="unidades-escolares-lista"
                            placeholder="Ex: Creche Municipal Pequeno Aprendiz"
                            value={insUnidade}
                            onChange={(e) => setInsUnidade(e.target.value)}
                            className="w-full border rounded-xl p-2.5 text-sm"
                            required
                        />
                        <datalist id="unidades-escolares-lista">
                            {unidadesEscolares.map((u) => (
                                <option key={u.id} value={u.nome} />
                            ))}
                        </datalist>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Etapa / Turma</label>
                            <select
                                value={insTurma}
                                onChange={(e) => setInsTurma(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                            >
                                <option value="Berçário I (0 a 1 ano)">Berçário I (0 a 1 ano)</option>
                                <option value="Berçário II (1 a 2 anos)">Berçário II (1 a 2 anos)</option>
                                <option value="Maternal I (2 a 3 anos)">Maternal I (2 a 3 anos)</option>
                                <option value="Maternal II (3 a 4 anos)">Maternal II (3 a 4 anos)</option>
                                <option value="Pré-Escola I (4 anos)">Pré-Escola I (4 anos)</option>
                                <option value="Pré-Escola II (5 anos)">Pré-Escola II (5 anos)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Critério Prioridade
                            </label>
                            <select
                                value={insCriterio}
                                onChange={(e) => setInsCriterio(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                            >
                                {criterios.map((c) => (
                                    <option key={c.ordem} value={c.titulo}>
                                        {c.ordem}º - {c.titulo}
                                    </option>
                                ))}
                                <option value="Proximidade da Residência">Proximidade da Residência</option>
                                <option value="Vulnerabilidade / CadÚnico">Vulnerabilidade / CadÚnico</option>
                                <option value="Criança com Deficiência / TEA">Criança com Deficiência / TEA</option>
                                <option value="Medida Judicial / Conselho">Medida Judicial / Conselho</option>
                                <option value="Irmão na Mesma Escola">Irmão na Mesma Escola</option>
                                <option value="Mãe Trabalhadora">Mãe Trabalhadora</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Posição</label>
                            <input
                                type="number"
                                value={insPosicao}
                                onChange={(e) => setInsPosicao(parseInt(e.target.value, 10) || 1)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                                min={1}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                            <select
                                value={insStatus}
                                onChange={(e) => setInsStatus(e.target.value)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                            >
                                <option value="aguardando">Aguardando</option>
                                <option value="convocado">Convocado</option>
                                <option value="matriculado">Matriculado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ano</label>
                            <input
                                type="number"
                                value={insAno}
                                onChange={(e) => setInsAno(parseInt(e.target.value, 10) || 2026)}
                                className="w-full border rounded-xl p-2.5 text-sm"
                            />
                        </div>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}
