"use client";

import { useState, useMemo } from "react";
import { FaSearch, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { COMPONENTES_SUS } from "@/lib/assistencia-farmaceutica";

export type SaudeMedicamentoItem = {
    id: string;
    nome: string;
    principioAtivo?: string | null;
    apresentacao?: string | null;
    categoria: string;
    tipoComponente?: string | null;
    unidadeSaude?: string | null;
    status: string;
    observacao?: string | null;
};

export default function SaudeMedicamentosTable({ medicamentos }: { medicamentos: SaudeMedicamentoItem[] }) {
    const [busca, setBusca] = useState("");
    const [componente, setComponente] = useState("todos");

    const filtrados = useMemo(() => {
        const term = busca.toLowerCase().trim();
        return medicamentos.filter((item) => {
            const compItem = item.tipoComponente || "Básico (CBAF)";
            const matchComp = componente === "todos" || compItem === componente;
            const matchBusca =
                !term ||
                item.nome.toLowerCase().includes(term) ||
                (item.principioAtivo && item.principioAtivo.toLowerCase().includes(term)) ||
                item.categoria.toLowerCase().includes(term) ||
                (item.unidadeSaude && item.unidadeSaude.toLowerCase().includes(term)) ||
                (item.observacao && item.observacao.toLowerCase().includes(term));
            return matchComp && matchBusca;
        });
    }, [medicamentos, busca, componente]);

    return (
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white">
            <div className="p-8 md:p-10 border-b border-gray-100 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
                            Lista de Medicamentos (REMUME & Alto Custo)
                        </h3>
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
                            placeholder="Buscar medicamento, princípio ativo..."
                            className="pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setComponente("todos")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            componente === "todos"
                                ? "bg-[#003366] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Todos os Componentes
                    </button>
                    {COMPONENTES_SUS.map((comp) => (
                        <button
                            key={comp}
                            type="button"
                            onClick={() => setComponente(comp)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                componente === comp
                                    ? comp === "Especializado (CEAF)"
                                        ? "bg-indigo-700 text-white"
                                        : "bg-[#003366] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {comp === "Especializado (CEAF)" ? "Alto Custo (CEAF)" : comp}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Medicamento / Princípio Ativo
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Categoria / Componente
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Disponibilidade
                            </th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                                Observações / Local
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtrados.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-14 text-center text-sm font-bold text-gray-400">
                                    Nenhum medicamento encontrado para o filtro informado.
                                </td>
                            </tr>
                        ) : (
                            filtrados.map((item) => {
                                const comp = item.tipoComponente || "Básico (CBAF)";
                                const isCeaf = comp === "Especializado (CEAF)";
                                return (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-white group-hover:shadow-md transition-all shrink-0">
                                                    💊
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                                                        {item.nome}
                                                    </div>
                                                    {(item.principioAtivo || item.apresentacao) && (
                                                        <div className="text-[11px] font-semibold text-gray-500 mt-0.5">
                                                            {[item.principioAtivo, item.apresentacao]
                                                                .filter(Boolean)
                                                                .join(" • ")}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 space-y-1.5">
                                            <div className="inline-block text-[10px] font-black text-gray-600 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                                                {item.categoria}
                                            </div>
                                            <div>
                                                <span
                                                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                                        isCeaf
                                                            ? "bg-indigo-100 text-indigo-800"
                                                            : "bg-blue-50 text-[#003366]"
                                                    }`}
                                                >
                                                    {isCeaf ? "Alto Custo (CEAF)" : comp}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {item.status === "disponivel" ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                    <FaCheckCircle />{" "}
                                                    {isCeaf ? "Disponível (via LME)" : "Disponível"}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest">
                                                    <FaExclamationTriangle /> Em Falta
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right max-w-xs">
                                            {item.unidadeSaude && (
                                                <div className="text-[10px] font-black text-gray-700 uppercase">
                                                    {item.unidadeSaude}
                                                </div>
                                            )}
                                            <p className="text-xs font-medium text-gray-500 tracking-tight italic mt-0.5">
                                                {item.observacao || "Sem observações"}
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
