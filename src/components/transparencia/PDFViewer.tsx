"use client";

import { useEffect } from "react";
import { FaFilePdf, FaDownload, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface PDFViewerProps {
    url: string;
    titulo: string;
    onClose: () => void;
}

export default function PDFViewer({ url, titulo, onClose }: PDFViewerProps) {
    const viewerUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

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
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
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
