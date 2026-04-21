"use client";
import { useState } from "react";
import { FaUserEdit, FaBriefcase, FaCalendarCheck, FaCheckCircle, FaLock, FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ConcursoCardProps {
    item: {
        id: string;
        titulo: string;
        tipo: string;
        linkEdital: string | null;
        dataPublicacao: string | Date;
        vagas: string | null;
        status: string;
        descricao: string | null;
    };
}

export default function ConcursoCard({ item }: ConcursoCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-white hover:border-blue-100 transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-8 flex-1">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-blue-50 transition-colors shrink-0">
                        <FaBriefcase size={28} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{item.tipo}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.linkEdital ? 'Documento Vinculado' : 'Sem Edital'}</span>
                        </div>
                        <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2 group-hover:text-blue-600 transition-colors">{item.titulo}</h4>
                        
                        {item.descricao && (
                            <div className="mb-4">
                                <div className={`text-sm text-gray-500 leading-relaxed font-medium ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                    {item.descricao}
                                </div>
                                {item.descricao.length > 100 && (
                                    <button 
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-2 text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>Ver menos <FaChevronUp /></>
                                        ) : (
                                            <>Ver mais <FaChevronDown /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-6 mt-2">
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <FaCalendarCheck /> Publicação: {new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <FaUserEdit /> {item.vagas} Vagas
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
                    {item.status === 'aberto' ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                            <FaCheckCircle /> Inscrições Abertas
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                            <FaLock /> Encerrado
                        </div>
                    )}
                    
                    {item.linkEdital ? (
                        <a 
                            href={item.linkEdital} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2 group"
                        >
                            Ver Edital
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    ) : (
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Edital Indisponível</span>
                    )}
                </div>
            </div>
        </div>
    );
}
