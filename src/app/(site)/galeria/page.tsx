"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaImages, FaSpinner, FaEye, FaCalendar } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

type Foto = {
    id: string;
    titulo: string;
    descricao: string;
    arquivo: string;
    album: string;
    criadoEm: string;
};

export default function GaleriaPage() {
    const [fotos, setFotos] = useState<Foto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState("Todos");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/galeria");
                const data = await res.json();
                setFotos(data || []);
            } catch (error) {
                console.error("Erro ao buscar fotos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const albuns = ["Todos", ...Array.from(new Set(fotos.map(f => f.album || "Geral")))].filter(Boolean);

    const filteredFotos = selectedAlbum === "Todos"
        ? fotos
        : fotos.filter(f => (f.album || "Geral") === selectedAlbum);

    return (
        <div className="min-h-screen bg-white">
            <PageHeader
                title="Galeria de Fotos"
                subtitle="Acompanhe registros das ações, obras e eventos realizados no município de Lajes Pintadas."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Galeria" }
                ]}
            />

            {/* Filtros de Álbum */}
            <div className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 no-scrollbar">
                    {albuns.map(album => (
                        <button
                            key={album}
                            onClick={() => setSelectedAlbum(album)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedAlbum === album
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "bg-white text-gray-400 hover:text-indigo-600 border border-gray-200"
                                }`}
                        >
                            {album}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-indigo-500 text-4xl mb-3" />
                        <p className="text-gray-500 font-medium">Carregando galeria...</p>
                    </div>
                ) : fotos.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <span className="text-6xl block mb-4">📸</span>
                        <p className="text-xl italic">A galeria está vazia no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFotos.map((f) => (
                            <div key={f.id} className="group relative bg-gray-100 rounded-2xl overflow-hidden aspect-square h-[300px] shadow-sm hover:shadow-xl transition-all border border-gray-100">
                                <Image
                                    src={f.arquivo}
                                    alt={f.titulo}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                    <span className="text-[10px] font-black uppercase text-indigo-400 mb-1 tracking-widest">{f.album || "Geral"}</span>
                                    <h3 className="text-white font-bold leading-tight mb-2 line-clamp-2">{f.titulo}</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-300">
                                        <span className="flex items-center gap-1"><FaCalendar size={10} /> {new Date(f.criadoEm).toLocaleDateString("pt-BR")}</span>
                                        <button className="flex items-center gap-1 text-indigo-400 hover:text-white transition-colors">
                                            <FaEye size={12} /> Ampliar
                                        </button>
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
