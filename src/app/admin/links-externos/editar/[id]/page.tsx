"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    
    // --- PÁGINA INICIAL (HOME) ---
    { value: "home-transparencia", label: "Home: Portal da Transparência" },
    { value: "home-esic", label: "Home: E-SIC" },
    { value: "home-ouvidoria", label: "Home: Ouvidoria" },
    { value: "home-secretarias", label: "Home: Secretarias" },
    { value: "home-contracheque", label: "Home: Contracheque (Acesso Rápido)" },
    { value: "home-contribuinte", label: "Home: Portal do Contribuinte" },
    { value: "home-diario", label: "Home: Diário Oficial" },
    { value: "home-webmail", label: "Home: Webmail" },
    { value: "home-radar", label: "Home: Radar da Transparência" },

    // --- CARDS DO PORTAL (Sincronizados com o Frontend) ---
    { value: "associacoes", label: "Card: Associações" },
    { value: "atas-registro", label: "Card: Atas de Registro de Preços" },
    { value: "simbolos", label: "Card: Brasão, Hino e Bandeira" },
    { value: "carta-servicos", label: "Card: Carta de Serviço" },
    { value: "central-regulacao", label: "Card: Central de Regulação" },
    { value: "concursos", label: "Card: Concurso Público" },
    { value: "conselhos", label: "Card: Conselhos e Membros" },
    { value: "contato", label: "Card: Contatos" },
    { value: "contratos", label: "Card: Contratos" },
    { value: "convenios", label: "Card: Convênios e Parcerias" },
    { value: "covid19", label: "Card: Covid-19" },
    { value: "dados-abertos", label: "Card: Dados Abertos" },
    { value: "institucional", label: "Card: Dados Institucionais" },
    { value: "decretos", label: "Card: Decretos" },
    { value: "desoneracoes", label: "Card: Desonerações" },
    { value: "despesas", label: "Card: Despesas Públicas" },
    { value: "diarias", label: "Card: Diárias" },
    { value: "divida-ativa", label: "Card: Dívida Ativa" },
    { value: "passiva", label: "Card: E-sic" },
    { value: "emenda-pix", label: "Card: Emenda PIX" },
    { value: "emendas", label: "Card: Emendas Parlamentares" },
    { value: "estagiarios", label: "Card: Estagiários" },
    { value: "contato", label: "Card: Fale Conosco" },
    { value: "frota", label: "Card: Frota Municipal" },
    { value: "glossario", label: "Card: Glossário" },
    { value: "incentivos-culturais", label: "Card: Incentivos Culturais e Esportivos" },
    { value: "radar", label: "Card: Informações sobre o Radar" },
    { value: "lgpd", label: "Card: LGPD" },
    { value: "leis", label: "Card: Leis" },
    { value: "legislacao", label: "Card: Leis (Legislação)" },
    { value: "licitacoes", label: "Card: Licitações" },
    { value: "medicamentos-sus", label: "Card: Lista de Medicamentos SUS" },
    { value: "mapa-do-site", label: "Card: Mapa do Site" },
    { value: "obras", label: "Card: Obras Públicas" },
    { value: "orcamento", label: "Card: Orçamento (LOA / LDO / PPA)" },
    { value: "ordem-cronologica", label: "Card: Ordem Cronológica" },
    { value: "ouvidoria", label: "Card: Ouvidoria" },
    { value: "pcg", label: "Card: PCG - Prestação de contas de governo" },
    { value: "pcs", label: "Card: PCS - Prestação de contas de gestão" },
    { value: "parecer-tce", label: "Card: Parecer do Tribunal de Contas" },
    { value: "faq", label: "Card: Perguntas e Respostas (FAQ)" },
    { value: "pesquisa-satisfacao", label: "Card: Pesquisa de Satisfação" },
    { value: "plano-contratacao", label: "Card: Plano Anual de Contratação" },
    { value: "plano-educacao", label: "Card: Plano de Educação" },
    { value: "plano-saude", label: "Card: Plano de Saúde" },
    { value: "plano-estrategico", label: "Card: Plano Estratégico Institucional" },
    { value: "portarias", label: "Card: Portarias" },
    { value: "prestacao-contas", label: "Card: Prestação de Contas" },
    { value: "processo-seletivo", label: "Card: Processo Seletivo" },
    { value: "gestores", label: "Card: Prefeito e Vice-prefeito" },
    { value: "servidores", label: "Card: Quadro Pessoal" },
    { value: "receitas", label: "Card: Receitas Públicas" },
    { value: "regulamentacao-diarias", label: "Card: Regulamentação das Diárias" },
    { value: "governo-digital", label: "Card: Regulamentação de Governo Digital" },
    { value: "relatorio-gestao", label: "Card: Relatório de Gestão e Atividades" },
    { value: "renuncias-fiscais", label: "Card: Renúncias Fiscais" },
    { value: "secretarias", label: "Card: Secretarias Municipais" },
    { value: "tabela-diarias", label: "Card: Tabelas de Valores de Diárias" },
    { value: "terceirizados", label: "Card: Terceirizados" },
    { value: "transferencias", label: "Card: Transferências" },
    { value: "lrf", label: "Card: Transparência Fiscal (LRF)" },
    { value: "folha-pagamento", label: "Card: Folha de Pagamento" },
    { value: "cargos-e-salarios", label: "Card: Padrão Remuneratório" },
    { value: "concursos", label: "Card: Concursos e Seleções" },
    { value: "terceirizados", label: "Card: Terceirizados" },
    { value: "agentes-politicos", label: "Card: Agentes Políticos" },
    { value: "publicacoes", label: "Card: Publicações" },
    { value: "unidades-saude", label: "Card: Unidades de Saúde" },
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

export default function EditarLinkExternoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [salvando, setSalvando] = useState(false);
    const [carregando, setCarregando] = useState(true);
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

    useEffect(() => {
        fetch("/api/admin/links-externos")
            .then((r) => r.json())
            .then((data: Array<typeof form & { id: string }>) => {
                const item = data.find((l) => l.id === id);
                if (item) setForm({ 
                    titulo: item.titulo, 
                    url: item.url, 
                    descricao: item.descricao || "", 
                    categoria: item.categoria, 
                    icone: item.icone, 
                    ativo: item.ativo, 
                    ordem: item.ordem,
                    moduloAlvo: item.moduloAlvo || "",
                });
            })
            .finally(() => setCarregando(false));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Normalização da URL
        let urlFinal = form.url.trim();
        if (urlFinal && !urlFinal.startsWith("http://") && !urlFinal.startsWith("https://")) {
            urlFinal = `https://${urlFinal}`;
        }

        setSalvando(true);
        try {
            const res = await fetch(`/api/admin/links-externos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, url: urlFinal }),
            });
            if (res.ok) {
                toast.success("Link atualizado com sucesso!");
                router.push("/admin/links-externos");
            } else {
                toast.error("Erro ao atualizar.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSalvando(false);
        }
    };

    if (carregando) return <div className="p-6 text-center text-gray-400">Carregando...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/links-externos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Editar Link Externo</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Altere as informações do link externo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Título do Link *</label>
                    <input type="text" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: RREO 1º Bimestre 2024..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">URL do Link *</label>
                    <input type="url" required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Descrição (opcional)</label>
                    <input type="text" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descrição..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Categoria *</label>
                        <select required value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none bg-white">
                            {categorias.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ícone</label>
                        <select value={form.icone} onChange={(e) => setForm({ ...form, icone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none bg-white">
                            {icones.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
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
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ordem</label>
                        <input type="number" min={0} value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#01b0ef] focus:border-transparent outline-none" />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                        <input type="checkbox" id="ativo" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} className="w-5 h-5 text-[#01b0ef] rounded" />
                        <label htmlFor="ativo" className="text-sm font-bold text-gray-700 cursor-pointer">Link ativo</label>
                    </div>
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={salvando} className="flex items-center gap-2 bg-[#01b0ef] hover:bg-[#0088b9] text-white font-black text-sm px-6 py-3 rounded-xl shadow transition-all disabled:opacity-50">
                        <FaSave /> {salvando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <Link href="/admin/links-externos" className="px-6 py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
