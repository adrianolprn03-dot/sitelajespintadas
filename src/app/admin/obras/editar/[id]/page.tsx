"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarObraPage() {
    const router = useRouter();
    const params = useParams();
    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        local: "",
        valor: "",
        status: "",
        dataInicio: "",
        previsaoTermino: "",
        empresa: "",
        percentual: 0,
        imagem: "",
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/admin/obras/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        ...data,
                        valor: data.valor.toString(),
                        dataInicio: data.dataInicio ? data.dataInicio.split("T")[0] : "",
                        previsaoTermino: data.previsaoTermino ? data.previsaoTermino.split("T")[0] : "",
                    });
                    setFetching(false);
                })
                .catch(() => {
                    toast.error("Erro ao carregar obra");
                    router.push("/admin/obras");
                });
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/obras/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Obra atualizada com sucesso!");
                router.push("/admin/obras");
            } else {
                toast.error("Erro ao atualizar obra");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex items-center justify-center py-20"><FaSpinner className="animate-spin text-3xl text-primary-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <Link href="/admin/obras" className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors font-bold text-xs uppercase tracking-widest">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter text-right">Editar Obra</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Título da Obra *</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                            value={form.titulo}
                            onChange={e => setForm({ ...form, titulo: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descrição e Objetivos *</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            value={form.descricao}
                            onChange={e => setForm({ ...form, descricao: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Localização *</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={form.local}
                            onChange={e => setForm({ ...form, local: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Valor Previsto (R$) *</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                            value={form.valor}
                            onChange={e => setForm({ ...form, valor: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Status da Obra</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1rem]"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="licitacao">Fase de Licitação</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluida">Concluída</option>
                            <option value="paralisada">Paralisada</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Percentual de Conclusão (%)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="flex-1 accent-blue-500"
                                value={form.percentual}
                                onChange={e => setForm({ ...form, percentual: parseInt(e.target.value) })}
                            />
                            <span className="font-black text-blue-600 w-12 text-right">{form.percentual}%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Data de Início</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={form.dataInicio}
                            onChange={e => setForm({ ...form, dataInicio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Previsão de Término</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={form.previsaoTermino}
                            onChange={e => setForm({ ...form, previsaoTermino: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Empresa Executora</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={form.empresa}
                            onChange={e => setForm({ ...form, empresa: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Imagem de Destaque / Projeto</label>
                        <div className="flex items-center gap-5">
                            {form.imagem && (
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                    <img src={form.imagem} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <label className="flex-1 flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all bg-gray-50 bg-opacity-50">
                                <FaFileUpload size={20} />
                                <div className="text-left">
                                    <p className="text-xs font-black uppercase tracking-widest">Alterar Foto da Obra</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase">PNG, JPG ou WEBP até 5MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                toast.loading("Enviando imagem...");
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const data = await res.json();
                                                toast.dismiss();
                                                if (data.url) {
                                                    setForm({ ...form, imagem: data.url });
                                                    toast.success("Imagem atualizada!");
                                                }
                                            } catch {
                                                toast.dismiss();
                                                toast.error("Falha no upload");
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave size={18} />}
                        {loading ? "Processando..." : "Salvar Alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
}
