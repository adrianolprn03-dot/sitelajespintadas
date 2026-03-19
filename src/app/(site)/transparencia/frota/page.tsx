import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaCar, FaSearch, FaHistory, FaTools, FaCheckCircle } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Frota Municipal | Portal da Transparência",
    description: "Relação de veículos e máquinas pesadas pertencentes ao patrimônio do município de Lajes Pintadas – RN.",
};

export default async function FrotaTransparencyPage() {
    const veiculos = await prisma.veiculo.findMany({
        where: { ativo: true },
        orderBy: { modelo: "asc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Frota Municipal"
                subtitle="Consulta detalhada de veículos, máquinas e equipamentos da frota pública municipal."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Frota Municipal" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-white flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaCar size={24} />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total da Frota</span>
                            <h4 className="text-3xl font-black text-gray-800 tracking-tighter">{veiculos.length}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-white flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Em Operação</span>
                            <h4 className="text-3xl font-black text-gray-800 tracking-tighter">{veiculos.filter(v => v.status === 'em-uso').length}</h4>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-white flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaTools size={24} />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Em Manutenção</span>
                            <h4 className="text-3xl font-black text-gray-800 tracking-tighter">{veiculos.filter(v => v.status === 'manutencao').length}</h4>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white">
                    <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Inventário de Veículos</h3>
                        <div className="relative group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Filtrar por modelo ou placa..."
                                className="pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Equipamento / Modelo</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Placa / Ano</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secretaria Responsável</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Situação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {veiculos.map((v) => (
                                    <tr key={v.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-gray-100">
                                                    {v.tipo.toLowerCase().includes('maquina') ? '🚜' : '🚗'}
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-black text-gray-800 uppercase tracking-tighter">{v.modelo}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{v.tipo}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="block text-sm font-bold text-gray-700 tracking-tight">{v.placa}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Ano: {v.ano}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{v.secretaria}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            {v.status === 'em-uso' ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                    <FaCheckCircle /> Em Uso
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest">
                                                    <FaTools /> Em Manutenção
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
