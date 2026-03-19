"use client";
import { useState, useEffect } from "react";
import { FaBalanceScale, FaDownload, FaSearch, FaSpinner, FaCalendarAlt, FaFileContract } from "react-icons/fa";

type Documento = {
    id: string;
    titulo: string;
    tipo: string;
    arquivo: string;
    ano: number;
    tamanho: number;
};

export default function OrcamentoPage() {
    const [docs, setDocs] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [tipo, setTipo] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());

    const anos = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (ano) query.append("ano", ano);
                if (tipo) query.append("tipo", tipo); else query.append("tipo", "loa,ldo,ppa");

                const res = await fetch(`/api/documentos?${query.toString()}`);
                const data = await res.json();
                setDocs(data || []);
            } catch (error) {
                console.error("Erro ao buscar documentos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ano, tipo]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 py-12 px-4 shadow-lg border-b border-slate-600">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-sm text-slate-300 mb-4 flex items-center gap-2">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <span>›</span>
                        <span className="text-white font-medium">LOA, LDO e PPA</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <FaBalanceScale className="text-slate-400" /> Legislação Orçamentária
                    </h1>
                    <p className="text-slate-300 max-w-2xl">
                        Consulte as leis que regem o orçamento municipal: PPA (Plano Plurianual), LDO (Lei de Diretrizes Orçamentárias) e LOA (Lei Orçamentária Anual).
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Tipo de Lei</label>
                        <select
                            className="input-field"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <option value="">Todas (LOA, LDO, PPA)</option>
                            <option value="loa">LOA - Orçamentária Anual</option>
                            <option value="ldo">LDO - Diretrizes Orçamentárias</option>
                            <option value="ppa">PPA - Plano Plurianual</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Ano</label>
                        <select
                            className="input-field"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                        >
                            {anos.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <button className="btn-primary flex items-center gap-2 h-[42px] px-8 bg-slate-800 hover:bg-slate-900 border-none">
                        <FaSearch size={14} /> Pesquisar
                    </button>
                </div>

                {/* Lista de Leis */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                            <FaSpinner className="animate-spin text-slate-500 text-4xl mb-3" />
                            <p className="text-gray-500 font-medium tracking-wide">Buscando legislação...</p>
                        </div>
                    ) : docs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-6xl mb-4 block opacity-20">📜</span>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhuma lei encontrada</h2>
                            <p className="text-gray-500">Tente buscar por outro ano ou categoria.</p>
                        </div>
                    ) : (
                        docs.map((d) => (
                            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-5 flex-1">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-100">
                                        <FaBalanceScale size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                {d.tipo}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">
                                                Ano {d.ano}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 lg:text-lg">{d.titulo}</h3>
                                    </div>
                                </div>
                                <a
                                    href={d.arquivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary bg-slate-800 hover:bg-slate-900 flex items-center gap-2 px-8 min-w-[200px] justify-center"
                                >
                                    <FaDownload size={14} /> Acessar Documento
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
