"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSpinner, FaHandHoldingDollar } from "react-icons/fa6";
import { FaSave, FaFileUpload } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoEmendaPixPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        ano: new Date().getFullYear().toString(),
        origem: "Federal",
        tipoEmenda: "Individual",
        formaRepasse: "Transferência Especial - PIX",
        numeroEmenda: "",
        autor: "",
        beneficiario: "Prefeitura Municipal de Lajes Pintadas",
        cnpjBeneficiario: "08.150.150/0001-40",
        valorPrevisto: "0",
        valorRecebido: "0",
        valorExecutado: "0",
        objeto: "",
        funcaoGoverno: "Administração",
        secretariaResponsavel: "",
        situacao: "Recebido",
        dataRecebimento: "",
        arquivo: "",
        documentUrl: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/emendas-pix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Emenda PIX cadastrada!");
                router.push("/admin/emendas-pix");
                router.refresh();
            } else {
                toast.error("Erro ao cadastrar");
            }
        } catch {
            toast.error("Erro no servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/emendas-pix" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                    <FaArrowLeft /> Voltar
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                   <FaHandHoldingDollar className="text-emerald-500" /> Cadastrar Emenda PIX
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ano *</label>
                        <input type="number" required className="input-field" value={form.ano} onChange={e => setForm({...form, ano: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Origem *</label>
                        <select required className="input-field" value={form.origem} onChange={e => setForm({...form, origem: e.target.value})}>
                            <option value="Federal">Federal</option>
                            <option value="Estadual">Estadual</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Emenda</label>
                        <select className="input-field" value={form.tipoEmenda} onChange={e => setForm({...form, tipoEmenda: e.target.value})}>
                            <option value="Individual">Individual</option>
                            <option value="Bancada">Bancada</option>
                            <option value="Comissão">Comissão</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Autor da Emenda (Parlamentar) *</label>
                        <input type="text" required className="input-field" value={form.autor} onChange={e => setForm({...form, autor: e.target.value})} placeholder="Nome do Deputado ou Senador" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Número da Emenda</label>
                        <input type="text" className="input-field" value={form.numeroEmenda} onChange={e => setForm({...form, numeroEmenda: e.target.value})} placeholder="Ex: 202412340001" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Beneficiário *</label>
                        <input type="text" required className="input-field" value={form.beneficiario} onChange={e => setForm({...form, beneficiario: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">CNPJ do Beneficiário</label>
                        <input type="text" className="input-field" value={form.cnpjBeneficiario} onChange={e => setForm({...form, cnpjBeneficiario: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Valor Previsto</label>
                        <input type="number" step="0.01" className="input-field" value={form.valorPrevisto} onChange={e => setForm({...form, valorPrevisto: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 font-bold text-emerald-600 uppercase tracking-widest text-[10px]">Valor Recebido</label>
                        <input type="number" step="0.01" className="input-field border-emerald-200 bg-emerald-50/30" value={form.valorRecebido} onChange={e => setForm({...form, valorRecebido: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 font-bold text-blue-600 uppercase tracking-widest text-[10px]">Valor Executado</label>
                        <input type="number" step="0.01" className="input-field border-blue-200 bg-blue-50/30" value={form.valorExecutado} onChange={e => setForm({...form, valorExecutado: e.target.value})} />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Objeto / Finalidade *</label>
                        <textarea required className="input-field min-h-[100px]" value={form.objeto} onChange={e => setForm({...form, objeto: e.target.value})} placeholder="Descrição detalhada da finalidade do recurso..." />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Função de Governo</label>
                        <input type="text" className="input-field" value={form.funcaoGoverno} onChange={e => setForm({...form, funcaoGoverno: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Secretaria Responsável</label>
                        <input type="text" className="input-field" value={form.secretariaResponsavel} onChange={e => setForm({...form, secretariaResponsavel: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Situação *</label>
                        <select required className="input-field" value={form.situacao} onChange={e => setForm({...form, situacao: e.target.value})}>
                            <option value="Recebido">Recebido</option>
                            <option value="Em Execução">Em Execução</option>
                            <option value="Concluído">Concluído</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Recebimento</label>
                        <input type="date" className="input-field" value={form.dataRecebimento} onChange={e => setForm({...form, dataRecebimento: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Forma de Repasse</label>
                        <input type="text" className="input-field bg-gray-50" value={form.formaRepasse} readOnly />
                    </div>

                    {/* Documentos Section */}
                    <div className="md:col-span-3 pt-6 border-t border-gray-100 space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Documentos e Comprovação</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Enviar Arquivo (PDF/Imagem)</label>
                                <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-emerald-500 hover:text-emerald-500 cursor-pointer transition-all bg-gray-50/50">
                                    <FaFileUpload className="text-xl" />
                                    <div className="text-center">
                                        <p className="text-xs font-bold">{form.arquivo ? "Trocar arquivo" : "Clique para enviar"}</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf, image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                try {
                                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                    const data = await res.json();
                                                    if (data.url) {
                                                        setForm({ ...form, arquivo: data.url });
                                                        toast.success("Arquivo enviado!");
                                                    }
                                                } catch {
                                                    toast.error("Erro no upload");
                                                }
                                            }
                                        }}
                                    />
                                </label>
                                {form.arquivo && (
                                    <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 rounded-lg text-[10px] text-emerald-700 font-bold">
                                        <span className="truncate max-w-[200px]">{form.arquivo.split('/').pop()}</span>
                                        <a href={form.arquivo} target="_blank" className="hover:underline">Ver</a>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ou URL do Documento</label>
                                <input 
                                    type="url" 
                                    className="input-field" 
                                    value={form.documentUrl} 
                                    onChange={e => setForm({ ...form, documentUrl: e.target.value })} 
                                    placeholder="https://transferegov.sistema.gov.br/..." 
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Insira o link para o detalhamento da emenda no Transferegov ou Portal da Transparência Federal.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={loading} className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 px-12 py-4 text-sm">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Gravar Emenda PIX
                    </button>
                </div>
            </form>
        </div>
    );
}
