"use client";

import { useState } from "react";
import { Eye, Download } from "lucide-react";
import PDFViewer from "@/components/transparencia/PDFViewer";
import { AnimatePresence } from "framer-motion";

interface LeiEstruturaButtonsProps {
    pdfUrl: string;
}

export default function LeiEstruturaButtons({ pdfUrl }: { pdfUrl: string }) {
    const [showViewer, setShowViewer] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button
                onClick={() => setShowViewer(true)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
            >
                <Eye size={14} />
                Visualizar
            </button>
            <a
                href={pdfUrl}
                download="Lei_Municipal_246_2013_Estrutura_Organizacional.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
            >
                <Download size={14} />
                Baixar
            </a>

            <AnimatePresence>
                {showViewer && (
                    <PDFViewer
                        url={pdfUrl}
                        titulo="Lei Municipal nº 246/2013 - Estrutura Organizacional"
                        onClose={() => setShowViewer(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
