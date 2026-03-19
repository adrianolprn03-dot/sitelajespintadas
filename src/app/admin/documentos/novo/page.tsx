"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoDocumentoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        titulo: "",
        tipo: "loa",
        arquivo: "",
        ano: new Date().getFullYear().toString(),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/documentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    ano: parseInt(form.ano),
                }),
            });
            if (res.ok) {
                toast.success("Documento publicado!");
                router.push("/admin/documentos");
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
                <Link href="/admin/documentos" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Publicar Novo Documento</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Título do Documento *</label>
                        <input type="text" required className="input-field" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Lei Orçamentária Anual 2024" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Documento *</label>
                        <select required className="input-field" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                            <option value="loa">LOA - Lei Orçamentária Anual</option>
                            <option value="ldo">LDO - Lei de Diretrizes Orçamentárias</option>
                            <option value="ppa">PPA - Plano Plurianual</option>
                            <option value="rreo">RREO - Relat. Resumido Execução Orçamentária</option>
                            <option value="rgf">RGF - Relatório de Gestão Fiscal</option>
                            <option value="prestacao_contas">Prestação de Contas Anual</option>
                            <option value="parecer_tce">Parecer Prévio do TCE</option>
                            <option value="decreto">Decreto Municipal</option>
                            <option value="portaria">Portaria</option>
                            <option value="lei">Lei Municipal</option>
                            <option value="edital">Edital / Chamada Pública</option>
                            <option value="outros">Outros Documentos</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ano de Referência</label>
                        <input type="number" required className="input-field" value={form.ano} onChange={e => setForm({ ...form, ano: e.target.value })} />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Arquivo (PDF ou Imagem) *</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:text-primary-500 cursor-pointer transition-all bg-gray-50/50">
                                <FaFileUpload className="text-xl" />
                                <div className="text-center">
                                    <p className="text-sm font-bold">{form.arquivo ? "Trocar arquivo" : "Clique para enviar o arquivo (PDF ou Imagem)"}</p>
                                    <p className="text-xs text-gray-400">Leis, decretos, editais, fotos escaneadas, etc.</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".pdf, image/*"
                                    className="hidden"
                                    required={!form.arquivo}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const data = await res.json();
                                                if (data.url) {
                                                    setForm({ ...form, arquivo: data.url });
                                                    toast.success("Arquivo enviado!");
                                                }
                                            } catch {
                                                toast.error("Erro no upload");
                                            }
                                        }
                                    }}
                                />
                            </label>

                            {form.arquivo && (
                                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="text-blue-600 text-lg">📄</span>
                                        <span className="text-xs font-semibold text-blue-700 truncate">
                                            {form.arquivo.split('/').pop()}
                                        </span>
                                    </div>
                                    <a href={form.arquivo} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">Ver</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Publicar Documento
                    </button>
                </div>
            </form>
        </div>
    );
}
