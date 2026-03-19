"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineClock, HiOutlineArrowLongRight } from "react-icons/hi2";

type Evento = {
    id: string;
    titulo: string;
    dataInicio: string;
    local: string | null;
    descricao: string | null;
};

export default function AgendaSection() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const res = await fetch("/api/agenda");
                const data = await res.json();
                const proximos = (data || [])
                    .filter((e: Evento) => new Date(e.dataInicio) >= new Date())
                    .slice(0, 3);
                setEventos(proximos);
            } catch (error) {
                console.error("Erro ao buscar agenda:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, []);

    if (loading) return (
        <div className="py-24 flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <section className="py-24 bg-white border-b border-gray-50" aria-labelledby="agenda-titulo">
            <div className="max-w-[1300px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* AGENDA LIST */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#01b0ef] border-2 border-gray-50 shadow-sm">
                                <HiOutlineCalendarDays size={26} />
                            </div>
                            <div>
                                <h2 id="agenda-titulo" className="text-3xl font-black text-[#0088b9] uppercase tracking-tighter">
                                    Compromissos
                                </h2>
                                <div className="h-1.5 w-16 bg-[#FDB913] mt-2 rounded-full" />
                            </div>
                        </div>

                        {eventos.length === 0 ? (
                            <div className="p-12 rounded-[2rem] border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] bg-gray-50/30">
                                Nenhum compromisso agendado
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {eventos.map((e) => {
                                    const data = new Date(e.dataInicio);
                                    const dia = data.getDate().toString().padStart(2, "0");
                                    const mes = data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
                                    const hora = data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div key={e.id} className="group flex gap-8 p-8 rounded-[2rem] bg-white border-2 border-gray-50 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-1">
                                            <div className="shrink-0 w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center bg-gray-50 text-[#01b0ef] border-2 border-white group-hover:bg-[#01b0ef] group-hover:text-white transition-all duration-500 shadow-sm">
                                                <span className="font-black text-3xl leading-none">{dia}</span>
                                                <span className="text-[11px] font-black mt-1 uppercase tracking-widest">{mes}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-black text-[#0088b9] text-xl leading-tight group-hover:text-[#01b0ef] transition-colors mb-4">{e.titulo}</h3>
                                                <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                                    <span className="flex items-center gap-2"><HiOutlineClock className="text-[#FDB913]" size={18} />{hora}</span>
                                                    <span className="flex items-center gap-2"><HiOutlineMapPin className="text-[#FDB913]" size={18} />{e.local || "Sede Administrativa"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        
                        <div className="mt-10">
                            <Link href="/a-prefeitura/agenda" className="group inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#01b0ef] hover:text-[#0088b9] transition-all">
                                Ver agenda completa <HiOutlineArrowLongRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* MENSAGEM INSTITUCIONAL */}
                    <div className="lg:col-span-5">
                        <div className="relative p-12 rounded-[3rem] bg-[#0088b9] text-white shadow-2xl overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
                            
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
                                    <span className="text-5xl">🏛️</span>
                                </div>
                                <blockquote className="mb-10">
                                    <p className="text-2xl leading-relaxed font-bold italic text-blue-50/90 tracking-tight">
                                        "Nossa gestão é pautada pela transparência e pelo compromisso com o futuro de Lajes Pintadas."
                                    </p>
                                </blockquote>
                                <div className="w-16 h-1.5 bg-[#FDB913] mb-8 rounded-full" />
                                <div className="space-y-2">
                                    <div className="font-black text-2xl tracking-tighter uppercase mb-1">Administração Municipal</div>
                                    <div className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em]">Prefeitura de Lajes Pintadas – RN</div>
                                </div>
                                
                                <Link 
                                    href="/a-prefeitura/prefeito" 
                                    className="mt-12 px-10 py-4 bg-white/10 hover:bg-white text-white hover:text-[#0088b9] border-2 border-white/10 hover:border-white rounded-full text-[11px] font-black uppercase tracking-widest transition-all backdrop-blur-sm shadow-xl"
                                >
                                    Estrutura de Governo
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
