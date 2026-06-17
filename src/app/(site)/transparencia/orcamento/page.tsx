"use client";

import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaScaleBalanced } from "react-icons/fa6";

export default function PlanejamentoFinancasPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Planejamento e Finanças"
            subtitle="Instrumentos que definem as prioridades e a aplicação dos recursos públicos municipais (LOA, LDO e PPA)."
            icon={<FaScaleBalanced />}
            tipo="ORCAMENTO"
            breadcrumbLabel="Planejamento e Finanças"
            showTabs={["LOA", "LDO", "PPA"]}
        />
    );
}
