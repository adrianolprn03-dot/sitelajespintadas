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
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Quadro de Pessoal"
                subtitle="Portal centralizado de informações sobre recursos humanos e gestão de pessoas."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <Link 
                            key={index} 
                            href={card.href}
                            className="group relative overflow-hidden bg-white rounded-[2.5rem] p-8 shadow-xl border border-white hover:border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Efeito de Fundo */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                            
                            <div className="mb-8 relative">
                                <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <card.icon size={28} />
                                </div>
                                <div className="absolute -top-2 -right-2 bg-white px-2 py-0.5 rounded-full text-[8px] font-black text-gray-400 border border-gray-100 uppercase tracking-widest shadow-sm">
                                    {card.badge}
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
                                Acessar Módulo
                                <div className="w-6 h-0.5 bg-blue-500 rounded-full group-hover:w-12 transition-all duration-500"></div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 p-10 bg-gradient-to-br from-gray-900 to-slate-800 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Transparência Ativa</h2>
                            <p className="text-gray-400 font-medium max-w-xl text-sm italic leading-relaxed">
                                Este portal segue rigorosamente as diretrizes da Lei de Acesso à Informação (LAI) e da Lei Complementar 131/2009, garantindo o direito do cidadão ao acompanhamento dos gastos públicos com pessoal.
                            </p>
                        </div>
                        <Link 
                            href="/transparencia"
                            className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                        >
                            Voltar para Transparência
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
