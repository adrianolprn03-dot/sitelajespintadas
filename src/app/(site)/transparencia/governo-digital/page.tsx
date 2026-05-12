import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import {
    Smartphone, Globe, Shield, Users, Zap, CheckCircle2,
    Monitor, Lock, ArrowUpRight, FileText, HeartHandshake,
    Cpu, ExternalLink, Landmark
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Governo Digital | Portal da Transparência – Lajes Pintadas/RN",
    description: "Plano e iniciativas de transformação digital da Prefeitura Municipal de Lajes Pintadas, em conformidade com a Lei 14.129/2021 e o PNTP 2026.",
};

const pilares = [
    {
        icon: Smartphone,
        titulo: "Serviços Digitais",
        desc: "Digitalização de requerimentos: IPTU, Alvarás, Certidões e Protocolos via Portal do Cidadão.",
        cor: "bg-blue-500",
        bg: "bg-blue-50",
        borda: "border-blue-100",
    },
    {
        icon: Globe,
        titulo: "Portal Interativo",
        desc: "Atualização constante do Portal da Transparência com dados em tempo real e conformidade PNTP.",
        cor: "bg-indigo-500",
        bg: "bg-indigo-50",
        borda: "border-indigo-100",
    },
    {
        icon: Cpu,
        titulo: "Dados Abertos",
        desc: "APIs padronizadas e datasets públicos em formatos abertos (CSV, JSON, XML) conforme INDA.",
        cor: "bg-violet-500",
        bg: "bg-violet-50",
        borda: "border-violet-100",
    },
    {
        icon: HeartHandshake,
        titulo: "Participação Cidadã",
        desc: "Ouvidoria e e-SIC 100% integrados ao sistema, com prazo de resposta rastreável online.",
        cor: "bg-emerald-500",
        bg: "bg-emerald-50",
        borda: "border-emerald-100",
    },
    {
        icon: Lock,
        titulo: "Segurança da Informação",
        desc: "Controles de acesso, backup automatizado e conformidade com a LGPD (Lei 13.709/2018).",
        cor: "bg-amber-500",
        bg: "bg-amber-50",
        borda: "border-amber-100",
    },
    {
        icon: Users,
        titulo: "Inclusão Digital",
        desc: "Acessibilidade (WCAG 2.1), suporte VLibras e canal de atendimento presencial para cidadãos sem acesso à internet.",
        cor: "bg-rose-500",
        bg: "bg-rose-50",
        borda: "border-rose-100",
    },
];

const acoes = [
    { label: "Implantação do Portal da Transparência", status: "concluido", ano: "2024" },
    { label: "Integração e-SIC / Ouvidoria ao sistema", status: "concluido", ano: "2024" },
    { label: "Publicação de datasets em formato aberto", status: "em-andamento", ano: "2025" },
    { label: "Assinatura Eletrônica Interna (Gov.br)", status: "em-andamento", ano: "2025" },
    { label: "Cadastro Único Digital de Serviços", status: "planejado", ano: "2026" },
    { label: "APP Cidadão – Lajes Pintadas Mobile", status: "planejado", ano: "2026" },
];

const statusMap: Record<string, { label: string; dot: string; text: string }> = {
    "concluido": { label: "Concluído", dot: "bg-emerald-500", text: "text-emerald-700" },
    "em-andamento": { label: "Em Andamento", dot: "bg-blue-500 animate-pulse", text: "text-blue-700" },
    "planejado": { label: "Planejado", dot: "bg-amber-400", text: "text-amber-700" },
};

export default function GovernoDigitalPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Governo Digital"
                subtitle="Iniciativas de transformação digital do município para desburocratizar serviços e ampliar a transparência pública."
                variant="premium"
                icon={<Monitor />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Governo Digital" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">

                {/* Banner Legal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {["Lei 14.129/2021 – Governo Digital", "Lei 12.527/2011 – Acesso à Informação", "PNTP 2026 – Transparência Pública"].map((item) => (
                        <div key={item} className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">{item}</span>
                        </div>
                    ))}
                </div>

                {/* Intro */}
                <section className="bg-[#0f172a] text-white rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -mr-36 -mt-36 pointer-events-none" />
                    <div className="relative z-10 max-w-3xl">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Lei 14.129/2021 — Governo Digital</p>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-tight">
                            Transformação Digital<br />a serviço do Cidadão
                        </h2>
                        <p className="text-white/70 font-medium text-lg leading-relaxed mb-8">
                            O Município de Lajes Pintadas adota os princípios da nova Lei do Governo Digital para
                            desburocratizar o acesso a serviços, reduzir custos operacionais e oferecer mais
                            transparência e agilidade ao cidadão. A transformação digital não é apenas tecnologia —
                            é a reengenharia do relacionamento entre o Estado e a sociedade.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/servicos/esic" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all shadow-xl">
                                Acesse o e-SIC <ArrowUpRight size={14} />
                            </Link>
                            <Link href="/servicos/ouvidoria" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                                Ouvidoria Online <ExternalLink size={14} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pilares */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-12 h-12 bg-violet-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <Zap size={20} />
                        </span>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Pilares de Inovação</h2>
                            <p className="text-sm text-gray-400 font-medium">Iniciativas estruturantes de transformação digital municipal</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pilares.map((p) => (
                            <div key={p.titulo} className={`group bg-white rounded-[2rem] p-8 border ${p.borda} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                                <div className={`w-12 h-12 ${p.cor} text-white rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                                    <p.icon size={22} />
                                </div>
                                <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm mb-3 group-hover:text-blue-600 transition-colors">{p.titulo}</h3>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Plano de Ação */}
                <section className="bg-white rounded-[3rem] p-10 md:p-12 shadow-xl shadow-gray-200/40 border border-white">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText size={20} />
                        </span>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Plano de Ação Digital</h2>
                            <p className="text-sm text-gray-400 font-medium">Roadmap de digitalização 2024–2026</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {acoes.map((acao) => {
                            const s = statusMap[acao.status];
                            return (
                                <div key={acao.label} className="group flex items-center justify-between bg-gray-50 hover:bg-white hover:shadow-md rounded-2xl px-6 py-4 border border-gray-100 transition-all">
                                    <div className="flex items-center gap-4">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                                        <p className="text-sm font-bold text-gray-700">{acao.label}</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="hidden sm:block text-[10px] font-black text-gray-300 uppercase tracking-widest">{acao.ano}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-wide ${s.text}`}>{s.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Links */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { titulo: "Portal Gov.br", desc: "Serviços digitais do Governo Federal", href: "https://www.gov.br", icon: Globe, external: true },
                        { titulo: "LGPD – Proteção de Dados", desc: "Lei 13.709/2018 aplicada ao município", href: "/transparencia/lgpd", icon: Shield, external: false },
                        { titulo: "Dados Abertos", desc: "Datasets públicos em formato aberto", href: "/transparencia/dados-abertos", icon: Cpu, external: false },
                        { titulo: "Carta de Serviços", desc: "Catálogo de serviços municipais", href: "/transparencia/carta-servicos", icon: Landmark, external: false },
                    ].map((l) => (
                        <Link
                            key={l.titulo}
                            href={l.href}
                            target={l.external ? "_blank" : undefined}
                            rel={l.external ? "noopener noreferrer" : undefined}
                            className="group flex items-center gap-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all"
                        >
                            <div className="w-11 h-11 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                                <l.icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-gray-800 group-hover:text-indigo-700 transition-colors">{l.titulo}</p>
                                <p className="text-[11px] text-gray-400 font-medium">{l.desc}</p>
                            </div>
                            {l.external ? <ExternalLink size={14} className="text-gray-300 shrink-0" /> : <ArrowUpRight size={14} className="text-gray-300 shrink-0 group-hover:text-indigo-400" />}
                        </Link>
                    ))}
                </section>

                <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] pb-8">
                    Portal da Transparência · Prefeitura de Lajes Pintadas/RN · PNTP 2026
                </p>
            </div>
        </div>
    );
}
