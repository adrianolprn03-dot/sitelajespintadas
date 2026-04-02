"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaGavel } from "react-icons/fa";

export default function JulgamentoContasPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Julgamento de Contas (Câmara)"
            subtitle="Resultados do julgamento das contas do Poder Executivo realizado pela Câmara Municipal de Lajes Pintadas."
            icon={<FaGavel />}
            tipo="JULGAMENTO_CAMARA"
            breadcrumbLabel="Julgamento de Contas"
        />
    );
}
