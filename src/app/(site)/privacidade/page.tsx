import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Política de Privacidade | Prefeitura de Lajes Pintadas – RN",
    description: "Política de Privacidade e Proteção de Dados Pessoais da Prefeitura Municipal de Lajes Pintadas, em conformidade com a LGPD (Lei 13.709/2018).",
};

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Política de Privacidade"
                subtitle="Como coletamos, usamos e protegemos seus dados — em conformidade com a LGPD (Lei nº 13.709/2018)"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Política de Privacidade" }
                ]}
            />

            <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">

                {/* Atualização */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-8 py-6 flex items-center gap-4">
                    <span className="text-3xl">📋</span>
                    <div>
                        <p className="font-black text-[#0088b9] text-sm uppercase tracking-widest mb-1">Última Atualização: Janeiro de 2025</p>
                        <p className="text-gray-500 text-sm font-medium">Em conformidade com a Lei Geral de Proteção de Dados Pessoais — LGPD (Lei Federal nº 13.709/2018)</p>
                    </div>
                </div>

                {/* Seções */}
                {[
                    {
                        id: "1",
                        titulo: "1. Quem somos",
                        conteudo: `A Prefeitura Municipal de Lajes Pintadas, inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede na Rua Principal, s/n, Centro, Lajes Pintadas – RN, CEP 59.233-000, é a controladora dos dados pessoais coletados por este portal, nos termos da LGPD.

Encarregado de Proteção de Dados (DPO): secretaria@lajespintadas.rn.gov.br`
                    },
                    {
                        id: "2",
                        titulo: "2. Dados que coletamos",
                        conteudo: `Este portal pode coletar os seguintes tipos de dados:

• Dados de identificação (nome, CPF/CNPJ — somente quando necessário para prestação de serviços)
• Dados de contato (e-mail, telefone — para resposta a solicitações)
• Dados de navegação (IP, cookies de sessão — para segurança e usabilidade)
• Dados de pedidos de informação e ouvidoria (quando o cidadão opta por se identificar)

A identificação do solicitante NÃO é obrigatória para pedidos e-SIC, conforme art. 10 da Lei 12.527/2011.`
                    },
                    {
                        id: "3",
                        titulo: "3. Finalidade do tratamento",
                        conteudo: `Os dados coletados são utilizados exclusivamente para:

• Responder pedidos de acesso à informação (e-SIC)
• Receber e processar manifestações da Ouvidoria
• Enviar respostas às solicitações de Fale Conosco
• Garantir a segurança do portal contra acessos indevidos
• Cumprir obrigações legais e regulatórias`
                    },
                    {
                        id: "4",
                        titulo: "4. Base legal para o tratamento",
                        conteudo: `O tratamento de dados neste portal é realizado com base nas seguintes hipóteses legais previstas na LGPD (art. 7º):

• Cumprimento de obrigação legal (art. 7º, II) — especialmente para e-SIC e publicação de dados de transparência
• Execução de políticas públicas (art. 7º, III)
• Exercício regular de direitos (art. 7º, VI)
• Consentimento do titular (art. 7º, I) — para comunicações opcionais`
                    },
                    {
                        id: "5",
                        titulo: "5. Compartilhamento de dados",
                        conteudo: `A Prefeitura NÃO vende, aluga ou compartilha seus dados pessoais com terceiros para fins comerciais.

Os dados poderão ser compartilhados apenas:
• Com outros órgãos públicos, quando necessário ao cumprimento de obrigação legal
• Com Tribunais de Contas, Ministério Público e demais órgãos de controle, em cumprimento à lei
• Em cumprimento a ordem judicial`
                    },
                    {
                        id: "6",
                        titulo: "6. Seus direitos (Art. 18 da LGPD)",
                        conteudo: `Como titular de dados pessoais, você tem direito a:

• Confirmar se tratamos seus dados
• Acessar os dados que possuímos sobre você
• Corrigir dados incompletos, inexatos ou desatualizados
• Solicitar anonimização, bloqueio ou eliminação de dados desnecessários
• Revogar consentimento, quando aplicável
• Obter informação sobre o compartilhamento de dados
• Se opor ao tratamento realizado sem seu consentimento

Para exercer seus direitos, entre em contato via e-SIC ou pelo e-mail: secretaria@lajespintadas.rn.gov.br`
                    },
                    {
                        id: "7",
                        titulo: "7. Cookies",
                        conteudo: `Este portal utiliza cookies estritamente necessários para garantir seu funcionamento. Não utilizamos cookies de rastreamento ou publicidade.

Os cookies de sessão são automaticamente excluídos ao fechar o navegador.`
                    },
                    {
                        id: "8",
                        titulo: "8. Segurança",
                        conteudo: `Adotamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, destruição, perda ou alteração, incluindo:
• Conexão segura (HTTPS/TLS)
• Controle de acesso por autenticação
• Registro de acessos administrativos`
                    },
                    {
                        id: "9",
                        titulo: "9. Contato e denúncias",
                        conteudo: `Qualquer questão sobre esta política ou sobre o tratamento dos seus dados pode ser direcionada ao Encarregado de Proteção de Dados (DPO):

E-mail: secretaria@lajespintadas.rn.gov.br
Canal e-SIC: /servicos/esic

Você também pode registrar reclamações junto à Autoridade Nacional de Proteção de Dados (ANPD): www.gov.br/anpd`
                    }
                ].map((secao) => (
                    <div key={secao.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                        <h2 className="font-black text-[#0088b9] text-lg uppercase tracking-tight mb-5 pb-4 border-b border-gray-100">
                            {secao.titulo}
                        </h2>
                        <p className="text-gray-600 text-sm leading-loose font-medium whitespace-pre-line">
                            {secao.conteudo}
                        </p>
                    </div>
                ))}

                {/* Rodapé da política */}
                <div className="bg-gray-100 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        Prefeitura Municipal de Lajes Pintadas – RN • CNPJ 08.XXX.XXX/0001-XX<br />
                        Esta política poderá ser revisada para atualizar disposições legais ou melhorar a clareza do texto.
                    </p>
                    <Link href="/servicos/esic" className="inline-block mt-4 text-[#01b0ef] text-xs font-black uppercase tracking-widest hover:underline">
                        Exercer meus direitos via e-SIC →
                    </Link>
                </div>
            </div>
        </div>
    );
}
