"use client";

import { useState, useEffect } from "react";
import { FaFilePdf, FaDownload, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface PDFViewerProps {
    url: string;
    titulo: string;
    onClose: () => void;
}

export default function PDFViewer({ url, titulo, onClose }: PDFViewerProps) {
    const [viewerUrl, setViewerUrl] = useState<string>("");

    useEffect(() => {
        let objectUrl = "";
        
        let targetUrl = url;
        // Se for link do Google Drive, formata para visualização direta/preview no iframe
        if (url.includes("drive.google.com")) {
            const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                targetUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
            }
        }

        if (targetUrl.startsWith("data:")) {
            // Decodifica o data URI de forma assíncrona usando o fetch nativo do navegador
            // Isso é muito mais eficiente em termos de memória e lida corretamente com padding/codificação
            fetch(targetUrl)
                .then(res => res.blob())
                .then(blob => {
                    objectUrl = URL.createObjectURL(blob);
                    setViewerUrl(objectUrl);
                })
                .catch(error => {
                    console.error("Erro ao converter data URI para Blob:", error);
                    // Tenta o fallback síncrono clássico em caso de erro no fetch
                    try {
                        const parts = targetUrl.split(',');
                        const base64Clean = parts[1].replace(/\s/g, ''); // remove espaços e quebras
                        const byteString = atob(base64Clean);
                        const mimeString = parts[0].match(/:(.*?);/)?.[1] || "application/pdf";
                        
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }
                        
                        const blob = new Blob([ab], { type: mimeString });
                        objectUrl = URL.createObjectURL(blob);
                        setViewerUrl(objectUrl);
                    } catch (fallbackError) {
                        console.error("Erro no fallback do atob:", fallbackError);
                        // NUNCA mandar data: URL para o pdf-proxy para evitar URI_TOO_LONG
                        setViewerUrl(targetUrl);
                    }
                });
        } else {
            setViewerUrl(`/api/pdf-proxy?url=${encodeURIComponent(targetUrl)}`);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [url]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[40] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8 pt-24 md:pt-32"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Barra superior */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                            <FaFilePdf size={16} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-800 truncate">{titulo}</h3>
                            <p className="text-[11px] text-slate-400">Visualizador de Documento</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <a
                            href={url.startsWith("data:") ? viewerUrl : url}
                            download={url.startsWith("data:") ? `${titulo}.pdf` : undefined}
                            target={url.startsWith("data:") ? undefined : "_blank"}
                            rel={url.startsWith("data:") ? undefined : "noopener noreferrer"}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                        >
                            <FaDownload size={12} />
                            <span className="hidden sm:inline">Baixar PDF</span>
                        </a>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>

                {/* Iframe do PDF */}
                <div className="flex-1 relative bg-slate-200">
                    <iframe
                        src={viewerUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        title={titulo}
                        allowFullScreen
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
