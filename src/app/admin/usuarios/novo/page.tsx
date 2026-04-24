"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminNovoUsuarioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        perfil: "editor",
        ativo: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.senha !== formData.confirmarSenha) {
            toast.error("As senhas não coincidem.");
            return;
        }

        if (formData.senha.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    perfil: formData.perfil,
                    ativo: formData.ativo
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Usuário criado com sucesso!");
                router.push("/admin/usuarios");
                router.refresh();
            } else {
                toast.error(data.error || "Erro ao criar usuário.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/usuarios" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Novo Usuário</h1>
                    <p className="text-gray-500 text-sm">Adicione um novo membro da equipe ao sistema</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                        <input
                            type="text"
                            name="nome"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail (Login) *</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@lajespintadas.rn.gov.br"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Senha *</label>
                        <input
                            type="password"
                            name="senha"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            value={formData.senha}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Senha *</label>
                        <input
                            type="password"
                            name="confirmarSenha"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            placeholder="Repita a senha"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Perfil de Acesso *</label>
                        <select
                            name="perfil"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                            value={formData.perfil}
                            onChange={handleChange}
                        >
                            <option value="editor">Editor (Conteúdo Geral)</option>
                            <option value="comunicacao">Comunicação (Notícias e Mídia)</option>
                            <option value="admin">Administrador (Acesso Total)</option>
                        </select>
                    </div>

                    <div className="flex items-center mt-8">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="ativo"
                                    className="sr-only"
                                    checked={formData.ativo}
                                    onChange={handleChange}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.ativo ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.ativo ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 font-medium text-gray-700 text-sm">
                                Usuário Ativo (pode fazer login)
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Link href="/admin/usuarios" className="btn-secondary">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2"
                    >
                        {loading ? "Salvando..." : <><FaSave /> Salvar Usuário</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
