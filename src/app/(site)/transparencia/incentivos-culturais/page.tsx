import type { Metadata } from "next";
import { FaMusic, FaRunning, FaTheaterMasks, FaBook, FaTrophy, FaExternalLinkAlt, FaFile, FaCalendar, FaMoneyBillWave } from "react-icons/fa";
import { Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

export const metadata: Metadata = {
    title: "Incentivos Culturais e Esportivos | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Editais, recursos e resultados dos programas de fomento à cultura, esporte e lazer do município.",
};

const PROGRAMAS = [
    {
        icone: FaMusic,
        titulo: "Fomento à Cultura",
        descricao: "Apoio financeiro e logístico a projetos culturais, festivais, grupos folclóricos e manifestações artísticas locais.",
        cor: "from-purple-500 to-violet-600",
        recursos: 42000,
        projetos: 8,
        status: "Vigente",
    },
    {
        icone: FaRunning,
        titulo: "Fomento ao Esporte",
        descricao: "Apoio a competições esportivas, escolinhas de esporte, atletas e times representativos do município.",
        cor: "from-blue-500 to-cyan-600",
        recursos: 28500,
        projetos: 12,
        status: "Vigente",
    },
    {
        icone: FaTheaterMasks,
        titulo: "Festividades Municipais",
        descricao: "Organização e apoio de eventos festivos, datas comemorativas e festivais anuais do calendário oficial.",
        cor: "from-amber-500 to-orange-600",
        recursos: 55000,
        projetos: 5,
        status: "Vigente",
    },
    {
        icone: FaBook,
        titulo: "Incentivo à Leitura",
        descricao: "Projeto de fomento à leitura, doação de livros e apoio à biblioteca pública municipal.",
        cor: "from-emerald-500 to-teal-600",
        recursos: 12000,
        projetos: 3,
        status: "Vigente",
    },
];

const EDITAIS = [
    {
        titulo: "Edital de Fomento Cultural nº 001/2026",
        tipo: "Cultura",
        publicacao: "2026-02-01",
        prazo: "2026-03-15",
        valor: 30000,
        status: "Encerrado",
        arquivo: null,
    },
    {
        titulo: "Edital de Apoio Esportivo nº 002/2026",
        tipo: "Esporte",
        publicacao: "2026-02-15",
        prazo: "2026-04-30",
        valor: 20000,
        status: "Aberto",
        arquivo: null,
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function IncentivosCulturaisPage() {
    const totalRecursos = PROGRAMAS.reduce((s, p) => s + p.recursos, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Incentivos Culturais e Esportivos"
                subtitle="Editais, programas de fomento e recursos destinados à cultura, esporte e lazer da comunidade de Lajes Pintadas."
                variant="premium"
                icon={<Star />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Incentivos Culturais e Esportivos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Resumo Financeiro */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-100/50 border-l-4 border-l-purple-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recursos Investidos</div>
                        <div className="text-2xl font-black text-purple-600">{fmt(totalRecursos)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Exercício {new Date().getFullYear()}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Projetos Apoiados</div>
                        <div className="text-2xl font-black text-blue-600">{PROGRAMAS.reduce((s, p) => s + p.projetos, 0)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Iniciativas ativas</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-amber-100/50 border-l-4 border-l-amber-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Editais Publicados</div>
                        <div className="text-2xl font-black text-amber-600">{EDITAIS.length}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Em {new Date().getFullYear()}</div>
                    </div>
                </div>

                {/* Programas */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-purple-600 rounded-full" /> Programas em Execução
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {PROGRAMAS.map((p, i) => (
                        <div key={i} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className={`h-2 bg-gradient-to-r ${p.cor}`} />
                            <div className="p-10">
                                <div className="flex items-start gap-5 mb-6">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${p.cor} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <p.icone size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-black text-gray-800 text-lg uppercase tracking-tighter group-hover:text-purple-600 transition-colors">{p.titulo}</h3>
                                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">{p.status}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.descricao}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-gray-50/50 rounded-2xl p-6 border border-gray-50">
                                    <div className="text-center">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Projetos</div>
                                        <div className="text-2xl font-black text-gray-800">{p.projetos}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Recursos</div>
                                        <div className="text-xl font-black text-purple-600">{fmt(p.recursos)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editais */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-amber-500 rounded-full" /> Editais Publicados
                </h2>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-16">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Edital</th>
                                    <th className="px-8 py-5">Área</th>
                                    <th className="px-8 py-5">Publicação</th>
                                    <th className="px-8 py-5">Prazo</th>
                                    <th className="px-8 py-5 text-right">Valor</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-center">Acesso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {EDITAIS.map((e, i) => (
                                    <tr key={i} className="hover:bg-amber-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <FaFile className="text-amber-400 shrink-0" size={14} />
                                                <span className="font-black text-gray-800 text-sm group-hover:text-amber-700 transition-colors">{e.titulo}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {e.tipo === "Cultura" ? <FaTheaterMasks size={9} /> : <FaRunning size={9} />} {e.tipo}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                                <FaCalendar size={10} className="text-gray-300" />
                                                {new Date(e.publicacao).toLocaleDateString("pt-BR")}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-bold text-gray-500">
                                            {new Date(e.prazo).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="font-black text-gray-800 text-sm">{fmt(e.valor)}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                                e.status === "Aberto" 
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-800 font-black text-[10px] uppercase tracking-widest transition-colors">
                                                <FaExternalLinkAlt size={9} /> Acessar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
