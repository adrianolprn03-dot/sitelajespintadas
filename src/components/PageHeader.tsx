import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
    variant?: 'default' | 'premium';
    icon?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, variant = 'default', icon }: PageHeaderProps) {
    return (
        <div className="bg-white border-b border-[#DDE3EA] pt-32 pb-10 sm:pb-12 relative overflow-hidden">
            {/* Fundo suave com detalhes geométricos do design system */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EDF5FD] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
            
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-start text-left">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center flex-wrap gap-2 text-xs font-semibold text-[#5B738B] mb-4" aria-label="Breadcrumb">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && <FaChevronRight size={8} className="text-slate-400" />}
                                    {isLast || !item.href ? (
                                        <span className="text-[#1254A3] font-bold">{item.label}</span>
                                    ) : (
                                        <Link href={item.href} className="hover:text-[#1254A3] transition-colors">
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
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] bg-[#EDF5FD] border border-[#BFDBFE] text-[#1254A3] flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm">
                            {icon}
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#12304A] font-heading tracking-tight leading-tight">
                            {title}
                        </h1>
                        
                        {/* Linha de detalhe laranja característica do novo padrão */}
                        <div className="h-1.5 w-16 bg-[#F39A32] rounded-full mt-2.5 mb-2" />

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
