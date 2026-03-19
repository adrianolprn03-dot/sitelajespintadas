"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoEventoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        local: "",
        dataInicio: "",
        publico: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/agenda", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Evento agendado!");
                router.push("/admin/agenda");
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
                <Link href="/admin/agenda" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Compromisso na Agenda</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título do Evento *</label>
                        <input type="text" required className="input-field" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Audiência Pública Orçamentária" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data e Hora de Início *</label>
                        <input type="datetime-local" required className="input-field" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Local</label>
                        <input type="text" className="input-field" value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} placeholder="Ex: Câmara Municipal ou Online" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição / Detalhes</label>
                        <textarea rows={4} className="input-field" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Pauta central do compromisso..." />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Agendar Evento
                    </button>
                </div>
            </form>
        </div>
    );
}
