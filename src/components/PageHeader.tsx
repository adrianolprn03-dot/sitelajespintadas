import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
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
