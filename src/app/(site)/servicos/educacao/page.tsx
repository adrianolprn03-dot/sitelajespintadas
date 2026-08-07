"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { FaGraduationCap, FaMapMarker, FaPhone, FaClock } from "react-icons/fa";

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
                    {/* ═══════ DECLARAÇÃO EM DESTAQUE - CRECHES ═══════ */}
                    <div className="bg-gradient-to-br from-[#002241] via-[#003670] to-[#01b0ef] text-white rounded-[2.5rem] p-8 md:p-10 mb-10 shadow-2xl border border-blue-400/20 relative overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/15">
                            <h3 className="text-sm font-black uppercase tracking-widest text-amber-300">
                                Declaração de Transparência Pública (PNTP 2026) – Vagas em Creches
                            </h3>
                            <span className="text-xs font-bold text-white bg-white/15 px-3 py-1 rounded-full border border-white/20">
                                Atualização: 01/06/2026
                            </span>
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-blue-100 mb-3">
                            A Prefeitura Municipal de Lajes Pintadas, por meio da Secretaria de Educação, vem, para os devidos fins, declarar que:
                        </p>
                        <div className="p-5 md:p-6 bg-white/10 backdrop-blur-md rounded-2xl border-l-4 border-amber-400 text-white font-bold text-sm md:text-base leading-relaxed">
                            “Não dispôs de fila de espera para matrícula em creches públicas no âmbito municipal, nos anos de 2023, 2024, 2025 e 2026 (até a presente data), pois todas as vagas disponíveis nas unidades de educação infantil estão sendo atendidas de acordo com a demanda registrada. Logo, não existe lista.”
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 mb-8 bg-blue-50 rounded-3xl border border-blue-100">
                        <div>
                            <h3 className="text-base font-black text-blue-900 uppercase tracking-tight">Relação Completa de Unidades Escolares</h3>
                            <p className="text-xs text-blue-700 font-medium mt-1">Acesse a página dedicada com todas as creches e escolas municipais, horários, telefones e mapas de localização.</p>
                        </div>
                        <Link 
                            href="/unidades-escolares"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md shrink-0"
                        >
                            Ver Unidades Escolares
                        </Link>
                    </div>

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
                                        <FaMapMarker className="text-[#01b0ef] text-lg mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-0.5 tracking-widest">Endereço</p>
                                            <p className="text-sm font-medium text-gray-700">{unidade.endereco}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaPhone className="text-[#01b0ef] text-lg mt-0.5 shrink-0" />
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

            {/* Documentos e Planejamento */}
            <div className="pb-24 bg-gray-50">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="bg-[#2a7a4a] rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-green-900/20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="max-w-2xl text-center lg:text-left">
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">Planejamento e Gestão</h3>
                                <p className="text-green-100 font-medium text-sm md:text-base leading-relaxed opacity-80">
                                    Acesse o Plano Municipal de Educação (PME) e outros documentos norteadores que definem as metas e diretrizes da educação em nosso município.
                                </p>
                            </div>
                            <Link 
                                href="/transparencia/plano-educacao"
                                className="px-10 py-5 bg-white text-[#2a7a4a] font-black rounded-2xl hover:bg-[#FDB913] hover:text-white transition-all text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 shrink-0"
                            >
                                Ver Plano Municipal de Educação
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
