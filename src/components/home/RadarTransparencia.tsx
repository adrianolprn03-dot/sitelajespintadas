import Link from "next/link";
import { FaExternalLink, FaChartPie, FaCheckCircle, FaShield } from "react-icons/fa";
import { motion } from "framer-motion";

export default function RadarTransparencia() {
    const radarUrl = "https://radardatransparencia.atricon.org.br/index.html";

    return (
        <section className="bg-[#f8fafc] py-24 px-6 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="max-w-[1240px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side: Text Content */}
                    <div className="flex-1 space-y-10">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                            <FaShield className="animate-pulse" /> PNTP 2026 – ATRICON / TCU
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-6">
                            Nosso compromisso <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">é com a verdade.</span>
                        </h2>
                        
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                            O Radar Nacional de Transparência Pública monitora o cumprimento da Lei de Acesso à Informação em todos os municípios. 
                            Estamos trabalhando para elevar nossa pontuação e garantir um governo cada vez mais aberto.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: <FaCheckCircle className="text-emerald-500" />, text: "Transparência Ativa" },
                                { icon: <FaCheckCircle className="text-emerald-500" />, text: "Acesso à Informação" },
                                { icon: <FaCheckCircle className="text-emerald-500" />, text: "Dados Abertos" },
                                { icon: <FaCheckCircle className="text-emerald-500" />, text: "Portal Cidadão" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    {item.icon}
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link 
                                href={radarUrl} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all hover:scale-105 shadow-2xl active:scale-95 group"
                            >
                                Consultar Índice Oficial <FaExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                            
                            <Link 
                                href="/transparencia/radar"
                                className="inline-flex items-center gap-3 bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl"
                            >
                                Saiba Mais Sobre o Radar
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Visual Element */}
                    <div className="flex-shrink-0 relative w-full lg:w-[450px]">
                        <div className="relative z-10 bg-white p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 rotate-3 hover:rotate-0 transition-transform duration-700 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[4rem]" />
                            <img 
                                src="https://atricon.org.br/wp-content/uploads/2023/11/Banner-Radar-Nacional-de-Transparencia-960x300-1.png" 
                                alt="Radar da Transparência Pública"
                                className="w-full h-auto object-contain relative z-10"
                            />
                            <div className="mt-12 flex items-center justify-center gap-8 border-t border-slate-50 pt-8 relative z-10">
                                <div className="text-center">
                                    <div className="text-3xl font-black text-slate-900">2026</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Ciclo Atual</div>
                                </div>
                                <div className="w-[1px] h-10 bg-slate-100" />
                                <div className="text-center">
                                    <div className="text-3xl font-black text-blue-600">PNTP</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Programa</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500 rounded-3xl rotate-12 -z-10 shadow-2xl shadow-emerald-500/20" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600 rounded-[2.5rem] -rotate-6 -z-10 shadow-2xl shadow-blue-600/20" />
                    </div>
                </div>
            </div>
        </section>
    );
}
