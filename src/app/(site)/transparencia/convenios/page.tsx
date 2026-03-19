"use client";
import { useState, useEffect } from "react";
import { FaHandshake, FaSearch, FaSpinner, FaCalendarAlt, FaHistory, FaBuilding, FaCoins } from "react-icons/fa";

type Convenio = {
    id: string;
    numero: string;
    objeto: string;
    concedente: string;
    valor: number;
    contrapartida: number;
    dataInicio: string;
    dataFim: string;
    status: string;
    secretaria: string;
};

export default function ConveniosPage() {
    const [items, setItems] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState("");

    const anos = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (ano) query.append("ano", ano);
                if (status) query.append("status", status);

                const res = await fetch(`/api/convenios?${query.toString()}`);
                const data = await res.json();
                setItems(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar convênios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ano, status]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-700 py-12 px-4 shadow-lg border-b border-rose-500">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-sm text-pink-100 mb-4 flex items-center gap-2">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <span>›</span>
                        <span className="text-white font-medium">Convênios</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <FaHandshake className="text-pink-200" /> Convênios Públicos
                    </h1>
                    <p className="text-pink-100 max-w-2xl">
                        Acompanhe os acordos firmados entre a Prefeitura e outros órgãos (Estaduais ou Federais) para a realização de obras e serviços.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Ano de Início</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                className="input-field pl-10"
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                            >
                                <option value="">Todos os anos</option>
                                {anos.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Situação</label>
                        <select
                            className="input-field"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Todas</option>
                            <option value="vigente">Em Vigência</option>
                            <option value="concluido">Concluído</option>
                            <option value="prestacao_contas">Prestação de Contas</option>
                        </select>
                    </div>
                    <button className="btn-primary flex items-center gap-2 h-[42px] px-8 bg-pink-600 hover:bg-pink-700 border-none">
                        <FaSearch size={14} /> Filtrar
                    </button>
                </div>

                {/* Lista de Convênios */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                            <FaSpinner className="animate-spin text-pink-500 text-4xl mb-3" />
                            <p className="text-gray-500 font-medium tracking-wide">Buscando convênios...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-6xl mb-4 block opacity-20">🤝</span>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum convênio encontrado</h2>
                            <p className="text-gray-500">Tente buscar por um ano diferente ou outra situação.</p>
                        </div>
                    ) : (
                        items.map((i) => (
                            <div key={i.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>

                                <div className="relative flex flex-col lg:flex-row justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-pink-50 text-pink-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-pink-100">
                                                Nº {i.numero}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                                {i.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                                            {i.objeto}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-start gap-3">
                                                <FaBuilding className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Concedente</p>
                                                    <p className="text-gray-700 font-medium">{i.concedente}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FaHistory className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Vigência</p>
                                                    <p className="text-gray-600">
                                                        {new Date(i.dataInicio).toLocaleDateString("pt-BR")} a {new Date(i.dataFim).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-4 lg:min-w-[240px]">
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] text-gray-400 font-black uppercase">Repasse</span>
                                                <span className="text-lg font-black text-pink-600">{formatCurrency(i.valor)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400">Contrapartida:</span>
                                                <span className="font-bold text-gray-500">{formatCurrency(i.contrapartida)}</span>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-400">VALOR TOTAL</span>
                                                <span className="text-sm font-black text-gray-800">{formatCurrency(i.valor + i.contrapartida)}</span>
                                            </div>
                                        </div>
                                        <button className="w-full text-center text-xs font-bold text-pink-600 hover:text-pink-700 underline underline-offset-4">
                                            Ver detalhes e documentos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
