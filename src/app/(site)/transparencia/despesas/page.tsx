"use client";
import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaSpinner, FaBuilding, FaTag, FaFileInvoiceDollar, FaCalendarDay, FaArrowRight } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Despesa = {
    id: string;
    descricao: string;
    categoria: string;
    secretaria: string;
    fornecedor: string | null;
    valor: number;
    mes: number;
    ano: number;
    criadoEm: string;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DespesasPage() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [secretaria, setSecretaria] = useState("");
    const [categoria, setCategoria] = useState("");

    useEffect(() => {
        const fetchDespesas = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ano,
                    mes,
                    secretaria,
                    categoria,
                    query: busca
                });
                const res = await fetch(`/api/despesas?${query.toString()}`);
                const data = await res.json();
                setDespesas(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDespesas();
    }, [ano, mes, secretaria, categoria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setSecretaria("");
        setCategoria("");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = despesas.map(d => ({
            "Data": `${d.mes}/${d.ano}`,
            "Descrição": d.descricao,
            "Categoria": d.categoria,
            "Secretaria": d.secretaria,
            "Fornecedor": d.fornecedor || "Não informado",
            "Valor": fmt(d.valor)
        }));

        const filename = `despesa_${mes}_${ano}`;
        const title = `Relatório de Despesas Públicas – Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = despesas.reduce((acc, curr) => acc + curr.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Despesas Públicas"
                subtitle="Acompanhe em detalhe como os recursos públicos são aplicados em cada secretaria e programa."
                variant="premium"
                icon={<FaMoneyBillWave />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Despesas Públicas" }
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
                    placeholder="Buscar por descrição ou fornecedor..."
                >
                    <div className="flex flex-wrap gap-3">
                        <select 
                            value={secretaria} 
                            onChange={(e) => setSecretaria(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                        >
                            <option value="">Todas as Secretarias</option>
                            <option value="saude">Saúde</option>
                            <option value="educacao">Educação</option>
                            <option value="assistencia social">Assistência Social</option>
                            <option value="obras">Obras</option>
                            <option value="administracao">Administração</option>
                        </select>
                        <select 
                            value={categoria} 
                            onChange={(e) => setCategoria(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                        >
                            <option value="">Todas as Categorias</option>
                            <option value="pessoal">Pessoal</option>
                            <option value="custeio">Custeio</option>
                            <option value="investimento">Investimento</option>
                            <option value="servicos">Serviços de Terceiros</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-100/50 border-l-4 border-l-emerald-500 group hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Empenhado</div>
                            <FaFileInvoiceDollar className="text-emerald-100 group-hover:text-emerald-500 transition-colors" size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : fmt(totalValor)}</div>
                        <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Soma no período</div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lançamentos</div>
                            <FaTag className="text-blue-100 group-hover:text-blue-500 transition-colors" size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-800 tracking-tight">{loading ? "..." : despesas.length} Registros</div>
                        <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Volume de despesas</div>
                    </div>
                </div>

                {/* Lista de Despesas */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                             <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4 mx-auto" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sincronizando execução financeira...</p>
                        </div>
                    ) : despesas.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FaMoneyBillWave size={40} />
                            </div>
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhuma despesa localizada</h4>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto italic">
                                Tente ajustar os filtros ou pesquisar por outro período.
                            </p>
                        </div>
                    ) : (
                        despesas.map((d) => (
                            <div key={d.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <FaFileInvoiceDollar size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{d.descricao}</h3>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <FaCalendarDay size={12} className="text-blue-200" /> Referência: {mesesLabels[d.mes-1]} de {d.ano}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                                        <FaBuilding size={12} /> {d.secretaria}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 bg-blue-50 text-blue-700 flex items-center gap-2">
                                            <FaTag size={12} /> {d.categoria}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white text-gray-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                                    <FaBuilding size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Beneficiário / Fornecedor</p>
                                                    <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{d.fornecedor || "Administração Direta"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Liquidado</p>
                                                <p className="text-2xl font-black text-emerald-600 tracking-tighter">{fmt(d.valor)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button className="text-blue-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:gap-5 transition-all">
                                            Visualizar Extrato Detalhado <FaArrowRight size={12} />
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
