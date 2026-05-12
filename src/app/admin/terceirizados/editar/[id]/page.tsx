"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaArrowLeft, FaSave, FaUserTie, FaSpinner } from "react-icons/fa";

export default function EditarTerceirizadoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [form, setForm] = useState({
        nome: "",
        empresa: "",
        funcao: "",
        unidadeLotacao: "",
        dataInicio: "",
        dataFim: "",
        status: "ativo"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/admin/terceirizados/${params.id}`);
                const data = await res.json();
                if (data) {
                    setForm({
                        nome: data.nome,
                        empresa: data.empresa,
                        funcao: data.funcao,
                        unidadeLotacao: data.unidadeLotacao,
                        dataInicio: data.dataInicio.split("T")[0],
                        dataFim: data.dataFim ? data.dataFim.split("T")[0] : "",
                        status: data.status
                    });
                }
            } catch {
                toast.error("Erro ao carregar dados.");
            } finally {
                setCarregando(false);
            }
        };
        fetchData();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const res = await fetch(`/api/admin/terceirizados/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Dados atualizados!");
                router.push("/admin/terceirizados");
            } else {
                toast.error("Erro ao salvar.");
            }
        } catch {
            toast.error("Erro na conexão.");
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) return <div className="p-20 text-center"><FaSpinner className="animate-spin inline-block text-primary-500 text-3xl" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/terceirizados" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUserTie className="text-primary-500" /> Editar Terceirizado
                    </h1>
                    <p className="text-gray-500 text-sm">Atualize as informações do profissional.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Nome Completo *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={form.nome}
                                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Empresa Contratada *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={form.empresa}
                                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Função / Cargo *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={form.funcao}
                                onChange={(e) => setForm({ ...form, funcao: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Unidade de Lotação *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={form.unidadeLotacao}
                                onChange={(e) => setForm({ ...form, unidadeLotacao: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Data de Início *</label>
                            <input
                                type="date"
                                className="input-field"
                                value={form.dataInicio}
                                onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Data de Término (Opcional)</label>
                            <input
                                type="date"
                                className="input-field"
                                value={form.dataFim}
                                onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Situação</label>
                            <select
                                className="input-field"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="ativo">Ativo</option>
                                <option value="encerrado">Encerrado</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="btn-primary flex items-center gap-2 px-12 py-4"
                        >
                            {salvando ? "Salvando..." : <><FaSave /> Salvar Alterações</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
