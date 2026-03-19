"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovaDiariaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        servidor: "",
        cargo: "",
        destino: "",
        motivo: "",
        dataInicio: "",
        dataFim: "",
        valor: "",
        quantidadeDias: "1",
        secretaria: "",
        mes: (new Date().getMonth() + 1).toString(),
        ano: new Date().getFullYear().toString(),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/diarias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Diária cadastrada!");
                router.push("/admin/diarias");
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
                <Link href="/admin/diarias" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Diária</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Servidor *</label>
                        <input type="text" required className="input-field" placeholder="Nome completo" value={form.servidor} onChange={e => setForm({ ...form, servidor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label>
                        <input type="text" required className="input-field" placeholder="Cargo ou função" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Destino *</label>
                        <input type="text" required className="input-field" placeholder="Cidade de destino" value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria *</label>
                        <input type="text" required className="input-field" value={form.secretaria} onChange={e => setForm({ ...form, secretaria: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo / Finalidade *</label>
                        <textarea required rows={3} className="input-field resize-none" placeholder="Motivo da viagem..." value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Início *</label>
                        <input type="date" required className="input-field" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fim *</label>
                        <input type="date" required className="input-field" value={form.dataFim} onChange={e => setForm({ ...form, dataFim: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor Unitário (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade de Diárias</label>
                        <input type="number" step="0.5" required className="input-field" value={form.quantidadeDias} onChange={e => setForm({ ...form, quantidadeDias: e.target.value })} />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8 bg-sky-600 hover:bg-sky-700 border-none">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Diária
                    </button>
                </div>
            </form>
        </div>
    );
}
