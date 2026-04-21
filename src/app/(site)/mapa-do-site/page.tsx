"use client";
import Link from "next/link";
import { FaSitemap, FaChevronRight, FaGlobe, FaLandmark, FaUsers, FaNewspaper, FaConciergeBell } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const sitemapData = [
    {
        secao: "Institucional",
        icon: FaLandmark,
        links: [
            { label: "A Prefeitura", href: "/a-prefeitura" },
            { label: "Secretarias", href: "/secretarias" },
            { label: "História do Município", href: "/a-prefeitura/historia" },
            { label: "Símbolos Oficiais", href: "/municipio/simbolos" },
            { label: "Gabinete do Prefeito", href: "/gestores" },
        ]
    },
    {
        secao: "Transparência",
        icon: FaGlobe,
        links: [
            { label: "Início Transparência", href: "/transparencia" },
            { label: "Receitas", href: "/transparencia/receitas" },
            { label: "Despesas", href: "/transparencia/despesas" },
            { label: "Licitações", href: "/transparencia/licitacoes" },
            { label: "Contratos", href: "/transparencia/contratos" },
            { label: "Obras Públicas", href: "/transparencia/obras" },
            { label: "Diárias e Passagens", href: "/transparencia/diarias" },
            { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
            { label: "Legislação Municipal", href: "/transparencia/legislacao" },
            { label: "Dados Abertos", href: "/transparencia/dados-abertos" },
            { label: "LRF (RREO e RGF)", href: "/transparencia/lrf" },
            { label: "Ordem Cronológica", href: "/transparencia/ordem-cronologica" },
        ]
    },
    {
        secao: "Cidadão & e-SIC",
        icon: FaConciergeBell,
        links: [
            { label: "e-SIC (Pedido de Informação)", href: "/servicos/esic" },
            { label: "Ouvidoria Municipal", href: "/servicos/ouvidoria" },
            { label: "Acompanhar Pedido", href: "/servicos/esic/acompanhar" },
            { label: "Relatórios Estatísticos SIC", href: "/transparencia/passiva/relatorios" },
            { label: "FAQ (Dúvidas)", href: "/transparencia/faq" },
            { label: "Glossário", href: "/transparencia/glossario" },
        ]
    },
    {
        secao: "Serviços & Notícias",
        icon: FaNewspaper,
        links: [
            { label: "Notícias", href: "/noticias" },
            { label: "Agenda de Eventos", href: "/agenda" },
            { label: "Galeria de Fotos", href: "/galeria" },
            { label: "Saúde", href: "/unidades-de-saude" },
            { label: "Educação", href: "/servicos/educacao" },
            { label: "Telefones Úteis", href: "/contato" },
        ]
    }
];

export default function MapaDoSitePage() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <PageHeader
                title="Mapa do Site"
                subtitle="Navegue de forma rápida por todas as seções do portal de Lajes Pintadas."
                variant="premium"
                icon={<FaSitemap />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Mapa do Site" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sitemapData.map((secao) => (
                        <div key={secao.secao} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <secao.icon size={24} />
                                </div>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{secao.secao}</h2>
                            </div>

                            <ul className="space-y-3">
                                {secao.links.map((link) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all group"
                                        >
                                            <span className="text-[11px] font-black uppercase tracking-widest">{link.label}</span>
                                            <FaChevronRight size={12} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gray-900 rounded-[2.5rem] p-10 text-center text-white shadow-2xl shadow-blue-900/10">
                    <h3 className="text-xl font-black uppercase tracking-widest mb-4">Acessibilidade</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-2xl mx-auto mb-8">
                        Se você encontrar dificuldades para navegar no portal, utilize nossa barra de ferramentas no topo 
                        para ajustar o contraste e o tamanho da fonte, ou entre em contato com a Ouvidoria.
                    </p>
                    <Link 
                        href="/transparencia/acessibilidade" 
                        className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all"
                    >
                        Página de Acessibilidade
                    </Link>
                </div>
            </div>
        </div>
    );
}
