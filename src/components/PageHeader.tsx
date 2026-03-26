import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

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
    if (variant === 'premium') {
        return (
            <div className="bg-[#f8fafc] relative overflow-hidden pt-32 pb-24 px-6 border-b border-slate-200">
                {/* Decorativos suaves */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 -skew-x-12 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-blue-500/5 skew-x-12 -translate-x-1/4" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Breadcrumbs Soft Premium */}
                    <nav className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    {index > 0 && <FaChevronRight className="text-[8px] opacity-30" />}
                                    {isLast || !item.href ? (
                                        <span className="text-slate-900 font-bold">{item.label}</span>
                                    ) : (
                                        <Link href={item.href} className="hover:text-indigo-600 transition-colors">
                                            {item.label}
                                        </Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </nav>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-10">
                        {icon && (
                            <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 relative group overflow-hidden">
                                <div className="text-white text-4xl group-hover:scale-110 transition-transform duration-500 z-10">
                                    {icon}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/10 rounded-full blur-xl" />
                            </div>
                        )}
                        
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 tracking-tighter uppercase leading-tight drop-shadow-sm">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-slate-500 max-w-3xl text-lg font-medium leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-blue-50/80 to-transparent border-b border-gray-100 pt-32 pb-16 relative overflow-hidden z-10">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl shadow-inner" />
            
            <div className="max-w-[1240px] mx-auto px-6 relative z-10 flex flex-col items-start text-left">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2">
                            {breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1;
                                return (
                                    <li key={index} className="inline-flex items-center">
                                        {index > 0 && (
                                            <span className="mx-3 text-gray-300">/</span>
                                        )}
                                        {isLast || !item.href ? (
                                            <span className="text-primary-600 opacity-80">{item.label}</span>
                                        ) : (
                                            <Link href={item.href} className="hover:text-primary-500 transition-colors duration-200">
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                )}

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase leading-tight drop-shadow-sm">
                    {title}
                </h1>
                
                {subtitle && (
                    <p className="text-lg text-gray-500 max-w-3xl leading-relaxed font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
