"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoGlossarioPage() {
    const router = useRouter();
    const [form, setForm] = useState({ termo: "", definicao: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/glossario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Termo criado com sucesso!");
                router.push("/admin/glossario");
            } else {
                toast.error("Erro ao criar termo");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/glossario" className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors font-bold text-xs uppercase tracking-widest">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter text-right">Novo Termo no Glossário</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-10 space-y-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Termo Técnico *</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="Ex: Emissivo, Superávit, etc."
                        value={form.termo}
                        onChange={e => setForm({ ...form, termo: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Definição / Significado *</label>
                    <textarea
                        required
                        rows={6}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                        placeholder="Digite o significado técnico do termo..."
                        value={form.definicao}
                        onChange={e => setForm({ ...form, definicao: e.target.value })}
                    />
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white font-black py-4 px-10 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? "Salvando..." : "Salvar Termo"}
                    </button>
                </div>
            </form>
        </div>
    );
}
