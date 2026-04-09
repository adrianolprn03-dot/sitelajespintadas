import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { 
    FaHeartPulse, FaCircleInfo, 
    FaTriangleExclamation, FaPrescriptionBottleMedical,
    FaSyringe, FaPills, FaFlaskVial
} from "react-icons/fa6";
import { FaCheck, FaBoxOpen, FaArrowRight } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { motion } from "framer-motion";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lista de Medicamentos SUS (REMUME) | Portal da Transparência",
    description: "Relação Municipal de Medicamentos Essenciais (REMUME) disponíveis nas unidades de saúde de Lajes Pintadas/RN.",
};

export default async function MedicamentosSUSPage() {
    const medicamentos = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Lista de Medicamentos SUS"
                subtitle="Consulte a Relação Municipal de Medicamentos Essenciais (REMUME) e a disponibilidade em tempo real na rede municipal."
                variant="premium"
                icon={<FaPrescriptionBottleMedical />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Medicamentos SUS" }
                ]}
            />

            <main className="max-w-[1240px] mx-auto px-6 pt-16 -mt-16 relative z-30">
                {/* Intro & Info Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-rose-900/5 border border-rose-100/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full -mr-32 -mt-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
                                Assistência <span className="text-rose-600">Farmacêutica</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed font-medium text-lg max-w-2xl mb-8 italic">
                                "Garantindo o acesso equitativo e o uso racional de medicamentos para toda a população de Lajes Pintadas."
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                    <FaCheck /> REMUME 2025
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <FaCheck /> Atualizado Hoje
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-rose-600/20 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16 blur-2xl" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <FaCircleInfo size={32} className="mb-6 opacity-80" />
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Como solicitar?</h3>
                                <p className="text-rose-100 text-sm font-medium leading-relaxed">
                                    Apresente receita médica original e documento oficial na Farmácia Básica Municipal.
                                </p>
                            </div>
                            <button className="mt-8 flex items-center justify-between bg-white text-rose-700 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-rose-50 transition-all group/btn">
                                Localizar Farmácia <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions & Summary */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-xl border border-rose-50">
                            <FaFlaskVial size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Catálogo de Itens</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{medicamentos.length} Medicamentos Selecionados</p>
                        </div>
                     </div>
                     <ExportButtons data={medicamentos} filename="lista_medicamentos_sus" />
                </div>

                {/* Grid de Itens Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {medicamentos.length === 0 ? (
                        <div className="col-span-full bg-white rounded-[4rem] p-32 text-center border-4 border-dashed border-gray-100 group">
                           <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                               <FaHeartPulse size={40} />
                           </div>
                           <h4 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-3">Relação Vazia</h4>
                           <p className="text-gray-400 font-bold text-sm uppercase tracking-widest opacity-60">A base de dados da REMUME está em processo de sincronização.</p>
                        </div>
                    ) : (
                        medicamentos.map((item: any, idx: number) => {
                            let StatusIcon = FaCheck;
                            let statusColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                            let statusLabel = "Disponível";

                            if (item.status === 'em-falta') {
                                StatusIcon = FaTriangleExclamation;
                                statusColor = "bg-rose-50 text-rose-600 border-rose-100";
                                statusLabel = "Em Falta";
                            } else if (item.status === 'estoque-baixo') {
                                StatusIcon = FaBoxOpen;
                                statusColor = "bg-amber-50 text-amber-600 border-amber-100";
                                statusLabel = "Baixo Estoque";
                            }

                            return (
                                <div 
                                    key={item.id} 
                                    className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-rose-900/10 transition-all duration-500 flex flex-col h-full overflow-hidden"
                                >
                                    {/* Icon & Category */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-14 h-14 bg-rose-50 rounded-[1.2rem] flex items-center justify-center text-rose-500 shadow-inner group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
                                            <FaPills size={22} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] bg-rose-50/80 px-4 py-1.5 rounded-full border border-rose-100/50">
                                            {item.categoria}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-4 group-hover:text-rose-600 transition-colors leading-tight">
                                            {item.nome}
                                        </h4>
                                        
                                        {item.observacao && (
                                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8 group-hover:bg-white transition-colors">
                                                <p className="text-xs text-slate-500 font-bold leading-relaxed italic opacity-90">
                                                    "{item.observacao}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Section */}
                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${statusColor}`}>
                                            <StatusIcon size={14} className="animate-pulse" /> 
                                            {statusLabel}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-400 transition-all">
                                            <FaCheck size={12} />
                                        </div>
                                    </div>

                                    {/* Decorative Element */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-50/30 rounded-full blur-3xl group-hover:bg-rose-600/5 transition-colors duration-700 -z-10" />
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Section */}
                <div className="border-t border-slate-100 pt-20 pb-32">
                    <BannerPNTP />
                    
                    <div className="mt-20 space-y-4 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] leading-loose">
                            SISTEMA ÚNICO DE SAÚDE • GESTÃO FARMACÊUTICA <br/>
                            <span className="opacity-50">Lajes Pintadas/RN • Transparência em Saúde Pública</span>
                        </p>
                        <div className="flex justify-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-rose-500/20" />
                             <div className="w-12 h-2 rounded-full bg-rose-500/20" />
                             <div className="w-2 h-2 rounded-full bg-rose-500/20" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
