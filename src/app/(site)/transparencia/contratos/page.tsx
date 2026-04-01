"use client";
import { useState, useEffect } from "react";
import { FaFileContract, FaSpinner, FaHistory, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaBuilding, FaWallet, FaArrowRight } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Contrato = {
    id: string;
    numero: string;
    objeto: string;
    valor: number;
    fornecedor: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    secretaria: string;
};

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "vigente": return "bg-emerald-50 text-emerald-700 border-emerald-100 icon-check";
        case "finalizado": return "bg-blue-50 text-blue-700 border-blue-100 icon-history";
        case "cancelado": return "bg-rose-50 text-rose-700 border-rose-100 icon-times";
        default: return "bg-gray-50 text-gray-500 border-gray-100 icon-info";
    }
};

export default function ContratosPage() {
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchContratos = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({ 
                    ano, 
                    status,
                    query: busca 
                });
                const res = await fetch(`/api/contratos?${query.toString()}`);
                const data = await res.json();
                setContratos(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContratos();
    }, [ano, status, busca]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = contratos.map(c => ({
            "Contrato": c.numero,
            "Fornecedor": c.fornecedor,
            "Objeto": c.objeto,
            "Vigência": `${new Date(c.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(c.dataFim).toLocaleDateString("pt-BR")}`,
            "Valor": formatCurrency(c.valor),
            "Status": c.status
        }));

        const filename = `contratos_${ano}`;
        const title = `Relatório de Contratos Administrativos – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = contratos.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Contratos Administrativos"
                subtitle="Acompanhe todos os pactos, acordos e demais instrumentos contratuais celebrados pelo município."
                variant="premium"
                icon={<FaFileContract />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Contratos Administrativos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth=""
                    onMonthChange={() => {}}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Buscar por objeto, fornecedor ou número..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-orange-400 transition-colors shadow-sm"
                        >
                            <option value="">Todos os Status</option>
                            <option value="vigente">Vigente</option>
                            <option value="finalizado">Finalizado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100/50 border-l-4 border-l-orange-500 group hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comprometimento Total</div>
                            <FaWallet className="text-orange-100 group-hover:text-orange-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-800 tracking-tight">{loading ? "..." : formatCurrency(totalValor)}</div>
                        <div className="mt-2 text-[9px] font-bold text-orange-500 uppercase tracking-tighter">Soma dos contratos</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acordos Firmados</div>
                            <FaFileContract className="text-blue-100 group-hover:text-blue-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-800 tracking-tight">{loading ? "..." : contratos.length} Contratos</div>
                        <div className="mt-2 text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Volume de instrumentos</div>
                    </div>
                </div>

                {/* Lista de Contratos */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                             <FaSpinner className="animate-spin text-orange-500 text-4xl mb-4 mx-auto" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Consultando instrumentos contratuais...</p>
                        </div>
                    ) : contratos.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FaFileContract size={40} />
                            </div>
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhum contrato localizado</h4>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto italic">
                                Tente ajustar os filtros ou pesquisar por outro termo.
                            </p>
                        </div>
                    ) : (
                        contratos.map((c) => (
                            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 border border-orange-50 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <FaFileContract size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-base font-black text-gray-800 uppercase tracking-tighter">Contrato Nº {c.numero}</h3>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-orange-100 bg-orange-50 text-orange-700 select-none`}>
                                                        ID: {c.id.substring(0,6).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        <FaHistory size={10} className="text-orange-200" /> {new Date(c.dataInicio).toLocaleDateString("pt-BR")} – {new Date(c.dataFim).toLocaleDateString("pt-BR")}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest select-none">Órgão: {c.secretaria}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border ${getStatusStyles(c.status).split(' icon-')[0]}`}>
                                            {c.status.toLowerCase() === 'vigente' ? <FaCheckCircle size={12} /> : c.status.toLowerCase() === 'cancelado' ? <FaTimesCircle size={12} /> : <FaHistory size={12} />}
                                            {c.status}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/40 rounded-2xl p-6 border border-gray-50 mb-6">
                                        <div className="mb-4">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Objeto do Contrato</p>
                                            <p className="text-gray-600 font-bold leading-relaxed italic text-xs">"{c.objeto}"</p>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-5 border-t border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                                    <FaBuilding size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Fornecedor Contratado</p>
                                                    <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{c.fornecedor}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor do Ajuste</p>
                                                <p className="text-lg font-black text-orange-600 tracking-tighter">{formatCurrency(c.valor)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <button className="bg-white text-gray-500 px-5 py-2.5 rounded-xl font-black uppercase text-[8px] tracking-widest border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
                                            Justificativa
                                        </button>
                                        <button className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[8px] tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/10 flex items-center gap-2">
                                            Documentos <FaArrowRight size={10} className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
