"use client";
import { useState, useEffect } from "react";
import { FaChartBar, FaSpinner, FaExternalLinkAlt, FaBuilding, FaGavel } from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

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

    const handleExport = (format: "pdf" | "csv" | "json") => {
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
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={anoFiltro}
                    onYearChange={setAnoFiltro}
                    currentMonth="" // Licitações geralmente não filtram por mês no hub principal
                    onMonthChange={() => {}}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Pesquisar por número, objeto ou secretaria..."
                >
                    {/* Filtros Avançados Específicos */}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Valor Total Estimado</div>
                        <div className="text-3xl font-black text-blue-600">{formatarMoeda(totalEstimado)}</div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100 border-l-4 border-l-purple-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Processos Encontrados</div>
                        <div className="text-3xl font-black text-purple-600">{filtrados.length}</div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm p-8 border border-gray-100 border-l-4 border-l-emerald-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Exercício Fiscal</div>
                        <div className="text-3xl font-black text-emerald-600">{anoFiltro}</div>
                    </div>
                </div>

                {/* Tabela de Resultados */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left" aria-label="Tabela de licitações">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-6">Número / Ano</th>
                                    <th className="px-8 py-6">Objeto do Processo</th>
                                    <th className="px-8 py-6">Modalidade</th>
                                    <th className="px-8 py-6 text-right">Valor Estimado</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-12 text-center text-blue-500">
                                            <FaSpinner className="animate-spin inline-block text-2xl mr-3" />
                                            <span className="font-bold text-xs uppercase tracking-widest">Carregando dados...</span>
                                        </td>
                                    </tr>
                                ) : filtrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center text-gray-400 italic">
                                            Nenhum processo licitatório encontrado para os filtros selecionados.
                                        </td>
                                    </tr>
                                ) : filtrados.map((l) => (
                                    <tr key={l.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-gray-800 text-sm group-hover:text-blue-700 transition-colors">{l.numero}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">{l.ano}</div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <div className="text-xs font-semibold text-gray-600 line-clamp-2 leading-relaxed" title={l.objeto}>{l.objeto}</div>
                                            <div className="flex items-center gap-1.5 mt-2 text-[9px] font-bold text-gray-400 uppercase">
                                                <FaBuilding size={10} /> {l.secretaria}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-[9px] font-black uppercase rounded-lg border border-gray-200">
                                                {modalidadeLabel[l.modalidade] || l.modalidade}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="font-black text-gray-800 text-sm">{formatarMoeda(l.valor)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${statusConfig[l.status]?.cor || "bg-gray-100 text-gray-600"}`}>
                                                {statusConfig[l.status]?.label || l.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-sm">
                                                <FaExternalLinkAlt size={10} /> Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-24 pb-24">
                     <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
