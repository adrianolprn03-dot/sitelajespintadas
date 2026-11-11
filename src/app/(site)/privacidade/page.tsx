"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { FaShieldAlt, FaCalendarAlt, FaSearch, FaFilePdf, FaCheckCircle, FaLock } from "react-icons/fa";
import { MUNICIPIO } from "@/config/municipio";

const MESES = [
    { v: "", l: "Todos os meses" },
    { v: "1", l: "Janeiro" },
    { v: "2", l: "Fevereiro" },
    { v: "3", l: "Março" },
    { v: "4", l: "Abril" },
    { v: "5", l: "Maio" },
    { v: "6", l: "Junho" },
    { v: "7", l: "Julho" },
    { v: "8", l: "Agosto" },
    { v: "9", l: "Setembro" },
    { v: "10", l: "Outubro" },
    { v: "11", l: "Novembro" },
    { v: "12", l: "Dezembro" },
];

const SECOES_PRIVACIDADE = [
    {
        id: "1",
        titulo: "1. Quem somos",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `A Prefeitura Municipal de Lajes Pintadas/RN, inscrita no CNPJ sob o nº 08.000.000/0001-00, com sede no Palácio Municipal, Centro, Lajes Pintadas - RN, é a controladora dos dados pessoais coletados por este portal, nos termos da LGPD.

Encarregado de Proteção de Dados (DPO): ${MUNICIPIO.dpo} (E-mail: ${MUNICIPIO.dpoEmail})`
    },
    {
        id: "2",
        titulo: "2. Dados que coletamos",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `Este portal pode coletar os seguintes tipos de dados:

• Dados de identificação (nome, CPF/CNPJ — somente quando necessário para prestação de serviços municipais)
• Dados de contato (e-mail, telefone — para resposta a solicitações do cidadão)
• Dados de navegação (IP, cookies estritamente operacionais — para segurança e usabilidade)
• Dados de pedidos de informação e ouvidoria (quando o cidadão opta por se identificar)

A identificação do solicitante NÃO é obrigatória para pedidos e-SIC, conforme art. 10 da Lei Federal 12.527/2011.`
    },
    {
        id: "3",
        titulo: "3. Finalidade do tratamento",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `Os dados coletados são utilizados exclusivamente para:

• Responder pedidos de acesso à informação (e-SIC)
• Receber e processar manifestações da Ouvidoria Municipal
• Enviar respostas às solicitações de Fale Conosco
• Garantir a segurança do portal contra acessos indevidos
• Cumprir obrigações legais, regulatórias e fiscais`
    },
    {
        id: "4",
        titulo: "4. Base legal para o tratamento",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `O tratamento de dados neste portal é realizado com base nas hipóteses legais previstas na LGPD (art. 7º):

• Cumprimento de obrigação legal (art. 7º, II) — especialmente para e-SIC e publicação de dados de transparência ativa
• Execução de políticas públicas pelo poder público (art. 7º, III)
• Exercício regular de direitos (art. 7º, VI)
• Consentimento do titular (art. 7º, I) — para comunicações opcionais`
    },
    {
        id: "5",
        titulo: "5. Compartilhamento de dados",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `A Prefeitura Municipal NÃO comercializa, aluga ou compartilha seus dados pessoais com terceiros para fins publicitários ou comerciais.

Os dados poderão ser compartilhados estritamente:
• Com outros órgãos públicos, quando necessário ao cumprimento de dever legal
• Com Tribunais de Contas, Ministério Público e órgãos de controle externo
• Em cumprimento a ordem judicial fundamentada`
    },
    {
        id: "6",
        titulo: "6. Seus direitos (Art. 18 da LGPD)",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `Como titular de dados pessoais, você possui o direito soberano de:

• Confirmar a existência de tratamento
• Acessar os dados que possuímos sobre você
• Corrigir dados incompletos, inexatos ou desatualizados
• Solicitar anonimização, bloqueio ou eliminação de dados excessivos
• Revogar consentimento, quando aplicável
• Obter informação sobre entidades com as quais houve compartilhamento
• Se opor a tratamentos em desconformidade com a lei

Para exercer seus direitos, utilize o e-SIC ou envie solicitação ao e-mail: ${MUNICIPIO.dpoEmail}`
    },
    {
        id: "7",
        titulo: "7. Cookies e Tecnologias de Navegação",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `Este portal adota apenas cookies estritamente necessários para viabilizar sessões de navegação, segurança e acessibilidade. Não utilizamos cookies de rastreamento com fins de propaganda ou monetização.`
    },
    {
        id: "8",
        titulo: "8. Segurança e Governança da Informação",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `Adotamos medidas técnicas e administrativas compatíveis com as diretrizes do Governo Digital para proteger seus dados pessoais contra acessos não autorizados, incidentes ou destruição:
• Conexão criptografada (HTTPS com TLS 1.3)
• Controle de acesso por autenticação restrita
• Trilha de auditoria em operações sensíveis`
    },
    {
        id: "9",
        titulo: "9. Contato com o DPO e Reclamações",
        mesRevisao: 6,
        anoRevisao: 2026,
        conteudo: `Qualquer questão sobre esta política ou sobre o tratamento dos seus dados pode ser direcionada ao Encarregado de Proteção de Dados (DPO):

Encarregado: ${MUNICIPIO.dpo}
E-mail: ${MUNICIPIO.dpoEmail}
Horário de Atendimento: 07h às 13h (segunda a sexta-feira)
Canal e-SIC: /servicos/esic

Você também pode registrar manifestações perante a Autoridade Nacional de Proteção de Dados (ANPD): www.gov.br/anpd`
    }
];

export default function PrivacidadePage() {
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("2026");
    const [mes, setMes] = useState("");

    const secoesFiltradas = useMemo(() => {
        return SECOES_PRIVACIDADE.filter((s) => {
            const b = busca.toLowerCase();
            const matchBusca = !busca || s.titulo.toLowerCase().includes(b) || s.conteudo.toLowerCase().includes(b);
            const matchAno = !ano || s.anoRevisao.toString() === ano;
            const matchMes = !mes || s.mesRevisao.toString() === mes;
            return matchBusca && matchAno && matchMes;
        });
    }, [busca, ano, mes]);

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Política de Privacidade"
                subtitle="Como coletamos, usamos e protegemos seus dados pessoais — em conformidade com a LGPD (Lei nº 13.709/2018)"
                icon={<FaShieldAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Política de Privacidade" }
                ]}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* Banner de Conformidade e Vigência */}
                <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-[#1254A3] rounded-xl flex items-center justify-center shrink-0">
                            <FaShieldAlt size={22} />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-[#1254A3] uppercase tracking-wider block">
                                Versão Vigente da Política
                            </span>
                            <h3 className="text-base font-black text-[#12304A]">
                                Ciclo 2026 • Atualizada em Junho de 2026
                            </h3>
                            <p className="text-xs text-[#5B738B]">
                                Em conformidade com a LGPD (Lei 13.709/2018) e Cartilha PNTP de Transparência Pública.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/transparencia/lgpd"
                            className="px-4 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm"
                        >
                            Atos Oficiais da LGPD →
                        </Link>
                    </div>
                </div>

                {/* Filtro de Mês, Ano e Busca da Política */}
                <div className="bg-white rounded-2xl p-5 border border-[#DDE3EA] shadow-sm">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
                            <input
                                type="text"
                                placeholder="Pesquisar cláusula ou direito (ex: 'cookies', 'direitos', 'finalidade')..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-medium text-[#12304A] placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all outline-none"
                            />
                        </div>

                        {/* Filtro de Ano */}
                        <div className="relative w-full md:w-36">
                            <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                            <select
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] focus:bg-white focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all outline-none cursor-pointer appearance-none"
                            >
                                <option value="">Todos os anos</option>
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>

                        {/* Filtro de Mês */}
                        <div className="relative w-full md:w-40">
                            <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
                            <select
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] focus:bg-white focus:ring-2 focus:ring-[#1254A3]/20 focus:border-[#1254A3] transition-all outline-none cursor-pointer appearance-none"
                            >
                                {MESES.map(m => (
                                    <option key={m.v} value={m.v}>{m.l}</option>
                                ))}
                            </select>
                        </div>

                        {(busca || mes || ano !== "2026") && (
                            <button
                                onClick={() => { setBusca(""); setAno("2026"); setMes(""); }}
                                className="px-3 py-2 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#5B738B] hover:text-[#12304A]"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>

                {/* Seções da Política */}
                <div className="space-y-4">
                    {secoesFiltradas.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-[#DDE3EA] shadow-sm">
                            <h4 className="text-base font-bold text-[#12304A] mb-1">Nenhuma cláusula localizada para o período</h4>
                            <p className="text-xs text-[#5B738B]">Ajuste o filtro de mês ou termo de busca.</p>
                        </div>
                    ) : (
                        secoesFiltradas.map((secao) => (
                            <div key={secao.id} className="bg-white rounded-2xl shadow-sm border border-[#DDE3EA] p-6 sm:p-7">
                                <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-[#DDE3EA]">
                                    <h2 className="font-bold text-[#12304A] text-base">
                                        {secao.titulo}
                                    </h2>
                                    <span className="text-[10px] font-bold text-[#1254A3] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                                        Revisão: Mês {secao.mesRevisao}/{secao.anoRevisao}
                                    </span>
                                </div>
                                <p className="text-[#5B738B] text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-line">
                                    {secao.conteudo}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Rodapé da política */}
                <div className="bg-white rounded-2xl p-6 text-center border border-[#DDE3EA] shadow-sm">
                    <p className="text-[#5B738B] text-xs font-medium leading-relaxed">
                        Prefeitura Municipal de {MUNICIPIO.nome} • CNPJ 08.000.000/0001-00<br />
                        Esta política poderá ser revisada periodicamente para atualizar disposições legais ou aprimorar os mecanismos de segurança da informação.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                        <Link 
                            href="/servicos/esic" 
                            className="text-[#1254A3] text-xs font-bold hover:underline"
                        >
                            Exercer direitos do titular via e-SIC →
                        </Link>
                        <span className="text-slate-300">•</span>
                        <Link 
                            href="/transparencia/lgpd" 
                            className="text-[#1254A3] text-xs font-bold hover:underline"
                        >
                            Consultar Atos de Privacidade (LGPD) →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}