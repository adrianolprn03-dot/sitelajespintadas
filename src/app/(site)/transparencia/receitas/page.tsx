"use client";
import { useState, useEffect } from "react";
import { FaDownload, FaFilter, FaSearch, FaChartBar, FaSpinner } from "react-icons/fa";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";

type Receita = {
    id: string; descricao: string; categoria: string; valor: number; mes: number; ano: number;
};

const mesesLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const categoriaLabel: Record<string, string> = {
    impostos: "Impostos",
    transferencias: "Transferências",
    "receitas-proprias": "Receitas Próprias",
    outras: "Outras",
};

export default function ReceitasPage() {
    const [dados, setDados] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
    const [anoFiltro, setAnoFiltro] = useState("2024");
    const [mesFiltro, setMesFiltro] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [busca, setBusca] = useState("");
    const [aba, setAba] = useState<"tabela" | "grafico">("tabela");

    useEffect(() => {
        const fetchReceitas = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (anoFiltro) query.append("ano", anoFiltro);
                if (mesFiltro) query.append("mes", mesFiltro);

                const res = await fetch(`/api/receitas?${query.toString()}`);
                const data = await res.json();
                setDados(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar receitas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReceitas();
    }, [anoFiltro, mesFiltro]);

    const handleClearFilters = () => {
        setBusca("");
        setAnoFiltro("2024");
        setMesFiltro("");
        setCategoriaFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = filtrados.map(r => ({
            "Descrição": r.descricao,
            "Categoria": categoriaLabel[r.categoria] || r.categoria,
            "Mês/Ano": `${mesesLabels[r.mes - 1]}/${r.ano}`,
            "Valor": formatarMoeda(r.valor)
        }));

        const filename = `receitas_municipais_${mesFiltro || "anual"}_${anoFiltro}`;
        const title = `Relatório de Receitas Públicas - Lajes Pintadas/RN (${mesFiltro ? mesesLabels[Number(mesFiltro)-1] : "Ano"} / ${anoFiltro})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const filtrados = dados.filter((r) => {
        const catOk = !categoriaFiltro || r.categoria === categoriaFiltro;
        const b = busca.toLowerCase();
        const buscaOk = !busca || 
            r.descricao.toLowerCase().includes(b) || 
            (categoriaLabel[r.categoria]?.toLowerCase().includes(b));
        return catOk && buscaOk;
    });

    const totalFiltrado = filtrados.reduce((s, r) => s + r.valor, 0);

    // Dados para gráfico mensal
    const dadosGrafico = Array.from({ length: 12 }, (_, i) => ({
        mes: mesesLabels[i],
        valor: dados.filter((r) => r.mes === i + 1 && r.ano === parseInt(anoFiltro)).reduce((s, r) => s + r.valor, 0),
    })).filter((d) => d.valor > 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 py-12 px-4 font-['Montserrat',sans-serif]">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-6 flex items-center gap-2">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <span className="opacity-50">/</span>
                        <span className="text-white">Receitas Públicas</span>
                    </nav>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Receitas Públicas</h1>
                    <p className="text-emerald-100/80 max-w-2xl font-medium leading-relaxed">
                        Acesso simplificado à arrecadação pública do município de Lajes Pintadas em conformidade com o Programa Nacional de Transparência Pública (PNTP).
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
                {/* Filtros PNTP 2024 */}
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={anoFiltro}
                    onYearChange={setAnoFiltro}
                    currentMonth={mesFiltro}
                    onMonthChange={setMesFiltro}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Pesquisar por descrição ou categoria..."
                />

                {/* Filtro Adicional de Categoria (Específico de Receitas) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 border-r border-gray-100">Filtrar Categoria</span>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => setCategoriaFiltro("")}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!categoriaFiltro ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Todas
                        </button>
                        {Object.entries(categoriaLabel).map(([v, l]) => (
                            <button 
                                key={v}
                                onClick={() => setCategoriaFiltro(v)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${categoriaFiltro === v ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards de totais */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Total Arrecadado</div>
                        <div className="text-3xl font-black text-emerald-600">{formatarMoeda(totalFiltrado)}</div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Registros Encontrados</div>
                        <div className="text-3xl font-black text-blue-600">{filtrados.length}</div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Exercício Fiscal</div>
                        <div className="text-3xl font-black text-gray-800">{anoFiltro}</div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                            <button onClick={() => setAba("tabela")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${aba === "tabela" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}>
                                Tabela Geral
                            </button>
                            <button onClick={() => setAba("grafico")} className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${aba === "grafico" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}>
                                <FaChartBar /> Análise Gráfica
                            </button>
                        </div>
                    </div>

                    {aba === "tabela" ? (
                        <div className="overflow-x-auto">
                            <table className="w-full" aria-label="Tabela de receitas públicas">
                                <thead>
                                    <tr>
                                        <th className="table-header">Descrição</th>
                                        <th className="table-header">Categoria</th>
                                        <th className="table-header">Mês/Ano</th>
                                        <th className="table-header text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12">
                                                <FaSpinner className="animate-spin inline-block text-emerald-600 text-2xl" />
                                            </td>
                                        </tr>
                                    ) : filtrados.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-12 text-gray-400">Nenhum registro encontrado</td></tr>
                                    ) : filtrados.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="table-cell font-medium">{r.descricao}</td>
                                            <td className="table-cell">
                                                <span className="badge bg-emerald-100 text-emerald-700">
                                                    {categoriaLabel[r.categoria] || r.categoria}
                                                </span>
                                            </td>
                                            <td className="table-cell">{mesesLabels[r.mes - 1]}/{r.ano}</td>
                                            <td className="table-cell text-right font-semibold text-emerald-700">
                                                {formatarMoeda(r.valor)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                                        <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-700">Total</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-700 text-lg">
                                            {formatarMoeda(totalFiltrado)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Receitas por Mês – {anoFiltro}</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dadosGrafico}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                                    <Bar dataKey="valor" name="Receita" fill="#27ae60" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
