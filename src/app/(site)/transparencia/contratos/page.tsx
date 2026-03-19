"use client";
import { useState, useEffect } from "react";
import { FaFileContract, FaSearch, FaSpinner, FaCalendarAlt, FaHistory, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type Contrato = {
    id: string;
    numero: string;
    objeto: string;
    valor: number;
    fornecedor: string;
    dataAssinatura: string;
    dataVencimento: string;
    status: string;
    secretaria?: { nome: string };
};

export default function ContratosPage() {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState("");

    const anos = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

    useEffect(() => {
        const fetchContratos = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (ano) query.append("ano", ano);
                if (status) query.append("status", status);

                const res = await fetch(`/api/contratos?${query.toString()}`);
                const data = await res.json();
                setContratos(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContratos();
    }, [ano, status]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "vigente": return "bg-green-100 text-green-700 border-green-200";
            case "finalizado": return "bg-blue-100 text-blue-700 border-blue-200";
            case "cancelado": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-700 py-12 px-4 shadow-lg border-b border-orange-500">
                <div className="max-w-7xl mx-auto">
                    <nav className="text-sm text-orange-100 mb-4 flex items-center gap-2">
                        <a href="/transparencia" className="hover:text-white transition-colors">Transparência</a>
                        <span>›</span>
                        <span className="text-white font-medium">Contratos Administrativos</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <FaFileContract className="text-orange-200" /> Contratos Administrativos
                    </h1>
                    <p className="text-orange-100 max-w-2xl">
                        Consulte os contratos celebrados pela Prefeitura, incluindo valores, vigência, objeto e fornecedores contratados.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Ano da Assinatura</label>
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
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Status do Contrato</label>
                        <select
                            className="input-field"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Todos os status</option>
                            <option value="vigente">Vigente</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <button className="btn-primary flex items-center gap-2 h-[42px] px-8 bg-orange-600 hover:bg-orange-700 border-none">
                        <FaSearch size={14} /> Pesquisar
                    </button>
                </div>

                {/* Lista de Contratos */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                            <FaSpinner className="animate-spin text-orange-500 text-4xl mb-3" />
                            <p className="text-gray-500 font-medium tracking-wide">Buscando contratos no sistema...</p>
                        </div>
                    ) : contratos.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-6xl mb-4 block opacity-20">📜</span>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum contrato encontrado</h2>
                            <p className="text-gray-500">Tente ajustar seus filtros para encontrar o que procura.</p>
                        </div>
                    ) : (
                        contratos.map((c) => (
                            <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                                                Nº {c.numero}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                                            {c.objeto}
                                        </h3>
                                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-700">Fornecedor:</span> {c.fornecedor}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-700">Vigência:</span>
                                                <FaHistory className="text-gray-400 text-xs" />
                                                {new Date(c.dataAssinatura).toLocaleDateString("pt-BR")} a {new Date(c.dataVencimento).toLocaleDateString("pt-BR")}
                                            </div>
                                            {c.secretaria && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Orgão:</span> {c.secretaria.nome}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="lg:text-right flex flex-col justify-center gap-2 bg-gray-50 p-4 lg:bg-transparent lg:p-0 rounded-xl">
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Valor do Contrato</div>
                                        <div className="text-2xl font-black text-orange-600">{formatCurrency(c.valor)}</div>
                                        <button className="text-xs font-bold text-gray-500 hover:text-orange-600 underline transition-colors">
                                            Ver documento completo
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
