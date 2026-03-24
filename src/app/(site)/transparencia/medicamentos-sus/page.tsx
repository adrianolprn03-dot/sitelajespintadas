import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaHeartbeat, FaInfoCircle, FaCheck, FaExclamationTriangle, FaBox } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lista de Medicamentos SUS (REMUME) | Portal da Transparência",
    description: "Relação Municipal de Medicamentos Essenciais (REMUME) disponíveis nas unidades de saúde.",
};

export default async function MedicamentosSUSPage() {
    const medicamentos = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Lista de Medicamentos SUS"
                subtitle="Relação Municipal de Medicamentos Essenciais (REMUME) e status de estoque"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Medicamentos SUS" }
                ]}
            />

            {/* Banner PNTP */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Assistência Farmacêutica", "REMUME", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 pt-16">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-xl text-rose-500 shrink-0 mt-1" />
                    <div>
                        <p className="font-black text-rose-800 text-sm uppercase tracking-wider mb-1">Acesso a Medicamentos</p>
                        <p className="text-rose-700 text-sm font-medium">
                            A dispensação de medicamentos controlados ou especializados exige apresentação de receita médica original e documentação pessoal na Farmácia Básica Municipal. O status "Disponível" refere-se à existência física na rede municipal.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <ExportButtons data={medicamentos} filename="lista_medicamentos_sus" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {medicamentos.length === 0 ? (
                        <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                           <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                               <FaHeartbeat size={32} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Sem medicamentos listados</h4>
                           <p className="text-gray-400 font-bold text-sm">A lista REMUME está sendo atualizada.</p>
                        </div>
                    ) : (
                        medicamentos.map((item: any) => {
                            let StatusIcon = FaCheck;
                            let statusColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                            if (item.status === 'em-falta') {
                                StatusIcon = FaExclamationTriangle;
                                statusColor = "bg-rose-50 text-rose-600 border-rose-100";
                            } else if (item.status === 'estoque-baixo') {
                                StatusIcon = FaBox;
                                statusColor = "bg-amber-50 text-amber-600 border-amber-100";
                            }

                            return (
                                <div key={item.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                                            <FaHeartbeat size={18} />
                                        </div>
                                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50/50 border border-rose-100 px-3 py-1 rounded-full">
                                            {item.categoria}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-4 group-hover:text-rose-600 transition-colors">
                                        {item.nome}
                                    </h4>
                                    
                                    {item.observacao && (
                                        <p className="text-xs text-gray-500 font-medium mb-6 line-clamp-2">
                                            {item.observacao}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                                            <StatusIcon /> 
                                            {item.status.replace("-", " ")}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
