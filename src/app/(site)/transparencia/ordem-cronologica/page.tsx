import type { Metadata } from "next";
import OrdemCronologicaClient from "./_OrdemCronologicaClient";

export const metadata: Metadata = {
    title: "Ordem Cronológica de Pagamentos | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Acompanhe a fila de pagamentos a fornecedores da Prefeitura de Lajes Pintadas/RN, em conformidade com a Lei 14.133/2021.",
};

export default function OrdemCronologicaPage() {
    return <OrdemCronologicaClient />;
}
