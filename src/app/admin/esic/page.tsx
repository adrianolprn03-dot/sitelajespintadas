"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileAlt, FaSpinner, FaSearch, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

type Esic = {
    id: string;
    protocolo: string;
    orgao: string;
    pedido: string;
    nome: string | null;
    status: string;
    criadoEm: string;
};

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    "aberto": { label: "Aberto", color: "text-blue-600 bg-blue-50 border-blue-100", icon: FaClock },
    "em-analise": { label: "Em Análise", color: "text-orange-600 bg-orange-50 border-orange-100", icon: FaSpinner },
    "concluido": { label: "Concluído", color: "text-green-600 bg-green-50 border-green-100", icon: FaCheckCircle },
};

export default function AdminEsicPage() {
    const [items, setItems] = useState<Esic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/esic");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = items.filter(i =>
        i.protocolo.toLowerCase().includes(search.toLowerCase()) ||
        i.pedido.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaFileAlt className="text-primary-500" /> e-SIC (Acesso à Informação)
                </h1>
                <p className="text-gray-500 text-sm">Gerencie os pedidos de informação da LAI.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar protocolo..."
                            className="bg-white text-gray-700 w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-5">Protocolo / Data</th>
                                <th className="px-6 py-5">Órgão Solicitado</th>
                                <th className="px-6 py-5">Cidadão</th>
                                <th className="px-6 py-5">Situação</th>
                                <th className="px-6 py-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum pedido registrado no momento.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => {
                                    const config = statusConfig[i.status] || statusConfig["aberto"];
                                    return (
                                        <tr key={i.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-bold text-gray-700 text-sm">{i.protocolo}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {new Date(i.criadoEm).toLocaleDateString("pt-BR")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[10px] font-black uppercase text-primary-600 tracking-tighter mb-1">{i.orgao}</div>
                                                <div className="text-sm font-medium text-gray-700 line-clamp-1">{i.pedido}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                                {i.nome || <span className="text-gray-300 italic font-medium">Anônimo</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${config.color}`}>
                                                    <config.icon size={10} className={i.status === 'em-analise' ? 'animate-spin' : ''} />
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/esic/${i.id}`}
                                                    className="inline-flex items-center justify-center h-9 px-4 rounded-xl font-bold border border-gray-200 text-gray-600 bg-white hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all shadow-sm text-xs"
                                                >
                                                    Responder
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
