"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiSave } from "react-icons/fi";

export default function EditarLegislacaoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Form state
    const [tipo, setTipo] = useState("lei");
    const [numero, setNumero] = useState("");
    const [ano, setAno] = useState("");
    const [ementa, setEmenta] = useState("");
    const [arquivo, setArquivo] = useState("");
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        const fetchLegislacao = async () => {
            try {
                const res = await fetch(`/api/admin/legislacao/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTipo(data.tipo);
                    setNumero(data.numero);
                    setAno(data.ano.toString());
                    setEmenta(data.ementa);
                    setArquivo(data.arquivo || "");
                    setAtivo(data.ativo);
                } else {
                    alert("Legislação não encontrada.");
                    router.push("/admin/legislacao");
                }
            } catch (error) {
                console.error("Erro ao buscar:", error);
            } finally {
                setFetching(false);
            }
        };

        if (params.id) {
            fetchLegislacao();
        }
    }, [params.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!numero || !ano || !ementa) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/legislacao/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipo, numero, ano, ementa, arquivo, ativo }),
            });

            if (res.ok) {
                router.push("/admin/legislacao");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao atualizar legislação.");
            }
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar legislação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/legislacao" className="text-gray-500 hover:text-blue-600 transition-colors">
                    <FiArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Legislação</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo da Norma <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        >
                            <option value="lei">Lei</option>
                            <option value="decreto">Decreto</option>
                            <option value="portaria">Portaria</option>
                            <option value="resolucao">Resolução</option>
                            <option value="lei-organica">Lei Orgânica</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            placeholder="Ex: 123/2024 ou 123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ano <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                            min="1900"
                            max="2100"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ementa (Resumo) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={ementa}
                        onChange={(e) => setEmenta(e.target.value)}
                        placeholder="Descreve o assunto ou resumo da norma..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arquivo da Norma (PDF ou Imagem)
                    </label>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all bg-gray-50/50">
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-700">{arquivo ? "Arquivo anexado (Clique para trocar)" : "Clique para anexar arquivo (PDF ou Imagem)"}</p>
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
                                                setArquivo(data.url);
                                            }
                                        } catch {
                                            alert("Erro no upload");
                                        }
                                    }
                                }}
                            />
                        </label>
                        {arquivo && (
                            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md break-all">
                                <strong>Atual:</strong> {arquivo}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="ativo"
                        checked={ativo}
                        onChange={(e) => setAtivo(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                        Norma ativa (visível no portal da transparência)
                    </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/legislacao"
                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors mr-4"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FiSave />
                        )}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
