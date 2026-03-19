import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Mapa do Site | Prefeitura de Lajes Pintadas – RN",
    description: "Mapa completo de todas as seções e páginas do portal da Prefeitura Municipal de Lajes Pintadas – RN.",
};

const secoes = [
    {
        titulo: "🏛️ Institucional",
        cor: "border-blue-200",
        links: [
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "História da Cidade", href: "/a-prefeitura/historia" },
            { label: "Prefeito e Vice-Prefeito", href: "/a-prefeitura/prefeito" },
            { label: "Estrutura Administrativa", href: "/a-prefeitura/estrutura" },
            { label: "Secretarias Municipais", href: "/secretarias" },
            { label: "Galeria de Fotos", href: "/galeria" },
            { label: "Notícias", href: "/noticias" },
        ]
    },
    {
        titulo: "📊 Transparência",
        cor: "border-emerald-200",
        links: [
            { label: "Portal da Transparência", href: "/transparencia" },
            { label: "Receitas Públicas", href: "/transparencia/receitas" },
            { label: "Despesas Públicas", href: "/transparencia/despesas" },
            { label: "Licitações", href: "/transparencia/licitacoes" },
            { label: "Contratos", href: "/transparencia/contratos" },
            { label: "Convênios", href: "/transparencia/convenios" },
            { label: "Diárias", href: "/transparencia/diarias" },
            { label: "Servidores / Folha", href: "/transparencia/servidores" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Relatórios Fiscais (RREO/RGF)", href: "/transparencia/relatorios" },
            { label: "LOA / LDO / PPA", href: "/transparencia/orcamento" },
            { label: "Dados Abertos", href: "/transparencia/dados-abertos" },
            { label: "Legislação Municipal", href: "/transparencia/legislacao" },
            { label: "Perguntas Frequentes (FAQ)", href: "/transparencia/faq" },
            { label: "Glossário de Termos", href: "/transparencia/glossario" },
        ]
    },
    {
        titulo: "🤝 Serviços ao Cidadão",
        cor: "border-orange-200",
        links: [
            { label: "e-SIC – Acesso à Informação", href: "/servicos/esic" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
        ]
    },
    {
        titulo: "⚖️ Legal e Privacidade",
        cor: "border-purple-200",
        links: [
            { label: "Política de Privacidade (LGPD)", href: "/privacidade" },
            { label: "Mapa do Site", href: "/mapa-do-site" },
        ]
    },
];

export default function MapaSitePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Mapa do Site"
                subtitle="Encontre rapidamente qualquer seção do portal da Prefeitura Municipal de Lajes Pintadas"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Mapa do Site" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {secoes.map((secao) => (
                        <div key={secao.titulo} className={`bg-white rounded-[2rem] shadow-sm border-l-4 ${secao.cor} border border-gray-100 p-8`}>
                            <h2 className="font-black text-[#0088b9] text-base uppercase tracking-tighter mb-6 pb-4 border-b border-gray-100">
                                {secao.titulo}
                            </h2>
                            <ul className="space-y-3">
                                {secao.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-3 text-gray-600 hover:text-[#01b0ef] text-sm font-medium transition-colors group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#01b0ef] transition-colors shrink-0" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
