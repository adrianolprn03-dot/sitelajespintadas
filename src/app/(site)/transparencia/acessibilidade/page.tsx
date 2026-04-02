import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";
import {
    FaUniversalAccess, FaAdjust, FaSearchPlus, FaKeyboard,
    FaVolumeUp, FaCheckCircle, FaExclamationTriangle, FaEnvelope,
    FaFileAlt, FaMousePointer, FaMobile, FaExternalLinkAlt
} from "react-icons/fa";

export const metadata: Metadata = {
    title: "Acessibilidade Digital | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Recursos de acessibilidade digital, declaração de conformidade WCAG 2.1 AA e e-MAG disponíveis no portal da Prefeitura Municipal de Lajes Pintadas.",
};

const recursos = [
    {
        icon: FaAdjust,
        titulo: "Alto Contraste",
        descricao: "Ative o modo de alto contraste para melhorar a legibilidade. Disponível na barra de acessibilidade no topo do portal.",
        atalho: "Botão \"Contraste\" na barra superior",
        cor: "from-slate-700 to-slate-900",
    },
    {
        icon: FaSearchPlus,
        titulo: "Ajuste de Tamanho de Fonte",
        descricao: "Aumente ou diminua o tamanho do texto do portal para melhor conforto de leitura.",
        atalho: "Botões A+ / A- na barra superior",
        cor: "from-blue-600 to-indigo-700",
    },
    {
        icon: FaKeyboard,
        titulo: "Navegação por Teclado",
        descricao: "O portal suporta navegação completa por teclado. Utilize Tab para avançar entre elementos e Enter para ativar links.",
        atalho: "Tecla Tab, Enter e Esc",
        cor: "from-emerald-500 to-teal-600",
    },
    {
        icon: FaVolumeUp,
        titulo: "VLibras — Libras",
        descricao: "Plugin oficial do Governo Federal para tradução automática do conteúdo do portal para a Língua Brasileira de Sinais (Libras).",
        atalho: "Ícone VLibras no canto inferior direito",
        cor: "from-purple-600 to-violet-700",
    },
    {
        icon: FaMousePointer,
        titulo: "Atalhos de Navegação Rápida",
        descricao: "Links de acesso rápido ao início do conteúdo principal, menu e campo de busca, disponíveis para usuários de leitores de tela.",
        atalho: "[1] Conteúdo, [2] Menu, [3] Busca",
        cor: "from-amber-500 to-orange-600",
    },
    {
        icon: FaMobile,
        titulo: "Design Responsivo",
        descricao: "O portal é adaptado para dispositivos móveis, tablets e desktops, garantindo uma experiência acessível em qualquer tela.",
        atalho: "Automático",
        cor: "from-rose-500 to-pink-600",
    },
];

const normas = [
    { norma: "WCAG 2.1 AA", descricao: "Diretrizes de Acessibilidade para Conteúdo Web (W3C)", status: "Conforme" },
    { norma: "e-MAG 3.1", descricao: "Modelo de Acessibilidade em Governo Eletrônico (Governo Federal)", status: "Conforme" },
    { norma: "Lei Brasileira de Inclusão (LBI)", descricao: "Lei 13.146/2015 — acessibilidade digital para pessoas com deficiência", status: "Conforme" },
    { norma: "Decreto 5.296/2004", descricao: "Regulamenta acessibilidade nos portais e sítios eletrônicos governamentais", status: "Conforme" },
];

export default function AcessibilidadePage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Acessibilidade Digital"
                subtitle="Declaração de conformidade e recursos de acessibilidade do Portal da Prefeitura Municipal de Lajes Pintadas."
                variant="premium"
                icon={<FaUniversalAccess />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Acessibilidade" }
                ]}
            />

            <div className="w-full px-6 md:px-12 lg:px-20 py-12 space-y-16">

                {/* Declaração de Conformidade */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Declaração de Conformidade</h2>
                    </div>
                    <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl shadow-primary-900/5 border border-primary-50/50">
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="flex-1">
                                <p className="text-gray-600 leading-relaxed font-medium mb-6">
                                    A Prefeitura Municipal de Lajes Pintadas tem o compromisso de garantir a acessibilidade 
                                    do seu portal eletrônico em conformidade com as normas vigentes de acessibilidade digital. 
                                    Este portal foi desenvolvido seguindo as diretrizes do <strong>WCAG 2.1 Nível AA</strong> (Web Content 
                                    Accessibility Guidelines) e do <strong>e-MAG 3.1</strong> (Modelo de Acessibilidade em Governo Eletrônico).
                                </p>
                                <p className="text-gray-600 leading-relaxed font-medium mb-6">
                                    Nosso objetivo é garantir que todas as pessoas, independentemente de suas condições físicas, 
                                    motoras, sensoriais ou cognitivas, possam acessar as informações e serviços públicos 
                                    disponíveis neste portal de forma autônoma e igualitária.
                                </p>
                                <div className="flex flex-wrap gap-3 mt-8">
                                    {normas.map((n, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
                                            <FaCheckCircle className="text-emerald-500" size={12} />
                                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{n.norma}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-72 bg-primary-50 rounded-[2rem] p-8 border border-primary-100">
                                <h3 className="font-black text-primary-900 text-sm uppercase tracking-tighter mb-6">Informações da Avaliação</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="font-black text-emerald-600 text-sm">Parcialmente Conforme</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Revisão</p>
                                        <p className="font-bold text-gray-700 text-sm">Abril de 2026</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Método de Avaliação</p>
                                        <p className="font-bold text-gray-700 text-sm">Avaliação interna + ferramenta automática</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Próxima Revisão</p>
                                        <p className="font-bold text-gray-700 text-sm">Outubro de 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recursos Disponíveis */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-secondary-500 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Recursos de Acessibilidade Disponíveis</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recursos.map((r, i) => (
                            <div key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                                <div className={`h-1.5 bg-gradient-to-r ${r.cor}`} />
                                <div className="p-8">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${r.cor} text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <r.icon size={20} />
                                    </div>
                                    <h3 className="font-black text-primary-900 text-sm uppercase tracking-tight mb-3">{r.titulo}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-4">{r.descricao}</p>
                                    <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Como acessar</p>
                                        <p className="text-[10px] font-bold text-gray-600">{r.atalho}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Normas e Legislação */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-primary-600 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Normas e Legislação</h2>
                    </div>
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Norma</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Descrição</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {normas.map((n, i) => (
                                    <tr key={i} className="hover:bg-primary-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="font-black text-primary-900 text-sm">{n.norma}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-gray-600 text-sm font-medium">{n.descricao}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                                                <FaCheckCircle size={9} /> {n.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Problemas e Contato */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-1 bg-amber-500 rounded-full" />
                        <h2 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">Encontrou um Problema?</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-amber-50 border border-amber-200 rounded-[3rem] p-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                                    <FaExclamationTriangle size={20} />
                                </div>
                                <h3 className="font-black text-amber-900 text-base uppercase tracking-tighter">Reporte uma Barreira</h3>
                            </div>
                            <p className="text-amber-700 text-sm font-medium leading-relaxed mb-6">
                                Se você encontrou alguma barreira de acessibilidade ao utilizar este portal, ou se algum 
                                conteúdo não está acessível para você, entre em contato conosco. Estamos comprometidos em 
                                resolver o problema em até <strong>15 dias úteis</strong>.
                            </p>
                            <div className="space-y-3">
                                <a href="mailto:acessibilidade@lajespintadas.rn.gov.br" className="flex items-center gap-3 text-amber-800 font-bold text-sm hover:text-amber-900 transition-colors">
                                    <FaEnvelope className="text-amber-500" />
                                    acessibilidade@lajespintadas.rn.gov.br
                                </a>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center">
                                    <FaFileAlt size={20} />
                                </div>
                                <h3 className="font-black text-primary-900 text-base uppercase tracking-tighter">Recursos Externos</h3>
                            </div>
                            <div className="space-y-3">
                                <a href="https://emag.governoeletronico.gov.br" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                                    <span className="font-bold text-sm text-gray-600 group-hover:text-primary-700">e-MAG — Modelo de Acessibilidade Gov.</span>
                                    <FaExternalLinkAlt size={12} className="text-gray-400 group-hover:text-primary-500" />
                                </a>
                                <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                                    <span className="font-bold text-sm text-gray-600 group-hover:text-primary-700">WCAG 2.1 — W3C Diretrizes Oficiais</span>
                                    <FaExternalLinkAlt size={12} className="text-gray-400 group-hover:text-primary-500" />
                                </a>
                                <Link href="/servicos/esic"
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                                    <span className="font-bold text-sm text-gray-600 group-hover:text-primary-700">e-SIC — Solicitar Informações</span>
                                    <FaExternalLinkAlt size={12} className="text-gray-400 group-hover:text-primary-500" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <BannerPNTP />
            </div>
        </div>
    );
}
