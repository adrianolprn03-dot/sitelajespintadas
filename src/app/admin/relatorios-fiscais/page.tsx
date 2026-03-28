"use client";

import { useState, useEffect } from "react";
import { FaFilePdf, FaPlus, FaTrash, FaEdit, FaSearch, FaHistory } from "react-icons/fa";
import toast from "react-hot-toast";

type RelatorioFiscal = {
    id: string;
    titulo: string;
    tipo: string;
    periodo: string;
    ano: number;
    arquivo: string;
    criadoEm: string;
};

export default function RelatoriosFiscaisPage() {
    const [items, setItems] = useState<RelatorioFiscal[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<RelatorioFiscal | null>(null);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        titulo: "",
        tipo: "RREO",
        periodo: "1º Bimestre",
        ano: new Date().getFullYear(),
        arquivo: "",
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/relatorios-fiscais");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Erro ao carregar relatórios.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Arquivo muito grande (máx 10MB)");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, arquivo: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editItem ? "PUT" : "POST";
        const url = editItem ? `/api/admin/relatorios-fiscais/${editItem.id}` : "/api/admin/relatorios-fiscais";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                toast.success(editItem ? "Atualizado!" : "Criado!");
                setModalOpen(false);
                setEditItem(null);
                setForm({ titulo: "", tipo: "RREO", periodo: "1º Bimestre", ano: new Date().getFullYear(), arquivo: "" });
                fetchItems();
            } else {
                toast.error("Erro ao salvar.");
            }
        } catch (error) {
            toast.error("Erro na requisição.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;
        try {
            const res = await fetch(`/api/admin/relatorios-fiscais/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Excluído!");
                fetchItems();
            }
        } catch (error) {
            toast.error("Erro ao excluir.");
        }
    };

    const startEdit = (item: RelatorioFiscal) => {
        setEditItem(item);
        setForm({
            titulo: item.titulo,
            tipo: item.tipo,
            periodo: item.periodo,
            ano: item.ano,
            arquivo: item.arquivo,
        });
        setModalOpen(true);
    };

    const filtered = items.filter(i => 
        i.titulo.toLowerCase().includes(search.toLowerCase()) || 
        i.tipo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto font-['Montserrat',sans-serif]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Transparência Fiscal (LRF)</h1>
                    <p className="text-gray-500 text-sm font-medium">Gestão de relatórios RREO e RGF para cumprimento da Lei de Responsabilidade Fiscal.</p>
                </div>
                <button 
                    onClick={() => { setEditItem(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200"
                >
                    <FaPlus /> Novo Relatório
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por título ou tipo (RREO, RGF)..." 
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Listagem */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Relatório</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tipo</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Período</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ano</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">Carregando dados...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">Nenhum relatório encontrado.</td></tr>
                        ) : filtered.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                                            <FaFilePdf size={18} />
                                        </div>
                                        <span className="font-black text-gray-700 text-sm group-hover:text-blue-600 transition-colors">{item.titulo}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 h-full">
                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-lg border border-gray-200 uppercase tracking-widest">{item.tipo}</span>
                                </td>
                                <td className="px-8 py-6 text-sm font-bold text-gray-400">{item.periodo}</td>
                                <td className="px-8 py-6 text-sm font-black text-gray-700">{item.ano}</td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => startEdit(item)} className="p-3 text-blue-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"><FaEdit size={14}/></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"><FaTrash size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl relative overflow-hidden animate-zoom-in">
                        <div className="p-10">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8">
                                {editItem ? "Editar Relatório" : "Novo Relatório Fiscal"}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Título do Documento *</label>
                                    <input 
                                        type="text" required
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        value={form.titulo}
                                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                        placeholder="Ex: RREO - 1º Bimestre de 2024"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Módulo (Tipo) *</label>
                                        <select 
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            value={form.tipo}
                                            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                        >
                                            <option value="RREO">RREO (Resumido Exec. Orç.)</option>
                                            <option value="RGF">RGF (Gestão Fiscal)</option>
                                            <option value="OUTROS">Outros Relatórios LRF</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Ano Exercício *</label>
                                        <input 
                                            type="number" required
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                            value={form.ano}
                                            onChange={(e) => setForm({ ...form, ano: parseInt(e.target.value) || new Date().getFullYear() })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Período Referência *</label>
                                    <select 
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        value={form.periodo}
                                        onChange={(e) => setForm({ ...form, periodo: e.target.value })}
                                    >
                                        <optgroup label="Bimestres (RREO)">
                                            <option value="1º Bimestre">1º Bimestre</option>
                                            <option value="2º Bimestre">2º Bimestre</option>
                                            <option value="3º Bimestre">3º Bimestre</option>
                                            <option value="4º Bimestre">4º Bimestre</option>
                                            <option value="5º Bimestre">5º Bimestre</option>
                                            <option value="6º Bimestre">6º Bimestre</option>
                                        </optgroup>
                                        <optgroup label="Quadrimestres (RGF)">
                                            <option value="1º Quadrimestre">1º Quadrimestre</option>
                                            <option value="2º Quadrimestre">2º Quadrimestre</option>
                                            <option value="3º Quadrimestre">3º Quadrimestre</option>
                                        </optgroup>
                                        <option value="Anual">Anual / Consolidado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Arquivo PDF *</label>
                                    <input 
                                        type="file" accept="application/pdf"
                                        onChange={handleFileUpload}
                                        className="w-full px-6 py-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                    {form.arquivo && <p className="text-[10px] text-emerald-500 font-bold mt-2">✓ Arquivo carregado com sucesso.</p>}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-100"
                                    >
                                        Gravar Relatório
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 hover:bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
