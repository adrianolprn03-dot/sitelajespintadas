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
    const prefeitoNome = await getConfig("prefeito_nome", "Luciano da Cunha");
    const prefeitoDesc = await getConfig("prefeito_descricao", "Gestor municipal.");
    const viceNome = await getConfig("vice_nome", "João Maria Silva");
    const viceDesc = await getConfig("vice_descricao", "Vice-Prefeito.");
    const prefeitoFoto = await getConfig("prefeito_foto", "");
    const viceFoto = await getConfig("vice_foto", "");
    const emailGabinete = await getConfig("contato_email", "gabinete@lajespintadas.rn.gov.br");

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Gestores Municipais"
                subtitle="Identificação e canais de contato com os chefes do Poder Executivo Municipal."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Prefeito e Vice" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="mb-16 bg-blue-50 border border-blue-100 rounded-3xl p-8 flex items-start gap-6">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                        <FaBalanceScale size={24} />
                    </div>
                    <div>
                        <h4 className="text-blue-900 font-black uppercase text-sm tracking-tight mb-2">Conformidade Legal (LAI)</h4>
                        <p className="text-blue-700/80 text-sm leading-relaxed font-medium">
                            Conforme o Art. 7º da Lei 12.527/2011, é dever do Estado garantir o acesso a informações sobre a estrutura organizacional e quem são os responsáveis pelas decisões públicas.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Prefeito */}
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white hover:border-blue-100 transition-all duration-500">
                        <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                            {prefeitoFoto ? (
                                <img src={prefeitoFoto} alt={prefeitoNome} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <span className="text-sm font-black uppercase tracking-widest">Foto do Prefeito</span>
                                </div>
                            )}
                        </div>
                        <div className="p-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest mb-4">Chefe do Executivo</span>
                            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">{prefeitoNome}</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-gray-500">
                                    <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-sm">📅</span>
                                    <span className="text-xs font-bold uppercase tracking-tight">Mandato: 2021 — 2024</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-sm">📍</span>
                                    <span className="text-xs font-bold uppercase tracking-tight">Gabinete: Sede da Prefeitura</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
                                {prefeitoDesc}
                            </p>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-gray-900 text-white text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Ver Atribuições</button>
                                <a href={`mailto:${emailGabinete}`} className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"><FaEnvelope size={20} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Vice-Prefeito */}
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-white hover:border-blue-100 transition-all duration-500">
                        <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                            {viceFoto ? (
                                <img src={viceFoto} alt={viceNome} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <span className="text-sm font-black uppercase tracking-widest">Foto do Vice-Prefeito</span>
                                </div>
                            )}
                        </div>
                        <div className="p-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest mb-4">Vice-Prefeito</span>
                            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">{viceNome}</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-gray-500">
                                    <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-sm">📅</span>
                                    <span className="text-xs font-bold uppercase tracking-tight">Mandato: 2021 — 2024</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <span className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-sm">📍</span>
                                    <span className="text-xs font-bold uppercase tracking-tight">Gabinete: Sede da Prefeitura</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
                                {viceDesc}
                            </p>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-gray-900 text-white text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Ver Atribuições</button>
                                <a href={`mailto:${emailGabinete}`} className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"><FaEnvelope size={20} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
