import Link from "next/link";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { FaExternalLinkAlt } from "react-icons/fa";
export default function RadarTransparencia({ overrideUrl }: { overrideUrl?: string }) {
    const defaultUrl = "https://radardatransparencia.atricon.org.br/index.html";
    const finalHref = overrideUrl || defaultUrl;
    const isOverride = !!overrideUrl;

    return (
        <section className="bg-white py-12 px-6">
            <div className="max-w-[1240px] mx-auto">
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#002241] to-[#004b8d] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 group">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="relative z-10 flex-shrink-0 w-48 h-48 bg-white p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center">
                        <img 
                            src="https://atricon.org.br/wp-content/uploads/2023/11/Banner-Radar-Nacional-de-Transparencia-960x300-1.png" 
                            alt="Radar da Transparência Pública"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    
                    <div className="relative z-10 flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
                            Radar Nacional da <br />
                            <span className="text-secondary-400">Transparência Pública</span>
                        </h2>
                        <p className="text-gray-300 text-lg mb-10 max-w-xl font-medium">
                            Confira o índice de transparência do nosso município avaliado pela ATRICON e órgãos de controle.
                        </p>
                        <Link 
                            href={finalHref} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-white text-[#002241] px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-secondary-400 transition-all hover:scale-105 shadow-xl group/btn"
                        >
                            {isOverride ? "Acessar Radar" : "Ver no Radar"} 
                            {isOverride ? <FaExternalLinkAlt size={16} /> : <HiOutlineArrowTopRightOnSquare size={20} />}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
