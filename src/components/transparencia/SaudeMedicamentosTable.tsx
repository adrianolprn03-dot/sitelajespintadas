"use client";

import { useState, useMemo } from "react";
import { FaSearch, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export type SaudeMedicamentoItem = {
    id: string;
    nome: string;
    categoria: string;
    status: string;
    observacao?: string | null;
};

export default function SaudeMedicamentosTable({ medicamentos }: { medicamentos: SaudeMedicamentoItem[] }) {
    const [busca, setBusca] = useState("");

    const filtrados = useMemo(() => {
        const term = busca.toLowerCase().trim();
        if (!term) return medicamentos;
        return medicamentos.filter(
            (item) =>
                item.nome.toLowerCase().includes(term) ||
                item.categoria.toLowerCase().includes(term) ||
                (item.observacao && item.observacao.toLowerCase().includes(term))
        );
    }, [medicamentos, busca]);

    return (
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white">
            <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Lista de Medicamentos (REMUME)</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">
                        Total de {filtrados.length} itens encontrados
                    </p>
                </div>
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar medicamento..."
                        className="pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Medicamento</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Categoria</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Disponibilidade</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Observações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-10 py-14 text-center text-sm font-bold text-gray-400">
                                    Nenhum medicamento encontrado para o filtro informado.
                                </td>
                            </tr>
                        ) : (
                            filtrados.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-white group-hover:shadow-md transition-all">💊</div>
                                            <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">{item.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{item.categoria}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        {item.status === "disponivel" ? (
                                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                <FaCheckCircle /> Disponível
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest">
                                                <FaExclamationTriangle /> Em Falta
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <p className="text-xs font-bold text-gray-500 tracking-tight italic">{item.observacao || "Sem observações"}</p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
