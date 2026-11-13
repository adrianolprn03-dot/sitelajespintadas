import RelatorioAnualEsicClient from "@/components/transparencia/RelatorioAnualEsicClient";

export default function RelatorioAnualEsicPage() {
    return (
        <RelatorioAnualEsicClient
            titulo="Relatório Anual de Atendimento (e-SIC)"
            subtitulo="Demonstrativo estatístico anual de pedidos de acesso recebidos, atendidos, indeferidos e perfil genérico dos solicitantes conforme a Lei nº 12.527/2011."
            breadcrumbs={[
                { label: "Início", href: "/" },
                { label: "Serviços", href: "/servicos" },
                { label: "e-SIC", href: "/servicos/esic" },
                { label: "Relatório Anual Estatístico" },
            ]}
        />
    );
}
