import Link from "next/link";
import { HiOutlineDocumentMagnifyingGlass, HiOutlineArrowLongRight, HiOutlineEye } from "react-icons/hi2";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt } from "react-icons/fa";

const licitacoesDestaque = [
    {
        ano_edital: "08/2026",
        modalidade: "Edital de Chamamento",
        status: "Concluído",
        statusClass: "text-green-700 bg-green-50 border-green-100",
        objeto: "Chamado para recadastramento para permissionários e ocupantes de espaços publicos",
        href: "/licitacoes/08-2026",
    },
    {
        ano_edital: "03/2026",
        modalidade: "Edital de Chamamento",
        status: "Aberto",
        statusClass: "text-blue-700 bg-blue-50 border-blue-100",
        objeto: "Chamada pública para seleção de auxiliares de serviços educacionais",
        href: "/licitacoes/03-2026",
    },
    {
        ano_edital: "02/2026",
        modalidade: "Pregão Eletrônico",
        status: "Em Andamento",
        statusClass: "text-amber-700 bg-amber-50 border-amber-100",
        objeto: "Contratação de empresa para fornecimento de merenda escolar",
        href: "/licitacoes/02-2026",
    },
    {
        ano_edital: "01/2026",
        modalidade: "Edital de Chamamento",
        status: "Concluído",
        statusClass: "text-green-700 bg-green-50 border-green-100",
        objeto: "Processo seletivo simplificado – edital 01/2026. convocação n° 01",
        href: "/licitacoes/01-2026",
    },
];

export default async function TransparenciaHub() {
    const override = await (prisma as any).linkExterno.findFirst({
        where: { ativo: true, moduloAlvo: "home-transparencia" }
    });

    const finalHref = override ? override.url : "/transparencia";
    const isExternal = !!override;

    return (
        <section className="bg-white py-24 relative border-b border-gray-50">
            <div className="max-w-[1300px] mx-auto px-6">
                
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-16">
                    <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
                        <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#01b0ef] border-2 border-gray-50 shadow-sm">
                                <HiOutlineDocumentMagnifyingGlass size={26} />
                            </div>
                            <span className="text-[#01b0ef] font-black text-[10px] uppercase tracking-[0.3em]">Transparência Pública</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#0088b9] uppercase tracking-tighter leading-tight">
                            Licitações e Editais
                        </h2>
                        <div className="h-1.5 w-20 bg-[#FDB913] mt-6 rounded-full mx-auto lg:mx-0" />
                    </div>
                    <Link 
                        href={finalHref} 
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 text-[#01b0ef] font-black text-[11px] uppercase tracking-widest hover:text-[#0088b9] transition-all"
                    >
                        Portal da Transparência 
                        {isExternal && <FaExternalLinkAlt size={10} className="ml-1" />}
                        <HiOutlineArrowLongRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                </div>

                <div className="w-full border-2 border-gray-50 rounded-[2.5rem] bg-white shadow-2xl shadow-gray-200/40 overflow-hidden">
                    <div className="hidden lg:grid grid-cols-12 gap-6 bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] px-10 py-8 border-b border-gray-100">
                        <div className="col-span-2">Edital</div>
                        <div className="col-span-2">Modalidade</div>
                        <div className="col-span-2">Situação</div>
                        <div className="col-span-5">Objeto</div>
                        <div className="col-span-1 text-center">Ações</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {licitacoesDestaque.map((licitacao, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-6 px-8 lg:px-10 py-9 items-center hover:bg-gray-50/50 transition-all group">

                                <div className="col-span-2 font-black text-[#0088b9] text-sm lg:text-lg">
                                    <span className="lg:hidden block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Edital</span>
                                    {licitacao.ano_edital}
                                </div>

                                <div className="col-span-2 text-gray-500 font-bold text-xs uppercase tracking-tight">
                                    <span className="lg:hidden block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Modalidade</span>
                                    {licitacao.modalidade}
                                </div>

                                <div className="col-span-2">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${licitacao.statusClass}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2.5 animate-pulse" />
                                        {licitacao.status}
                                    </span>
                                </div>

                                <div className="col-span-5 text-[#0088b9] font-bold text-[13px] leading-relaxed pr-6">
                                    {licitacao.objeto}
                                </div>

                                <div className="col-span-1 flex justify-end lg:justify-center">
                                    <Link 
                                        href={licitacao.href} 
                                        className="w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#01b0ef] hover:border-[#01b0ef] hover:shadow-xl hover:-translate-y-1 transition-all"
                                        title="Visualizar Licitação"
                                    >
                                        <HiOutlineEye size={22} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* NOTA INFORMATIVA (Optional) */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        Atualizado em tempo real • Conforme Lei de Acesso à Informação
                    </p>
                </div>
            </div>
        </section>
    );
}
