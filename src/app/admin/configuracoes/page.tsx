"use client";
import { useState, useEffect } from "react";
import { FaBuilding, FaUserTie, FaSave, FaSpinner, FaMapMarker, FaClock, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminConfiguracoesPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        prefeito_nome: "",
        prefeito_descricao: "",
        prefeito_foto: "",
        prefeito_mandato: "",
        prefeito_partido: "",
        prefeito_naturalidade: "",
        prefeito_nascimento: "",
        prefeito_profissao: "",
        prefeito_escolaridade: "",
        vice_nome: "",
        vice_descricao: "",
        vice_foto: "",
        vice_mandato: "",
        vice_partido: "",
        vice_naturalidade: "",
        vice_nascimento: "",
        vice_profissao: "",
        vice_escolaridade: "",
        municipio_nome: "",
        cnpj: "",
        endereco_sede: "",
        horario_funcionamento: "",
        contato_email: "",
        contato_telefone: ""
    });

    useEffect(() => {
        async function loadConfigs() {
            try {
                const res = await fetch("/api/admin/configuracoes");
                const data = await res.json();
                const newForm = { ...form };
                data.forEach((c: any) => {
                    if (c.chave in newForm) {
                        (newForm as any)[c.chave] = c.valor || "";
                    }
                });
                setForm(newForm);
            } catch (error) {
                toast.error("Erro ao carregar configurações");
            } finally {
                setLoading(false);
            }
        }
        loadConfigs();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const configs = Object.entries(form).map(([chave, valor]) => ({ chave, valor }));
            const res = await fetch("/api/admin/configuracoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ configs })
            });

            if (res.ok) {
                toast.success("Configurações salvas com sucesso!");
            } else {
                toast.error("Erro ao salvar");
            }
        } catch (error) {
            toast.error("Erro na conexão");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 tracking-tight">
                        <FaBuilding className="text-blue-600" /> Configurações Institucionais
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Gerencie os dados oficiais e fotos dos gestores do município.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    Salvar Alterações
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seção Gestores */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-50 pb-5 uppercase tracking-tighter">
                        <FaUserTie className="text-blue-500" /> Gestores Municipais (Prefeito e Vice)
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Prefeito */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group relative">
                                    {form.prefeito_foto ? (
                                        <img src={form.prefeito_foto} alt="Prefeito" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaCamera className="text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Gabinete do Prefeito</h3>
                                    <p className="text-[10px] text-gray-400 font-bold italic">Defina o nome e a foto oficial.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
                                    <input
                                        name="prefeito_nome"
                                        value={form.prefeito_nome}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <ImageUpload 
                                        label="Foto Oficial do Prefeito"
                                        value={form.prefeito_foto}
                                        onChange={(url) => setForm({...form, prefeito_foto: url})}
                                    />
                                </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Mandato</label>
                                    <input
                                        name="prefeito_mandato"
                                        value={form.prefeito_mandato}
                                        onChange={handleChange}
                                        placeholder="Ex: 2021 — 2024"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Partido</label>
                                    <input
                                        name="prefeito_partido"
                                        value={form.prefeito_partido}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Naturalidade</label>
                                    <input
                                        name="prefeito_naturalidade"
                                        value={form.prefeito_naturalidade}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data de Nascimento</label>
                                    <input
                                        name="prefeito_nascimento"
                                        value={form.prefeito_nascimento}
                                        onChange={handleChange}
                                        placeholder="DD/MM/AAAA"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Ocupação / Profissão</label>
                                    <input
                                        name="prefeito_profissao"
                                        value={form.prefeito_profissao}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Escolaridade</label>
                                    <input
                                        name="prefeito_escolaridade"
                                        value={form.prefeito_escolaridade}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Biografia Completa</label>
                                <textarea
                                    name="prefeito_descricao"
                                    value={form.prefeito_descricao}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                            </div>
                        </div>

                        {/* Vice-Prefeito */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group relative">
                                    {form.vice_foto ? (
                                        <img src={form.vice_foto} alt="Vice" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaCamera className="text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Gabinete do Vice</h3>
                                    <p className="text-[10px] text-gray-400 font-bold italic">Defina o nome e a foto oficial.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
                                    <input
                                        name="vice_nome"
                                        value={form.vice_nome}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <ImageUpload 
                                        label="Foto Oficial do Vice"
                                        value={form.vice_foto}
                                        onChange={(url) => setForm({...form, vice_foto: url})}
                                    />
                                </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Mandato</label>
                                    <input
                                        name="vice_mandato"
                                        value={form.vice_mandato}
                                        onChange={handleChange}
                                        placeholder="Ex: 2021 — 2024"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Partido</label>
                                    <input
                                        name="vice_partido"
                                        value={form.vice_partido}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Naturalidade</label>
                                    <input
                                        name="vice_naturalidade"
                                        value={form.vice_naturalidade}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Data de Nascimento</label>
                                    <input
                                        name="vice_nascimento"
                                        value={form.vice_nascimento}
                                        onChange={handleChange}
                                        placeholder="DD/MM/AAAA"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Ocupação / Profissão</label>
                                    <input
                                        name="vice_profissao"
                                        value={form.vice_profissao}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Escolaridade</label>
                                    <input
                                        name="vice_escolaridade"
                                        value={form.vice_escolaridade}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Biografia Completa</label>
                                <textarea
                                    name="vice_descricao"
                                    value={form.vice_descricao}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção Prefeitura */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-2 border-b border-gray-50 pb-5 uppercase tracking-tighter">
                        <FaBuilding className="text-blue-600" /> Dados da Entidade (Prefeitura)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Razão Social</label>
                            <input
                                name="municipio_nome"
                                value={form.municipio_nome}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">CNPJ</label>
                            <input
                                name="cnpj"
                                value={form.cnpj}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                                <FaMapMarker /> Endereço Completo (Sede)
                            </label>
                            <input
                                name="endereco_sede"
                                value={form.endereco_sede}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                                <FaClock /> Horário de Funcionamento
                            </label>
                            <input
                                name="horario_funcionamento"
                                value={form.horario_funcionamento}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                                    <FaEnvelope /> E-mail Oficial
                                </label>
                                <input
                                    name="contato_email"
                                    value={form.contato_email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                                    <FaPhone /> Telefone Oficial
                                </label>
                                <input
                                    name="contato_telefone"
                                    value={form.contato_telefone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
