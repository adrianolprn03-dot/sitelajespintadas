"use client";
import { useState, useEffect } from "react";
import { FaHammer, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaChartLine, FaSpinner, FaArrowRight, FaImage } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Image from "next/image";

type Obra = {
    id: string;
    titulo: string;
    descricao: string;
    local: string;
    valor: number;
    status: string;
    dataInicio: string | null;
    previsaoTermino: string | null;
    empresa: string | null;
    percentual: number;
    imagem: string | null;
    documentos: string;
    criadoEm: string;
};

const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
        case "concluida": return { label: "Concluída", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
        case "em-andamento": return { label: "Em Andamento", color: "bg-blue-50 text-blue-700 border-blue-100" };
        case "paralisada": return { label: "Paralisada", color: "bg-rose-50 text-rose-700 border-rose-100" };
        case "licitacao": return { label: "Licitação", color: "bg-amber-50 text-amber-700 border-amber-100" };
        default: return { label: status, color: "bg-gray-50 text-gray-500 border-gray-100" };
    }
};

export default function ObrasPublicasPage() {
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchObras = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({ 
                    query: busca,
                    status 
                });
                const res = await fetch(`/api/obras?${query.toString()}`);
                const data = await res.json();
                setObras(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar obras:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchObras();
    }, [busca, status]);

    const handleClearFilters = () => {
        setBusca("");
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = obras.map(o => ({
            "Título": o.titulo,
            "Local": o.local,
            "Valor": o.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            "Empresa": o.empresa || "Não informada",
            "Progresso": `${o.percentual}%`,
            "Status": o.status
        }));

        const filename = `obras_publicas`;
        const title = `Relatório de Acompanhamento de Obras Públicas – Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalInvestimento = obras.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Acompanhamento de Obras"
                subtitle="Consulte o andamento, valores e prazos das obras públicas em execução no nosso município."
                variant="premium"
                icon={<FaHammer />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Obras" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    currentYear=""
                    onYearChange={() => {}}
                    currentMonth=""
                    onMonthChange={() => {}}
                    placeholder="Buscar por título, local ou empresa..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                        >
                            <option value="">Todos os Status</option>
                            <option value="concluida">Concluída</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="paralisada">Paralisada</option>
                            <option value="licitacao">Licitação</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Resumo da Gestão de Obras */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100/50 border-l-4 border-l-emerald-500 group">
                        <div className="flex justify-between items-start mb-4 text-emerald-100 group-hover:text-emerald-500 transition-colors">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Investimento Ativo</div>
                            <FaChartLine size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : totalInvestimento.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                        <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Total em obras no filtro</div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500 group">
                        <div className="flex justify-between items-start mb-4 text-blue-100 group-hover:text-blue-500 transition-colors">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Projetos</div>
                            <FaHammer size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : obras.length} Obras</div>
                        <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Intervenções capturadas</div>
                    </div>
                </div>

                {/* Lista de Obras */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                             <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4 mx-auto" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Consultando cronogramas de infraestrutura...</p>
                        </div>
                    ) : obras.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FaHammer size={40} />
                            </div>
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhuma obra localizada</h4>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto italic">
                                Tente ajustar os filtros ou pesquisar por outro termo.
                            </p>
                        </div>
                    ) : (
                        obras.map((o) => {
                            const statusInfo = getStatusInfo(o.status);
                            return (
                                <div key={o.id} className="bg-white rounded-[3rem] border border-white shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col lg:flex-row group hover:shadow-2xl transition-all duration-500">
                                    <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden bg-gray-100 shrink-0">
                                        {o.imagem ? (
                                            <Image 
                                                src={o.imagem} 
                                                alt={o.titulo} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-all duration-700" 
                                            />
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-300">
                                                <FaImage size={64} />
                                            </div>
                                        )}
                                        <div className="absolute top-8 left-8">
                                            <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-10 lg:p-14 flex-1 flex flex-col">
                                        <div className="mb-8">
                                            <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                                <FaMapMarkerAlt /> {o.local}
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-4">{o.titulo}</h3>
                                            <p className="text-gray-500 leading-relaxed font-medium line-clamp-3 italic text-sm">
                                                "{o.descricao}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-8 border-y border-gray-50 mb-8">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Valor da Obra</p>
                                                <p className="font-black text-gray-800 text-lg tracking-tighter">{o.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Executor</p>
                                                <p className="font-black text-gray-800 text-sm uppercase tracking-tight truncate flex items-center gap-2">
                                                    <FaBuilding className="text-gray-300" /> {o.empresa || "Não Informada"}
                                                </p>
                                            </div>
                                            <div className="text-right sm:text-left">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Previsão</p>
                                                <p className="font-black text-blue-600 text-sm uppercase tracking-tight flex items-center gap-2">
                                                    <FaCalendarAlt className="text-blue-100" /> {o.previsaoTermino ? new Date(o.previsaoTermino).toLocaleDateString("pt-BR") : "Não definida"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400">Progresso Físico-Financeiro</span>
                                                <span className="text-blue-600">{o.percentual}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-blue-50 rounded-full overflow-hidden p-0.5 shadow-inner">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/20"
                                                    style={{ width: `${o.percentual}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button className="text-blue-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:gap-5 transition-all">
                                                Visualizar Detalhamento <FaArrowRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
