"use client";
import { useState, useEffect } from "react";
import { FaListOl, FaSpinner, FaBuilding, FaCalendarCheck, FaInfoCircle } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Pagamento = {
    id: string;
    ordem: number;
    fornecedor: string;
    cnpj: string;
    descricao: string;
    valor: number;
    dataEmpenho: string;
    dataLiquidacao: string;
    dataPagamento: string | null;
    secretaria: string;
    status: "pendente" | "pago" | "suspenso";
};

const statusConfig: Record<string, { label: string; cor: string }> = {
    pendente: { label: "Pendente", cor: "bg-amber-100 text-amber-700 border-amber-200" },
    pago: { label: "Pago", cor: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    suspenso: { label: "Suspenso", cor: "bg-red-100 text-red-700 border-red-200" },
};

const MOCK_DATA: Pagamento[] = [
    {
        id: "1", ordem: 1, fornecedor: "Distribuidora de Materiais LTDA", cnpj: "00.000.000/0001-00",
        descricao: "Aquisição de material de expediente", valor: 4500.00,
        dataEmpenho: "2026-01-05", dataLiquidacao: "2026-01-12", dataPagamento: "2026-01-15",
        secretaria: "Administração", status: "pago"
    },
    {
        id: "2", ordem: 2, fornecedor: "Construtora Norte Sul EIRELI", cnpj: "00.000.001/0001-11",
        descricao: "Execução de serviços de manutenção predial", valor: 18300.00,
        dataEmpenho: "2026-01-08", dataLiquidacao: "2026-01-20", dataPagamento: null,
        secretaria: "Obras e Infraestrutura", status: "pendente"
    },
    {
        id: "3", ordem: 3, fornecedor: "Farmácia Saúde Popular ME", cnpj: "00.000.002/0001-22",
        descricao: "Aquisição de medicamentos básicos", valor: 12780.50,
        dataEmpenho: "2026-01-10", dataLiquidacao: "2026-01-22", dataPagamento: "2026-01-28",
        secretaria: "Saúde", status: "pago"
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function OrdemCronologicaClient() {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [statusFiltro, setStatusFiltro] = useState("");

    useEffect(() => {
        setLoading(true);
        // Em produção, isso seria um fetch para a API
        setTimeout(() => {
            setPagamentos(MOCK_DATA);
            setLoading(false);
        }, 600);
    }, [ano, mes, statusFiltro]);

    const filtrados = pagamentos.filter(p => {
        const b = busca.toLowerCase();
        const matchStatus = !statusFiltro || p.status === statusFiltro;
        const matchBusca = !busca || 
            p.fornecedor.toLowerCase().includes(b) || 
            p.descricao.toLowerCase().includes(b) ||
            p.cnpj.includes(b);
        return matchStatus && matchBusca;
    });

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setStatusFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map(p => ({
            "Ordem": p.ordem,
            "Fornecedor": p.fornecedor,
            "CNPJ": p.cnpj,
            "Descrição": p.descricao,
            "Secretaria": p.secretaria,
            "Data Empenho": new Date(p.dataEmpenho).toLocaleDateString("pt-BR"),
            "Data Liquidação": new Date(p.dataLiquidacao).toLocaleDateString("pt-BR"),
            "Data Pagamento": p.dataPagamento ? new Date(p.dataPagamento).toLocaleDateString("pt-BR") : "Pendente",
            "Valor": fmt(p.valor),
            "Status": statusConfig[p.status]?.label || p.status,
        }));

        const filename = `ordem_cronologica_${mes}_${ano}`;
        const title = `Ordem Cronológica de Pagamentos – Lajes Pintadas/RN (${mes}/${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalPendente = filtrados.filter(p => p.status === "pendente").reduce((acc, p) => acc + p.valor, 0);
    const totalPago = filtrados.filter(p => p.status === "pago").reduce((acc, p) => acc + p.valor, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Ordem Cronológica de Pagamentos"
                subtitle="Acompanhe a fila de pagamentos a fornecedores conforme art. 141 da Lei 14.133/2021."
                variant="premium"
                icon={<FaListOl />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Ordem Cronológica" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 py-8 -mt-10 relative z-30">
                {/* Aviso Legal */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
                    <FaInfoCircle className="text-amber-500 mt-0.5 shrink-0" size={16} />
                    <div>
                        <p className="font-black text-amber-800 text-[9px] uppercase tracking-widest mb-1">Transparência Ativa – PNTP 2025</p>
                        <p className="text-amber-700 text-[10px] font-bold leading-relaxed">
                            A publicação da ordem cronológica de pagamentos é exigência da Lei 14.133/2021. 
                            Os pagamentos obedecem à ordem de liquidação, salvo exceções legais justificadas.
                        </p>
                    </div>
                </div>

                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    availableYears={["2026", "2025", "2024"]}
                    placeholder="Buscar por fornecedor, CNPJ ou descrição..."
                >
                    <select
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                        className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-black text-gray-700 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">Todos os Status</option>
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="suspenso">Suspenso</option>
                    </select>
                </TransparencyFilters>

                {/* Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Aguardando Pagamento</div>
                        <div className="text-xl font-black text-amber-600">{fmt(totalPendente)}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Pago no Período</div>
                        <div className="text-xl font-black text-emerald-600">{fmt(totalPago)}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Registros Encontrados</div>
                        <div className="text-xl font-black text-blue-600">{filtrados.length} pedidos</div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left" aria-label="Ordem cronológica de pagamentos">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-5 py-4 w-16">Ordem</th>
                                    <th className="px-5 py-4">Fornecedor / CNPJ</th>
                                    <th className="px-5 py-4">Descrição</th>
                                    <th className="px-5 py-4">Secretaria</th>
                                    <th className="px-5 py-4">Liquidação</th>
                                    <th className="px-5 py-4 text-right">Valor</th>
                                    <th className="px-5 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center">
                                            <FaSpinner className="animate-spin inline-block text-blue-500 text-xl mr-3" />
                                            <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Carregando...</span>
                                        </td>
                                    </tr>
                                ) : filtrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center text-gray-400 italic text-xs font-bold uppercase tracking-widest">
                                            Nenhum registro localizado.
                                        </td>
                                    </tr>
                                ) : filtrados.map((p) => (
                                    <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-5 py-4 text-center">
                                            <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-black text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {p.ordem}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-black text-gray-800 text-[11px] group-hover:text-blue-700 transition-colors uppercase tracking-tight">{p.fornecedor}</div>
                                            <div className="text-[9px] font-mono font-bold text-gray-400 mt-0.5">{p.cnpj}</div>
                                        </td>
                                        <td className="px-5 py-4 max-w-xs">
                                            <div className="text-[10px] font-bold text-gray-600 line-clamp-2 leading-relaxed italic opacity-90">"{p.descricao}"</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase">
                                                <FaBuilding size={9} className="text-gray-300" /> {p.secretaria}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500">
                                                <FaCalendarCheck size={9} className="text-emerald-400" />
                                                {new Date(p.dataLiquidacao).toLocaleDateString("pt-BR")}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right font-black text-gray-800 text-[11px]">
                                            {fmt(p.valor)}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusConfig[p.status]?.cor}`}>
                                                {statusConfig[p.status]?.label}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
