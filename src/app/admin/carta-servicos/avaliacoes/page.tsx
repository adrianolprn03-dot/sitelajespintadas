"use client";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaSpinner, FaCommentAlt, FaCalendar } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

type Avaliacao = {
    id: string;
    servicoId: string;
    servico: { nome: string };
    nota: number;
    comentario: string;
    respondidoEm: string;
};

export default function AdminAvaliacoesPage() {
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAvaliacoes = async () => {
        try {
            const res = await fetch("/api/servicos/avaliar");
            const data = await res.json();
            setAvaliacoes(data || []);
        } catch (error) {
            console.error("Erro ao carregar avaliações");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvaliacoes();
    }, []);

    const renderStars = (nota: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= nota ? (
                        <FaStar key={star} className="text-yellow-400" />
                    ) : (
                        <FaRegStar key={star} className="text-gray-300" />
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Avaliações de Satisfação</h1>
                    <p className="text-gray-500 text-sm">Feedback dos cidadãos sobre os serviços da Carta.</p>
                </div>
                <a href="/admin/carta-servicos" className="text-[10px] font-black uppercase text-gray-400 hover:text-orange-600 transition-colors">Voltar para a Carta</a>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><FaSpinner className="animate-spin text-orange-500" size={30} /></div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {avaliacoes.map((av) => (
                        <div key={av.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
                            <div className="md:w-64 shrink-0">
                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-2 inline-block">
                                    {av.servico?.nome || "Serviço Removido"}
                                </span>
                                <div className="mt-2 text-2xl font-black text-gray-800 flex items-center gap-2">
                                    {av.nota} <span className="text-xs text-gray-400 font-bold uppercase">/ 5</span>
                                </div>
                                <div className="mt-2">{renderStars(av.nota)}</div>
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <FaCalendar /> {new Date(av.respondidoEm).toLocaleDateString('pt-BR')} - {new Date(av.respondidoEm).toLocaleTimeString('pt-BR')}
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 relative">
                                    <FaCommentAlt className="absolute -top-3 left-6 text-gray-100" size={20} />
                                    <p className="text-gray-600 text-sm italic">
                                        {av.comentario || "Nenhum comentário enviado."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {avaliacoes.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[2rem] border border-gray-100 text-gray-400 font-bold">
                            Nenhuma avaliação recebida até o momento.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
