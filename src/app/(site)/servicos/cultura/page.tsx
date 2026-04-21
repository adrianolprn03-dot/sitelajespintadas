import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { 
    HiOutlineMapPin, 
    HiOutlineClock, 
    HiOutlinePhone,
    HiOutlinePaintBrush
} from "react-icons/hi2";

export const metadata: Metadata = {
    title: "Cultura, Esporte e Lazer | Prefeitura de Lajes Pintadas – RN",
    description: "Equipamentos culturais e esportivos disponíveis à população de Lajes Pintadas",
};

export default async function CulturaPage() {
    const unidades = await (prisma as any).unidadeAtendimento.findMany({
        where: { tipo: "Cultura", ativa: true },
        orderBy: { nome: 'asc' }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <PageHeader
                title="Cultura, Esporte e Lazer"
                subtitle="Equipamentos culturais e esportivos disponíveis à população."
                variant="premium"
                icon={<HiOutlinePaintBrush className="w-8 h-8" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços", href: "/servicos" },
                    { label: "Cultura e Esporte" }
                ]}
            />
            
            <div className="max-w-7xl mx-auto px-6 py-16 mb-20 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {unidades.length === 0 ? (
                        <div className="lg:col-span-2 text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">Nenhuma unidade cultural ou esportiva cadastrada no momento.</p>
                        </div>
                    ) : unidades.map((unidade: any) => (
                        <div key={unidade.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 hover:shadow-primary-900/10 transition-all duration-500 border border-transparent hover:border-primary-100 flex flex-col h-full">
                            {/* Header do Card com Gradiente */}
                            <div className="bg-gradient-to-br from-[#4f6efe] to-[#3a4dff] p-8 md:p-10 text-white relative">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <HiOutlinePaintBrush size={120} />
                                </div>
                                
                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                        <HiOutlinePaintBrush size={32} className="text-white" />
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

                                {/* Telefone */}
                                {unidade.telefone && (
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors duration-400">
                                            <HiOutlinePhone size={22} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                                                Contato Info
                                            </span>
                                            <span className="text-[#002241] font-bold text-sm leading-relaxed">
                                                {unidade.telefone}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mapa Incorporado ou Link */}
                            {unidade.mapa && (
                                <div className="px-10 pb-10">
                                    <div className="rounded-[1.5rem] overflow-hidden border border-gray-100 h-48 mb-4">
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
                                    <a 
                                        href={unidade.mapa} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-primary-600 hover:text-white text-primary-900 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                                    >
                                        Abrir no Google Maps Integrado
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
