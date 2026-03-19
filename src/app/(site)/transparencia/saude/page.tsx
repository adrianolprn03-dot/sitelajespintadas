import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaCapsules, FaSearch, FaCheckCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Saúde e Medicamentos | Portal da Transparência",
    description: "Relação Municipal de Medicamentos Essenciais (REMUME) e disponibilidade atualizada.",
};

export default async function SaudeTransparencyPage() {
    const medicamentos = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Saúde e Medicamentos"
                subtitle="Consulta à disponibilidade de medicamentos na rede municipal de saúde (REMUME)."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Saúde e Medicamentos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="mb-12 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                            <FaClock size={18} />
                        </div>
                        <div>
                            <h4 className="text-emerald-900 font-black uppercase text-xs tracking-tight mb-1">Última Atualização do Estoque</h4>
                            <p className="text-emerald-700/80 text-sm font-medium">As informações abaixo são sincronizadas diariamente com o Almoxarifado Central da Saúde.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white">
                    <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Lista de Medicamentos (REMUME)</h3>
                            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">Total de {medicamentos.length} itens cadastrados</p>
                        </div>
                        <div className="relative group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar medicamento..."
                                className="pl-14 pr-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Medicamento</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Categoria</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Disponibilidade</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Observações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {medicamentos.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-white group-hover:shadow-md transition-all">💊</div>
                                                <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">{item.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{item.categoria}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            {item.status === 'disponivel' ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                    <FaCheckCircle /> Disponível
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest">
                                                    <FaExclamationTriangle /> Em Falta
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <p className="text-xs font-bold text-gray-500 tracking-tight italic">{item.observacao || "Sem observações"}</p>
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
