"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";
import { FaSearch, FaQuestionCircle, FaChartBar, FaUserShield, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFileAlt, FaExternalLinkAlt, FaInfoCircle, FaBullhorn, FaGavel, FaLock, FaBalanceScale, FaBook } from "react-icons/fa";
import Link from "next/link";

const linksLaterais = [
    { label: "Institucional do SIC", href: "/transparencia/institucional", icon: FaInfoCircle },
    { label: "Perguntas Frequentes (FAQ-LAI)", href: "/transparencia/faq", icon: FaQuestionCircle },
    { label: "Relatório de Solicitações do SIC", href: "/transparencia/relatorios", icon: FaChartBar },
    { label: "Gráficos e Estatísticas do SIC", href: "/transparencia/relatorios", icon: FaChartBar },
    { label: "Regulamentação da LAI", href: "/transparencia/legislacao", icon: FaGavel },
    { label: "Acesso à Informação", href: "/transparencia", icon: FaBook },
];

export default function ESICPage() {
    const [form, setForm] = useState({ orgao: "", pedido: "", nome: "", email: "", formaRetorno: "sistema" });
    const [enviando, setEnviando] = useState(false);
    const [protocolo, setProtocolo] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const res = await fetch("/api/esic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setProtocolo(data.protocolo);
                toast.success("Pedido de informação registrado com sucesso!");
                setForm({ orgao: "", pedido: "", nome: "", email: "", formaRetorno: "sistema" });
            } else {
                toast.error(data.error || "Erro ao enviar pedido.");
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
                title="e-SIC – Serviço de Informação ao Cidadão"
                subtitle="Solicite informações públicas conforme a Lei 12.527/2011 (Lei de Acesso à Informação – LAI)"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Serviços", href: "/servicos" },
                    { label: "e-SIC" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* ====== COLUNA PRINCIPAL ====== */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Botão Acompanhar */}
                        <div className="flex justify-end">
                            <Link href="/servicos/consulta-protocolo" className="bg-white border-2 border-[#0088b9] text-[#01b0ef] hover:bg-[#0088b9] hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-md">
                                <FaSearch /> Acompanhar Meu Protocolo
                            </Link>
                        </div>

                        {/* Card: "O que é o e-SIC?" */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-8 md:p-10 border border-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#01b0ef]/10 text-[#01b0ef] rounded-2xl flex items-center justify-center text-xl">
                                    <FaInfoCircle />
                                </div>
                                <div>
                                    <h2 className="font-black text-[#0088b9] text-lg uppercase tracking-tighter">O que é o e-SIC?</h2>
                                </div>
                            </div>
                            <p className="text-gray-500 leading-relaxed mb-8 font-medium text-sm">
                                O SIC (Serviço de Informações ao Cidadão) permite que qualquer pessoa encaminhe pedidos de informação aos órgãos e entidades do Poder Executivo Municipal. É o canal oficial garantido pela <strong>Lei Federal 12.527/2011</strong> (Lei de Acesso à Informação – LAI).
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { valor: "20 dias", label: "Prazo de resposta", desc: "prorrogáveis por +10", icon: FaClock },
                                    { valor: "Gratuito", label: "Custo do pedido", desc: "exceto reprodução de doc.", icon: FaBalanceScale },
                                    { valor: "Opcional", label: "Identificação", desc: "nome não obrigatório", icon: FaLock },
                                ].map((i) => (
                                    <div key={i.label} className="text-center p-5 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50 hover:border-[#01b0ef]/30 transition-colors group">
                                        <div className="w-10 h-10 bg-[#01b0ef]/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-[#01b0ef] group-hover:bg-[#01b0ef] group-hover:text-white transition-all">
                                            <i.icon />
                                        </div>
                                        <div className="text-xl font-black text-[#01b0ef]">{i.valor}</div>
                                        <div className="font-black text-[#0088b9] text-[10px] uppercase tracking-widest mt-1">{i.label}</div>
                                        <div className="text-gray-400 text-[10px] uppercase font-bold mt-1">{i.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Formulário / Resultado */}
                        {protocolo ? (
                            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-12 text-center border border-white animate-fade-in-up">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">✅</span>
                                </div>
                                <h2 className="text-2xl font-black text-[#0088b9] mb-3 uppercase tracking-tighter">Pedido Registrado!</h2>
                                <p className="text-gray-500 mb-6 font-medium">Guarde o número de protocolo para acompanhar seu pedido de informação (LAI):</p>
                                <div className="bg-blue-50/50 border-2 border-blue-100/50 rounded-2xl p-8 mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01b0ef] to-[#0088b9]" />
                                    <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Número de Protocolo</p>
                                    <p className="text-2xl font-mono font-black text-[#01b0ef] tracking-wider break-all">{protocolo}</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wide">
                                        ⏱ O prazo de resposta é de <strong className="text-amber-900">20 dias corridos</strong>, prorrogáveis por mais 10 dias.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={() => setProtocolo(null)} className="flex-1 bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs hover:-translate-y-0.5">
                                        Fazer Novo Pedido
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
                                        <FaFileAlt />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#0088b9] uppercase tracking-tighter">Fazer Pedido de Informação</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Preencha os campos abaixo</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 font-['Montserrat',sans-serif]">
                                    {/* Seção 1: Identificação */}
                                    <div className="border-b border-gray-100 pb-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-5 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-[#01b0ef] text-white rounded-lg flex items-center justify-center text-[10px]">1</span>
                                            Identificação (Opcional)
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="nome-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Nome</label>
                                                <input id="nome-esic" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Seu nome completo" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label htmlFor="email-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">E-mail (para resposta)</label>
                                                <input id="email-esic" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Seção 2: Informações do Pedido */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-5 flex items-center gap-2">
                                            <span className="w-6 h-6 bg-[#01b0ef] text-white rounded-lg flex items-center justify-center text-[10px]">2</span>
                                            Informações do Pedido
                                        </h3>

                                        <div className="space-y-5">
                                            <div>
                                                <label htmlFor="orgao-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Órgão / Secretaria *</label>
                                                <select id="orgao-esic" required value={form.orgao} onChange={(e) => setForm({ ...form, orgao: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                                    <option value="">Selecione o órgão...</option>
                                                    <option>Gabinete do Prefeito</option>
                                                    <option>Secretaria de Administração</option>
                                                    <option>Secretaria de Saúde</option>
                                                    <option>Secretaria de Educação</option>
                                                    <option>Secretaria de Obras e Infraestrutura</option>
                                                    <option>Secretaria de Finanças</option>
                                                    <option>Secretaria de Assistência Social</option>
                                                    <option>Secretaria de Agricultura</option>
                                                    <option>Secretaria de Cultura e Turismo</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="formaRetorno-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Forma de Retorno Desejada *</label>
                                                <select id="formaRetorno-esic" required value={form.formaRetorno} onChange={(e) => setForm({ ...form, formaRetorno: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                                    <option value="sistema">De forma eletrônica via sistema (Recomendado)</option>
                                                    <option value="email">Por E-mail</option>
                                                    <option value="correios">Pelos Correios (Custos de envio pelo requerente)</option>
                                                    <option value="retirar">Retirar Pessoalmente (Custos de impressão)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="pedido-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Descrição do Pedido *</label>
                                                <textarea id="pedido-esic" required rows={6} value={form.pedido} onChange={(e) => setForm({ ...form, pedido: e.target.value })} placeholder="Descreva claramente a informação que deseja solicitar..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all resize-none" />
                                            </div>
                                        </div>
                                    </div>
                        
                                    <button type="submit" disabled={enviando} className="w-full bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-xl">
                                        {enviando ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                                        {enviando ? "Processando..." : "Enviar Pedido de Informação"}
                                    </button>
                        
                                    <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                        Conforme Lei 12.527/2011 – Lei de Acesso à Informação (LAI).<br />
                                        Dados protegidos pela LGPD (Lei 13.709/2018).
                                    </p>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* ====== SIDEBAR DIREITA ====== */}
                    <div className="space-y-6">

                        {/* Card: Informações do SIC */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01b0ef] to-[#0088b9]" />
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-2 pt-2">
                                <FaInfoCircle className="text-[#01b0ef]" /> Informações do SIC
                            </h3>
                            
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaUserShield />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Autoridade de Monitoramento</p>
                                        <p className="text-sm font-bold text-gray-700">Secretário de Administração</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaFileAlt />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Unidade/Setor Responsável</p>
                                        <p className="text-sm font-bold text-gray-700">Ouvidoria Geral do Município</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Contatos do SIC</p>
                                        <p className="text-sm font-bold text-gray-700">(84) 3533-2244</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">E-mail</p>
                                        <p className="text-sm font-bold text-gray-700 break-all">esic@lajespintadas.rn.gov.br</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Endereço do SIC</p>
                                        <p className="text-sm font-bold text-gray-700">Rua da Matriz, s/n - Centro</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Lajes Pintadas - RN, 59230-000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 bg-blue-50 text-[#01b0ef] rounded-xl flex items-center justify-center shrink-0 text-sm">
                                        <FaClock />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Horário do SIC</p>
                                        <p className="text-sm font-bold text-gray-700">Segunda a Sexta-feira</p>
                                        <p className="text-xs text-gray-400 mt-0.5">das 07h às 13h</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Links Relacionados */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-7">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-5">Mais Informações</h3>
                            <div className="space-y-1.5">
                                {linksLaterais.map((link, idx) => (
                                    <Link 
                                        key={idx}
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

                        {/* Card: Ouvidoria */}
                        <div className="bg-gradient-to-br from-[#FDB913] to-[#e5a50f] rounded-[2rem] p-7 text-white shadow-xl shadow-amber-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-xl -ml-6 -mb-6" />
                            <h3 className="text-sm font-black uppercase tracking-tighter mb-3 relative z-10 flex items-center gap-2">
                                <FaBullhorn /> Ouvidoria Municipal
                            </h3>
                            <p className="text-amber-100 text-xs font-medium mb-5 relative z-10 leading-relaxed">
                                Para denúncias, reclamações, sugestões e elogios, utilize o canal da Ouvidoria Municipal.
                            </p>
                            <Link href="/servicos/ouvidoria" className="inline-block bg-white text-[#c88b00] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all relative z-10">
                                Acessar Ouvidoria
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
