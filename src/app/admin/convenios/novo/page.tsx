"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoConvenioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        objeto: "",
        concedente: "",
        valor: "",
        contrapartida: "0",
        dataInicio: "",
        dataFim: "",
        status: "vigente",
        secretaria: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/convenios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Convênio cadastrado!");
                router.push("/admin/convenios");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/convenios" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Convênio</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número do Convênio *</label>
                        <input type="text" required className="input-field" placeholder="Ex: 12345/2024" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Concedente *</label>
                        <input type="text" required className="input-field" placeholder="Ex: Governo Federal / Ministério da Saúde" value={form.concedente} onChange={e => setForm({ ...form, concedente: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto *</label>
                        <textarea required rows={3} className="input-field resize-none" placeholder="Descrição do que será realizado..." value={form.objeto} onChange={e => setForm({ ...form, objeto: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor do Repasse (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contrapartida (R$)</label>
                        <input type="number" step="0.01" className="input-field" value={form.contrapartida} onChange={e => setForm({ ...form, contrapartida: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Início *</label>
                        <input type="date" required className="input-field" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Fim *</label>
                        <input type="date" required className="input-field" value={form.dataFim} onChange={e => setForm({ ...form, dataFim: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria Executora</label>
                        <input type="text" className="input-field" value={form.secretaria} onChange={e => setForm({ ...form, secretaria: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="vigente">Em Vigência</option>
                            <option value="concluido">Concluído</option>
                            <option value="prestacao_contas">Prestação de Contas</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8 bg-pink-600 hover:bg-pink-700 border-none">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Convênio
                    </button>
                </div>
            </form>
        </div>
    );
}
