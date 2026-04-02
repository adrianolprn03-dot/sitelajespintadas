"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaChartLine } from "react-icons/fa";

export default function LRFPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Transparência Fiscal (LRF)"
            subtitle="Acesse os Relatórios Resumidos da Execução Orçamentária (RREO) e os Relatórios de Gestão Fiscal (RGF)."
            icon={<FaChartLine />}
            tipo="LRF"
            breadcrumbLabel="LRF"
            showTabs={["RREO", "RGF"]}
        />
    );
}
