"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FaCheckCircle, FaStar, FaRegStar } from "react-icons/fa";

export default function PesquisaSatisfacaoPage() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
    const [enviando, setEnviando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const subject = `[Pesquisa de Satisfação] Avaliação: ${rating} estrelas`;
            const res = await fetch("/api/contato", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: formData.nome || "Cidadão Anônimo",
                    email: formData.email || "anonimo@lajespintadas.rn.gov.br",
                    assunto: subject,
                    mensagem: formData.mensagem
                })
            });
            if (res.ok) {
                setSucesso(true);
                setRating(0);
                setFormData({ nome: '', email: '', mensagem: '' });
                setTimeout(() => setSucesso(false), 8000);
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
                title="Pesquisa de Satisfação"
                subtitle="Avalie a qualidade dos serviços públicos e ajude a melhorar nossa gestão"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Pesquisa de Satisfação" }
                ]}
            />
            
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100 mb-16">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Qualidade do Serviço Público", "Governança Corporativa", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[800px] mx-auto px-6 pb-24">
                <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl shadow-gray-200/40 border border-white">
                    {sucesso ? (
                         <div className="text-center py-10 animate-in zoom-in duration-500">
                             <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                 <FaCheckCircle size={48} />
                             </div>
                             <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">Avaliação Registrada!</h2>
                             <p className="text-gray-500 font-medium text-lg">
                                 Muito obrigado por participar. Sua opinião é fundamental para o aperfeiçoamento contínuo da administração municipal.
                             </p>
                         </div>
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">Avalie os Serviços Ofertados</h2>
                                <p className="text-gray-500 font-medium">Deixe sua nota para o atendimento municipal e compartilhe sugestões de melhoria (opcional).</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Componente de Estrelas */}
                                <div className="text-center bg-gray-50 border border-gray-100 rounded-3xl p-8 mb-10">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Sua Nota de Satisfação</p>
                                    <div className="flex justify-center gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className={`text-5xl transition-all ${
                                                    (hoverRating || rating) >= star 
                                                    ? "text-amber-400 hover:scale-110 drop-shadow-md" 
                                                    : "text-gray-200 hover:scale-110"
                                                }`}
                                            >
                                                {(hoverRating || rating) >= star ? <FaStar /> : <FaRegStar />}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 mt-6 h-5">
                                        {rating === 1 && "Muito Insatisfeito"}
                                        {rating === 2 && "Insatisfeito"}
                                        {rating === 3 && "Regular"}
                                        {rating === 4 && "Satisfeito"}
                                        {rating === 5 && "Muito Satisfeito"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Nome Completo (Opcional)</label>
                                        <input 
                                            type="text"
                                            value={formData.nome}
                                            onChange={e => setFormData({...formData, nome: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Ex: Ana Silva"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">E-mail (Opcional)</label>
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Comentários e Sugestões (Opcional)</label>
                                    <textarea 
                                        rows={4}
                                        value={formData.mensagem}
                                        onChange={e => setFormData({...formData, mensagem: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                        placeholder="Descreva o que motivou sua avaliação para nos ajudar a melhorar"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={enviando || rating === 0}
                                    className="bg-[#01b0ef] hover:bg-[#0088b9] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 w-full transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {enviando ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "Enviar Avaliação"
                                    )}
                                </button>
                                {rating === 0 && (
                                    <p className="text-center text-xs text-rose-500 font-bold mt-2">Por favor, selecione uma nota nas estrelas acima antes de enviar.</p>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
