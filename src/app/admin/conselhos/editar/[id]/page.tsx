"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaUsers, FaArrowLeft, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import Link from "next/link";

type Ata = {
    id?: string;
    titulo: string;
    dataReuniao: string;
    arquivo: string;
};

export default function EditarConselhoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form fields
    const [nome, setNome] = useState("");
    const [sigla, setSigla] = useState("");
    const [tipo, setTipo] = useState("saude");
    const [descricao, setDescricao] = useState("");
    const [composicao, setComposicao] = useState("");
    const [presidente, setPresidente] = useState("");
    const [email, setEmail] = useState("");
    const [ativo, setAtivo] = useState(true);
    
    // Atas state
    const [atas, setAtas] = useState<Ata[]>([]);
    
    // Nova ata temporária
    const [newAtaTitulo, setNewAtaTitulo] = useState("");
    const [newAtaData, setNewAtaData] = useState("");
    const [newAtaArquivo, setNewAtaArquivo] = useState("");

    useEffect(() => {
        const fetchConselho = async () => {
            try {
                const res = await fetch(`/api/conselhos/${params.id}`);
                const data = await res.json();
                
                if (data.error) {
                    toast.error("Conselho não encontrado");
                    router.push("/admin/conselhos");
                    return;
                }

                setNome(data.nome);
                setSigla(data.sigla || "");
                setTipo(data.tipo);
                setDescricao(data.descricao);
                setComposicao(data.composicao);
                setPresidente(data.presidente || "");
                setEmail(data.email || "");
                setAtivo(data.ativo);

                // Formata datas para o input type="date"
                if (data.atas) {
                    const formatadas = data.atas.map((a: any) => ({
                        id: a.id,
                        titulo: a.titulo,
                        dataReuniao: new Date(a.dataReuniao).toISOString().split('T')[0],
                        arquivo: a.arquivo
                    }));
                    setAtas(formatadas);
                }
            } catch {
                toast.error("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };
        fetchConselho();
    }, [params.id, router]);

    const handleAddAta = () => {
        if (!newAtaTitulo || !newAtaData || !newAtaArquivo) {
            toast.error("Preencha título, data e anexe a ata PDF.");
            return;
        }

        setAtas([...atas, { 
            titulo: newAtaTitulo, 
            dataReuniao: newAtaData, 
            arquivo: newAtaArquivo 
        }]);

        // Reseta o miniformulário de ata
        setNewAtaTitulo("");
        setNewAtaData("");
        setNewAtaArquivo("");
    };

    const handleRemoveAta = (index: number) => {
        setAtas(atas.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        // Converte datas antes de enviar
        const payloadAtas = atas.map(ata => ({
            id: ata.id,
            titulo: ata.titulo,
            dataReuniao: new Date(ata.dataReuniao).toISOString(),
            arquivo: ata.arquivo
        }));

        try {
            const res = await fetch(`/api/conselhos/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome, sigla, tipo, descricao, composicao, presidente, email, ativo,
                    atas: payloadAtas // Assume que a API em PUT recria ou atualiza as atas
                })
            });
            if (res.ok) {
                toast.success("Conselho atualizado com sucesso!");
                router.push("/admin/conselhos");
            } else {
                toast.error("Erro ao atualizar conselho.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/conselhos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUsers className="text-blue-600" /> Editar Conselho
                    </h1>
                    <p className="text-gray-500 text-sm">Atualize os dados e atas do conselho municipal.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                {/* DADOS CADASTRAIS */}
                <div>
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Dados Cadastrais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Nome Completo *</label>
                            <input value={nome} onChange={(e) => setNome(e.target.value)} required
                                className="input-field" placeholder="Ex: Conselho Municipal de Saúde" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Sigla</label>
                            <input value={sigla} onChange={(e) => setSigla(e.target.value)}
                                className="input-field" placeholder="Ex: CMS" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Tipo / Área *</label>
                            <select value={tipo} onChange={(e) => setTipo(e.target.value)} required className="input-field">
                                <option value="saude">Saúde</option>
                                <option value="educacao">Educação</option>
                                <option value="social">Assistência Social</option>
                                <option value="fundeb">FUNDEB</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Presidente</label>
                            <input value={presidente} onChange={(e) => setPresidente(e.target.value)}
                                className="input-field" placeholder="Nome do presidente atual" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">E-mail do Conselho</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="input-field" placeholder="conselho@lajesPintadas.rn.gov.br" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Descrição *</label>
                            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows={3}
                                className="input-field resize-none" placeholder="Descreva a função do conselho..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Composição *</label>
                            <textarea value={composicao} onChange={(e) => setComposicao(e.target.value)} required rows={2}
                                className="input-field resize-none" placeholder="Descreva como o conselho é composto..." />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="ativo" checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)} className="w-5 h-5 accent-blue-600" />
                            <label htmlFor="ativo" className="text-sm font-bold text-gray-700">Conselho ativo (aparece no portal)</label>
                        </div>
                    </div>
                </div>

                {/* ATAS DE REUNIÃO */}
                <div>
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Atas de Reunião</h2>
                    
                    {/* Lista de Atas Adicionadas */}
                    <div className="space-y-3 mb-6">
                        {atas.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Nenhuma ata adicionada ainda.</p>
                        ) : (
                            atas.map((ata, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <div className="font-bold text-gray-700 text-sm">{ata.titulo}</div>
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                            Data: {new Date(ata.dataReuniao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        </div>
                                        <a href={ata.arquivo} target="_blank" className="text-xs text-blue-600 hover:underline mt-1 block">Ver PDF Anexado</a>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveAta(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulário de Nova Ata */}
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4">Adicionar Nova Ata</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-5">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Título/Descrição</label>
                                <input value={newAtaTitulo} onChange={(e) => setNewAtaTitulo(e.target.value)}
                                    className="input-field bg-white" placeholder="Ex: Ata da Reunião Ordinária 01/2024" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Data da Reunião</label>
                                <input type="date" value={newAtaData} onChange={(e) => setNewAtaData(e.target.value)}
                                    className="input-field bg-white" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Arquivo PDF (URL)</label>
                                <input type="url" value={newAtaArquivo} onChange={(e) => setNewAtaArquivo(e.target.value)}
                                    className="input-field bg-white" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <button type="button" onClick={handleAddAta} className="w-full h-[42px] flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <Link href="/admin/conselhos" className="btn-outline">Cancelar</Link>
                    <button type="submit" disabled={saving}
                        className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
}
