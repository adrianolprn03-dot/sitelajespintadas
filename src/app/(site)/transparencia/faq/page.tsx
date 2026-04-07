import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaQuestionCircle, FaChevronDown, FaLightbulb, FaHeadset, FaFileLines, FaMagnifyingGlass } from "react-icons/fa6";
import ExportButtons from "@/components/transparencia/ExportButtons";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Perguntas Frequentes | Transparência Premium — Lajes Pintadas",
    description: "Respostas para as dúvidas mais comuns dos cidadãos de Lajes Pintadas – RN, em conformidade com o PNTP 2025.",
};

export default async function FAQPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { ordem: "asc" }
    });

    const categorias = Array.from(new Set(faqs.map(f => f.categoria || "Geral")));

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="FAQ – Perguntas Frequentes"
                subtitle="Encontre respostas ágeis e fundamentadas sobre os pilares da nossa administração pública."
                variant="premium"
                icon={<FaQuestionCircle />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "FAQ / Ouvidoria" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16 -mt-12 relative z-30">
                {/* Cabeçalho Bento de Apoio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <FaLightbulb size={160} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-4 block">Central de Ajuda</span>
                            <h2 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Esclarecemos suas dúvidas com foco na Lei de Acesso à Informação.</h2>
                            <div className="flex items-center gap-4 mt-8">
                                <ExportButtons data={faqs} filename="faq_lajes_pintadas" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-blue-100 transition-colors">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 w-fit group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FaMagnifyingGlass size={24} />
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{faqs.length}</div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Respostas Disponíveis</span>
                        </div>
                    </div>
                </div>

                {faqs.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FaQuestionCircle size={40} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Base de conhecimento em manutenção</h4>
                        <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto italic">Estamos atualizando nosso FAQ. Por favor, utilize a Ouvidoria se precisar de ajuda urgente.</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {categorias.map((cat) => (
                            <section key={cat} className="relative">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20">
                                        {cat}
                                    </div>
                                    <div className="h-px grow bg-slate-100" />
                                </div>

                                <div className="grid gap-6">
                                    {faqs.filter(f => (f.categoria || "Geral") === cat).map((faq) => (
                                        <details key={faq.id} className="group bg-white rounded-[1.75rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 overflow-hidden">
                                            <summary className="flex items-center justify-between p-8 cursor-pointer list-none select-none">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 group-open:bg-blue-600 group-open:text-white transition-all duration-500 shadow-inner">
                                                        <FaQuestionCircle size={20} />
                                                    </div>
                                                    <h3 className="font-black text-slate-800 text-base md:text-lg pr-4 tracking-tight group-hover:text-blue-600 transition-colors">{faq.pergunta}</h3>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-open:rotate-180 transition-transform duration-500 shadow-sm">
                                                    <FaChevronDown className="text-slate-400" size={12} />
                                                </div>
                                            </summary>
                                            <div className="px-8 pb-10 pt-4 border-t border-slate-50/50 bg-slate-50/20">
                                                <div className="prose prose-slate max-w-none text-slate-500 font-bold leading-relaxed text-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <div className="flex gap-4">
                                                        <div className="w-1 h-auto bg-blue-100 rounded-full shrink-0" />
                                                        <span className="whitespace-pre-wrap py-2">{faq.resposta}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* Call to Action Premium p/ Ouvidoria/e-SIC */}
                <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl shadow-slate-950/20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/20 to-transparent rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 text-center xl:text-left">
                        <div className="flex items-center justify-center xl:justify-start gap-3 mb-6">
                            <div className="p-3 bg-blue-600 rounded-2xl">
                                <FaHeadset size={24} />
                            </div>
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Canais Oficiais</span>
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Dúvida não resolvida?</h3>
                        <p className="text-slate-400 font-bold text-sm max-w-md mx-auto xl:mx-0">
                            Nossa equipe de transparência está pronta para atendê-lo através dos nossos canais de comunicação direta.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full xl:w-auto">
                        <a href="/servicos/esic" className="flex items-center justify-center gap-3 bg-white text-slate-900 h-16 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl group">
                            <FaFileLines className="text-blue-600" /> Sistema e-SIC
                        </a>
                        <a href="/servicos/ouvidoria" className="flex items-center justify-center gap-3 bg-blue-600 text-white h-16 px-12 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 group">
                            <FaHeadset /> Falar na Ouvidoria
                        </a>
                    </div>
                </div>

                <div className="mt-24">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
