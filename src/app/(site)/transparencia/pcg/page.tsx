import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";
import { FaBuildingColumns, FaFileSignature, FaScaleBalanced } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "PCG - Prestação de Contas de Governo | Prefeitura de Lajes Pintadas – RN",
    description: "Prestação de Contas Anual de Governo do Município, incluindo Balanço-Geral e relatórios consolidados.",
};

export default function PCGPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Prestação de Contas de Governo (PCG)"
                subtitle="Transparência total sobre a gestão anual e a saúde financeira do município."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "PCG" }
                ]}
            />

            {/* Cartão Informativo de Destaque */}
            <div className="max-w-[1240px] mx-auto px-6 -mt-12 relative z-20">
                <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-blue-100 transition-colors duration-1000" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                        <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-xl shadow-blue-200">
                            <FaBuildingColumns size={40} className="text-white" />
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-6">Contas Anuais do Governo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                                        <FaFileSignature /> O que é o Balanço Geral?
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        É o documento que consolida todas as operações orçamentárias, financeiras e patrimoniais do município ao final do exercício.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                        <FaScaleBalanced /> Controle e Legalidade
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                        As contas de governo são submetidas ao parecer prévio do Tribunal de Contas e ao julgamento da Câmara Municipal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listagem de Documentos */}
            <div className="pt-12">
                <ListaDocumentosClient 
                    tipoDocumento="pcg" 
                    tituloVazio="Nenhuma Prestação de Contas encontrada" 
                />
            </div>

            {/* Rodapé da Página */}
            <div className="max-w-[1240px] mx-auto px-6 pb-24 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 border border-gray-200 text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] mb-4">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Atualizado conforme PNTP 2025
                </div>
            </div>
        </div>
    );
}
