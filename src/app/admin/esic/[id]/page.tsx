"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaSpinner, FaPaperPlane, FaUser, FaInfoCircle, FaCheckCircle, FaFileAlt, FaClock, FaPaperclip, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Esic = {
    id: string;
    protocolo: string;
    orgao: string;
    pedido: string;
    nome: string | null;
    email: string | null;
    formaRetorno: string;
    status: string;
    resposta: string | null;
    respondidoEm: string | null;
    criadoEm: string;
    prazo: string | null;
    prorrogado: boolean;
    anexoResposta: string | null;
    recurso: string | null;
    dataRecurso: string | null;
    respostaRecurso: string | null;
    dataRespostaRecurso: string | null;
};

export default function DetalhesEsicPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [item, setItem] = useState<Esic | null>(null);
    const [resposta, setResposta] = useState("");
    const [status, setStatus] = useState("");
    const [anexoResposta, setAnexoResposta] = useState("");
    
    // Para recurso
    const [respostaRecurso, setRespostaRecurso] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/esic/${id}`);
                const data = await res.json();
                setItem(data);
                setResposta(data.resposta || "");
                setStatus(data.status || "");
                setAnexoResposta(data.anexoResposta || "");
                setRespostaRecurso(data.respostaRecurso || "");
            } catch {
                toast.error("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleResponder = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/esic/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resposta,
                    status,
                    anexoResposta,
                    ...(status === 'encerrado' && respostaRecurso ? { respostaRecurso } : {})
                }),
            });
            if (res.ok) {
                toast.success("Resposta enviada com sucesso!");
                router.refresh();
            }
        } catch {
            toast.error("Erro ao salvar resposta");
        } finally {
            setSaving(false);
        }
    };

    const prorrogarPrazo = async () => {
        if (!item || item.prorrogado) return;
        if (!confirm("Tem certeza que deseja prorrogar o prazo deste requerimento e-SIC em mais 10 dias? Será exigida a formalização da justificativa na resposta final.")) return;
        
        try {
            const d = new Date(item.prazo || item.criadoEm);
            d.setDate(d.getDate() + 10);
            
            const res = await fetch(`/api/esic/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prazo: d.toISOString(), prorrogado: true }),
            });
            if (res.ok) {
                toast.success("Prazo (LAI) prorrogado com +10 dias úteis.");
                setItem({ ...item, prazo: d.toISOString(), prorrogado: true });
            }
        } catch {
            toast.error("Erro ao prorrogar prazo");
        }
    }

    if (loading) return <div className="py-20 text-center"><FaSpinner className="animate-spin inline-block text-4xl text-primary-500" /></div>;
    if (!item) return <div className="py-20 text-center text-red-500 font-bold">Pedido não encontrado.</div>;

    const dataPrazo = item.prazo ? new Date(item.prazo) : null;
    const isVencido = dataPrazo ? new Date() > dataPrazo && item.status !== "concluido" && item.status !== "encerrado" : false;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <Link href="/admin/esic" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar para pedidos
                </Link>
                <div className="flex gap-3">
                    <span className="text-sm font-mono font-bold bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                        Protocolo: {item.protocolo}
                    </span>
                    {dataPrazo && (
                        <span className={`text-sm font-bold px-4 py-1.5 rounded-full border flex items-center gap-2 ${isVencido ? 'bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100' : 'bg-blue-50 text-[#0088b9] border-blue-200'}`}>
                            <FaClock /> Prazo (LAI): {dataPrazo.toLocaleDateString("pt-BR")}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary-100">
                                {item.orgao}
                            </span>
                            <span className="text-gray-400 text-xs font-medium">
                                Data: {new Date(item.criadoEm).toLocaleDateString("pt-BR")} às {new Date(item.criadoEm).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {item.status === 'em-recurso' && (
                                <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                                    Em Recurso
                                </span>
                            )}
                        </div>

                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4"><FaFileAlt className="text-primary-500" /> Requerimento</h1>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 whitespace-pre-wrap">
                            {item.pedido}
                        </p>
                    </div>

                    {item.recurso && (
                        <div className="bg-orange-50 rounded-2xl shadow-sm border border-orange-200 p-8">
                            <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2 mb-4">
                                <FaExclamationTriangle /> Recurso à Instância Superior (LAI)
                            </h2>
                            <span className="text-xs text-orange-600/60 block mb-2 font-bold">Interposto em: {item.dataRecurso ? new Date(item.dataRecurso).toLocaleDateString("pt-BR") : ''}</span>
                            <p className="text-gray-700 leading-relaxed bg-white p-6 rounded-xl border border-orange-100 whitespace-pre-wrap">
                                {item.recurso}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleResponder} className="bg-white rounded-2xl shadow-sm border border-primary-100 p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaPaperPlane className="text-primary-500" /> 
                            {item.status === 'em-recurso' ? "Resposta ao Recurso" : "Resposta Oficial (LAI)"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Decisão / Situação</label>
                                <div className="flex flex-wrap gap-3">
                                    {["aberto", "em-analise", "concluido", "em-recurso", "encerrado"].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${status === s
                                                    ? "bg-primary-500 text-white border-primary-600 shadow-md"
                                                    : "bg-white text-gray-400 border-gray-100 hover:border-primary-200"
                                                }`}
                                        >
                                            {s.replace("-", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {item.status !== 'em-recurso' && item.status !== 'encerrado' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Texto da Resposta *</label>
                                        <textarea
                                            required={status === 'concluido'}
                                            rows={8}
                                            placeholder="Escreva a resposta fundamentada com a informação pública solicitada..."
                                            className="w-full bg-gray-50 text-sm text-gray-700 rounded-xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none shadow-inner"
                                            value={resposta}
                                            onChange={(e) => setResposta(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaPaperclip className="text-gray-400" /> Link de Arquivo Anexo
                                        </label>
                                        <input
                                            type="url"
                                            className="input-field"
                                            placeholder="Ex: https://drive.google.com/..."
                                            value={anexoResposta}
                                            onChange={(e) => setAnexoResposta(e.target.value)}
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase">A LAI obriga o fornecimento transparente, preferencialmente via sistema. Se os dados forem vultosos, o requerente solicitou envio por: <strong>{item.formaRetorno}</strong>.</p>
                                    </div>
                                </>
                            )}

                            {(item.status === 'em-recurso' || item.status === 'encerrado' || item.recurso) && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resposta Superior (Instância Recursal) *</label>
                                    <textarea
                                        required={status === 'encerrado'}
                                        rows={6}
                                        placeholder="Justificativa final da autoridade competente..."
                                        className="w-full bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none shadow-inner"
                                        value={respostaRecurso}
                                        onChange={(e) => setRespostaRecurso(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between flex-wrap gap-4 pt-4">
                            {!item.prorrogado && (item.status === 'aberto' || item.status === 'em-analise') ? (
                                <button type="button" onClick={prorrogarPrazo} className="text-xs font-bold text-gray-500 hover:text-primary-600 underline">
                                    Prorrogar Prazo (+10 dias)
                                </button>
                            ) : <div></div>}
                            
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl flex items-center gap-2 px-8 h-12 shadow-lg shadow-primary-500/20 transition-all text-sm"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                {saving ? "Salvando..." : "Salvar Resposta Oficial"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaUser /> Requerente
                        </h3>
                        {item.nome ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nome Completo</p>
                                    <p className="font-bold text-gray-800">{item.nome}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">E-mail para Retorno</p>
                                    <p className="text-gray-600 font-medium break-all">{item.email}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Forma de Retorno Solicitada</p>
                                    <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        {item.formaRetorno}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-xl border border-orange-100 italic text-sm">
                                    <FaInfoCircle /> Identidade Ocultada
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Forma de Retorno Solicitada</p>
                                    <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        {item.formaRetorno}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-sm font-bold text-[#0088b9] mb-3 uppercase tracking-tighter">Sobre a LAI</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            O prazo padrão de resposta é de <strong className="text-[#01b0ef]">20 dias úteis</strong>, prorrogáveis por mais 10 sob expressa justificativa (Art. 11, § 1º e 2º).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
