import RelatorioAnualEsicClient from "@/components/transparencia/RelatorioAnualEsicClient";

export default function SICEstatisticasPage() {
    return (
        <RelatorioAnualEsicClient
            breadcrumbs={[
                { label: "Início", href: "/" },
                { label: "Transparência", href: "/transparencia" },
                { label: "Transparência Passiva", href: "/transparencia/passiva" },
                { label: "Relatórios e-SIC", href: "/transparencia/passiva/relatorios" },
                { label: "Relatório Estatístico Anual" },
            ]}
        />
    );
}
