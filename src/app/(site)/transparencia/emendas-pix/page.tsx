"use client";
import { useState, useEffect } from "react";
import { FaHandHoldingDollar, FaCircleInfo, FaFileInvoiceDollar, FaCalendarDays, FaScaleBalanced, FaFilePdf } from "react-icons/fa6";
import { FaSearch, FaSpinner, FaFilter } from "react-icons/fa";

type EmendaPix = {
    id: string;
    ano: number;
    origem: string;
    tipoEmenda: string | null;
    formaRepasse: string | null;
    numeroEmenda: string | null;
    autor: string;
    beneficiario: string;
    cnpjBeneficiario: string | null;
    valorPrevisto: number;
    valorRecebido: number;
    valorExecutado: number;
    objeto: string | null;
    funcaoGoverno: string | null;
    secretariaResponsavel: string | null;
    situacao: string;
    dataRecebimento: string | null;
    prazoExecucao: string | null;
    contaBancaria: string | null;
    naturezaDespesa: string | null;
    documentos: string;
    arquivo: string | null;
    documentUrl: string | null;
    atualizadoEm: string;
};

export default function PublicEmendasPixPage() {
    const [items, setItems] = useState<EmendaPix[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedAno, setSelectedAno] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = selectedAno ? `/api/emendas-pix?ano=${selectedAno}` : "/api/emendas-pix";
                const res = await fetch(url);
                const data = await res.json();
                setItems(data || []);
            } catch {
                console.error("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedAno]);

    const anos = Array.from(new Set(items.map(i => i.ano))).sort((a, b) => b - a);

    const filtered = items.filter(i =>
        i.autor.toLowerCase().includes(search.toLowerCase()) ||
        (i.objeto && i.objeto.toLowerCase().includes(search.toLowerCase())) ||
        (i.numeroEmenda && i.numeroEmenda.toLowerCase().includes(search.toLowerCase()))
    );

    const totais = filtered.reduce((acc, curr) => ({
        previsto: acc.previsto + curr.valorPrevisto,
        recebido: acc.recebido + curr.valorRecebido,
        executado: acc.executado + curr.valorExecutado,
    }), { previsto: 0, recebido: 0, executado: 0 });

    return (
        <div className="container mx-auto px-4 py-12 space-y-12">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4 max-w-3xl">
                    <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 text-xs font-black uppercase tracking-widest border border-white/10">
                            <FaHandHoldingDollar className="animate-pulse" /> Transparência Pública
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-md rounded-full text-amber-200 text-xs font-black uppercase tracking-widest border border-amber-500/30">
                            ★ Conformidade PNTP
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight">Emendas PIX</h1>
                    <p className="text-emerald-100 text-lg md:text-xl font-medium leading-relaxed opacity-90">
                        Acompanhe as Transferências Especiais (Emendas PIX) recebidas pelo município, seus autores, finalidades e a execução dos recursos.
                    </p>
                </div>
                <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Previsto", value: totais.previsto, icon: FaCalendarDays, color: "text-gray-400" },
                    { label: "Total Recebido", value: totais.recebido, icon: FaFileInvoiceDollar, color: "text-emerald-500" },
                    { label: "Total Executado", value: totais.executado, icon: FaScaleBalanced, color: "text-blue-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-emerald-50 transition-colors ${stat.color}`}>
                                <stat.icon className="text-2xl" />
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Consolidado</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className={`text-3xl font-black tracking-tight ${stat.color}`}>
                            {stat.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por autor, objeto ou número da emenda..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        className="flex-1 md:w-48 px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700"
                        value={selectedAno}
                        onChange={(e) => setSelectedAno(e.target.value)}
                    >
                        <option value="">Todos os Anos</option>
                        {anos.map(ano => <option key={ano} value={ano}>{ano}</option>)}
                    </select>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                <th className="px-8 py-6">Ano / Autor</th>
                                <th className="px-8 py-6">Objeto / Finalidade</th>
                                <th className="px-8 py-6 text-right">Valores</th>
                                <th className="px-8 py-6 text-center">Situação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <FaSpinner className="animate-spin inline-block text-emerald-500 text-4xl" />
                                        <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando dados...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                                <FaSearch className="text-gray-200 text-3xl" />
                                            </div>
                                            <p className="text-gray-400 italic">Nenhuma emenda encontrada para os critérios selecionados.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xs shrink-0 group-hover:scale-110 transition-transform">
                                                    {item.ano}
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-800 text-lg leading-tight">{item.autor}</div>
                                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter mt-1">
                                                        {item.origem} • {item.numeroEmenda || "N/A"}
                                                    </div>
                                                    <div className="mt-4 flex flex-wrap gap-3">
                                                        {(item.arquivo || item.documentUrl) && (
                                                            <a 
                                                                href={(item.arquivo || item.documentUrl) ?? undefined} 
                                                                target="_blank" 
                                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
                                                            >
                                                                <FaFilePdf className="text-red-500" /> Detalhamento / Comprovação
                                                            </a>
                                                        )}
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                                                            ID: {item.id.slice(-8).toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 max-w-md">
                                            <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-3">
                                                {item.objeto}
                                            </p>
                                            
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {item.contaBancaria && (
                                                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100/50">
                                                        <div className="text-[9px] font-black text-amber-600/70 uppercase tracking-widest mb-1">Conta Bancária (PNTP)</div>
                                                        <div className="text-xs font-bold text-amber-900">{item.contaBancaria}</div>
                                                    </div>
                                                )}
                                                {item.naturezaDespesa && (
                                                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100/50">
                                                        <div className="text-[9px] font-black text-amber-600/70 uppercase tracking-widest mb-1">Natureza Despesa (PNTP)</div>
                                                        <div className="text-xs font-bold text-amber-900">{item.naturezaDespesa}</div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {item.secretariaResponsavel && (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                        <FaCircleInfo className="text-[11px]" /> {item.secretariaResponsavel}
                                                    </div>
                                                )}
                                                {item.prazoExecucao && (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest">
                                                        <FaCalendarDays className="text-[11px]" /> Prazo: {new Date(item.prazoExecucao).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right space-y-2">
                                            <div className="space-y-0.5">
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Recebido</div>
                                                <div className="text-lg font-black text-emerald-600">
                                                    {item.valorRecebido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </div>
                                            </div>
                                            <div className="space-y-0.5 opacity-60">
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Executado</div>
                                                <div className="text-sm font-bold text-blue-600">
                                                    {item.valorExecutado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <span className={`inline-flex px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                                                item.situacao === "Recebido" ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white" :
                                                item.situacao === "Em Execução" ? "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white" :
                                                "bg-gray-50 text-gray-600 border-gray-100 group-hover:bg-gray-800 group-hover:text-white"
                                            }`}>
                                                {item.situacao}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                    <FaCircleInfo className="text-blue-600 text-2xl" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                    <h4 className="text-blue-900 font-black uppercase tracking-widest text-xs">Nota Explicativa</h4>
                    <p className="text-blue-800/70 text-sm font-medium leading-relaxed">
                        As Emendas PIX (Transferências Especiais) são recursos repassados diretamente ao ente federado sem finalidade definida previamente no momento do repasse, devendo sua aplicação ser informada e acompanhada pelos órgãos de controle e pela sociedade através deste portal, conforme exigências do PNTP.
                    </p>
                </div>
            </div>
        </div>
    );
}
