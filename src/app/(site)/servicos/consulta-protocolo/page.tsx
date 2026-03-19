"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FaSearch, FaSpinner, FaFileAlt, FaLock, FaExclamationTriangle, FaCheckCircle, FaPaperclip, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

type ProtocolData = {
    protocolo: string;
    status: string;
    pedido?: string;  // esic
    descricao?: string; // ouvidoria
    orgao?: string;
    tipo?: string;
    resposta?: string;
    respondidoEm?: string;
    criadoEm: string;
    prazo?: string;
    anexoResposta?: string;
    recurso?: string;
    dataRecurso?: string;
    respostaRecurso?: string;
    dataRespostaRecurso?: string;
    formaRetorno?: string;
};

export default function ConsultaProtocoloPage() {
    const [protocolo, setProtocolo] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProtocolData | null>(null);
    const [tipoBusca, setTipoBusca] = useState<"ouvidoria" | "esic" | null>(null);

    // Formulario de Recurso
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
            const res = await fetch(`/api/consulta?protocolo=${protocolo.trim()}`);
            const result = await res.json();

            if (res.ok) {
                setData(result.data);
                setTipoBusca(result.tipoBusca);
            } else {
                toast.error(result.error || "Protocolo não encontrado no sistema.");
            }
        } catch (error) {
            toast.error("Erro interno. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendRecurso = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recursoText.trim()) return;

        setSendingRecurso(true);
        try {
            const res = await fetch(`/api/consulta/recurso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    protocolo: data?.protocolo,
                    recurso: recursoText.trim(),
                    tipoBusca
                })
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Recurso submetido com sucesso à instância superior.");
                setData({ ...data!, status: "em-recurso", recurso: recursoText.trim(), dataRecurso: new Date().toISOString() });
                setShowRecursoForm(false);
            } else {
                toast.error(result.error || "Erro ao enviar recurso.");
            }
        } catch (error) {
            toast.error("Erro interno ao enviar recurso.");
        } finally {
            setSendingRecurso(false);
        }
    };

    const isConcluido = data?.status === "concluido";
    const statusMap: Record<string, { label: string, color: string }> = {
        "aberto": { label: "Ag. Análise", color: "bg-gray-100 text-gray-600 border-gray-200" },
        "em-analise": { label: "Em Análise", color: "bg-blue-100 text-blue-700 border-blue-200" },
        "concluido": { label: "Respondido", color: "bg-green-100 text-green-700 border-green-200" },
        "em-recurso": { label: "Em Recurso (Avaliando)", color: "bg-orange-100 text-orange-700 border-orange-200" },
        "encerrado": { label: "Encerrado Definitivamente", color: "bg-purple-100 text-purple-700 border-purple-200" }
    };

    const currentStatusLabel = data?.status ? statusMap[data.status]?.label : "Desconhecido";
    const currentStatusColor = data?.status ? statusMap[data.status]?.color : "bg-gray-100 text-gray-600";

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <PageHeader
                title="Consulta de Protocolo"
                subtitle="Acompanhe o andamento das suas solicitações no e-SIC e Ouvidoria de forma transparente."
                breadcrumbs={[{ label: 'Serviços', href: '/servicos' }, { label: 'Consulta de Protocolo' }]}
            />

            <section className="flex-grow py-16 px-4">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Barra de Busca */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-[#0088b9]"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rastrear Manifestação Oficial</h2>
                        <p className="text-gray-500 text-sm mb-6">Digite o seu número de protocolo para ver as respostas do município e tramitações da LAI.</p>
                        
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="Ex: cltsxyz..."
                                required
                                value={protocolo}
                                onChange={(e) => setProtocolo(e.target.value)}
                                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-6 text-center sm:text-left text-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-mono"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto h-14 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />} Buscar
                            </button>
                        </form>
                    </div>

                    {/* Resultado */}
                    {data && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8 animate-fade-in-up">
                            {/* Cabecalho do Pedido */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">
                                        Sistema: {tipoBusca === "ouvidoria" ? "Ouvidoria Municipal" : "e-SIC (Lei de Acesso)"}
                                    </h3>
                                    <h4 className="text-2xl font-bold text-gray-800 break-all">{data.protocolo}</h4>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                        <FaClock className="text-gray-400" /> Abertura: {new Date(data.criadoEm).toLocaleDateString('pt-BR')} 
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${currentStatusColor} flex items-center gap-2`}>
                                    <FaLock className="opacity-50" /> {currentStatusLabel}
                                </div>
                            </div>

                            {/* Conteudo do Pedido */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaFileAlt className="text-gray-400" /> Teor da Solicitação
                                </h4>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                    {data.descricao || data.pedido}
                                </div>
                            </div>

                            {/* Resposta do Municipio */}
                            {data.resposta && (
                                <div className="bg-[#f0f9ff] border border-[#bae6fd] p-6 rounded-2xl">
                                    <h4 className="text-sm font-bold text-[#0369a1] mb-3 flex items-center gap-2">
                                        <FaCheckCircle className="text-[#0ea5e9]" /> Resposta Oficial do Órgão
                                    </h4>
                                    <div className="text-[#0c4a6e] leading-relaxed text-sm whitespace-pre-wrap bg-white p-5 rounded-xl border border-[#e0f2fe] mb-4">
                                        {data.resposta}
                                    </div>

                                    {data.anexoResposta && (
                                        <a href={data.anexoResposta} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#0284c7] hover:text-[#0369a1] bg-white px-4 py-2 rounded-xl border border-[#bae6fd] hover:bg-[#e0f2fe] transition-colors shadow-sm mb-4">
                                            <FaPaperclip /> Visualizar Documento Anexo
                                        </a>
                                    )}

                                    <div className="text-xs font-semibold text-[#0ea5e9]/70 flex justify-between items-center">
                                        <span>Respondido em: {data.respondidoEm ? new Date(data.respondidoEm).toLocaleDateString('pt-BR') : 'Data Indisponível'}</span>
                                        {isConcluido && (
                                            <button onClick={() => setShowRecursoForm(!showRecursoForm)} className="text-[#0284c7] hover:text-[#0c4a6e] underline font-bold px-2 py-1 transition-colors">
                                                Interpor Recurso
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Formulario de Recurso */}
                            {showRecursoForm && isConcluido && (
                                <form onSubmit={handleSendRecurso} className="bg-orange-50 border border-orange-200 p-6 rounded-2xl animate-fade-in-up">
                                    <h4 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                                        <FaExclamationTriangle className="text-orange-500" /> Entrar com Recurso
                                    </h4>
                                    <p className="text-xs text-orange-700 mb-4 opacity-80 leading-relaxed">
                                        A Lei nº 12.527/11 (LAI) garante o direito a recurso no prazo de 10 dias da ciência da decisão negativa ou da resposta parcial. Sua justificativa será analisada por uma instância superior.
                                    </p>
                                    <textarea
                                        required
                                        rows={4}
                                        value={recursoText}
                                        onChange={(e) => setRecursoText(e.target.value)}
                                        placeholder="Justifique fundamentadamente por que a solicitação não foi atendida satisfatoriamente..."
                                        className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition-all resize-none mb-4"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => setShowRecursoForm(false)} className="px-5 py-2 text-sm font-bold text-orange-700 hover:bg-orange-100 rounded-xl transition-colors">
                                            Cancelar
                                        </button>
                                        <button type="submit" disabled={sendingRecurso} className="px-6 py-2 bg-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 text-sm font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
                                            {sendingRecurso ? <FaSpinner className="animate-spin" /> : "Enviar Recurso Oficialmente"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Histórico do Recurso Interposto */}
                            {data.recurso && (
                                <div className="space-y-4">
                                    <div className="bg-white border text-orange-800 border-orange-100 p-6 rounded-2xl shadow-sm">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-3 flex items-center gap-2">
                                            <FaExclamationTriangle /> Histórico de Recurso
                                        </h4>
                                        <p className="bg-orange-50 p-4 rounded-xl text-sm border border-orange-100 leading-relaxed font-medium">
                                            {data.recurso}
                                        </p>
                                        <span className="block mt-3 text-xs font-semibold text-orange-400/80">
                                            Interposto em: {data.dataRecurso ? new Date(data.dataRecurso).toLocaleDateString('pt-BR') : 'Data Indisponível'}
                                        </span>
                                    </div>

                                    {/* Resposta Final ao Recurso */}
                                    {data.respostaRecurso && (
                                        <div className="bg-gray-800 text-gray-100 border border-gray-700 p-6 rounded-2xl shadow-md">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-[#01b0ef] mb-3 flex items-center gap-2">
                                                <FaCheckCircle /> Decisão Definitiva (Instância Superior)
                                            </h4>
                                            <div className="bg-gray-900 p-4 rounded-xl text-sm border border-gray-700 leading-relaxed">
                                                {data.respostaRecurso}
                                            </div>
                                            <span className="block mt-3 text-xs font-semibold text-gray-500">
                                                Decisão proferida em: {data.dataRespostaRecurso ? new Date(data.dataRespostaRecurso).toLocaleDateString('pt-BR') : 'Data Indisponível'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Informações adicionais Footer do Card */}
                            <div className="pt-6 mt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                <div>
                                    <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Prazo Legal</p>
                                    <p className="font-medium text-gray-800">{data.prazo ? new Date(data.prazo).toLocaleDateString('pt-BR') : "N/A"}</p>
                                </div>
                                {tipoBusca === 'esic' && data.orgao && (
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Órgão Direcionado</p>
                                        <p className="font-medium text-gray-800 truncate">{data.orgao}</p>
                                    </div>
                                )}
                                {tipoBusca === 'ouvidoria' && data.tipo && (
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Tipo Manifestação</p>
                                        <p className="font-medium text-gray-800 uppercase">{data.tipo}</p>
                                    </div>
                                )}
                                {tipoBusca === 'esic' && data.formaRetorno && (
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
