"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type Secretaria = { id: string; nome: string };

export default function NovaNoticiaPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        titulo: "",
        resumo: "",
        conteudo: "",
        publicada: false,
        imagem: "",
        secretariaId: "",
    });
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/secretarias")
            .then(res => res.json())
            .then(data => setSecretarias(data || []))
            .catch(() => toast.error("Erro ao carregar secretarias"));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/noticias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Notícia criada com sucesso!");
                router.push("/admin/noticias");
            } else {
                toast.error("Erro ao criar notícia");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/noticias" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar para lista
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Notícia</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título da Notícia *</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="Ex: Inauguração da nova praça no Centro"
                            value={form.titulo}
                            onChange={e => setForm({ ...form, titulo: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Resumo (breve descrição) *</label>
                        <textarea
                            required
                            rows={3}
                            className="input-field resize-none"
                            placeholder="Um breve resumo para aparecer na listagem..."
                            value={form.resumo}
                            onChange={e => setForm({ ...form, resumo: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria / Categoria</label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo Completo (HTML ou Markdown) *</label>
                        <textarea
                            required
                            rows={10}
                            className="input-field resize-none font-mono text-sm"
                            placeholder="Digite o conteúdo da notícia aqui..."
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
                            Publicar notícia imediatamente
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 px-8"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? "Salvando..." : "Salvar Notícia"}
                    </button>
                </div>
            </form>
        </div>
    );
}
