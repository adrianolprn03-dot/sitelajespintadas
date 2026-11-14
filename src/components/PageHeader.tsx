import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
    variant?: "default" | "premium";
    icon?: React.ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    variant = "default",
    icon,
}: PageHeaderProps) {
    return (
        <div className="bg-white border-b border-[#DDE3EA] pt-8 pb-10 sm:pt-10 sm:pb-12 relative overflow-hidden">
            {/* Ambient Institutional Soft Accents (Amarelo Ouro & Azul Safira) */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAB308]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#003B73]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-start text-left">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav
                        className="flex items-center flex-wrap gap-2 text-xs font-semibold text-[#5B738B] mb-4 bg-[#F8FAFC] px-3.5 py-1.5 rounded-full border border-[#DDE3EA]"
                        aria-label="Breadcrumb"
                    >
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && <FaChevronRight size={8} className="text-[#94A3B8]" />}
                                    {isLast || !item.href ? (
                                        <span className="text-[#003B73] font-bold">{item.label}</span>
                                    ) : (
                                        <Link href={item.href} className="hover:text-[#CA8A04] transition-colors">
                                            {item.label}
                                        </Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-5 w-full">
                    {icon && (
                        <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm ${
                                variant === "premium"
                                    ? "bg-[#EAB308] text-[#002B5C] border border-[#CA8A04]"
                                    : "bg-amber-50 border border-amber-200 text-[#CA8A04]"
                            }`}
                        >
                            {icon}
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-[#12304A] font-heading tracking-tight leading-tight">
                            {title}
                        </h1>

                        {/* Barra de assinatura Amarelo Ouro Primário */}
                        <div className="h-1.5 w-20 bg-[#EAB308] rounded-full mt-2.5 mb-2.5" />

                        {subtitle && (
                            <p className="text-sm sm:text-base text-[#5B738B] font-medium max-w-3xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
