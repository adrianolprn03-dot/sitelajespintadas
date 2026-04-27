import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Building2, User, MapPin, Phone, Mail, Clock, ShieldCheck, Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { motion } from "framer-motion";

export const metadata: Metadata = {
    title: "Institucional do SIC | Portal da Transparência",
    description: "Informações sobre o Serviço de Informação ao Cidadão (SIC) de Lajes Pintadas – RN.",
};

async function getConfig(chave: string, padrao: string) {
    const config = await prisma.configuracao.findUnique({ where: { chave } });
    return config?.valor || padrao;
}

export default async function InstitucionalSICPage() {
    const municipio = await getConfig("municipio_nome", "Prefeitura Municipal de Lajes Pintadas");
    const endereco = await getConfig("endereco_sede", "Rua São Francisco, nº 275 – Centro – CEP: 59.235-000");
    const horario = await getConfig("horario_funcionamento", "Segunda a Sexta, das 07:00 às 13:00");
    const email = await getConfig("contato_email_sic", "ouvidoria@lajespintadas.rn.gov.br");
    const telefone = await getConfig("contato_telefone", "(84) 9.8748 – 0287 (WhatsApp)");
    const autoridade = await getConfig("sic_autoridade", "Sidcley Gomes da Silva (Ouvidoria)");


    const secoes = [
        {
            titulo: "O que é o SIC?",
            conteudo: "O Serviço de Informações ao Cidadão (SIC) é a unidade física instalada em todos os órgãos e entidades do poder público, para atender o cidadão que deseja solicitar o acesso a informações públicas. Tem como objetivo facilitar o exercício do direito fundamental de acesso à informação, em conformidade com a Lei nº 12.527/2011 (Lei de Acesso à Informação).",
            icon: Info,
            color: "text-blue-600 bg-blue-50"
        },
        {
            titulo: "Responsabilidades",
            conteudo: "Ao SIC compete: Atender e orientar o público quanto ao acesso a informações; Informar sobre a tramitação de documentos nas suas respectivas unidades; Protocolizar documentos e requerimentos de acesso a informações; e Realizar a gestão dos pedidos de acesso e recursos interpostos no sistema eletrônico (e-SIC).",
            icon: ShieldCheck,
            color: "text-emerald-600 bg-emerald-50"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Institucional do SIC"
                subtitle="Unidade de atendimento presencial e eletrônico para acesso à informação pública."
                variant="premium"
                icon={<Building2 />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Institucional" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Conteúdo Principal */}
                    <div className="lg:col-span-2 space-y-12">
                        {secoes.map((secao, idx) => (
                            <section key={idx} className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className={`w-14 h-14 ${secao.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                                        <secao.icon size={28} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                                        {secao.titulo}
                                    </h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {secao.conteudo}
                                </p>
                            </section>
                        ))}

                        <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><User size={20} /></span>
                                Autoridade de Monitoramento
                            </h2>
                            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 italic text-gray-500">
                                <p className="mb-4 font-bold text-gray-700 not-italic">Autoridade Responsável: {autoridade}</p>
                                <p>Em conformidade com o Art. 40 da Lei Federal nº 12.527/2011, a Autoridade de Monitoramento do SIC é vinculada diretamente à pasta de Administração e Planejamento, assegurando o cumprimento das normas relativas ao acesso à informação.</p>
                            </div>

                        </section>
                    </div>

                    {/* Sidebar de Contato SIC */}
                    <div className="space-y-8">
                        <div className="bg-white border-2 border-blue-600/10 rounded-[3rem] p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
                            
                            <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <Info className="text-blue-600" size={24} />
                                Atendimento Presencial
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Localização</p>
                                        <p className="text-sm font-bold text-gray-700 leading-snug">{endereco}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Horário</p>
                                        <p className="text-sm font-bold text-gray-700">{horario}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Telefone</p>
                                        <p className="text-sm font-bold text-gray-700">{telefone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mail</p>
                                        <p className="text-sm font-bold text-gray-700">{email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                                    Você também pode abrir sua solicitação de forma totalmente eletrônica através do e-SIC.
                                </p>
                                <a href="/servicos/esic" className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                                    Acessar e-SIC Online
                                </a>
                            </div>
                        </div>

                        {/* Banner Rodapé Sidebar */}
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                            <h4 className="font-black uppercase text-xs tracking-widest mb-3">Lei de Acesso à Informação</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                                A transparência pública é a regra, o sigilo a exceção. Exerça sua cidadania.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
