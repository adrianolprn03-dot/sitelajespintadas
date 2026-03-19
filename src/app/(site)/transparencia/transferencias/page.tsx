import type { Metadata } from "next";
import Link from "next/link";
import { FaExchangeAlt, FaExternalLinkAlt, FaInfoCircle, FaHospital, FaSchool, FaMoneyCheckAlt, FaBuilding } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Transferências e Emendas | Prefeitura de Lajes Pintadas – RN",
    description: "Consulta às transferências constitucionais, convênios estaduais, federais e repasses de emendas parlamentares ao município.",
};

export default function TransferenciasPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Transferências Constitucionais"
                subtitle="Acompanhe os recursos estaduais e federais repassados para Lajes Pintadas, bem como as emendas parlamentares."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transferências" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                
                {/* Intro */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-12 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-16 h-16 shrink-0 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                        <FaExchangeAlt size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Recursos Externos Aplicados no Município</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Em conformidade com a <strong>Lei Complementar nº 131/2009 (Lei da Transparência)</strong>, disponibilizamos os canais diretos para consulta das transferências de recursos da União e do Estado. Você também pode consultar as verbas provenientes de Emendas Parlamentares destinadas à Prefeitura de Lajes Pintadas.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Transferências Federais */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                                    <FaBuilding size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Governo Federal</h3>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6 flex-1">
                                Consulte os repasses constitucionais e legais do Governo Federal, incluindo FPM, Fundeb, ITR e Royalties. A consulta é em tempo real pelo Portal da Transparência da CGU.
                            </p>
                            
                            <a 
                                href="https://portaldatransparencia.gov.br/transferencias" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 font-bold px-6 py-4 rounded-xl transition-colors border border-gray-200 hover:border-green-200"
                            >
                                Acessar Portal CGU <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>

                    {/* FNS / Saúde */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                                    <FaHospital size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Fundo Nacional de Saúde (FNS)</h3>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6 flex-1">
                                Confira todos os repasses do Fundo Nacional de Saúde efetuados diretamente para o Fundo Municipal de Saúde de Lajes Pintadas (Blocos de Custeio e Investimento).
                            </p>
                            
                            <a 
                                href="https://portalfns.saude.gov.br/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-bold px-6 py-4 rounded-xl transition-colors border border-gray-200 hover:border-blue-200"
                            >
                                Acessar Portal FNS <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>

                    {/* FNDE / Educação */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                                    <FaSchool size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Fundo de Desenvolvimento (FNDE)</h3>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6 flex-1">
                                Liberação de recursos federais destinados a programas da educação, como Merenda Escolar (PNAE), Transporte Escolar (PNATE), PDDE e Caminho da Escola.
                            </p>
                            
                            <a 
                                href="https://www.fnde.gov.br/liberacaoderecursos/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 font-bold px-6 py-4 rounded-xl transition-colors border border-gray-200 hover:border-amber-200"
                            >
                                Acessar FNDE <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>

                    {/* Emendas Parlamentares */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                                    <FaMoneyCheckAlt size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">Emendas Parlamentares</h3>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-6 flex-1">
                                Painel Nacional que detalha a destinação, tipo e valor de recursos indicados por Deputados (Estaduais e Federais) e Senadores para aplicação direta no município.
                            </p>
                            
                            <a 
                                href="https://portaldatransparencia.gov.br/emendas" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-bold px-6 py-4 rounded-xl transition-colors border border-gray-200 hover:border-purple-200"
                            >
                                Painel de Emendas <FaExternalLinkAlt />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                    <FaInfoCircle className="text-blue-500 text-xl mt-0.5 shrink-0" />
                    <div>
                        <h4 className="font-bold text-gray-800 mb-1">Nota sobre os dados</h4>
                        <p className="text-sm text-gray-600">
                            A Prefeitura Municipal direciona o cidadão aos painéis originais e atualizados da União e do Estado para garantir total fidedignidade, em tempo real, da aplicação do dinheiro público (art. 48, LC 101/00). Convênios municipais específicos firmados pela prefeitura podem ser consultados na aba <Link href="/transparencia/convenios" className="text-blue-600 font-bold hover:underline">Convênios</Link>.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
