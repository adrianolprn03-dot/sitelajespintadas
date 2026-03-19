"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarSecretariaPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        secretario: "",
        email: "",
        telefone: "",
        endereco: "",
        imagem: "",
        ativa: true
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/secretarias/${id}`);
                const data = await res.json();
                setForm({
                    nome: data.nome || "",
                    descricao: data.descricao || "",
                    secretario: data.secretario || "",
                    email: data.email || "",
                    telefone: data.telefone || "",
                    endereco: data.endereco || "",
                    imagem: data.imagem || "",
                    ativa: data.ativa ?? true
                });
            } catch {
                toast.error("Erro ao carregar secretaria");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/secretarias/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Secretaria atualizada!");
                router.push("/admin/secretarias");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><FaSpinner className="animate-spin inline-block text-4xl text-primary-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/secretarias" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Secretaria</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Secretaria *</label>
                        <input type="text" required className="input-field" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretário(a) Responsável</label>
                        <input type="text" className="input-field" value={form.secretario} onChange={e => setForm({ ...form, secretario: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail de Contato</label>
                        <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
                        <input type="text" className="input-field" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.ativa ? "true" : "false"} onChange={e => setForm({ ...form, ativa: e.target.value === "true" })}>
                            <option value="true">Ativa</option>
                            <option value="false">Inativa</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço</label>
                        <input type="text" className="input-field" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem / Logotipo da Secretaria</label>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            {form.imagem && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white">
                                    <img src={form.imagem} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:text-primary-500 cursor-pointer transition-all bg-white">
                                <FaFileUpload />
                                <span className="text-sm font-semibold">{form.imagem ? "Alterar Imagem" : "Enviar Logotipo"}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const data = await res.json();
                                                if (data.url) {
                                                    setForm({ ...form, imagem: data.url });
                                                    toast.success("Imagem carregada!");
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição / Competências</label>
                        <textarea rows={4} className="input-field" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8">
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
