"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash2, FiFileText } from "react-icons/fi";

type Legislacao = {
    id: string;
    tipo: string;
    numero: string;
    ano: number;
    ementa: string;
    arquivo: string | null;
    ativo: boolean;
    criadoEm: string;
};

export default function LegislacaoAdminPage() {
    const [legislacoes, setLegislacoes] = useState<Legislacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipoFilter, setTipoFilter] = useState("");
    const [anoFilter, setAnoFilter] = useState("");

    useEffect(() => {
        fetchLegislacoes();
    }, [tipoFilter, anoFilter]);

    const fetchLegislacoes = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (tipoFilter) query.append("tipo", tipoFilter);
            if (anoFilter) query.append("ano", anoFilter);

            const res = await fetch(`/api/admin/legislacao?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLegislacoes(data.items);
            }
        } catch (error) {
            console.error("Erro ao buscar legislação:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta legislação? Essa ação não pode ser desfeita.")) return;

        try {
            const res = await fetch(`/api/admin/legislacao/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchLegislacoes();
            } else {
                alert("Erro ao excluir legislação.");
            }
        } catch (error) {
            console.error("Erro ao excluir legislação:", error);
            alert("Erro ao excluir legislação.");
        }
    };

    const formatTipo = (tipo: string) => {
        const map: Record<string, string> = {
            lei: "Lei",
            decreto: "Decreto",
            portaria: "Portaria",
            resolucao: "Resolução",
            "lei-organica": "Lei Orgânica",
        };
        return map[tipo] || tipo;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Legislação Municipal</h1>
                <Link
                    href="/admin/legislacao/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <FiPlus />
                    Nova Legislação
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                        value={tipoFilter}
                        onChange={(e) => setTipoFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Todos os tipos</option>
                        <option value="lei">Lei</option>
                        <option value="decreto">Decreto</option>
                        <option value="portaria">Portaria</option>
                        <option value="resolucao">Resolução</option>
                        <option value="lei-organica">Lei Orgânica</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                    <input
                        type="number"
                        placeholder="Ex: 2024"
                        value={anoFilter}
                        onChange={(e) => setAnoFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : legislacoes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                    Nenhuma legislação encontrada. Clique em "Nova Legislação" para adicionar.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Norma</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ementa</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {legislacoes.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FiFileText className="text-gray-400 mr-2" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{formatTipo(item.tipo)} nº {item.numero}</div>
                                                <div className="text-sm text-gray-500">Ano: {item.ano}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2">{item.ementa}</div>
                                        {item.arquivo && (
                                            <a href={item.arquivo} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                                                Ver PDF
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/legislacao/editar/${item.id}`} className="text-blue-600 hover:text-blue-900" title="Editar">
                                                <FiEdit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
