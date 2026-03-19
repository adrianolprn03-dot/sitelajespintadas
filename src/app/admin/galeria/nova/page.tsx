"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovaFotoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        titulo: "",
        album: "Geral",
        arquivo: "",
        descricao: "",
        publicada: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/galeria", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Foto adicionada com sucesso!");
                router.push("/admin/galeria");
            } else {
                toast.error("Erro ao salvar foto");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/galeria" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Foto na Galeria</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título da Foto / Evento *</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={form.titulo}
                            onChange={e => setForm({ ...form, titulo: e.target.value })}
                            placeholder="Ex: Inauguração da Praça Central"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Álbum *</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={form.album}
                            onChange={e => setForm({ ...form, album: e.target.value })}
                            placeholder="Ex: Obras, Eventos, Saúde..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Foto / Imagem *</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:text-primary-500 cursor-pointer transition-all bg-gray-50/50">
                                <FaFileUpload className="text-xl" />
                                <div className="text-center">
                                    <p className="text-sm font-bold">{form.arquivo ? "Trocar Imagem" : "Clique para enviar a foto"}</p>
                                    <p className="text-xs text-gray-400">JPG, PNG ou WebP</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    required={!form.arquivo}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const data = await res.json();
                                                if (data.url) {
                                                    setForm({ ...form, arquivo: data.url });
                                                    toast.success("Foto carregada!");
                                                }
                                            } catch {
                                                toast.error("Erro no upload");
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição Breve (Opcional)</label>
                        <textarea
                            rows={3}
                            className="input-field"
                            value={form.descricao}
                            onChange={e => setForm({ ...form, descricao: e.target.value })}
                            placeholder="Descreva detalhes da imagem..."
                        />
                    </div>
                </div>

                {form.arquivo && (
                    <div className="mt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Pré-visualização:</p>
                        <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            <img src={form.arquivo} alt="Preview" className="w-full h-full object-contain" onError={() => toast.error("Link de imagem inválido")} />
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Publicar na Galeria
                    </button>
                </div>
            </form>
        </div>
    );
}
