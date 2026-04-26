"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaTrash, FaSpinner, FaSearch, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { FaHandHoldingDollar, FaPix } from "react-icons/fa6";
import toast from "react-hot-toast";

type EmendaPix = {
    id: string;
    ano: number;
    origem: string;
    tipoEmenda: string | null;
    formaRepasse: string | null;
    numeroEmenda: string | null;
    autor: string;
    beneficiario: string;
    valorRecebido: number;
    situacao: string;
};

export default function AdminEmendasPixPage() {
    const [items, setItems] = useState<EmendaPix[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/emendas-pix");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar emendas PIX");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta emenda PIX?")) return;
        try {
            const res = await fetch(`/api/admin/emendas-pix/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Emenda removida");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.autor.toLowerCase().includes(search.toLowerCase()) ||
        i.beneficiario.toLowerCase().includes(search.toLowerCase()) ||
        (i.numeroEmenda && i.numeroEmenda.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaHandHoldingDollar className="text-emerald-500" /> Emendas PIX (Transferências Especiais)
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie as emendas parlamentares recebidas via transferência especial.</p>
                </div>
                <Link href="/admin/emendas-pix/novo" className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
                    <FaPlus /> Nova Emenda PIX
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por autor, beneficiário ou número..."
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
                                <th className="px-6 py-4">Autor / Emenda</th>
                                <th className="px-6 py-4">Beneficiário</th>
                                <th className="px-6 py-4">Ano / Origem</th>
                                <th className="px-6 py-4">Valor Recebido</th>
                                <th className="px-6 py-4">Situação</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-emerald-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhuma emenda PIX encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-700">{i.autor}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{i.numeroEmenda || "S/N"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-600">{i.beneficiario}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 font-bold">{i.ano}</div>
                                            <div className="text-[10px] text-gray-400 font-black uppercase">{i.origem}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-emerald-600">
                                                {i.valorRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                i.situacao === "Recebido" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                i.situacao === "Em Execução" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                "bg-gray-50 text-gray-600 border border-gray-100"
                                            }`}>
                                                {i.situacao}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/emendas-pix/editar/${i.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(i.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Excluir">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
