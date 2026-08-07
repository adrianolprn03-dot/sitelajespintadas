import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { 
    HiOutlineAcademicCap, 
    HiOutlineMapPin, 
    HiOutlineClock, 
    HiOutlinePhone,
    HiOutlineShieldCheck,
    HiOutlineCalendar
} from "react-icons/hi2";

export const metadata: Metadata = {
    title: "Unidades Escolares | Prefeitura de Lajes Pintadas – RN",
    description: "Creches e Escolas da rede básica de ensino no município.",
};

export default async function UnidadesEscolaresPage() {
    const unidades = await (prisma as any).unidadeAtendimento.findMany({
        where: { tipo: "Educação", ativa: true },
        orderBy: { nome: 'asc' }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <PageHeader
                title="Unidades Escolares"
                subtitle="Consulte a relação completa de escolas e creches municipais, horários, meios de contato e declarações de vagas."
                variant="premium"
                icon={<HiOutlineAcademicCap className="w-8 h-8" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "O Município", href: "/municipio" },
                    { label: "Unidades Escolares" }
                ]}
            />
            
            <div className="max-w-7xl mx-auto px-6 py-12 mb-20 relative z-10 w-full">
                
                {/* ═══════ DECLARAÇÃO EM DESTAQUE - FILA DE ESPERA EM CRECHES (PNTP) ═══════ */}
                <div className="bg-gradient-to-br from-[#002241] via-[#003670] to-[#01b0ef] text-white rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-2xl shadow-blue-900/20 border border-blue-400/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    
                    <div className="relative z-10">
                        {/* Header do Destaque */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/15">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-amber-400 text-slate-900 rounded-2xl shadow-lg shadow-amber-400/20">
                                    <HiOutlineShieldCheck size={30} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.25em] block mb-1">
                                        Declaração Oficial de Transparência Pública (PNTP)
                                    </span>
                                    <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight text-white">
                                        Vagas e Fila de Espera em Creches Públicas
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-white shadow-sm">
                                <HiOutlineCalendar size={15} className="text-amber-300" />
                                <span>Atualização: <strong className="text-amber-300">01/06/2026</strong></span>
                            </div>
                        </div>

                        {/* Conteúdo da Declaração */}
                        <div className="space-y-4 text-blue-50 text-base md:text-lg leading-relaxed font-medium">
                            <p className="text-white font-bold text-sm md:text-base">
                                A Prefeitura Municipal de Lajes Pintadas, por meio da Secretaria de Educação, vem, para os devidos fins, declarar que:
                            </p>
                            <div className="p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-3xl border-l-4 border-amber-400 border border-white/15 text-white shadow-2xl">
                                <p className="font-bold text-base md:text-xl leading-relaxed text-white">
                                    “Não dispôs de fila de espera para matrícula em creches públicas no âmbito municipal, nos anos de 2023, 2024, 2025 e 2026 (até a presente data), pois todas as vagas disponíveis nas unidades de educação infantil estão sendo atendidas de acordo com a demanda registrada. Logo, não existe lista.”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {unidades.map((unidade: any) => (
                        <div key={unidade.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 hover:shadow-primary-900/10 transition-all duration-500 border border-transparent hover:border-primary-100 flex flex-col h-full">
                            {/* Header do Card com Gradiente */}
                            <div className="bg-gradient-to-br from-[#4f6efe] to-[#3a4dff] p-8 md:p-10 text-white relative">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <HiOutlineAcademicCap size={120} />
                                </div>
                                
                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                        <HiOutlineAcademicCap size={32} className="text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight mb-2">
                                            {unidade.nome}
                                        </h3>
                                        <p className="text-white/80 text-sm font-medium italic">
                                            {unidade.descricao}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Corpo do Card com Informações */}
                            <div className="p-8 md:p-10 space-y-8 flex-grow bg-white">
                                {/* Endereço */}
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors duration-400">
                                        <HiOutlineMapPin size={22} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                                            Endereço
                                        </span>
                                        <span className="text-[#002241] font-bold text-sm leading-relaxed">
                                            {unidade.endereco}
                                        </span>
                                    </div>
                                </div>

                                {/* Horário */}
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors duration-400">
                                        <HiOutlineClock size={22} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                                            Horário de Funcionamento
                                        </span>
                                        <span className="text-[#002241] font-bold text-sm leading-relaxed">
                                            {unidade.horario}
                                        </span>
                                    </div>
                                </div>

                                {/* Telefone/Contato */}
                                {unidade.telefone && (
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors duration-400">
                                            <HiOutlinePhone size={22} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                                                Telefone / Contato
                                            </span>
                                            <span className="text-[#002241] font-bold text-sm leading-relaxed">
                                                {unidade.telefone}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Link para o Mapa */}
                            {unidade.mapa && (
                                <div className="px-10 pb-10">
                                    <a 
                                        href={unidade.mapa} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 hover:bg-primary-600 hover:text-white text-primary-900 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300"
                                    >
                                        Ver localização no Mapa <HiOutlineMapPin size={14} />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
