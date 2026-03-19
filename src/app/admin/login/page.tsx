"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [carregando, setCarregando] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mx-auto mb-6">
                        <img 
                            src="/logo_v2_white.png" 
                            alt="Prefeitura Municipal de Lajes Pintadas" 
                            className="h-20 w-auto object-contain drop-shadow-xl" 
                        />
                    </div>
                    <h1 className="text-white font-bold text-2xl">Painel Administrativo</h1>
                    <p className="text-blue-300 text-sm mt-1">Prefeitura Municipal de Lajes Pintadas – RN</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Entrar no Sistema</h2>
                        <p className="text-gray-500 text-sm">Acesso restrito a servidores autorizados</p>
                    </div>

                    <div>
                        <label htmlFor="email-login" className="block text-sm font-semibold text-gray-700 mb-1">
                            E-mail Institucional *
                        </label>
                        <input
                            id="email-login"
                            type="email"
                            required
                            autoComplete="username"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="usuario@lajespintadas.rn.gov.br"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="senha-login" className="block text-sm font-semibold text-gray-700 mb-1">
                            Senha *
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
                                className="input-field pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={carregando}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {carregando && <FaSpinner className="animate-spin" />}
                        {carregando ? "Entrando..." : "Entrar no Painel"}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Sistema de uso exclusivo de servidores públicos autorizados.
                        <br />
                        Acesso não autorizado é crime (Art. 154-A do Código Penal).
                    </p>
                </form>

                <p className="text-center text-blue-300 text-xs mt-6">
                    Problemas de acesso? Contate o setor de TI pelo (84) 3000-0000
                </p>
            </div>
        </div>
    );
}
