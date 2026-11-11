"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaUserShield } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type Usuario = {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    ativo: boolean;
    criadoEm: string;
};

export default function AdminUsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/usuarios");
            if (res.status === 403) {
                toast.error("Acesso negado. Apenas administradores.");
                setLoading(false);
                return;
            }
            const data = await res.json();
            setUsuarios(data.items || []);
        } catch (error) {
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) return;

        try {
            const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
            const data = await res.json();
            
            if (res.ok) {
                toast.success("Usuário excluído com sucesso");
                fetchUsuarios();
            } else {
                toast.error(data.error || "Erro ao excluir usuário");
            }
        } catch (error) {
            toast.error("Erro de conexão");
        }
    };

    const filtered = usuarios.filter(u =>
        u.nome.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin": return "bg-purple-100 text-purple-700";
            case "comunicacao": return "bg-blue-100 text-blue-700";
            case "editor": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUserShield className="text-primary-600" /> Gerenciar Usuários
                    </h1>
                    <p className="text-gray-500 text-sm">Crie, edite e controle o acesso da equipe ao painel</p>
                </div>
                <Link href="/admin/usuarios/novo" className="btn-primary flex items-center gap-2">
                    <FaPlus /> Novo Usuário
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">E-mail</th>
                                <th className="px-6 py-4">Perfil</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <FaSpinner className="animate-spin inline-block text-primary-500 text-2xl" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : filtered.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-800">{u.nome}</td>
                                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getRoleBadgeColor(u.perfil)}`}>
                                            {u.perfil}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {u.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/usuarios/editar/${u.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
