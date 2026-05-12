import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import {
    Building2, MapPin, Phone, Mail, Clock, Globe,
    FileText, Users, ChevronRight, ExternalLink,
    Shield, Award, Landmark, Download, Info
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Dados Institucionais | Portal da Transparência – Lajes Pintadas/RN",
    description: "Informações oficiais da Prefeitura Municipal de Lajes Pintadas – RN: CNPJ, endereço, organograma, competências e símbolos municipais, em conformidade com a PNTP 2026.",
};

async function getConfig(chave: string, padrao: string) {
    try {
        const config = await prisma.configuracao.findUnique({ where: { chave } });
        return config?.valor || padrao;
    } catch {
        return padrao;
    }
}

async function getSecretarias() {
    try {
        return await prisma.secretaria.findMany({
            where: { ativa: true },
            orderBy: { ordem: "asc" },
            select: { id: true, nome: true, secretario: true, email: true, telefone: true }
        });
    } catch {
        return [];
    }
}

export default async function InstitucionalPage() {
    const [
        razaoSocial, cnpj, endereco, cep,
        horario, email, telefone, site,
        prefeitoNome, viceNome, secretarias
    ] = await Promise.all([
        getConfig("municipio_nome", "Prefeitura Municipal de Lajes Pintadas"),
        getConfig("cnpj", "08.106.505/0001-24"),
        getConfig("endereco_sede", "Rua São Francisco, nº 275 – Centro"),
        getConfig("cep", "59.235-000"),
        getConfig("horario_funcionamento", "Segunda a Sexta, das 07h às 13h"),
        getConfig("contato_email", "contato@lajespintadas.rn.gov.br"),
        getConfig("contato_telefone", "(84) 3000-0000"),
        getConfig("site_url", "www.lajespintadas.rn.gov.br"),
        getConfig("prefeito_nome", "Luciano da Cunha"),
        getConfig("vice_nome", "João Maria Silva"),
        getSecretarias(),
    ]);

    const fichaBasica = [
        { label: "Razão Social", value: razaoSocial, icon: Building2 },
        { label: "CNPJ", value: cnpj, icon: FileText },
        { label: "Endereço da Sede", value: `${endereco} – Lajes Pintadas/RN`, icon: MapPin },
        { label: "CEP", value: cep, icon: Globe },
        { label: "Horário de Atendimento", value: horario, icon: Clock },
        { label: "E-mail Oficial", value: email, icon: Mail },
        { label: "Telefone", value: telefone, icon: Phone },
        { label: "Portal Oficial", value: site, icon: Globe },
    ];

    const competencias = [
        "Administrar os serviços públicos municipais com eficiência, transparência e responsabilidade",
        "Elaborar e executar o Plano Plurianual (PPA), a Lei de Diretrizes Orçamentárias (LDO) e a Lei Orçamentária Anual (LOA)",
        "Garantir a prestação dos serviços de saúde, educação, assistência social, infraestrutura e meio ambiente",
        "Arrecadar tributos municipais e aplicar os recursos com observância aos princípios constitucionais",
        "Promover o desenvolvimento urbano e rural do território municipal",
        "Assegurar o acesso à informação pública, nos termos da Lei nº 12.527/2011 (LAI)",
        "Executar programas e projetos em parceria com o Estado e a União conforme convênios firmados",
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Dados Institucionais"
                subtitle="Identificação, competências, estrutura organizacional e localização da Prefeitura Municipal de Lajes Pintadas/RN."
                variant="premium"
                icon={<Landmark />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dados Institucionais" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 space-y-12">

                {/* Banner PNTP */}
                <div className="bg-blue-950 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                        <Shield size={26} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">PNTP 2026 — Conformidade</p>
                        <p className="text-white font-bold text-sm leading-relaxed">
                            Esta página atende ao <strong>Art. 8º, §1º da Lei nº 12.527/2011 (LAI)</strong> e aos critérios do
                            Programa Nacional de Transparência Pública (PNTP 2026), publicando os dados de identificação
                            institucional, competências, estrutura e localização da entidade.
                        </p>
                    </div>
                    <Link
                        href="/transparencia/radar"
                        className="shrink-0 flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all"
                    >
                        <Award size={14} /> Ver Radar PNTP
                    </Link>
                </div>

                {/* Grid Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Ficha Cadastral */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <Building2 size={20} />
                                </span>
                                Identificação da Entidade
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {fichaBasica.map((item) => (
                                    <div
                                        key={item.label}
                                        className="group bg-gray-50 hover:bg-white hover:shadow-lg rounded-2xl p-5 border border-gray-100 transition-all duration-300"
                                    >
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">{item.label}</p>
                                        <div className="flex items-center gap-3">
                                            <item.icon size={14} className="text-gray-400 shrink-0" />
                                            <p className="text-gray-700 font-bold text-sm break-all">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Competências */}
                        <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <FileText size={20} />
                                </span>
                                Competências Institucionais
                            </h2>
                            <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed italic">
                                Conforme a Lei Orgânica Municipal e o Art. 8º, I da Lei nº 12.527/2011.
                            </p>
                            <ul className="space-y-3">
                                {competencias.map((c, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <span className="shrink-0 w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-[11px] font-black mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            {i + 1}
                                        </span>
                                        <p className="text-gray-600 text-sm font-medium leading-relaxed">{c}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Organograma / Estrutura */}
                        <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <Users size={20} />
                                </span>
                                Estrutura Organizacional
                            </h2>

                            {/* Gestores */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                {[
                                    { cargo: "Prefeito Municipal", nome: prefeitoNome, cor: "bg-blue-600" },
                                    { cargo: "Vice-Prefeito", nome: viceNome, cor: "bg-indigo-500" },
                                ].map((g) => (
                                    <div key={g.cargo} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <div className={`w-12 h-12 ${g.cor} text-white rounded-xl flex items-center justify-center text-lg font-black`}>
                                            {g.nome.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{g.cargo}</p>
                                            <p className="text-gray-800 font-black text-sm">{g.nome}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Secretarias */}
                            {secretarias.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Secretarias Municipais</p>
                                    {secretarias.map((s) => (
                                        <div key={s.id} className="group flex items-center justify-between bg-gray-50 hover:bg-indigo-50 rounded-xl px-5 py-3 border border-gray-100 hover:border-indigo-200 transition-all">
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 group-hover:text-indigo-700">{s.nome}</p>
                                                {s.secretario && (
                                                    <p className="text-[10px] text-gray-400 font-medium">{s.secretario}</p>
                                                )}
                                            </div>
                                            <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                    <p className="text-sm text-gray-400 font-medium">
                                        Estrutura organizacional disponível no{" "}
                                        <Link href="/a-prefeitura/estrutura" className="text-indigo-500 font-bold hover:underline">
                                            Organograma Municipal
                                        </Link>.
                                    </p>
                                </div>
                            )}

                            <Link
                                href="/a-prefeitura/estrutura"
                                className="mt-6 inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                            >
                                Ver organograma completo <ExternalLink size={11} />
                            </Link>
                        </section>

                        {/* Símbolos Municipais */}
                        <section className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <span className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <Award size={20} />
                                </span>
                                Símbolos Municipais
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: "Brasão Oficial", emoji: "🛡️", desc: "Símbolo heráldico do município" },
                                    { label: "Bandeira Municipal", emoji: "🏳️", desc: "Bandeira oficial de Lajes Pintadas" },
                                    { label: "Hino Municipal", emoji: "🎵", desc: "Composição oficial do município" },
                                ].map((s) => (
                                    <div key={s.label} className="group text-center bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition-all">
                                        <div className="text-4xl mb-4">{s.emoji}</div>
                                        <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest mb-1">{s.label}</h3>
                                        <p className="text-[10px] text-gray-400 font-medium mb-4">{s.desc}</p>
                                        <Link
                                            href="/transparencia/simbolos"
                                            className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline"
                                        >
                                            <Download size={10} /> Baixar Arquivo
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Localização */}
                        <div className="bg-[#0f172a] rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
                            <h3 className="text-base font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <MapPin size={18} className="text-blue-400" />
                                Localização da Sede
                            </h3>
                            {/* Mapa embed */}
                            <div className="rounded-2xl overflow-hidden mb-6 border border-white/10">
                                <iframe
                                    title="Localização da Prefeitura de Lajes Pintadas"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.6!2d-36.01!3d-6.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDknMDAuMCJTIDM2wrAwMCcwMC4wIlc!5e0!3m2!1spt-BR!2sbr!4v1"
                                    width="100%"
                                    height="180"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin size={14} className="text-blue-400 shrink-0 mt-1" />
                                    <p className="text-sm font-medium text-white/70 leading-snug">
                                        {endereco}<br />
                                        Lajes Pintadas – RN<br />
                                        CEP: {cep}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={14} className="text-blue-400 shrink-0" />
                                    <p className="text-sm font-medium text-white/70">{horario}</p>
                                </div>
                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Phone size={14} className="text-blue-400 shrink-0" />
                                        <p className="text-sm font-bold">{telefone}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={14} className="text-blue-400 shrink-0" />
                                        <a href={`mailto:${email}`} className="text-sm font-bold hover:text-blue-300 transition-colors break-all">
                                            {email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links Rápidos */}
                        <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-gray-200/40 border border-white">
                            <h3 className="text-base font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                                <Info size={18} className="text-indigo-500" />
                                Links Relacionados
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Gestores Municipais", href: "/transparencia/gestores", desc: "Prefeito e Vice-Prefeito" },
                                    { label: "Carta de Serviços", href: "/transparencia/carta-servicos", desc: "Serviços ao Cidadão" },
                                    { label: "Estrutura Organizacional", href: "/a-prefeitura/estrutura", desc: "Organograma completo" },
                                    { label: "Símbolos Municipais", href: "/transparencia/simbolos", desc: "Brasão, bandeira e hino" },
                                    { label: "Lei Orgânica", href: "/transparencia/leis", desc: "Legislação base do município" },
                                    { label: "Ouvidoria", href: "/servicos/ouvidoria", desc: "Fale com a gestão" },
                                ].map((l) => (
                                    <Link
                                        key={l.href}
                                        href={l.href}
                                        className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all"
                                    >
                                        <div>
                                            <p className="text-xs font-black text-gray-700 group-hover:text-indigo-700">{l.label}</p>
                                            <p className="text-[9px] text-gray-400 font-medium">{l.desc}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Atualização */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-6">
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Atualização dos Dados</p>
                            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                                Informações atualizadas conforme a periodicidade exigida pelo Art. 8º da Lei nº 12.527/2011.
                                Dados dinâmicos sincronizados com o painel administrativo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
