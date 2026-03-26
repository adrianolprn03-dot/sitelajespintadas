import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ListaDocumentosClient from "@/components/ListaDocumentosClient";
import { FaScaleBalanced, FaFileInvoiceDollar, FaChartLine } from "react-icons/fa6";

export const metadata: Metadata = {
    title: "Transparência Fiscal (LRF) | Prefeitura de Lajes Pintadas – RN",
    description: "Relatórios Resumidos de Execução Orçamentária (RREO) e Relatórios de Gestão Fiscal (LRF) em conformidade com a LC 101/2000.",
};

export default function LRFPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Transparência Fiscal (LRF)"
                subtitle="Acompanhamento rigoroso da gestão fiscal e execução orçamentária do município."
                variant="premium"
                icon={<FaScaleBalanced />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Fiscal (LRF)" }
                ]}
            />

            {/* Seção Educativa de Luxo */}
            <div className="max-w-[1240px] mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-900/5 border border-white flex flex-col md:flex-row gap-8 items-center md:items-start group hover:-translate-y-1 transition-all duration-500">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FaFileInvoiceDollar size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4 group-hover:text-blue-600 transition-colors inline-flex items-center gap-3">
                                RREO
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest font-black">Bimestral</span>
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">
                                o **Relatório Resumido da Execução Orçamentária** apresenta o balanço da execução do orçamento (Receitas e Despesas) e demonstrativos de resultados primário e nominal.
                            </p>
                            <div className="flex gap-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">LC 101 Art. 52</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-emerald-900/5 border border-white flex flex-col md:flex-row gap-8 items-center md:items-start group hover:-translate-y-1 transition-all duration-500">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                            <FaChartLine size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4 group-hover:text-emerald-600 transition-colors inline-flex items-center gap-3">
                                RGF
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest font-black">Quadrimestral</span>
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">
                                o **Relatório de Gestão Fiscal** foca nos limites da LRF, como gastos com pessoal, dívida consolidada, garantias e disponibilidades de caixa.
                            </p>
                            <div className="flex gap-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">LC 101 Art. 54</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="pt-8">
                <ListaDocumentosClient 
                    tipoDocumento="lrf" 
                    tituloVazio="Nenhum relatório fiscal" 
                />
            </div>
        </div>
    );
}
