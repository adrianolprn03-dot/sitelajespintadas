"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaTrash, FaSpinner, FaSearch, FaImages, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

type Foto = {
    id: string;
    titulo: string;
    arquivo: string;
    album: string | null;
    publicada: boolean;
    criadoEm: string;
};

export default function AdminGaleriaPage() {
    const [items, setItems] = useState<Foto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/galeria");
            const data = await res.json();
            setItems(data || []);
        } catch {
            toast.error("Erro ao carregar galeria");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta foto?")) return;
        try {
            const res = await fetch(`/api/galeria/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Foto removida!");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (i.album && i.album.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaImages className="text-primary-500" /> Galeria de Fotos
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie os registros fotográficos do município.</p>
                </div>
                <Link href="/admin/galeria/nova" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Nova Foto
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título ou álbum..."
                            className="input-field pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <FaSpinner className="animate-spin inline-block text-3xl text-primary-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 italic">
                        Nenhuma foto encontrada.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                        {filtered.map((item) => (
                            <div key={item.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 aspect-square">
                                <img
                                    src={item.arquivo}
                                    alt={item.titulo}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                            title="Excluir"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                    <div className="text-white">
                                        <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">{item.album || "Geral"}</span>
                                        <h3 className="font-bold text-sm line-clamp-2">{item.titulo}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
