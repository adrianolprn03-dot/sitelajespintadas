import type { Metadata } from "next";
import { FaHammer, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaChartLine } from "react-icons/fa";
import ObrasExport from "./ObrasExport";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export default async function ObrasPublicasPage() {
    const obras = await prisma.obra.findMany({
        orderBy: { criadoEm: "desc" }
    });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "concluida": return { label: "Concluída", color: "text-[#50B749] bg-green-50" };
            case "em-andamento": return { label: "Em Andamento", color: "text-[#01b0ef] bg-blue-50" };
            case "paralisada": return { label: "Paralisada", color: "text-red-600 bg-red-50" };
            case "licitacao": return { label: "Licitação", color: "text-amber-600 bg-amber-50" };
            default: return { label: status, color: "text-gray-600 bg-gray-50" };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Acompanhamento de Obras"
                subtitle="Consulte o andamento, valores e prazos das obras públicas em execução no nosso município."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Obras" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 pt-8 flex justify-end">
                <ObrasExport data={obras} />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                {obras.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <span className="text-6xl block mb-4">🏗️</span>
                        <p className="text-gray-500 font-medium italic">Informações sobre obras sendo carregadas...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {obras.map((o) => {
                            const status = getStatusInfo(o.status);
                            return (
                                <div key={o.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-white overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-500 group">
                                    {/* Imagem (opcional) */}
                                    <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden bg-gray-100">
                                        {o.imagem ? (
                                            <Image
                                                src={o.imagem}
                                                alt={o.titulo}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="inset-0 flex items-center justify-center text-gray-200">
                                                <FaHammer size={80} />
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="p-8 lg:p-12 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-[#01b0ef] text-[10px] font-black uppercase tracking-widest mb-4">
                                                <FaMapMarkerAlt /> {o.local}
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-800 mb-4 leading-tight group-hover:text-[#01b0ef] transition-colors">{o.titulo}</h2>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium line-clamp-3">
                                                {o.descricao}
                                            </p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pt-8 border-t border-gray-50">
                                                <div>
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor do Contrato</span>
                                                    <span className="font-bold text-gray-700 font-mono">
                                                        {o.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Empresa</span>
                                                    <span className="text-xs font-bold text-gray-700">{o.empresa || "Não informada"}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Previsão</span>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {o.previsaoTermino ? new Date(o.previsaoTermino).toLocaleDateString("pt-BR") : "---"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Documentação</span>
                                                    <button className="text-[10px] font-black text-[#01b0ef] uppercase hover:underline">Ver Edital</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barra de Progresso */}
                                        <div className="space-y-3 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">Progresso da Execução</span>
                                                <span className="text-blue-600">{o.percentual}%</span>
                                            </div>
                                            <div className="w-full h-3 bg-white rounded-full p-0.5 border border-gray-100 overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-400 to-[#01b0ef] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(1,176,239,0.5)]"
                                                    style={{ width: `${o.percentual}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
