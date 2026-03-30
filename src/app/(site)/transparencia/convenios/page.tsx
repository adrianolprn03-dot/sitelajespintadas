"use client";
import { useState, useEffect } from "react";
import { FaHandshake, FaSpinner, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaArrowRight, FaHistory, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Convenio = {
    id: string;
    numero: string;
    objeto: string;
    concedente: string;
    valor: number;
    contrapartida: number;
    dataInicio: string;
    dataFim: string;
    secretaria: string;
    status: string;
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "vigente": return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "concluido": return "bg-blue-50 text-blue-700 border-blue-100";
        case "cancelado": return "bg-rose-50 text-rose-700 border-rose-100";
        default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
};

export default function ConveniosPage() {
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchConvenios = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    status,
                    query: busca
                });
                const res = await fetch(`/api/convenios?${query.toString()}`);
                const data = await res.json();
                setConvenios(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar convênios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConvenios();
    }, [ano, status, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = convenios.map(c => ({
            "Número": c.numero,
            "Concedente": c.concedente,
            "Objeto": c.objeto,
            "Vigência": `${new Date(c.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(c.dataFim).toLocaleDateString("pt-BR")}`,
            "Valor Repasse": fmt(c.valor),
            "Contrapartida": fmt(c.contrapartida),
            "Status": c.status
        }));

        const filename = `convenios_${ano}`;
        const title = `Relatório de Convênios e Repasses – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = convenios.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Convênios e Repasses"
                subtitle="Consulte os acordos firmados entre o município e outros entes federativos ou entidades privadas."
                variant="premium"
                icon={<FaHandshake />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Convênios" }
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
                    placeholder="Buscar por objeto, número ou concedente..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                        >
                            <option value="">Todos os Status</option>
                            <option value="vigente">Vigente</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500 group">
                        <div className="flex justify-between items-start mb-4 text-blue-100 group-hover:text-blue-500 transition-colors">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor em Repasses</div>
                            <FaMoneyBillWave size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : fmt(totalValor)}</div>
                        <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Soma dos convênios filtrados</div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-100/50 border-l-4 border-l-emerald-500 group">
                        <div className="flex justify-between items-start mb-4 text-emerald-100 group-hover:text-emerald-500 transition-colors">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acordos Ativos</div>
                            <FaHandshake size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : convenios.length} Convênios</div>
                        <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Instrumentos localizados</div>
                    </div>
                </div>

                {/* Lista de Convênios */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                             <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4 mx-auto" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sincronizando termos de convênio...</p>
                        </div>
                    ) : convenios.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FaHandshake size={40} />
                            </div>
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhum convênio localizado</h4>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto italic">
                                Tente ajustar os filtros ou pesquisar por outro período.
                            </p>
                        </div>
                    ) : (
                        convenios.map((c) => (
                            <div key={c.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <FaHandshake size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Convênio Nº {c.numero}</h3>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <FaHistory size={12} className="text-blue-200" /> Vigência: {new Date(c.dataInicio).toLocaleDateString("pt-BR")} a {new Date(c.dataFim).toLocaleDateString("pt-BR")}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                                        <FaBuilding size={12} /> Órgão: {c.secretaria}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${getStatusStyles(c.status)}`}>
                                            {c.status.toLowerCase() === 'vigente' ? <FaCheckCircle size={14} /> : c.status.toLowerCase() === 'cancelado' ? <FaTimesCircle size={14} /> : <FaInfoCircle size={14} />}
                                            {c.status}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50 mb-8">
                                        <div className="mb-6">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Objeto do Acordo</p>
                                            <p className="text-gray-600 font-medium leading-relaxed italic">"{c.objeto}"</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                                                    <FaBuilding size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ente Concedente</p>
                                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{c.concedente}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between md:justify-end gap-12">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Repasse (União/Estado)</p>
                                                    <p className="text-xl font-black text-emerald-600 tracking-tighter">{fmt(c.valor)}</p>
                                                </div>
                                                <div className="text-right border-l border-gray-100 pl-8">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Contrapartida Município</p>
                                                    <p className="text-xl font-black text-blue-600 tracking-tighter">{fmt(c.contrapartida)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button className="bg-white text-gray-400 border border-gray-100 px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                                            Ver Justificativa
                                        </button>
                                        <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                            Visualizar Instrumento na Íntegra <FaArrowRight size={10} />
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
