import type { Metadata } from "next";
import AtasRegistroClient from "./_AtasRegistroClient";

export const metadata: Metadata = {
    title: "Atas de Registro de Preços | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Instrumentos homologados para aquisição de bens e serviços com preços e fornecedores pré-qualificados.",
};

export default function AtasRegistroPage() {
    return <AtasRegistroClient />;
}
