import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaShieldAlt, FaUserShield, FaServer, FaBalanceScale } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Lei Geral de Proteção de Dados (LGPD) | Prefeitura de Lajes Pintadas",
    description: "Política de Privacidade e aplicação da LGPD no município de Lajes Pintadas – RN.",
};

export default function LGPDPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Lei Geral de Proteção de Dados"
                subtitle="Diretrizes de proteção da privacidade e tratamento de dados pessoais (Lei 13.709/2018)"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "LGPD" }
                ]}
            />
            
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100 mb-16">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei 13.709/2018", "Termos de Uso", "Segurança da Informação"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pb-24">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white">
                    <div className="prose prose-blue max-w-none text-gray-600">
                         <h2 className="text-3xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Política de Privacidade Municipal</h2>
                         <p className="lead text-xl text-gray-500 font-medium mb-12">
                             A Prefeitura de Lajes Pintadas tem o compromisso de proteger a privacidade dos cidadãos e garantir a transparência no tratamento de dados pessoais, conforme exigido pela Lei Geral de Proteção de Dados Pessoais (LGPD).
                         </p>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                             <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                 <FaUserShield className="text-4xl text-blue-500 mb-6" />
                                 <h3 className="text-lg font-black text-gray-800 mb-3 uppercase">Direitos do Titular</h3>
                                 <p className="text-sm font-medium">Você tem o direito de acessar, corrigir, apagar ou solicitar a portabilidade dos seus dados coletados pelos órgãos municipais.</p>
                             </div>
                             <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                 <FaServer className="text-4xl text-blue-500 mb-6" />
                                 <h3 className="text-lg font-black text-gray-800 mb-3 uppercase">Segurança de Dados</h3>
                                 <p className="text-sm font-medium">Utilizamos protocolos de criptografia e acesso restrito para impedir o vazamento ou tratamento inadequado dos dados armazenados na prefeitura.</p>
                             </div>
                         </div>

                         <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase">Encarregado de Proteção de Dados (DPO)</h3>
                         <p className="mb-6 font-medium">
                            O município designou um Encarregado de Dados que atua como canal de comunicação entre a prefeitura, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD).
                         </p>
                         
                         <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-12 flex items-center gap-6">
                            <FaBalanceScale className="text-3xl text-blue-500 shrink-0" />
                            <div>
                                <p className="text-sm font-black text-blue-800 uppercase tracking-widest mb-1">Contato do DPO</p>
                                <p className="text-gray-600 font-medium">Para esclarecimentos ou exercer seus direitos de titular de dados, fale conosco exclusivamente pelo e-SIC ou setor de Protocolo Geral.</p>
                            </div>
                         </div>

                         <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase">Para que usamos seus dados?</h3>
                         <ul className="list-disc pl-6 space-y-3 font-medium">
                             <li>Viabilizar a prestação de serviços públicos essenciais (Saúde, Educação, Assistência Social).</li>
                             <li>Atendimento a solicitações feitas via e-SIC ou Ouvidoria.</li>
                             <li>Cumprimento de obrigações legais, fiscais e previdenciárias de servidores e prestadores de serviço.</li>
                             <li>Estatísticas anonimizadas para políticas públicas.</li>
                         </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
