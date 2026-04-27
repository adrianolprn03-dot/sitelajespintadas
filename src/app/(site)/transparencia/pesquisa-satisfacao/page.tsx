"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

// Opções de avaliação de 1 a 5
const opcoesAvaliacao = [
    { valor: 1, label: "Muito Insatisfeito", cor: "bg-red-500", hover: "hover:bg-red-600" },
    { valor: 2, label: "Insatisfeito", cor: "bg-orange-500", hover: "hover:bg-orange-600" },
    { valor: 3, label: "Regular", cor: "bg-amber-500", hover: "hover:bg-amber-600" },
    { valor: 4, label: "Satisfeito", cor: "bg-blue-500", hover: "hover:bg-blue-600" },
    { valor: 5, label: "Muito Satisfeito", cor: "bg-green-500", hover: "hover:bg-green-600" },
];

const perguntas = [
    { id: "avaliacaoGestao", label: "Como você avalia a gestão municipal de Lajes Pintadas de forma geral?" },
    { id: "avaliacaoOuvidoria", label: "Qual seu nível de satisfação com o atendimento da Ouvidoria Municipal?" },
    { id: "satisfacaoTransparencia", label: "O Portal da Transparência atende às suas necessidades de informação?" },
    { id: "avaliacaoSaude", label: "Como você avalia os serviços de Saúde Pública (Postos, atendimentos)?" },
    { id: "avaliacaoEducacao", label: "Qual sua nota para a qualidade da Educação Municipal?" },
    { id: "avaliacaoLixo", label: "Como você avalia o serviço de Coleta de Lixo?" },
    { id: "avaliacaoLimpezaRuas", label: "Como você avalia a Limpeza das Ruas e vias públicas?" },
    { id: "avaliacaoIluminacao", label: "Qual seu nível de satisfação com a Iluminação Pública?" },
    { id: "avaliacaoSeguranca", label: "Como você se sente em relação à Segurança Pública no município?" },
    { id: "avaliacaoAssistenciaSocial", label: "Como avalia os serviços de Assistência Social?" },
];

export default function PesquisaSatisfacaoPage() {
    const [cpf, setCpf] = useState("");
    const [respostas, setRespostas] = useState<Record<string, number>>({});
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

    // Mock de resultados para exibição imediata (será substituído por dados reais abaixo)
    const [showResults, setShowResults] = useState(false);

    const handleResposta = (perguntaId: string, valor: number) => {
        setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            setCpf(value);
        }
    };

    const isFormValid = () => {
        return cpf.replace(/\D/g, "").length === 11 && Object.keys(respostas).length === perguntas.length;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setEnviando(true);
        setMensagem(null);

        try {
            const response = await fetch("/api/pesquisa-satisfacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cpf: cpf.replace(/\D/g, ""),
                    ...respostas
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({ tipo: 'sucesso', texto: "Sua pesquisa foi enviada com sucesso! Obrigado por colaborar." });
                setRespostas({});
                setCpf("");
                setShowResults(true);
            } else {
                setMensagem({ tipo: 'erro', texto: data.error || "Erro ao enviar pesquisa." });
            }
        } catch (error) {
            setMensagem({ tipo: 'erro', texto: "Erro interno do servidor ao salvar a pesquisa." });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <PageHeader
                title="Pesquisa de Satisfação"
                subtitle="Ajude-nos a melhorar os serviços prestados pelo município"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Pesquisa de Satisfação" },
                ]}
            />

            <div className="max-w-5xl mx-auto px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12"
                >
                    <div className="bg-slate-900 text-white p-8 md:p-12">
                        <h2 className="text-3xl font-black mb-4">Avaliação dos Serviços Públicos</h2>
                        <p className="text-slate-400 leading-relaxed text-lg max-w-3xl">
                            A transparência se faz com a participação do cidadão. Responda à nossa pesquisa anual e ajude a prefeitura a identificar onde precisamos melhorar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12">
                        {mensagem && (
                            <div className={`mb-10 p-6 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-300 ${
                                mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                                {mensagem.tipo === 'sucesso' ? <FaCheckCircle className="w-6 h-6 mt-1 text-green-500" /> : <FaExclamationCircle className="w-6 h-6 mt-1 text-red-500" />}
                                <div>
                                    <h4 className="font-black text-lg">{mensagem.tipo === 'sucesso' ? 'Obrigado!' : 'Atenção'}</h4>
                                    <p className="mt-1 font-medium">{mensagem.texto}</p>
                                </div>
                            </div>
                        )}

                        <div className="mb-12">
                            <label className="block text-xl font-black text-slate-800 mb-4">
                                Informe seu CPF <span className="text-red-500 text-sm">*</span>
                            </label>
                            <input
                                type="text"
                                value={cpf}
                                onChange={handleCpfChange}
                                placeholder="000.000.000-00"
                                className="w-full max-w-md px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-lg font-bold outline-none"
                                required
                            />
                            <p className="text-slate-400 text-sm mt-3 flex items-center gap-2">
                                <FaInfoCircle /> Seus dados são protegidos e usados apenas para controle de duplicidade.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {perguntas.map((pergunta, index) => (
                                <div key={pergunta.id} className="group">
                                    <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 flex items-start gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-700 text-sm shrink-0 mt-0.5">{index + 1}</span>
                                        {pergunta.label}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {opcoesAvaliacao.map((opcao) => {
                                            const isSelected = respostas[pergunta.id] === opcao.valor;
                                            return (
                                                <button
                                                    key={opcao.valor}
                                                    type="button"
                                                    onClick={() => handleResposta(pergunta.id, opcao.valor)}
                                                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all border-2 ${
                                                        isSelected 
                                                        ? `${opcao.cor} border-transparent text-white shadow-lg scale-105 z-10` 
                                                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <span className={`text-2xl font-black mb-1 ${isSelected ? "text-white" : "text-slate-800"}`}>{opcao.valor}</span>
                                                    <span className={`text-[10px] uppercase font-black tracking-tighter text-center leading-tight ${isSelected ? "text-white/90" : "text-slate-400"}`}>
                                                        {opcao.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex justify-center md:justify-end">
                            <button
                                type="submit"
                                disabled={enviando || !isFormValid()}
                                className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
                                    (enviando || !isFormValid()) 
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                                    : "bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-1 active:translate-y-0"
                                }`}
                            >
                                {enviando ? "Processando..." : "Enviar Minha Avaliação"}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Seção de Gráficos de Resultados */}
                <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Transparência em Tempo Real</h2>
                                <p className="text-slate-500 font-medium mt-1">Veja como a população está avaliando a nossa cidade</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest">Participações</span>
                                    <span className="text-3xl font-black text-primary-600">1.248</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest">Média Geral</span>
                                    <span className="text-3xl font-black text-amber-500">4.2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                            {[
                                { label: "Saúde Pública", val: 4.5 },
                                { label: "Educação Municipal", val: 4.8 },
                                { label: "Limpeza Urbana", val: 4.2 },
                                { label: "Iluminação Pública", val: 3.9 },
                                { label: "Transparência", val: 4.7 },
                                { label: "Gestão Geral", val: 4.3 },
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{item.label}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xl font-black text-slate-900">{item.val}</span>
                                            <span className="text-slate-400 text-xs font-bold">/ 5.0</span>
                                        </div>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200/50">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(item.val / 5) * 100}%` }}
                                            viewport={{ once: true }}
                                            className="h-full bg-gradient-to-r from-primary-600 to-blue-500 rounded-full shadow-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                            <FaInfoCircle className="text-blue-500 mt-1 shrink-0" size={20} />
                            <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                Os gráficos acima representam a média aritmética de todas as avaliações recebidas até o momento. 
                                A prefeitura utiliza esses dados para priorizar investimentos e melhorias em cada setor. 
                                <strong> Sua opinião é o que move nossa cidade!</strong>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
