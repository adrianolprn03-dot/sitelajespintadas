"use client";
import { useState, useEffect } from "react";
import { FaSpinner, FaMoneyCheckAlt, FaBuilding, FaUserTie, FaCheckCircle, FaWallet } from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Servidor = {
    id: string;
    nome: string;
    cargo: string;
    vinculo: string;
    secretaria: string;
    salarioBase: number;
    totalBruto: number;
    totalLiquido: number;
    mes: number;
    ano: number;
};

const vinculoCores: Record<string, string> = {
    efetivo: "bg-emerald-50 text-emerald-700 border-emerald-100",
    comissionado: "bg-blue-50 text-blue-700 border-blue-100",
    contratado: "bg-amber-50 text-amber-700 border-amber-100",
    estagiario: "bg-purple-50 text-purple-700 border-purple-100",
    "agente político": "bg-indigo-50 text-indigo-700 border-indigo-100",
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ServidoresPage() {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [busca, setBusca] = useState("");
    const [vinculoFiltro, setVinculoFiltro] = useState("");
    const [secretariaFiltro, setSecretariaFiltro] = useState("");

    useEffect(() => {
        fetchServidores();
    }, [ano, mes, vinculoFiltro, secretariaFiltro]);

    const fetchServidores = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                ano,
                mes,
                vinculo: vinculoFiltro,
                secretaria: secretariaFiltro
            });
            const res = await fetch(`/api/servidores?${query.toString()}`);
            const data = await res.json();
            setServidores(data.items || []);
        } catch (error) {
            console.error("Erro ao carregar servidores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setVinculoFiltro("");
        setSecretariaFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map((s: Servidor) => ({
            "Nome": s.nome,
            "Cargo": s.cargo,
            "Vínculo": s.vinculo,
            "Secretaria": s.secretaria,
            "Total Bruto": fmt(s.totalBruto),
            "Total Líquido": fmt(s.totalLiquido)
        }));

        const filename = `folha_pagamento_${mes}_${ano}`;
        const title = `Relatório de Servidores e Folha de Pagamento - Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const filtrados = servidores.filter((s: Servidor) => {
        const b = busca.toLowerCase();
        return !busca || 
            s.nome.toLowerCase().includes(b) || 
            s.cargo.toLowerCase().includes(b) || 
            s.secretaria.toLowerCase().includes(b);
    });

    const totalBruto = filtrados.reduce((acc: number, curr: Servidor) => acc + curr.totalBruto, 0);
    const totalLiquido = filtrados.reduce((acc: number, curr: Servidor) => acc + curr.totalLiquido, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Folha de Pagamento"
                subtitle="Transparência detalhada sobre a remuneração dos servidores públicos municipais."
                variant="premium"
                icon={<FaMoneyCheckAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
                    { label: "Folha de Pagamento" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Pesquisar por nome ou cargo..."
                >
                    <div className="flex flex-wrap gap-3">
                        <select 
                            value={vinculoFiltro} 
                            onChange={(e) => setVinculoFiltro(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                        >
                            <option value="">Todos os Vínculos</option>
                            <option value="efetivo">Efetivo</option>
                            <option value="comissionado">Comissionado</option>
                            <option value="contratado">Contratado</option>
                            <option value="estagiario">Estagiário</option>
                            <option value="agente politico">Agente Político</option>
                        </select>
                        <select 
                            value={secretariaFiltro} 
                            onChange={(e) => setSecretariaFiltro(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-blue-400 transition-colors shadow-sm"
                        >
                            <option value="">Todas as Secretarias</option>
                            <option value="educacao">Educação</option>
                            <option value="saude">Saúde</option>
                            <option value="assistencia social">Assistência Social</option>
                            <option value="administracao">Administração</option>
                            <option value="obras">Obras e Serviços Públicos</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Cards de TOTAIS ESTILIZADOS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bruto</div>
                            <FaWallet className="text-blue-100 group-hover:text-blue-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-800">{loading ? "..." : fmt(totalBruto)}</div>
                        <div className="mt-2 text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Período Selecionado</div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Líquido</div>
                            <FaCheckCircle className="text-emerald-100 group-hover:text-emerald-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-emerald-600">{loading ? "..." : fmt(totalLiquido)}</div>
                        <div className="mt-2 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Valores Líquidos</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nº de Servidores</div>
                            <FaUserTie className="text-indigo-100 group-hover:text-indigo-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-indigo-600">{loading ? "..." : filtrados.length}</div>
                        <div className="mt-2 text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">Quadro Ativo</div>
                    </div>
                </div>

                {/* Tabela de Resultados */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                       <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                           <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> Detalhamento da Folha
                       </h3>
                       <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                           {mesesLabels[Number(mes)-1]} de {ano}
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto min-h-[300px] relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                                <FaSpinner className="animate-spin text-blue-600 text-3xl mb-3" />
                                <div className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Consultando Folha...</div>
                            </div>
                        )}
                        <table className="w-full text-left" aria-label="Tabela de servidores públicos">
                            <thead>
                                <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Servidor / Cargo</th>
                                    <th className="px-6 py-4">Secretaria</th>
                                    <th className="px-6 py-4">Vínculo</th>
                                    <th className="px-6 py-4 text-right">T. Bruto</th>
                                    <th className="px-6 py-4 text-right">T. Líquido</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtrados.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">
                                            Nenhum servidor localizado.
                                        </td>
                                    </tr>
                                ) : (
                                    filtrados.map((s: Servidor) => (
                                        <tr key={s.id} className="hover:bg-blue-50/30 transition-all group">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-gray-800 text-[11px] group-hover:text-blue-700 transition-colors uppercase tracking-tight">{s.nome}</div>
                                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider opacity-80">{s.cargo}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-lg w-fit">
                                                    <FaBuilding size={9} className="text-gray-400" /> {s.secretaria}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${vinculoCores[s.vinculo.toLowerCase()] || "bg-gray-50 text-gray-400 border-gray-200"}`}>
                                                    {s.vinculo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-800 text-[11px]">
                                                {fmt(s.totalBruto)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-black text-emerald-600 text-[11px] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
                                                    {fmt(s.totalLiquido)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {!loading && servidores.length > 0 && (
                                <tfoot>
                                    <tr className="bg-gray-900 border-t-2 border-gray-800 text-white">
                                        <td colSpan={3} className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Consolidados (Filtro)</td>
                                        <td className="px-6 py-4 text-right font-black text-base text-blue-400">{fmt(totalBruto)}</td>
                                        <td className="px-6 py-4 text-right font-black text-base text-emerald-400">
                                            {fmt(totalLiquido)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
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
