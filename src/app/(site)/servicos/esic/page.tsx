"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "@/components/PageHeader";
import { FaSearch, FaQuestionCircle, FaChartBar } from "react-icons/fa";
import Link from "next/link";
import StatisticsDashboard from "@/components/transparencia/StatisticsDashboard";

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

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex justify-end mb-6">
                    <Link href="/servicos/consulta-protocolo" className="bg-white border-2 border-[#0088b9] text-[#01b0ef] hover:bg-[#0088b9] hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 uppercase tracking-wide">
                        <FaSearch /> Acompanhar Meu Protocolo
                    </Link>
                </div>
                {/* Informações legais */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-10 mb-10 border border-white">
                    <h2 className="font-black text-[#0088b9] text-xl mb-6 uppercase tracking-tighter">📋 O que é o e-SIC?</h2>
                    <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                        O e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) é o canal oficial pelo qual
                        qualquer pessoa pode solicitar informações públicas à Prefeitura Municipal, conforme garantido
                        pela <strong>Lei Federal 12.527/2011</strong> (Lei de Acesso à Informação – LAI).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                        {[
                            { valor: "20 dias", label: "Prazo de resposta", desc: "prorrogáveis por +10" },
                            { valor: "Gratuito", label: "Custo do pedido", desc: "exceto reprodução de doc." },
                            { valor: "Anônimo", label: "Identificação", desc: "não obrigatória" },
                        ].map((i) => (
                            <div key={i.label} className="text-center p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100/50">
                                <div className="text-2xl font-black text-[#01b0ef]">{i.valor}</div>
                                <div className="font-black text-[#0088b9] text-[10px] uppercase tracking-widest mt-1">{i.label}</div>
                                <div className="text-gray-400 text-[10px] uppercase font-bold mt-1">{i.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Links de Apoio PNTP */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link href="/transparencia/faq" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0088b9] bg-blue-50/50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                            <FaQuestionCircle /> Perguntas Frequentes (FAQ)
                        </Link>
                        <Link href="/transparencia/relatorios" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0088b9] bg-blue-50/50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                            <FaChartBar /> Relatórios Estatísticos e-SIC
                        </Link>
                    </div>

                    {/* Dados Institucionais PNTP */}
                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <p className="font-bold text-[#0088b9] mb-1">Unidade Responsável</p>
                            <p className="text-gray-600">Ouvidoria Geral do Município</p>
                            <p className="text-gray-400 text-[10px] mt-1">Autoridade de Monitoramento: Secretário de Administração</p>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <p className="font-bold text-[#0088b9] mb-1">Contato e Atendimento</p>
                            <p className="text-gray-600">Telefone: (84) 3533-2244</p>
                            <p className="text-gray-600">E-mail: esic@lajespintadas.rn.gov.br</p>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <p className="font-bold text-[#0088b9] mb-1">Endereço e Horário</p>
                            <p className="text-gray-600">Rua da Matriz, 123 - Centro</p>
                            <p className="text-gray-600">Seg a Sex, das 07h às 13h</p>
                        </div>
                    </div>
                </div>

                {protocolo ? (
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-12 text-center border border-white">
                        <div className="text-6xl mb-6">✅</div>
                        <h2 className="text-2xl font-black text-[#0088b9] mb-3 uppercase tracking-tighter">Pedido Registrado!</h2>
                        <p className="text-gray-500 mb-6 font-medium">Guarde o número de protocolo para acompanhar seu pedido de informação (LAI):</p>
                        <div className="bg-blue-50/50 border-2 border-blue-100/50 rounded-2xl p-8 mb-8">
                            <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Número de Protocolo</p>
                            <p className="text-2xl font-mono font-black text-[#01b0ef] tracking-wider">{protocolo}</p>
                        </div>
                        <p className="text-xs text-gray-400 mb-8 uppercase font-bold tracking-wide">
                            O prazo de resposta é de <strong className="text-[#0088b9]">20 dias úteis</strong>.
                        </p>
                        <button onClick={() => setProtocolo(null)} className="w-full bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs">
                            Fazer Novo Pedido
                        </button>
                    </div>
                ) : (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 p-10 border border-white">
                    <h2 className="font-black text-[#0088b9] text-xl mb-8 uppercase tracking-tighter">Fazer Pedido de Informação</h2>
                    {/* Seção de Estatísticas PNTP 2024 - Movido para cima para visibilidade imediata */}
                    <StatisticsDashboard type="esic" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nome-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Nome (opcional)</label>
                                <input id="nome-esic" type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Seu nome completo" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label htmlFor="email-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">E-mail (para resposta)</label>
                                <input id="email-esic" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="orgao-esic" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Órgão / Secretaria *</label>
                            <select id="orgao-esic" required value={form.orgao} onChange={(e) => setForm({ ...form, orgao: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
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
                            <select id="formaRetorno-esic" required value={form.formaRetorno} onChange={(e) => setForm({ ...form, formaRetorno: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
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
                        
                        <button type="submit" disabled={enviando} className="w-full bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
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
        </div>
    );
}
