export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaEnvelope, FaBalanceScale, FaUserTie } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Gestores Atuais | Prefeitura de Lajes Pintadas",
    description: "Conheça o Prefeito e Vice-Prefeito de Lajes Pintadas – RN e seus compromissos com o município.",
};

async function getConfig(chave: string, padrao: string) {
    try {
        const config = await prisma.configuracao.findUnique({ where: { chave } });
        return config?.valor || padrao;
    } catch {
        return padrao;
    }
}

export default async function PrefeitoPage() {
    const [
        prefeitoNome, prefeitoDesc, prefeitoFoto, prefeitoMandato, prefeitoPartido, prefeitoNaturalidade, prefeitoNascimento, prefeitoProfissao, prefeitoEscolaridade,
        viceNome, viceDesc, viceFoto, viceMandato, vicePartido, viceNaturalidade, viceNascimento, viceProfissao, viceEscolaridade,
        emailGabinete, telefoneGabinete
    ] = await Promise.all([
        getConfig("prefeito_nome", "Luciano da Cunha"),
        getConfig("prefeito_descricao", "Gestor municipal focado em resultados."),
        getConfig("prefeito_foto", ""),
        getConfig("prefeito_mandato", "2021 — 2024"),
        getConfig("prefeito_partido", "Não Informado"),
        getConfig("prefeito_naturalidade", "Lajes Pintadas/RN"),
        getConfig("prefeito_nascimento", "--/--/----"),
        getConfig("prefeito_profissao", "Gestor Público"),
        getConfig("prefeito_escolaridade", "Ensino Superior"),
        getConfig("vice_nome", "João Maria Silva"),
        getConfig("vice_descricao", "Vice-Prefeito."),
        getConfig("vice_foto", ""),
        getConfig("vice_mandato", "2021 — 2024"),
        getConfig("vice_partido", "Não Informado"),
        getConfig("vice_naturalidade", "Lajes Pintadas/RN"),
        getConfig("vice_nascimento", "--/--/----"),
        getConfig("vice_profissao", "Gestor Público"),
        getConfig("vice_escolaridade", "Ensino Superior"),
        getConfig("contato_email", "gabinete@lajespintadas.rn.gov.br"),
        getConfig("contato_telefone", "(84) 3000-0000")
    ]);

    const renderInfoItem = (emoji: string, label: string, value: string) => (
        <div className="flex items-center gap-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 group-hover:bg-white transition-all duration-300">
            <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm shadow-sm border border-gray-100">{emoji}</span>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-tight">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Gestão Municipal"
                subtitle="Conheça os representantes eleitos para liderar o desenvolvimento de nossa cidade."
                variant="premium"
                icon={<FaUserTie />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "A Prefeitura", href: "/a-prefeitura" },
                    { label: "Prefeito e Vice" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Prefeito */}
                    <div className="group bg-white rounded-[4rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-white hover:border-blue-200 transition-all duration-700 flex flex-col">
                        <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                            {prefeitoFoto ? (
                                <img src={prefeitoFoto} alt={prefeitoNome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Fotografia Oficial</span>
                                </div>
                            )}
                            <div className="absolute top-8 right-8">
                                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Prefeito</span>
                            </div>
                        </div>
                        <div className="p-10 lg:p-14 flex-1 flex flex-col">
                            <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-8 leading-none">{prefeitoNome}</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {renderInfoItem("📅", "Mandato", prefeitoMandato)}
                                {renderInfoItem("🏛️", "Partido", prefeitoPartido)}
                                {renderInfoItem("📍", "Naturalidade", prefeitoNaturalidade)}
                                {renderInfoItem("🎂", "Nascimento", prefeitoNascimento)}
                                {renderInfoItem("💼", "Profissão", prefeitoProfissao)}
                                {renderInfoItem("🎓", "Escolaridade", prefeitoEscolaridade)}
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 relative">
                                <span className="absolute -top-3 left-8 bg-blue-600 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Biografia</span>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-6 italic">
                                    "{prefeitoDesc}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vice-Prefeito */}
                    <div className="group bg-white rounded-[4rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-white hover:border-indigo-200 transition-all duration-700 flex flex-col">
                        <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                            {viceFoto ? (
                                <img src={viceFoto} alt={viceNome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Fotografia Oficial</span>
                                </div>
                            )}
                            <div className="absolute top-8 right-8">
                                <span className="bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Vice-Prefeito</span>
                            </div>
                        </div>
                        <div className="p-10 lg:p-14 flex-1 flex flex-col">
                            <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-8 leading-none">{viceNome}</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {renderInfoItem("📅", "Mandato", viceMandato)}
                                {renderInfoItem("🏛️", "Partido", vicePartido)}
                                {renderInfoItem("📍", "Naturalidade", viceNaturalidade)}
                                {renderInfoItem("🎂", "Nascimento", viceNascimento)}
                                {renderInfoItem("💼", "Profissão", viceProfissao)}
                                {renderInfoItem("🎓", "Escolaridade", viceEscolaridade)}
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 relative">
                                <span className="absolute -top-3 left-8 bg-indigo-600 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Biografia</span>
                                <p className="text-gray-600 text-sm leading-relaxed font-medium line-clamp-6 italic">
                                    "{viceDesc}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gabinete do Prefeito */}
                <div className="mt-20 p-12 bg-blue-950 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Gabinete do Prefeito</h3>
                            <p className="text-blue-100 font-medium max-w-xl leading-relaxed">
                                O Gabinete é o canal direto de interlocução entre a população e os gestores. Estamos abertos para ouvir sugestões e demandas que ajudem a construir uma cidade melhor.
                            </p>
                        </div>
                        <div className="shrink-0 space-y-4 w-full md:w-auto">
                            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                    <FaEnvelope size={18} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-400">E-mail Oficial</p>
                                    <span className="text-sm font-bold">{emailGabinete}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <span className="text-lg">📞</span>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Telefone Gabinete</p>
                                    <span className="text-sm font-bold">{telefoneGabinete}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
