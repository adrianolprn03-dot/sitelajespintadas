"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FaArrowLeft,
    FaClinicMedical,
    FaHospital,
    FaPlus,
    FaSave,
    FaSchool,
    FaSpinner,
    FaStethoscope,
    FaTrash,
    FaUserMd,
} from "react-icons/fa";
import { isEducacaoTipo, isSaudeTipo, ProfissionalEscala } from "@/lib/unidades";

const SUBTIPO_SUGESTOES: Record<string, string[]> = {
    Saúde: [
        "Unidade Básica de Saúde (ESF)",
        "Unidade Básica de Saúde Rural (ESF)",
        "Unidade Mista / Pronto Atendimento 24h",
        "Hospital Municipal",
        "Farmácia Pública Municipal",
        "Centro de Especialidades / Regulação",
        "Academia da Saúde",
    ],
    Educação: [
        "Creche / Educação Infantil",
        "Escola Municipal de Ensino Fundamental",
        "Escola Municipal Infantil e Fundamental",
        "Escola Rural / Anexa",
        "Centro Municipal de Educação",
    ],
    Socioassistencial: [
        "CRAS - Centro de Referência de Assistência Social",
        "CREAS",
        "Centro de Convivência e Fortalecimento de Vínculos",
        "Conselho Tutelar",
        "Sede da Assistência Social / CadÚnico",
    ],
    Cultura: [
        "Biblioteca Pública Municipal",
        "Centro Cultural / Auditório",
        "Equipamento Esportivo / Ginásio",
    ],
};

const ESPECIALIDADE_SUGESTOES_SAUDE = [
    "Clínica Geral",
    "Medicina da Família e Comunidade",
    "Enfermagem da Família",
    "Odontologia / Saúde Bucal",
    "Pré-Natal e Saúde da Mulher",
    "Pediatria / Puericultura",
    "Urgência e Emergência 24h",
    "Imunização e Vacinas",
    "Farmácia / Dispensação SUS",
];

const ESPECIALIDADE_SUGESTOES_EDUCACAO = [
    "Creche (0 a 3 anos)",
    "Pré-Escola (4 e 5 anos)",
    "Ensino Fundamental I (1º ao 5º ano)",
    "Ensino Fundamental II (6º ao 9º ano)",
    "EJA (Educação de Jovens e Adultos)",
    "Atendimento Educacional Especializado (AEE)",
];

function canonicalizeTipo(raw: string): string {
    const t = raw.toLowerCase().trim();
    if (t.includes("saude") || t.includes("saúde")) return "Saúde";
    if (t.includes("educa")) return "Educação";
    if (t.includes("social") || t.includes("socio")) return "Socioassistencial";
    if (t.includes("cultura")) return "Cultura";
    return raw || "Saúde";
}

export default function UnidadeFormPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("Saúde");
    const [subtipo, setSubtipo] = useState("");
    const [cnes, setCnes] = useState("");
    const [descricao, setDescricao] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [horario, setHorario] = useState("");
    const [servicos, setServicos] = useState("");
    const [especialidades, setEspecialidades] = useState<string[]>([]);
    const [novaEspecialidade, setNovaEspecialidade] = useState("");
    const [equipe, setEquipe] = useState<ProfissionalEscala[]>([]);
    const [mapa, setMapa] = useState("");
    const [ativa, setAtiva] = useState(true);

    // Novo profissional temporário
    const [novoProfNome, setNovoProfNome] = useState("");
    const [novoProfCargo, setNovoProfCargo] = useState("");
    const [novoProfEsp, setNovoProfEsp] = useState("");
    const [novoProfRegistro, setNovoProfRegistro] = useState("");
    const [novoProfHorario, setNovoProfHorario] = useState("");

    useEffect(() => {
        if (!isEditing || !id) return;

        async function fetchUnidade() {
            try {
                const res = await fetch(`/api/unidades/${id}`, { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setNome(data.nome || "");
                    setTipo(canonicalizeTipo(data.tipo || "Saúde"));
                    setSubtipo(data.subtipo || "");
                    setCnes(data.cnes || "");
                    setDescricao(data.descricao || "");
                    setEndereco(data.endereco || "");
                    setTelefone(data.telefone || "");
                    setHorario(data.horario || "");
                    setServicos(data.servicos || "");
                    setEspecialidades(Array.isArray(data.especialidades) ? data.especialidades : []);
                    setEquipe(Array.isArray(data.equipe) ? data.equipe : []);
                    setMapa(data.mapa || "");
                    setAtiva(data.ativa !== undefined ? Boolean(data.ativa) : true);
                } else {
                    toast.error("Unidade não encontrada.");
                    router.push("/admin/unidades");
                }
            } catch {
                toast.error("Erro ao carregar unidade.");
            } finally {
                setLoading(false);
            }
        }

        fetchUnidade();
    }, [id, isEditing, router]);

    const handleAddEspecialidade = (valor?: string) => {
        const text = (valor ?? novaEspecialidade).trim();
        if (!text) return;
        if (especialidades.some((e) => e.toLowerCase() === text.toLowerCase())) {
            toast.error("Este item já está adicionado.");
            return;
        }
        setEspecialidades((prev) => [...prev, text]);
        if (!valor) setNovaEspecialidade("");
    };

    const handleRemoveEspecialidade = (index: number) => {
        setEspecialidades((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddProfissional = () => {
        if (!novoProfNome.trim() || !novoProfCargo.trim()) {
            toast.error("Informe ao menos o nome e o cargo do profissional.");
            return;
        }
        setEquipe((prev) => [
            ...prev,
            {
                nome: novoProfNome.trim(),
                cargo: novoProfCargo.trim(),
                especialidade: novoProfEsp.trim() || "Atendimento Geral",
                registroProfissional: novoProfRegistro.trim(),
                diasHorarios: novoProfHorario.trim() || horario || "Conforme escala da unidade",
            },
        ]);
        setNovoProfNome("");
        setNovoProfCargo("");
        setNovoProfEsp("");
        setNovoProfRegistro("");
        setNovoProfHorario("");
        toast.success("Profissional adicionado à escala da unidade!");
    };

    const handleUpdateProfissional = (
        index: number,
        field: keyof ProfissionalEscala,
        value: string
    ) => {
        setEquipe((prev) =>
            prev.map((prof, idx) => (idx === index ? { ...prof, [field]: value } : prof))
        );
    };

    const handleRemoveProfissional = (index: number) => {
        setEquipe((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = isEditing ? `/api/unidades/${id}` : "/api/unidades";
            const method = isEditing ? "PUT" : "POST";

            // Se o usuário digitou algo no miniformulário de novo profissional mas esqueceu de clicar em "+", inclui automaticamente se tiver nome e cargo
            const equipeFinal = [...equipe];
            if (novoProfNome.trim() && novoProfCargo.trim()) {
                equipeFinal.push({
                    nome: novoProfNome.trim(),
                    cargo: novoProfCargo.trim(),
                    especialidade: novoProfEsp.trim() || "Atendimento Geral",
                    registroProfissional: novoProfRegistro.trim(),
                    diasHorarios: novoProfHorario.trim() || horario || "Conforme escala da unidade",
                });
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    tipo,
                    subtipo,
                    cnes,
                    descricao,
                    endereco,
                    telefone,
                    horario,
                    servicos,
                    especialidades,
                    equipe: equipeFinal,
                    mapa,
                    ativa,
                }),
            });

            if (res.ok) {
                toast.success(
                    isEditing
                        ? "Unidade, serviços e equipe atualizados no portal!"
                        : "Unidade cadastrada com sucesso!"
                );
                router.push("/admin/unidades");
                router.refresh();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao salvar unidade.");
            }
        } catch {
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <FaSpinner className="animate-spin text-4xl mb-4 text-[#0188B9]" />
                <p>Carregando dados da unidade e escala profissional...</p>
            </div>
        );
    }

    const ehSaude = isSaudeTipo(tipo);
    const ehEducacao = isEducacaoTipo(tipo);
    const sugestoesSubtipo = SUBTIPO_SUGESTOES[tipo] || SUBTIPO_SUGESTOES["Saúde"];
    const sugestoesEsp = ehSaude
        ? ESPECIALIDADE_SUGESTOES_SAUDE
        : ehEducacao
        ? ESPECIALIDADE_SUGESTOES_EDUCACAO
        : [];

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-16">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/unidades"
                    className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#1E293B] hover:bg-gray-50 transition shadow-sm"
                >
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
                        {ehEducacao ? (
                            <FaSchool className="text-blue-600" />
                        ) : (
                            <FaClinicMedical className="text-[#0188B9]" />
                        )}
                        {isEditing ? "Editar Unidade, Serviços e Equipe" : "Nova Unidade de Atendimento"}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Gerencie localização, horários, serviços ofertados, especialidades/etapas e escala de profissionais (PNTP 2026 - Itens 18.2 e 19.2).
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bloco 1: Identificação e Endereço */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                    <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <FaHospital className="text-[#0188B9]" /> 1. Identificação, Local e Funcionamento
                        </h2>
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                            <input
                                type="checkbox"
                                checked={ativa}
                                onChange={(e) => setAtiva(e.target.checked)}
                                className="w-4 h-4 accent-[#0188B9] rounded cursor-pointer"
                            />
                            Unidade Ativa no Portal Público
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Nome Oficial da Unidade *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: UBS João Olinto de Oliveira / Escola Municipal..."
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Categoria / Secretaria *
                            </label>
                            <select
                                required
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            >
                                <option value="Saúde">Saúde (UBS / UMS / Hospital / Farmácia)</option>
                                <option value="Educação">Educação (Creche / Escola Municipal)</option>
                                <option value="Socioassistencial">Assistência Social (CRAS / CREAS / Conselho)</option>
                                <option value="Cultura">Cultura e Esporte</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Subtipo / Classificação
                            </label>
                            <input
                                type="text"
                                list="subtipo-sugestoes"
                                placeholder={ehSaude ? "Ex: Unidade Básica de Saúde (ESF)" : "Ex: Creche / Educação Infantil"}
                                value={subtipo}
                                onChange={(e) => setSubtipo(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                            <datalist id="subtipo-sugestoes">
                                {sugestoesSubtipo.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                {ehSaude
                                    ? "Código CNES (opcional)"
                                    : ehEducacao
                                    ? "Código INEP da Escola (opcional)"
                                    : "Código de Identificação (opcional)"}
                            </label>
                            <input
                                type="text"
                                placeholder={ehSaude ? "Ex: 2409876" : ehEducacao ? "Ex: 24045678" : "Código opcional"}
                                value={cnes}
                                onChange={(e) => setCnes(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Horário de Funcionamento *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Segunda a Sexta, das 07h00 às 17h00 (ou 24 horas)"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Endereço Completo *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Rua Miriam Cavalcante Lima, Centro, Lajes Pintadas/RN"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Telefone / E-mail de Contato
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: (84) 98796-9881 ou e-mail institucional"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Breve Descrição Institucional *
                            </label>
                            <textarea
                                required
                                rows={2}
                                placeholder="Descreva a finalidade e cobertura desta unidade..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Link do Google Maps (opcional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://maps.google.com/..."
                                value={mapa}
                                onChange={(e) => setMapa(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Bloco 2: Serviços Disponíveis e Especialidades / Etapas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                    <div className="border-b border-gray-100 pb-3">
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <FaStethoscope className="text-emerald-600" /> 2.{" "}
                            {ehEducacao
                                ? "Serviços Escolares, Modalidades e Etapas de Ensino"
                                : "Serviços Disponíveis e Especialidades Médicas / Clínicas"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Informações exibidas publicamente nos cards da transparência e na carta de serviços (PNTP 18.2 / 19.2).
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            {ehEducacao
                                ? "Descrição dos Serviços, Turnos e Atendimento Escolar"
                                : "Relação de Serviços e Procedimentos Realizados na Unidade"}
                        </label>
                        <textarea
                            rows={3}
                            placeholder={
                                ehEducacao
                                    ? "Ex: Atendimento em Creche e Pré-Escola, Ensino Fundamental Anos Iniciais, Alimentação Escolar, Transporte Rural e AEE."
                                    : "Ex: Consultas Médicas da Atenção Básica, Acompanhamento Pré-Natal, Puericultura, Vacinação de Rotina SUS, Consultório Odontológico, Curativos, Testes Rápidos e Dispensação Farmacêutica."
                            }
                            value={servicos}
                            onChange={(e) => setServicos(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {ehEducacao
                                ? "Etapas / Modalidades de Ensino Ofertadas"
                                : "Especialidades e Áreas de Atendimento"}
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder={
                                    ehEducacao
                                        ? "Digite uma etapa (ex: Pré-Escola 4 e 5 anos) e clique em Adicionar"
                                        : "Digite uma especialidade (ex: Clínica Geral, Odontologia) e clique em Adicionar"
                                }
                                value={novaEspecialidade}
                                onChange={(e) => setNovaEspecialidade(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddEspecialidade();
                                    }
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#0188B9]/20 focus:border-[#0188B9] outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddEspecialidade()}
                                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                                <FaPlus /> Adicionar
                            </button>
                        </div>

                        {/* Sugestões rápidas */}
                        {sugestoesEsp.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[11px] font-bold text-slate-400 mr-1">Sugestões:</span>
                                {sugestoesEsp.map((sug) => {
                                    const jaTem = especialidades.some(
                                        (e) => e.toLowerCase() === sug.toLowerCase()
                                    );
                                    if (jaTem) return null;
                                    return (
                                        <button
                                            key={sug}
                                            type="button"
                                            onClick={() => handleAddEspecialidade(sug)}
                                            className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg border border-slate-200 transition cursor-pointer"
                                        >
                                            + {sug}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Chips atuais */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {especialidades.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">
                                    Nenhuma especialidade ou etapa adicionada ainda.
                                </p>
                            ) : (
                                especialidades.map((esp, idx) => (
                                    <span
                                        key={`${esp}-${idx}`}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1254A3] border border-blue-200 text-xs font-bold"
                                    >
                                        {esp}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEspecialidade(idx)}
                                            className="text-blue-400 hover:text-red-600 font-black cursor-pointer"
                                            title="Remover"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Bloco 3: Equipe de Profissionais (Médicos, Enfermeiros, Dentistas, Equipe Escolar) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                    <div className="border-b border-gray-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                <FaUserMd className="text-[#0188B9]" /> 3.{" "}
                                {ehEducacao
                                    ? "Direção, Coordenação e Equipe Escolar"
                                    : "Profissionais Prestadores de Serviços (Médicos, Enfermeiros, Dentistas e Técnicos)"}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Exigência obrigatória do item 18.2 da Cartilha PNTP 2026: indicar profissionais, especialidades, registros de conselho e dias/horários de atendimento.
                            </p>
                        </div>
                        <span className="text-xs font-bold bg-blue-50 text-[#1254A3] px-3 py-1 rounded-full border border-blue-100">
                            {equipe.length} {equipe.length === 1 ? "profissional" : "profissionais"}
                        </span>
                    </div>

                    {/* Lista de profissionais existentes (editável inline) */}
                    {equipe.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                            Nenhum profissional cadastrado nesta unidade. Utilize o formulário abaixo para incluir médicos, enfermeiros, dentistas ou gestores.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {equipe.map((prof, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                                >
                                    <div className="md:col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Nome do Profissional *
                                        </label>
                                        <input
                                            type="text"
                                            value={prof.nome}
                                            onChange={(e) => handleUpdateProfissional(idx, "nome", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-[#0188B9]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Cargo *
                                        </label>
                                        <input
                                            type="text"
                                            value={prof.cargo}
                                            onChange={(e) => handleUpdateProfissional(idx, "cargo", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-[#0188B9]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Especialidade
                                        </label>
                                        <input
                                            type="text"
                                            value={prof.especialidade}
                                            onChange={(e) =>
                                                handleUpdateProfissional(idx, "especialidade", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-[#0188B9]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Registro (CRM/COREN/CRO)
                                        </label>
                                        <input
                                            type="text"
                                            value={prof.registroProfissional}
                                            onChange={(e) =>
                                                handleUpdateProfissional(idx, "registroProfissional", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono outline-none focus:border-[#0188B9]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Dias e Horários / Escala
                                        </label>
                                        <input
                                            type="text"
                                            value={prof.diasHorarios}
                                            onChange={(e) =>
                                                handleUpdateProfissional(idx, "diasHorarios", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-[#0188B9]"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProfissional(idx)}
                                            className="p-2.5 text-red-600 hover:bg-red-100 bg-red-50 rounded-lg transition cursor-pointer"
                                            title="Remover profissional"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Card para adicionar novo profissional */}
                    <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#1254A3] flex items-center gap-2">
                            <FaPlus /> Incluir Novo Profissional na Unidade
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-4">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    placeholder={ehEducacao ? "Ex: Profª. Maria das Graças" : "Ex: Dr. André Filipe Santos"}
                                    value={novoProfNome}
                                    onChange={(e) => setNovoProfNome(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs outline-none focus:border-[#1254A3]"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Cargo / Função
                                </label>
                                <input
                                    type="text"
                                    list="cargos-prof-list"
                                    placeholder={ehEducacao ? "Ex: Diretor(a) Escolar" : "Ex: Médico / Enfermeira"}
                                    value={novoProfCargo}
                                    onChange={(e) => setNovoProfCargo(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs outline-none focus:border-[#1254A3]"
                                />
                                <datalist id="cargos-prof-list">
                                    <option value="Médico(a) Clínico Geral" />
                                    <option value="Médico(a) de Família (ESF)" />
                                    <option value="Médico(a) Plantonista" />
                                    <option value="Enfermeiro(a) ESF" />
                                    <option value="Enfermeiro(a) Plantonista" />
                                    <option value="Cirurgião(ã)-Dentista" />
                                    <option value="Técnico(a) de Enfermagem" />
                                    <option value="Técnico(a) em Saúde Bucal" />
                                    <option value="Farmacêutico(a)" />
                                    <option value="Fisioterapeuta" />
                                    <option value="Nutricionista" />
                                    <option value="Psicólogo(a)" />
                                    <option value="Diretor(a) Escolar" />
                                    <option value="Coordenador(a) Pedagógico(a)" />
                                </datalist>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Especialidade / Área
                                </label>
                                <input
                                    type="text"
                                    placeholder={ehEducacao ? "Ex: Gestão Escolar" : "Ex: Clínica Geral / Pré-Natal"}
                                    value={novoProfEsp}
                                    onChange={(e) => setNovoProfEsp(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs outline-none focus:border-[#1254A3]"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Registro (CRM/COREN)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: CRM/RN 10.155"
                                    value={novoProfRegistro}
                                    onChange={(e) => setNovoProfRegistro(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs outline-none focus:border-[#1254A3]"
                                />
                            </div>
                            <div className="md:col-span-9">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Dias e Horários de Atendimento / Escala
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Segunda a Quinta: 07h30 às 16h30 (ou Escala de Plantão 24h)"
                                    value={novoProfHorario}
                                    onChange={(e) => setNovoProfHorario(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs outline-none focus:border-[#1254A3]"
                                />
                            </div>
                            <div className="md:col-span-3 flex items-end">
                                <button
                                    type="button"
                                    onClick={handleAddProfissional}
                                    className="w-full py-2.5 px-4 bg-[#1254A3] hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                                >
                                    <FaPlus /> Adicionar Profissional
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rodapé de Ações */}
                <div className="flex justify-end gap-3 pt-2">
                    <Link
                        href="/admin/unidades"
                        className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[#0188B9] hover:bg-[#026A91] text-white font-bold text-sm rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-900/10 disabled:opacity-50 cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" /> Salvando...
                            </>
                        ) : (
                            <>
                                <FaSave /> {isEditing ? "Salvar Alterações no Portal" : "Cadastrar Unidade"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
