"use client";

import { useState } from "react";
import { 
    FaPills, 
    FaListUl, 
    FaCircleInfo, 
    FaCheck, 
    FaTriangleExclamation, 
    FaBoxOpen, 
    FaClock, 
    FaIdCard, 
    FaMapMarkerAlt, 
    FaEnvelope, 
    FaFilePrescription, 
    FaHandHoldingHeart, 
    FaFlaskVial, 
    FaSearch,
    FaBolt,
    FaBuildingColumns
} from "react-icons/fa6";
import ExportButtons from "@/components/transparencia/ExportButtons";

type Medicamento = {
    id: string;
    nome: string;
    categoria: string;
    status: string;
    observacao?: string | null;
    ativo: boolean;
};

export default function MedicamentosSUSClient({ medicamentos }: { medicamentos: Medicamento[] }) {
    const [abaAtiva, setAbaAtiva] = useState<"lista" | "como-obter" | "especializado">("lista");
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("todos");

    // Categorias únicas
    const categorias = Array.from(new Set(medicamentos.map(m => m.categoria))).sort();

    const medicamentosFiltrados = medicamentos.filter(item => {
        const matchCat = categoriaFiltro === "todos" || item.categoria === categoriaFiltro;
        const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase()) || 
                           (item.observacao && item.observacao.toLowerCase().includes(busca.toLowerCase()));
        return matchCat && matchBusca;
    });

    return (
        <div className="space-y-10">
            {/* Seletor de Abas Principal */}
            <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-2.5 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 max-w-4xl mx-auto">
                <button
                    onClick={() => setAbaAtiva("lista")}
                    className={`flex-1 py-4 px-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        abaAtiva === "lista"
                            ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20 scale-[1.02]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <FaListUl className="text-base shrink-0" /> 
                    <span>Relação REMUME</span>
                </button>
                <button
                    onClick={() => setAbaAtiva("como-obter")}
                    className={`flex-1 py-4 px-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        abaAtiva === "como-obter"
                            ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20 scale-[1.02]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <FaCircleInfo className="text-base shrink-0" /> 
                    <span>Medicamentos Básicos (CBAF)</span>
                </button>
                <button
                    onClick={() => setAbaAtiva("especializado")}
                    className={`flex-1 py-4 px-5 rounded-[1.5rem] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        abaAtiva === "especializado"
                            ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20 scale-[1.02]"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <FaFlaskVial className="text-base shrink-0" /> 
                    <span>Componente Especializado (Alto Custo)</span>
                </button>
            </div>

            {/* ABA 1: RELAÇÃO DE MEDICAMENTOS */}
            {abaAtiva === "lista" && (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
                    {/* Barra de Filtros e Busca */}
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/30 space-y-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                                    <FaFlaskVial size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Catálogo de Medicamentos</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{medicamentosFiltrados.length} Itens Encontrados</p>
                                </div>
                            </div>
                            <ExportButtons data={medicamentosFiltrados} filename="lista_medicamentos_sus" />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            {/* Filtro de Categoria */}
                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => setCategoriaFiltro("todos")}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        categoriaFiltro === "todos"
                                            ? "bg-[#003366] text-white shadow-md"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    Todas as Categorias
                                </button>
                                {categorias.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoriaFiltro(cat)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                            categoriaFiltro === cat
                                                ? "bg-[#003366] text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Campo de Busca */}
                            <div className="relative w-full md:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input
                                    type="text"
                                    placeholder="Buscar medicamento ou princípio ativo..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#003366]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Grid de Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {medicamentosFiltrados.length === 0 ? (
                            <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-200 space-y-4">
                                <FaPills className="text-4xl text-gray-300 mx-auto" />
                                <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">Nenhum medicamento encontrado</h4>
                                <p className="text-xs text-gray-400 font-medium">Tente ajustar a busca ou os filtros acima.</p>
                            </div>
                        ) : (
                            medicamentosFiltrados.map((item) => {
                                let StatusIcon = FaCheck;
                                let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                let statusLabel = "Disponível";

                                if (item.status === "em-falta") {
                                    StatusIcon = FaTriangleExclamation;
                                    statusColor = "bg-rose-50 text-rose-700 border-rose-200";
                                    statusLabel = "Em Falta";
                                } else if (item.status === "estoque-baixo") {
                                    StatusIcon = FaBoxOpen;
                                    statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                                    statusLabel = "Baixo Estoque";
                                }

                                return (
                                    <div 
                                        key={item.id}
                                        className="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-slate-100 hover:shadow-2xl hover:border-rose-200 transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                                                    <FaPills size={20} />
                                                </div>
                                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
                                                    {item.categoria}
                                                </span>
                                            </div>

                                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-3 group-hover:text-[#003366] transition-colors leading-tight">
                                                {item.nome}
                                            </h4>

                                            {item.observacao && (
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                                                        "{item.observacao}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${statusColor}`}>
                                                <StatusIcon size={12} /> {statusLabel}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">SUS • Gratuito</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* ABA 2: COMO OBTER MEDICAMENTO DO COMPONENTE BÁSICO */}
            {abaAtiva === "como-obter" && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300">
                    {/* Header Promocional da Assistência Farmacêutica */}
                    <div className="bg-gradient-to-r from-[#002241] via-[#003366] to-[#01b0ef] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="relative z-10 max-w-3xl space-y-4">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200">
                                <FaHandHoldingHeart className="text-emerald-400" /> Componente Básico da Assistência Farmacêutica (CBAF)
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
                                Orientação de Acesso e Dispensação Gratuita
                            </h2>
                            <p className="text-blue-100 text-xs md:text-sm font-medium leading-relaxed">
                                Guia completo com etapas, documentos exigidos, horários e locais de atendimento para obtenção de medicamentos da Relação Municipal de Medicamentos Essenciais (REMUME) em Lajes Pintadas / RN.
                            </p>
                        </div>
                    </div>

                    {/* 1. Principais Etapas do Serviço */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                            <div className="w-14 h-14 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border border-blue-100">
                                <FaListUl />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#01b0ef]">Passo a Passo</span>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Principais Etapas do Serviço</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-3 relative overflow-hidden group hover:border-blue-200 hover:bg-white transition-all">
                                <div className="w-10 h-10 bg-[#003366] text-white font-black text-sm rounded-xl flex items-center justify-center shadow-md">
                                    01
                                </div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Comparecimento com Documentação</h4>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Comparecer à Unidade Básica de Saúde (UBS) ou à Central de Abastecimento Farmacêutico (CAF) portando os documentos necessários.
                                </p>
                            </div>

                            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-3 relative overflow-hidden group hover:border-blue-200 hover:bg-white transition-all">
                                <div className="w-10 h-10 bg-[#003366] text-white font-black text-sm rounded-xl flex items-center justify-center shadow-md">
                                    02
                                </div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Verificação e Validação</h4>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Conferência da prescrição médica, dentro da validade, e verificação da disponibilidade do medicamento no estoque oficial.
                                </p>
                            </div>

                            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-3 relative overflow-hidden group hover:border-blue-200 hover:bg-white transition-all">
                                <div className="w-10 h-10 bg-[#003366] text-white font-black text-sm rounded-xl flex items-center justify-center shadow-md">
                                    03
                                </div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Registro e Entrega</h4>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                    Registro do atendimento de dispensação e entrega imediata do medicamento ao paciente ou responsável legal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Requisitos e Documentos Necessários */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border border-emerald-100">
                                <FaIdCard />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Documentação Exigida</span>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Requisitos - Documentos Necessários</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4 bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
                                <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm">
                                    <FaIdCard />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Documento Obrigatório</span>
                                    <h4 className="text-xs font-black text-gray-900 uppercase">DOCUMENTO DE IDENTIFICAÇÃO</h4>
                                    <p className="text-[11px] text-gray-500 font-medium">RG, CNH ou documento oficial com foto</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
                                <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm">
                                    <FaHandHoldingHeart />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Identificação SUS</span>
                                    <h4 className="text-xs font-black text-gray-900 uppercase">CARTÃO SUS</h4>
                                    <p className="text-[11px] text-gray-500 font-medium">Cartão Nacional de Saúde ativo</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
                                <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm">
                                    <FaFilePrescription />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Validade Médica</span>
                                    <h4 className="text-xs font-black text-gray-900 uppercase">PRESCRIÇÃO MÉDICA DO MEDICAMENTO</h4>
                                    <p className="text-[11px] text-gray-500 font-medium">Receita médica legível e na validade</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Grade de Informações Operacionais */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaBolt />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Previsão de Prazo</span>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-1">ENTREGA IMEDIATA</h4>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaClock />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Horário de Atendimento</span>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight mt-1">SEGUNDA À SEXTA-FEIRA DAS 07H ÀS 17H</h4>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaHandHoldingHeart />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custo para o Usuário</span>
                                <h4 className="text-base font-black text-emerald-700 uppercase tracking-tight mt-1">GRATUITO (100% SUS)</h4>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaBolt />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tempo Prioritário</span>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-1">ATENDIMENTO IMEDIATO</h4>
                            </div>
                        </div>
                    </div>

                    {/* 4. Locais e Contatos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
                            <div className="flex items-center gap-3 text-blue-600">
                                <FaBuildingColumns size={24} />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Local de Atendimento</span>
                            </div>
                            <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">UNIDADES BÁSICAS DE SAÚDE (UBS) & CAF</h4>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                Disponível gratuitamente nas Unidades Básicas de Saúde da zona urbana e rural e na Central de Abastecimento Farmacêutico (CAF) de Lajes Pintadas.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
                            <div className="flex items-center gap-3 text-emerald-600">
                                <FaEnvelope size={24} />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Mecanismo de Comunicação</span>
                            </div>
                            <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">Email de Ouvidoria & Atendimento</h4>
                            <a 
                                href="mailto:ouvidoria@lajespintadas.rn.gov.br"
                                className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline"
                            >
                                ouvidoria@lajespintadas.rn.gov.br
                            </a>
                            <p className="text-xs text-gray-500 font-medium">Canal oficial para dúvidas, sugestões e acompanhamento de medicamentos.</p>
                        </div>
                    </div>

                    {/* 5. Informações Adicionais */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-[2.5rem] p-8 md:p-10 border border-blue-100 space-y-4">
                        <div className="flex items-center gap-3 text-[#003366]">
                            <FaCircleInfo size={24} />
                            <h3 className="text-base font-black uppercase tracking-tight">Informações Adicionais</h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                            Os medicamentos básicos são aqueles destinados ao tratamento de doenças mais comuns na Atenção Primária à Saúde, como hipertensão, diabetes, infecções, entre outras. Estes medicamentos fazem parte da Relação Municipal de Medicamentos Essenciais (REMUME) e estão disponíveis gratuitamente nas Unidades Básicas de Saúde (UBS) e na Central de Abastecimento Farmacêutico (CAF).
                        </p>
                    </div>
                </div>
            )}

            {/* ABA 3: COMO OBTER MEDICAMENTOS DO COMPONENTE ESPECIALIZADO (ALTO CUSTO - CEAF) */}
            {abaAtiva === "especializado" && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300">
                    {/* Header Promocional do CEAF */}
                    <div className="bg-gradient-to-r from-[#002241] via-[#003366] to-[#4f46e5] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="relative z-10 max-w-3xl space-y-4">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-200">
                                <FaFlaskVial className="text-amber-400" /> Componente Especializado da Assistência Farmacêutica (CEAF)
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
                                Medicamentos de Alto Custo (CEAF)
                            </h2>
                            <p className="text-indigo-100 text-xs md:text-sm font-medium leading-relaxed">
                                Estratégia do Sistema Único de Saúde (SUS) para garantir o acesso a medicamentos de alto custo, conforme os Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) definidos pelo Ministério da Saúde.
                            </p>
                        </div>
                    </div>

                    {/* 1. Principais Etapas do Serviço */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border border-indigo-100">
                                <FaListUl />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Fluxo de Atendimento</span>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Principais Etapas do Serviço</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3 relative overflow-hidden group hover:border-indigo-200 hover:bg-white transition-all">
                                <div className="w-9 h-9 bg-indigo-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                                    01
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">Entrega de Documentos</h4>
                                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                    Entregar a documentação completa no local de atendimento oficial da Secretaria de Saúde.
                                </p>
                            </div>

                            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3 relative overflow-hidden group hover:border-indigo-200 hover:bg-white transition-all">
                                <div className="w-9 h-9 bg-indigo-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                                    02
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">Abertura de Protocolo</h4>
                                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                    Abertura oficial do protocolo de solicitação junto ao sistema municipal.
                                </p>
                            </div>

                            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3 relative overflow-hidden group hover:border-indigo-200 hover:bg-white transition-all">
                                <div className="w-9 h-9 bg-indigo-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                                    03
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">Análise Técnica</h4>
                                <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                    Análise técnica detalhada dos documentos pela equipe de regulação farmacêutica.
                                </p>
                            </div>

                            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 space-y-3 relative overflow-hidden group hover:bg-white transition-all">
                                <div className="w-9 h-9 bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                                    04
                                </div>
                                <h4 className="text-xs font-black text-emerald-900 uppercase tracking-tight">Deferimento</h4>
                                <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                                    Em caso de deferimento, agendamento para a entrega do medicamento.
                                </p>
                            </div>

                            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-100 space-y-3 relative overflow-hidden group hover:bg-white transition-all">
                                <div className="w-9 h-9 bg-amber-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                                    05
                                </div>
                                <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight">Indeferimento (Recurso)</h4>
                                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                                    Em caso de indeferimento, orientação sobre procedimento de recurso administrativo.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Requisitos - Documentos Necessários */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-8">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border border-indigo-100">
                                <FaIdCard />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Documentação Obrigatória</span>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Requisitos - Documentos Necessários</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-2">
                                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                                    <FaCheck className="text-emerald-500" /> Formulário LME
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase">LAUDO DE SOLICITAÇÃO (LME)</h4>
                                <p className="text-[11px] text-gray-600 font-medium">Laudo de Solicitação, Avaliação e Autorização de Medicamento (LME) preenchido e assinado pelo médico.</p>
                            </div>

                            <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-2">
                                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                                    <FaCheck className="text-emerald-500" /> Receita Médica
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase">PRESCRIÇÃO MÉDICA ATUALIZADA</h4>
                                <p className="text-[11px] text-gray-600 font-medium">Prescrição médica atualizada, contendo código CID e nome do medicamento.</p>
                            </div>

                            <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-2">
                                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                                    <FaCheck className="text-emerald-500" /> Cópia de Documentos
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase">DOCUMENTOS PESSOAIS</h4>
                                <p className="text-[11px] text-gray-600 font-medium">Cópia dos documentos pessoais: RG, Cartão SUS e Comprovante de Residência.</p>
                            </div>

                            <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-2">
                                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                                    <FaCheck className="text-emerald-500" /> Exames do Protocolo
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase">RESULTADOS DE EXAMES</h4>
                                <p className="text-[11px] text-gray-600 font-medium">Resultados de exames exigidos conforme o PCDT da doença.</p>
                            </div>

                            <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-2 md:col-span-2 lg:col-span-2">
                                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                                    <FaCheck className="text-emerald-500" /> Documentação Específica
                                </div>
                                <h4 className="text-xs font-black text-gray-900 uppercase">OUTROS DOCUMENTOS DO PROTOCOLO</h4>
                                <p className="text-[11px] text-gray-600 font-medium">Outros documentos formais que o protocolo específico do medicamento ou patologia exigir.</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Grade de Informações Operacionais */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaBolt />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Previsão de Prazo</span>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-1">IMEDIATO</h4>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaClock />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Horário de Atendimento</span>
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight mt-1">SEGUNDA À SEXTA-FEIRA DAS 07H ÀS 17H</h4>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaHandHoldingHeart />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Custo para o Usuário</span>
                                <h4 className="text-base font-black text-emerald-700 uppercase tracking-tight mt-1">GRATUITO (100% SUS)</h4>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between space-y-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Formas de Prestação</span>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-1">PRESENCIAL</h4>
                            </div>
                        </div>
                    </div>

                    {/* 4. Local de Atendimento & Canais de Consulta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <FaBuildingColumns size={24} />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Local de Atendimento</span>
                            </div>
                            <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">SECRETARIA MUNICIPAL DE SAÚDE</h4>
                            <p className="text-xs text-gray-600 font-bold leading-relaxed">
                                RUA JOÃO FRANCISCO BORGES, CENTRO, LAJES PINTADAS/RN
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <FaEnvelope size={24} />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Comunicação e Consulta de Solicitação</span>
                            </div>
                            <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">Email de Ouvidoria e Acompanhamento</h4>
                            <a 
                                href="mailto:ouvidoria@lajespintadas.rn.gov.br"
                                className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
                            >
                                ouvidoria@lajespintadas.rn.gov.br
                            </a>
                            <p className="text-xs text-gray-500 font-medium">Mecanismo oficial de comunicação e consulta do andamento da solicitação do medicamento de alto custo.</p>
                        </div>
                    </div>

                    {/* 5. Informações Adicionais (CEAF) */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50/50 rounded-[2.5rem] p-8 md:p-10 border border-indigo-100 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-900">
                            <FaCircleInfo size={24} />
                            <h3 className="text-base font-black uppercase tracking-tight">Informações Adicionais</h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
                            O Componente Especializado da Assistência Farmacêutica (CEAF) é uma estratégia do Sistema Único de Saúde (SUS) para garantir o acesso a medicamentos de alto custo, conforme Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) definidos pelo Ministério da Saúde.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
