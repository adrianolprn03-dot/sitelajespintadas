export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaEnvelope, FaBalanceScale } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Prefeito e Vice | Portal da Transparência",
    description: "Identificação institucional dos gestores municipais de Lajes Pintadas – RN.",
};

async function getConfig(chave: string, padrao: string) {
    const config = await prisma.configuracao.findUnique({ where: { chave } });
    return config?.valor || padrao;
}

export default async function GestoresTransparencyPage() {
    const [
        prefeitoNome, prefeitoDesc, prefeitoFoto, prefeitoMandato, prefeitoPartido, prefeitoNaturalidade, prefeitoNascimento, prefeitoProfissao, prefeitoEscolaridade,
        viceNome, viceDesc, viceFoto, viceMandato, vicePartido, viceNaturalidade, viceNascimento, viceProfissao, viceEscolaridade,
        emailGabinete
    ] = await Promise.all([
        getConfig("prefeito_nome", "Luciano da Cunha"),
        getConfig("prefeito_descricao", "Gestor municipal."),
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
        getConfig("contato_email", "gabinete@lajespintadas.rn.gov.br")
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
                title="Gestores Municipais"
                subtitle="Conheça o Perfil, Trajetória e Atribuições dos Chefes do Poder Executivo de Lajes Pintadas."
                variant="premium"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Prefeito e Vice" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Banner de Transparência */}
                <div className="mb-16 bg-blue-950 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl shadow-blue-500/20">
                        <FaBalanceScale size={28} />
                    </div>
                    <div>
                        <h4 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-3">Programa Nacional de Transparência Pública</h4>
                        <p className="text-white font-bold text-base leading-relaxed tracking-tight">
                            Em cumprimento à <span className="text-blue-400">Lei nº 12.527/2011 (LAI)</span>, o município disponibiliza os dados biográficos, 
                            funcionais e de contato dos gestores públicos para assegurar o controle social e a integridade da gestão.
                        </p>
                    </div>
                </div>

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

                            <div className="mt-auto flex items-center gap-4">
                                <button className="flex-1 bg-gray-900 text-white h-16 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200">
                                    Ver Atribuições do Cargo
                                </button>
                                <a 
                                    href={`mailto:${emailGabinete}`} 
                                    className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                                    title="Enviar E-mail para o Gabinete"
                                >
                                    <FaEnvelope size={22} />
                                </a>
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

                            <div className="mt-auto flex items-center gap-4">
                                <button className="flex-1 bg-gray-900 text-white h-16 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200">
                                    Ver Atribuições do Cargo
                                </button>
                                <a 
                                    href={`mailto:${emailGabinete}`} 
                                    className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                                    title="Enviar E-mail para o Gabinete"
                                >
                                    <FaEnvelope size={22} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
