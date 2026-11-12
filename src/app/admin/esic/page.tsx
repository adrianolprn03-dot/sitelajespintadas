"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    FaFile,
    FaSpinner,
    FaSearch,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaShieldAlt,
    FaLock,
    FaLockOpen,
    FaChartBar,
    FaPlus,
    FaFilePdf,
    FaExternalLinkAlt
} from "react-icons/fa";
import toast from "react-hot-toast";

type Esic = {
    id: string;
    protocolo: string;
    orgao: string;
    pedido: string;
    nome: string | null;
    status: string;
    grauSigilo: string;
    fundamentoSigilo?: string | null;
    criadoEm: string;
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    aberto: { label: "Aberto", color: "text-blue-600 bg-blue-50 border-blue-100", icon: FaClock },
    "em-analise": { label: "Em Análise", color: "text-orange-600 bg-orange-50 border-orange-100", icon: FaSpinner },
    concluido: { label: "Concluído", color: "text-green-600 bg-green-50 border-green-100", icon: FaCheckCircle },
    indeferido: { label: "Indeferido", color: "text-rose-600 bg-rose-50 border-rose-100", icon: FaExclamationTriangle }
};

export default function AdminEsicPage() {
    const [items, setItems] = useState<Esic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [aba, setAba] = useState<"pedidos" | "estatisticas" | "classificados" | "desclassificados" | "declaracoes">("pedidos");

    // Declarações & estatísticas
    const [declaracoes, setDeclaracoes] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [modalDeclaracao, setModalDeclaracao] = useState(false);
    const [modalClassificar, setModalClassificar] = useState(false);
    const [itemParaClassificar, setItemParaClassificar] = useState<Esic | null>(null);

    // Form declaração
    const [decModulo, setDecModulo] = useState("esic_desclassificadas");
    const [decCriterio, setDecCriterio] = useState("12.9");
    const [decAno, setDecAno] = useState("2026");
    const [decTexto, setDecTexto] = useState(
        "A Prefeitura Municipal de Lajes Pintadas/RN declara, nos termos do art. 30, inciso I da Lei Federal nº 12.527/2011 (LAI) e do critério 12.9 do PNTP, a inexistência de documentos ou informações desclassificadas no âmbito do Poder Executivo Municipal nos últimos 12 meses."
    );
    const [decFundamento, setDecFundamento] = useState("Art. 30, inciso I da Lei Federal nº 12.527/2011 (LAI).");
    const [decArquivo, setDecArquivo] = useState("");

    // Form classificar
    const [grau, setGrau] = useState("Reservado");
    const [fundamento, setFundamento] = useState("Art. 23, VIII da Lei Federal nº 12.527/2011");
    const [autoridade, setAutoridade] = useState("Comissão Permanente de Avaliação de Documentos Sigilosos");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPedidos, resRelatorios, resStats] = await Promise.all([
                fetch("/api/esic"),
                fetch("/api/admin/esic/relatorios"),
                fetch("/api/transparencia/esic-relatorios?tipo=estatisticas")
            ]);

            const dataPedidos = await resPedidos.json();
            const dataRelatorios = await resRelatorios.json();
            const dataStats = await resStats.json();

            setItems(dataPedidos || []);
            setDeclaracoes(dataRelatorios?.declaracoes || []);
            setStats(dataStats?.statsPorExercicio || []);
        } catch {
            toast.error("Erro ao carregar dados do e-SIC");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = items.filter(
        (i) =>
            i.protocolo.toLowerCase().includes(search.toLowerCase()) ||
            i.pedido.toLowerCase().includes(search.toLowerCase())
    );

    const handleSalvarDeclaracao = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/esic/relatorios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "declaracao",
                    modulo: decModulo,
                    criterioPntp: decCriterio,
                    exercicio: parseInt(decAno, 10),
                    textoDeclaracao: decTexto,
                    fundamentoLegal: decFundamento,
                    arquivoAssinadoUrl: decArquivo || null
                })
            });
            if (!res.ok) throw new Error("Erro ao salvar declaração");
            toast.success("Declaração oficial registrada com sucesso!");
            setModalDeclaracao(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao salvar");
        }
    };

    const handleSalvarClassificacao = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemParaClassificar) return;
        try {
            const res = await fetch("/api/admin/esic/relatorios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "classificar",
                    id: itemParaClassificar.id,
                    grauSigilo: grau,
                    fundamentoSigilo: fundamento,
                    autoridadeClassificadora: autoridade,
                    dataClassificacao: new Date().toISOString()
                })
            });
            if (!res.ok) throw new Error("Erro ao classificar");
            toast.success("Documento classificado com sucesso!");
            setModalClassificar(false);
            setItemParaClassificar(null);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao classificar");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaFile className="text-[#1254A3]" /> Gestão do e-SIC e Acesso à Informação
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Tramitação de pedidos, rol de informações classificadas (12.8), desclassificadas (12.9) e estatísticas anuais (12.7).
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setModalDeclaracao(true)}
                        className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors shadow-sm"
                    >
                        <FaShieldAlt /> Publicar Declaração Oficial
                    </button>
                </div>
            </div>

            {/* Abas */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setAba("pedidos")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        aba === "pedidos" ? "bg-[#1254A3] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                    Pedidos de Acesso ({items.length})
                </button>
                <button
                    onClick={() => setAba("estatisticas")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        aba === "estatisticas" ? "bg-[#1254A3] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                    <FaChartBar className="inline mr-1.5" /> Relatório Estatístico Anual (12.7)
                </button>
                <button
                    onClick={() => setAba("classificados")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        aba === "classificados" ? "bg-[#1254A3] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                    <FaLock className="inline mr-1.5" /> Rol de Classificados (12.8)
                </button>
                <button
                    onClick={() => setAba("desclassificados")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        aba === "desclassificados" ? "bg-[#1254A3] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                    <FaLockOpen className="inline mr-1.5" /> Rol de Desclassificados (12.9)
                </button>
                <button
                    onClick={() => setAba("declaracoes")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        aba === "declaracoes" ? "bg-[#1254A3] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                    <FaShieldAlt className="inline mr-1.5" /> Declarações Oficiais ({declaracoes.length})
                </button>
            </div>

            {/* ABA 1: PEDIDOS */}
            {aba === "pedidos" && (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative max-w-md">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por protocolo ou pedido..."
                                className="bg-white text-gray-700 w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all text-sm shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-5">Protocolo / Data</th>
                                    <th className="px-6 py-5">Órgão Solicitado</th>
                                    <th className="px-6 py-5">Cidadão</th>
                                    <th className="px-6 py-5">Sigilo</th>
                                    <th className="px-6 py-5">Situação</th>
                                    <th className="px-6 py-5 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <FaSpinner className="animate-spin inline-block text-[#1254A3] text-2xl" />
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                            Nenhum pedido registrado no momento.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((i) => {
                                        const config = statusConfig[i.status] || statusConfig["aberto"];
                                        return (
                                            <tr key={i.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-mono font-bold text-gray-700 text-sm">{i.protocolo}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {new Date(i.criadoEm).toLocaleDateString("pt-BR")}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[10px] font-black uppercase text-[#1254A3] tracking-tighter mb-1">
                                                        {i.orgao}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700 line-clamp-1">{i.pedido}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                                    {i.nome || <span className="text-gray-300 italic font-medium">Anônimo</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                                            i.grauSigilo === "Sem Sigilo"
                                                                ? "bg-gray-100 text-gray-600"
                                                                : "bg-rose-100 text-rose-800"
                                                        }`}
                                                    >
                                                        {i.grauSigilo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${config.color}`}
                                                    >
                                                        <config.icon size={10} className={i.status === "em-analise" ? "animate-spin" : ""} />
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setItemParaClassificar(i);
                                                            setModalClassificar(true);
                                                        }}
                                                        className="inline-flex items-center justify-center h-8 px-3 rounded-lg font-bold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 text-xs"
                                                    >
                                                        Sigilo
                                                    </button>
                                                    <Link
                                                        href={`/admin/esic/${i.id}`}
                                                        className="inline-flex items-center justify-center h-8 px-3 rounded-lg font-bold border border-gray-200 text-gray-600 bg-white hover:bg-[#1254A3] hover:text-white transition-all text-xs"
                                                    >
                                                        Responder
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ABA 2: ESTATÍSTICAS ANUAIS (12.7) */}
            {aba === "estatisticas" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Relatório Estatístico Anual Consolidado (12.7)</h2>
                        <p className="text-xs text-gray-500">
                            Base oficial calculada em conformidade com a LAI e os requisitos do PNTP 2026.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Exercício</th>
                                    <th className="p-4 text-center">Recebidos</th>
                                    <th className="p-4 text-center">Atendidos</th>
                                    <th className="p-4 text-center">Indeferidos</th>
                                    <th className="p-4 text-center">Em Tramitação</th>
                                    <th className="p-4 text-center">Taxa (%)</th>
                                    <th className="p-4 text-center">Pessoa Física</th>
                                    <th className="p-4 text-center">Pessoa Jurídica</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.map((s) => (
                                    <tr key={s.exercicio} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-[#1254A3]">{s.exercicio}</td>
                                        <td className="p-4 text-center font-bold">{s.totalRecebidos}</td>
                                        <td className="p-4 text-center text-emerald-700 font-bold">{s.atendidos}</td>
                                        <td className="p-4 text-center text-rose-700 font-bold">{s.indeferidos}</td>
                                        <td className="p-4 text-center text-amber-700 font-bold">{s.emTramitacao}</td>
                                        <td className="p-4 text-center text-emerald-700 font-bold">{s.taxaAtendimento}%</td>
                                        <td className="p-4 text-center">{s.perfilSolicitantes.pessoaFisica}</td>
                                        <td className="p-4 text-center">{s.perfilSolicitantes.pessoaJuridica}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ABA 3: ROL DE CLASSIFICADOS (12.8) */}
            {aba === "classificados" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-800">Rol de Informações Classificadas (12.8)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Protocolo</th>
                                    <th className="p-4">Órgão</th>
                                    <th className="p-4">Assunto</th>
                                    <th className="p-4">Grau de Sigilo</th>
                                    <th className="p-4">Fundamento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items
                                    .filter((i) => i.grauSigilo !== "Sem Sigilo")
                                    .map((i) => (
                                        <tr key={i.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono font-bold text-xs">{i.protocolo}</td>
                                            <td className="p-4 font-semibold text-xs">{i.orgao}</td>
                                            <td className="p-4 text-xs">{i.pedido}</td>
                                            <td className="p-4">
                                                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                                    {i.grauSigilo}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-600">{i.fundamentoSigilo || "Art. 23 e 24 da LAI"}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ABA 4: ROL DE DESCLASSIFICADOS (12.9) */}
            {aba === "desclassificados" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-800">Rol de Informações Desclassificadas nos Últimos 12 Meses (12.9)</h2>
                    <p className="text-xs text-gray-500">
                        Documentos cujo sigilo expirou ou foi extinto por reavaliação oficial.
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
                        <FaCheckCircle className="text-emerald-600 text-2xl mx-auto" />
                        <h3 className="text-sm font-bold text-emerald-900">Inexistência Declarada Formalmente</h3>
                        <p className="text-xs text-emerald-800 max-w-lg mx-auto">
                            Não houve desclassificações nos últimos 12 meses. A declaração oficial está devidamente publicada e validada perante o PNTP.
                        </p>
                    </div>
                </div>
            )}

            {/* ABA 5: DECLARAÇÕES */}
            {aba === "declaracoes" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">Declarações Oficiais de Acesso à Informação</h2>
                        <button
                            onClick={() => setModalDeclaracao(true)}
                            className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-600"
                        >
                            Nova Declaração
                        </button>
                    </div>

                    <div className="space-y-3">
                        {declaracoes.map((d) => (
                            <div key={d.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                                    <span>Critério {d.criterioPntp || d.modulo} • Exercício {d.exercicio}</span>
                                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Publicado</span>
                                </div>
                                <p className="text-xs text-gray-700 italic">“{d.textoDeclaracao}”</p>
                                <span className="text-[10px] text-gray-400 block">Autoridade: {d.responsavelNome}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Declaração */}
            {modalDeclaracao && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Publicar Declaração Oficial da LAI (PNTP)</h2>
                        <form onSubmit={handleSalvarDeclaracao} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Módulo / Critério</label>
                                    <select
                                        value={decModulo}
                                        onChange={(e) => {
                                            setDecModulo(e.target.value);
                                            setDecCriterio(e.target.value === "esic_classificadas" ? "12.8" : "12.9");
                                        }}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                    >
                                        <option value="esic_desclassificadas">12.9 - Desclassificadas (Inexistência)</option>
                                        <option value="esic_classificadas">12.8 - Classificadas (Inexistência)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Exercício</label>
                                    <input
                                        type="number"
                                        value={decAno}
                                        onChange={(e) => setDecAno(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Texto da Declaração</label>
                                <textarea
                                    value={decTexto}
                                    onChange={(e) => setDecTexto(e.target.value)}
                                    rows={4}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fundamento Legal</label>
                                <input
                                    type="text"
                                    value={decFundamento}
                                    onChange={(e) => setDecFundamento(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalDeclaracao(false)}
                                    className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600"
                                >
                                    Publicar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Classificar */}
            {modalClassificar && itemParaClassificar && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Classificação de Sigilo (LAI)</h2>
                        <p className="text-xs text-gray-500 font-mono">Protocolo: {itemParaClassificar.protocolo}</p>

                        <form onSubmit={handleSalvarClassificacao} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Grau de Sigilo</label>
                                <select
                                    value={grau}
                                    onChange={(e) => setGrau(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm font-bold"
                                >
                                    <option value="Reservado">Reservado (Até 5 anos)</option>
                                    <option value="Secreto">Secreto (Até 15 anos)</option>
                                    <option value="Ultrassecreto">Ultrassecreto (Até 25 anos)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fundamento Legal</label>
                                <input
                                    type="text"
                                    value={fundamento}
                                    onChange={(e) => setFundamento(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Autoridade Classificadora</label>
                                <input
                                    type="text"
                                    value={autoridade}
                                    onChange={(e) => setAutoridade(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalClassificar(false);
                                        setItemParaClassificar(null);
                                    }}
                                    className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-sm font-bold hover:bg-blue-800"
                                >
                                    Confirmar Classificação
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
