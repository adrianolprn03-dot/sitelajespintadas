"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type AdminModalMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const MAX_WIDTH_CLASSES: Record<AdminModalMaxWidth, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
};

interface AdminModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    description?: string;
    icon?: React.ReactNode;
    maxWidth?: AdminModalMaxWidth;
    children: React.ReactNode;
    footer?: React.ReactNode;
    disableBackdropClose?: boolean;
}

/**
 * Modal administrativo padronizado com React Portal, bloqueio de scroll no fundo,
 * suporte à tecla Escape, cabeçalho fixo, corpo rolável adaptado a telas menores
 * e rodapé fixo opcional para botões de ação.
 */
export default function AdminModal({
    open,
    onClose,
    title,
    subtitle,
    description,
    icon,
    maxWidth = "2xl",
    children,
    footer,
    disableBackdropClose = false,
}: AdminModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open || !mounted) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (!disableBackdropClose && e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={`bg-white w-full ${MAX_WIDTH_CLASSES[maxWidth]} rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] overflow-hidden`}
            >
                {/* Cabeçalho Fixo */}
                <div className="shrink-0 flex items-start justify-between gap-4 px-5 sm:px-7 py-4 border-b border-gray-100 bg-white">
                    <div className="min-w-0 flex items-center gap-3">
                        {icon && <div className="shrink-0">{icon}</div>}
                        <div className="min-w-0">
                            {subtitle && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-[#01b0ef] mb-0.5 truncate">
                                    {subtitle}
                                </div>
                            )}
                            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight leading-snug">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar janela"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 font-bold flex items-center justify-center shrink-0 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Corpo Rolável */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-7 py-4 sm:py-5 space-y-4">
                    {children}
                </div>

                {/* Rodapé Fixo Opcional */}
                {footer && (
                    <div className="shrink-0 px-5 sm:px-7 py-3.5 border-t border-gray-100 bg-gray-50/90 flex flex-wrap items-center justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
