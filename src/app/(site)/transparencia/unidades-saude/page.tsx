"use client";

import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { 
    FaHospital, FaMapPin, FaClock, FaPhone, FaUserMd, 
    FaStethoscope, FaTooth, FaDownload, FaSearch, FaUserNurse,
    FaCheckCircle, FaBriefcaseMedical, FaFilter
} from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

type ProfissionalEscala = {
    nome: string;
    cargo: string;
    especialidade: string;
    registroProfissional: string;
    diasHorarios: string;
};

type UnidadeSaudeCompleta = {
    id: string;
    nome: string;
    tipo: string;
    descricao: string;
    endereco: string;
    telefone: string | null;
    horario: string;
    servicos: string;
    especialidades: string[];
    equipe: ProfissionalEscala[];
};

const DADOS_UNIDADES_SAUDE: UnidadeSaudeCompleta[] = [
    {
        id: "hosp-1",
        nome: "Hospital Municipal e Maternidade Nossa Senhora",
        tipo: "Hospital / Urgência",
        descricao: "Unidade hospitalar municipal e maternidade de pronto atendimento, urgência e emergência 24 horas.",
        endereco: "Av. Principal, s/n - Centro, Lajes Pintadas/RN",
        telefone: "(84) 9 9652-0043",
        horario: "Atendimento Ininterrupto 24 horas (Todos os dias)",
        servicos: "Pronto Atendimento 24h, Internação Clínica Básica, Maternidade/Partos de Baixo Risco, Triagem com Classificação de Risco, Farmácia Hospitalar, Sala de Sutura e Eletrocardiograma.",
        especialidades: ["Clínica Geral / Plantão 24h", "Obstetrícia e Maternidade", "Enfermagem de Urgência", "Urgência e Emergência"],
        equipe: [
            { nome: "Dr. Marcos Vinícius A. de Souza", cargo: "Médico Clínico Geral", especialidade: "Clínica Médica / Urgência", registroProfissional: "CRM/RN 8.412", diasHorarios: "Escala de Plantão 24h" },
            { nome: "Dra. Juliana Cavalcante Bezerra", cargo: "Médica Plantonista", especialidade: "Clínica Geral e Obstetrícia", registroProfissional: "CRM/RN 9.874", diasHorarios: "Escala de Plantão 24h" },
            { nome: "Enf. Rodrigo Ferreira de Lima", cargo: "Enfermeiro Chefe de Plantão", especialidade: "Enfermagem de Urgência", registroProfissional: "COREN/RN 345.120", diasHorarios: "Segunda a Sexta: 07h às 19h" },
            { nome: "Téc. Maria José da Silva", cargo: "Técnica de Enfermagem", especialidade: "Enfermagem Hospitalar", registroProfissional: "COREN/RN 612.401", diasHorarios: "Escala 12x36h" }
        ]
    },
    {
        id: "ubs-1",
        nome: "UBS João Olinto de Oliveira (Sede Urbana)",
        tipo: "Unidade Básica de Saúde",
        descricao: "Unidade Básica de Saúde de referência da área urbana para atenção primária da Estratégia Saúde da Família (ESF).",
        endereco: "Rua Miriam Cavalcante Lima, Centro, Lajes Pintadas/RN",
        telefone: "(84) 9 8748-0287",
        horario: "Segunda a Sexta-feira: 07h00 às 17h00",
        servicos: "Consultas Médicas da Atenção Básica, Acompanhamento Pré-Natal, Puericultura, Vacinação de Rotina SUS, Consultório Odontológico, Citopatológico, Curativos, Testes Rápidos e Farmácia Básica.",
        especialidades: ["Medicina da Família e Comunidade", "Enfermagem da Família", "Odontologia / Saúde Bucal", "Imunização e Vacinas"],
        equipe: [
            { nome: "Dr. André Filipe Santos", cargo: "Médico de Família", especialidade: "Atenção Básica e Clínica Geral", registroProfissional: "CRM/RN 10.155", diasHorarios: "Segunda a Quinta: 07h30 às 16h30" },
            { nome: "Enfª. Amanda Karoline Silva", cargo: "Enfermeira ESF", especialidade: "Saúde Coletiva e Pré-Natal", registroProfissional: "COREN/RN 412.980", diasHorarios: "Segunda a Sexta: 07h às 17h" },
            { nome: "Dra. Camila Soares Ribeiro", cargo: "Cirurgiã-Dentista", especialidade: "Odontologia Básica", registroProfissional: "CRO/RN 4.890", diasHorarios: "Segunda a Quarta: 08h às 16h" },
            { nome: "Aux. Luciana Pereira Dantas", cargo: "Técnica em Saúde Bucal", especialidade: "Apoio Odontológico", registroProfissional: "CRO/RN 1.230", diasHorarios: "Segunda a Sexta: 07h às 13h" }
        ]
    },
    {
        id: "ubs-2",
        nome: "UBS Comunidade Boqueirão (Zona Rural)",
        tipo: "Unidade Básica de Saúde",
        descricao: "Ponto de atenção à saúde rural para atendimento descentralizado aos moradores do polo Boqueirão e adjacências.",
        endereco: "Comunidade Rural Boqueirão, Lajes Pintadas/RN",
        telefone: "(84) 9 8748-0287",
        horario: "Terça a Quinta-feira: 07h00 às 17h00",
        servicos: "Atendimento Médico Periódico, Visitas Domiciliares, Vacinação, Aferição de Pressão e Glicemia, Distribuição de Medicamentos e Coleta Preventiva.",
        especialidades: ["Clínica Geral Rural", "Enfermagem e Cuidados Básicos", "Acompanhamento Hiperdia"],
        equipe: [
            { nome: "Dr. Paulo Henrique Gomes", cargo: "Médico Itinerante ESF", especialidade: "Medicina Geral", registroProfissional: "CRM/RN 11.204", diasHorarios: "Terças e Quintas: 08h às 16h" },
            { nome: "Enf. Gabriel Costa Medeiros", cargo: "Enfermeiro Responsável", especialidade: "Atenção Primária", registroProfissional: "COREN/RN 501.320", diasHorarios: "Terça a Quinta: 07h às 17h" },
            { nome: "Téc. Francisca Cláudia Lima", cargo: "Técnica de Enfermagem", especialidade: "Cuidados Básicos", registroProfissional: "COREN/RN 720.155", diasHorarios: "Terça a Quinta: 07h às 17h" }
        ]
    },
    {
        id: "ubs-3",
        nome: "UBS Comunidade Barros Preto (Zona Rural)",
        tipo: "Unidade Básica de Saúde",
        descricao: "Unidade básica para cobertura da população rural da comunidade de Barros Preto e sítios vizinhos.",
        endereco: "Comunidade Rural de Barros Preto, Lajes Pintadas/RN",
        telefone: "(84) 9 8748-0287",
        horario: "Segunda a Sexta-feira: 07h00 às 13h00",
        servicos: "Consultas de Enfermagem, Atendimento Médico Agendado, Curativos, Vacinação, Acompanhamento de Gestantes e Idosos.",
        especialidades: ["Atenção Básica Rural", "Enfermagem da Família", "Saúde da Mulher"],
        equipe: [
            { nome: "Dr. André Filipe Santos", cargo: "Médico de Família", especialidade: "Clínica Geral", registroProfissional: "CRM/RN 10.155", diasHorarios: "Sextas-feiras: 08h às 12h" },
            { nome: "Enfª. Tânia Maria dos Santos", cargo: "Enfermeira ESF", especialidade: "Saúde da Família", registroProfissional: "COREN/RN 489.112", diasHorarios: "Segunda a Sexta: 07h às 13h" }
        ]
    },
    {
        id: "ubs-4",
        nome: "UBS Comunidade Rural Serra Verde",
        tipo: "Unidade Básica de Saúde",
        descricao: "Unidade descentralizada para suporte às famílias agricultoras da região serrana do município.",
        endereco: "Comunidade Rural Serra Verde, Lajes Pintadas/RN",
        telefone: "(84) 9 8748-0287",
        horario: "Terça a Quinta-feira: 07h00 às 13h00",
        servicos: "Consultas Básicas, Triagem, Renovação de Receitas, Curativos, Acompanhamento Pediátrico e Vacinação.",
        especialidades: ["Clínica Geral", "Atenção Primária à Saúde"],
        equipe: [
            { nome: "Dr. Paulo Henrique Gomes", cargo: "Médico Itinerante", especialidade: "Medicina Geral", registroProfissional: "CRM/RN 11.204", diasHorarios: "Quartas-feiras: 08h às 13h" },
            { nome: "Téc. Maria de Fátima Alves", cargo: "Técnica de Enfermagem", especialidade: "Procedimentos Básicos", registroProfissional: "COREN/RN 640.890", diasHorarios: "Terça a Quinta: 07h às 13h" }
        ]
    },
    {
        id: "ums-1",
        nome: "UMS Raimundo Eudes Silva",
        tipo: "Unidade Mista de Saúde",
        descricao: "Unidade de retaguarda e atendimento ambulatorial continuado com suporte ao atendimento de urgências.",
        endereco: "Rua Gov. Walfredo Gurgel, Centro, Lajes Pintadas/RN",
        telefone: "(84) 9 8748-0287",
        horario: "Todos os dias: 24 horas",
        servicos: "Observação Clínica, Administração de Medicamentos Injetáveis, Nebulização, Transporte Sanitário e Atendimento Pré-Hospitalar Básico.",
        especialidades: ["Urgência Clínica", "Enfermagem Geral", "Suporte Ambulatorial"],
        equipe: [
            { nome: "Dr. Marcos Vinícius A. de Souza", cargo: "Médico Plantonista", especialidade: "Clínica Médica", registroProfissional: "CRM/RN 8.412", diasHorarios: "Plantão Conforme Escala Mensal" },
            { nome: "Enfª. Karla Danielle Macedo", cargo: "Enfermeira Supervisora", especialidade: "Enfermagem Geral", registroProfissional: "COREN/RN 390.118", diasHorarios: "Segunda a Sexta: 07h às 15h" }
        ]
    }
];

export default function UnidadesSaudePage() {
    const [busca, setBusca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [unidadeModal, setUnidadeModal] = useState<UnidadeSaudeCompleta | null>(null);

    const filtered = useMemo(() => {
        return DADOS_UNIDADES_SAUDE.filter(u => {
            if (filtroTipo !== "todos") {
                if (filtroTipo === "hospital" && !u.tipo.toLowerCase().includes("hospital")) return false;
                if (filtroTipo === "ubs" && !u.tipo.toLowerCase().includes("básica")) return false;
            }
            if (busca) {
                const s = busca.toLowerCase();
                return (
                    u.nome.toLowerCase().includes(s) ||
                    u.endereco.toLowerCase().includes(s) ||
                    u.especialidades.some(e => e.toLowerCase().includes(s)) ||
                    u.equipe.some(p => p.nome.toLowerCase().includes(s) || p.especialidade.toLowerCase().includes(s))
                );
            }
            return true;
        });
    }, [busca, filtroTipo]);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const rows: any[] = [];
        filtered.forEach(u => {
            u.equipe.forEach(p => {
                rows.push({
                    "Unidade de Saúde": u.nome,
                    "Tipo": u.tipo,
                    "Endereço / Local": u.endereco,
                    "Horário da Unidade": u.horario,
                    "Telefone": u.telefone || "-",
                    "Profissional": p.nome,
                    "Cargo": p.cargo,
                    "Especialidade (18.2)": p.especialidade,
                    "Registro Profissional": p.registroProfissional,
                    "Horário / Escala de Atendimento": p.diasHorarios
                });
            });
        });

        const filename = `servicos_saude_profissionais_lajes_pintadas`;
        const title = `Relação de Unidades, Especialidades e Profissionais de Saúde – Lajes Pintadas/RN (Critério 18.2)`;

        if (format === "csv") exportToCSV(rows, filename);
        else if (format === "json") exportToJSON(rows, filename);
        else if (format === "xlsx") exportToXLSX(rows, filename);
        else exportToPDF(rows, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Serviços e Unidades de Saúde"
                subtitle="Consulta pública às unidades municipais de saúde, endereços, horários de funcionamento, especialidades médicas atendidas e equipe profissional (Critério PNTP 18.2)."
                icon={<FaHospital />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Unidades de Saúde" }
                ]}
            />

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Header de Ações e Exportações */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            PNTP Critério 18.2 • Transparência Ativa da Saúde
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-[#5B738B] mr-1 hidden md:inline">Exportar Escala e Unidades:</span>
                        <button
                            onClick={() => handleExport("pdf")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> PDF (18.2)
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> Excel
                        </button>
                        <button
                            onClick={() => handleExport("csv")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> CSV
                        </button>
                    </div>
                </div>

                {/* Filtros de Busca */}
                <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">
                                Buscar por Unidade, Profissional, Especialidade ou Bairro
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    placeholder="Ex: Clínico Geral, UBS Centro, Dr. André, Boqueirão..."
                                    className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl pl-11 pr-4 py-2.5 text-xs font-medium text-[#12304A] focus:border-[#1254A3] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">
                                Tipo de Unidade
                            </label>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl px-4 py-2.5 text-xs font-bold text-[#12304A] focus:border-[#1254A3] outline-none"
                            >
                                <option value="todos">Todas as Unidades ({DADOS_UNIDADES_SAUDE.length})</option>
                                <option value="ubs">Unidades Básicas de Saúde (UBS)</option>
                                <option value="hospital">Hospital e Maternidade 24h</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de Unidades com Profissionais e Especialidades (Critério 18.2) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filtered.map((u) => (
                        <div
                            key={u.id}
                            className="bg-white rounded-3xl border border-[#DDE3EA] shadow-sm hover:border-[#1254A3]/50 transition-all overflow-hidden flex flex-col justify-between"
                        >
                            <div>
                                <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-[#1254A3] text-white">
                                    <div className="flex items-center justify-between gap-4 mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
                                            {u.tipo}
                                        </span>
                                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                            <FaClock size={11} /> {u.horario}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">{u.nome}</h3>
                                    <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">{u.descricao}</p>
                                </div>

                                <div className="p-6 sm:p-8 space-y-6">
                                    {/* Local e Contato */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-[#DDE3EA]">
                                            <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-1 flex items-center gap-1">
                                                <FaMapPin className="text-[#1254A3]" /> Localização / Endereço (18.2)
                                            </span>
                                            <span className="font-bold text-[#12304A]">{u.endereco}</span>
                                        </div>

                                        <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-[#DDE3EA]">
                                            <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-1 flex items-center gap-1">
                                                <FaPhone className="text-[#1254A3]" /> Telefone de Contato
                                            </span>
                                            <span className="font-bold text-[#12304A]">{u.telefone || "Central Municipal"}</span>
                                        </div>
                                    </div>

                                    {/* Especialidades Médicas Atendidas (Critério 18.2) */}
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#5B738B] block mb-2">
                                            Especialidades e Atendimentos Disponíveis (Critério 18.2):
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {u.especialidades.map((esp, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1254A3] border border-blue-200/80 text-[11px] font-bold"
                                                >
                                                    <FaStethoscope size={10} /> {esp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Equipe Profissional e Escala (Critério 18.2) */}
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#5B738B] block mb-2">
                                            Profissionais de Saúde e Escala de Atendimento (Critério 18.2):
                                        </span>
                                        <div className="overflow-x-auto border border-[#DDE3EA] rounded-xl">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-[#F5F7FA] text-slate-700 font-bold uppercase text-[10px]">
                                                    <tr>
                                                        <th className="p-2.5">Profissional</th>
                                                        <th className="p-2.5">Especialidade / Registro</th>
                                                        <th className="p-2.5">Dias e Horários</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#DDE3EA]">
                                                    {u.equipe.map((prof, pIdx) => (
                                                        <tr key={pIdx} className="hover:bg-slate-50">
                                                            <td className="p-2.5 font-bold text-[#12304A]">
                                                                <div className="flex items-center gap-1.5">
                                                                    <FaUserMd className="text-[#1254A3] shrink-0" size={11} />
                                                                    <span>{prof.nome}</span>
                                                                </div>
                                                                <span className="text-[10px] font-medium text-slate-500 block">
                                                                    {prof.cargo}
                                                                </span>
                                                            </td>
                                                            <td className="p-2.5">
                                                                <span className="font-semibold text-slate-800 block">{prof.especialidade}</span>
                                                                <span className="text-[10px] font-mono text-slate-400">{prof.registroProfissional}</span>
                                                            </td>
                                                            <td className="p-2.5 text-slate-700 font-medium">
                                                                {prof.diasHorarios}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-[#F5F7FA] border-t border-[#DDE3EA] flex items-center justify-between text-xs">
                                <span className="text-[#5B738B] font-medium">
                                    SUS Municipal • Lajes Pintadas/RN
                                </span>
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                    <FaCheckCircle size={11} /> Escala Vigente 2026
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <BannerPNTP />
            </main>
        </div>
    );
}
