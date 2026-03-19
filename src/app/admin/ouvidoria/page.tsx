"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBullhorn, FaSpinner, FaSearch, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";

type Ouvidoria = {
    id: string;
    protocolo: string;
    tipo: string;
    assunto: string;
    nome: string | null;
    status: string;
    criadoEm: string;
};

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    "aberto": { label: "Aberto", color: "text-blue-600 bg-blue-50 border-blue-100", icon: FaClock },
    "em-analise": { label: "Em Análise", color: "text-orange-600 bg-orange-50 border-orange-100", icon: FaSpinner },
    "concluido": { label: "Concluído", color: "text-green-600 bg-green-50 border-green-100", icon: FaCheckCircle },
};

export default function AdminOuvidoriaPage() {
    const [items, setItems] = useState<Ouvidoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ouvidoria");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar manifestações");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = items.filter(i =>
        i.protocolo.toLowerCase().includes(search.toLowerCase()) ||
        i.assunto.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBullhorn className="text-primary-500" /> Ouvidoria Municipal
                </h1>
                <p className="text-gray-500 text-sm">Acompanhe e responda as manifestações dos cidadãos.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por protocolo ou assunto..."
                            className="input-field pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Protocolo / Data</th>
                                <th className="px-6 py-4">Tipo / Assunto</th>
                                <th className="px-6 py-4">Manifestante</th>
                                <th className="px-6 py-4">Situação</th>
                                <th className="px-6 py-4 text-right">Ações</th>
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
                                        Nenhuma manifestação registrada.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => {
                                    const config = statusConfig[i.status] || statusConfig["aberto"];
                                    return (
                                        <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-bold text-gray-700 text-sm">{i.protocolo}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {new Date(i.criadoEm).toLocaleDateString("pt-BR")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[10px] font-black uppercase text-primary-600 tracking-tighter mb-1">{i.tipo}</div>
                                                <div className="text-sm font-medium text-gray-700 line-clamp-1">{i.assunto}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {i.nome || <span className="text-gray-300 italic">Anônimo</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${config.color}`}>
                                                    <config.icon size={10} className={i.status === 'em-analise' ? 'animate-spin' : ''} />
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/ouvidoria/${i.id}`}
                                                    className="btn-outline text-xs py-1.5 px-4 font-bold rounded-lg border-gray-200 text-gray-600 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                                                >
                                                    Ver Detalhes
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
