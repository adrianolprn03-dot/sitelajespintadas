"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovaLicitacaoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        objeto: "",
        modalidade: "",
        status: "aberta",
        dataAbertura: "",
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
            const res = await fetch("/api/licitacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Licitação cadastrada!");
                router.push("/admin/licitacoes");
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
                <Link href="/admin/licitacoes" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Licitação</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número do Processo *</label>
                        <input type="text" required className="input-field" placeholder="Ex: 015/2024" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Modalidade *</label>
                        <select required className="input-field" value={form.modalidade} onChange={e => setForm({ ...form, modalidade: e.target.value })}>
                            <option value="">Selecione...</option>
                            <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                            <option value="Dispensa">Dispensa</option>
                            <option value="Inexigibilidade">Inexigibilidade</option>
                            <option value="Concorrência">Concorrência</option>
                            <option value="Tomada de Preço">Tomada de Preço</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto da Licitação *</label>
                        <textarea required rows={3} className="input-field resize-none" placeholder="Descrição detalhada do objeto..." value={form.objeto} onChange={e => setForm({ ...form, objeto: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria / Orgão</label>
                        <select className="input-field" value={form.secretariaId} onChange={e => setForm({ ...form, secretariaId: e.target.value })}>
                            <option value="">Geral</option>
                            {secretarias.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Abertura *</label>
                        <input type="date" required className="input-field" value={form.dataAbertura} onChange={e => setForm({ ...form, dataAbertura: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="aberta">Aberta</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="finalizada">Finalizada</option>
                            <option value="deserta">Deserta</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Documentos / Anexos (PDF ou Imagem)</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 hover:text-amber-500 cursor-pointer transition-all bg-gray-50/50">
                                <FaFileUpload className="text-xl" />
                                <div className="text-center">
                                    <p className="text-sm font-bold">Clique para enviar um arquivo (PDF ou Imagem)</p>
                                    <p className="text-xs text-gray-400">Editais, anexos, provas escaneadas, certidões etc.</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".pdf, image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const data = await res.json();
                                                if (data.url) {
                                                    // Aqui estamos lidando com um array de documentos (em formato string JSON no banco)
                                                    const docsAtuais = JSON.parse((form as any).documentos || "[]");
                                                    const novosDocs = [...docsAtuais, { nome: file.name, url: data.url, data: new Date().toISOString() }];
                                                    setForm({ ...form, documentos: JSON.stringify(novosDocs) } as any);
                                                    toast.success("Arquivo enviado!");
                                                }
                                            } catch {
                                                toast.error("Erro no upload");
                                            }
                                        }
                                    }}
                                />
                            </label>

                            {JSON.parse((form as any).documentos || "[]").length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {JSON.parse((form as any).documentos || "[]").map((doc: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-red-500 text-lg">📄</span>
                                                <span className="text-xs font-medium text-gray-700 truncate">{doc.nome}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-red-500 p-1"
                                                onClick={() => {
                                                    const docs = JSON.parse((form as any).documentos);
                                                    docs.splice(index, 1);
                                                    setForm({ ...form, documentos: JSON.stringify(docs) } as any);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? "Salvando..." : "Salvar Licitação"}
                    </button>
                </div>
            </form>
        </div>
    );
}
