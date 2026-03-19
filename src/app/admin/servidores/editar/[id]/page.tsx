"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarServidorPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        cargo: "",
        vinculo: "",
        lotacao: "",
        salarioBase: "",
        ano: "",
        mes: "",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/servidores/${id}`);
                const data = await res.json();
                setForm({
                    nome: data.nome || "",
                    cargo: data.cargo || "",
                    vinculo: data.vinculo || "",
                    lotacao: data.lotacao || "",
                    salarioBase: data.salarioBase?.toString() || "",
                    ano: data.ano?.toString() || "",
                    mes: data.mes?.toString() || "",
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
            const res = await fetch(`/api/servidores/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    salarioBase: parseFloat(form.salarioBase),
                    ano: parseInt(form.ano),
                    mes: parseInt(form.mes),
                }),
            });
            if (res.ok) {
                toast.success("Servidor atualizado!");
                router.push("/admin/servidores");
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
                <Link href="/admin/servidores" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Servidor</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo *</label>
                        <input type="text" required className="input-field" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label>
                        <input type="text" required className="input-field" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Vínculo *</label>
                        <select required className="input-field" value={form.vinculo} onChange={e => setForm({ ...form, vinculo: e.target.value })}>
                            <option value="Efetivo">Efetivo</option>
                            <option value="Comissionado">Comissionado</option>
                            <option value="Contratado">Contratado</option>
                            <option value="Eletivo">Eletivo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Lotação / Secretaria *</label>
                        <input type="text" required className="input-field" value={form.lotacao} onChange={e => setForm({ ...form, lotacao: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Salário Base (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.salarioBase} onChange={e => setForm({ ...form, salarioBase: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ano de Referência</label>
                        <input type="number" required className="input-field" value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mês de Referência</label>
                        <select required className="input-field" value={form.mes} onChange={e => setForm({ ...form, mes: e.target.value })}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
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
