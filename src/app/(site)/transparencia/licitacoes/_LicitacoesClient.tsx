"use client";
import { useState, useEffect } from "react";
import { FaChartBar, FaSpinner, FaExternalLinkAlt, FaBuilding, FaGavel } from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import ListaPNCP from "@/components/transparencia/integracao/ListaPNCP";
import { motion, AnimatePresence } from "framer-motion";

type Licitacao = {
    id: string; numero: string; objeto: string; modalidade: string;
    valor: number | null; status: string; secretaria: string; ano: number; dataAbertura?: string;
};

const modalidadeLabel: Record<string, string> = {
    pregao: "Pregão Eletrônico", concorrencia: "Concorrência", "tomada-precos": "Tomada de Preços",
    convite: "Convite", dispensa: "Dispensa de Licitação", inexigibilidade: "Inexigibilidade",
};

const statusConfig: Record<string, { label: string; cor: string }> = {
    aberta: { label: "Aberta", cor: "bg-green-100 text-green-700" },
    "em-andamento": { label: "Em Andamento", cor: "bg-blue-100 text-blue-700" },
    concluida: { label: "Concluída", cor: "bg-gray-100 text-gray-700" },
    cancelada: { label: "Cancelada", cor: "bg-red-100 text-red-700" },
    deserta: { label: "Deserta", cor: "bg-yellow-100 text-yellow-700" },
};

export default function LicitacoesClient() {
    const [licitacoes, setLicitacoes] = useState<Licitacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("");
    const [modalidadeFiltro, setModalidadeFiltro] = useState("");
    const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear().toString());
    const [tab, setTab] = useState<"municipal" | "federal">("federal"); // Start with Federal

    useEffect(() => {
        const fetchLicitacoes = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                if (statusFiltro) query.append("status", statusFiltro);
                if (modalidadeFiltro) query.append("modalidade", modalidadeFiltro);
                if (anoFiltro) query.append("ano", anoFiltro);

                const res = await fetch(`/api/licitacoes?${query.toString()}`);
                const data = await res.json();
                setLicitacoes(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar licitações:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLicitacoes();
    }, [statusFiltro, modalidadeFiltro, anoFiltro]);

    const formatarMoeda = (valor: number | null) => {
        if (!valor) return "A definir";
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const handleClearFilters = () => {
        setBusca("");
        setStatusFiltro("");
        setModalidadeFiltro("");
        setAnoFiltro(new Date().getFullYear().toString());
    };

    const filtrados = licitacoes.filter((l) => {
        const b = busca.toLowerCase();
        return !busca || 
            l.objeto.toLowerCase().includes(b) || 
            l.numero.toLowerCase().includes(b) ||
            l.secretaria.toLowerCase().includes(b);
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map(l => ({
            "Número": l.numero,
            "Modalidade": modalidadeLabel[l.modalidade] || l.modalidade,
            "Objeto": l.objeto,
            "Secretaria": l.secretaria,
            "Valor Estimado": formatarMoeda(l.valor),
            "Status": statusConfig[l.status]?.label || l.status,
            "Ano": l.ano
        }));

        const filename = `licitacoes_municipais_${anoFiltro}`;
        const title = `Relatório de Licitações e Processos – Lajes Pintadas/RN (${anoFiltro})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalEstimado = filtrados.reduce((acc, curr) => acc + (curr.valor || 0), 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader 
                title="Licitações e Processos"
                subtitle="Editais, processos licitatórios e resultados de julgamento em conformidade com a Lei 14.133/2021."
                variant="premium"
                icon={<FaGavel />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Licitações" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 py-8 -mt-10">
                <div className="flex items-center gap-4 mb-8 bg-white/40 p-1.5 rounded-[2rem] border border-white w-fit shadow-inner">
                    <button 
                        onClick={() => setTab("federal")}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === "federal" ? "bg-primary-500 text-white shadow-lg" : "text-gray-400 hover:text-primary-600"}`}
                    >
                        Base Federal (PNCP)
                    </button>
                    <button 
                        onClick={() => setTab("municipal")}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === "municipal" ? "bg-primary-500 text-white shadow-lg" : "text-gray-400 hover:text-primary-600"}`}
                    >
                        Base Municipal
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {tab === "municipal" ? (
                        <motion.div
                            key="municipal"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <TransparencyFilters
                                searchValue={busca}
                                onSearch={setBusca}
                                currentYear={anoFiltro}
                                onYearChange={setAnoFiltro}
                                currentMonth=""
                                onMonthChange={() => {}}
                                onClear={handleClearFilters}
                                onExport={handleExport}
                                placeholder="Pesquisar por número, objeto ou secretaria..."
                            >
                                <div className="flex flex-wrap gap-4">
                                    <select 
                                        value={modalidadeFiltro} 
                                        onChange={(e) => setModalidadeFiltro(e.target.value)}
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[11px] font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option value="">Todas as Modalidades</option>
                                        {Object.entries(modalidadeLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                    <select 
                                        value={statusFiltro} 
                                        onChange={(e) => setStatusFiltro(e.target.value)}
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[11px] font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option value="">Todos os Status</option>
                                        {Object.entries(statusConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                                    </select>
                                </div>
                            </TransparencyFilters>

                            {/* Cards de Resumo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-blue-500">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Valor Total Estimado</div>
                                    <div className="text-xl font-black text-blue-600">{formatarMoeda(totalEstimado)}</div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-purple-500">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Processos Encontrados</div>
                                    <div className="text-xl font-black text-purple-600">{filtrados.length}</div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-emerald-500">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Exercício Fiscal</div>
                                    <div className="text-xl font-black text-emerald-600">{anoFiltro}</div>
                                </div>
                            </div>

                            {/* Tabela de Resultados */}
                            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse" aria-label="Tabela de licitações">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <th className="px-6 py-4">Número / Ano</th>
                                                <th className="px-6 py-4">Objeto do Processo</th>
                                                <th className="px-6 py-4">Modalidade</th>
                                                <th className="px-6 py-4 text-right">Valor Estimado</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-blue-500">
                                                        <FaSpinner className="animate-spin inline-block text-2xl mr-3" />
                                                        <span className="font-bold text-[10px] uppercase tracking-widest">Carregando dados...</span>
                                                    </td>
                                                </tr>
                                            ) : filtrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-xs italic">
                                                        Nenhum processo licitatório encontrado para os filtros selecionados.
                                                    </td>
                                                </tr>
                                            ) : filtrados.map((l) => (
                                                <tr key={l.id} className="hover:bg-blue-50/40 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-black text-gray-800 text-xs group-hover:text-blue-700 transition-colors">{l.numero}</div>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{l.ano}</div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-md">
                                                        <div className="text-[11px] font-semibold text-gray-600 line-clamp-2 leading-relaxed" title={l.objeto}>{l.objeto}</div>
                                                        <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-blue-500/60 uppercase tracking-tighter">
                                                            <FaBuilding size={8} /> {l.secretaria}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-[9px] font-black uppercase rounded-lg border border-gray-100">
                                                            {modalidadeLabel[l.modalidade] || l.modalidade}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <span className="font-black text-gray-800 text-xs">{formatarMoeda(l.valor)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusConfig[l.status]?.cor || "bg-gray-100 text-gray-600"}`}>
                                                            {statusConfig[l.status]?.label || l.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalhes">
                                                            <FaExternalLinkAlt size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="federal"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="bg-primary-50 border border-primary-100 rounded-3xl p-6 mb-8 flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <FaGavel size={20} />
                                </div>
                                <div>
                                    <h3 className="text-primary-900 font-black text-sm uppercase tracking-tighter">Consulta Integrada ao PNCP</h3>
                                    <p className="text-primary-700/60 text-[10px] font-medium leading-relaxed">
                                        Os dados abaixo são extraídos em tempo real do Portal Nacional de Contratações Públicas (Governo Federal).
                                    </p>
                                </div>
                            </div>
                            <ListaPNCP />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-24 pb-24">
                     <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
