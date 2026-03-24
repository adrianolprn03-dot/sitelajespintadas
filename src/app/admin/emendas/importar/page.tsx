"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaUpload, FaFileAlt, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaDownload } from "react-icons/fa";

export default function ImportarEmendasPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<{
        total: number;
        importados: number;
        atualizados: number;
        erros: number;
        mensagens: string[];
    } | null>(null);

    const handleImport = async () => {
        if (!file) return toast.error("Selecione um arquivo CSV.");
        setLoading(true);
        setResultado(null);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/admin/emendas-parlamentares/import-csv", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setResultado(data);
                toast.success(`Importação concluída! ${data.importados} novos, ${data.atualizados} atualizados.`);
            } else {
                toast.error(data.error || "Erro na importação");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUpload className="text-emerald-500" /> Importar Emendas Parlamentares (CSV)
                    </h1>
                    <p className="text-gray-500 text-sm">Importe dados de emendas a partir de arquivo CSV do Portal da Transparência.</p>
                </div>
                <Link
                    href="/admin/emendas"
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <FaArrowLeft /> Voltar para Emendas
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-sm font-black text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FaFileAlt /> Colunas Esperadas no CSV
                        </h3>
                        <p className="text-xs text-blue-600 font-mono leading-relaxed">
                            codigo_emenda; ano_emenda; autor_nome; numero_emenda; tipo_emenda; objeto; funcao_governo; subfuncao_governo; localidade; uf; favorecido_nome; favorecido_cnpj_cpf; valor_previsto; valor_empenhado; valor_liquidado; valor_pago; situacao_execucao; orgao_concedente; instrumento_numero; plano_acao_numero; convenio_numero; url_fonte_oficial; fonte_dado
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Arquivo CSV</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-400 transition-colors">
                            <input
                                type="file"
                                accept=".csv"
                                id="csv-emendas"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            <label htmlFor="csv-emendas" className="cursor-pointer">
                                <FaUpload className="mx-auto text-3xl text-gray-300 mb-3" />
                                <p className="text-sm font-bold text-gray-500">
                                    {file ? file.name : "Clique para selecionar o arquivo .csv"}
                                </p>
                                {file && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                )}
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={loading || !file}
                        className="w-full bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaUpload /> {loading ? "Processando..." : "Importar Dados"}
                    </button>
                </div>

                {/* Resultado e Instruções */}
                <div className="space-y-6">
                    {resultado && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                                <FaCheckCircle className="text-green-500" /> Resultado da Importação
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-black text-gray-700">{resultado.total}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Lido</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-black text-green-600">{resultado.importados}</div>
                                    <div className="text-[10px] font-black text-green-400 uppercase tracking-widest">Importados</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-black text-blue-600">{resultado.atualizados}</div>
                                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Atualizados</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-xl">
                                    <div className="text-2xl font-black text-red-600">{resultado.erros}</div>
                                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Erros</div>
                                </div>
                            </div>
                            {resultado.mensagens?.length > 0 && (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {resultado.mensagens.map((m, i) => (
                                        <div key={i} className="text-xs text-red-600 flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                                            <FaExclamationTriangle className="shrink-0 mt-0.5" /> {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                        <h3 className="font-bold text-amber-700 mb-3 text-sm flex items-center gap-2">
                            ⚠️ Regras de Importação
                        </h3>
                        <ul className="text-xs text-amber-800 space-y-2 font-medium">
                            <li>• A <strong>primeira linha</strong> deve conter os nomes das colunas.</li>
                            <li>• Use <strong>ponto e vírgula (;)</strong> como separador.</li>
                            <li>• O campo <strong>codigo_emenda</strong> é obrigatório e serve como chave única.</li>
                            <li>• Se o <strong>codigo_emenda já existir</strong>, o registro será <strong>atualizado</strong>.</li>
                            <li>• Valores monetários: aceita <strong>1500.00</strong> ou <strong>1.500,00</strong>.</li>
                            <li>• Linhas totalmente vazias serão ignoradas.</li>
                        </ul>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="font-bold text-emerald-700 mb-3 text-sm flex items-center gap-2">
                            <FaDownload /> Exportar Dados Atuais
                        </h3>
                        <p className="text-xs text-emerald-700 mb-3">Baixe os dados de emendas já cadastrados no sistema.</p>
                        <a
                            href="/api/transparencia/emendas-parlamentares/export-csv"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                            <FaDownload /> Exportar CSV
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
