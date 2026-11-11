"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FaHistory, FaClipboardCheck, FaPlus } from "react-icons/fa";

interface HistoricoItem {
    id: string;
    entidade: string;
    entidadeId: string;
    tituloRegistro?: string | null;
    criterioPntp?: string | null;
    secretaria?: string | null;
    acao: string;
    situacaoAnterior?: string | null;
    situacaoNova?: string | null;
    conferenciaSemAlteracao: boolean;
    observacao?: string | null;
    usuarioNome: string;
    usuarioPerfil?: string | null;
    criadoEm: string;
}

export default function AdminHistoricoPage() {
    const [items, setItems] = useState<HistoricoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [acao, setAcao] = useState("Todas");
    const [apenasConferencia, setApenasConferencia] = useState(false);

    const [novaConferencia, setNovaConferencia] = useState({
        entidade: "Quadro Geral de Pessoal / Folha",
        criterioPntp: "6.1",
        secretaria: "Secretaria de Administração",
        tituloRegistro: "Conferência Periódica de Atualidade Sem Alteração de Conteúdo",
        observacao: "",
    });

    const carregar = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (acao !== "Todas") params.set("acao", acao);
            if (apenasConferencia) params.set("apenasConferencia", "true");

            const res = await fetch(`/api/admin/historico?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } catch {
            toast.error("Erro ao carregar histórico.");
        } finally {
            setLoading(false);
        }
    }, [acao, apenasConferencia]);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const handleRegistrarConferencia = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/historico", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaConferencia),
            });
            if (res.ok) {
                toast.success("Conferência setorial sem alteração registrada no histórico!");
                setNovaConferencia({ ...novaConferencia, observacao: "" });
                carregar();
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao registrar conferência.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaHistory className="text-primary-600" /> Histórico de Alterações, Versões e Conferências
                </h1>
                <p className="text-gray-500 text-sm">
                    Trilha de auditoria completa de cadastros, aprovações, importações e conferências periódicas sem alteração de conteúdo.
                </p>
            </div>

            {/* Registrar Conferência Setorial Sem Alteração */}
            <form
                onSubmit={handleRegistrarConferencia}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
            >
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <FaClipboardCheck className="text-emerald-600" /> Registrar Nova Conferência Setorial (Sem Alteração de Conteúdo)
                </h2>
                <p className="text-xs text-gray-500">
                    Conforme diretriz PNTP 2026 (Seção 3), quando o setor confere os dados vigentes e atesta que não houve modificação no período, a data de conferência é registrada separadamente da data de atualização do conteúdo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Módulo / Assunto</label>
                        <input
                            type="text"
                            required
                            value={novaConferencia.entidade}
                            onChange={(e) => setNovaConferencia({ ...novaConferencia, entidade: e.target.value })}
                            className="input-field text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Critério PNTP</label>
                        <input
                            type="text"
                            value={novaConferencia.criterioPntp}
                            onChange={(e) => setNovaConferencia({ ...novaConferencia, criterioPntp: e.target.value })}
                            className="input-field text-xs"
                            placeholder="Ex: 2.1"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Secretaria / Setor</label>
                        <input
                            type="text"
                            value={novaConferencia.secretaria}
                            onChange={(e) => setNovaConferencia({ ...novaConferencia, secretaria: e.target.value })}
                            className="input-field text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Observação da Conferência</label>
                        <input
                            type="text"
                            value={novaConferencia.observacao}
                            onChange={(e) => setNovaConferencia({ ...novaConferencia, observacao: e.target.value })}
                            className="input-field text-xs"
                            placeholder="Ex: Dados conferidos junto ao setor de RH"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn-primary text-xs flex items-center gap-2">
                        <FaPlus /> Registrar Conferência Setorial
                    </button>
                </div>
            </form>

            {/* Filtros */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div>
                    <label htmlFor="filtro-acao" className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                        Tipo de Ação
                    </label>
                    <select
                        id="filtro-acao"
                        value={acao}
                        onChange={(e) => setAcao(e.target.value)}
                        className="input-field text-xs"
                    >
                        <option value="Todas">Todas as Ações</option>
                        <option value="criar">Criação de Registro</option>
                        <option value="editar">Edição / Atualização</option>
                        <option value="conferir">Conferência Sem Alteração</option>
                        <option value="importar">Importação em Lote</option>
                        <option value="declarar_nao_ocorrencia">Declaração de Não Ocorrência</option>
                    </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mt-4 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={apenasConferencia}
                        onChange={(e) => setApenasConferencia(e.target.checked)}
                        className="rounded text-primary-600"
                    />
                    Exibir apenas conferências sem alteração de conteúdo
                </label>
            </div>

            {/* Listagem */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b">
                            <tr>
                                <th className="px-4 py-3">Data / Hora</th>
                                <th className="px-4 py-3">Ação</th>
                                <th className="px-4 py-3">Entidade / Módulo</th>
                                <th className="px-4 py-3">Registro / Detalhes</th>
                                <th className="px-4 py-3">Critério PNTP</th>
                                <th className="px-4 py-3">Responsável</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                        Carregando trilha de auditoria...
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                                        Nenhum registro de histórico encontrado.
                                    </td>
                                </tr>
                            ) : (
                                items.map((h) => (
                                    <tr key={h.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                                            {new Date(h.criadoEm).toLocaleString("pt-BR")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    h.conferenciaSemAlteracao
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : h.acao === "criar"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : h.acao === "importar"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {h.conferenciaSemAlteracao ? "Conferência s/ Alteração" : h.acao}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-gray-800">
                                            {h.entidade}
                                            {h.secretaria && (
                                                <span className="block text-[10px] font-normal text-gray-400">
                                                    {h.secretaria}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-md">
                                            <div className="font-semibold text-gray-800">{h.tituloRegistro || h.entidadeId}</div>
                                            {h.observacao && <div className="text-[11px] text-gray-500 mt-0.5">{h.observacao}</div>}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-gray-600">{h.criterioPntp || "-"}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            <div className="font-semibold">{h.usuarioNome}</div>
                                            <div className="text-[10px] text-gray-400 uppercase">{h.usuarioPerfil || "admin"}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

