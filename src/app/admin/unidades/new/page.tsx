"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function UnidadeForm() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const isEditing = !!id;

    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("saude");
    const [descricao, setDescricao] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [horario, setHorario] = useState("");
    const [mapa, setMapa] = useState("");
    const [ativa, setAtiva] = useState(true);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditing) {
            const fetchUnidade = async () => {
                try {
                    const res = await fetch(`/api/unidades/${id}`);
                    if (!res.ok) throw new Error("Unidade não encontrada");
                    const data = await res.json();
                    
                    setNome(data.nome);
                    setTipo(data.tipo);
                    setDescricao(data.descricao);
                    setEndereco(data.endereco);
                    setTelefone(data.telefone || "");
                    setHorario(data.horario);
                    setMapa(data.mapa || "");
                    setAtiva(data.ativa);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setFetching(false);
                }
            };
            fetchUnidade();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `/api/unidades/${id}` : "/api/unidades";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome, tipo, descricao, endereco, telefone, horario, mapa, ativa
                }),
            });

            if (!res.ok) throw new Error("Erro ao salvar unidade");

            router.push("/admin/unidades");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-6 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/unidades"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditing ? "Editar Unidade" : "Nova Unidade de Atendimento"}
                    </h1>
                    <p className="text-gray-500 text-sm">Gerencie os polos de atendimento do portal PNTP</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Nome da Unidade *</label>
                        <input
                            type="text"
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Centro de Referência de Assistência Social"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Tipo de Serviço *</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="saude">Saúde (UBS, Hospital)</option>
                            <option value="social">Assistência Social (CRAS, Tutelar)</option>
                            <option value="educacao">Educação (Escolas, Creches)</option>
                            <option value="cultura">Cultura e Esporte (Biblioteca, Ginásios)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Telefone Público</label>
                        <input
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: (84) 3000-0000"
                        />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Descrição Funcional *</label>
                        <textarea
                            required
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Breve resumo sobre a área de atuação deste local"
                        />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Endereço Completo *</label>
                        <input
                            type="text"
                            required
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Rua Central, S/N - Bairro X"
                        />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Horário de Atendimento *</label>
                        <input
                            type="text"
                            required
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Segunda à Sexta, das 07:00 às 13:00"
                        />
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Link do Mapa (Google Maps Embed/Src) <span className="text-gray-400 font-normal">Recomendado para o PNTP</span></label>
                        <input
                            type="url"
                            value={mapa}
                            onChange={(e) => setMapa(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            placeholder="Cole apenas a URL do atributo 'src' do iframe gerado pelo Google Maps"
                        />
                        {mapa && (
                            <div className="mt-4 p-2 border border-blue-100 bg-blue-50 rounded-lg text-xs text-blue-800">
                                <strong>Preview:</strong> Se o link for válido, o mapa aparecerá na página pública do cidadão.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                        }`}
                    >
                        {loading ? "Salvando..." : <><FaSave /> Salvar Unidade</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
