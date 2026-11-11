"use client";
import Link from "next/link";
import { FaDatabase, FaTable, FaLock, FaBolt } from "react-icons/fa";
import { FaFileCode, FaCircleInfo } from "react-icons/fa6";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { exportToCSV, exportToJSON, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import toast from "react-hot-toast";

const conjuntos = [
    {
        titulo: "Servidores Municipais",
        descricao: "Remuneração, cargos, vínculos, carga horária e lotação dos agentes públicos ativos.",
        endpoint: "/api/servidores?exportAll=true",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Mensal",
        lei: "LC 131/2009 · PNTP 6.1",
        dicionario: "nome, cargo, vinculo, secretaria, cargaHoraria, salarioBase, gratificacoes, descontos, totalBruto, totalLiquido, mes, ano",
        gradient: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/20"
    },
    {
        titulo: "Receitas Públicas",
        descricao: "Previsão, lançamento e arrecadação municipal por código de natureza, fonte e categoria.",
        endpoint: "/api/receitas?exportAll=true",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Tempo Real (D+1)",
        lei: "LC 131/2009 · PNTP 3.1",
        dicionario: "naturezaCodigo, descricao, categoria, valorPrevisto, valorAtualizado, valorLancado, valorArrecadado, fonte, mes, ano",
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/20"
    },
    {
        titulo: "Despesas Públicas",
        descricao: "Fluxo completo de empenhos, liquidações, pagamentos, credores e classificação orçamentária.",
        endpoint: "/api/despesas?exportAll=true",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Tempo Real (D+1)",
        lei: "LC 131/2009 · PNTP 4.1",
        dicionario: "numeroEmpenho, dataEmpenho, descricao, categoria, secretaria, fornecedor, credorCpfCnpj, fonteRecurso, valorEmpenhado, valorLiquidado, valorPago, mes, ano",
        gradient: "from-slate-800 to-slate-900",
        shadow: "shadow-slate-900/20"
    },
    {
        titulo: "Licitações",
        descricao: "Processos licitatórios, dispensa/inexigibilidade, editais, fases e valores estimados/homologados.",
        endpoint: "/api/licitacoes",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "Lei 14.133/2021 · PNTP 8.1",
        dicionario: "numero, numeroProcesso, modalidade, objeto, secretaria, valorEstimado, valorHomologado, status, dataAbertura, editalUrl",
        gradient: "from-purple-500 to-violet-600",
        shadow: "shadow-purple-500/20"
    },
    {
        titulo: "Contratos e Aditivos",
        descricao: "Contratos administrativos, termos aditivos, fiscais designados, vigência e valores.",
        endpoint: "/api/contratos",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "Lei 14.133/2021 · PNTP 9.1",
        dicionario: "numero, ano, objeto, contratado, cnpjCpf, valor, dataInicio, dataFim, secretaria, status, fiscais, aditivos",
        gradient: "from-orange-500 to-amber-600",
        shadow: "shadow-orange-500/20"
    },
    {
        titulo: "Convênios e Transferências",
        descricao: "Transferências recebidas, realizadas e acordos de cooperação sem transferência financeira.",
        endpoint: "/api/convenios",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "LAI · PNTP 10.1",
        dicionario: "numero, tipoTransferencia, concedente, proponente, beneficiario, objeto, valorTotal, valorRepasse, valorContrapartida, vigenciaInicio, vigenciaFim, situacao",
        gradient: "from-rose-500 to-pink-600",
        shadow: "shadow-rose-500/20"
    },
    {
        titulo: "Obras Públicas",
        descricao: "Dados técnicos, medições, evolução física, valores pagos e situação de obras municipais.",
        endpoint: "/api/admin/obras",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Mensal",
        lei: "PNTP 5.1 / 8.5",
        dicionario: "titulo, local, empresa, numeroContrato, valor, valorPago, percentual, status, dataInicio, previsaoTermino, motivoParalisacao",
        gradient: "from-orange-600 to-red-700",
        shadow: "shadow-red-600/20"
    },
    {
        titulo: "Diárias e Passagens",
        descricao: "Concessão de diárias, portarias, relatórios de viagem e valores pagos para deslocamentos.",
        endpoint: "/api/diarias",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "LAI · PNTP 7.1",
        dicionario: "servidor, cargo, secretaria, destino, motivo, dataInicio, dataFim, quantidadeDias, valorUnitario, valor, portariaConcessao",
        gradient: "from-sky-500 to-cyan-600",
        shadow: "shadow-sky-500/20"
    },
    {
        titulo: "Emendas Parlamentares",
        descricao: "Emendas individuais, de bancada, comissão e transferências especiais (federais, estaduais e municipais).",
        endpoint: "/api/transparencia/emendas-parlamentares",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Contínua",
        lei: "LC 210/2024 · PNTP 12.1",
        dicionario: "numero, ano, esfera, autor, tipo, formaRepasse, objeto, funcaoGoverno, valorPrevisto, valorRecebido, valorEmpenhado, valorLiquidado, valorPago, status",
        gradient: "from-teal-400 to-emerald-500",
        shadow: "shadow-teal-500/20"
    },
    {
        titulo: "Renúncias de Receita",
        descricao: "Demonstrativo de benefícios tributários, incentivos culturais/esportivos, isenções e desonerações.",
        endpoint: "/api/transparencia/renuncias-fiscais",
        formatos: ["JSON", "CSV", "XLSX"],
        atualizacao: "Anual",
        lei: "Art. 14 LRF · PNTP 3.2",
        dicionario: "exercicio, tipo, modalidade, tributo, beneficiario, cnpjCpf, justificativa, valorRenunciado, valorRealizado, contrapartida",
        gradient: "from-orange-400 to-red-500",
        shadow: "shadow-orange-500/20"
    },
];

export default function DadosAbertosPage() {
    const handleDownload = async (endpoint: string, titulo: string, formato: string, lei: string) => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.items || []);
            const filename = `dados-abertos-${titulo.toLowerCase().replace(/\s+/g, "-")}`;
            const context = {
                titulo: `Dataset Aberto: ${titulo} (${lei})`,
                fonte: "Portal de Dados Abertos - Prefeitura Municipal de Lajes Pintadas/RN",
                filtros: `Formato: ${formato} | Endpoint: ${endpoint}`,
            };

            if (items.length === 0) {
                toast("Conjunto sem registros publicados no momento; exportando arquivo com cabeçalho de metadados.", { icon: "ℹ️" });
            }

            const exportRows = items.length > 0 ? items : [{ aviso: "Sem registros publicados neste conjunto até a data da extração" }];

            if (formato === "JSON") exportToJSON(exportRows, filename, context);
            if (formato === "CSV") exportToCSV(exportRows, filename, context);
            if (formato === "XLSX") exportToXLSX(exportRows, filename, context);
        } catch {
            toast.error("Erro ao baixar dados. Tente novamente.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Dados Abertos"
                subtitle="Acesso livre, automatizado e estruturado às bases públicas municipais em formatos legíveis por máquina (JSON, CSV e XLSX)."
                variant="premium"
                icon={<FaDatabase />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dados Abertos" }
                ]}
            />

            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center gap-10 py-5 px-6">
                    {[
                        { label: "Open Data Charter", icon: <FaBolt className="text-blue-400" /> },
                        { label: "Metadados e Dicionário", icon: <FaDatabase className="text-emerald-400" /> },
                        { label: "API REST / JSON / CSV / XLSX", icon: <FaFileCode className="text-orange-400" /> },
                        { label: "LAI Art. 8º § 3º", icon: <FaLock className="text-rose-400" /> }
                    ].map((item) => (
                        <span key={item.label} className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                            {item.icon} {item.label}
                        </span>
                    ))}
                </div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-16 -mt-12 relative z-30"
            >
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 lg:p-14 mb-16 flex flex-col md:flex-row items-center gap-12 group">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 border border-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-inner">
                        <FaDatabase size={36} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Manual de Dados Abertos e API</span>
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        </div>
                        <h2 className="font-black text-slate-800 text-3xl uppercase tracking-tighter mb-4 leading-none">Catálogo de Bases Públicas e Dicionário de Dados</h2>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium max-w-3xl">
                            Todos os conjuntos de dados incluem metadados de identificação do ente (IBGE 2406601), data/hora da extração, fonte oficial e proteção contra injeção de fórmulas em planilhas, sem exigência de cadastro prévio ou CAPTCHA.
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {conjuntos.map((c) => (
                        <motion.div
                            key={c.titulo}
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 relative hover:border-blue-100"
                        >
                            <div className={`h-3 w-full bg-gradient-to-r ${c.gradient}`} />

                            <div className="p-8 lg:p-10">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                            Dataset Oficial / {c.lei}
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter group-hover:text-blue-600 transition-colors leading-none">
                                            {c.titulo}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <FaTable size={20} />
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                                    {c.descricao}
                                </p>

                                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-6">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        Dicionário de Atributos Principais ({c.endpoint.split("?")[0]})
                                    </span>
                                    <code className="text-[11px] text-slate-700 font-mono break-words leading-relaxed">
                                        {c.dicionario}
                                    </code>
                                </div>

                                <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-blue-100 rounded-full" />
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Periodicidade</span>
                                            <span className="text-xs font-black text-slate-800 uppercase">{c.atualizacao}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {c.formatos.map((f) => (
                                            <span key={f} className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-200">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleDownload(c.endpoint, c.titulo, "JSON", c.lei)}
                                        className="flex items-center justify-center gap-2 bg-slate-900 text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                    >
                                        <FaFileCode size={14} className="text-blue-400" /> JSON
                                    </button>
                                    <button
                                        onClick={() => handleDownload(c.endpoint, c.titulo, "CSV", c.lei)}
                                        className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        <FaTable size={14} className="text-emerald-600" /> CSV
                                    </button>
                                    <button
                                        onClick={() => handleDownload(c.endpoint, c.titulo, "XLSX", c.lei)}
                                        className="flex items-center justify-center gap-2 bg-emerald-600 text-white h-12 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                                    >
                                        <FaTable size={14} /> XLSX
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-slate-950/20">
                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30">
                            <FaCircleInfo size={32} />
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Licenciamento de Uso Livre</h4>
                        <p className="text-slate-300 font-medium text-sm max-w-2xl leading-relaxed mb-8">
                            Os conjuntos de dados são disponibilizados sob a Licença <strong className="text-white">Creative Commons Attribution 4.0 (CC BY 4.0)</strong>, permitindo livre reutilização, cruzamento e auditoria social com atribuição da fonte oficial: Prefeitura Municipal de Lajes Pintadas/RN.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/servicos/esic" className="h-14 flex items-center px-10 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                                Solicitar Base Específica (e-SIC)
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-24">
                    <BannerPNTP />
                </div>
            </motion.div>
        </div>
    );
}
