"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaUsers, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function NovoConselhoPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nome: "", sigla: "", tipo: "saude",
        descricao: "", composicao: "",
        presidente: "", email: "", ativo: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/conselhos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success("Conselho criado com sucesso!");
                router.push("/admin/conselhos");
            } else {
                toast.error("Erro ao criar conselho.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/conselhos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-blue-600" /> Novo Conselho
                    </h1>
                    <p className="text-gray-500 text-sm">Cadastre um novo conselho municipal.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Nome Completo *</label>
                        <input name="nome" value={form.nome} onChange={handleChange} required
                            className="input-field" placeholder="Ex: Conselho Municipal de Saúde" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Sigla</label>
                        <input name="sigla" value={form.sigla} onChange={handleChange}
                            className="input-field" placeholder="Ex: CMS" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Tipo / Área *</label>
                        <select name="tipo" value={form.tipo} onChange={handleChange} required className="input-field">
                            <option value="saude">Saúde</option>
                            <option value="educacao">Educação</option>
                            <option value="social">Assistência Social</option>
                            <option value="fundeb">FUNDEB</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Presidente</label>
                        <input name="presidente" value={form.presidente} onChange={handleChange}
                            className="input-field" placeholder="Nome do presidente atual" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">E-mail do Conselho</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange}
                            className="input-field" placeholder="conselho@lajesPintadas.rn.gov.br" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Descrição *</label>
                        <textarea name="descricao" value={form.descricao} onChange={handleChange} required rows={3}
                            className="input-field resize-none" placeholder="Descreva a função do conselho..." />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Composição *</label>
                        <textarea name="composicao" value={form.composicao} onChange={handleChange} required rows={2}
                            className="input-field resize-none" placeholder="Descreva como o conselho é composto..." />
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" name="ativo" id="ativo" checked={form.ativo}
                            onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                        <label htmlFor="ativo" className="text-sm font-bold text-gray-700">Conselho ativo (aparece no portal)</label>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <Link href="/admin/conselhos" className="btn-outline">Cancelar</Link>
                    <button type="submit" disabled={saving}
                        className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                        {saving ? "Salvando..." : "Salvar Conselho"}
                    </button>
                </div>
            </form>
        </div>
    );
}
