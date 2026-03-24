"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const categorias = [
    { value: "relatorios", label: "Relatórios Fiscais" },
    { value: "transparencia", label: "Transparência" },
    { value: "legislacao", label: "Legislação" },
    { value: "geral", label: "Geral (todas as páginas)" },
];

const modulosAlvo = [
    { value: "", label: "Nenhum (Apenas listar o link)" },
    // Atendimento ao Cidadão
    { value: "passiva", label: "e-SIC (Transparência Passiva)" },
    { value: "ouvidoria", label: "Ouvidoria" },
    { value: "contato", label: "Fale Conosco / Contatos" },
    { value: "carta-servicos", label: "Carta de Serviços" },
    // Execução Financeira e Orçamentária
    { value: "receitas", label: "Receitas Públicas" },
    { value: "despesas", label: "Despesas Públicas" },
    { value: "emendas", label: "Emendas Parlamentares" },
    { value: "ordem-cronologica", label: "Ordem Cronológica de Pagamentos" },
    { value: "emenda-pix", label: "Emendas PIX" },
    { value: "transferencias", label: "Transferências Constitucionais" },
    { value: "orcamento", label: "Orçamento (LOA / LDO / PPA)" },
    // Gestão Administrativa
    { value: "prestacao-contas", label: "Prestação de Contas" },
    { value: "concursos", label: "Concursos e Seletivos" },
    { value: "atas-registro", label: "Atas de Registro de Preços" },
    { value: "leis", label: "Leis Municipais" },
    { value: "decretos", label: "Decretos" },
    { value: "portarias", label: "Portarias" },
    { value: "diarias", label: "Diárias e Passagens" },
    { value: "servidores", label: "Quadro de Pessoal / RH" },
    { value: "terceirizados", label: "Servidores Terceirizados" },
    { value: "estagiarios", label: "Servidores Estagiários" },
    { value: "licitacoes", label: "Licitações" },
    { value: "contratos", label: "Contratos" },
    { value: "convenios", label: "Convênios e Parcerias" },
    { value: "obras", label: "Obras Públicas" },
    { value: "processo-seletivo", label: "Processo Seletivo" },
    { value: "covid19", label: "Ações COVID-19" },
    { value: "frota", label: "Frota Municipal" },
    // Transparência Fiscal
    { value: "lrf", label: "Relatórios LRF (RREO/RGF)" },
    { value: "pcg", label: "PCG - Contas de Governo" },
    { value: "pcs", label: "PCS - Contas de Gestão" },
    // Informações Institucionais
    { value: "institucional", label: "Dados Institucionais" },
    { value: "gestores", label: "Prefeito e Vice-prefeito" },
    { value: "secretarias", label: "Secretarias Municipais" },
    { value: "simbolos", label: "Símbolos Municipais" },
    { value: "conselhos", label: "Conselhos Municipais" },
    { value: "glossario", label: "Glossário" },
    { value: "faq", label: "FAQ - Perguntas Frequentes" },
    { value: "mapa-do-site", label: "Mapa do Site" },
    { value: "dados-abertos", label: "Dados Abertos" },
    { value: "associacoes", label: "Associações" },
    { value: "plano-estrategico", label: "Plano Estratégico" },
    { value: "pesquisa-satisfacao", label: "Pesquisa de Satisfação" },
    // Normas e Regulamentações
    { value: "legislacao", label: "Legislação (Portal Externo)" },
    { value: "regulamentacao-diarias", label: "Regulamentação de Diárias" },
    { value: "parecer-tce", label: "Parecer Prévio TCE" },
    { value: "renuncias-fiscais", label: "Renúncias Fiscais" },
    { value: "relatorio-gestao", label: "Relatório de Gestão" },
    { value: "governo-digital", label: "Governo Digital" },
    { value: "lgpd", label: "LGPD" },
    { value: "tabela-diarias", label: "Tabela de Valores de Diárias" },
    // Saúde Pública
    { value: "medicamentos-sus", label: "Medicamentos SUS" },
    { value: "plano-saude", label: "Plano Municipal de Saúde" },
    { value: "unidades-saude", label: "Unidades de Saúde" },
    { value: "central-regulacao", label: "Central de Regulação" },
    // Outros (ATRICON / PNTP)
    { value: "plano-contratacao", label: "Plano Anual de Contratação" },
    { value: "desoneracoes", label: "Desonerações Fiscais" },
    { value: "radar", label: "Radar da Transparência" },
    { value: "divida-ativa", label: "Dívida Ativa" },
    { value: "plano-educacao", label: "Plano de Educação" },
    { value: "incentivos-culturais", label: "Incentivos Culturais" },
    // Redirecionamentos de Home
    { value: "home-transparencia", label: "Redirecionar: Card HOME Transparência" },
    { value: "home-esic", label: "Redirecionar: Card HOME E-SIC" },
    { value: "home-ouvidoria", label: "Redirecionar: Card HOME Ouvidoria" },
    { value: "home-secretarias", label: "Redirecionar: Card HOME Secretarias" },
];

const icones = [
    { value: "FaLink", label: "🔗 Link genérico" },
    { value: "FaFilePdf", label: "📄 PDF / Documento" },
    { value: "FaGlobe", label: "🌐 Site externo" },
    { value: "FaChartLine", label: "📊 Relatório / Gráfico" },
    { value: "FaBalanceScale", label: "⚖️ Legislação / Lei" },
    { value: "FaDownload", label: "⬇️ Download" },
    { value: "FaBuilding", label: "🏛️ Órgão Público" },
];

export default function NovoLinkExternoPage() {
    const router = useRouter();
    const [salvando, setSalvando] = useState(false);
    const [form, setForm] = useState({
        titulo: "",
        url: "",
        descricao: "",
        categoria: "geral",
        icone: "FaLink",
        ativo: true,
        ordem: 0,
        moduloAlvo: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.titulo || !form.url || !form.categoria) {
            toast.error("Preencha os campos obrigatórios.");
            return;
        }
        
        // Normalização da URL
        let urlFinal = form.url.trim();
        if (urlFinal && !urlFinal.startsWith("http://") && !urlFinal.startsWith("https://")) {
            urlFinal = `https://${urlFinal}`;
        }

        setSalvando(true);
        try {
            const res = await fetch("/api/admin/links-externos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, url: urlFinal }),
            });
            if (res.ok) {
                toast.success("Link externo salvo com sucesso!");
                router.push("/admin/links-externos");
            } else {
                toast.error("Erro ao salvar link.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/links-externos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Novo Link Externo</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Adicione um link para um site externo que aparecerá no portal.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Título do Link *</label>
                    <input
                        type="text"
                        required
                        value={form.titulo}
                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        placeholder="Ex: RREO 1º Bimestre 2024, Portal Siconfi..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">URL do Link *</label>
                    <input
                        type="url"
                        required
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Cole aqui o endereço completo do site ou PDF, incluindo o https://</p>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Descrição (opcional)</label>
                    <input
                        type="text"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        placeholder="Breve descrição do conteúdo do link..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Categoria / Onde aparece *</label>
                        <select
                            required
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none bg-white"
                        >
                            {categorias.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ícone</label>
                        <select
                            value={form.icone}
                            onChange={(e) => setForm({ ...form, icone: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none bg-white"
                        >
                            {icones.map((i) => (
                                <option key={i.value} value={i.value}>{i.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Vincular a um Módulo Existente (Opcional)</label>
                    <select
                        value={form.moduloAlvo}
                        onChange={(e) => setForm({ ...form, moduloAlvo: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none bg-white font-bold text-primary-600"
                    >
                        {modulosAlvo.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1 italic">Ao escolher um módulo, clicar no ícone dele no site levará direto para o link externo cadastrado acima.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ordem de exibição</label>
                        <input
                            type="number"
                            min={0}
                            value={form.ordem}
                            onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Número menor = aparece primeiro</p>
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                        <input
                            type="checkbox"
                            id="ativo"
                            checked={form.ativo}
                            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                            className="w-5 h-5 text-[#01b0ef] rounded"
                        />
                        <label htmlFor="ativo" className="text-sm font-bold text-gray-700 cursor-pointer">Link ativo (visível no site)</label>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={salvando}
                        className="flex items-center gap-2 bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black text-sm px-6 py-3 rounded-xl shadow transition-all disabled:opacity-50"
                    >
                        <FaSave /> {salvando ? "Salvando..." : "Salvar Link"}
                    </button>
                    <Link href="/admin/links-externos" className="px-6 py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
