"use client";
import { useState, useEffect } from "react";
import { FaDownload, FaFilter, FaSearch, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";

type Licitacao = {
    id: string; numero: string; objeto: string; modalidade: string;
    valor: number | null; status: string; secretaria: string; ano: number; dataAbertura?: string;
};



const modalidadeLabel: Record<string, string> = {
    pregao: "Pregão Eletrônico", concorrencia: "Concorrência", "tomada-precos": "Tomada de Preços",
    convite: "Convite", dispensa: "Dispensa de Licitação", inexigibilidade: "Inexigibilidade",
};
const statusConfig: Record<string, { label: string; cor: string }> = {
    aberta: { label: "Aberta", cor: "bg-green-100 text-green-700" },
    "em-andamento": { label: "Em Andamento", cor: "bg-blue-100 text-blue-700" },
    concluida: { label: "Concluída", cor: "bg-gray-100 text-gray-700" },
    cancelada: { label: "Cancelada", cor: "bg-red-100 text-red-700" },
    deserta: { label: "Deserta", cor: "bg-yellow-100 text-yellow-700" },
};

function formatarMoeda(valor: number | null) {
    if (!valor) return "A definir";
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function baixarCSV(dados: Licitacao[]) {
    const header = "Número,Modalidade,Objeto,Secretaria,Valor,Status,Ano\n";
    const rows = dados.map((l) =>
        `"${l.numero}","${modalidadeLabel[l.modalidade] || l.modalidade}","${l.objeto}","${l.secretaria}","${l.valor || ""}","${l.status}","${l.ano}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "licitacoes.csv"; a.click();
    URL.revokeObjectURL(url);
}

import PageHeader from "@/components/PageHeader";

export default function LicitacoesClient() {
    const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    const [modalidadeFiltro, setModalidadeFiltro] = useState("");
    const [anoFiltro, setAnoFiltro] = useState("");

    useEffect(() => {
        const fetchLicitacoes = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (statusFiltro) query.append("status", statusFiltro);
                if (modalidadeFiltro) query.append("modalidade", modalidadeFiltro);
                if (anoFiltro) query.append("ano", anoFiltro);

                const res = await fetch(`/api/licitacoes?${query.toString()}`);
                const data = await res.json();
                setLicitacoes(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar licitações:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLicitacoes();
    }, [statusFiltro, modalidadeFiltro, anoFiltro]);

    const filtrados = licitacoes.filter((l) => {
        const buscaOk = !busca || l.objeto.toLowerCase().includes(busca.toLowerCase()) || l.numero.includes(busca);
        return buscaOk;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader 
                title="Licitações e Processos"
                subtitle="Editais, processos licitatórios e resultados de julgamento • Lei 14.133/2021"
                breadcrumbs={[
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Licitações" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow p-5 mb-6">
                    <div className="flex items-center gap-2 mb-4 font-semibold text-gray-700">
                        <FaFilter className="text-purple-600" /> Filtros
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Buscar</label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Número ou objeto..." className="input-field pl-8 text-sm py-2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Ano</label>
                            <select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)} className="input-field text-sm py-2">
                                <option value="">Todos</option>
                                {["2024", "2023", "2022"].map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Modalidade</label>
                            <select value={modalidadeFiltro} onChange={(e) => setModalidadeFiltro(e.target.value)} className="input-field text-sm py-2">
                                <option value="">Todas</option>
                                {Object.entries(modalidadeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                            <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="input-field text-sm py-2">
                                <option value="">Todos</option>
                                {Object.entries(statusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <span className="text-sm text-gray-500">{filtrados.length} registro(s) encontrado(s)</span>
                        <button onClick={() => baixarCSV(filtrados)} className="flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                            <FaDownload /> CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full" aria-label="Tabela de licitações">
                            <thead>
                                <tr>
                                    <th className="table-header">Número</th>
                                    <th className="table-header">Objeto</th>
                                    <th className="table-header">Modalidade</th>
                                    <th className="table-header">Secretaria</th>
                                    <th className="table-header">Valor Est.</th>
                                    <th className="table-header">Status</th>
                                    <th className="table-header">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">Nenhuma licitação encontrada</td></tr>
                                ) : filtrados.map((l) => (
                                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="table-cell font-bold text-purple-700">{l.numero}</td>
                                        <td className="table-cell max-w-xs">
                                            <span className="line-clamp-2 text-sm" title={l.objeto}>{l.objeto}</span>
                                        </td>
                                        <td className="table-cell text-xs">{modalidadeLabel[l.modalidade]}</td>
                                        <td className="table-cell text-xs">{l.secretaria}</td>
                                        <td className="table-cell font-semibold text-gray-700">{formatarMoeda(l.valor)}</td>
                                        <td className="table-cell">
                                            <span className={`badge text-xs ${statusConfig[l.status]?.cor || "bg-gray-100"}`}>
                                                {statusConfig[l.status]?.label || l.status}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <button className="text-purple-600 hover:text-purple-800 text-xs flex items-center gap-1 font-medium">
                                                <FaExternalLinkAlt className="text-xs" /> Ver edital
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
