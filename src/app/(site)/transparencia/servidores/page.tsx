"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { 
    FaUsers, 
    FaMoneyCheckAlt, 
    FaBriefcase, 
    FaUserTie, 
    FaUserGraduate, 
    FaIdCardAlt 
} from "react-icons/fa";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const cards = [
    {
        icon: FaUsers,
        title: "Folha de Pagamento",
        description: "Consulte a relação mensal de servidores, cargos e remunerações detalhadas.",
        href: "/transparencia/servidores/folha-pagamento",
        color: "from-teal-500 to-emerald-600",
        badge: "LC 131"
    },
    {
        icon: FaMoneyCheckAlt,
        title: "Padrão Remuneratório",
        description: "Tabelas de vencimentos, referências salariais, níveis e classes de cargos.",
        href: "/transparencia/servidores/cargos-e-salarios",
        color: "from-blue-500 to-indigo-600",
        badge: "PNTP"
    },
    {
        icon: FaBriefcase,
        title: "Concursos e Seleções",
        description: "Acompanhe editais, resultados e convocações de concursos e processos seletivos.",
        href: "/transparencia/concursos",
        color: "from-purple-500 to-violet-600",
        badge: "LAI"
    },
    {
        icon: FaUserTie,
        title: "Terceirizados",
        description: "Relação de prestadores de serviço e postos de trabalho terceirizados.",
        href: "/transparencia/servidores/terceirizados",
        color: "from-orange-500 to-amber-600",
        badge: "PNTP 2025"
    },
    {
        icon: FaUserGraduate,
        title: "Estagiários",
        description: "Informações sobre estudantes em estágio na administração municipal.",
        href: "/transparencia/servidores/estagiarios",
        color: "from-pink-500 to-rose-600",
        badge: "PNTP 2025"
    },
    {
        icon: FaIdCardAlt,
        title: "Agentes Políticos",
        description: "Subsídios e remunerações de Prefeito, Vice-Prefeito e Secretários.",
        href: "/transparencia/servidores/agentes-politicos",
        color: "from-sky-500 to-cyan-600",
        badge: "LAI"
    }
];

export default function QuadroPessoalHub() {
    const [linksExternos, setLinksExternos] = useState<any[]>([]);

    useEffect(() => {
        async function loadExternalLinks() {
            try {
                const res = await fetch("/api/links-externos");
                if (res.ok) {
                    const data = await res.json();
                    setLinksExternos(data.filter((l: any) => l.categoria === "transparencia" || l.categoria === "geral"));
                }
            } catch (error) {
                console.error("Erro ao carregar links:", error);
            }
        }
        loadExternalLinks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Quadro de Pessoal"
                subtitle="Portal centralizado de informações sobre recursos humanos e gestão de pessoas."
                variant="premium"
                icon={<FaUsers />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card, index) => {
                        const identifier = card.href.split("/").pop()?.toLowerCase() || "";
                        const override = linksExternos.find((l: any) => 
                            l.moduloAlvo?.toLowerCase() === identifier
                        );
                        const finalHref = (override && override.url) ? override.url : card.href;
                        const isExternal = !!override;

                        return (
                            <Link 
                                key={index} 
                                href={finalHref}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group relative overflow-hidden bg-white rounded-[2.5rem] p-8 shadow-xl border border-white hover:border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col h-full"
                            >
                                {/* Efeito de Fundo */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                                
                                <div className="mb-8 relative flex justify-between items-start">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <card.icon size={28} />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="bg-white px-2 py-0.5 rounded-full text-[8px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest shadow-sm">
                                            {card.badge}
                                        </div>
                                        {isExternal && (
                                            <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm flex items-center gap-1 animate-pulse">
                                                <FaExternalLinkAlt size={8} /> Externo
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-3 group-hover:text-blue-600 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                    {isExternal ? "Acessar Portal Externo" : "Acessar Módulo"}
                                    <div className="w-6 h-0.5 bg-blue-500 rounded-full group-hover:w-12 transition-all duration-500"></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-24 pb-20 border-t border-gray-100 pt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
