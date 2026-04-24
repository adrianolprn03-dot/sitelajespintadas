"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Download, ExternalLink, X, ChevronDown,
    Loader2, AlertCircle, FolderOpen, File, BookOpen
} from "lucide-react";

interface PNCPArquivo {
    uri: string;
    url: string;
    statusAtivo: boolean;
    sequencialDocumento: number;
    titulo: string;
    tipoDocumentoNome: string;
    tipoDocumentoDescricao: string;
    dataPublicacaoPncp: string;
}

interface Props {
    anoCompra: number;
    sequencialCompra: number;
    numeroCompra: string;
    objetoCompra: string;
}

const TIPO_ICONE: Record<string, { cor: string; label: string }> = {
    "Edital":        { cor: "bg-blue-50 text-blue-600 border-blue-100",   label: "Edital" },
    "Anexo":         { cor: "bg-purple-50 text-purple-600 border-purple-100", label: "Anexo" },
    "Ata":           { cor: "bg-green-50 text-green-600 border-green-100", label: "Ata" },
    "Contrato":      { cor: "bg-orange-50 text-orange-600 border-orange-100", label: "Contrato" },
    "Resultado":     { cor: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Resultado" },
    "Impugnação":    { cor: "bg-red-50 text-red-600 border-red-100", label: "Impugnação" },
};

function getTipoConfig(tipoNome: string) {
    return TIPO_ICONE[tipoNome] ?? { cor: "bg-slate-50 text-slate-600 border-slate-100", label: tipoNome };
}

export default function PNCPDocumentosModal({ anoCompra, sequencialCompra, numeroCompra, objetoCompra }: Props) {
    const [aberto, setAberto] = useState(false);
    const [arquivos, setArquivos] = useState<PNCPArquivo[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [pdfAberto, setPdfAberto] = useState<PNCPArquivo | null>(null);
    const [pdfCarregando, setPdfCarregando] = useState(false);

    const carregarArquivos = useCallback(async () => {
        if (arquivos.length > 0 || loading) return; // já carregou
        setLoading(true);
        setErro(null);
        try {
            const res = await fetch(`/api/integracao/pncp/arquivos?ano=${anoCompra}&seq=${sequencialCompra}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setArquivos(data.filter((a: PNCPArquivo) => a.statusAtivo));
            } else {
                setErro("Não foi possível carregar os documentos.");
            }
        } catch {
            setErro("Falha de conexão com o PNCP.");
        } finally {
            setLoading(false);
        }
    }, [anoCompra, sequencialCompra, arquivos.length, loading]);

    function abrirPainel() {
        setAberto(true);
        carregarArquivos();
    }

    function fecharPainel() {
        setAberto(false);
        setPdfAberto(null);
    }

    // URL de download direto do arquivo
    function getUrlArquivo(arquivo: PNCPArquivo) {
        return arquivo.url || arquivo.uri;
    }

    return (
        <>
            {/* Botão disparador */}
            <button
                onClick={abrirPainel}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 hover:scale-105 transition-all"
            >
                <FolderOpen size={12} />
                Ver Documentos
                <ChevronDown size={10} className={`transition-transform ${aberto ? "rotate-180" : ""}`} />
            </button>

            {/* Modal / Drawer */}
            <AnimatePresence>
                {aberto && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={fecharPainel}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Painel lateral */}
                        <motion.aside
                            key="painel"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
                        >
                            {/* Cabeçalho */}
                            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-100 bg-slate-950 text-white shrink-0">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                                                Processo Nº {numeroCompra}/{anoCompra}
                                            </p>
                                            <h2 className="text-sm font-black">Documentos do Processo</h2>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/50 italic line-clamp-2 ml-12">
                                        {objetoCompra}
                                    </p>
                                </div>
                                <button
                                    onClick={fecharPainel}
                                    className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors shrink-0"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Conteúdo principal */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Visualizador PDF */}
                                <AnimatePresence>
                                    {pdfAberto && (
                                        <motion.div
                                            key="pdf-viewer"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "60vh" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="relative border-b border-slate-100 bg-slate-50 overflow-hidden"
                                        >
                                            {/* Barra superior do visualizador */}
                                            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <BookOpen size={14} className="text-slate-500 shrink-0" />
                                                    <p className="text-[10px] font-bold text-slate-600 truncate">
                                                        {pdfAberto.titulo}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <a
                                                        href={getUrlArquivo(pdfAberto)}
                                                        download={pdfAberto.titulo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                                                    >
                                                        <Download size={10} /> Baixar
                                                    </a>
                                                    <a
                                                        href={getUrlArquivo(pdfAberto)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                                    >
                                                        <ExternalLink size={10} /> Abrir
                                                    </a>
                                                    <button
                                                        onClick={() => setPdfAberto(null)}
                                                        className="p-1.5 bg-slate-100 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* iFrame do PDF */}
                                            <div className="pt-12 h-full relative">
                                                {pdfCarregando && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                                                        <div className="text-center">
                                                            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                Carregando PDF...
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                <iframe
                                                    key={pdfAberto.sequencialDocumento}
                                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(getUrlArquivo(pdfAberto))}&embedded=true`}
                                                    className="w-full h-full border-0"
                                                    onLoad={() => setPdfCarregando(false)}
                                                    onLoadStart={() => setPdfCarregando(true)}
                                                    title={pdfAberto.titulo}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Lista de documentos */}
                                <div className="p-6 space-y-3">
                                    {loading && (
                                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                            <Loader2 className="w-8 h-8 animate-spin mb-3" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">
                                                Buscando documentos no PNCP...
                                            </p>
                                        </div>
                                    )}

                                    {erro && (
                                        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                                            <AlertCircle size={18} className="text-red-500 shrink-0" />
                                            <p className="text-sm text-red-700 font-medium">{erro}</p>
                                        </div>
                                    )}

                                    {!loading && !erro && arquivos.length === 0 && (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                <File size={28} className="text-slate-200" />
                                            </div>
                                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-2">
                                                Nenhum documento disponível
                                            </p>
                                            <p className="text-xs text-slate-400 italic">
                                                Documentos podem ainda não ter sido publicados no PNCP.
                                            </p>
                                            <a
                                                href={`https://pncp.gov.br/app/editais/${anoCompra}/${sequencialCompra}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                                            >
                                                Verificar no PNCP <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    )}

                                    {!loading && arquivos.length > 0 && (
                                        <>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                {arquivos.length} documento{arquivos.length !== 1 ? "s" : ""} disponível{arquivos.length !== 1 ? "is" : ""}
                                            </p>
                                            {arquivos.map((arquivo) => {
                                                const cfg = getTipoConfig(arquivo.tipoDocumentoNome);
                                                const ativo = pdfAberto?.sequencialDocumento === arquivo.sequencialDocumento;
                                                return (
                                                    <motion.div
                                                        key={arquivo.sequencialDocumento}
                                                        layout
                                                        className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${ativo
                                                            ? "border-blue-200 bg-blue-50 shadow-md shadow-blue-100"
                                                            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                                                        }`}
                                                        onClick={() => {
                                                            setPdfAberto(ativo ? null : arquivo);
                                                            setPdfCarregando(true);
                                                        }}
                                                    >
                                                        {/* Ícone */}
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${cfg.cor}`}>
                                                            <FileText size={16} />
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                                {arquivo.titulo}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.cor}`}>
                                                                    {cfg.label}
                                                                </span>
                                                                <span className="text-[9px] text-slate-400">
                                                                    {new Date(arquivo.dataPublicacaoPncp).toLocaleDateString("pt-BR")}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Ações */}
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <a
                                                                href={getUrlArquivo(arquivo)}
                                                                download={arquivo.titulo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="Baixar PDF"
                                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                                            >
                                                                <Download size={14} />
                                                            </a>
                                                            <a
                                                                href={getUrlArquivo(arquivo)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="Abrir em nova aba"
                                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                                            >
                                                                <ExternalLink size={14} />
                                                            </a>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Rodapé */}
                            <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50">
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                                        Fonte: Portal Nacional de Contratações Públicas
                                    </p>
                                    <a
                                        href={`https://pncp.gov.br/app/editais/08159394000137-1-${String(sequencialCompra).padStart(6, "0")}/${anoCompra}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
                                    >
                                        Ver no PNCP <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
