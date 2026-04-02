"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaUserEdit } from "react-icons/fa";

export default function ContasGestaoPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Contas de Gestão (PCS)"
            subtitle="Prestação de Contas de Gestão (PCS) – Acompanhe os atos de responsabilidade dos gestores municipais."
            icon={<FaUserEdit />}
            tipo="PCS"
            breadcrumbLabel="Contas de Gestão"
        />
    );
}
