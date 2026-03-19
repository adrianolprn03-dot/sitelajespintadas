"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaHospital, FaHandsHelping, FaGraduationCap, FaPalette } from "react-icons/fa";

type UnidadeAtendimento = {
    id: string;
    nome: string;
    tipo: string;
    descricao: string;
    endereco: string;
    telefone: string | null;
    horario: string;
    mapa: string | null;
    ativa: boolean;
};

const getTipoIcon = (tipo: string) => {
    switch (tipo) {
        case "saude": return <FaHospital className="text-red-500" />;
        case "social": return <FaHandsHelping className="text-orange-500" />;
        case "educacao": return <FaGraduationCap className="text-blue-500" />;
        case "cultura": return <FaPalette className="text-purple-500" />;
        default: return <FaHospital className="text-gray-500" />;
    }
};

const getTipoLabel = (tipo: string) => {
    switch (tipo) {
        case "saude": return "Saúde";
        case "social": return "Social";
        case "educacao": return "Educação";
        case "cultura": return "Cultura";
        default: return tipo;
    }
};

export default function ListarUnidadesAtendimento() {
    const [unidades, setUnidades] = useState<UnidadeAtendimento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUnidades = async () => {
        try {
            const res = await fetch("/api/unidades");
            if (!res.ok) throw new Error("Erro ao buscar unidades");
            const data = await res.json();
            setUnidades(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnidades();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta unidade?")) return;
        try {
            const res = await fetch(`/api/unidades/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao excluir");
            fetchUnidades();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Unidades de Atendimento (PNTP)</h1>
                <Link
                    href="/admin/unidades/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Nova Unidade
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Carregando unidades...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Endereço</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {unidades.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            Nenhuma unidade cadastrada.
                                        </td>
                                    </tr>
                                ) : (
                                    unidades.map((unidade) => (
                                        <tr key={unidade.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getTipoIcon(unidade.tipo)}
                                                    <span className="font-medium text-sm text-gray-700">{getTipoLabel(unidade.tipo)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{unidade.nome}</div>
                                                <div className="text-xs text-gray-500 max-w-xs truncate">{unidade.descricao}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                {unidade.endereco}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Link
                                                    href={`/admin/unidades/editar/${unidade.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(unidade.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
