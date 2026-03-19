"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarConvenioPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        objeto: "",
        concedente: "",
        valor: "",
        contrapartida: "",
        dataInicio: "",
        dataFim: "",
        status: "",
        secretaria: "",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/convenios/${id}`);
                const data = await res.json();
                setForm({
                    numero: data.numero || "",
                    objeto: data.objeto || "",
                    concedente: data.concedente || "",
                    valor: data.valor?.toString() || "",
                    contrapartida: data.contrapartida?.toString() || "0",
                    dataInicio: data.dataInicio ? data.dataInicio.split('T')[0] : "",
                    dataFim: data.dataFim ? data.dataFim.split('T')[0] : "",
                    status: data.status || "",
                    secretaria: data.secretaria || "",
                });
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
            const res = await fetch(`/api/convenios/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Convênio atualizado!");
                router.push("/admin/convenios");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><FaSpinner className="animate-spin inline-block text-4xl text-pink-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/convenios" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Convênio</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número *</label>
                        <input type="text" required className="input-field" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Concedente *</label>
                        <input type="text" required className="input-field" value={form.concedente} onChange={e => setForm({ ...form, concedente: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto *</label>
                        <textarea required rows={3} className="input-field resize-none" value={form.objeto} onChange={e => setForm({ ...form, objeto: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="vigente">Vigente</option>
                            <option value="concluido">Concluído</option>
                            <option value="prestacao_contas">Prestação de Contas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Início</label>
                        <input type="date" required className="input-field" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fim</label>
                        <input type="date" required className="input-field" value={form.dataFim} onChange={e => setForm({ ...form, dataFim: e.target.value })} />
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 bg-pink-600 hover:bg-pink-700 border-none">
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
