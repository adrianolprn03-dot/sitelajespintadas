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
        <div className="bg-white border-b border-[#DCE4EE] pt-8 pb-10 sm:pt-10 sm:pb-12 relative overflow-hidden">
            {/* Ambient Institutional Glows (Azul e Amarelo) */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0072CE]/8 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#FACC15]/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-start text-left">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav
                        className="flex items-center flex-wrap gap-2 text-xs font-semibold text-[#526B84] mb-4 bg-[#F4F7FB] px-3.5 py-1.5 rounded-full border border-[#DCE4EE]"
                        aria-label="Breadcrumb"
                    >
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && <FaChevronRight size={8} className="text-slate-400" />}
                                    {isLast || !item.href ? (
                                        <span className="text-[#0072CE] font-bold">{item.label}</span>
                                    ) : (
                                        <Link href={item.href} className="hover:text-[#0072CE] transition-colors">
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
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-md ${
                                variant === "premium"
                                    ? "bg-gradient-to-br from-[#0072CE] to-[#003B73] text-white ring-2 ring-[#FACC15]"
                                    : "bg-[#F0F7FF] border border-[#BAE0FD] text-[#0072CE]"
                            }`}
                        >
                            {icon}
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#0F2942] font-heading tracking-tight leading-tight">
                            {title}
                        </h1>

                        {/* Barra de assinatura com as 4 cores do Brasão de Lajes Pintadas */}
                        <div className="h-1.5 w-24 rounded-full heraldic-stripe mt-3 mb-2.5" />

                        {subtitle && (
                            <p className="text-sm sm:text-base text-[#526B84] font-medium max-w-3xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
