import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaHandHoldingUsd, FaSearch, FaCalendarAlt, FaUserTie, FaCheckCircle, FaClock } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Emendas Parlamentares | Portal da Transparência",
    description: "Recursos recebidos pelo município através de emendas de parlamentares estaduais e federais.",
};

export default async function EmendasTransparencyPage() {
    const emendas = await prisma.emendaParlamentar.findMany({
        orderBy: { ano: "desc" }
    });

    const totalValor = emendas.reduce((acc: number, current: any) => acc + current.valor, 0);

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Emendas Parlamentares"
                subtitle="Acompanhamento de recursos destinados ao município por deputados e senadores."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Emendas Parlamentares" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-[#003da5] rounded-[2.5rem] p-10 text-white shadow-xl flex items-center gap-8 translate-y-[-20px]">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shadow-lg border border-white/20">
                            <FaHandHoldingUsd size={32} />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Total em Recursos Destinados</span>
                            <h4 className="text-4xl font-black tracking-tighter">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValor)}
                            </h4>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-white flex items-center gap-8">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaCheckCircle size={32} />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Emendas Cadastradas</span>
                            <h4 className="text-4xl font-black text-gray-800 tracking-tighter">{emendas.length}</h4>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white">
                    <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Detalhamento de Emendas</h3>
                        <div className="relative group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar autor ou objeto..."
                                className="pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Parlamentar / Autor</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Valor e Tipo</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Objeto da Emenda</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Situação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {emendas.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-16 text-center">
                                            <p className="text-gray-400 font-bold text-sm">Nenhuma emenda parlamentar cadastrada no momento.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    emendas.map((emenda: any) => (
                                        <tr key={emenda.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-white group-hover:shadow-md transition-all">
                                                        <FaUserTie size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-black text-gray-800 uppercase tracking-tighter">{emenda.autor}</span>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ano: {emenda.ano}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="block text-sm font-black text-blue-600 tracking-tight">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emenda.valor)}
                                                </span>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{emenda.tipo}</span>
                                            </td>
                                            <td className="px-10 py-8 max-w-[400px]">
                                                <p className="text-xs font-bold text-gray-700 leading-relaxed tracking-tight">{emenda.objeto}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                                    <FaClock /> {emenda.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
