import Link from "next/link";
import { HiOutlineDocumentMagnifyingGlass, HiOutlineArrowLongRight, HiOutlineEye } from "react-icons/hi2";
import { prisma } from "@/lib/prisma";
import { FaExternalLinkAlt } from "react-icons/fa";

// Mapeamento de status do banco → exibição
function getStatusDisplay(status: string): { label: string; className: string } {
    const map: Record<string, { label: string; className: string }> = {
        aberta:       { label: "Aberta",       className: "text-blue-700 bg-blue-50 border-blue-100" },
        "em-andamento": { label: "Em Andamento", className: "text-amber-700 bg-amber-50 border-amber-100" },
        concluida:    { label: "Concluída",    className: "text-green-700 bg-green-50 border-green-100" },
        cancelada:    { label: "Cancelada",    className: "text-red-700 bg-red-50 border-red-100" },
        suspensa:     { label: "Suspensa",     className: "text-purple-700 bg-purple-50 border-purple-100" },
        deserta:      { label: "Deserta",      className: "text-gray-700 bg-gray-50 border-gray-200" },
    };
    return map[status?.toLowerCase()] ?? { label: status, className: "text-gray-700 bg-gray-50 border-gray-200" };
}

export default async function TransparenciaHub() {
    const [override, licitacoes] = await Promise.all([
        (prisma as any).linkExterno.findFirst({
            where: { ativo: true, moduloAlvo: "home-transparencia" }
        }),
        prisma.licitacao.findMany({
            orderBy: { criadoEm: "desc" },
            take: 4,
            select: { id: true, numero: true, ano: true, modalidade: true, objeto: true, status: true },
        }),
    ]);

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
                        {licitacoes.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                    Nenhuma licitação cadastrada no momento.
                                </p>
                            </div>
                        ) : licitacoes.map((licitacao) => {
                            const statusDisplay = getStatusDisplay(licitacao.status);
                            const editalLabel = `Nº ${licitacao.numero}/${licitacao.ano}`;
                            return (
                                <div key={licitacao.id} className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-6 px-8 lg:px-10 py-9 items-center hover:bg-gray-50/50 transition-all group">

                                    <div className="col-span-2 font-black text-[#0088b9] text-sm lg:text-lg">
                                        <span className="lg:hidden block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Edital</span>
                                        {editalLabel}
                                    </div>

                                    <div className="col-span-2 text-gray-500 font-bold text-xs uppercase tracking-tight">
                                        <span className="lg:hidden block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Modalidade</span>
                                        {licitacao.modalidade}
                                    </div>

                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusDisplay.className}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2.5 animate-pulse" />
                                            {statusDisplay.label}
                                        </span>
                                    </div>

                                    <div className="col-span-5 text-[#0088b9] font-bold text-[13px] leading-relaxed pr-6">
                                        {licitacao.objeto}
                                    </div>

                                    <div className="col-span-1 flex justify-end lg:justify-center">
                                        <Link 
                                            href={`/transparencia/licitacoes`}
                                            className="w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#01b0ef] hover:border-[#01b0ef] hover:shadow-xl hover:-translate-y-1 transition-all"
                                            title="Ver Licitações"
                                        >
                                            <HiOutlineEye size={22} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
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
