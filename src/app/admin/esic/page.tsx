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
import AdminModal from "@/components/admin/AdminModal";

type Esic = {
    id: string;
    protocolo: string;
    orgao: string;
    pedido: string;
    nome: string | null;
    status: string;
    grauSigilo: string;
    fundamentoSigilo?: string | null;
    autoridadeClassificadora?: string | null;
    dataClassificacao?: string | null;
    dataDesclassificacao?: string | null;
    prazo?: string | null;
    resposta?: string | null;
    criadoEm: string;
};

function calcularPrazoExibicao(item: Esic) {
    const grau = (item.grauSigilo || "Reservado").toLowerCase();
    const anosLegal = grau.includes("ultrassecreto") ? 25 : grau.includes("secreto") ? 15 : 5;
    const base = item.dataClassificacao ? new Date(item.dataClassificacao) : new Date(item.criadoEm);
    if (item.protocolo.startsWith("CIDIC-") && item.prazo) {
        const dtPrazo = new Date(item.prazo);
        const diff = Math.max(1, Math.round((dtPrazo.getTime() - base.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));
        return `${Math.min(25, diff)} ano(s) • até ${dtPrazo.toLocaleDateString("pt-BR")}`;
    }
    const prev = new Date(base);
    prev.setFullYear(prev.getFullYear() + anosLegal);
    return `${anosLegal} anos • até ${prev.toLocaleDateString("pt-BR")}`;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    aberto: { label: "Aberto", color: "text-blue-600 bg-blue-50 border-blue-100", icon: FaClock },
    "em-analise": { label: "Em Análise", color: "text-orange-600 bg-orange-50 border-orange-100", icon: FaSpinner },
    concluido: { label: "Concluído", color: "text-green-600 bg-green-50 border-green-100", icon: FaCheckCircle },
    indeferido: { label: "Indeferido", color: "text-rose-600 bg-rose-50 border-rose-100", icon: FaExclamationTriangle }
};

export default function AdminEsicPage() {
    const [items, setItems] = useState<Esic[]>([]);
    const [classificados, setClassificados] = useState<Esic[]>([]);
    const [desclassificados, setDesclassificados] = useState<Esic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [aba, setAba] = useState<"pedidos" | "estatisticas" | "classificados" | "desclassificados" | "declaracoes">("pedidos");

    // Declarações & estatísticas
    const [declaracoes, setDeclaracoes] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [modalDeclaracao, setModalDeclaracao] = useState(false);
    const [modalClassificar, setModalClassificar] = useState(false);
    const [itemParaClassificar, setItemParaClassificar] = useState<Esic | null>(null);
    const [modalNovoDoc, setModalNovoDoc] = useState(false);
    const [modalDesclassificar, setModalDesclassificar] = useState(false);
    const [itemParaDesclassificar, setItemParaDesclassificar] = useState<Esic | null>(null);

    // Form declaração
    const [decModulo, setDecModulo] = useState("esic_desclassificadas");
    const [decCriterio, setDecCriterio] = useState("12.9");
    const [decAno, setDecAno] = useState("2026");
    const [decTexto, setDecTexto] = useState(
        "A Prefeitura Municipal de Lajes Pintadas/RN declara, nos termos do art. 30, inciso I da Lei Federal nº 12.527/2011 (LAI), a inexistência de documentos ou informações desclassificadas no âmbito do Poder Executivo Municipal nos últimos 12 meses."
    );
    const [decFundamento, setDecFundamento] = useState("Art. 30, inciso I da Lei Federal nº 12.527/2011 (LAI).");
    const [decArquivo, setDecArquivo] = useState("");

    // Form classificar pedido existente
    const [grau, setGrau] = useState("Reservado");
    const [fundamento, setFundamento] = useState("Art. 23, VIII da Lei Federal nº 12.527/2011");
    const [autoridade, setAutoridade] = useState("Comissão Permanente de Avaliação de Documentos Sigilosos");

    // Form registrar documento classificado avulso
    const [docAssunto, setDocAssunto] = useState("");
    const [docCategoria, setDocCategoria] = useState("Processo Administrativo");
    const [docOrgao, setDocOrgao] = useState("Secretaria Municipal de Administração");
    const [docGrau, setDocGrau] = useState("Reservado");
    const [docFundamento, setDocFundamento] = useState("Art. 23, inciso VIII, da Lei Federal nº 12.527/2011");
    const [docPrazoAnos, setDocPrazoAnos] = useState("5");
    const [docAutoridade, setDocAutoridade] = useState("Autoridade Competente / Controladoria Geral");
    const [docData, setDocData] = useState(() => new Date().toISOString().slice(0, 10));

    // Form desclassificar
    const [justificativaDesc, setJustificativaDesc] = useState("");
    const [dataDesc, setDataDesc] = useState(() => new Date().toISOString().slice(0, 10));

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

            const listaPedidos: Esic[] = Array.isArray(dataPedidos) ? dataPedidos : [];
            setItems(listaPedidos.filter((p) => !p.protocolo.startsWith("CIDIC-")));
            setDeclaracoes(dataRelatorios?.declaracoes || []);
            setClassificados(
                dataRelatorios?.classificados ||
                    listaPedidos.filter((p) => p.grauSigilo !== "Sem Sigilo" && !p.dataDesclassificacao)
            );
            setDesclassificados(dataRelatorios?.desclassificados || []);
            setStats(dataStats?.stats || dataStats?.statsPorExercicio || []);
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

    const handleRegistrarDocumentoClassificado = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/esic/relatorios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "registrar_documento_classificado",
                    assunto: docAssunto,
                    categoria: docCategoria,
                    orgao: docOrgao,
                    grauSigilo: docGrau,
                    fundamentoSigilo: docFundamento,
                    prazoAnos: Number(docPrazoAnos),
                    autoridadeClassificadora: docAutoridade,
                    dataClassificacao: docData
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao registrar documento");
            toast.success("Documento classificado publicado no Rol Oficial!");
            setModalNovoDoc(false);
            setDocAssunto("");
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao registrar documento");
        }
    };

    const handleConfirmarDesclassificacao = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemParaDesclassificar) return;
        try {
            const res = await fetch("/api/admin/esic/relatorios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipoOperacao: "desclassificar",
                    id: itemParaDesclassificar.id,
                    dataDesclassificacao: dataDesc,
                    justificativa: justificativaDesc
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao desclassificar");
            toast.success("Informação desclassificada e movida para o rol dos últimos 12 meses!");
            setModalDesclassificar(false);
            setItemParaDesclassificar(null);
            setJustificativaDesc("");
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Erro ao desclassificar");
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

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setModalNovoDoc(true)}
                        className="flex items-center gap-2 bg-[#1254A3] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm"
                    >
                        <FaPlus /> Registrar Documento Classificado
                    </button>
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
                    <FaLock className="inline mr-1.5" /> Rol de Classificados ({classificados.length})
                </button>
                <button
                    onClick={() => setAba("desclassificados")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        aba === "desclassificados" ? "bg-[#1254A3] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                >
                    <FaLockOpen className="inline mr-1.5" /> Rol de Desclassificados ({desclassificados.length})
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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Rol de Informações Classificadas (12.8)</h2>
                            <p className="text-xs text-gray-500">
                                Documentos com restrição de acesso nos graus Reservado, Secreto ou Ultrassecreto.
                            </p>
                        </div>
                        <button
                            onClick={() => setModalNovoDoc(true)}
                            className="bg-[#1254A3] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-blue-800 flex items-center gap-1.5"
                        >
                            <FaPlus /> Registrar Documento Classificado
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="p-4">Código / Protocolo</th>
                                    <th className="p-4">Categoria / Órgão</th>
                                    <th className="p-4">Assunto</th>
                                    <th className="p-4">Grau de Sigilo</th>
                                    <th className="p-4">Dispositivo Legal</th>
                                    <th className="p-4">Prazo Legal</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classificados.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-400 text-xs">
                                            Nenhum documento classificado em grau de sigilo ativo no momento.
                                        </td>
                                    </tr>
                                ) : (
                                    classificados.map((i) => (
                                        <tr key={i.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono font-bold text-xs text-[#1254A3] whitespace-nowrap">{i.protocolo}</td>
                                            <td className="p-4 font-semibold text-xs text-gray-700">{i.orgao}</td>
                                            <td className="p-4 text-xs text-gray-700 max-w-xs">{i.pedido}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                                    {i.grauSigilo}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-600">{i.fundamentoSigilo || "Art. 23 e 24 da LAI"}</td>
                                            <td className="p-4 text-xs text-gray-600 whitespace-nowrap">{calcularPrazoExibicao(i)}</td>
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        setItemParaDesclassificar(i);
                                                        setModalDesclassificar(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                                >
                                                    <FaLockOpen size={11} /> Desclassificar
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

            {/* ABA 4: ROL DE DESCLASSIFICADOS (12.9) */}
            {aba === "desclassificados" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Rol de Informações Desclassificadas nos Últimos 12 Meses (12.9)</h2>
                            <p className="text-xs text-gray-500">
                                Documentos cujo sigilo expirou ou foi extinto por reavaliação oficial nos últimos 12 meses.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setDecModulo("esic_desclassificadas");
                                setDecCriterio("12.9");
                                setModalDeclaracao(true);
                            }}
                            className="bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-amber-600"
                        >
                            Atualizar Declaração Oficial
                        </button>
                    </div>

                    {desclassificados.length === 0 ? (
                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
                            <FaCheckCircle className="text-emerald-600 text-2xl mx-auto" />
                            <h3 className="text-sm font-bold text-emerald-900">Nenhuma Desclassificação Registrada</h3>
                            <p className="text-xs text-emerald-800 max-w-lg mx-auto">
                                Não há registros de informações desclassificadas no banco nos últimos 12 meses. A declaração formal de não ocorrência permanece publicada no portal.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="p-4">Protocolo / Código</th>
                                        <th className="p-4">Categoria / Órgão</th>
                                        <th className="p-4">Assunto</th>
                                        <th className="p-4">Grau Anterior</th>
                                        <th className="p-4">Data Desclassificação</th>
                                        <th className="p-4">Ato / Dispositivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {desclassificados.map((d) => {
                                        const dtDesc = d.dataDesclassificacao ? new Date(d.dataDesclassificacao) : null;
                                        const ha12m = new Date();
                                        ha12m.setMonth(ha12m.getMonth() - 12);
                                        const dentro12m = dtDesc ? dtDesc >= ha12m : false;
                                        return (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="p-4 font-mono font-bold text-xs text-emerald-700 whitespace-nowrap">
                                                    {d.protocolo}
                                                    {dentro12m && (
                                                        <span className="block mt-1 text-[10px] font-sans bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded w-fit">
                                                            Últimos 12 meses
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-xs font-semibold text-gray-700">{d.orgao}</td>
                                                <td className="p-4 text-xs text-gray-700 max-w-xs">{d.pedido}</td>
                                                <td className="p-4 text-xs font-bold text-gray-700">{d.grauSigilo}</td>
                                                <td className="p-4 text-xs font-bold text-emerald-700 whitespace-nowrap">
                                                    {dtDesc ? dtDesc.toLocaleDateString("pt-BR") : "—"}
                                                </td>
                                                <td className="p-4 text-xs text-gray-600 max-w-xs">
                                                    {d.resposta || d.fundamentoSigilo || "Término de prazo / reavaliação"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
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
            <AdminModal
                open={modalDeclaracao}
                onClose={() => setModalDeclaracao(false)}
                title="Publicar Declaração Oficial da LAI (PNTP)"
                maxWidth="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setModalDeclaracao(false)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-esic-declaracao"
                            className="px-5 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors"
                        >
                            Publicar
                        </button>
                    </div>
                }
            >
                <form id="form-esic-declaracao" onSubmit={handleSalvarDeclaracao} className="space-y-4">
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
                </form>
            </AdminModal>

            {/* Modal Classificar */}
            <AdminModal
                open={Boolean(modalClassificar && itemParaClassificar)}
                onClose={() => {
                    setModalClassificar(false);
                    setItemParaClassificar(null);
                }}
                title="Classificação de Sigilo (LAI)"
                description={itemParaClassificar ? `Protocolo: ${itemParaClassificar.protocolo}` : undefined}
                maxWidth="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setModalClassificar(false);
                                setItemParaClassificar(null);
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-esic-classificar"
                            className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors"
                        >
                            Confirmar Classificação
                        </button>
                    </div>
                }
            >
                {itemParaClassificar && (
                    <form id="form-esic-classificar" onSubmit={handleSalvarClassificacao} className="space-y-4">
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
                    </form>
                )}
            </AdminModal>

            {/* Modal Novo Documento Classificado */}
            <AdminModal
                open={modalNovoDoc}
                onClose={() => setModalNovoDoc(false)}
                title="Registrar Documento Classificado em Grau de Sigilo"
                description="Publique documentos administrativos classificados conforme a Lei Federal nº 12.527/2011 (Art. 24 e Art. 30, II)."
                maxWidth="xl"
                footer={
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setModalNovoDoc(false)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-esic-novo-doc"
                            className="px-5 py-2 bg-[#1254A3] text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors"
                        >
                            Publicar no Rol Classificado
                        </button>
                    </div>
                }
            >
                <form id="form-esic-novo-doc" onSubmit={handleRegistrarDocumentoClassificado} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Assunto sobre o qual versa a informação *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={docAssunto}
                                    onChange={(e) => setDocAssunto(e.target.value)}
                                    placeholder="Ex: Relatório de auditoria interna sobre segurança cibernética da rede municipal..."
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoria *</label>
                                    <select
                                        value={docCategoria}
                                        onChange={(e) => setDocCategoria(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm font-semibold"
                                    >
                                        <option value="Processo Administrativo">Processo Administrativo</option>
                                        <option value="Segurança Institucional">Segurança Institucional</option>
                                        <option value="Recursos Humanos e Pessoal">Recursos Humanos e Pessoal</option>
                                        <option value="Finanças e Tributação">Finanças e Tributação</option>
                                        <option value="Licitações e Contratos">Licitações e Contratos</option>
                                        <option value="Saúde Pública">Saúde Pública</option>
                                        <option value="Projetos e Pesquisas">Projetos e Pesquisas</option>
                                        <option value="Outras Informações">Outras Informações</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Órgão / Secretaria *</label>
                                    <input
                                        type="text"
                                        required
                                        value={docOrgao}
                                        onChange={(e) => setDocOrgao(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Grau de Sigilo *</label>
                                    <select
                                        value={docGrau}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setDocGrau(val);
                                            setDocPrazoAnos(val === "Ultrassecreto" ? "25" : val === "Secreto" ? "15" : "5");
                                        }}
                                        className="w-full border rounded-xl p-2.5 text-sm font-bold"
                                    >
                                        <option value="Reservado">Reservado (até 5 anos)</option>
                                        <option value="Secreto">Secreto (até 15 anos)</option>
                                        <option value="Ultrassecreto">Ultrassecreto (até 25 anos)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prazo (Anos) *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={docGrau === "Ultrassecreto" ? 25 : docGrau === "Secreto" ? 15 : 5}
                                        value={docPrazoAnos}
                                        onChange={(e) => setDocPrazoAnos(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Data Classificação *</label>
                                    <input
                                        type="date"
                                        value={docData}
                                        onChange={(e) => setDocData(e.target.value)}
                                        className="w-full border rounded-xl p-2.5 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Dispositivo Legal que Fundamenta a Classificação *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={docFundamento}
                                    onChange={(e) => setDocFundamento(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Autoridade Classificadora *</label>
                                <input
                                    type="text"
                                    required
                                    value={docAutoridade}
                                    onChange={(e) => setDocAutoridade(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                />
                            </div>
                </form>
            </AdminModal>

            {/* Modal Desclassificar Informação */}
            <AdminModal
                open={Boolean(modalDesclassificar && itemParaDesclassificar)}
                onClose={() => {
                    setModalDesclassificar(false);
                    setItemParaDesclassificar(null);
                }}
                title="Registrar Desclassificação (LAI)"
                description={
                    itemParaDesclassificar
                        ? `Protocolo: ${itemParaDesclassificar.protocolo} (${itemParaDesclassificar.grauSigilo})`
                        : undefined
                }
                maxWidth="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setModalDesclassificar(false);
                                setItemParaDesclassificar(null);
                            }}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="form-esic-desclassificar"
                            className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                        >
                            Confirmar Desclassificação
                        </button>
                    </div>
                }
            >
                {itemParaDesclassificar && (
                    <form id="form-esic-desclassificar" onSubmit={handleConfirmarDesclassificacao} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Data da Desclassificação *</label>
                                <input
                                    type="date"
                                    required
                                    value={dataDesc}
                                    onChange={(e) => setDataDesc(e.target.value)}
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Ato / Motivo da Desclassificação *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={justificativaDesc}
                                    onChange={(e) => setJustificativaDesc(e.target.value)}
                                    placeholder="Ex: Término do prazo legal de sigilo ou Portaria de Reavaliação nº .../2026."
                                    className="w-full border rounded-xl p-2.5 text-sm"
                                />
                            </div>
                    </form>
                )}
            </AdminModal>
        </div>
    );
}
