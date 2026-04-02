"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaLandmark } from "react-icons/fa";

export default function ContasGovernoPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Contas de Governo (PCG)"
            subtitle="Prestação de Contas de Governo (PCG) – Acompanhe os balanços consolidados e a gestão macroeconômica municipal."
            icon={<FaLandmark />}
            tipo="PCG"
            breadcrumbLabel="Contas de Governo"
        />
    );
}
