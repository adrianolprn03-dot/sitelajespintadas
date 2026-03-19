"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaUpload, FaFileAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

const MODULOS = [
    { value: "servidores", label: "Servidores / Folha de Pagamento",
      campos: "nome, cargo, vinculo, secretaria, salarioBase, totalBruto, totalLiquido, mes, ano" },
    { value: "receitas", label: "Receitas Públicas",
      campos: "descricao, categoria, valor, mes, ano" },
    { value: "despesas", label: "Despesas Públicas",
      campos: "descricao, categoria, secretaria, valor, mes, ano" },
    { value: "diarias", label: "Diárias de Viagem",
      campos: "servidor, cargo, destino, motivo, dataInicio, dataFim, valor, quantidadeDias, secretaria, mes, ano" },
];

export default function ImportacaoCSVPage() {
    const [modulo, setModulo] = useState("servidores");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<{ total: number; sucesso: number; erros: number; mensagens: string[] } | null>(null);
    const selectedModulo = MODULOS.find(m => m.value === modulo)!;

    const handleImport = async () => {
        if (!file) return toast.error("Selecione um arquivo CSV.");
        setLoading(true);
        setResultado(null);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("modulo", modulo);
        try {
            const res = await fetch("/api/importacao/csv", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                setResultado(data);
                toast.success(`${data.sucesso} registros importados!`);
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
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUpload className="text-primary-500" /> Importação em Massa (CSV)
                </h1>
                <p className="text-gray-500 text-sm">Alimente os módulos de transparência com planilhas CSV.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuração */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Módulo de Destino</label>
                        <select value={modulo} onChange={e => setModulo(e.target.value)} className="input-field">
                            {MODULOS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-sm font-black text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FaFileAlt /> Colunas Esperadas
                        </h3>
                        <p className="text-xs text-blue-600 font-mono leading-relaxed">
                            {selectedModulo.campos}
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Arquivo CSV</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors">
                            <input
                                type="file" accept=".csv" id="csv-file"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            <label htmlFor="csv-file" className="cursor-pointer">
                                <FaUpload className="mx-auto text-3xl text-gray-300 mb-3" />
                                <p className="text-sm font-bold text-gray-500">
                                    {file ? file.name : "Clique para selecionar o arquivo .csv"}
                                </p>
                                {file && <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={loading || !file}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
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
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-black text-gray-700">{resultado.total}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-black text-green-600">{resultado.sucesso}</div>
                                    <div className="text-[10px] font-black text-green-400 uppercase tracking-widest">Sucesso</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-xl">
                                    <div className="text-2xl font-black text-red-600">{resultado.erros}</div>
                                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">Erros</div>
                                </div>
                            </div>
                            {resultado.mensagens?.length > 0 && (
                                <div className="space-y-2">
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
                            ⚠️ Instruções de Formatação
                        </h3>
                        <ul className="text-xs text-amber-800 space-y-2 font-medium">
                            <li>• A <strong>primeira linha</strong> do CSV deve conter os nomes das colunas.</li>
                            <li>• Use <strong>ponto e vírgula (;)</strong> como separador.</li>
                            <li>• Valores monetários: use ponto como decimal (ex: 1500.00).</li>
                            <li>• Datas: formato YYYY-MM-DD (ex: 2024-03-15).</li>
                            <li>• Meses e anos: somente o número (ex: 3, 2024).</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-4 text-sm">Módulos com CRUD Manual</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Receitas", href: "/admin/receitas" },
                                { label: "Despesas", href: "/admin/despesas" },
                                { label: "Servidores", href: "/admin/servidores" },
                                { label: "Diárias", href: "/admin/diarias" },
                                { label: "Obras", href: "/admin/obras" },
                                { label: "Conselhos", href: "/admin/conselhos" },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors text-center">
                                    {link.label} →
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
