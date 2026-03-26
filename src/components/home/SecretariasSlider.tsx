import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
    FaBuilding, FaUserTie, FaArrowRight, FaHeartbeat, FaGraduationCap, 
    FaHardHat, FaTractor, FaHandsHelping, FaFileInvoiceDollar, FaBalanceScale,
    FaBus, FaTheaterMasks, FaLandmark, FaShieldAlt
} from "react-icons/fa";

// Função para retornar o ícone correto de acordo com a área
function getSecretariaIcon(nome: string) {
    const n = nome.toLowerCase();
    if (n.includes('saúde') || n.includes('saude')) return FaHeartbeat;
    if (n.includes('educação') || n.includes('educacao') || n.includes('cultura')) return FaGraduationCap;
    if (n.includes('obras') || n.includes('infraestrutura') || n.includes('urbanismo')) return FaHardHat;
    if (n.includes('agricultura') || n.includes('meio ambiente') || n.includes('recursos hídricos')) return FaTractor;
    if (n.includes('social') || n.includes('trabalho') || n.includes('habitação')) return FaHandsHelping;
    if (n.includes('finanças') || n.includes('financas') || n.includes('tributação') || n.includes('tributacao')) return FaFileInvoiceDollar;
    if (n.includes('procuradoria') || n.includes('jurídico')) return FaBalanceScale;
    if (n.includes('transporte') || n.includes('trânsito')) return FaBus;
    if (n.includes('esporte') || n.includes('lazer') || n.includes('turismo')) return FaTheaterMasks;
    if (n.includes('gabinete') || n.includes('prefeito')) return FaLandmark;
    if (n.includes('controladoria') || n.includes('controle')) return FaShieldAlt;
    
    return FaBuilding; // Ícone Padrão
}

export default async function SecretariasSlider() {
    const secretarias = await prisma.secretaria.findMany({
        orderBy: { nome: 'asc' }
    });

    if (secretarias.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#01b0ef]/5 rounded-l-full blur-3xl -z-10 transform translate-x-1/2" />
            
            <div className="max-w-[1300px] mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-1 bg-[#01b0ef] rounded-full" />
                            <span className="text-[#0088b9] font-black uppercase tracking-[0.2em] text-xs">Gestão Pública</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-800 tracking-tighter uppercase leading-[1.1]">
                            Secretarias e <br />
                            <span className="text-[#01b0ef]">Órgãos Municipais</span>
                        </h2>
                    </div>
                    <Link href="/secretarias" className="group flex items-center gap-3 bg-white border border-gray-100 px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                        <span className="text-xs font-black text-[#0088b9] uppercase tracking-widest">Ver Todas</span>
                        <div className="w-8 h-8 rounded-full bg-[#01b0ef]/10 text-[#01b0ef] flex items-center justify-center group-hover:bg-[#01b0ef] group-hover:text-white transition-colors">
                            <FaArrowRight size={12} />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Slider Container - Hidden Scrollbar with CSS snap */}
            <div className="pl-6 md:pl-[calc((100vw-1252px)/2)] pb-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar flex gap-6">
                {secretarias.map((sec) => {
                    const nomeCurto = sec.nome.replace('Secretaria Municipal de ', '').replace('Secretaria Municipal da ', '').replace('Secretaria do ', '');
                    const IconeSec = getSecretariaIcon(sec.nome);

                    return (
                        <Link key={sec.id} href={`/secretarias/${sec.slug}`} className="snap-center sm:snap-start shrink-0 w-[85vw] sm:w-[380px] group block pb-6">
                            <div className="h-full bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-50 flex flex-col justify-between group-hover:shadow-2xl group-hover:shadow-[#01b0ef]/10 group-hover:-translate-y-2 transition-all duration-300">
                                
                                <div>
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#01b0ef] group-hover:text-white transition-all duration-500 shadow-sm">
                                        <IconeSec size={28} />
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-snug mb-4 group-hover:text-[#0088b9] transition-colors line-clamp-2">
                                        {nomeCurto}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                                        {sec.descricao || "Acesse para ver informações detalhadas sobre as atribuições deste órgão."}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                            <FaUserTie size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#01b0ef]">Titular</span>
                                            <span className="text-xs font-bold text-gray-700 max-w-[150px] truncate">{sec.secretario || "A nomear"}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#01b0ef] group-hover:text-[#01b0ef] group-hover:translate-x-1 transition-all">
                                        <FaArrowRight size={12} />
                                    </div>
                                </div>
                                
                            </div>
                        </Link>
                    )
                })}
                
                {/* Spacer block purely for visual padding at the end of the scroll */}
                <div className="shrink-0 w-6 md:w-[calc((100vw-1300px)/2)]" />
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
}
