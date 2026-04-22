"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaTable, FaSpinner, FaDownload } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

type QuadroServidor = {
    id: string;
    cargo: string;
    vinculo: string;
    leiCriacao: string | null;
    vagasLei: number;
    vagasOcupadas: number;
    vagasLivres: number;
    ativo: boolean;
};

export default function QuadroServidoresPage() {
    const [items, setItems] = useState<QuadroServidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Ocultar inativos na view pública e buscar dados
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Buscamos apenas os ativos para o público
                const res = await fetch("/api/quadro-servidores?ativo=true");
                const data = await res.json();
                setItems(data.items || []);
            } catch (error) {
                console.error("Erro ao carregar quadro:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filtered = items.filter(
        (i) =>
            i.cargo.toLowerCase().includes(search.toLowerCase()) ||
            i.vinculo.toLowerCase().includes(search.toLowerCase()) ||
            (i.leiCriacao && i.leiCriacao.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-primary-600">Início</Link>
                        <span>/</span>
                        <Link href="/transparencia" className="hover:text-primary-600">Transparência</Link>
                        <span>/</span>
                        <Link href="/transparencia/servidores" className="hover:text-primary-600">Servidores</Link>
                        <span>/</span>
                        <span className="text-gray-800 font-medium">Quadro de Pessoal</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 flex items-center gap-3">
                                <FaTable className="text-primary-600" />
                                Quadro Geral de Pessoal
                            </h1>
                            <p className="text-gray-600 mt-2 max-w-2xl">
                                Consulte a relação completa de cargos criados por lei, demonstrando o quantitativo de vagas ocupadas e disponíveis, em atendimento ao disposto na matriz do PNTP.
                            </p>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium">
                                <FaDownload className="text-gray-400" /> CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium">
                                <FaDownload className="text-red-400" /> PDF
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center"
                >
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar por cargo, vínculo ou lei..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                        />
                        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <FaSpinner className="animate-spin text-primary-500 text-4xl mb-4" />
                            <p>Carregando quadro de servidores...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <FaTable className="text-gray-300 text-5xl mx-auto mb-4" />
                            <p className="text-lg">Nenhum registro encontrado para a sua busca.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                                        <th className="p-4 font-semibold">Cargo</th>
                                        <th className="p-4 font-semibold">Vínculo</th>
                                        <th className="p-4 font-semibold">Lei de Criação</th>
                                        <th className="p-4 font-semibold text-center border-l border-gray-200">Vagas Lei</th>
                                        <th className="p-4 font-semibold text-center">Ocupadas</th>
                                        <th className="p-4 font-semibold text-center">Livres</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-100 transition">
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-800">{item.cargo}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full uppercase">
                                                    {item.vinculo}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 text-sm">
                                                {item.leiCriacao ? item.leiCriacao : <span className="text-gray-400 italic">Não informada</span>}
                                            </td>
                                            <td className="p-4 text-center font-bold text-gray-700 border-l border-gray-100 bg-gray-50/50">
                                                {item.vagasLei}
                                            </td>
                                            <td className="p-4 text-center text-blue-600 font-bold bg-blue-50/30">
                                                {item.vagasOcupadas}
                                            </td>
                                            <td className="p-4 text-center text-green-600 font-bold bg-green-50/30">
                                                {item.vagasLivres}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
