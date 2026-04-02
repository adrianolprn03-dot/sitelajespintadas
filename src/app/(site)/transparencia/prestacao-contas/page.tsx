"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaFileInvoiceDollar } from "react-icons/fa";

export default function PrestacaoContasPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Prestação de Contas & Balanço Geral"
            subtitle="Consulta aos balanços anuais, relatórios contábeis e prestações de contas consolidadas do Município."
            icon={<FaFileInvoiceDollar />}
            tipo="BALANCO"
            breadcrumbLabel="Prestação de Contas"
        />
    );
}
