"use client";
import { useState, useEffect } from "react";
import { 
    FaSpinner, FaCalendar, FaBuilding, 
    FaDownload, FaSearch, FaCheckCircle, FaTimesCircle,
    FaArrowRight, FaBriefcase, FaWallet
} from "react-icons/fa";
import {
    FaFileSignature, FaMagnifyingGlass, FaFileLines
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Ata = {
    id: string;
    numero: string;
    objeto: string;
    fornecedor: string;
    cnpj: string;
    valor: number;
    dataRegistro: string;
    dataVencimento: string;
    secretaria: string;
    status: "vigente" | "vencida" | "cancelada";
    arquivoUrl?: string | null;
    hrefDetalhes?: string | null;
};

const statusConfig: Record<string, { label: string; cor: string }> = {
    vigente: { label: "Vigente", cor: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    vencida: { label: "Vencida", cor: "bg-slate-50 text-slate-500 border-slate-100" },
    cancelada: { label: "Cancelada", cor: "bg-rose-50 text-rose-700 border-rose-100" },
};

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function extrairPrimeiroArquivoLicitacao(lic: any): string | null {
    if (lic.contratos?.[0]?.instrumentoIntegralUrl) return lic.contratos[0].instrumentoIntegralUrl;
    if (lic.editalUrl) return lic.editalUrl;
    for (const raw of [lic.fasesDocumentos, lic.documentos]) {
        if (!raw) continue;
        try {
            const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
            if (Array.isArray(arr) && arr.length > 0 && arr[0]?.url) {
                return arr[0].url;
            }
        } catch {
            // Ignora JSON inválido
        }
    }
    return null;
}

export default function AtasRegistroClient() {
    const [atas, setAtas] = useState<Ata[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [statusFiltro, setStatusFiltro] = useState("");

    useEffect(() => {
        let ativo = true;
        async function fetchAtas() {
            setLoading(true);
            try {
                const licParams = new URLSearchParams({ ataRegistroPreco: "true" });
                const docParams = new URLSearchParams({ tipo: "Ata de Registro de Preços,Ata SRP" });
                if (ano) {
                    licParams.set("ano", ano);
                    docParams.set("ano", ano);
                }

                const [resLic, resDoc] = await Promise.all([
                    fetch(`/api/licitacoes?${licParams.toString()}`, { cache: "no-store" }),
                    fetch(`/api/documentos?${docParams.toString()}`, { cache: "no-store" }),
                ]);

                const mapped: Ata[] = [];

                if (resLic.ok) {
                    const dataLic = await resLic.json();
                    const listaLic = Array.isArray(dataLic.items) ? dataLic.items : [];
                    for (const lic of listaLic) {
                        const contrato = lic.contratos?.[0];
                        const statusNorm = String(lic.status || "").toLowerCase();
                        let status: "vigente" | "vencida" | "cancelada" = "vigente";
                        if (["cancelada", "revogada", "anulada", "fracassada", "deserta"].includes(statusNorm)) {
                            status = "cancelada";
                        } else if (
                            contrato?.dataFim &&
                            new Date(contrato.dataFim).getTime() < Date.now()
                        ) {
                            status = "vencida";
                        } else if (["encerrada", "concluida"].includes(statusNorm) && !contrato) {
                            status = "vencida";
                        }

                        const dataInicio =
                            contrato?.dataInicio ||
                            lic.dataHomologacao ||
                            lic.dataPublicacao ||
                            lic.dataAbertura ||
                            lic.criadoEm;
                        const dataFim =
                            contrato?.dataFim ||
                            lic.dataEncerramento ||
                            new Date(
                                new Date(dataInicio).getTime() + 365 * 24 * 60 * 60 * 1000
                            ).toISOString();

                        mapped.push({
                            id: `lic-${lic.id}`,
                            numero: `${lic.numero}/${lic.ano}`,
                            objeto: lic.objeto,
                            fornecedor: contrato?.fornecedor || lic.resultado || "Fornecedor homologado no processo",
                            cnpj: contrato?.cnpjFornecedor || "Conforme processo licitatório",
                            valor: Number(contrato?.valor ?? lic.valorHomologado ?? lic.valorEstimado ?? lic.valor ?? 0),
                            dataRegistro: dataInicio,
                            dataVencimento: dataFim,
                            secretaria: lic.secretaria || "Setor de Licitações",
                            status,
                            arquivoUrl: extrairPrimeiroArquivoLicitacao(lic),
                            hrefDetalhes: `/transparencia/licitacoes`,
                        });
                    }
                }

                if (resDoc.ok) {
                    const dataDoc = await resDoc.json();
                    const listaDoc = Array.isArray(dataDoc) ? dataDoc : [];
                    for (const doc of listaDoc) {
                        if (doc.ativo === false) continue;
                        const docAno = doc.ano || new Date(doc.criadoEm).getFullYear();
                        const dataRegistro = doc.criadoEm || new Date().toISOString();
                        const dataVencimento = new Date(
                            new Date(dataRegistro).getTime() + 365 * 24 * 60 * 60 * 1000
                        ).toISOString();

                        mapped.push({
                            id: `doc-${doc.id}`,
                            numero: doc.competencia || `${docAno}`,
                            objeto: doc.descricao ? `${doc.titulo} — ${doc.descricao}` : doc.titulo,
                            fornecedor: doc.orgaoResponsavel || "Registro Oficial Publicado",
                            cnpj: "Documento Anexo",
                            valor: 0,
                            dataRegistro,
                            dataVencimento,
                            secretaria: doc.secretaria || "Administração Municipal",
                            status: "vigente",
                            arquivoUrl: doc.arquivo || doc.documentUrl || null,
                            hrefDetalhes: doc.arquivo || doc.documentUrl || null,
                        });
                    }
                }

                if (ativo) setAtas(mapped);
            } catch (error) {
                console.error("Erro ao carregar Atas de Registro de Preços:", error);
                if (ativo) setAtas([]);
            } finally {
                if (ativo) setLoading(false);
            }
        }
        fetchAtas();
        return () => {
            ativo = false;
        };
    }, [ano]);

    const filtradas = atas.filter(a => {
        const b = busca.toLowerCase();
        const matchStatus = !statusFiltro || a.status === statusFiltro;
        const matchBusca = !busca || 
            a.objeto.toLowerCase().includes(b) || 
            a.fornecedor.toLowerCase().includes(b) || 
            a.numero.includes(b);
        return matchStatus && matchBusca;
    });

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setStatusFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtradas.map(a => ({
            "Número": a.numero,
            "Objeto": a.objeto,
            "Fornecedor": a.fornecedor,
            "CNPJ": a.cnpj,
            "Secretaria": a.secretaria,
            "Data Registro": new Date(a.dataRegistro).toLocaleDateString("pt-BR"),
            "Data Vencimento": new Date(a.dataVencimento).toLocaleDateString("pt-BR"),
            "Valor Total": fmt(a.valor),
            "Status": statusConfig[a.status]?.label,
        }));

        const filename = `atas_registro_precos_${ano}`;
        const title = `Relatório de Atas de Registro de Preços – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Atas de Registro de Preços"
                subtitle="Consulte os instrumentos homologados para aquisição de bens e serviços com fornecedores pré-qualificados."
                variant="premium"
                icon={<FaFileSignature />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Atas de Registro" }
                ]}
            />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-12 -mt-12 relative z-30"
            >
                {/* Filtros Premium */}
                <motion.div variants={itemVariants} className="mb-12">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth=""
                        onMonthChange={() => {}}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        availableYears={["2026", "2025", "2024", "2023", "2022"]}
                        placeholder="Buscar por número da ata, objeto ou fornecedor..."
                    >
                        <div className="flex items-center gap-3">
                            <select
                                value={statusFiltro}
                                onChange={(e) => setStatusFiltro(e.target.value)}
                                className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none hover:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                            >
                                <option value="">Todos os Status</option>
                                <option value="vigente">Vigente</option>
                                <option value="vencida">Vencida</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* Resumo Bento Box */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    {/* Atas Vigentes */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-100 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vigentes</span>
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <FaCheckCircle size={18} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{filtradas.filter(a => a.status === "vigente").length}</div>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Atas Ativas</span>
                    </div>

                    {/* Montante Registrado */}
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 group-hover:rotate-6">
                            <FaWallet size={120} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-4 block">Potencial de Aquisição</span>
                            <div className="text-4xl font-black tracking-tighter mb-2">{loading ? "..." : fmt(filtradas.reduce((s, a) => s + a.valor, 0))}</div>
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold text-indigo-100/60 uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Soma total registrada
                            </div>
                        </div>
                    </div>

                    {/* Total de Atas */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-100 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Volume Total</span>
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <FaFileSignature size={18} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{filtradas.length}</div>
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Instrumentos ARP</span>
                    </div>
                </motion.div>

                {/* Lista de Atas */}
                <div className="space-y-10">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-inner"
                            >
                                <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-6 mx-auto" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Sincronizando Atas de Registro...</h3>
                            </motion.div>
                        ) : filtradas.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-100"
                            >
                                <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <FaMagnifyingGlass size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Nenhuma ARP localizada</h4>
                                <p className="text-slate-400 font-medium text-sm italic">Tente ajustar os filtros ou pesquisar por outro exercício fiscal.</p>
                            </motion.div>
                        ) : (
                            <motion.div variants={containerVariants} className="grid grid-cols-1 gap-10">
                                {filtradas.map((a) => (
                                    <motion.div 
                                        key={a.id} 
                                        variants={itemVariants}
                                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group hover:shadow-indigo-500/10 transition-all duration-700 hover:border-indigo-100 relative"
                                    >
                                        <div className="p-8 lg:p-12">
                                            <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[1.75rem] flex items-center justify-center shrink-0 border border-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-inner group-hover:rotate-6">
                                                        <FaFileSignature size={32} />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-4 mb-3">
                                                            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors leading-none">ARP Nº {a.numero}</h3>
                                                            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusConfig[a.status]?.cor}`}>
                                                                {a.status === 'vigente' ? <FaCheckCircle size={10} className="mr-2 inline" /> : <FaTimesCircle size={10} className="mr-2 inline" />}
                                                                {statusConfig[a.status]?.label}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                                                                Órgão: {a.secretaria}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 rounded-[2rem] px-10 py-6 border border-slate-50 group-hover:bg-white transition-all duration-500 lg:min-w-[280px] text-right">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Valor Integrado</span>
                                                    <div className="text-4xl font-black text-indigo-600 tracking-tighter tabular-nums">{fmt(a.valor)}</div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/30 p-8 rounded-[2rem] border border-dashed border-slate-100 mb-10 group-hover:bg-white transition-all duration-700">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Objeto do Registro de Preços</p>
                                                <p className="text-slate-500 font-bold italic text-sm leading-relaxed">&ldquo;{a.objeto}&rdquo;</p>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                                        <FaBriefcase size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fornecedor Detentor</p>
                                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-tight">{a.fornecedor}</p>
                                                        <p className="text-[10px] font-mono text-slate-400 font-bold">{a.cnpj}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                                        <FaCalendar size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vigência Homologada</p>
                                                        <p className="text-sm font-black text-slate-800 tracking-tight">
                                                            {new Date(a.dataRegistro).toLocaleDateString("pt-BR")} – {new Date(a.dataVencimento).toLocaleDateString("pt-BR")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-4">
                                                    {a.arquivoUrl ? (
                                                        <a
                                                            href={a.arquivoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-14 px-8 bg-white text-slate-600 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                                                        >
                                                            <FaDownload size={12} /> Baixar Ata
                                                        </a>
                                                    ) : (
                                                        <span className="h-14 px-6 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center">
                                                            Sem anexo
                                                        </span>
                                                    )}
                                                    {a.hrefDetalhes && (
                                                        <a
                                                            href={a.hrefDetalhes}
                                                            target={a.hrefDetalhes.startsWith("http") ? "_blank" : undefined}
                                                            rel={a.hrefDetalhes.startsWith("http") ? "noopener noreferrer" : undefined}
                                                            aria-label={`Ver detalhes da ARP ${a.numero}`}
                                                            className="h-14 w-14 flex items-center justify-center bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 group/btn"
                                                        >
                                                            <FaArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </motion.div>
        </div>
    );
}
