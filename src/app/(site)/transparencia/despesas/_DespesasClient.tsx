"use client";
import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaSpinner, FaBuilding, FaTag, FaFileInvoiceDollar, FaCalendarDay, FaArrowRight } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
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

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
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
        else if (format === "xlsx") exportToXLSX(payload, filename);
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

                {/* Tabela de Despesas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center">
                             <FaSpinner className="animate-spin text-blue-500 text-3xl mb-4 mx-auto" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando execução financeira...</p>
                        </div>
                    ) : despesas.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                               <FaMoneyBillWave size={30} />
                            </div>
                            <h4 className="text-lg font-black text-gray-800 uppercase tracking-tighter mb-2">Nenhuma despesa localizada</h4>
                            <p className="text-gray-400 font-medium text-xs max-w-sm mx-auto italic">
                                Tente ajustar os filtros ou pesquisar por outro período.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Referência</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Secretaria / Categoria</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fornecedor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {despesas.map((d) => (
                                        <tr key={d.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {mesesLabels[d.mes-1]} / {d.ano}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-2 max-w-[300px]">
                                                    {d.descricao}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                                        <FaBuilding size={8} /> {d.secretaria}
                                                    </span>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                        <FaTag size={8} /> {d.categoria}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[10px] font-bold text-gray-600 uppercase truncate max-w-[200px]">
                                                    {d.fornecedor || "Administração Direta"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <p className="text-sm font-black text-emerald-600 tracking-tighter">
                                                    {fmt(d.valor)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all" title="Ver Detalhes">
                                                    <FaArrowRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
