"use client";
import { useState, useEffect } from "react";
import { 
    FaSave, FaPlus, FaTrash, FaEdit, FaSpinner, 
    FaMusic, FaRunning, FaTheaterMasks, FaBook, FaTrophy, 
    FaStar, FaBullhorn, FaArrowLeft, FaMoneyBillWave, FaProjectDiagram
} from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";

type Programa = {
    id: string;
    icone: string;
    titulo: string;
    descricao: string;
    cor: string;
    recursos: number;
    projetos: number;
    status: string;
};

type FormData = {
    title: string;
    subtitle: string;
    recursosInvestidos: number | string;
    projetosApoiados: number | string;
    exercicioAno: string;
    programas: Programa[];
};

const ICON_OPTIONS = [
    { value: "musica", label: "Música / Cultura", icon: FaMusic },
    { value: "esporte", label: "Esporte / Atletismo", icon: FaRunning },
    { value: "teatro", label: "Teatro / Festivais", icon: FaTheaterMasks },
    { value: "livro", label: "Leitura / Biblioteca", icon: FaBook },
    { value: "trofeu", label: "Competições / Troféus", icon: FaTrophy },
    { value: "estrela", label: "Geral / Destaque", icon: FaStar },
];

const COLOR_OPTIONS = [
    { value: "from-purple-500 to-violet-600", label: "Roxo (Cultura)" },
    { value: "from-blue-500 to-cyan-600", label: "Azul (Esporte)" },
    { value: "from-amber-500 to-orange-600", label: "Laranja (Eventos)" },
    { value: "from-emerald-500 to-teal-600", label: "Verde (Educação/Leitura)" },
    { value: "from-rose-500 to-pink-600", label: "Rosa / Vermelho" },
    { value: "from-indigo-500 to-blue-700", label: "Índigo / Azul Escuro" },
];

export default function AdminIncentivosCulturaisPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<FormData>({
        title: "Incentivos Culturais e Esportivos",
        subtitle: "Editais, programas de fomento e recursos destinados à cultura, esporte e lazer da comunidade.",
        recursosInvestidos: "",
        projetosApoiados: "",
        exercicioAno: new Date().getFullYear().toString(),
        programas: []
    });

    const [showProgModal, setShowProgModal] = useState(false);
    const [editingProgId, setEditingProgId] = useState<string | null>(null);
    const [progForm, setProgForm] = useState<Programa>({
        id: "",
        icone: "musica",
        titulo: "",
        descricao: "",
        cor: "from-purple-500 to-violet-600",
        recursos: 0,
        projetos: 0,
        status: "Vigente"
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/incentivos-culturais");
            const data = await res.json();
            if (data) {
                setForm({
                    title: data.title || "Incentivos Culturais e Esportivos",
                    subtitle: data.subtitle || "",
                    recursosInvestidos: data.recursosInvestidos ?? "",
                    projetosApoiados: data.projetosApoiados ?? "",
                    exercicioAno: data.exercicioAno || new Date().getFullYear().toString(),
                    programas: Array.isArray(data.programas) ? data.programas : []
                });
            }
        } catch {
            toast.error("Erro ao carregar informações");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/incentivos-culturais", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Informações de Incentivos Culturais salvas com sucesso!");
            } else {
                toast.error(data.error || "Erro ao salvar informações");
            }
        } catch {
            toast.error("Erro ao conectar com o servidor");
        } finally {
            setSaving(false);
        }
    };

    const handleOpenProgModal = (prog?: Programa) => {
        if (prog) {
            setEditingProgId(prog.id);
            setProgForm({ ...prog });
        } else {
            setEditingProgId(null);
            setProgForm({
                id: `prog-${Date.now()}`,
                icone: "musica",
                titulo: "",
                descricao: "",
                cor: "from-purple-500 to-violet-600",
                recursos: 0,
                projetos: 0,
                status: "Vigente"
            });
        }
        setShowProgModal(true);
    };

    const handleSavePrograma = (e: React.FormEvent) => {
        e.preventDefault();
        if (!progForm.titulo.trim()) {
            toast.error("O título do programa é obrigatório!");
            return;
        }

        let updatedProgramas = [...form.programas];
        if (editingProgId) {
            updatedProgramas = updatedProgramas.map(p => p.id === editingProgId ? progForm : p);
        } else {
            updatedProgramas.push(progForm);
        }

        setForm({ ...form, programas: updatedProgramas });
        setShowProgModal(false);
        toast.success(editingProgId ? "Programa atualizado!" : "Programa adicionado à lista!");
    };

    const handleDeletePrograma = (id: string) => {
        if (confirm("Tem certeza que deseja remover este programa?")) {
            setForm({
                ...form,
                programas: form.programas.filter(p => p.id !== id)
            });
            toast.success("Programa removido!");
        }
    };

    const calcTotalRecursos = form.programas.reduce((s, p) => s + (Number(p.recursos) || 0), 0);
    const calcTotalProjetos = form.programas.reduce((s, p) => s + (Number(p.projetos) || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <FaSpinner className="animate-spin text-3xl text-purple-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1240px] mx-auto pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Link href="/admin" className="hover:text-purple-600 flex items-center gap-1">
                            <FaArrowLeft size={10} /> Painel ADM
                        </Link>
                        <span>/</span>
                        <span>Transparência</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                        <span className="p-3 bg-purple-100 text-purple-600 rounded-2xl">🎭</span>
                        Incentivos Culturais e Esportivos
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Gerencie os programas de fomento, indicadores financeiros e textos da página pública.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        href="/admin/editais" 
                        className="px-5 py-3 bg-amber-50 text-amber-700 border border-amber-200 font-bold rounded-2xl text-xs flex items-center gap-2 hover:bg-amber-100 transition-all shadow-sm"
                    >
                        <FaBullhorn /> Gerenciar Editais / PNAB
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Salvar Alterações
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Título & Descrição Institucional */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-black text-gray-800 tracking-tight border-b border-gray-100 pb-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        Cabeçalho da Página
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400">Título Principal</label>
                            <input 
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400">Ano de Referência / Exercício</label>
                            <input 
                                required
                                value={form.exercicioAno}
                                onChange={(e) => setForm({ ...form, exercicioAno: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="2026"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400">Subtítulo / Descrição da Página</label>
                        <textarea 
                            rows={2}
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                            placeholder="Descreva o propósito da página..."
                        />
                    </div>
                </div>

                {/* 2. Resumo Financeiro & Projetos */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-lg font-black text-gray-800 tracking-tight border-b border-gray-100 pb-4 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        Indicadores & Totais (Calculados ou Customizados)
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2 bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50">
                            <label className="text-xs font-black uppercase text-purple-700 flex items-center gap-2">
                                <FaMoneyBillWave /> Recursos Investidos (R$)
                            </label>
                            <input 
                                type="number"
                                step="any"
                                value={form.recursosInvestidos}
                                onChange={(e) => setForm({ ...form, recursosInvestidos: e.target.value })}
                                className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-lg font-black text-purple-700 outline-none"
                                placeholder={`Soma dos programas: R$ ${calcTotalRecursos.toLocaleString('pt-BR')}`}
                            />
                            <p className="text-[10px] font-bold text-gray-400">
                                Deixe preenchido para usar valor fixo ou a soma dos programas (R$ {calcTotalRecursos.toLocaleString('pt-BR')}).
                            </p>
                        </div>

                        <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                            <label className="text-xs font-black uppercase text-blue-700 flex items-center gap-2">
                                <FaProjectDiagram /> Total de Projetos Apoiados
                            </label>
                            <input 
                                type="number"
                                value={form.projetosApoiados}
                                onChange={(e) => setForm({ ...form, projetosApoiados: e.target.value })}
                                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-lg font-black text-blue-700 outline-none"
                                placeholder={`Soma dos programas: ${calcTotalProjetos}`}
                            />
                            <p className="text-[10px] font-bold text-gray-400">
                                Deixe preenchido para usar valor fixo ou a soma dos programas ({calcTotalProjetos} projetos).
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Programas em Execução */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            Programas em Execução
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleOpenProgModal()}
                            className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-purple-100 transition-all"
                        >
                            <FaPlus /> Novo Programa
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {form.programas.map((p, idx) => (
                            <div key={p.id || idx} className="bg-gray-50/70 rounded-2xl p-6 border border-gray-100 relative group hover:border-purple-200 transition-all">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${p.cor} text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                                            {p.icone === "esporte" ? <FaRunning /> : p.icone === "teatro" ? <FaTheaterMasks /> : p.icone === "livro" ? <FaBook /> : <FaMusic />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-800 text-base">{p.titulo}</h3>
                                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                                                {p.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenProgModal(p)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePrograma(p.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remover"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-xs font-medium mb-4 line-clamp-2 leading-relaxed">
                                    {p.descricao}
                                </p>

                                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-gray-100 text-center">
                                    <div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase">Recursos</div>
                                        <div className="text-sm font-black text-purple-600">
                                            R$ {Number(p.recursos || 0).toLocaleString('pt-BR')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase">Projetos</div>
                                        <div className="text-sm font-black text-gray-800">{p.projetos}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {form.programas.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                Nenhum programa cadastrado. Clique em <strong>"Novo Programa"</strong> para adicionar.
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Atalho para Editais e PNAB */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-[2rem] p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                            <FaBullhorn size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight">Editais, PNAB e Seleções Públicas</h3>
                            <p className="text-gray-600 text-xs font-medium mt-0.5">
                                Os editais publicados na página de transparência são sincronizados automaticamente com o módulo de Editais.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/editais"
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2"
                    >
                        Gerenciar Editais no ADM &rarr;
                    </Link>
                </div>

                {/* Save Footer */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center gap-3 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Salvar Tudo
                    </button>
                </div>
            </form>

            {/* Modal para Editar/Adicionar Programa */}
            {showProgModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-black text-gray-800 uppercase mb-6">
                            {editingProgId ? "Editar Programa" : "Novo Programa em Execução"}
                        </h2>

                        <form onSubmit={handleSavePrograma} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Título do Programa</label>
                                <input
                                    required
                                    placeholder="Ex: Fomento à Cultura / PNAB"
                                    value={progForm.titulo}
                                    onChange={(e) => setProgForm({ ...progForm, titulo: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Descrição do Programa</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Detalhamento das atividades e escopo do programa..."
                                    value={progForm.descricao}
                                    onChange={(e) => setProgForm({ ...progForm, descricao: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Ícone do Card</label>
                                    <select
                                        value={progForm.icone}
                                        onChange={(e) => setProgForm({ ...progForm, icone: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                    >
                                        {ICON_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Estilo de Cor</label>
                                    <select
                                        value={progForm.cor}
                                        onChange={(e) => setProgForm({ ...progForm, cor: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                    >
                                        {COLOR_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Recursos (R$)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="Ex: 45000"
                                        value={progForm.recursos}
                                        onChange={(e) => setProgForm({ ...progForm, recursos: Number(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Projetos Apoiados</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 10"
                                        value={progForm.projetos}
                                        onChange={(e) => setProgForm({ ...progForm, projetos: Number(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Status do Programa</label>
                                <select
                                    value={progForm.status}
                                    onChange={(e) => setProgForm({ ...progForm, status: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                                >
                                    <option value="Vigente">Vigente</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Concluído">Concluído</option>
                                    <option value="Planejado">Planejado</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowProgModal(false)}
                                    className="flex-1 py-3 text-gray-400 font-black uppercase text-xs hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-purple-600 text-white font-black uppercase text-xs rounded-xl hover:bg-purple-700 transition-colors shadow-md"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
