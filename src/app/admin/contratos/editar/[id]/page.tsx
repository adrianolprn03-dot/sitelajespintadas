"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarContratoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        objeto: "",
        valor: "",
        fornecedor: "",
        dataAssinatura: "",
        dataVencimento: "",
        status: "",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/contratos/${id}`);
                const data = await res.json();
                setForm({
                    numero: data.numero || "",
                    objeto: data.objeto || "",
                    valor: data.valor?.toString() || "",
                    fornecedor: data.fornecedor || "",
                    dataAssinatura: data.dataAssinatura ? data.dataAssinatura.split('T')[0] : "",
                    dataVencimento: data.dataVencimento ? data.dataVencimento.split('T')[0] : "",
                    status: data.status || "",
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
            const res = await fetch(`/api/contratos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, valor: parseFloat(form.valor) }),
            });
            if (res.ok) {
                toast.success("Contrato atualizado!");
                router.push("/admin/contratos");
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
                <Link href="/admin/contratos" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Contrato</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número do Contrato *</label>
                        <input type="text" required className="input-field" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto *</label>
                        <textarea required rows={3} className="input-field resize-none" value={form.objeto} onChange={e => setForm({ ...form, objeto: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fornecedor *</label>
                        <input type="text" required className="input-field" value={form.fornecedor} onChange={e => setForm({ ...form, fornecedor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="vigente">Vigente</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Início</label>
                        <input type="date" required className="input-field" value={form.dataAssinatura} onChange={e => setForm({ ...form, dataAssinatura: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fim</label>
                        <input type="date" required className="input-field" value={form.dataVencimento} onChange={e => setForm({ ...form, dataVencimento: e.target.value })} />
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
