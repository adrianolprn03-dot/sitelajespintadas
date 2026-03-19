import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "A Prefeitura | Prefeitura Municipal de Lajes Pintadas – RN",
};

export default function APrefeituraPage() {
    return (
        <div>
            <PageHeader
                title="A Prefeitura Municipal"
                subtitle="Conheça a história, a estrutura e a administração de Lajes Pintadas – RN"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "A Prefeitura" }
                ]}
            />

            {/* Dados Institucionais / Atendimento */}
            <div className="bg-white border-y border-gray-200 shadow-sm relative z-10">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <img src="/images/brasao.png" alt="Brasão de Lajes Pintadas" className="w-16 h-16 object-contain" />
                            <div>
                                <h2 className="text-xl font-black text-[#0088b9] uppercase tracking-tight">Prefeitura Municipal de Lajes Pintadas</h2>
                                <p className="text-sm font-bold text-gray-500 mt-1">CNPJ: 08.XXX.XXX/0001-XX</p>
                            </div>
                        </div>
                        <div className="text-right border-l-2 border-gray-100 pl-6 hidden md:block">
                            <p className="text-sm text-gray-600 font-medium whitespace-pre-line">
                                Rua Principal, s/n – Centro{"\n"}
                                CEP: 59.233-000 | Lajes Pintadas – RN
                            </p>
                            <p className="text-sm font-bold text-[#01b0ef] mt-2">
                                (84) 3000-0000 | contato@lajespintadas.rn.gov.br
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards de navegação */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { emoji: "📖", titulo: "História da Cidade", desc: "Conheça a história e as origens de Lajes Pintadas, município do Rio Grande do Norte.", href: "/a-prefeitura/historia" },
                            { emoji: "👤", titulo: "Prefeito e Vice-Prefeito", desc: "Conheça o prefeito e vice-prefeito municipais, suas trajetórias e compromissos.", href: "/a-prefeitura/prefeito" },
                            { emoji: "🏛️", titulo: "Estrutura Administrativa", desc: "Organograma, secretarias, setores e atribuições de cada órgão municipal.", href: "/a-prefeitura/estrutura" },
                            { emoji: "📅", titulo: "Agenda do Prefeito", desc: "Compromissos, reuniões e agenda oficial da gestão municipal.", href: "/a-prefeitura/agenda" },
                        ].map((item) => (
                            <Link key={item.href} href={item.href} className="card p-6 flex gap-4 hover:-translate-y-1 transition-all duration-200 group">
                                <span className="text-5xl">{item.emoji}</span>
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary-600 transition-colors">{item.titulo}</h2>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
