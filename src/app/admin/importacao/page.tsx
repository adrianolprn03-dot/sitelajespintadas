"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    FaUpload,
    FaFile,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHistory,
    FaSearch,
} from "react-icons/fa";
import Link from "next/link";

const MODULOS = [
    {
        value: "servidores",
        label: "Servidores / Folha de Pagamento (Critério 6.1)",
        campos: "nome;cargo;vinculo;secretaria;cargaHoraria;salarioBase;gratificacoes;descontos;totalBruto;totalLiquido;mes;ano",
    },
    {
        value: "receitas",
        label: "Receitas Públicas (Critério 3.1)",
        campos: "naturezaCodigo;descricao;categoria;valorPrevisto;valorAtualizado;valorLancado;valorArrecadado;fonte;mes;ano",
    },
    {
        value: "despesas",
        label: "Despesas Públicas - Empenho, Liquidação e Pagamento (Critério 4.1)",
        campos: "numeroEmpenho;dataEmpenho;descricao;categoria;secretaria;fornecedor;credorCpfCnpj;fonteRecurso;valorEmpenhado;valorLiquidado;valorPago;mes;ano",
    },
    {
        value: "diarias",
        label: "Diárias de Viagem (Critério 7.1)",
        campos: "servidor;cargo;destino;motivo;dataInicio;dataFim;valor;valorUnitario;quantidadeDias;secretaria;portariaConcessao;mes;ano",
    },
    {
        value: "medicamentos",
        label: "Estoque de Medicamentos SUS - Regra 15 Dias (Critério 13.4)",
        campos: "nome;principioAtivo;apresentacao;unidadeMedida;quantidadeEstoque;estoqueStatus;unidadeSaude",
    },
];

interface ImportResult {
    acao: string;
    colunasDetectadas: string[];
    total: number;
    sucesso: number;
    duplicados: number;
    erros: number;
    mensagens: string[];
    preview: Record<string, unknown>[];
}

interface ImportLog {
    id: string;
    tipo: string;
    nomeArquivo: string;
    sistemaOrigem?: string;
    registros: number;
    duplicadosIgnorados?: number;
    errosCount?: number;
    status: string;
    erros?: string;
    usuario?: string;
    criadoEm: string;
}

export default function ImportacaoCSVPage() {
    const [modulo, setModulo] = useState("servidores");
    const [sistemaOrigem, setSistemaOrigem] = useState("Sistema Contábil / Folha Oficial");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<ImportResult | null>(null);
    const [historico, setHistorico] = useState<ImportLog[]>([]);

    const selectedModulo = MODULOS.find((m) => m.value === modulo)!;

    const carregarHistorico = async () => {
        try {
            const res = await fetch("/api/importacao/csv");
            if (res.ok) {
                const data = await res.json();
                setHistorico(data.items || []);
            }
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        carregarHistorico();
    }, []);

    const handleProcessar = async (acao: "validar" | "importar") => {
        if (!file) return toast.error("Selecione um arquivo CSV.");
        setLoading(true);
        if (acao === "validar") setResultado(null);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("modulo", modulo);
        formData.append("acao", acao);
        formData.append("sistemaOrigem", sistemaOrigem);
        try {
            const res = await fetch("/api/importacao/csv", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                setResultado(data);
                if (acao === "validar") {
                    toast.success(`Pré-validação concluída: ${data.sucesso} linhas válidas, ${data.erros} com alerta.`);
                } else {
                    toast.success(`${data.sucesso} registros processados (${data.duplicados || 0} atualizados por deduplicação)!`);
                    carregarHistorico();
                }
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
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUpload className="text-primary-500" /> Importações e Integrações Estruturadas
                </h1>
                <p className="text-gray-500 text-sm">
                    Valide colunas, previna duplicidades por chave natural e registre a rastreabilidade da base de origem (PNTP 2026).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuração */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                    <div>
                        <label htmlFor="select-modulo" className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                            Módulo de Destino
                        </label>
                        <select
                            id="select-modulo"
                            value={modulo}
                            onChange={(e) => {
                                setModulo(e.target.value);
                                setResultado(null);
                            }}
                            className="input-field"
                        >
                            {MODULOS.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="input-origem" className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                            Sistema Oficial de Origem
                        </label>
                        <input
                            id="input-origem"
                            type="text"
                            value={sistemaOrigem}
                            onChange={(e) => setSistemaOrigem(e.target.value)}
                            placeholder="Ex: TopDown / Agili / SIAFIC / Hórus"
                            className="input-field"
                        />
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                        <h3 className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FaFile /> Cabeçalho CSV Esperado (separador ; ou ,)
                        </h3>
                        <p className="text-xs text-blue-700 font-mono break-all leading-relaxed">
                            {selectedModulo.campos}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="csv-file" className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">
                            Arquivo CSV
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary-400 transition-colors">
                            <input
                                type="file"
                                accept=".csv"
                                id="csv-file"
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] || null);
                                    setResultado(null);
                                }}
                                className="hidden"
                            />
                            <label htmlFor="csv-file" className="cursor-pointer block">
                                <FaUpload className="mx-auto text-3xl text-gray-300 mb-3" />
                                <p className="text-sm font-bold text-gray-600">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleProcessar("validar")}
                            disabled={loading || !file}
                            className="w-full py-3 px-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <FaSearch /> {loading ? "Validando..." : "1. Validar e Pré-visualizar"}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleProcessar("importar")}
                            disabled={loading || !file}
                            className="w-full btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                        >
                            <FaUpload /> {loading ? "Importando..." : "2. Confirmar Importação"}
                        </button>
                    </div>
                </div>

                {/* Resultado e Instruções */}
                <div className="space-y-6">
                    {resultado && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    {resultado.acao === "validar"
                                        ? "Relatório de Pré-Validação (Sem gravação)"
                                        : "Resultado da Importação Oficial"}
                                </h3>
                                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                    {resultado.acao}
                                </span>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <div className="text-xl font-black text-gray-700">{resultado.total}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase">Linhas</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-xl">
                                    <div className="text-xl font-black text-green-600">{resultado.sucesso}</div>
                                    <div className="text-[10px] font-black text-green-600 uppercase">Válidas</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                    <div className="text-xl font-black text-blue-600">{resultado.duplicados || 0}</div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase">Atualizadas</div>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-xl">
                                    <div className="text-xl font-black text-red-600">{resultado.erros}</div>
                                    <div className="text-[10px] font-black text-red-600 uppercase">Erros</div>
                                </div>
                            </div>

                            {resultado.preview?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                                        Amostra das Primeiras Linhas Detectadas:
                                    </p>
                                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-50 text-gray-600 font-bold">
                                                <tr>
                                                    {Object.keys(resultado.preview[0]).map((col) => (
                                                        <th key={col} className="px-3 py-2 border-b">
                                                            {col}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultado.preview.map((row, idx) => (
                                                    <tr key={idx} className="border-b last:border-none">
                                                        {Object.values(row).map((val, cIdx) => (
                                                            <td key={cIdx} className="px-3 py-1.5 text-gray-700">
                                                                {String(val ?? "")}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {resultado.mensagens?.length > 0 && (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {resultado.mensagens.map((m, i) => (
                                        <div
                                            key={i}
                                            className="text-xs text-red-700 flex items-start gap-2 p-2.5 bg-red-50 rounded-lg border border-red-100"
                                        >
                                            <FaExclamationTriangle className="shrink-0 mt-0.5" /> {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                        <h3 className="font-bold text-amber-800 mb-3 text-sm flex items-center gap-2">
                            Regras de Governança e Deduplicação (PNTP 2026)
                        </h3>
                        <ul className="text-xs text-amber-900 space-y-2 font-medium">
                            <li>• Suporta separador <strong>ponto e vírgula (;)</strong> ou <strong>vírgula (,)</strong>.</li>
                            <li>• Valores monetários aceitam padrão nacional (<code>1.500,00</code>) ou internacional (<code>1500.00</code>), sem erro de ponto flutuante.</li>
                            <li>• Registros já existentes na mesma competência/chave são <strong>atualizados sem duplicar</strong> linhas.</li>
                            <li>• Toda execução grava log auditável com usuário, arquivo, sistema de origem e contagem de falhas.</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-4 text-sm">Atalhos para Cadastros Estruturados</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                                { label: "Receitas", href: "/admin/receitas" },
                                { label: "Despesas", href: "/admin/despesas" },
                                { label: "Servidores", href: "/admin/servidores" },
                                { label: "Diárias", href: "/admin/diarias" },
                                { label: "Obras", href: "/admin/obras" },
                                { label: "Licitações", href: "/admin/licitacoes" },
                                { label: "Contratos", href: "/admin/contratos" },
                                { label: "Medicamentos", href: "/admin/saude/medicamentos" },
                                { label: "Painel PNTP", href: "/admin/pntp" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl transition-colors text-center"
                                >
                                    {link.label} →
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Histórico de Importações */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaHistory className="text-primary-500" /> Histórico Recente de Importações e Sincronizações
                </h2>
                {historico.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4">Nenhuma importação registrada até o momento.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                                <tr>
                                    <th className="px-4 py-3">Data/Hora</th>
                                    <th className="px-4 py-3">Módulo</th>
                                    <th className="px-4 py-3">Arquivo</th>
                                    <th className="px-4 py-3">Origem</th>
                                    <th className="px-4 py-3">Processados</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Responsável</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {historico.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-700">
                                            {new Date(item.criadoEm).toLocaleString("pt-BR")}
                                        </td>
                                        <td className="px-4 py-3 uppercase font-bold text-primary-700">{item.tipo}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.nomeArquivo}</td>
                                        <td className="px-4 py-3 text-gray-500">{item.sistemaOrigem || "CSV"}</td>
                                        <td className="px-4 py-3 font-bold text-gray-700">
                                            {item.registros} ok
                                            {item.duplicadosIgnorados ? ` (${item.duplicadosIgnorados} atualiz.)` : ""}
                                            {item.errosCount ? ` / ${item.errosCount} erros` : ""}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    item.status === "concluido"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.status === "parcial"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{item.usuario || "Sistema"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
