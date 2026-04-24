"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload, FaLink, FaExternalLinkAlt, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovaDiariaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
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
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8 bg-sky-600 hover:bg-sky-700 border-none">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Diária
                    </button>
                </div>
            </form>
        </div>
    );
}
