"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function NovoQuadroServidorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        cargo: "",
        vinculo: "Efetivo",
        leiCriacao: "",
        vagasLei: 0,
        vagasOcupadas: 0,
        ativo: true
    });

    const vinculosOptions = ["Efetivo", "Comissionado", "Contratado", "Eletivo", "Estagiário"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.cargo.trim()) {
            toast.error("O nome do cargo é obrigatório");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/quadro-servidores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Registro adicionado com sucesso!");
                router.push("/admin/servidores/quadro");
                router.refresh();
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao salvar");
            }
        } catch {
            toast.error("Erro interno. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/servidores/quadro"
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                >
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Novo Cargo no Quadro</h1>
                    <p className="text-gray-500">Adicione uma nova entrada ao Quadro de Pessoal.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Cargo *</label>
                        <input
                            type="text"
                            required
                            value={formData.cargo}
                            onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: Professor de Educação Básica, Auxiliar Administrativo..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Vínculo *</label>
                        <select
                            value={formData.vinculo}
                            onChange={e => setFormData({ ...formData, vinculo: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                            {vinculosOptions.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Lei de Criação (opcional)</label>
                        <input
                            type="text"
                            value={formData.leiCriacao}
                            onChange={e => setFormData({ ...formData, leiCriacao: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: Lei Municipal 123/2010"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Vagas Criadas em Lei</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.vagasLei}
                            onChange={e => setFormData({ ...formData, vagasLei: parseInt(e.target.value) || 0 })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Vagas Atualmente Ocupadas</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.vagasOcupadas}
                            onChange={e => setFormData({ ...formData, vagasOcupadas: parseInt(e.target.value) || 0 })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.ativo}
                                onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
                                className="w-5 h-5 text-primary-600 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Ativo para exibição pública</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-4">
                    <Link
                        href="/admin/servidores/quadro"
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Cargo
                    </button>
                </div>
            </form>
        </div>
    );
}
