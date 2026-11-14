"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBabyCarriage, FaBookOpen, FaGraduationCap, FaSchool, FaUsers } from "react-icons/fa";

const SUBNAV_ITEMS = [
    { href: "/admin/educacao", label: "Plano Municipal e Relatório de Resultados (19.1)", icon: FaBookOpen },
    { href: "/admin/creches", label: "Fila de Creches e Critérios (19.2)", icon: FaBabyCarriage },
    { href: "/admin/unidades", label: "Unidades Escolares", icon: FaSchool },
    { href: "/admin/conselhos", label: "Conselho do FUNDEB (19.3)", icon: FaUsers },
];

export default function AdminEducacaoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2.5 flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                    <FaGraduationCap className="text-[#1254A3]" /> Módulo Educação (PNTP 19.1 - 19.3):
                </div>
                {SUBNAV_ITEMS.map((item) => {
                    const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                active
                                    ? "bg-[#1254A3] text-white shadow-sm"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            <Icon className={active ? "text-white" : "text-[#1254A3]"} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {children}
        </div>
    );
}
