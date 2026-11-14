"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFileMedical, FaCapsules, FaHospital, FaHeartbeat } from "react-icons/fa";

const SUBNAV_ITEMS = [
    { href: "/admin/saude", label: "Planos e Relatórios (PMS / PAS / RAG)", icon: FaFileMedical },
    { href: "/admin/saude/medicamentos", label: "Medicamentos SUS (REMUME)", icon: FaCapsules },
    { href: "/admin/unidades", label: "Unidades de Saúde (UBS)", icon: FaHospital },
    { href: "/admin/central-regulacao", label: "Central de Regulação", icon: FaHeartbeat },
];

export default function AdminSaudeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-4">
            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap gap-2 shadow-xs">
                    {SUBNAV_ITEMS.map((item) => {
                        const active =
                            item.href === "/admin/saude"
                                ? pathname === "/admin/saude"
                                : pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                                    active
                                        ? "bg-[#003366] text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                <item.icon size={13} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {children}
        </div>
    );
}
