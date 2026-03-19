"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaSpinner, FaPaperPlane, FaUser, FaInfoCircle, FaCheckCircle, FaClock, FaPaperclip, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Manifestacao = {
    id: string;
    protocolo: string;
    tipo: string;
    assunto: string;
    descricao: string;
    nome: string | null;
    email: string | null;
    anonimo: boolean;
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

export default function DetalhesOuvidoriaPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [item, setItem] = useState<Manifestacao | null>(null);
    
    const [resposta, setResposta] = useState("");
    const [status, setStatus] = useState("");
    const [anexoResposta, setAnexoResposta] = useState("");
    
    // Para recurso
    const [respostaRecurso, setRespostaRecurso] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`/api/ouvidoria/${id}`);
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
            const res = await fetch(`/api/ouvidoria/${id}`, {
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
        if (!confirm("Tem certeza que deseja prorrogar o prazo desta manifestação em mais 30 dias?")) return;
        
        try {
            const d = new Date(item.prazo || item.criadoEm);
            d.setDate(d.getDate() + 30);
            
            const res = await fetch(`/api/ouvidoria/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prazo: d.toISOString(), prorrogado: true }),
            });
            if (res.ok) {
                toast.success("Prazo prorrogado com sucesso!");
                setItem({ ...item, prazo: d.toISOString(), prorrogado: true });
            }
        } catch {
            toast.error("Erro ao prorrogar prazo");
        }
    }

    if (loading) return <div className="py-20 text-center"><FaSpinner className="animate-spin inline-block text-4xl text-primary-500" /></div>;
    if (!item) return <div className="py-20 text-center text-red-500 font-bold">Registro não encontrado.</div>;

    const dataPrazo = item.prazo ? new Date(item.prazo) : null;
    const isVencido = dataPrazo ? new Date() > dataPrazo && item.status !== "concluido" && item.status !== "encerrado" : false;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <Link href="/admin/ouvidoria" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar para lista
                </Link>
                <div className="flex gap-3">
                    <span className="text-sm font-mono font-bold bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full border border-gray-200">
                        Protocolo: {item.protocolo}
                    </span>
                    {dataPrazo && (
                        <span className={`text-sm font-bold px-4 py-1.5 rounded-full border flex items-center gap-2 ${isVencido ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                            <FaClock /> Prazo: {dataPrazo.toLocaleDateString("pt-BR")}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary-100">
                                {item.tipo}
                            </span>
                            <span className="text-gray-400 text-xs font-medium">
                                Abertura: {new Date(item.criadoEm).toLocaleDateString("pt-BR")} às {new Date(item.criadoEm).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {item.status === 'em-recurso' && (
                                <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                                    Em Recurso
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{item.assunto}</h1>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 whitespace-pre-wrap">
                            {item.descricao}
                        </p>
                    </div>

                    {item.recurso && (
                        <div className="bg-orange-50 rounded-2xl shadow-sm border border-orange-200 p-8">
                            <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2 mb-4">
                                <FaExclamationTriangle /> Recurso do Cidadão
                            </h2>
                            <span className="text-xs text-orange-600/60 block mb-2 font-bold">Enviado em: {item.dataRecurso ? new Date(item.dataRecurso).toLocaleDateString("pt-BR") : ''}</span>
                            <p className="text-gray-700 leading-relaxed bg-white p-6 rounded-xl border border-orange-100 whitespace-pre-wrap">
                                {item.recurso}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleResponder} className="bg-white rounded-2xl shadow-sm border border-primary-100 p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaPaperPlane className="text-primary-500" /> 
                            {item.status === 'em-recurso' ? "Responder Recurso" : "Responder Manifestação"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Alterar Situação</label>
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
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Resposta ao Cidadão *</label>
                                        <textarea
                                            required={status === 'concluido'}
                                            rows={6}
                                            placeholder="Escreva aqui a resposta oficial que será enviada ao manifestante..."
                                            className="input-field resize-none"
                                            value={resposta}
                                            onChange={(e) => setResposta(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaPaperclip className="text-gray-400" /> Anexo Restrito (URL Google Drive / OneDrive)
                                        </label>
                                        <input
                                            type="url"
                                            className="input-field"
                                            placeholder="https://sua-url-aqui.com/documento.pdf"
                                            value={anexoResposta}
                                            onChange={(e) => setAnexoResposta(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Insira o link direto para o documento comprobatório, se houver.</p>
                                    </div>
                                </>
                            )}

                            {(item.status === 'em-recurso' || item.status === 'encerrado' || item.recurso) && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resposta ao Recurso *</label>
                                    <textarea
                                        required={status === 'encerrado'}
                                        rows={6}
                                        placeholder="Justificativa final da instância superior sobre o recurso interposto..."
                                        className="w-full bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none shadow-inner"
                                        value={respostaRecurso}
                                        onChange={(e) => setRespostaRecurso(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            {!item.prorrogado && (item.status === 'aberto' || item.status === 'em-analise') ? (
                                <button type="button" onClick={prorrogarPrazo} className="text-xs font-bold text-gray-500 hover:text-primary-600 underline">
                                    Prorrogar Prazo (+30 dias)
                                </button>
                            ) : <div></div>}
                            
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary flex items-center gap-2 px-10 h-12 text-sm"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                {saving ? "Processando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FaUser /> Manifestante
                        </h3>
                        {item.anonimo ? (
                            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-4 rounded-xl border border-orange-100 italic text-sm">
                                <FaInfoCircle /> Manifestação Anônima
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Nome Completo</p>
                                    <p className="font-bold text-gray-800">{item.nome}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">E-mail para Contato</p>
                                    <p className="text-gray-600 font-medium break-all">{item.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                        <h3 className="text-sm font-bold text-primary-700 mb-3">Informação SLA</h3>
                        <p className="text-sm text-primary-600 opacity-80 leading-relaxed">
                            A Lei exige resposta aos cidadãos sobre protocolos abertos dentro de 30 dias após sua submissão. Após conclusão, o cidadão poderá entrar com recurso.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
