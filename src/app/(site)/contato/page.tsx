"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FaPaperPlane, FaPhone, FaMapMarker, FaEnvelope, FaClock } from "react-icons/fa";

export default function ContatoPage() {
    const [formData, setFormData] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
    const [enviando, setEnviando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const res = await fetch("/api/contato", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSucesso(true);
                setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
                setTimeout(() => setSucesso(false), 5000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Fale Conosco"
                subtitle="Canais oficiais de atendimento e comunicação com a Prefeitura Municipal"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Contato" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Informações de Contato Rápidas */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter mb-8">Atendimento Presencial</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <FaMapMarker />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Endereço</p>
                                        <p className="text-sm font-bold text-gray-700">Rua São Francisco, 275, centro</p>
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">Lajes Pintadas/RN, CEP: 59.235-000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <FaClock />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Horário</p>
                                        <p className="text-sm font-bold text-gray-700">Segunda a Sexta</p>
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">08h às 13h</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Telefone</p>
                                        <p className="text-sm font-bold text-gray-700">(84) 98748-0287</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">E-mail Administrativo</p>
                                        <p className="text-sm font-bold text-gray-700">ouvidoria@lajespintadas.rn.gov.br</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                            <h3 className="text-lg font-black uppercase tracking-tighter mb-3 relative z-10">Precisando da Ouvidoria?</h3>
                            <p className="text-blue-100 text-sm font-medium mb-6 relative z-10">
                                Para denúncias, reclamações ou sugestões formais, utilize nosso canal exclusivo de ouvidoria.
                            </p>
                            <a href="/servicos/ouvidoria" className="inline-block bg-white text-blue-700 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all relative z-10">
                                Acessar Ouvidoria
                            </a>
                        </div>
                    </div>

                    {/* Formulário */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl shadow-gray-200/40 border border-white">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-3">Envie uma mensagem</h2>
                                <p className="text-gray-500 font-medium">Preencha o formulário abaixo. Sua solicitação será direcionada ao setor responsável.</p>
                            </div>

                            {sucesso && (
                                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-6 rounded-2xl mb-8 flex items-center gap-4 animate-in fade-in">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">✓</div>
                                    <div>
                                        <h4 className="font-bold text-sm">Mensagem enviada com sucesso!</h4>
                                        <p className="text-xs font-medium mt-1">Agradecemos seu contato. Nossa equipe responderá em breve.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Nome Completo</label>
                                        <input 
                                            type="text" required
                                            value={formData.nome}
                                            onChange={e => setFormData({...formData, nome: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Digite seu nome"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">E-mail</label>
                                        <input 
                                            type="email" required
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Assunto</label>
                                    <select 
                                        required
                                        value={formData.assunto}
                                        onChange={e => setFormData({...formData, assunto: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Selecione um assunto...</option>
                                        <option value="Dúvida Administrativa">Dúvida Administrativa</option>
                                        <option value="Solicitação de Serviço">Solicitação de Serviço</option>
                                        <option value="Tributário / IPTU">Tributário / IPTU</option>
                                        <option value="Recursos Humanos">Recursos Humanos</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Mensagem</label>
                                    <textarea 
                                        required rows={6}
                                        value={formData.mensagem}
                                        onChange={e => setFormData({...formData, mensagem: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                        placeholder="Como podemos ajudar?"
                                    />
                                </div>

                                <button 
                                    type="submit" disabled={enviando}
                                    className="bg-[#01b0ef] hover:bg-[#0088b9] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 w-full md:w-auto transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {enviando ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaPaperPlane /> Enviar Mensagem
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
