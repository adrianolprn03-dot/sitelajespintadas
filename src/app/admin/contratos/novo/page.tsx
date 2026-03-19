"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoContratoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        objeto: "",
        valor: "",
        fornecedor: "",
        dataAssinatura: "",
        dataVencimento: "",
        status: "vigente",
        secretariaId: "",
    });
    const [secretarias, setSecretarias] = useState<{ id: string, nome: string }[]>([]);

    useEffect(() => {
        fetch("/api/secretarias").then(res => res.json()).then(setSecretarias).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/contratos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, valor: parseFloat(form.valor) }),
            });
            if (res.ok) {
                toast.success("Contrato cadastrado!");
                router.push("/admin/contratos");
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
                <Link href="/admin/contratos" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Contrato</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número do Contrato *</label>
                        <input type="text" required className="input-field" placeholder="Ex: 001/2024" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor Total (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" placeholder="0.00" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto do Contrato *</label>
                        <textarea required rows={3} className="input-field resize-none" placeholder="Descrição resumida do objeto contratado..." value={form.objeto} onChange={e => setForm({ ...form, objeto: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fornecedor / Contratado *</label>
                        <input type="text" required className="input-field" placeholder="Nome da empresa ou profissional" value={form.fornecedor} onChange={e => setForm({ ...form, fornecedor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria Responsável</label>
                        <select className="input-field" value={form.secretariaId} onChange={e => setForm({ ...form, secretariaId: e.target.value })}>
                            <option value="">Selecione...</option>
                            {secretarias.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Assinatura *</label>
                        <input type="date" required className="input-field" value={form.dataAssinatura} onChange={e => setForm({ ...form, dataAssinatura: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Vencimento *</label>
                        <input type="date" required className="input-field" value={form.dataVencimento} onChange={e => setForm({ ...form, dataVencimento: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="vigente">Vigente</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? "Salvando..." : "Salvar Contrato"}
                    </button>
                </div>
            </form>
        </div>
    );
}
