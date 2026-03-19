import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portal da Transparência | Prefeitura de Lajes Pintadas",
    description: "Acesso integral aos dados públicos da Prefeitura Municipal de Lajes Pintadas – RN. Receitas, despesas, licitações, contratos e muito mais.",
};

export default function TransparenciaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
