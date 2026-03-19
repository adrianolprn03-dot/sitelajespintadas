"use client";
import { useState } from "react";
import { FaSpinner, FaSearch, FaQuestionCircle, FaChartBar } from "react-icons/fa";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import StatisticsDashboard from "@/components/transparencia/StatisticsDashboard";

const tipos = [
    { value: "reclamacao", label: "Reclamação" },
    { value: "denuncia", label: "Denúncia" },
    { value: "sugestao", label: "Sugestão" },
    { value: "elogio", label: "Elogio" },
    { value: "solicitacao", label: "Solicitação" },
];

export default function OuvidoriaPage() {
    const [form, setForm] = useState({ tipo: "", assunto: "", descricao: "", nome: "", email: "", anonimo: false });
    const [enviando, setEnviando] = useState(false);
    const [protocolo, setProtocolo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const res = await fetch("/api/ouvidoria", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setProtocolo(data.protocolo);
                toast.success("Manifestação registrada com sucesso!");
                setForm({ tipo: "", assunto: "", descricao: "", nome: "", email: "", anonimo: false });
            } else {
                toast.error("Erro ao enviar. Tente novamente.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Ouvidoria Municipal"
                subtitle="Canal de comunicação direta do cidadão com a Prefeitura. Registre reclamações, sugestões, elogios e denúncias."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços", href: "/servicos" },
                    { label: "Ouvidoria" }
                ]}
            />

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="flex justify-end mb-6">
                    <Link href="/servicos/consulta-protocolo" className="bg-white border-2 border-[#0088b9] text-[#01b0ef] hover:bg-[#0088b9] hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 uppercase tracking-wide">
                        <FaSearch /> Acompanhar Meu Protocolo
                    </Link>
                </div>
                {protocolo ? (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-12 text-center border border-white">
                        <div className="text-6xl mb-6">✅</div>
                        <h2 className="text-2xl font-black text-[#0088b9] mb-3 uppercase tracking-tighter">Manifestação Registrada!</h2>
                        <p className="text-gray-500 mb-6 font-medium">Guarde o número de protocolo para acompanhar sua manifestação:</p>
                        <div className="bg-blue-50/50 border-2 border-blue-100/50 rounded-2xl p-8 mb-8">
                            <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Número de Protocolo</p>
                            <p className="text-2xl font-mono font-black text-[#01b0ef] tracking-wider">{protocolo}</p>
                        </div>
                        <p className="text-xs text-gray-400 mb-8 uppercase font-bold tracking-wide">
                            O prazo de resposta é de <strong className="text-[#0088b9]">30 dias úteis</strong>, conforme a LAI.
                        </p>
                        <button onClick={() => setProtocolo(null)} className="w-full bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs">
                            Nova Manifestação
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-10 border border-white">
                        <h2 className="text-xl font-black text-[#0088b9] mb-8 uppercase tracking-tighter">Registrar Manifestação</h2>

                        <div className="bg-[#FDB913]/10 border border-[#FDB913]/20 rounded-2xl p-6 mb-8">
                            <p className="text-xs text-[#0088b9] font-bold uppercase tracking-wide leading-relaxed">
                                <strong className="text-[#FDB913]">Prazo de resposta:</strong> até 30 dias úteis (prorrogáveis por mais 30).<br />
                                Conforme Lei 12.527/2011 e legislações vigentes.
                            </p>
                        </div>

                        {/* Links de Apoio PNTP */}
                        <div className="mb-6 flex flex-wrap gap-4">
                            <Link href="/transparencia/faq" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0088b9] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                <FaQuestionCircle /> Dúvidas Frequentes (FAQ)
                            </Link>
                            <Link href="/transparencia/relatorios" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0088b9] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                <FaChartBar /> Estatísticas Ouvidoria
                            </Link>
                        </div>

                        {/* Dados Institucionais PNTP - REORGANIZADO */}
                        <div className="mb-10 p-8 bg-gray-50 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0088b9] mb-2">Unidade Responsável</p>
                                    <p className="text-gray-700 font-bold">Ouvidoria Geral do Município</p>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold mt-1">Autoridade de Monitoramento: Secretário de Administração</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0088b9] mb-2">Endereço e Horário</p>
                                    <p className="text-gray-600 font-medium">Rua da Matriz, 123 - Centro</p>
                                    <p className="text-gray-600 font-medium">Segunda a Sexta, 07h às 13h</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 md:pt-0 md:pl-8 md:border-l border-gray-200">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0088b9] mb-2">Canais de Atendimento</p>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-2 text-gray-600 font-medium">
                                            <span className="text-[#FDB913]">●</span> Telefone: (84) 3533-2244
                                        </p>
                                        <p className="flex flex-wrap items-center gap-2 text-gray-600 font-medium break-all">
                                            <span className="text-[#FDB913]">●</span> E-mail: ouvidoria@lajespintadas.rn.gov.br
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Estatísticas PNTP 2024 - Movido para cima para visibilidade imediata */}
                        <StatisticsDashboard type="ouvidoria" />

                        <form onSubmit={handleSubmit} className="space-y-6 font-['Montserrat',sans-serif]">
                            <div className="flex items-center gap-4 p-4 hover:bg-gray-100/50 rounded-2xl border border-gray-100 transition-colors group cursor-pointer" onClick={() => setForm({ ...form, anonimo: !form.anonimo })}>
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="anonimo"
                                        checked={form.anonimo}
                                        onChange={(e) => setForm({ ...form, anonimo: e.target.checked })}
                                        className="w-5 h-5 text-[#01b0ef] rounded border-gray-300 focus:ring-[#01b0ef] cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="anonimo" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 cursor-pointer select-none group-hover:text-gray-700 transition-colors">
                                    Desejo fazer uma manifestação anônima
                                </label>
                            </div>

                            {!form.anonimo && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nome-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Seu Nome</label>
                                        <input id="nome-ouv" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label htmlFor="email-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Seu E-mail</label>
                                        <input id="email-ouv" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="tipo-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tipo de Manifestação *</label>
                                <select id="tipo-ouv" required value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all cursor-pointer appearance-none">
                                    <option value="">Selecione o tipo...</option>
                                    {tipos.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="assunto-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Assunto *</label>
                                <input id="assunto-ouv" type="text" required value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} placeholder="Sobre o que você deseja falar?" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                            </div>

                            <div>
                                <label htmlFor="descricao-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descrição Detalhada *</label>
                                <textarea id="descricao-ouv" required rows={6} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva detalhadamente sua manifestação..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all resize-none" />
                            </div>

                            <button type="submit" disabled={enviando} className="w-full bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                {enviando ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                                {enviando ? "Processando..." : "Registrar Manifestação"}
                            </button>

                            <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                Manifestações protegidas pela LGPD (Lei 13.709/2018) e pela LAI (Lei 12.527/2011)
                            </p>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}
