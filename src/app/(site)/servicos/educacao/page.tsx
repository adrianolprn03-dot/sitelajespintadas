"use client";
import PageHeader from "@/components/PageHeader";
import { FaGraduationCap, FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";

import { useState, useEffect } from "react";

type Unidade = {
    id: string;
    nome: string;
    descricao: string;
    endereco: string;
    telefone: string | null;
    horario: string;
    mapa: string | null;
};

export default function EducacaoPage() {
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnidades = async () => {
            try {
                const res = await fetch("/api/unidades?tipo=educacao");
                if (res.ok) {
                    const data = await res.json();
                    setUnidades(data);
                }
            } catch (error) {
                console.error("Erro ao buscar unidades:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUnidades();
    }, []);
    return (
        <div>
            <PageHeader
                title="Educação e Escolas"
                subtitle="Lista de escolas, creches e instituições educacionais do município"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços", href: "#" },
                    { label: "Educação" }
                ]}
            />

            <div className="py-16 bg-gray-50 min-h-[400px]">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {loading ? (
                            <div className="md:col-span-2 flex justify-center py-10">
                                <div className="w-8 h-8 border-4 border-[#01b0ef] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : unidades.length === 0 ? (
                            <div className="md:col-span-2 text-center py-10 text-gray-500">
                                Nenhuma unidade escolar cadastrada no momento.
                            </div>
                        ) : unidades.map((unidade) => (
                            <div key={unidade.id} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col">
                                <div className="p-8 pb-6 flex items-start gap-4 border-b border-gray-100">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <FaGraduationCap className="text-2xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{unidade.nome}</h2>
                                        <p className="text-gray-500 text-sm mt-1">{unidade.descricao}</p>
                                    </div>
                                </div>
                                <div className="p-8 space-y-4 flex-1">
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-[#01b0ef] text-lg mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-0.5 tracking-widest">Endereço</p>
                                            <p className="text-sm font-medium text-gray-700">{unidade.endereco}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaPhoneAlt className="text-[#01b0ef] text-lg mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-0.5 tracking-widest">Telefone Público</p>
                                            <p className="text-sm font-medium text-gray-700">{unidade.telefone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaClock className="text-[#01b0ef] text-lg mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-0.5 tracking-widest">Horário de Atendimento</p>
                                            <p className="text-sm font-medium text-gray-700">{unidade.horario}</p>
                                        </div>
                                    </div>
                                </div>
                                {unidade.mapa ? (
                                    <div className="h-[250px] w-full bg-gray-200 border-t border-gray-100">
                                        <iframe
                                            src={unidade.mapa}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen={false}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`Mapa de Localização - ${unidade.nome}`}
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="h-[100px] w-full bg-gray-50 border-t border-gray-100 flex items-center justify-center">
                                        <span className="text-xs text-gray-400">Mapa não disponível</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
