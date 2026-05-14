"use client";
import { useState } from "react";
import { FaSearch, FaQuestionCircle, FaChartBar, FaUserShield, FaPhone, FaEnvelope, FaMapMarker, FaClock, FaClipboardList, FaFile, FaSmile, FaExternalLinkAlt, FaShieldAlt, FaInfoCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

const tipos = [
    { value: "reclamacao", label: "Reclamação" },
    { value: "denuncia", label: "Denúncia" },
    { value: "sugestao", label: "Sugestão" },
    { value: "elogio", label: "Elogio" },
    { value: "solicitacao", label: "Solicitação" },
];

const linksLaterais = [
    { label: "Perguntas Frequentes (FAQ)", href: "/transparencia/faq", icon: FaQuestionCircle },
    { label: "Estatísticas da Ouvidoria", href: "/transparencia/relatorios", icon: FaChartBar },
    { label: "Acompanhar Manifestação", href: "/servicos/consulta-protocolo", icon: FaSearch },
    { label: "Pesquisa de Satisfação", href: "/transparencia/pesquisa-satisfacao", icon: FaSmile },
    { label: "Regulamentação da Ouvidoria", href: "/transparencia/legislacao", icon: FaFile },
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

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* ====== COLUNA PRINCIPAL: Formulário ====== */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Botão Acompanhar */}
                        <div className="flex justify-end">
                            <Link href="/servicos/consulta-protocolo" className="bg-white border-2 border-[#0088b9] text-[#01b0ef] hover:bg-[#0088b9] hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-md">
                                <FaSearch /> Acompanhar Meu Protocolo
                            </Link>
                        </div>

                        {protocolo ? (
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-12 text-center border border-white animate-fade-in-up">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">✅</span>
                                </div>
                                <h2 className="text-2xl font-black text-[#0088b9] mb-3 uppercase tracking-tighter">Manifestação Registrada!</h2>
                                <p className="text-gray-500 mb-6 font-medium">Guarde o número de protocolo para acompanhar sua manifestação:</p>
                                <div className="bg-blue-50/50 border-2 border-blue-100/50 rounded-2xl p-8 mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01b0ef] to-[#0088b9]" />
                                    <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Número de Protocolo</p>
                                    <p className="text-2xl font-mono font-black text-[#01b0ef] tracking-wider break-all">{protocolo}</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wide">
                                        ⏱ O prazo de resposta é de <strong className="text-amber-900">30 dias corridos</strong>, prorrogáveis por mais 30 dias.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={() => setProtocolo(null)} className="flex-1 bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs hover:-translate-y-0.5">
                                        Nova Manifestação
                                    </button>
                                    <Link href="/servicos/consulta-protocolo" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs text-center hover:-translate-y-0.5">
                                        Consultar Protocolo
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-8 md:p-10 border border-white">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-[#01b0ef]/10 text-[#01b0ef] rounded-2xl flex items-center justify-center text-xl">
                                        <FaClipboardList />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#0088b9] uppercase tracking-tighter">Formulário de Manifestação</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Informações pessoais e da manifestação</p>
                                    </div>
                                </div>

                                <div className="bg-[#FDB913]/10 border border-[#FDB913]/20 rounded-2xl p-5 mb-8 flex items-start gap-3">
                                    <FaInfoCircle className="text-[#FDB913] mt-0.5 shrink-0" />
                                    <p className="text-xs text-[#0088b9] font-bold uppercase tracking-wide leading-relaxed">
                                        <strong className="text-[#FDB913]">Prazo de resposta:</strong> até 30 dias corridos (prorrogáveis por mais 30).
                                        Conforme Lei 13.460/2017, Lei 12.527/2011 e legislações vigentes.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 font-['Montserrat',sans-serif]">
                                    {/* Seção: Informações Pessoais */}
                                    <div className="border-b border-gray-100 pb-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-5 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-[#01b0ef] text-white rounded-lg flex items-center justify-center text-[10px]">1</span>
                                            Informações Pessoais
                                        </h3>

                                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors group cursor-pointer mb-4" onClick={() => setForm({ ...form, anonimo: !form.anonimo })}>
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="anonimo"
                                                    checked={form.anonimo}
                                                    onChange={(e) => setForm({ ...form, anonimo: e.target.checked })}
                                                    className="w-5 h-5 text-[#01b0ef] rounded border-gray-300 focus:ring-[#01b0ef] cursor-pointer"
                                                />
                                            </div>
                                            <label htmlFor="anonimo" className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 cursor-pointer select-none group-hover:text-gray-700 transition-colors flex items-center gap-2">
                                                <FaShieldAlt className="text-[#01b0ef]" />
                                                Desejo fazer uma manifestação anônima
                                            </label>
                                        </div>

                                        {!form.anonimo && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in-up">
                                                <div>
                                                    <label htmlFor="nome-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Seu Nome</label>
                                                    <input id="nome-ouv" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                                </div>
                                                <div>
                                                    <label htmlFor="email-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Seu E-mail</label>
                                                    <input id="email-ouv" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Seção: Dados da Manifestação */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-5 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-[#01b0ef] text-white rounded-lg flex items-center justify-center text-[10px]">2</span>
                                            Informações da Manifestação
                                        </h3>

                                        <div className="space-y-5">
                                            <div>
                                                <label htmlFor="tipo-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tipo de Manifestação *</label>
                                                <select id="tipo-ouv" required value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all cursor-pointer appearance-none">
                                                    <option value="">Selecione o tipo...</option>
                                                    {tipos.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="assunto-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Assunto *</label>
                                                <input id="assunto-ouv" type="text" required value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} placeholder="Sobre o que você deseja falar?" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                            </div>

                                            <div>
                                                <label htmlFor="descricao-ouv" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descrição Detalhada *</label>
                                                <textarea id="descricao-ouv" required rows={6} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descreva detalhadamente sua manifestação..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all resize-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={enviando} className="w-full bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-xl">
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

                    {/* ====== SIDEBAR DIREITA: Informações da Ouvidoria ====== */}
                    <div className="space-y-6">

                        {/* Card: Informações da Ouvidoria */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01b0ef] to-[#0088b9]" />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-2 pt-2">
                                <FaUserShield className="text-[#01b0ef]" /> Informações da Ouvidoria
                            </h3>
                            
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaUserShield />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Ouvidor(a)</p>
                                        <p className="text-sm font-bold text-gray-700">Secretário de Administração</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Contatos da Ouvidoria</p>
                                        <p className="text-sm font-bold text-gray-700">(84) 3533-2244</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">E-mail</p>
                                        <p className="text-sm font-bold text-gray-700 break-all">ouvidoria@lajespintadas.rn.gov.br</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaMapMarker />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Endereço da Ouvidoria</p>
                                        <p className="text-sm font-bold text-gray-700">Rua da Matriz, s/n - Centro</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Lajes Pintadas - RN, 59230-000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaClock />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Horário da Ouvidoria</p>
                                        <p className="text-sm font-bold text-gray-700">Segunda a Sexta-feira</p>
                                        <p className="text-xs text-gray-400 mt-0.5">das 07h às 13h</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Links da Ouvidoria */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-5">Mais Informações</h3>
                            <div className="space-y-1.5">
                                {linksLaterais.map((link) => (
                                    <Link 
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-[#01b0ef] hover:bg-blue-50/50 px-4 py-3 rounded-xl transition-all group"
                                    >
                                        <link.icon className="text-gray-400 group-hover:text-[#01b0ef] transition-colors shrink-0" />
                                        <span className="flex-1">{link.label}</span>
                                        <FaExternalLinkAlt className="text-[10px] text-gray-300 group-hover:text-[#01b0ef] transition-colors opacity-0 group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Card: e-SIC */}
                        <div className="bg-gradient-to-br from-[#0088b9] to-[#006a91] rounded-[2rem] p-7 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl -ml-6 -mb-6" />
                            <h3 className="text-sm font-black uppercase tracking-tighter mb-3 relative z-10 flex items-center gap-2">
                                <FaFile /> Acesso à Informação (e-SIC)
                            </h3>
                            <p className="text-blue-100 text-xs font-medium mb-5 relative z-10 leading-relaxed">
                                Solicite informações públicas à Prefeitura Municipal conforme a Lei de Acesso à Informação.
                            </p>
                            <Link href="/servicos/esic" className="inline-block bg-white text-[#0088b9] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all relative z-10">
                                Acessar e-SIC
                            </Link>
                        </div>

                        {/* Nota LGPD */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                                Esclarecemos que os dados fornecidos serão tratados com respeito à sua privacidade, seguindo a{" "}
                                <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer" className="text-[#01b0ef] hover:underline font-bold">
                                    LGPD - Lei Geral de Proteção de Dados 13.709
                                </a>
                                , de 14 de agosto de 2018.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
