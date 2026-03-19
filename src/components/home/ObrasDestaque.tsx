import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FaHammer, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

export default async function ObrasDestaque() {
    const obras = await prisma.obra.findMany({
        take: 3,
        orderBy: { percentual: "desc" },
        where: { status: { in: ["em-andamento", "licitacao"] } }
    });

    if (obras.length === 0) return null;

    return (
        <section className="py-20 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-50 pointer-events-none" />
            
            <div className="max-w-[1200px] mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-[#01b0ef] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Investimento e Progresso</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#0088b9] uppercase tracking-tighter leading-tight">
                            Obras em <br /> <span className="text-[#50B749]">Lajes Pintadas</span>
                        </h2>
                    </div>
                    <Link href="/transparencia/obras" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#01b0ef] hover:text-[#0088b9] transition-all">
                        Ver todas as obras <div className="w-10 h-10 rounded-full border border-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors"><FaArrowRight /></div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {obras.map((o) => (
                        <Link key={o.id} href="/transparencia/obras" className="group block h-full">
                            <div className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2">
                                <div className="h-48 relative overflow-hidden bg-gray-200">
                                    {o.imagem ? (
                                        <Image src={o.imagem} alt={o.titulo} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="inset-0 flex items-center justify-center text-gray-300">
                                            <FaHammer size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                                        {o.percentual}% Concluído
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="font-black text-[#0088b9] text-base mb-3 leading-tight group-hover:text-[#01b0ef] transition-colors line-clamp-2">{o.titulo}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-6 font-medium line-clamp-2">{o.descricao}</p>
                                    
                                    <div className="mt-auto pt-6 border-t border-gray-200/50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Valor Investido</span>
                                            <span className="text-sm font-bold text-gray-700">{o.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#01b0ef] group-hover:bg-[#01b0ef] group-hover:text-white transition-all">
                                            <FaArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
