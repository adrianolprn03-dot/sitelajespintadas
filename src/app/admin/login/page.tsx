"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { MUNICIPIO } from "@/config/municipio";

export default function AdminLoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/admin");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });
            if (result?.ok) {
                toast.success("Bem-vindo ao Painel Administrativo!");
                router.push("/admin");
            } else {
                toast.error("E-mail ou senha inválidos.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 font-sans">
            {/* Imagem de fundo com desfoque e overlay escuro */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
                style={{ 
                    backgroundImage: "url('/images/hero-bg.jpg')",
                }}
            />
            {/* Overlay escuro e desfoque */}
            <div className="absolute inset-0 bg-[#0a1424]/75 backdrop-blur-sm z-0" />

            {/* Cartão de Login */}
            <div className="relative z-10 w-full max-w-4xl mx-4 flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10">
                
                {/* Lado Esquerdo: Painel de marca com gradiente */}
                <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-[#005C8A] to-[#002C45] p-10 flex-col justify-between relative overflow-hidden text-white">
                    {/* Efeito de luz radial */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                    
                    {/* Topo: Logo / Brasão dentro de uma pill de vidro */}
                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 w-fit shadow-inner shadow-white/5">
                            <img
                                src="/logo_v2_white.png"
                                alt={`Brasão de ${MUNICIPIO.nome}`}
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Centro: Título e Descrição */}
                    <div className="relative z-10 my-auto py-8">
                        <h1 className="text-3xl font-black tracking-tight uppercase mb-4 leading-tight">
                            Painel <br />
                            <span className="text-[#01b0ef]">Administrativo</span>
                        </h1>
                        <p className="text-xs text-blue-100/70 font-medium leading-relaxed">
                            Gestão municipal transparente, eficiente e integrada. Acesso exclusivo para servidores autorizados da Prefeitura de {MUNICIPIO.nome} – {MUNICIPIO.uf}.
                        </p>
                    </div>

                    {/* Rodapé: Indicador de Ambiente Seguro */}
                    <div className="relative z-10 flex items-center">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black tracking-wider uppercase text-blue-100/90">
                                Ambiente Seguro
                            </span>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Formulário */}
                <div className="w-full md:w-[55%] bg-white p-8 md:p-12 flex flex-col justify-between min-h-[480px]">
                    
                    {/* Logo Mobile no topo do formulário */}
                    <div className="md:hidden flex items-center justify-center mb-6">
                        <div className="bg-[#0088b9]/10 rounded-2xl p-3 inline-flex items-center gap-2 border border-[#0088b9]/10">
                            <img
                                src="/logo_v2.png"
                                alt={`Prefeitura de ${MUNICIPIO.nome}`}
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Título e Subtítulo */}
                    <div className="mb-6 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1c30] tracking-tight mb-2">
                            Acesse sua conta
                        </h2>
                        <p className="text-sm text-gray-500 font-semibold leading-snug">
                            Insira suas credenciais institucionais para continuar
                        </p>
                    </div>

                    {/* Corpo do Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-center">
                        <div>
                            <label htmlFor="email-login" className="block text-[10px] font-bold text-[#0a1c30]/60 tracking-widest uppercase mb-2">
                                E-mail Institucional
                            </label>
                            <input
                                id="email-login"
                                type="email"
                                required
                                autoComplete="username"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="usuario@lajespintadas.rn.gov.br"
                                className="w-full bg-[#f3f7fd] border border-transparent focus:border-[#0088b9] focus:bg-white focus:ring-4 focus:ring-[#0088b9]/10 transition-all duration-300 rounded-2xl py-3.5 px-4 text-sm font-semibold text-gray-800 outline-none placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="senha-login" className="block text-[10px] font-bold text-[#0a1c30]/60 tracking-widest uppercase mb-2">
                                Senha de Acesso
                            </label>
                            <div className="relative">
                                <input
                                    id="senha-login"
                                    type={showPass ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-[#f3f7fd] border border-transparent focus:border-[#0088b9] focus:bg-white focus:ring-4 focus:ring-[#0088b9]/10 transition-all duration-300 rounded-2xl py-3.5 px-4 text-sm font-semibold text-gray-800 outline-none placeholder-gray-400 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Botão de Envio */}
                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-[#0a1c30] hover:bg-[#061221] active:bg-[#030911] text-white font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-2xl shadow-lg shadow-blue-950/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {carregando && <FaSpinner className="animate-spin" />}
                            {carregando ? "ENTRANDO NO SISTEMA..." : "ENTRAR NO SISTEMA"}
                        </button>
                    </form>

                    {/* Texto Legal de Rodapé */}
                    <div className="mt-8 text-center">
                        <p className="text-[9px] font-bold text-gray-400/80 tracking-wider uppercase leading-relaxed max-w-sm mx-auto">
                            Sistema de uso exclusivo autorizado. <br />
                            Acesso indevido sujeito às penalidades da lei.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
