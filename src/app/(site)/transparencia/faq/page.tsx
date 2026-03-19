import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaQuestionCircle, FaChevronDown } from "react-icons/fa";
import ExportButtons from "@/components/transparencia/ExportButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Perguntas Frequentes | Prefeitura de Lajes Pintadas",
    description: "Respostas para as dúvidas mais comuns dos cidadãos de Lajes Pintadas – RN.",
};

export default async function FAQPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { ordem: "asc" }
    });

    const categorias = Array.from(new Set(faqs.map(f => f.categoria || "Geral")));

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Perguntas Frequentes"
                subtitle="Encontre respostas rápidas para as principais dúvidas sobre os serviços e a administração municipal."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "FAQ" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="mb-12">
                    <ExportButtons data={faqs} filename="faq_lajes_pintadas" />
                </div>

                {faqs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <span className="text-6xl block mb-4">🔦</span>
                        <p className="text-gray-500 font-medium italic">Nenhuma pergunta cadastrada no momento.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {categorias.map((cat) => (
                            <section key={cat}>
                                <h2 className="text-sm font-black text-[#01b0ef] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-px bg-[#01b0ef]" /> {cat}
                                </h2>
                                <div className="grid gap-4">
                                    {faqs.filter(f => (f.categoria || "Geral") === cat).map((faq) => (
                                        <details key={faq.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0">
                                                        <FaQuestionCircle />
                                                    </div>
                                                    <h3 className="font-bold text-gray-800 text-sm md:text-base pr-4">{faq.pergunta}</h3>
                                                </div>
                                                <FaChevronDown className="text-gray-300 group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <div className="px-6 pb-6 pt-0 border-t border-gray-50 mt-2">
                                                <div className="pt-6 prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                    {faq.resposta}
                                                </div>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* Ajuda adicional */}
                <div className="mt-20 p-10 bg-[#0088b9] rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="relative">
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Não encontrou o que precisava?</h3>
                        <p className="text-blue-100 text-sm max-w-md">Utilize o nosso serviço de Ouvidoria ou o e-SIC para solicitações específicas de informação.</p>
                    </div>
                    <div className="flex gap-4 relative">
                        <a href="/servicos/esic" className="bg-white text-[#0088b9] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-colors">e-SIC</a>
                        <a href="/servicos/ouvidoria" className="bg-[#50B749] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#45a040] transition-colors shadow-lg shadow-green-900/20">Ouvidoria</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
