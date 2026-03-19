import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaBuilding, FaGlobe, FaClock, FaMapMarkerAlt, FaBriefcase, FaFontAwesomeFlag } from "react-icons/fa";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Dados Institucionais | Portal da Transparência",
    description: "Informações oficiais da Prefeitura Municipal de Lajes Pintadas – RN.",
};

async function getConfig(chave: string, padrao: string) {
    const config = await prisma.configuracao.findUnique({ where: { chave } });
    return config?.valor || padrao;
}

export default async function InstitucionalTransparencyPage() {
    const razaoSocial = await getConfig("municipio_nome", "Prefeitura Municipal de Lajes Pintadas");
    const cnpj = await getConfig("cnpj", "08.000.000/0001-00");
    const endereco = await getConfig("endereco_sede", "Palácio Municipal, Centro, Lajes Pintadas - RN");
    const horario = await getConfig("horario_funcionamento", "Segunda a Sexta, das 08h às 13h");
    const email = await getConfig("contato_email", "contato@lajespintadas.rn.gov.br");
    const telefone = await getConfig("contato_telefone", "(84) 3000-0000");

    const dados = [
        { label: "Razão Social", value: razaoSocial, icon: FaBuilding },
        { label: "CNPJ", value: cnpj, icon: FaBriefcase },
        { label: "Sede Oficial", value: endereco, icon: FaMapMarkerAlt },
        { label: "CEP", value: "59230-000", icon: FaGlobe },
        { label: "Horário de Funcionamento", value: horario, icon: FaClock },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Dados Institucionais"
                subtitle="Informações cadastrais, símbolos e localização da sede do governo municipal."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dados Institucionais" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Informações Cadastrais */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <span className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><FaBuilding size={20} /></span>
                                Identificação da Entidade
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {dados.map((d) => (
                                    <div key={d.label} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                                        <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{d.label}</span>
                                        <div className="flex items-center gap-3">
                                            <d.icon className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            <p className="text-gray-700 font-bold text-sm tracking-tight">{d.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-10 flex items-center gap-4">
                                <span className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><FaFontAwesomeFlag size={20} /></span>
                                Símbolos Municipais
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {["Brasão", "Bandeira", "Hino"].map((simbolo) => (
                                    <div key={simbolo} className="text-center group">
                                        <div className="aspect-square bg-gray-50 rounded-[2.5rem] mb-6 flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-emerald-300 transition-all">
                                            <span className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity">🖼️</span>
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">{simbolo}</h3>
                                        <button className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Baixar Versão Oficial</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Localização e Contato */}
                    <div className="space-y-8">
                        <div className="bg-[#0088b9] rounded-[3rem] p-10 text-white shadow-xl">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Localização da Sede</h3>
                            <div className="aspect-video bg-white/10 rounded-3xl mb-8 flex items-center justify-center border border-white/20">
                                <span className="text-xs font-black uppercase tracking-widest opacity-50 italic">Mapa indisponível</span>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="shrink-0 mt-1 text-blue-300" />
                                    <p className="text-sm font-medium leading-relaxed">
                                        Palácio Municipal "Prefeito Alcebíades Bezerra"<br />
                                        {endereco}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#01b0ef] mb-2">Contato Oficial</p>
                                    <p className="text-sm font-bold">{email}</p>
                                    <p className="text-sm font-bold mt-1">{telefone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
