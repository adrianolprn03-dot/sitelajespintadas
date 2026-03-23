"use client";
import { useState, useEffect } from "react";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";
import { FaPlane, FaSearch, FaSpinner, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaFileAlt, FaDownload } from "react-icons/fa";

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    motivo: string;
    dataInicio: string;
    dataFim: string;
    valor: number;
    quantidadeDias: number;
    secretaria: string;
};

export default function DiariasPage() {
    const [items, setItems] = useState<Diaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [search, setSearch] = useState("");
    const [totalValor, setTotalValor] = useState(0);

    const anos = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
    const meses = [
        { v: "1", l: "Janeiro" }, { v: "2", l: "Fevereiro" }, { v: "3", l: "Março" },
        { v: "4", l: "Abril" }, { v: "5", l: "Maio" }, { v: "6", l: "Junho" },
        { v: "7", l: "Julho" }, { v: "8", l: "Agosto" }, { v: "9", l: "Setembro" },
        { v: "10", l: "Outubro" }, { v: "11", l: "Novembro" }, { v: "12", l: "Dezembro" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (ano) query.append("ano", ano);
                if (mes) query.append("mes", mes);
                if (search) query.append("servidor", search);

                const res = await fetch(`/api/diarias?${query.toString()}`);
                const data = await res.json();
                setItems(data.items || []);
                setTotalValor(data.totalValor || 0);
            } catch (error) {
                console.error("Erro ao buscar diárias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ano, mes, search]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-cyan-700 py-12 px-4 shadow-lg border-b border-sky-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <nav className="text-sm text-sky-100 mb-4 flex items-center gap-2">
                            <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                            <span>›</span>
                            <span className="text-white font-medium">Diárias</span>
                        </nav>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <FaPlane className="text-sky-200" /> Diárias de Viagem
                        </h1>
                        <p className="text-sky-100 max-w-2xl">
                            Consulte as diárias concedidas aos servidores e agentes políticos para viagens a serviço do interesse do município.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button onClick={() => exportToCSV(items, `diarias_${ano}`)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl backdrop-blur-md transition-all border border-white/10">
                                <FaDownload /> CSV
                            </button>
                            <button onClick={() => exportToJSON(items, `diarias_${ano}`)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl backdrop-blur-md transition-all border border-white/10">
                                <FaDownload /> JSON
                            </button>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-5 border border-white border-opacity-20">
                            <p className="text-sky-100 text-[10px] font-black uppercase tracking-widest mb-1">Total Concedido</p>
                            <p className="text-3xl font-black text-white">{formatCurrency(totalValor)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Servidor</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nome do servidor..."
                                className="input-field pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Ano</label>
                        <select
                            className="input-field"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                        >
                            {anos.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Mês</label>
                        <select
                            className="input-field"
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                        >
                            <option value="">Todos os meses</option>
                            {meses.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                        </select>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2 h-[42px] bg-sky-600 hover:bg-sky-700 border-none">
                        <FaSearch size={14} /> Atualizar Lista
                    </button>
                </div>

                {/* Tabela de Diárias */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Servidor / Cargo</th>
                                    <th className="px-6 py-4">Destino / Motivo</th>
                                    <th className="px-6 py-4">Período</th>
                                    <th className="px-6 py-4 text-right">Dias</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <FaSpinner className="animate-spin inline-block text-sky-500 text-2xl" />
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">
                                            Nenhuma diária encontrada para os critérios selecionados.
                                        </td>
                                    </tr>
                                ) : items.map((d) => (
                                    <tr key={d.id} className="hover:bg-sky-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{d.servidor}</div>
                                            <div className="text-xs text-gray-500">{d.cargo}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex items-center gap-1 text-sky-600 font-bold text-xs mb-1">
                                                <FaMapMarkerAlt /> {d.destino}
                                            </div>
                                            <div className="text-xs text-gray-600 line-clamp-2" title={d.motivo}>
                                                {d.motivo}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            <div>De: {new Date(d.dataInicio).toLocaleDateString("pt-BR")}</div>
                                            <div>Até: {new Date(d.dataFim).toLocaleDateString("pt-BR")}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-700">
                                            {d.quantidadeDias}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-mono font-black text-sky-600 text-lg">
                                                {formatCurrency(d.valor)}
                                            </span>
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
