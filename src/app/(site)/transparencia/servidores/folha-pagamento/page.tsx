"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSpinner, FaMoneyCheckAlt } from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";

type Servidor = {
    id: string;
    nome: string;
    cargo: string;
    vinculo: string;
    secretaria: string;
    salarioBase: number;
    totalBruto: number;
    totalLiquido: number;
    mes: number;
    ano: number;
};

const vinculoCores: Record<string, string> = {
    efetivo: "bg-green-100 text-green-700",
    comissionado: "bg-blue-100 text-blue-700",
    contratado: "bg-orange-100 text-orange-700",
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServidoresPage() {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState("2024");
    const [mes, setMes] = useState("3");
    const [busca, setBusca] = useState("");

    useEffect(() => {
        fetchServidores();
    }, [ano, mes]);

    const fetchServidores = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/servidores?ano=${ano}&mes=${mes}`);
            const data = await res.json();
            setServidores(data.items || []);
        } catch (error) {
            console.error("Erro ao carregar servidores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setBusca("");
        setAno("2024");
        setMes("3");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = filtrados.map((s: Servidor) => ({
            "Nome": s.nome,
            "Cargo": s.cargo,
            "Vínculo": s.vinculo,
            "Secretaria": s.secretaria,
            "Total Bruto": fmt(s.totalBruto),
            "Total Líquido": fmt(s.totalLiquido)
        }));

        const filename = `folha_pagamento_${mes}_${ano}`;
        const title = `Relatório de Servidores e Folha de Pagamento - Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const filtrados = servidores.filter((s: Servidor) => {
        const b = busca.toLowerCase();
        return !busca || 
            s.nome.toLowerCase().includes(b) || 
            s.cargo.toLowerCase().includes(b) || 
            s.secretaria.toLowerCase().includes(b);
    });

    const totalBruto = filtrados.reduce((acc: number, curr: Servidor) => acc + curr.totalBruto, 0);
    const totalLiquido = filtrados.reduce((acc: number, curr: Servidor) => acc + curr.totalLiquido, 0);

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-900 py-16 px-4 shadow-xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-200 mb-6 flex items-center gap-2">
                            <Link href="/transparencia" className="hover:text-white transition-colors">Transparência</Link>
                            <span className="opacity-50">/</span>
                            <Link href="/transparencia/servidores" className="hover:text-white transition-colors">Quadro de Pessoal</Link>
                            <span className="opacity-50">/</span>
                            <span className="text-white">Folha de Pagamento</span>
                        </nav>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-4">
                            <div className="w-12 h-1 bg-white rounded-full"></div>
                            Folha de Pagamento
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-teal-100/80 text-sm font-medium">
                            <span>Lei Complementar 131/2009</span>
                            <span className="opacity-30">•</span>
                            <span>Transparência Ativa</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
                {/* Filtros Padronizados PNTP 2024 */}
                <div id="filtros-servidores">
                    <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Pesquisar por nome, cargo ou secretaria..."
                />
                </div>

                {/* Cards de totais */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-teal-500">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Total de Servidores</div>
                        <div className="text-2xl font-bold text-teal-600">{loading ? "..." : filtrados.length}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Folha (Bruto)</div>
                        <div className="text-2xl font-bold text-green-600">{loading ? "..." : fmt(totalBruto)}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Mês de Referência</div>
                        <div className="text-2xl font-bold text-blue-600">{mes}/{ano}</div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">{filtrados.length} servidores</span>
                        <span className="text-xs text-gray-400">Dados de {mes}/{ano}</span>
                    </div>
                    <div className="overflow-x-auto min-h-[200px] relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                <FaSpinner className="animate-spin text-teal-500 text-3xl" />
                            </div>
                        )}
                        <table className="w-full" aria-label="Tabela de servidores públicos">
                            <thead>
                                <tr>
                                    <th className="table-header">Nome</th>
                                    <th className="table-header">Cargo</th>
                                    <th className="table-header">Vínculo</th>
                                    <th className="table-header">Secretaria</th>
                                    <th className="table-header text-right">Sal. Base</th>
                                    <th className="table-header text-right">Total Bruto</th>
                                    <th className="table-header text-right">Total Líquido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-500">
                                            Nenhum servidor encontrado para este período.
                                        </td>
                                    </tr>
                                ) : (
                                    filtrados.map((s: Servidor) => (
                                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="table-cell font-medium">{s.nome}</td>
                                            <td className="table-cell text-sm">{s.cargo}</td>
                                            <td className="table-cell">
                                                <span className={`badge text-xs capitalize ${vinculoCores[s.vinculo.toLowerCase()] || "bg-gray-100"}`}>
                                                    {s.vinculo}
                                                </span>
                                            </td>
                                            <td className="table-cell text-sm">{s.secretaria}</td>
                                            <td className="table-cell text-right text-sm">{fmt(s.salarioBase)}</td>
                                            <td className="table-cell text-right font-semibold text-gray-800">{fmt(s.totalBruto)}</td>
                                            <td className="table-cell text-right text-green-600 font-semibold">{fmt(s.totalLiquido)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {!loading && servidores.length > 0 && (
                                <tfoot>
                                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                                        <td colSpan={5} className="px-4 py-3 text-sm font-bold text-gray-700">Total Geral</td>
                                        <td className="px-4 py-3 text-right font-bold text-teal-700 text-lg">{fmt(totalBruto)}</td>
                                        <td className="px-4 py-3 text-right font-bold text-green-600">
                                            {fmt(totalLiquido)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
