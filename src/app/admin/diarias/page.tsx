"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaPlane, 
    FaCalendarAlt, FaShieldAlt, FaFilePdf, FaCheckCircle, FaExternalLinkAlt, FaStamp
} from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import toast from "react-hot-toast";
import { HISTORICO_DIARIAS, HistoricoTabelaDiaria } from "@/lib/diarias-historico";

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    valor: number;
    mes: number;
    ano: number;
};

export default function AdminDiariasPage() {
    const [aba, setAba] = useState<"concessoes" | "tabela" | "declaracoes">("concessoes");
    const [items, setItems] = useState<Diaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [anoTabelaSelecionado, setAnoTabelaSelecionado] = useState<number>(2026);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/diarias");
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            toast.error("Erro ao carregar diárias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Excluir esta diária?")) return;
        try {
            const res = await fetch(`/api/diarias/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Excluída com sucesso");
                fetchData();
            }
        } catch {
            toast.error("Erro ao excluir");
        }
    };

    const filtered = items.filter(i =>
        i.servidor.toLowerCase().includes(search.toLowerCase()) ||
        i.destino.toLowerCase().includes(search.toLowerCase())
    );

    const tabelaAtual = HISTORICO_DIARIAS.find(h => h.ano === anoTabelaSelecionado) || HISTORICO_DIARIAS[0];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#12304A] flex items-center gap-2">
                        <FaPlane className="text-[#1254A3]" /> Gestão de Diárias e Indenizações de Viagem
                    </h1>
                    <p className="text-[#5B738B] text-sm">
                        Concessões individuais, tabelas de valores fixados (2021 a 2026) e declarações oficiais de não regulamentação.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link 
                        href="/admin/diarias/novo" 
                        className="btn-primary flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] border-none text-xs font-bold"
                    >
                        <FaPlus /> Nova Diária Concedida
                    </Link>
                </div>
            </div>

            {/* Abas Superiores */}
            <div className="bg-white rounded-2xl border border-[#DDE3EA] p-2 shadow-sm flex flex-wrap gap-2">
                <button
                    onClick={() => setAba("concessoes")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        aba === "concessoes"
                            ? "bg-[#1254A3] text-white shadow-sm"
                            : "text-[#5B738B] hover:bg-[#F5F7FA]"
                    }`}
                >
                    <FaPlane size={13} />
                    <span>Concessões de Diárias ({items.length})</span>
                </button>

                <button
                    onClick={() => setAba("tabela")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        aba === "tabela"
                            ? "bg-[#1254A3] text-white shadow-sm"
                            : "text-[#5B738B] hover:bg-[#F5F7FA]"
                    }`}
                >
                    <FaBuildingColumns size={13} />
                    <span>Tabela de Valores por Exercício (2021–2026)</span>
                </button>

                <button
                    onClick={() => setAba("declaracoes")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        aba === "declaracoes"
                            ? "bg-[#1254A3] text-white shadow-sm"
                            : "text-[#5B738B] hover:bg-[#F5F7FA]"
                    }`}
                >
                    <FaStamp size={13} />
                    <span>Declarações Formais de Não Regulamentação ({HISTORICO_DIARIAS.length})</span>
                </button>
            </div>

            {/* CONTEÚDO DA ABA 1: CONCESSÕES */}
            {aba === "concessoes" && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#DDE3EA] overflow-hidden">
                    <div className="p-4 border-b border-[#DDE3EA] bg-[#F8FAFC]">
                        <div className="relative max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por servidor ou destino..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-[#DDE3EA] rounded-xl text-xs font-medium text-[#12304A] outline-none focus:border-[#1254A3]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-[#F8FAFC] text-[#5B738B] text-[10px] font-black uppercase tracking-widest border-b border-[#DDE3EA]">
                                    <th className="px-6 py-4">Servidor / Cargo</th>
                                    <th className="px-6 py-4">Destino</th>
                                    <th className="px-6 py-4">Ref.</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DDE3EA]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#5B738B]">
                                            <FaSpinner className="animate-spin inline-block text-[#1254A3] text-2xl" />
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[#5B738B]">
                                            Nenhuma concessão de diária localizada.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#12304A]">
                                                {item.servidor}
                                                <div className="text-[10px] font-normal text-[#5B738B]">{item.cargo}</div>
                                            </td>
                                            <td className="px-6 py-4 text-[#12304A] font-medium">{item.destino}</td>
                                            <td className="px-6 py-4 text-[#5B738B]">
                                                {item.mes}/{item.ano}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-[#1254A3]">
                                                {formatCurrency(item.valor)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Excluir diária"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CONTEÚDO DA ABA 2: TABELAS DE VALORES HISTÓRICOS */}
            {aba === "tabela" && (
                <div className="space-y-6">
                    {/* Seletor de Anos */}
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="text-xs font-black uppercase tracking-wider text-[#1254A3]">
                                Exercício Selecionado
                            </div>
                            <div className="text-base font-bold text-[#12304A]">
                                Tabela e Legislação do Ano {tabelaAtual.ano}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {HISTORICO_DIARIAS.map((h) => (
                                <button
                                    key={h.ano}
                                    onClick={() => setAnoTabelaSelecionado(h.ano)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        h.ano === anoTabelaSelecionado
                                            ? "bg-[#1254A3] text-white shadow-sm"
                                            : "bg-[#F5F7FA] text-[#12304A] hover:bg-slate-200 border border-[#DDE3EA]"
                                    }`}
                                >
                                    {h.ano} {h.vigente && "(Vigente)"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resumo da Norma */}
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-black uppercase text-[#1254A3] block mb-1">
                                Base Legal Aplicável
                            </span>
                            <h3 className="text-base font-black text-[#12304A]">{tabelaAtual.normaLegal}</h3>
                            <p className="text-xs text-[#5B738B] mt-0.5">{tabelaAtual.ementaNorma}</p>
                        </div>
                        <Link
                            href={tabelaAtual.linkNorma}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1254A3] hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
                        >
                            <span>Ver Ato Normativo</span>
                            <FaExternalLinkAlt size={10} />
                        </Link>
                    </div>

                    {/* Tabela de Valores */}
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-[#1254A3] text-white font-extrabold uppercase text-[10px] tracking-wider">
                                        <th className="py-3 px-6">Cargo / Função</th>
                                        <th className="py-3 px-4 text-center">Natal / Caicó / Mossoró</th>
                                        <th className="py-3 px-4 text-center">Demais Cidades (RN)</th>
                                        <th className="py-3 px-4 text-center">Outros Estados</th>
                                        <th className="py-3 px-4 text-center">Brasília / DF</th>
                                        <th className="py-3 px-4 text-center bg-[#0d4282]">Internacional</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#DDE3EA]">
                                    {tabelaAtual.valores.map((v, i) => (
                                        <tr key={v.cargo} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                                            <td className="py-3 px-6 font-bold text-[#12304A]">{v.cargo}</td>
                                            <td className="py-3 px-4 text-center font-bold text-[#1254A3]">{formatCurrency(v.estadual)}</td>
                                            <td className="py-3 px-4 text-center font-medium text-[#12304A]">{formatCurrency(v.interior)}</td>
                                            <td className="py-3 px-4 text-center font-medium text-[#12304A]">{formatCurrency(v.outrosEstados)}</td>
                                            <td className="py-3 px-4 text-center font-black text-emerald-700 bg-emerald-50/30">{formatCurrency(v.brasilia)}</td>
                                            <td className="py-3 px-4 text-center text-[10px] text-amber-800 font-bold bg-amber-50/40">{v.internacional}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTEÚDO DA ABA 3: DECLARAÇÕES FORMAIS */}
            {aba === "declaracoes" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <FaStamp size={16} />
                            </div>
                            <h2 className="text-lg font-black text-[#12304A]">
                                Registro de Declarações Oficiais de Não Ocorrência & Inexistência de Norma
                            </h2>
                        </div>
                        <p className="text-xs text-[#5B738B] leading-relaxed">
                            Conforme preceitua a Cartilha PNTP 2026 (Critério 7.2), o município deve declarar formalmente a inexistência de regulamentação para viagens ao exterior e a não ocorrência de pagamentos de diárias internacionais em cada exercício fiscal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {HISTORICO_DIARIAS.map((h) => {
                            const d = h.declaracaoNaoRegulamentacao;
                            return (
                                <div key={h.ano} className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between border-b border-[#DDE3EA] pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-[#1254A3] text-white font-black text-xs">
                                                Ano {h.ano}
                                            </span>
                                            <span className="text-[11px] font-bold text-[#5B738B]">
                                                {d.protocolo}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                            <FaCheckCircle size={10} /> {d.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-[#12304A] mb-1">{d.titulo}</h4>
                                        <p className="text-xs text-[#5B738B] leading-relaxed">{d.texto}</p>
                                    </div>

                                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] text-amber-950 font-bold">
                                        {d.declaracaoNaoOcorrencia}
                                    </div>

                                    <div className="pt-2 text-[10px] text-[#5B738B] flex flex-col gap-0.5 border-t border-slate-100">
                                        <span><strong>Emissor:</strong> {d.orgaoEmissor}</span>
                                        <span><strong>Responsável:</strong> {d.responsavel} ({d.cargoResponsavel})</span>
                                        <span><strong>Data:</strong> {d.dataEmissao} · Fundamento: {d.fundamentoLegal}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
