"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Info, FileText, GraduationCap, Briefcase, UserCheck, Loader2 } from "lucide-react";
import { FaInfoCircle, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";

type Estagiario = {
    id: string;
    nome: string;
    instituicaoEnsino: string;
    unidadeLotacao: string;
    dataInicio: string;
    dataFim: string | null;
    valorBolsa: number;
    status: string;
};

export default function EstagiariosPage() {
    const [estagiarios, setEstagiarios] = useState<Estagiario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("2026");
    const [mes, setMes] = useState("");
    const [status, setStatus] = useState("");

    const fetchEstagiarios = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ 
                query: busca,
                ano,
                mes,
                status
            });
            const res = await fetch(`/api/estagiarios?${query.toString()}`);
            const data = await res.json();
            setEstagiarios(data.items || []);
        } catch (error) {
            console.error("Erro ao buscar estagiários:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstagiarios();
    }, [busca, ano, mes, status]);

    const handleClearFilters = () => {
        setBusca("");
        setAno("2026");
        setMes("");
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = estagiarios.map(e => ({
            "Nome": e.nome,
            "Instituição": e.instituicaoEnsino,
            "Lotação": e.unidadeLotacao,
            "Início": new Date(e.dataInicio).toLocaleDateString('pt-BR'),
            "Término": e.dataFim ? new Date(e.dataFim).toLocaleDateString('pt-BR') : "Vigente",
            "Bolsa": new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(e.valorBolsa),
            "Status": e.status
        }));

        const filename = `estagiarios_lajes_pintadas`;
        const title = `Relatório de Estagiários – Município de Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const temDadosOriginalmente = estagiarios.length > 0 || busca !== "" || mes !== "";

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Estagiários"
                subtitle="Consulte a relação de estagiários e os termos de compromisso de estágio."
                variant="premium"
                icon={<Briefcase className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Estagiários" }
                ]}
            />

            {/* Banner PNTP */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei de Diretrizes e Bases", "Lei do Estágio", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Buscar por nome, instituição ou lotação..."
                >
                    <div className="w-full sm:w-48">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Situação (Tipo)</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-300 transition-all font-black text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="">Todas as Situações</option>
                            <option value="ativo">Ativos</option>
                            <option value="encerrado">Encerrados</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando dados...</p>
                    </div>
                ) : estagiarios.length === 0 ? (
                    <div className="bg-red-50 border-l-8 border-red-500 rounded-r-3xl p-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 shadow-xl shadow-red-500/10 transition-all hover:bg-red-100">
                        <FaInfoCircle className="text-red-500 text-5xl shrink-0 drop-shadow-md" />
                        <div className="text-center md:text-left">
                            <h3 className="text-red-900 font-black text-xl uppercase tracking-tight mb-2">Comunicação Oficial</h3>
                            <p className="text-red-700 font-bold text-lg md:text-xl">
                                {busca || mes !== "" 
                                    ? "Nenhum estagiário encontrado para os filtros aplicados."
                                    : `A Prefeitura Municipal de Lajes Pintadas informa que NÃO POSSUÍMOS ESTAGIÁRIOS em nosso quadro de colaboradores para o período selecionado (${mes ? mes + '/' : ''}${ano}).`
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <UserCheck className="text-blue-600" /> Relação de Estagiários
                                </h2>
                                <p className="text-slate-500 font-medium">Dados atualizados conforme Termos de Compromisso vigentes.</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Nome do Estagiário</th>
                                        <th className="px-8 py-5">Instituição / Lotação</th>
                                        <th className="px-8 py-5">Período</th>
                                        <th className="px-8 py-5">Bolsa-Auxílio</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {estagiarios.map((e) => (
                                        <tr key={e.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{e.nome}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-semibold text-slate-600">{e.instituicaoEnsino}</div>
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-wider">{e.unidadeLotacao}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-medium text-slate-500">
                                                    {new Date(e.dataInicio).toLocaleDateString('pt-BR')} 
                                                    {e.dataFim ? ` — ${new Date(e.dataFim).toLocaleDateString('pt-BR')}` : " (Vigente)"}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-mono font-bold text-slate-700">
                                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(e.valorBolsa)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                    e.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {e.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <GraduationCap size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Info size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Ocupação e Transparência</h2>
                        </div>

                        <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-12">
                            <p>
                                Em atendimento à <strong>Lei de Diretrizes e Bases da Educação</strong> e às normas de transparência pública (PNTP 2026), esta seção disponibiliza informações sobre estudantes que mantenham vínculo de estágio com a administração municipal.
                            </p>
                            <p>
                                O estágio é um ato educativo escolar supervisionado, desenvolvido no ambiente de trabalho, que visa à preparação para o trabalho produtivo de educandos. O município zela pelo cumprimento de todos os direitos e deveres previstos na Lei do Estágio.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link 
                                href="/contato" 
                                className="flex-1 bg-slate-900 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Solicitar via E-SIC
                            </Link>
                            <a 
                                href="/transparencia" 
                                className="flex-1 bg-amber-600 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Voltar ao Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
