"use client";

import { useState } from "react";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLink, FaCheck } from "react-icons/fa";

interface NewsShareButtonsProps {
    title: string;
    url?: string;
}

export default function NewsShareButtons({ title, url }: NewsShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== "undefined" ? url || window.location.href : "";
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error("Erro ao copiar link:", err);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 mr-2">
                Compartilhar:
            </span>

            {/* WhatsApp */}
            <a
                href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no WhatsApp"
                className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="Compartilhar no WhatsApp"
            >
                <FaWhatsapp className="w-4 h-4" />
            </a>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no Facebook"
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="Compartilhar no Facebook"
            >
                <FaFacebookF className="w-4 h-4" />
            </a>

            {/* X / Twitter */}
            <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no X (Twitter)"
                className="w-9 h-9 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                title="Compartilhar no X"
            >
                <FaTwitter className="w-4 h-4" />
            </a>

            {/* Copy Link */}
            <button
                onClick={handleCopy}
                aria-label="Copiar link da notícia"
                className={`h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm ${
                    copied
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                }`}
                title="Copiar Link"
            >
                {copied ? (
                    <>
                        <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copiado!</span>
                    </>
                ) : (
                    <>
                        <FaLink className="w-3.5 h-3.5 text-gray-500" />
                        <span>Copiar link</span>
                    </>
                )}
            </button>
        </div>
    );
}
