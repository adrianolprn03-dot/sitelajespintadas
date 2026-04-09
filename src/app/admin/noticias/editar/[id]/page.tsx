"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type Secretaria = { id: string; nome: string };

export default function EditarNoticiaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [form, setForm] = useState({
        titulo: "",
        subtitulo: "",
        resumo: "",
        conteudo: "",
        publicada: false,
        imagem: "",
        secretariaId: "",
    });
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [noticiaRes, secretariasRes] = await Promise.all([
                    fetch(`/api/noticias/${id}`),
                    fetch("/api/secretarias")
                ]);

                const noticiaData = await noticiaRes.json();
                const secretariasData = await secretariasRes.json();

                setForm({
                    titulo: noticiaData.titulo || "",
                    subtitulo: noticiaData.subtitulo || "",
                    resumo: noticiaData.resumo || "",
                    conteudo: noticiaData.conteudo || "",
                    publicada: noticiaData.publicada || false,
                    imagem: noticiaData.imagem || "",
                    secretariaId: noticiaData.secretariaId || "",
                });
                setSecretarias(secretariasData || []);
            } catch (error) {
                toast.error("Erro ao carregar dados");
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/noticias/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Notícia atualizada!");
                router.push("/admin/noticias");
            } else {
                toast.error("Erro ao salvar");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        } finally {
            setSaving(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-primary-500 text-4xl mb-3" />
                <p className="text-gray-500">Carregando notícia...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/noticias" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Notícia</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título da Notícia *</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={form.titulo}
                            onChange={e => setForm({ ...form, titulo: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Resumo *</label>
                        <textarea
                            required
                            rows={3}
                            className="input-field resize-none"
                            value={form.resumo}
                            onChange={e => setForm({ ...form, resumo: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria</label>
                        <select
                            className="input-field"
                            value={form.secretariaId}
                            onChange={e => setForm({ ...form, secretariaId: e.target.value })}
                        >
                            <option value="">Geral / Sem secretaria</option>
                            {secretarias.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                    </div>

                    <div>
                        <ImageUpload
                            value={form.imagem}
                            onChange={(url) => setForm({ ...form, imagem: url })}
                            label="Imagem de Capa"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo Completo *</label>
                        <textarea
                            required
                            rows={10}
                            className="input-field resize-none font-mono text-sm"
                            value={form.conteudo}
                            onChange={e => setForm({ ...form, conteudo: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            id="publicada"
                            className="w-4 h-4 text-primary-600 rounded"
                            checked={form.publicada}
                            onChange={e => setForm({ ...form, publicada: e.target.checked })}
                        />
                        <label htmlFor="publicada" className="text-sm font-medium text-gray-700">
                            Publicada (visível no site)
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 px-8"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {saving ? "Salvando..." : "Atualizar Notícia"}
                    </button>
                </div>
            </form>
        </div>
    );
}
