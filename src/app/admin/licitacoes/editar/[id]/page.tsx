"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarLicitacaoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        objeto: "",
        modalidade: "",
        status: "",
        dataAbertura: "",
        secretariaId: "",
    });
    const [secretarias, setSecretarias] = useState<{ id: string, nome: string }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [res, secRes] = await Promise.all([
                    fetch(`/api/licitacoes/${id}`),
                    fetch("/api/secretarias")
                ]);
                const data = await res.json();
                const secData = await secRes.json();

                setForm({
                    numero: data.numero || "",
                    objeto: data.objeto || "",
                    modalidade: data.modalidade || "",
                    status: data.status || "",
                    dataAbertura: data.dataAbertura ? data.dataAbertura.split('T')[0] : "",
                    secretariaId: data.secretariaId || "",
                });
                setSecretarias(secData || []);
            } catch {
                toast.error("Erro ao carregar dados");
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
            const res = await fetch(`/api/licitacoes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Licitação atualizada!");
                router.push("/admin/licitacoes");
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
                <Link href="/admin/licitacoes" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Licitação</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número do Processo *</label>
                        <input type="text" required className="input-field" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Modalidade *</label>
                        <select required className="input-field" value={form.modalidade} onChange={e => setForm({ ...form, modalidade: e.target.value })}>
                            <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                            <option value="Dispensa">Dispensa</option>
                            <option value="Inexigibilidade">Inexigibilidade</option>
                            <option value="Concorrência">Concorrência</option>
                            <option value="Tomada de Preço">Tomada de Preço</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto *</label>
                        <textarea required rows={3} className="input-field resize-none" value={form.objeto} onChange={e => setForm({ ...form, objeto: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="aberta">Aberta</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="finalizada">Finalizada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Abertura</label>
                        <input type="date" required className="input-field" value={form.dataAbertura} onChange={e => setForm({ ...form, dataAbertura: e.target.value })} />
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8">
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
