"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarDiariaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        servidor: "",
        cargo: "",
        destino: "",
        motivo: "",
        dataInicio: "",
        dataFim: "",
        valor: "",
        quantidadeDias: "",
        secretaria: "",
        mes: "",
        ano: "",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/diarias/${id}`);
                const data = await res.json();
                setForm({
                    servidor: data.servidor || "",
                    cargo: data.cargo || "",
                    destino: data.destino || "",
                    motivo: data.motivo || "",
                    dataInicio: data.dataInicio ? data.dataInicio.split('T')[0] : "",
                    dataFim: data.dataFim ? data.dataFim.split('T')[0] : "",
                    valor: data.valor?.toString() || "",
                    quantidadeDias: data.quantidadeDias?.toString() || "1",
                    secretaria: data.secretaria || "",
                    mes: data.mes?.toString() || "",
                    ano: data.ano?.toString() || "",
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
            const res = await fetch(`/api/diarias/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Diária atualizada!");
                router.push("/admin/diarias");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><FaSpinner className="animate-spin inline-block text-4xl text-sky-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/diarias" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Diária</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Servidor *</label>
                        <input type="text" required className="input-field" value={form.servidor} onChange={e => setForm({ ...form, servidor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label>
                        <input type="text" required className="input-field" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo *</label>
                        <textarea required rows={3} className="input-field resize-none" value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Período</label>
                        <div className="flex gap-2">
                            <input type="date" required className="input-field" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                            <input type="date" required className="input-field" value={form.dataFim} onChange={e => setForm({ ...form, dataFim: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 bg-sky-600 hover:bg-sky-700 border-none">
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
