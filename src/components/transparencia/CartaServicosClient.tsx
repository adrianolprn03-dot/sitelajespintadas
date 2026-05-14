"use client";
import { useState } from "react";
import { FaArrowRight, FaMapMarker, FaFile, FaClock, FaStar, FaListOl, FaUsers, FaInfoCircle, FaExternalLinkAlt, FaTimes, FaSpinner, FaCheckCircle, FaLaptop, FaHandsHelping } from "react-icons/fa";

type Servico = {
    id: string;
    nome: string;
    categoria: string;
    descricao: string;
    requisitos: string;
    etapas: string;
    formasAcesso: string;
    prioridadesAtendimento: string;
    previsaoEspera: string;
    linkAvaliacao: string;
    linkAcesso: string;
    status: string;
    local: string;
    prazo: string;
    documentos: string;
};

export default function CartaServicosClient({ servicos }: { servicos: Servico[] }) {
    const [selectedCategoria, setSelectedCategoria] = useState("Todos");
    const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
    const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
    const [evalData, setEvalData] = useState({ nota: 5, comentario: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const categorias = ["Todos", ...Array.from(new Set(servicos.map(s => s.categoria)))];
    const filteredServicos = selectedCategoria === "Todos" 
        ? servicos 
        : servicos.filter(s => s.categoria === selectedCategoria);

    const handleEvalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedServico) return;
        
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/servicos/avaliar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    servicoId: selectedServico.id,
                    nota: evalData.nota,
                    comentario: evalData.comentario
                })
            });
            if (res.ok) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    setIsEvalModalOpen(false);
                    setSubmitSuccess(false);
                    setEvalData({ nota: 5, comentario: "" });
                }, 2000);
            }
        } catch (error) {
            console.error("Erro ao avaliar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Filtro de Categorias */}
            <div className="flex flex-wrap gap-3 mb-10">
                {categorias.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setSelectedCategoria(cat)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                            selectedCategoria === cat 
                            ? "bg-blue-600 text-white shadow-blue-200" 
                            : "bg-white text-gray-400 hover:text-blue-600 border border-gray-100 hover:border-blue-200"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid de Serviços */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredServicos.length === 0 ? (
                    <div className="col-span-2 py-20 text-center">
                        <p className="text-gray-400 font-bold text-sm">Nenhum serviço encontrado nesta categoria.</p>
                    </div>
                ) : (
                    filteredServicos.map((servico) => (
                        <div key={servico.id} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/40 border border-white group hover:shadow-2xl transition-all flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full mb-3 inline-block border border-blue-100">{servico.categoria}</span>
                                    <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter leading-none">{servico.nome}</h4>
                                </div>
                                <div className={`w-3 h-3 rounded-full mt-2 ${servico.status === 'ATIVO' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`} title={servico.status}></div>
                            </div>
                            
                            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed italic line-clamp-3">{servico.descricao}</p>
                            
                            <div className="space-y-4 mb-10 flex-1">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                    <FaMapMarker className="text-blue-400 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Local</span>
                                        <span className="text-xs font-bold text-gray-700 truncate max-w-xs">{servico.local}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                    <FaClock className="text-emerald-400 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Prazo</span>
                                        <span className="text-xs font-bold text-gray-700">{servico.prazo}</span>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${servico.linkAcesso ? 'bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100' : 'bg-orange-50 border border-orange-100 group-hover:bg-orange-100'}`}>
                                    {servico.linkAcesso ? <FaLaptop className="text-indigo-500 shrink-0" /> : <FaHandsHelping className="text-orange-500 shrink-0" />}
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Disponibilidade</span>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${servico.linkAcesso ? 'text-indigo-600' : 'text-orange-600'}`}>
                                            {servico.linkAcesso ? 'Digital / Online' : 'Presencial'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                                <button 
                                    onClick={() => setSelectedServico(servico)}
                                    className="flex-[2] bg-gray-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    Ver Detalhes <FaArrowRight />
                                </button>
                                {servico.linkAcesso && (
                                    <a 
                                        href={servico.linkAcesso}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Acesso Direto ao Serviço"
                                        className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-inner"
                                    >
                                        <FaExternalLinkAlt />
                                    </a>
                                )}
                                <button 
                                    onClick={() => { setSelectedServico(servico); setIsEvalModalOpen(true); }}
                                    className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-white hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-100 flex items-center gap-2"
                                >
                                    <FaStar /> Avaliar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Detalhes (PNTP 2026 Conforme) */}
            {selectedServico && !isEvalModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedServico(null)}></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setSelectedServico(null)} className="fixed top-8 right-8 md:absolute md:top-10 md:right-10 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10">
                            <FaTimes size={20} />
                        </button>

                        <div className="p-8 md:p-12">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full mb-4 inline-block border border-blue-100">{selectedServico.categoria}</span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tighter mb-6">{selectedServico.nome}</h2>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-12">{selectedServico.descricao}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="space-y-8">
                                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                        <h5 className="flex items-center gap-3 text-xs font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
                                            <FaListOl className="text-blue-500" /> Requisitos e Documentos
                                        </h5>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-line">{selectedServico.requisitos || "Informação não disponível."}</p>
                                    </div>
                                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                        <h5 className="flex items-center gap-3 text-xs font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">
                                            <FaInfoCircle className="text-orange-500" /> Etapas do Serviço
                                        </h5>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-line">{selectedServico.etapas || "Informação não disponível."}</p>
                                    </div>
                                </section>

                                <section className="space-y-8">
                                    <div className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-xl shadow-blue-200 flex flex-col h-full">
                                        <h5 className="flex items-center gap-3 text-xs font-black text-blue-300 uppercase tracking-widest mb-6 border-b border-blue-800 pb-4">
                                            <FaExternalLinkAlt /> Formas de Acesso
                                        </h5>
                                        <p className="text-sm text-blue-100 leading-relaxed font-medium whitespace-pre-line flex-1">{selectedServico.formasAcesso || "Informação não disponível."}</p>
                                        
                                        {selectedServico.linkAcesso && (
                                            <a 
                                                href={selectedServico.linkAcesso} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="mt-8 bg-blue-500 hover:bg-white hover:text-blue-900 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
                                            >
                                                Acessar Serviço Agora <FaExternalLinkAlt />
                                            </a>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
                                            <FaUsers className="text-blue-500 text-xl" />
                                            <div>
                                                <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prioridades</h6>
                                                <p className="text-xs font-bold text-gray-700 mt-1">{selectedServico.prioridadesAtendimento || "Padrão Legal"}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4 items-start">
                                            <FaClock className="text-emerald-500 text-xl" />
                                            <div>
                                                <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Espera Prevista</h6>
                                                <p className="text-xs font-bold text-gray-700 mt-1">{selectedServico.previsaoEspera || "Conforme demanda"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setIsEvalModalOpen(true)}
                                        className="w-full bg-yellow-400 text-white p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 flex items-center justify-center gap-3"
                                    >
                                        <FaStar size={16} /> Avaliar Qualidade deste Serviço
                                    </button>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Avaliação Interna (PNTP 2026 Conforme) */}
            {isEvalModalOpen && selectedServico && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsEvalModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in fade-in zoom-in duration-300">
                        {submitSuccess ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaCheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Obrigado!</h3>
                                <p className="text-gray-500 font-medium">Sua avaliação foi registrada com sucesso.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2 text-center">Avaliar Serviço</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-center mb-10">{selectedServico.nome}</p>

                                <form onSubmit={handleEvalSubmit} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">Qual sua satisfação geral?</label>
                                        <div className="flex justify-center gap-4 text-3xl">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setEvalData({...evalData, nota: num})}
                                                    className={`transition-all transform hover:scale-125 ${evalData.nota >= num ? "text-yellow-400" : "text-gray-200"}`}
                                                >
                                                    <FaStar />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Comentário Adicional</label>
                                        <textarea
                                            value={evalData.comentario}
                                            onChange={(e) => setEvalData({...evalData, comentario: e.target.value})}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none min-h-[120px]"
                                            placeholder="Conte-nos como foi sua experiência..."
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsEvalModalOpen(false)}
                                            className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <FaSpinner className="animate-spin" /> : "Enviar Avaliação"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
