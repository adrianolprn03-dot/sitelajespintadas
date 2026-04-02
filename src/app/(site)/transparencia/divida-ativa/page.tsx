import type { Metadata } from "next";
import Link from "next/link";
import { FaFileInvoiceDollar, FaExternalLinkAlt, FaInfoCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

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
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaFileInvoiceDollar className="text-amber-500" /> Resumo Estatístico da Dívida Ativa
                            </h2>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-amber-800 text-sm">
                                <strong>Nota Transparência:</strong> Este quadro apresenta o montante consolidado de débitos inscritos em dívida ativa, classificados por natureza e exercício de origem, para fins de transparência fiscal.
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Exercício</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Natureza do Débito</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Montante (R$)</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qtd. Inscritos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[
                                            { ano: 2024, natureza: "Tributária (IPTU/ISS)", valor: 852400.50, qtd: 1240 },
                                            { ano: 2024, natureza: "Não Tributária (Multas/Taxas)", valor: 145000.30, qtd: 520 },
                                            { ano: 2023, natureza: "Tributária (IPTU/ISS)", valor: 1205000.00, qtd: 1890 },
                                            { ano: 2023, natureza: "Não Tributária (Diversos)", valor: 98000.45, qtd: 310 },
                                            { ano: 2022, natureza: "Tributária Consolidada", valor: 2150000.00, qtd: 2450 },
                                        ].map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.ano}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-bold text-gray-700">{item.natureza}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <p className="text-sm font-black text-emerald-600 tracking-tighter">R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <p className="text-xs font-bold text-gray-400">{item.qtd}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-blue-50/30 border-t-2 border-blue-100">
                                            <td colSpan={2} className="px-6 py-5 text-[10px] font-black text-blue-800 uppercase tracking-widest">Total Geral Consolidado</td>
                                            <td className="px-6 py-5 text-right text-base font-black text-blue-700 tracking-tighter">R$ 4.450.401,25</td>
                                            <td className="px-6 py-5 text-center text-xs font-black text-blue-500">6.410</td>
                                        </tr>
                                    </tfoot>
                                </table>
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
                <div className="mt-12">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
