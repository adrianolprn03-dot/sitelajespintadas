"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
    FaSearch,
    FaSpinner,
    FaFile,
    FaLock,
    FaExclamationTriangle,
    FaCheckCircle,
    FaPaperclip,
    FaClock,
    FaHistory,
} from "react-icons/fa";
import toast from "react-hot-toast";

type ProtocolData = {
    protocolo: string;
    status: string;
    pedido?: string;
    descricao?: string;
    orgao?: string;
    tipo?: string;
    resposta?: string;
    respondidoEm?: string;
    criadoEm: string;
    prazo?: string;
    prorrogado?: boolean;
    justificativaProrrogacao?: string;
    justificativaPrazo?: string;
    anexoResposta?: string;
    recurso?: string;
    dataRecurso?: string;
    respostaRecurso?: string;
    dataRespostaRecurso?: string;
    recursoSegundaInstancia?: string;
    dataRecursoSegunda?: string;
    respostaRecursoSegunda?: string;
    dataRespostaSegunda?: string;
    historicoTramitacao?: string;
    formaRetorno?: string;
};

export default function ConsultaProtocoloPage() {
    const [protocolo, setProtocolo] = useState("");
    const [verificador, setVerificador] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any | null>(null);
    const [tipoBusca, setTipoBusca] = useState<"ouvidoria" | "esic" | null>(null);

    const [showRecursoForm, setShowRecursoForm] = useState(false);
    const [recursoText, setRecursoText] = useState("");
    const [sendingRecurso, setSendingRecurso] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!protocolo.trim()) return;

        setLoading(true);
        setData(null);
        setTipoBusca(null);
        setShowRecursoForm(false);

        try {
            const params = new URLSearchParams({ protocolo: protocolo.trim() });
            if (verificador.trim()) params.set("verificador", verificador.trim());

            const res = await fetch(`/api/consulta?${params.toString()}`);
            const result = await res.json();

            if (res.ok) {
                setData(result.data);
                setTipoBusca(result.tipoBusca);
            } else {
                toast.error(result.error || "Protocolo não encontrado no sistema.");
            }
        } catch {
            toast.error("Erro interno. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    const isSegundaInstanciaDisponivel =
        tipoBusca === "esic" && Boolean(data?.respostaRecurso) && !data?.recursoSegundaInstancia;

    const handleSendRecurso = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recursoText.trim()) return;

        const instancia = isSegundaInstanciaDisponivel ? 2 : 1;
        setSendingRecurso(true);
        try {
            const res = await fetch(`/api/consulta/recurso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    protocolo: data?.protocolo,
                    recurso: recursoText.trim(),
                    tipoBusca,
                    instancia,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(`Recurso em ${instancia}ª instância submetido com sucesso.`);
                if (instancia === 2) {
                    setData({
                        ...data!,
                        status: "em-recurso",
                        recursoSegundaInstancia: recursoText.trim(),
                        dataRecursoSegunda: new Date().toISOString(),
                    });
                } else {
                    setData({
                        ...data!,
                        status: "em-recurso",
                        recurso: recursoText.trim(),
                        dataRecurso: new Date().toISOString(),
                    });
                }
                setRecursoText("");
                setShowRecursoForm(false);
            } else {
                toast.error(result.error || "Erro ao enviar recurso.");
            }
        } catch {
            toast.error("Erro interno ao enviar recurso.");
        } finally {
            setSendingRecurso(false);
        }
    };

    const canFileAppeal =
        (data?.status === "concluido" && !data?.recurso) || isSegundaInstanciaDisponivel;

    const statusMap: Record<string, { label: string; color: string }> = {
        aberto: { label: "Aguardando Análise", color: "bg-gray-100 text-gray-700 border-gray-200" },
        "em-analise": { label: "Em Análise Setorial", color: "bg-blue-100 text-blue-800 border-blue-200" },
        concluido: { label: "Respondido", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        "em-recurso": { label: "Em Recurso (Em Julgamento)", color: "bg-orange-100 text-orange-800 border-orange-200" },
        encerrado: { label: "Encerrado / Julgado", color: "bg-purple-100 text-purple-800 border-purple-200" },
    };

    const currentStatusLabel = data?.status ? statusMap[data.status]?.label || data.status : "Desconhecido";
    const currentStatusColor = data?.status
        ? statusMap[data.status]?.color || "bg-gray-100 text-gray-600"
        : "bg-gray-100 text-gray-600";

    let tramitacoes: Array<{ data: string; evento: string; detalhe?: string }> = [];
    if (data?.historicoTramitacao) {
        try {
            const parsed = JSON.parse(data.historicoTramitacao);
            if (Array.isArray(parsed)) tramitacoes = parsed;
        } catch {
            tramitacoes = [];
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <PageHeader
                title="Consulta de Protocolo"
                subtitle="Acompanhe o andamento das suas solicitações no e-SIC e Ouvidoria com proteção de dados pessoais (LGPD)."
                breadcrumbs={[{ label: "Serviços", href: "/servicos" }, { label: "Consulta de Protocolo" }]}
            />

            <section className="flex-grow py-16 px-4">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Barra de Busca */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-[#0088b9]"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rastrear Manifestação Oficial</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Informe o número de protocolo e, se possuir, o código verificador ou e-mail utilizado na abertura.
                        </p>

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 max-w-xl mx-auto"
                        >
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 text-left">
                                    <label htmlFor="input-protocolo" className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">
                                        Número do Protocolo *
                                    </label>
                                    <input
                                        id="input-protocolo"
                                        type="text"
                                        placeholder="Ex: LAI-2026-XXXXXX"
                                        required
                                        value={protocolo}
                                        onChange={(e) => setProtocolo(e.target.value)}
                                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono"
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <label htmlFor="input-verificador" className="block text-[10px] font-black uppercase text-gray-500 mb-1 ml-1">
                                        E-mail ou Código Verificador (Opcional)
                                    </label>
                                    <input
                                        id="input-verificador"
                                        type="text"
                                        placeholder="PIN ou seu e-mail"
                                        value={verificador}
                                        onChange={(e) => setVerificador(e.target.value)}
                                        className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />} Consultar Protocolo
                            </button>
                        </form>
                    </div>

                    {/* Resultado */}
                    {data && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8 animate-fade-in-up">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">
                                        Sistema: {tipoBusca === "ouvidoria" ? "Ouvidoria Municipal" : "e-SIC (Lei de Acesso à Informação)"}
                                    </h3>
                                    <h4 className="text-2xl font-bold text-gray-800 break-all">{data.protocolo}</h4>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                        <FaClock className="text-gray-400" /> Abertura:{" "}
                                        {new Date(data.criadoEm).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${currentStatusColor} flex items-center gap-2`}>
                                    <FaLock className="opacity-50" /> {currentStatusLabel}
                                </div>
                            </div>

                            {/* Alerta de Prorrogação de Prazo */}
                            {data.prorrogado && (
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800">
                                    <p className="font-bold uppercase tracking-wider mb-1">
                                        Prazo Prorrogado (+10 dias corridos conforme Art. 11, § 2º da Lei 12.527/2011)
                                    </p>
                                    <p>
                                        <strong>Justificativa:</strong>{" "}
                                        {data.justificativaProrrogacao || data.justificativaPrazo || "Necessidade de consolidação complementar de dados junto ao setor técnico."}
                                    </p>
                                </div>
                            )}

                            {/* Conteúdo do Pedido */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaFile className="text-gray-400" /> Teor da Solicitação
                                </h4>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                    {data.descricao || data.pedido}
                                </div>
                            </div>

                            {/* Resposta do Município */}
                            {data.resposta && (
                                <div className="bg-[#f0f9ff] border border-[#bae6fd] p-6 rounded-2xl">
                                    <h4 className="text-sm font-bold text-[#0369a1] mb-3 flex items-center gap-2">
                                        <FaCheckCircle className="text-[#0ea5e9]" /> Resposta Oficial do Órgão
                                    </h4>
                                    <div className="text-[#0c4a6e] leading-relaxed text-sm whitespace-pre-wrap bg-white p-5 rounded-xl border border-[#e0f2fe] mb-4">
                                        {data.resposta}
                                    </div>

                                    {data.anexoResposta && (
                                        <a
                                            href={data.anexoResposta}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold text-[#0284c7] hover:text-[#0369a1] bg-white px-4 py-2 rounded-xl border border-[#bae6fd] hover:bg-[#e0f2fe] transition-colors shadow-sm mb-4"
                                        >
                                            <FaPaperclip /> Visualizar Documento Anexo
                                        </a>
                                    )}

                                    <div className="text-xs font-semibold text-[#0369a1] flex flex-wrap justify-between items-center gap-2">
                                        <span>
                                            Respondido em:{" "}
                                            {data.respondidoEm
                                                ? new Date(data.respondidoEm).toLocaleDateString("pt-BR")
                                                : "Data Indisponível"}
                                        </span>
                                        {canFileAppeal && (
                                            <button
                                                type="button"
                                                onClick={() => setShowRecursoForm(!showRecursoForm)}
                                                className="text-[#0284c7] hover:text-[#0c4a6e] underline font-bold px-2 py-1 transition-colors"
                                            >
                                                {isSegundaInstanciaDisponivel
                                                    ? "Interpor Recurso em 2ª Instância"
                                                    : "Interpor Recurso em 1ª Instância"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Formulário de Recurso */}
                            {showRecursoForm && canFileAppeal && (
                                <form
                                    onSubmit={handleSendRecurso}
                                    className="bg-orange-50 border border-orange-200 p-6 rounded-2xl animate-fade-in-up"
                                >
                                    <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                                        <FaExclamationTriangle className="text-orange-500" />{" "}
                                        {isSegundaInstanciaDisponivel
                                            ? "Recurso em 2ª Instância (Prefeito / Controladoria Geral)"
                                            : "Recurso em 1ª Instância (Autoridade Superior)"}
                                    </h4>
                                    <p className="text-xs text-orange-700 mb-4 leading-relaxed">
                                        A Lei nº 12.527/2011 (Art. 15) garante o direito de recorrer no prazo de 10 dias a contar da ciência da decisão.
                                    </p>
                                    <textarea
                                        required
                                        rows={4}
                                        value={recursoText}
                                        onChange={(e) => setRecursoText(e.target.value)}
                                        placeholder="Exponha as razões do recurso..."
                                        className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition-all resize-none mb-4"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowRecursoForm(false)}
                                            className="px-5 py-2 text-sm font-bold text-orange-700 hover:bg-orange-100 rounded-xl transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={sendingRecurso}
                                            className="px-6 py-2 bg-orange-600 text-white shadow-lg shadow-orange-500/20 text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-orange-700 transition-colors"
                                        >
                                            {sendingRecurso ? <FaSpinner className="animate-spin" /> : "Protocolar Recurso"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Histórico de Recursos (1ª e 2ª Instâncias) */}
                            {data.recurso && (
                                <div className="space-y-4">
                                    <div className="bg-white border text-orange-800 border-orange-100 p-6 rounded-2xl shadow-sm">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-3 flex items-center gap-2">
                                            <FaExclamationTriangle /> Recurso de 1ª Instância
                                        </h4>
                                        <p className="bg-orange-50 p-4 rounded-xl text-sm border border-orange-100 leading-relaxed font-medium">
                                            {data.recurso}
                                        </p>
                                        <span className="block mt-3 text-xs font-semibold text-orange-600">
                                            Interposto em:{" "}
                                            {data.dataRecurso
                                                ? new Date(data.dataRecurso).toLocaleDateString("pt-BR")
                                                : "Data Indisponível"}
                                        </span>
                                    </div>

                                    {data.respostaRecurso && (
                                        <div className="bg-slate-800 text-gray-100 border border-slate-700 p-6 rounded-2xl shadow-md">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-[#01b0ef] mb-3 flex items-center gap-2">
                                                <FaCheckCircle /> Decisão de 1ª Instância
                                            </h4>
                                            <div className="bg-slate-900 p-4 rounded-xl text-sm border border-slate-700 leading-relaxed">
                                                {data.respostaRecurso}
                                            </div>
                                            <span className="block mt-3 text-xs font-semibold text-gray-400">
                                                Decisão proferida em:{" "}
                                                {data.dataRespostaRecurso
                                                    ? new Date(data.dataRespostaRecurso).toLocaleDateString("pt-BR")
                                                    : "Data Indisponível"}
                                            </span>
                                        </div>
                                    )}

                                    {data.recursoSegundaInstancia && (
                                        <div className="bg-white border text-amber-900 border-amber-200 p-6 rounded-2xl shadow-sm">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                                                <FaExclamationTriangle /> Recurso de 2ª Instância
                                            </h4>
                                            <p className="bg-amber-50 p-4 rounded-xl text-sm border border-amber-100 leading-relaxed font-medium">
                                                {data.recursoSegundaInstancia}
                                            </p>
                                            <span className="block mt-3 text-xs font-semibold text-amber-700">
                                                Interposto em:{" "}
                                                {data.dataRecursoSegunda
                                                    ? new Date(data.dataRecursoSegunda).toLocaleDateString("pt-BR")
                                                    : "Data Indisponível"}
                                            </span>
                                        </div>
                                    )}

                                    {data.respostaRecursoSegunda && (
                                        <div className="bg-slate-900 text-gray-100 border border-slate-800 p-6 rounded-2xl shadow-md">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                                                <FaCheckCircle /> Decisão Definitiva (2ª Instância)
                                            </h4>
                                            <div className="bg-black/40 p-4 rounded-xl text-sm border border-slate-800 leading-relaxed">
                                                {data.respostaRecursoSegunda}
                                            </div>
                                            <span className="block mt-3 text-xs font-semibold text-gray-400">
                                                Decisão proferida em:{" "}
                                                {data.dataRespostaSegunda
                                                    ? new Date(data.dataRespostaSegunda).toLocaleDateString("pt-BR")
                                                    : "Data Indisponível"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Histórico de Tramitação */}
                            {tramitacoes.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                                        <FaHistory /> Histórico de Tramitação Oficial
                                    </h4>
                                    <div className="space-y-3">
                                        {tramitacoes.map((t, i) => (
                                            <div key={i} className="flex items-start gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                                <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                                                <div>
                                                    <span className="font-bold text-gray-800">{t.evento}</span>
                                                    <span className="text-gray-400 ml-2">
                                                        ({new Date(t.data).toLocaleDateString("pt-BR")})
                                                    </span>
                                                    {t.detalhe && <p className="text-gray-600 mt-1">{t.detalhe}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rodapé do Card */}
                            <div className="pt-6 mt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                    <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Prazo Legal</p>
                                    <p className="font-medium text-gray-800">
                                        {data.prazo ? new Date(data.prazo).toLocaleDateString("pt-BR") : "20 dias corridos"}
                                    </p>
                                </div>
                                {tipoBusca === "esic" && data.orgao && (
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Órgão Direcionado</p>
                                        <p className="font-medium text-gray-800 truncate">{data.orgao}</p>
                                    </div>
                                )}
                                {tipoBusca === "ouvidoria" && data.tipo && (
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Tipo Manifestação</p>
                                        <p className="font-medium text-gray-800 uppercase">{data.tipo}</p>
                                    </div>
                                )}
                                {tipoBusca === "esic" && data.formaRetorno && (
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Forma de Retorno</p>
                                        <p className="font-medium text-gray-800 uppercase">{data.formaRetorno}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
