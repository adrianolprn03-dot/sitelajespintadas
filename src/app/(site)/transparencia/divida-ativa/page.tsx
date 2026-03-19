import type { Metadata } from "next";
import Link from "next/link";
import { FaFileInvoiceDollar, FaExternalLinkAlt, FaInfoCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Dívida Ativa | Prefeitura de Lajes Pintadas – RN",
    description: "Informações sobre a Dívida Ativa do Município de Lajes Pintadas, com acesso ao Portal do Contribuinte.",
};

export default function DividaAtivaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Dívida Ativa Municipal"
                subtitle="Consulta de débitos, emissão de certidões e regularização fiscal junto ao município."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dívida Ativa" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Conteúdo Principal */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-black text-[#0088b9] mb-4 flex items-center gap-3">
                                <FaFileInvoiceDollar /> O que é a Dívida Ativa?
                            </h2>
                            <div className="prose prose-blue max-w-none text-gray-600">
                                <p>
                                    A Dívida Ativa do Município é o conjunto de débitos de pessoas físicas e jurídicas para com a Fazenda Pública Municipal. 
                                    Esses débitos podem ser de natureza tributária (como IPTU, ISS, Taxas não pagos no prazo correto) ou não tributária 
                                    (como multas, restituições, indenizações).
                                </p>
                                <p>
                                    Quando o débito não é pago até a data de vencimento estabelecida por lei ou contrato, ele é inscrito em Dívida Ativa, 
                                    gerando acréscimos legais de correção monetária, juros e multas de mora.
                                </p>
                            </div>

                            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-blue-200">
                                    <FaInfoCircle className="text-2xl text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">Regularize sua situação</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Evite restrições no seu CPF/CNPJ, execução fiscal e penhora de bens. Acesse o Portal do Contribuinte 
                                        para consultar seus débitos, emitir boletos e negociar dívidas.
                                    </p>
                                    <Link 
                                        href="https://tinus.com.br/lajespintadas" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#01b0ef] hover:bg-[#0088b9] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors"
                                    >
                                        Portal do Contribuinte <FaExternalLinkAlt />
                                    </Link>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Lista de Maiores Devedores</h2>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-amber-800 text-sm">
                                <strong>Nota da Procuradoria:</strong> A divulgação dos inscritos em dívida ativa segue as diretrizes 
                                da Lei de Transparência e Portarias da Procuradoria Geral do Município, resguardando direitos sob a LGPD.
                            </div>

                            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-500 font-medium">Relatório de inscritos será publicado em breve, após consolidação da auditoria fiscal do exercício vigente.</p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar de Atendimento */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg">
                            <h3 className="text-xl font-black mb-6 border-b border-slate-700 pb-4">Atendimento Tributário</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Setor Responsável</p>
                                    <p className="font-medium">Secretaria Municipal de Tributação e Finanças</p>
                                </div>
                                
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Horário de Atendimento</p>
                                    <p className="font-medium">Segunda a Sexta, 08h às 13h</p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-700 space-y-4">
                                    <a href="tel:+558430000000" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                            <FaPhoneAlt />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">Telefone</span>
                                            <span className="font-medium">(84) 3000-0000</span>
                                        </div>
                                    </a>
                                    
                                    <a href="mailto:tributacao@lajespintadas.rn.gov.br" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-400">E-mail</span>
                                            <span className="font-medium break-all">tributacao@lajespintadas.rn.gov.br</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Banner Certidão */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-gray-800 mb-2">Certidão Negativa de Débitos (CND)</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Precisa comprovar sua regularidade fiscal? Emita sua certidão negativa de forma online e gratuita.
                            </p>
                            <Link 
                                href="https://tinus.com.br/lajespintadas" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-2 px-4 border border-[#01b0ef] text-[#0088b9] hover:bg-[#01b0ef] hover:text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-colors"
                            >
                                Emitir Certidão
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
