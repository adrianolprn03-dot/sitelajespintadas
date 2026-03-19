import { prisma } from "@/lib/prisma";
import { FaBook } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import ExportButtons from "@/components/transparencia/ExportButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Glossário | Prefeitura de Lajes Pintadas",
    description: "Definições de termos técnicos e conceitos utilizados na administração pública municipal.",
};

export default async function GlossarioPage() {
    const termos = await prisma.glossario.findMany({
        orderBy: { termo: "asc" }
    });

    return (
        <div className="min-h-screen bg-white">
            <PageHeader
                title="Glossário de Termos"
                subtitle="Dicionário técnico para auxiliar na compreensão dos documentos e relatórios da administração pública."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Glossário" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 pt-16 flex flex-col md:flex-row justify-between items-center gap-6">
                <ExportButtons data={termos} filename="glossario_lajes_pintadas" />
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {termos.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 italic">Nenhum termo cadastrado no glossário.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {termos.map((t) => (
                            <div key={t.id} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-[#01b0ef] transition-all hover:shadow-xl hover:shadow-blue-900/5 group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#01b0ef] shadow-sm mb-4 group-hover:bg-[#01b0ef] group-hover:text-white transition-all">
                                    <FaBook size={14} />
                                </div>
                                <h3 className="font-black text-[#0088b9] uppercase tracking-widest text-[11px] mb-3 group-hover:text-[#01b0ef] transition-colors">{t.termo}</h3>
                                <div className="h-px w-8 bg-gray-200 mb-4 group-hover:w-16 transition-all" />
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {t.definicao}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-20 border-t border-gray-100 pt-12 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">Compromisso com a Transparência</p>
                    <div className="flex justify-center gap-8">
                        {["Acessibilidade", "Clareza", "Integridade"].map(tag => (
                            <span key={tag} className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-200 rounded-full" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
