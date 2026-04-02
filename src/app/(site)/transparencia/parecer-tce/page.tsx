"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaBalanceScale } from "react-icons/fa";

export default function ParecerTCEPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Pareceres Prévios do TCE"
            subtitle="Acompanhe a apreciação das contas anuais pelo Tribunal de Contas do Estado (TCE-RN)."
            icon={<FaBalanceScale />}
            tipo="PARECER_TCE"
            breadcrumbLabel="Parecer TCE"
        />
    );
}
