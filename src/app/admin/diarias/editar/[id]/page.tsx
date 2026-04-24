"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload, FaLink, FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditarDiariaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
    const [form, setForm] = useState({
        servidor: "",
        cargo: "",
        destino: "",
        motivo: "",
        dataInicio: "",
        dataFim: "",
        valor: "",
        quantidadeDias: "",
        secretaria: "",
        mes: "",
        ano: "",
        portariaUrl: "",
    });

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setForm({ ...form, portariaUrl: data.url });
                toast.success("Arquivo enviado com sucesso!");
            } else {
                toast.error("Erro no upload");
            }
        } catch (error) {
            toast.error("Erro ao enviar arquivo");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/diarias/${id}`);
                const data = await res.json();
                setForm({
                    servidor: data.servidor || "",
                    cargo: data.cargo || "",
                    destino: data.destino || "",
                    motivo: data.motivo || "",
                    dataInicio: data.dataInicio ? data.dataInicio.split('T')[0] : "",
                    dataFim: data.dataFim ? data.dataFim.split('T')[0] : "",
                    valor: data.valor?.toString() || "",
                    quantidadeDias: data.quantidadeDias?.toString() || "1",
                    secretaria: data.secretaria || "",
                    mes: data.mes?.toString() || "",
                    ano: data.ano?.toString() || "",
                    portariaUrl: data.portariaUrl || "",
                });
                if (data.portariaUrl && !data.portariaUrl.startsWith("http")) {
                    setUploadMode("file");
                } else if (data.portariaUrl && data.portariaUrl.startsWith("http")) {
                    setUploadMode("url");
                }
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
            const res = await fetch(`/api/diarias/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Diária atualizada!");
                router.push("/admin/diarias");
            }
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center"><FaSpinner className="animate-spin inline-block text-4xl text-sky-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/diarias" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Cancelar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Diária</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Servidor *</label>
                        <input type="text" required className="input-field" value={form.servidor} onChange={e => setForm({ ...form, servidor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo *</label>
                        <input type="text" required className="input-field" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo *</label>
                        <textarea required rows={3} className="input-field resize-none" value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Valor (R$) *</label>
                        <input type="number" step="0.01" required className="input-field" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Período</label>
                        <div className="flex gap-2">
                            <input type="date" required className="input-field" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                            <input type="date" required className="input-field" value={form.dataFim} onChange={e => setForm({ ...form, dataFim: e.target.value })} />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Portaria / Documento</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-3 w-fit">
                            <button 
                                type="button"
                                onClick={() => setUploadMode("url")}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${uploadMode === 'url' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FaLink /> Link Externo
                            </button>
                            <button 
                                type="button"
                                onClick={() => setUploadMode("file")}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${uploadMode === 'file' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FaFileUpload /> Upload PDF
                            </button>
                        </div>

                        {uploadMode === 'url' ? (
                            <input 
                                placeholder="https://..." 
                                value={form.portariaUrl} 
                                onChange={(e) => setForm({ ...form, portariaUrl: e.target.value })} 
                                className="input-field" 
                            />
                        ) : (
                            <div className="space-y-2">
                                {!form.portariaUrl ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-sky-400 transition-all cursor-pointer group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {uploading ? (
                                                <FaSpinner className="text-2xl text-sky-500 animate-spin" />
                                            ) : (
                                                <>
                                                    <FaFileUpload className="text-2xl text-gray-300 group-hover:text-sky-500 mb-2 transition-colors" />
                                                    <p className="text-xs font-bold text-gray-500 group-hover:text-sky-600 transition-colors">Selecionar arquivo PDF</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} disabled={uploading} />
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="bg-sky-600 p-2 rounded-lg text-white">
                                                <FaFileUpload />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-black uppercase text-sky-600 truncate">Arquivo Carregado</p>
                                                <p className="text-xs font-bold text-gray-600 truncate">{form.portariaUrl.split('/').pop()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={form.portariaUrl} target="_blank" className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors">
                                                <FaExternalLinkAlt size={12} />
                                            </a>
                                            <button type="button" onClick={() => setForm({ ...form, portariaUrl: "" })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <FaTrashAlt size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 bg-sky-600 hover:bg-sky-700 border-none">
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
