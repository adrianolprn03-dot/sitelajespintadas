"use client";
import { useState, useEffect } from "react";
import { FaPlaneDeparture, FaSpinner, FaUserTie, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaBuilding, FaArrowRight, FaInfoCircle } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    motivo: string;
    dataInicio: string;
    dataFim: string;
    valor: number;
    valorUnitario: number;
    quantidadeDias: number;
    secretaria: string;
    mes: number;
    ano: number;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DiariasPage() {
    const [diarias, setDiarias] = useState<Diaria[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [secretaria, setSecretaria] = useState("");

    useEffect(() => {
        const fetchDiarias = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    secretaria,
                    query: busca
                });
                const res = await fetch(`/api/diarias?${query.toString()}`);
                const data = await res.json();
                setDiarias(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar diárias:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDiarias();
    }, [ano, mes, secretaria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setSecretaria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = diarias.map(d => ({
            "Servidor": d.servidor,
            "Cargo": d.cargo,
            "Destino": d.destino,
            "Período": `${new Date(d.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(d.dataFim).toLocaleDateString("pt-BR")}`,
            "Qtd": d.quantidadeDias,
            "Valor": fmt(d.valor)
        }));

        const filename = `diarias_${mes}_${ano}`;
        const title = `Relatório de Concessão de Diárias – Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = diarias.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Diárias de Viagem"
                subtitle="Consulte os valores pagos a servidores e agentes políticos para cobertura de despesas em missões oficiais."
                variant="premium"
                icon={<FaPlaneDeparture />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Diárias" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Buscar por servidor, destino ou motivo..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={secretaria} 
                            onChange={(e) => setSecretaria(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-emerald-400 transition-colors shadow-sm"
                        >
                            <option value="">Todas as Secretarias</option>
                            <option value="saude">Saúde</option>
                            <option value="educacao">Educação</option>
                            <option value="assistencia social">Assistência Social</option>
                            <option value="obras">Obras</option>
                            <option value="administracao">Administração</option>
                            <option value="gabinete">Gabinete</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-100/50 border-l-4 border-l-emerald-500 group hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gasto Total no Período</div>
                            <FaMoneyBillWave className="text-emerald-100 group-hover:text-emerald-500 transition-colors" size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : fmt(totalValor)}</div>
                        <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Soma das diárias filtradas</div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Missões Registradas</div>
                            <FaPlaneDeparture className="text-blue-100 group-hover:text-blue-500 transition-colors" size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : diarias.length} Diárias</div>
                        <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Frequência de deslocamentos</div>
                    </div>
                </div>

                {/* Lista de Diárias */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                             <FaSpinner className="animate-spin text-emerald-500 text-4xl mb-4 mx-auto" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Consultando registros de viagem...</p>
                        </div>
                    ) : diarias.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FaPlaneDeparture size={40} />
                            </div>
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhum registro localizado</h4>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto italic">
                                Tente ajustar os filtros ou pesquisar por outro período.
                            </p>
                        </div>
                    ) : (
                        diarias.map((d) => (
                            <div key={d.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <FaUserTie size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{d.servidor}</h3>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <FaBuilding size={12} className="text-emerald-200" /> Órgão: {d.secretaria}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                                                        <FaInfoCircle size={12} /> {d.cargo}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Recebido</p>
                                            <p className="text-3xl font-black text-emerald-600 tracking-tighter">{fmt(d.valor)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Destino e Missão</p>
                                            <div className="flex items-start gap-4">
                                                <FaMapMarkerAlt className="text-rose-500 mt-1 shrink-0" size={16} />
                                                <div>
                                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight mb-2 underline decoration-rose-200 decoration-4 underline-offset-4">{d.destino}</p>
                                                    <p className="text-xs text-gray-500 font-medium italic leading-relaxed">"{d.motivo}"</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end justify-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Cronograma</p>
                                            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm transition-all group-hover:border-emerald-200 group-hover:shadow-emerald-500/5">
                                                <div className="text-center shrink-0">
                                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Partida</p>
                                                    <p className="text-xs font-black text-gray-700">{new Date(d.dataInicio).toLocaleDateString("pt-BR")}</p>
                                                </div>
                                                <FaArrowRight size={14} className="text-gray-200" />
                                                <div className="text-center shrink-0">
                                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Retorno</p>
                                                    <p className="text-xs font-black text-gray-700">{new Date(d.dataFim).toLocaleDateString("pt-BR")}</p>
                                                </div>
                                                <div className="w-px h-8 bg-gray-100 mx-2" />
                                                <div className="text-center shrink-0">
                                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Quantidade</p>
                                                    <p className="text-xs font-black text-emerald-600">{d.quantidadeDias} Diária(s)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button className="text-emerald-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:gap-5 transition-all">
                                            Visualizar Portaria de Concessão <FaArrowRight size={12} />
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
