"use client";
import RelatoriosFiscaisTemplate from "@/components/transparencia/RelatoriosFiscaisTemplate";
import { FaClipboardList } from "react-icons/fa";

export default function RelatorioGestaoPage() {
    return (
        <RelatoriosFiscaisTemplate
            title="Relatórios de Gestão"
            subtitle="Publicações anuais detalhando o desempenho orçamentário, financeiro e administrativo da Prefeitura."
            icon={<FaClipboardList />}
            tipo="RELATORIO_GESTAO"
            breadcrumbLabel="Relatórios de Gestão"
        />
    );
}
