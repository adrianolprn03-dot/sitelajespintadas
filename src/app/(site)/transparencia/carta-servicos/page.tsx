import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaBook, FaArrowRight, FaMapMarkerAlt, FaFileAlt, FaClock } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Carta de Serviços | Portal da Transparência",
    description: "Guia completo de serviços prestados pela Prefeitura de Lajes Pintadas – RN ao cidadão.",
};

export default async function CartaServicosTransparencyPage() {
    const servicos = await prisma.servicoCarta.findMany({
        orderBy: { categoria: "asc" }
    });

    const categorias = Array.from(new Set(servicos.map(s => s.categoria)));

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Carta de Serviços ao Cidadão"
                subtitle="O seu guia para entender como acessar e utilizar os serviços públicos municipais."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Carta de Serviços" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 pt-16">
                <ExportButtons data={servicos} filename="carta_servicos_lajes_pintadas" />
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Disclaimer Administrativo */}
                <div className="mb-16 bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/40 border border-white flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
                        <FaBook size={36} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-4">Finalidade do Documento</h4>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">A Carta de Serviços ao Usuário tem por objetivo informar o usuário sobre os serviços prestados pelo município, as formas de acesso a esses serviços e seus compromissos e padrões de qualidade de atendimento ao público.</p>
                    </div>
                </div>

                {/* Filtro de Categorias */}
                <div className="flex flex-wrap gap-4 mb-16">
                    <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all">Todos os Serviços</button>
                    {categorias.map(cat => (
                        <button key={cat} className="bg-white text-gray-400 hover:text-blue-600 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:border-blue-200 transition-all shadow-sm">{cat}</button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {servicos.length === 0 ? (
                        <div className="col-span-2 py-20 text-center">
                            <p className="text-gray-400 font-bold text-sm">Nenhum serviço cadastrado na carta eletrônica.</p>
                        </div>
                    ) : (
                        servicos.map((servico) => (
                            <div key={servico.id} className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white group hover:translate-y-[-5px] transition-all">
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full mb-3 inline-block border border-blue-100">{servico.categoria}</span>
                                        <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter leading-none">{servico.nome}</h4>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
                                        <FaArrowRight />
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed italic">{servico.descricao}</p>
                                
                                <div className="space-y-6 pt-8 border-t border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <FaMapMarkerAlt className="text-blue-400 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Onde Acessar</span>
                                            <span className="text-xs font-bold text-gray-700">{servico.local}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaClock className="text-emerald-400 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Prazo Estimado</span>
                                            <span className="text-xs font-bold text-gray-700">{servico.prazo}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FaFileAlt className="text-orange-400 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Documentação</span>
                                            <span className="text-xs font-bold text-gray-700">{servico.documentos || "---"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
