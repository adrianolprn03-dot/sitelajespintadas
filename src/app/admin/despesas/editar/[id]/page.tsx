"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarDespesaPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        descricao: "",
        categoria: "",
        valor: "",
        secretaria: "",
        mes: "",
        ano: "",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/despesas/${id}`);
                const data = await res.json();
                setForm({
                    descricao: data.descricao || "",
                    categoria: data.categoria || "",
                    valor: data.valor?.toString() || "",
                    secretaria: data.secretaria || "",
                    mes: data.mes?.toString() || "",
                    ano: data.ano?.toString() || "",
                });
            } catch {
                toast.error("Erro ao carregar despesa");
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
            const res = await fetch(`/api/despesas/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    valor: parseFloat(form.valor),
                    mes: parseInt(form.mes),
                    ano: parseInt(form.ano),
                }),
            });
            if (res.ok) {
                toast.success("Despesa atualizada!");
                router.push("/admin/despesas");
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
                <Link href="/admin/despesas" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Despesa</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição / Finalidade *</label>
                        <input type="text" required className="input-field" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria *</label>
                        <select required className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                            <option value="Pessoal">Pessoal e Encargos</option>
                            <option value="Custeio">Outras Despesas Correntes (Custeio)</option>
                            <option value="Investimentos">Investimentos / Obras</option>
                            <option value="Dívida">Amortização da Dívida</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria Responsável *</label>
                        <input type="text" required className="input-field" value={form.secretaria} onChange={e => setForm({ ...form, secretaria: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ano</label>
                        <input type="number" required className="input-field" value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mês</label>
                        <select required className="input-field" value={form.mes} onChange={e => setForm({ ...form, mes: e.target.value })}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
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
