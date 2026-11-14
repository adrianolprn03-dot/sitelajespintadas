"use client";

import Link from "next/link";
import { FaArrowLeft, FaHeartbeat } from "react-icons/fa";
import MedicamentosAdminManager from "@/components/admin/MedicamentosAdminManager";

export default function AdminMedicamentosPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-['Montserrat',sans-serif]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link
                        href="/admin/saude"
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#003366] mb-2"
                    >
                        <FaArrowLeft /> Voltar para Gestão da Saúde
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <FaHeartbeat className="text-rose-500" /> Medicamentos SUS (REMUME)
                    </h1>
                </div>
            </div>
            <MedicamentosAdminManager />
        </div>
    );
}
