import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Gestores Atuais | Prefeitura de Lajes Pintadas",
    description: "Conheça o Prefeito e Vice-Prefeito de Lajes Pintadas – RN e seus compromissos com o município.",
};

export default function PrefeitoPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Gestão Municipal"
                subtitle="Conheça os representantes eleitos para liderar o desenvolvimento de nossa cidade."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "A Prefeitura", href: "/a-prefeitura" },
                    { label: "Prefeito e Vice" }
                ]}
            />

            <div className="max-w-[1200px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Prefeito */}
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-blue-900/5 group border border-white">
                        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                            <Image
                                src="/images/prefeito.webp"
                                alt="Foto do Prefeito"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#01b0ef]/80 to-transparent flex flex-col justify-end p-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 bg-white text-[#01b0ef] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"><FaInstagram /></a>
                                    <a href="#" className="w-10 h-10 bg-white text-[#01b0ef] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"><FaFacebook /></a>
                                    <a href="#" className="w-10 h-10 bg-white text-[#01b0ef] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"><FaEnvelope /></a>
                                </div>
                            </div>
                        </div>
                        <div className="p-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#01b0ef] text-[10px] font-black uppercase tracking-widest mb-4">Atual Prefeito</span>
                            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-2">Luciano da Cunha</h2>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Gestor com longa trajetória no serviço público, focado em transparência, modernização da infraestrutura e humanização do atendimento em saúde.
                            </p>
                            <div className="pt-8 border-t border-gray-50">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Principais Bandeiras</h4>
                                <ul className="space-y-3">
                                    {["Saneamento Básico", "Educação em Tempo Integral", "Apoio ao Pequeno Produtor"].map(b => (
                                        <li key={b} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                            <span className="w-1.5 h-1.5 bg-[#50B749] rounded-full" /> {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Vice-Prefeito */}
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-blue-900/5 group border border-white">
                        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                            <Image
                                src="/images/vice-prefeito.webp"
                                alt="Foto do Vice-Prefeito"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="p-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#01b0ef] text-[10px] font-black uppercase tracking-widest mb-4">Vice-Prefeito</span>
                            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-2">João Maria Silva</h2>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Líder comunitário com foco no desenvolvimento rural e preservação ambiental das serras de Lajes Pintadas.
                            </p>
                            <div className="pt-8 border-t border-gray-50">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Coordenação Setorial</h4>
                                <ul className="space-y-3">
                                    {["Infraestrutura Rural", "Meio Ambiente", "Assuntos Comunitários"].map(b => (
                                        <li key={b} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                            <span className="w-1.5 h-1.5 bg-[#01b0ef] rounded-full" /> {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gabinete do Prefeito */}
                <div className="mt-20 p-12 bg-[#0088b9] rounded-[3rem] text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1">
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Gabinete do Prefeito</h3>
                            <p className="text-blue-100 font-medium max-w-xl">
                                O Gabinete é o canal direto de interlocução entre a população e os gestores. Estamos abertos para ouvir sugestões e demandas que ajudem a construir uma cidade melhor.
                            </p>
                        </div>
                        <div className="shrink-0 space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                <FaEnvelope className="text-[#01b0ef]" />
                                <span className="text-sm font-bold">gabinete@lajespintadas.rn.gov.br</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                <span className="text-sm font-bold">📞 (84) 0000-0000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
