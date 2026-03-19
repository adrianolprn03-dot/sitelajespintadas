"use client";
import { useState } from "react";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function ContatoRapido() {
    const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const res = await fetch("/api/contato", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Mensagem enviada com sucesso!");
                setForm({ nome: "", email: "", assunto: "", mensagem: "" });
            } else {
                toast.error("Erro ao enviar mensagem.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="py-24 bg-gray-50/30" aria-labelledby="contato-titulo">
            <div className="max-w-[1300px] mx-auto px-4 lg:px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Contato Info */}
                    <div className="lg:col-span-4">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                            <span className="text-[#0055A4] font-bold text-xs uppercase tracking-[0.2em] mb-3">Fale Conosco</span>
                            <h2 id="contato-titulo" className="text-3xl md:text-5xl font-black text-[#002241] uppercase tracking-tighter leading-tight" style={{ fontFamily: "Fustat, sans-serif" }}>
                                Entre em <br className="hidden lg:block" />Contato
                            </h2>
                            <p className="mt-4 text-gray-500 font-medium leading-relaxed">
                                Utilize este canal para dúvidas, sugestões ou pedidos de informação.
                            </p>

                            <div className="mt-12 space-y-8 w-full">
                                {[
                                    { icon: HiOutlineMapPin, titulo: "Localização", texto: "Rua Principal, s/n – Centro, Lajes Pintadas – RN" },
                                    { icon: HiOutlinePhone, titulo: "Telefone", texto: "(84) 3000-0000 • Seg a Sex, 08h às 17h" },
                                    { icon: HiOutlineChatBubbleLeftEllipsis, titulo: "WhatsApp", texto: "(84) 9 0000-0000" },
                                    { icon: HiOutlineEnvelope, titulo: "E-mail", texto: "contato@lajespintadas.rn.gov.br" },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-start gap-4 justify-center lg:justify-start">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#0055A4] shrink-0">
                                            <c.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-black text-[#002241] text-xs uppercase tracking-widest mb-1">{c.titulo}</div>
                                            <div className="text-gray-500 text-sm font-medium leading-snug">{c.texto}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="nome" className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nome completo</label>
                                        <input
                                            id="nome"
                                            type="text"
                                            required
                                            value={form.nome}
                                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                            placeholder="Ex: João da Silva"
                                            className="w-full bg-gray-50 border-transparent focus:border-[#0055A4] focus:bg-white rounded-2xl px-6 py-4 text-sm font-medium transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email-contato" className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">E-mail para resposta</label>
                                        <input
                                            id="email-contato"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="seu@email.com"
                                            className="w-full bg-gray-50 border-transparent focus:border-[#0055A4] focus:bg-white rounded-2xl px-6 py-4 text-sm font-medium transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="assunto" className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Assunto da mensagem</label>
                                    <input
                                        id="assunto"
                                        type="text"
                                        required
                                        value={form.assunto}
                                        onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                                        placeholder="Sobre o que deseja falar?"
                                        className="w-full bg-gray-50 border-transparent focus:border-[#0055A4] focus:bg-white rounded-2xl px-6 py-4 text-sm font-medium transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="mensagem" className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sua mensagem</label>
                                    <textarea
                                        id="mensagem"
                                        required
                                        rows={4}
                                        value={form.mensagem}
                                        onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                                        placeholder="Digite aqui detalhadamente..."
                                        className="w-full bg-gray-50 border-transparent focus:border-[#0055A4] focus:bg-white rounded-2xl px-6 py-4 text-sm font-medium transition-all outline-none resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className="w-full bg-[#0055A4] text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-[#002241] shadow-xl shadow-blue-900/10 transition-all disabled:opacity-50"
                                >
                                    {enviando ? "Processando..." : "Enviar Mensagem"}
                                </button>
                                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                    <span className="w-8 h-[1px] bg-gray-100" />
                                    Suas informações estão seguras
                                    <span className="w-8 h-[1px] bg-gray-100" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
