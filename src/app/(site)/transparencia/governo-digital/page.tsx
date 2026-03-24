import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Governo Digital | Prefeitura de Lajes Pintadas – RN",
    description: "Plano e iniciativas de Governo Digital no Município.",
};

export default function GovernoDigitalPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Governo Digital"
                subtitle="Iniciativas de Transformação Digital no Transporte e Acesso a Serviços Públicos"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Governo Digital" }
                ]}
            />
            
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100 mb-16">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei 14.129/2021", "Estratégia Digital", "PNTP 2025"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pb-24">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white">
                     <h2 className="text-3xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Diretrizes de Governo Digital</h2>
                     <p className="text-xl text-gray-500 font-medium mb-12">
                         O Município de Lajes Pintadas adota os princípios da nova Lei do Governo Digital para desburocratizar o acesso a serviços, otimizar custos e oferecer mais transparência e agilidade ao cidadão.
                     </p>

                     <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase">Pilares de Inovação</h3>
                     <ul className="list-disc pl-6 space-y-4 font-medium text-gray-600 mb-12">
                         <li><strong>Serviços Online:</strong> Digitalização contínua de requerimentos (IPTU, Alvarás, Protocolo).</li>
                         <li><strong>Portal da Transparência Interativo:</strong> Atualização constante para integração visual clara (conformidade PNTP).</li>
                         <li><strong>Uso de APIs:</strong> Padronização do compartilhamento seguro de informações entre setores.</li>
                         <li><strong>Participação Cidadã:</strong> Plataformas como a Ouvidoria e o e-SIC 100% integradas.</li>
                     </ul>

                     <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 text-center text-gray-600 font-medium italic">
                         "A transformação digital nas administrações municipais exige não só a inclusão de tecnologias, mas a reengenharia dos processos internos e do contato com o Cidadão."
                     </div>
                </div>
            </div>
        </div>
    );
}
